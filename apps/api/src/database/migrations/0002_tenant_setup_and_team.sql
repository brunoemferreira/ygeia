-- ============================================================================
-- YGEÍA (Υγεία) — Migração 0002: Configuração da Empresa, Nutricionista & Equipe
-- FASE 2: Perfil Cadastral, Perfil Profissional (CRN), White Label Studio & RBAC
-- ============================================================================

-- 1. Tabela tenant_settings (Dados Cadastrais e Fiscais da Clínica)
CREATE TABLE IF NOT EXISTS tenant_settings (
    tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    legal_name VARCHAR(255),
    trade_name VARCHAR(255),
    tax_id VARCHAR(32), -- CNPJ ou CPF
    phone VARCHAR(32),
    whatsapp VARCHAR(32),
    email VARCHAR(255),
    address_street VARCHAR(255),
    address_number VARCHAR(32),
    address_complement VARCHAR(128),
    address_neighborhood VARCHAR(128),
    address_city VARCHAR(128),
    address_state VARCHAR(2),
    address_zip_code VARCHAR(16),
    terms_of_service TEXT,
    privacy_policy TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabela nutritionist_profiles (Perfil Profissional, CRN e Especialidades)
CREATE TABLE IF NOT EXISTS nutritionist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    professional_name VARCHAR(255),
    crn_number VARCHAR(32) NOT NULL, -- Ex: "CRN-3 48.912/P" (Res. CFN 600/2018)
    crn_region VARCHAR(16) NOT NULL, -- Ex: "CRN-3"
    specialties TEXT[] DEFAULT '{}',
    bio TEXT,
    avatar_url VARCHAR(512),
    signature_stamp_url VARCHAR(512), -- Imagem do carimbo / assinatura digital
    is_technical_manager BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_nutritionist_user UNIQUE (tenant_id, user_id)
);

-- 3. Evolução da tabela tenant_branding
ALTER TABLE tenant_branding 
    ADD COLUMN IF NOT EXISTS dark_logo_url VARCHAR(512),
    ADD COLUMN IF NOT EXISTS accent_color VARCHAR(16) DEFAULT '#8b5cf6',
    ADD COLUMN IF NOT EXISTS letterhead_template_url VARCHAR(512);

-- 4. Tabela team_invitations (Convites de Equipe e RBAC)
CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'NUTRITIONIST',
    token_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- Habilitação e Imposição de Row-Level Security (RLS)
-- ============================================================================

ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_settings FORCE ROW LEVEL SECURITY;

ALTER TABLE nutritionist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritionist_profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations FORCE ROW LEVEL SECURITY;

-- Políticas de Isolamento RLS
DROP POLICY IF EXISTS tenant_settings_isolation_policy ON tenant_settings;
CREATE POLICY tenant_settings_isolation_policy ON tenant_settings
    AS PERMISSIVE FOR ALL
    TO ygeia_app
    USING (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
        OR current_setting('app.bypass_rls', true) = 'true'
    )
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
        OR current_setting('app.bypass_rls', true) = 'true'
    );

DROP POLICY IF EXISTS nutritionist_profiles_isolation_policy ON nutritionist_profiles;
CREATE POLICY nutritionist_profiles_isolation_policy ON nutritionist_profiles
    AS PERMISSIVE FOR ALL
    TO ygeia_app
    USING (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
        OR current_setting('app.bypass_rls', true) = 'true'
    )
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
        OR current_setting('app.bypass_rls', true) = 'true'
    );

DROP POLICY IF EXISTS team_invitations_isolation_policy ON team_invitations;
CREATE POLICY team_invitations_isolation_policy ON team_invitations
    AS PERMISSIVE FOR ALL
    TO ygeia_app
    USING (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
        OR current_setting('app.bypass_rls', true) = 'true'
    )
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
        OR current_setting('app.bypass_rls', true) = 'true'
    );

-- Permissões para o usuário de aplicação
GRANT SELECT, INSERT, UPDATE, DELETE ON tenant_settings TO ygeia_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON nutritionist_profiles TO ygeia_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON team_invitations TO ygeia_app;

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_nutritionist_profiles_tenant ON nutritionist_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_tenant ON team_invitations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token_hash);
