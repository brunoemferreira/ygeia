import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import fs from 'fs';
import path from 'path';
import { TenantContextService } from '../common/context/tenant-context.service';
import { PasswordHasherService } from '../common/security/password-hasher.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool!: Pool;

  constructor(
    @Inject(TenantContextService) private readonly tenantContext: TenantContextService,
    @Inject(PasswordHasherService) private readonly passwordHasher: PasswordHasherService,
  ) {}

  async onModuleInit() {
    const connectionString =
      process.env.DATABASE_URL || 'postgresql://ygeia_user:ygeia_password@localhost:5440/ygeia_db';

    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      statement_timeout: 10000, // 10s statement timeout para prevenção de queries travadas
    });

    try {
      const client = await this.pool.connect();
      this.logger.log('Conexão com PostgreSQL 16 estabelecida com sucesso.');
      client.release();

      await this.runMigrations();
    } catch (error) {
      this.logger.warn('PostgreSQL ainda não está acessível na porta 5440. A API continuará em execução no modo de desenvolvimento.');
      if (process.env.NODE_ENV === 'production') {
        this.logger.error('Falha ao conectar ao PostgreSQL:', error);
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('Pool do PostgreSQL desconectado.');
    }
  }

  private async runMigrations(): Promise<void> {
    const migrationsDir = path.resolve(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      this.logger.warn(`Diretório de migrations não encontrado: ${migrationsDir}`);
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    const migrationUrl =
      process.env.DATABASE_MIGRATION_URL ||
      'postgresql://ygeia_user:ygeia_password@localhost:5440/ygeia_db';

    const migrationPool = new Pool({ connectionString: migrationUrl });
    const client = await migrationPool.connect();

    try {
      await client.query("SET app.bypass_rls = 'true'");

      // Governança de Migrações: Garante a existência da tabela schema_migrations
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version VARCHAR(64) PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      const appliedRes = await client.query<{ version: string }>(
        'SELECT version FROM schema_migrations'
      );
      const appliedSet = new Set(appliedRes.rows.map((r) => r.version));

      for (const file of migrationFiles) {
        if (appliedSet.has(file)) {
          continue; // Já executada anteriormente
        }

        const fullPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(fullPath, 'utf8');

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO schema_migrations (version, applied_at) VALUES ($1, NOW())',
            [file]
          );
          await client.query('COMMIT');
          this.logger.log(`Migration executada com sucesso: ${file}`);
        } catch (mErr) {
          await client.query('ROLLBACK');
          this.logger.error(`Erro ao executar migration ${file}:`, mErr);
          throw mErr;
        }
      }
    } catch (err) {
      this.logger.error('Erro ao executar migrations:', err);
      throw err;
    } finally {
      client.release();
      await migrationPool.end();
    }
  }

  /**
   * Executa uma consulta SQL configurando automaticamente o contexto de tenant no PostgreSQL
   * para ativar as políticas de Row-Level Security (RLS).
   */
  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
    bypassRls = false,
  ): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      if (bypassRls) {
        await client.query("SET app.bypass_rls = 'true'");
      } else {
        await client.query("SET app.bypass_rls = 'false'");
        const tenantId = this.tenantContext.getTenantId();
        if (tenantId) {
          await client.query(`SET app.current_tenant_id = '${tenantId}'`);
        } else {
          await client.query("SET app.current_tenant_id = ''");
        }
      }
      return await client.query<T>(text, params);
    } finally {
      // Reseta estado para evitar contaminação do pool
      try {
        await client.query("DISCARD TEMP; SET app.bypass_rls = 'false'; SET app.current_tenant_id = '';");
      } catch {}
      client.release();
    }
  }

  /**
   * Executa uma transação atômica associada ao tenant atual.
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>, bypassRls = false): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      if (bypassRls) {
        await client.query("SET LOCAL app.bypass_rls = 'true'");
      } else {
        await client.query("SET LOCAL app.bypass_rls = 'false'");
        const tenantId = this.tenantContext.getTenantId();
        if (tenantId) {
          await client.query(`SET LOCAL app.current_tenant_id = '${tenantId}'`);
        } else {
          await client.query("SET LOCAL app.current_tenant_id = ''");
        }
      }

      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Executa um ping de diagnóstico rápido para health checks e readiness probes.
   * Retorna a latência da consulta em milissegundos.
   */
  async ping(): Promise<{ healthy: boolean; latencyMs: number }> {
    if (!this.pool) {
      return { healthy: false, latencyMs: -1 };
    }
    const start = Date.now();
    try {
      const client = await this.pool.connect();
      try {
        await client.query('SELECT 1');
        return { healthy: true, latencyMs: Date.now() - start };
      } finally {
        client.release();
      }
    } catch {
      return { healthy: false, latencyMs: Date.now() - start };
    }
  }
}
