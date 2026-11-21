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
      await this.seedDefaultData();
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

  private async seedDefaultData(): Promise<void> {
    try {
      const existingTenant = await this.query(
        "SELECT id FROM tenants WHERE slug = 'demo-clinica' LIMIT 1",
        [],
        true,
      );

      let tenantId: string;
      if (existingTenant.rows.length === 0) {
        this.logger.log('Criando tenant e usuário padrão para demonstração...');
        const tenantRes = await this.query(
          `INSERT INTO tenants (name, slug, plan, is_active)
           VALUES ('Ygeía Clínica Modelo', 'demo-clinica', 'ENTERPRISE', true)
           RETURNING id`,
          [],
          true,
        );
        tenantId = tenantRes.rows[0].id;

        // Branding
        await this.query(
          `INSERT INTO tenant_branding (tenant_id, primary_color, secondary_color, accent_color, font_family)
           VALUES ($1, '#059669', '#064e3b', '#8b5cf6', 'Plus Jakarta Sans')
           ON CONFLICT (tenant_id) DO UPDATE SET 
             primary_color = EXCLUDED.primary_color,
             secondary_color = EXCLUDED.secondary_color,
             accent_color = EXCLUDED.accent_color`,
          [tenantId],
          true,
        );
      } else {
        tenantId = existingTenant.rows[0].id;
      }

      // Check User
      const existingUser = await this.query(
        "SELECT id FROM users WHERE tenant_id = $1 AND email = 'admin@ygeia.com' LIMIT 1",
        [tenantId],
        true,
      );

      let userId: string;
      if (existingUser.rows.length === 0) {
        const passwordHash = await this.passwordHasher.hash('senha123456');
        const userRes = await this.query(
          `INSERT INTO users (tenant_id, email, password_hash, full_name, role, is_active)
           VALUES ($1, 'admin@ygeia.com', $2, 'Dra. Sofia Alencar', 'CLINIC_OWNER', true)
           RETURNING id`,
          [tenantId, passwordHash],
          true,
        );
        userId = userRes.rows[0].id;
      } else {
        userId = existingUser.rows[0].id;
      }

      // Check Patient User (Demo Paciente)
      const existingPatient = await this.query(
        "SELECT id FROM users WHERE tenant_id = $1 AND email = 'paciente@ygeia.com' LIMIT 1",
        [tenantId],
        true,
      );
      if (existingPatient.rows.length === 0) {
        const passwordHash = await this.passwordHasher.hash('senha123456');
        await this.query(
          `INSERT INTO users (tenant_id, email, password_hash, full_name, role, is_active)
           VALUES ($1, 'paciente@ygeia.com', $2, 'Gabriel Rodrigues', 'PATIENT', true)`,
          [tenantId, passwordHash],
          true,
        );
      }

      // Check Tenant Settings
      await this.query(
        `INSERT INTO tenant_settings (
           tenant_id, legal_name, trade_name, tax_id, phone, whatsapp, email,
           address_street, address_number, address_complement, address_neighborhood,
           address_city, address_state, address_zip_code
         )
         VALUES ($1, 'Ygeía Saúde & Nutrição Integrada Ltda', 'Instituto Vitalis & Ygeía',
                 '12.345.678/0001-90', '(11) 3214-5500', '(11) 98765-4321', 'contato@vitalisnutri.com.br',
                 'Av. Paulista', '1000', 'Cj 1402', 'Bela Vista', 'São Paulo', 'SP', '01310-100')
         ON CONFLICT (tenant_id) DO NOTHING`,
        [tenantId],
        true,
      );

      // Check Nutritionist Profile (CRN)
      await this.query(
        `INSERT INTO nutritionist_profiles (
           tenant_id, user_id, full_name, professional_name, crn_number, crn_region,
           specialties, bio, is_technical_manager
         )
         VALUES (
           $1, $2, 'Sofia Alencar', 'Dra. Sofia Alencar (CRN-3)', 'CRN-3 48.912/P', 'CRN-3',
           ARRAY['Nutrição Esportiva de Alto Rendimento', 'Emagrecimento Metabólico', 'Nutrigenômica Aplicada'],
           'Especialista em modulação metabólica e planejamento nutricional de precisão pelo Instituto HCFMUSP.',
           true
         )
         ON CONFLICT (tenant_id, user_id) DO NOTHING`,
        [tenantId, userId],
        true,
      );

      this.logger.log('Seed de demonstração verificado com sucesso (demo-clinica / admin@ygeia.com).');
    } catch (err) {
      this.logger.warn(`Erro no seeder de demonstração (não impeditivo): ${err}`);
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
