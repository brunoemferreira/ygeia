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

## 2. Onboarding da Empresa, Perfil do Nutricionista (CRN), White Label Studio & Equipe (RBAC)

No modelo de negócio SaaS do YGEÍA, **é pré-requisito mandatório que a empresa/clínica e seus profissionais estejam devidamente configurados antes do cadastro de pacientes e do início dos atendimentos clínicos**:

### 2.1 Dados Cadastrais da Empresa / Clínica (`tenant_settings`)
- **Dados Jurídicos/Fiscais**: Razão Social, Nome Fantasia, CNPJ (ou CPF para consultórios uniprofissionais autônomos).
- **Contatos Oficiais**: E-mail comercial, telefone fixo e WhatsApp de atendimento (usado para confirmações automáticas de consultas).
- **Endereço Completo**: Logradouro, número, complemento, bairro, cidade, UF e CEP. Estes dados são obrigatoriamente estampados no rodapé de laudos, prescrições e recibos.
- **Políticas e Termos**: Termos de Uso e Política de Privacidade padrão da clínica, vinculados ao aceite do paciente.

### 2.2 Perfil Profissional do Nutricionista & Validação CFN (`nutritionist_profiles`)
- **Obrigatoriedade Legal (Resolução CFN nº 600/2018)**:
  - Todo profissional que prescreve dietas ou assina laudos deve possuir registro ativo no Conselho Regional de Nutricionistas (**CRN** com sigla da região, ex: `CRN-3 45678/P`).
  - O número de CRN é impresso compulsoriamente em todos os planos alimentares e atestados gerados.
- **Especialidades e Mini-bio**:
  - Especialidades reconhecidas (ex: Nutrição Clínica, Esportiva, Funcional, Materno-Infantil).
  - Mini-currículo visível para os pacientes no aplicativo móvel.
- **Assinatura Digital & Carimbo**:
  - Upload seguro de imagem da assinatura/carimbo para aposição automática nos documentos emitidos em PDF.

### 2.3 White Label Studio (Identidade Visual da Clínica)
- **Logotipos Oficiais**:
  - Versão Principal Clara (para fundos escuros) e Versão Escura (para fundos claros) em formato SVG ou PNG com transparência.
  - Ícone / Favicon (quadrado mínimo 512x512) para PWA e ícone do app mobile.
- **Paleta de Cores e Acessibilidade**:
  - Cor Primária (`--primary`): Botões de ação, cabeçalhos e elementos focais.
  - Cor Secundária (`--secondary`): Sub-menus, tags e cartões secundários.
  - Cor de Destaque (`--accent`): Badges e notificações.
  - **Validação WCAG 2.2 AA**: O sistema valida automaticamente a taxa de contraste (mínimo de 4.5:1 contra o fundo branco) para garantir acessibilidade e legibilidade.
- **Papel Timbrado**:
  - Configuração do cabeçalho e rodapé oficial para renderização dos planos alimentares em PDF.

### 2.4 Gestão de Equipe & Controle de Acesso Baseado em Papéis (RBAC)
Para proteger os dados de saúde e cumprir o sigilo ético-profissional, o sistema adota 4 papéis com permissões granulares:

| Papel (`Role`) | Descrição | Acesso Cadastral / Agenda | Acesso a Prontuário, Anamnese e Dietas | Configurações & Faturamento |
| :--- | :--- | :---: | :---: | :---: |
| **`OWNER`** | Proprietário da clínica | Total | Total (todos os pacientes) | Total |
| **`ADMIN`** | Gerente operacional | Total | Somente leitura de relatórios gerais | Gerencia equipe e branding |
| **`NUTRITIONIST`** | Nutricionista clínico | Total | Total (apenas seus pacientes) | Apenas seu perfil e agenda |
| **`SECRETARY`** | Recepção / Secretária | Total (cadastros e horários) | **❌ BLOQUEADO ABSOLUTO (Sigilo CFN / LGPD)** | Bloqueado |

