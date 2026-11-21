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
      process.env.DATABASE_URL || 'postgresql://ygeia_user:ygeia_password@localhost:5434/ygeia_db';

    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    try {
      const client = await this.pool.connect();
      this.logger.log('Conexão com PostgreSQL 16 estabelecida com sucesso.');
      client.release();

      await this.runMigrations();
    } catch (error) {
      this.logger.error('Falha ao conectar ao PostgreSQL:', error);
      throw error;
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
      'postgresql://ygeia_user:ygeia_password@localhost:5434/ygeia_db';

    const migrationPool = new Pool({ connectionString: migrationUrl });
    const client = await migrationPool.connect();

    try {
      await client.query("SET app.bypass_rls = 'true'");
      for (const file of migrationFiles) {
        const fullPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(fullPath, 'utf8');
        await client.query(sql);
        this.logger.log(`Migration executada com sucesso: ${file}`);
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
}
