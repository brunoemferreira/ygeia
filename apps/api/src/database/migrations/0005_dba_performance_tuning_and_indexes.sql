-- ============================================================================
-- YGEÍA (Υγεία) — Migração 0005: Governança, Tunning de Performance & DBA Sênior
-- ============================================================================

-- 1. Habilitar extensões para busca textual rápida e indexação avançada
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. Tabela de Governança e Rastreamento de Migrações (schema_migrations)
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(64) PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checksum VARCHAR(64)
);

-- 3. Índices em Foreign Keys Ausentes (Prevenção de Locks e Sequential Scans em Joins)
-- FK tenant_domains.tenant_id -> tenants(id)
CREATE INDEX IF NOT EXISTS idx_tenant_domains_tenant_id 
  ON tenant_domains(tenant_id);

-- FK refresh_tokens.user_id -> users(id) e tenant_id -> tenants(id)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_tenant_user 
  ON refresh_tokens(tenant_id, user_id);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id 
  ON refresh_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_tenant_id 
  ON refresh_tokens(tenant_id);

-- FK team_invitations.invited_by -> users(id)
CREATE INDEX IF NOT EXISTS idx_team_invitations_invited_by 
  ON team_invitations(invited_by);

-- FK nutritionist_profiles.user_id -> users(id)
CREATE INDEX IF NOT EXISTS idx_nutritionist_profiles_user_id 
  ON nutritionist_profiles(user_id);

-- 4. Otimização de Índices e Ordenação para Pacientes (Tunning Multi-Tenant)
-- Aceleração de paginação cronológica com RLS
CREATE INDEX IF NOT EXISTS idx_patients_tenant_created 
  ON patients(tenant_id, created_at DESC);

-- Aceleração de filtragem de status com RLS
CREATE INDEX IF NOT EXISTS idx_patients_tenant_status 
  ON patients(tenant_id, status);

-- Índice Trigram GIN para busca instantânea de pacientes por nome (LOWER/ILIKE '%search%')
CREATE INDEX IF NOT EXISTS idx_patients_trgm_name 
  ON patients USING gin (full_name gin_trgm_ops);

-- Índice Trigram GIN para busca de pacientes por e-mail
CREATE INDEX IF NOT EXISTS idx_patients_trgm_email 
  ON patients USING gin (email gin_trgm_ops);

-- 5. Constraints de Integridade e Validação
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_patients_status'
  ) THEN
    ALTER TABLE patients 
      ADD CONSTRAINT chk_patients_status 
      CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED'));
  END IF;
END $$;
