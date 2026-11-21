-- Habilita extensão para UUID se necessário
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criação da Role da Aplicação (Sem privilégios de Superuser / Bypass RLS)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ygeia_app') THEN
    CREATE ROLE ygeia_app WITH LOGIN PASSWORD 'ygeia_password';
  END IF;
END $$;

GRANT CONNECT ON DATABASE ygeia_db TO ygeia_app;
GRANT USAGE ON SCHEMA public TO ygeia_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ygeia_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ygeia_app;

-- Tabela de Tenants (Clínicas e Nutricionistas contratantes)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(32) NOT NULL DEFAULT 'STARTER',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de Domínios Customizados do Tenant (White Label)
CREATE TABLE IF NOT EXISTS tenant_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  domain VARCHAR(255) UNIQUE NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de Identidade Visual (White Label Branding)
CREATE TABLE IF NOT EXISTS tenant_branding (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  primary_color VARCHAR(16) NOT NULL DEFAULT '#059669',
  secondary_color VARCHAR(16) NOT NULL DEFAULT '#064e3b',
  logo_url TEXT,
  favicon_url TEXT,
  font_family VARCHAR(64) NOT NULL DEFAULT 'Inter',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de Usuários (RBAC Multi-Tenant)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'NUTRITIONIST',
  two_factor_secret TEXT,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT users_tenant_email_key UNIQUE (tenant_id, email)
);

-- Tabela de Refresh Tokens com Rotação Automática
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  family_id UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de Trilha de Auditoria (Audit Log LGPD & CFN)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(64) NOT NULL,
  resource VARCHAR(64) NOT NULL,
  resource_id VARCHAR(64),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenant_domains_domain ON tenant_domains(domain);
CREATE INDEX IF NOT EXISTS idx_users_tenant_email ON users(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at);

-- ========================================================
-- POLÍTICAS DE ROW-LEVEL SECURITY (RLS) NO POSTGRESQL
-- ========================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_users ON users;
CREATE POLICY tenant_isolation_users ON users
  AS PERMISSIVE
  FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR NULLIF(current_setting('app.bypass_rls', true), '') = 'true'
  );

ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_refresh_tokens ON refresh_tokens;
CREATE POLICY tenant_isolation_refresh_tokens ON refresh_tokens
  AS PERMISSIVE
  FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR NULLIF(current_setting('app.bypass_rls', true), '') = 'true'
  );

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_audit_logs ON audit_logs;
CREATE POLICY tenant_isolation_audit_logs ON audit_logs
  AS PERMISSIVE
  FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR NULLIF(current_setting('app.bypass_rls', true), '') = 'true'
  );

GRANT ALL ON ALL TABLES IN SCHEMA public TO ygeia_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO ygeia_app;