> [!IMPORTANT]
> **Sigilo Profissional e LGPD**: Secretárias e recepcionistas **não têm acesso** a dados clínicos, queixas, diagnósticos, anamneses, fotos corporais ou planos alimentares. Seu escopo restringe-se estritamente à gestão de agendamentos e cadastro básico de contato.

---

## 3. Gestão de Pacientes e Prontuário Eletrônico

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

### 3.4 Exames e Laudos Laboratoriais
- Upload seguro de exames em formato PDF ou imagens (PNG/JPEG) com limite de tamanho (15 MB por arquivo).
- Armazenamento em bucket seguro com URLs pré-assinadas temporárias (validade de 15 minutos).

---

## 4. Conformidade LGPD (Lei 13.709/2018) para Dados de Saúde

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

---

## 5. Regra de Governança de Menus & Licenciamento Modular SaaS

A navegação e a disponibilidade de recursos no painel administrativo do profissional obedecem rigorosamente à regra de **licenciamento modular por assinatura**:

### 5.1 Regra dos Módulos Universais (Sempre Habilitados)
1. **Módulo `Cadastros`**:
   - **Status**: **SEMPRE HABILITADO** para qualquer tenant ou plano.
   - **Escopo**: É a base unificada de dados do SaaS. Contém Pacientes/Alunos (CRM), Agenda & Agendamentos, Avaliação Física / Antropometria e Cofre de Exames & Laudos.
   - **Regra**: Todo paciente é cadastrado aqui uma única vez, alimentando tanto a Nutrição quanto o Treinamento.
2. **Módulo `Configurações`**:
   - **Status**: **SEMPRE HABILITADO** para qualquer tenant ou plano.
   - **Escopo**: Governança da clínica. Contém White Label Studio, Dados Cadastrais/Fiscais da Empresa, Registros Profissionais (CRN e/ou CREF), Equipe & RBAC e Gestão de Licenças/Planos.

### 5.2 Regra dos Módulos Especializados (Condicionados à Licença)
1. **Módulo `Nutrição`**:
   - **Status**: Habilitado **somente** se o plano do tenant contiver a licença `MODULE_NUTRITION` (ou pacote integrado `FULL_PERFORMANCE`).
   - **Escopo Exclusivo**: Prescritor Nutricional, Tabela TACO / Banco de Alimentos, Metas Calóricas & VET, Biblioteca de Receitas e Suplementação/Fitoterapia.
2. **Módulo `Treinamento`**:
   - **Status**: Habilitado **somente** se o plano do tenant contiver a licença `MODULE_TRAINING` (ou pacote integrado `FULL_PERFORMANCE`).
   - **Escopo Exclusivo**: Prescritor de Treinos (musculação/funcional), Banco de Exercícios em Vídeo, Periodização de Carga / 1RM e Cardio/Zonas de FC.

### 5.3 Matriz de Visibilidade de Licenças
| Módulos Ativos na Licença | Cadastros | Configurações | Nutrição | Treinamento |
| :--- | :---: | :---: | :---: | :---: |
| **Apenas Nutrição** (`MODULE_NUTRITION`) | ✅ Ativo | ✅ Ativo | ✅ Totalmente Desbloqueado | 🔒 Oculto ou Badge "Upgrade" |
| **Apenas Treino** (`MODULE_TRAINING`) | ✅ Ativo | ✅ Ativo | 🔒 Oculto ou Badge "Upgrade" | ✅ Totalmente Desbloqueado |
| **Combo Completo** (`FULL_PERFORMANCE`) | ✅ Ativo | ✅ Ativo | ✅ Totalmente Desbloqueado | ✅ Totalmente Desbloqueado |

> [!IMPORTANT]
> **Vigilância Estrita de Escopo**: Sob nenhuma hipótese funcionalidades de prescrição de treino devem ser inseridas no menu de Nutrição, nem tabelas de alimentos no menu de Treinamento. O que for transversal a ambos (como peso, altura, percentual de gordura e bioimpedância) reside obrigatoriamente no **Módulo Cadastros**.
