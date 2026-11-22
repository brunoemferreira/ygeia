-- ========================================================
-- MIGRATION 0006: MÓDULOS CLÍNICOS E PRONTUÁRIO COM ISOLAMENTO MULTI-TENANT (RLS)
-- Tabelas: patient_anamneses, patient_recalls, patient_medical_records, patient_restrictions
-- Padrão DBA Sênior: Indexação estrita de Foreign Keys e RLS Leading Columns
-- ========================================================

-- 1. TABELA DE ANAMNESES CLÍNICAS
CREATE TABLE IF NOT EXISTS patient_anamneses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  template_type VARCHAR(64) NOT NULL DEFAULT 'Seções padrão',
  record_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  content_html TEXT,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices de Foreign Key e RLS Leading Column para patient_anamneses
CREATE INDEX IF NOT EXISTS idx_anamneses_patient_id ON patient_anamneses(patient_id);
CREATE INDEX IF NOT EXISTS idx_anamneses_tenant_id ON patient_anamneses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_anamneses_tenant_patient_date ON patient_anamneses(tenant_id, patient_id, record_date DESC);

-- 2. TABELA DE RECORDATÓRIOS ALIMENTARES (24h, QFA, Habitual)
CREATE TABLE IF NOT EXISTS patient_recalls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  template_type VARCHAR(64) NOT NULL DEFAULT 'Recordatório 24 Horas',
  record_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices de Foreign Key e RLS Leading Column para patient_recalls
CREATE INDEX IF NOT EXISTS idx_recalls_patient_id ON patient_recalls(patient_id);
CREATE INDEX IF NOT EXISTS idx_recalls_tenant_id ON patient_recalls(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recalls_tenant_patient_date ON patient_recalls(tenant_id, patient_id, record_date DESC);

-- 3. TABELA DE PRONTUÁRIO & EVOLUÇÃO CLÍNICA
CREATE TABLE IF NOT EXISTS patient_medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  template_type VARCHAR(64) NOT NULL DEFAULT 'Evolução Clínica',
  record_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices de Foreign Key e RLS Leading Column para patient_medical_records
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON patient_medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_tenant_id ON patient_medical_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_tenant_patient_date ON patient_medical_records(tenant_id, patient_id, record_date DESC);

-- 4. TABELA DE RESTRIÇÕES ALIMENTARES (Alergias, Intolerâncias, Recusas)
CREATE TABLE IF NOT EXISTS patient_restrictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  food_or_substance VARCHAR(255) NOT NULL,
  reason VARCHAR(64) NOT NULL DEFAULT 'Alergia',
  status VARCHAR(32) NOT NULL DEFAULT 'Ativa',
  origin VARCHAR(255),
  observation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices de Foreign Key e RLS Leading Column para patient_restrictions
CREATE INDEX IF NOT EXISTS idx_restrictions_patient_id ON patient_restrictions(patient_id);
CREATE INDEX IF NOT EXISTS idx_restrictions_tenant_id ON patient_restrictions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_restrictions_tenant_patient_status ON patient_restrictions(tenant_id, patient_id, status);
CREATE INDEX IF NOT EXISTS idx_restrictions_tenant_patient_created ON patient_restrictions(tenant_id, patient_id, created_at DESC);

-- ========================================================
-- ROW-LEVEL SECURITY (RLS) NO KERNEL POSTGRESQL
-- ========================================================

-- RLS: patient_anamneses
ALTER TABLE patient_anamneses ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_anamneses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_patient_anamneses ON patient_anamneses;
CREATE POLICY tenant_isolation_patient_anamneses ON patient_anamneses
  AS PERMISSIVE FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR NULLIF(current_setting('app.bypass_rls', true), '') = 'true'
  );

-- RLS: patient_recalls
ALTER TABLE patient_recalls ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_recalls FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_patient_recalls ON patient_recalls;
CREATE POLICY tenant_isolation_patient_recalls ON patient_recalls
  AS PERMISSIVE FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR NULLIF(current_setting('app.bypass_rls', true), '') = 'true'
  );

-- RLS: patient_medical_records
ALTER TABLE patient_medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_patient_medical_records ON patient_medical_records;
CREATE POLICY tenant_isolation_patient_medical_records ON patient_medical_records
  AS PERMISSIVE FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR NULLIF(current_setting('app.bypass_rls', true), '') = 'true'
  );

-- RLS: patient_restrictions
ALTER TABLE patient_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_restrictions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_patient_restrictions ON patient_restrictions;
CREATE POLICY tenant_isolation_patient_restrictions ON patient_restrictions
  AS PERMISSIVE FOR ALL
  USING (
    tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid
    OR NULLIF(current_setting('app.bypass_rls', true), '') = 'true'
  );

-- Garantir privilégios para a role operacional ygeia_app
GRANT ALL ON ALL TABLES IN SCHEMA public TO ygeia_app;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO ygeia_app;
