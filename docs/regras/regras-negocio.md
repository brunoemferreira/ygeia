# 🏢 Regras de Negócio, Prontuário & Compliance Nutricional — YGEÍA

Este documento consolida as regras de negócio centrais da plataforma **YGEÍA**, incluindo os requisitos regulatórios do Conselho Federal de Nutricionistas (CFN) e a Lei Geral de Proteção de Dados (LGPD).

---

## 1. Modelo de Negócio SaaS White Label Multi-Tenant

1. **Isolamento de Tenants**:
   - Cada clínica, consultório ou nutricionista individual constitui um `Tenant` único.
   - Todo dado (usuários, pacientes, prontuários, planos, alimentos personalizados) deve possuir obrigatoriamente um `tenant_id`.
   - Um tenant **nunca** tem visibilidade ou acesso aos dados de outro tenant sob nenhuma circunstância.
2. **Identidade Visual Personalizada (White Label)**:
   - Cada tenant configura: Logo oficial, Cores primária e secundária, Favicon e Tipografia.
   - A Web e o Mobile carregam a identidade visual do tenant dinamicamente via `GET /api/v1/tenants/branding` e aplicam em variáveis CSS `:root` ou tokens MMKV.
3. **Domínios Personalizados e Subdomínios**:
   - Suporte a subdomínios nativos (ex: `clinicasilva.ygeia.app`).
   - Suporte a domínios próprios (ex: `app.nutrisilva.com.br`) via CNAME e Cloudflare for SaaS.

---

## 2. Gestão de Pacientes e Prontuário Eletrônico

### 2.1 Cadastro de Pacientes
- O paciente é cadastrado por um profissional de saúde autorizado (`nutritionist_id`).
- Dados obrigatórios: Nome completo, data de nascimento, sexo biológico (necessário para fórmulas metabólicas) e pelo menos um canal de contato (e-mail ou telefone).
- O e-mail do paciente é único por clínica (tenant), permitindo que um mesmo paciente frequente clínicas distintas com contas independentes.

### 2.2 Prontuário Eletrônico e Anamnese Clínica Dinâmica
- **Resolução CFN nº 306/2003 e 600/2018**: O prontuário nutricional é um documento legal que deve ser guardado pelo prazo mínimo legal (20 anos) e mantido com integridade inalterável.
- **Campos Modulares da Anamnese**:
  - Objetivos clínicos e queixa principal.
  - Histórico patológico pregresso e familiar.
  - Alergias e intolerâncias alimentares severas (com alertas visuais destacados).
  - Uso contínuo de medicamentos e suplementação.
  - Estilo de vida: padrão de sono, nível de estresse, ingestão hídrica, hábitos intestinais (Escala de Bristol).
  - Campos dinâmicos: cada clínica pode estender perguntas personalizadas via esquema flexível JSONB.

### 2.3 Recordatório Alimentar de 24 Horas (R24h)
- Registro detalhado das refeições realizadas no dia anterior:
  - Horário e tipo de refeição (Desjejum, Colação, Almoço, Lanche da Tarde, Jantar, Ceia).
  - Alimentos consumidos, medidas caseiras e porções estimadas.
  - Estimativa calórica e de macronutrientes da ingestão real comparada à prescrição.

### 2.4 Exames e Laudos Laboratoriais
- Upload seguro de exames em formato PDF ou imagens (PNG/JPEG) com limite de tamanho (15 MB por arquivo).
- Armazenamento em bucket seguro com URLs pré-assinadas temporárias (validade de 15 minutos).

---

## 3. Conformidade LGPD (Lei 13.709/2018) para Dados de Saúde

1. **Dados Sensíveis (Art. 5º, II da LGPD)**:
   - Dados de saúde, biométricos e nutricionais são classificados como **dados sensíveis**.
   - O tratamento é fundamentado na tutela da saúde (Art. 7º, VIII e Art. 11, II, "f").
2. **Trilha de Auditoria Imutável (`audit_logs`)**:
   - **Toda e qualquer leitura (`READ`) ou mutação (`CREATE`, `UPDATE`, `DELETE`) em registros de pacientes, anamneses e exames deve ser registrada de forma auditável e indelével.**
   - O log deve registrar:
     - `tenant_id`: Identificador da clínica.
     - `actor_id`: ID do usuário que executou a ação.
     - `action`: Ação realizada (ex: `PATIENT_RECORD_VIEWED`, `ANAMNESIS_SAVED`).
     - `resource_name` e `resource_id`: Entidade afetada.
     - `ip_address`: Endereço IP do requisitante.
     - `created_at`: Data e hora exatas com timezone UTC.
3. **Direito de Acesso e Exportação**:
   - O paciente tem o direito de receber cópia integral de seu prontuário e de suas prescrições em formato legível e interoperável (PDF / JSON estruturado).
