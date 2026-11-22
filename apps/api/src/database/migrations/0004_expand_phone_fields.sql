-- ========================================================
-- MIGRATION 0004: EXPANDIR TAMANHO DOS CAMPOS DE TELEFONE INTERNACIONAL
-- ========================================================

-- Garantir que todas as colunas de telefone e whatsapp comportem números internacionais completos
-- formatados com DDI, DDD e máscara local (ex: +55 (19) 99929-2205, +1 (555) 000-0000, etc.)
ALTER TABLE tenant_settings ALTER COLUMN phone TYPE VARCHAR(64);
ALTER TABLE tenant_settings ALTER COLUMN whatsapp TYPE VARCHAR(64);
ALTER TABLE patients ALTER COLUMN phone TYPE VARCHAR(64);
