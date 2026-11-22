-- ========================================================
-- MIGRATION 0003: TABELA DE PACIENTES E ISOLAMENTO MULTI-TENANT (RLS)
-- ========================================================

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  birth_date DATE,
  biological_sex VARCHAR(32) NOT NULL DEFAULT 'FEMALE', -- Sexo de referência para cálculos
  assigned_sex_at_birth VARCHAR(32), -- Sexo atribuído ao nascimento
  gender_identity VARCHAR(64), -- Identidade de gênero
  email VARCHAR(255),
  phone VARCHAR(64),
  cpf VARCHAR(32),
  guardian_name VARCHAR(255),
  guardian_cpf VARCHAR(32),
  welcome_email BOOLEAN NOT NULL DEFAULT true,
  welcome_whatsapp BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  photo_url TEXT,
  treatment_goals TEXT,
  insurance_plan VARCHAR(128),
  location_name VARCHAR(128),
  full_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices de busca e ordenação
CREATE INDEX IF NOT EXISTS idx_patients_tenant_name ON patients(tenant_id, full_name);
CREATE INDEX IF NOT EXISTS idx_patients_tenant_email ON patients(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_patients_tenant_cpf ON patients(tenant_id, cpf);

-- ========================================================
-- ROW-LEVEL SECURITY (RLS) - ISOLAMENTO ESTRITO POR TENANT
-- ========================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_patients ON patients;
CREATE POLICY tenant_isolation_patients ON patients
  AS PERMISSIVE
  FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR NULLIF(current_setting('app.bypass_rls', true), '') = 'true'
  );

GRANT ALL ON TABLE patients TO ygeia_app;
