# Changelog Consolidado — YGEÍA (Υγεία)

Todas as mudanças notáveis deste projeto em todas as suas aplicações e pacotes estão consolidadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Unreleased] - 2026-11-22

### 🩹 Correções de UI/UX Clínico & Front-End (`apps/web`)
- **Dinamização do Botão de Adição no `ClinicalDataGrid`**:
  - Eliminação do rótulo estático `"Adicionar anamnese"` que era exibido erroneamente em outras seções do prontuário do paciente.
  - O botão agora reflete dinamicamente a área selecionada pelo nutricionista:
    - **"Adicionar anamnese"** na aba de Anamnese;
    - **"Adicionar recordatório"** na aba de Recordatório Alimentar;
    - **"Adicionar evolução"** na aba de Prontuário / Linha do Tempo.
  - Normalização dos rótulos de exclusão e impressão de relatórios em PDF.

### 📱 Conclusão da Fase 4: Ativação do Aplicativo Mobile React Native (`apps/mobile`)
- **Correção da Resolução de Bundling Android no PNPM Monorepo**:
  - Implementação do entry point nativo explícito `index.js` substituindo o symlink incompatível `expo/AppEntry.js`.
  - Configuração do `metro.config.js` com `watchFolders`, `extraNodeModules` e `disableHierarchicalLookup: false` para mapeamento correto do Babel Runtime e pacotes internos do monorepo, validando o bundling Android com sucesso (667 módulos compilados com HTTP 200).
- **Suporte Nativo a Expo Web & Resolução de Erro 500 no Browser**:
  - Instalação e configuração de `@expo/metro-runtime` e `react-native-web`, permitindo renderização imediata do app do paciente diretamente pelo Google Chrome / navegador em `http://localhost:8095` sem necessidade de emuladores pesados.
- **Portal Completo do Paciente e Atleta em React Native**:
  - **Experiência Dual Adaptativa**:
    - Alternância em 1 toque entre o **🍏 Modo Clínico Geral** (foco em adesão sustentável, déficit moderado e hábitos saudáveis) e o **⚡ Modo Esportivo & Alta Performance** (recomposição corporal, distribuição em g/kg, nutrient timing peri-treino e suplementação ergogênica).
  - **Diário de Refeições Cronológico & Substituições em 1 Toque**:
    - Listagem de refeições com horários programados, macros individuais e checkbox de refeição realizada com recálculo instantâneo do balanço do dia.
    - Modal interativo de equivalência nutricional: permite ao paciente substituir itens prescritos (ex: 180g de arroz branco ↔ 260g de batata inglesa ou 160g de mandioca) sem desequilibrar o plano dietético.
  - **Meta de Hidratação Tátil**:
    - Acompanhamento de ingestão de água com barra de progresso e atalhos rápidos (+200ml copo, +350ml e +500ml garrafa).
  - **Periodização e Peri-Treino Adaptativo**:
    - Banner motivacional de Dia de Treino (ON) vs. Dia de Descanso (OFF) com modulação programada de carboidratos.
  - **Acompanhamento de Suplementação Diária**:
    - Controle de creatina monohidratada, whey protein, ômega-3 e micronutrientes com confirmação de ingestão.
  - **Navegação por Abas Nativas**:
    - Abas: *Hoje*, *Plano Alimentar Completo*, *Evolução Antropométrica* (peso, % de gordura, metas) e *Nutricionista* (com canal direto via WhatsApp da clínica).
  - **Suíte de Testes Unitários Mobile**:
    - 4 testes unitários automatizados cobrindo a lógica de nutrição esportiva e cálculo de substitutos, integrados ao Turbo (`turbo run test`).

### 🥗🏋️‍♂️ Conclusão da Fase 3: Nutrição Clínica Geral & Esportiva Balanceada (Abordagem Dual Adaptativa)
- **Ergonomia & Acesso Imediato ao Plano Alimentar (`apps/web`)**:
  - Inclusão de botão de atalho em destaque **"Plano alimentar"** no cabeçalho superior do paciente, possibilitando acesso em 1 clique direto.
  - Abertura padrão dos grupos **"Prescrição dietética"** e **"Antropometria"** no menu lateral esquerdo.
  - Ação de clique no grupo pai: ao clicar no grupo "Prescrição dietética", a interface agora navega diretamente para o Plano Alimentar.
- **Pacote de Domínio Puro (`@ygeia/domain-core`)**:
  - Implementação das fórmulas preditivas padrão-ouro de atletas baseadas em Massa Livre de Gordura (MLG):
    - `CunninghamStrategy` (1980): $TMB = 500 + 22 \times MLG$.
    - `KatchMcArdleStrategy` (1996): $TMB = 370 + 21.6 \times MLG$.
    - `TinsleyStrategy` (2018): $TMB = 25.9 \times MLG + 284$.
  - Implementação da fórmula clínica internacional da Organização Mundial da Saúde (`OmsFaoStrategy`).
  - Evolução do Value Object `Macronutrients`:
    - Métodos de fábrica `fromGramsPerKg` e `fromCaloriesAndPercentages`.
    - Normalização e equivalência bidirecional contínua de `g/kg/dia` em função do peso corporal.
  - Expansão da suíte de testes com 13 testes unitários aprovados com 100% de sucesso.
- **Frontend Web (`apps/web`)**:
  - Criação da aba `PatientMealPlanTab.tsx` com alternância fluida entre **🍏 Modo Clínico Geral** (emagrecimento, reeducação e déficit calórico sustentável) e **⚡ Modo Esportivo & Alta Performance** (atendendo praticantes assíduos e atletas com precisão ISSN).
  - Módulo Peri-Treino (*Nutrient Timing*): refeições estruturadas de pré-treino, intra-treino (carboidratos em pó e eletrólitos) e pós-treino imediato.
  - Periodização Nutricional: modulação automatizada de carboidratos em Dias de Treino Alto (ON) vs. Dias de Descanso (OFF).
  - Prescrição estruturada de suplementação ergogênica (creatina, cafeína, beta-alanina, proteínas e eletrólitos).
  - Substituição da visualização estática anterior em `PatientProfileView.tsx` pela nova aba adaptativa.

### 🗄️ Conclusão da Fase 2: Migração Relacional dos Módulos Clínicos para PostgreSQL com RLS
- **Banco de Dados & DBA Sênior (`0006_clinical_records_and_recalls.sql`)**:
  - Criação de 4 tabelas relacionais no PostgreSQL com `TIMESTAMPTZ` e isolamento estrito via Row-Level Security:
    - `patient_anamneses`: Anamneses completas, histórico e seções clínicas em `JSONB`.
    - `patient_recalls`: Recordatórios de 24 horas, registros habituais e questionários de consumo.
    - `patient_medical_records`: Prontuário eletrônico e linha do tempo de condutas e evoluções clínicas.
    - `patient_restrictions`: Alergias, intolerâncias e recusas alimentares.
  - Indexação obrigatória de 100% das Foreign Keys (`tenant_id`, `patient_id`) para eliminação de table locks e sequential scans.
  - Índices compostos de RLS com `tenant_id` como primeira coluna: `(tenant_id, patient_id, record_date DESC)` e `(tenant_id, patient_id, status)`.
  - Habilitação compulsória de `FORCE ROW LEVEL SECURITY` e concessão de privilégios para a role `ygeia_app`.
- **Backend API (`apps/api`)**:
  - Criação do `ClinicalModule`, `ClinicalService` e `ClinicalController` protegidos por `JwtAuthGuard`.
  - Endpoints RESTful para anamneses, recordatórios, prontuários e restrições alimentares com projeção estrita de colunas (sem `SELECT *`).
  - Schemas Zod em `@ygeia/validation-schemas`: `createAnamneseSchema`, `createRecallSchema`, `createMedicalRecordSchema` e `createRestrictionSchema`.
- **Frontend Web (`apps/web`)**:
  - Criação de `ClinicalApiService` (`services/clinicalService.ts`) com chamadas tipadas e arquitetura resiliente Offline-First (fallback seguro no `localStorage` caso a rede oscile).
  - Conexão do `PatientProfileView.tsx` à API para carregamento e persistência instantânea de anamneses, recordatórios, evoluções e restrições.
- **Governança de Segurança (`SECURITY.md`)**:
  - Atualização do inventário de proteções com a migração 0006 e blindagem de prontuário eletrônico com RLS.

### 🚀 Conclusão da Fase 1: Modularização da UI de Pacientes & Validação Estrita com Zod e Auditoria LGPD
- **Frontend Web (`apps/web`)**:
  - **Decomposição do Monólito `PatientProfileView.tsx`**:
    - Redução drástica de 2.583 linhas para 498 linhas desacopladas, transferindo responsabilidades específicas para submódulos dedicados em `components/patients/tabs/`.
    - `PatientHeaderCard.tsx`: Gerenciamento do cabeçalho, dados pessoais, chave do paciente com cópia, link do WhatsApp e ações rápidas.
    - `PatientSidebarNav.tsx`: Navegação de submenus por categorias clínicas expansíveis com busca dinâmica.
    - `PatientAnamneseTab.tsx`: Grade de anamneses com `ClinicalDataGrid`, dropdown de templates e integração protegida com `AnamneseEditor` via `AnamneseErrorBoundary`.
    - `PatientRecallsTab.tsx`: Grade clínica e modal padronizado de recordatórios alimentares (24h, QFA, habitual).
    - `PatientMedicalRecordsTab.tsx`: Linha do tempo e modal de evoluções e condutas clínicas do prontuário.
    - `PatientRestrictionsTab.tsx`: Tabela com badges temáticos de alergias, intolerâncias e recusas, busca textual e filtros unificados com `AppSelect`.
    - `PatientAnthropometryTab.tsx`: Aba com a nova **Abordagem Dual Adaptativa** (seletor inteligente de modo Clínico Geral vs. Esportivo/Alta Performance, IMC, RCQ e dobras cutâneas).
- **Backend API (`apps/api`)**:
  - **Validação Global de Payloads com Zod (`ZodValidationPipe`)**:
    - Criação de pipe NestJS para Fastify com tipagem estrita de schemas Zod, formatando rejeições de validação com erros detalhados por campo em HTTP 400.
    - Testes unitários com 100% de cobertura em `zod-validation.pipe.spec.ts`.
  - **Interceptor de Auditoria LGPD Assíncrono (`AuditLogInterceptor`)**:
    - Interceptor global registrando acessos e alterações em dados sensíveis de pacientes na tabela `audit_logs` (operador, ação semântica, rota, IP e user-agent) sem degradar a latência da API.
  - Registro de `ZodValidationPipe` e `AuditLogInterceptor` como provedores globais (`APP_PIPE` e `APP_INTERCEPTOR`) no `AppModule`.
- **Governança de Segurança (`SECURITY.md`)**:
  - Atualização do inventário com as seções 2.7 (ZodValidationPipe) e 2.8 (AuditLogInterceptor e conformidade com a LGPD).

### 🥗🏋️‍♂️ Balanceamento Obrigatório entre Nutrição Clínica Geral e Nutrição Esportiva (AGENTS.md & Plano Estratégico)
- **Regras Globais de Engenharia (`AGENTS.md`)**:
  - **Refinamento da Seção 5**: Estabelecido explicitamente o princípio de **Abordagem Dual Adaptativa**. O Ygeía atende com idêntico rigor e excelência:
    1. **Público Clínico Geral / População Convencional**: Foco em reeducação alimentar, emagrecimento sustentável, controle de doenças crônicas (diabetes, hipertensão, dislipidemia, esteatose), qualidade de vida e hábitos saudáveis, com interface acolhedora, cálculos clássicos descomplicados (Mifflin, Harris, OMS) e listas práticas de substituição do dia a dia sem sobrecarga de jargões técnicos.
    2. **Público Esportivo & Alta Performance**: Ferramentas analíticas avançadas baseadas em massa magra (Cunningham, Katch-McArdle, Tinsley), macronutrientes expressos em `g/kg/dia` (padrão ISSN), modulação peri-treino (*nutrient timing*), periodização de treinos e suplementação ergogênica.
  - Imposição de alternância fluida entre perfis no prontuário/planejamento pelo nutricionista.
- **Plano Estratégico de Auditoria & Melhorias (`plano_auditoria_completa_e_melhorias_ygeia.md`)**:
  - Redefinição da **Fase 3** para contemplar a **Abordagem Dual Adaptativa**, especificando seletores de perfil clínico, calculadoras bidirecionais (% e g/kg) e antropometria adaptativa (básica de IMC/circunferências vs. avançada de dobras/bioimpedância).

### ⚙️ Regra Estrita de Engenharia Back-End & Arquiteto de Software Sênior (AGENTS.md)
- **Regras Globais de Engenharia (`AGENTS.md`)**:
  - **Inclusão da Seção 9**: Estabelecida regra obrigatória e permanente de atuação como Engenheiro de Back-End Sênior e Arquiteto de Software em toda a camada de APIs e lógica de negócio (`apps/api`).
  - Imposição de princípios: I/O não bloqueante, serialização rápida de DTOs, transações atômicas ACID obrigatórias em operações compostas, padronização de erros HTTP (RFC 7807), liveness/readiness probes com diagnóstico de latência de banco e conformidade com o OWASP API Security Top 10.
- **Backend API (`apps/api`)**:
  - `common/filters/http-exception.filter.ts`: Criação do filtro global de exceções padronizando respostas de erro amigáveis em JSON (envelope semântico com código de status, mensagem sanitizada e timestamp), impedindo vazamento de stack traces ou detalhes internos da infraestrutura em produção.
  - `database.service.ts`: Implementação do método `ping()` com cálculo de latência de conexão para diagnósticos de saúde em tempo real.
  - `health.controller.ts`: Evolução do endpoint de observabilidade com rotas `/health/live` (liveness probe) e `/health/ready` (readiness probe com verificação ativa do PostgreSQL).
  - `main.ts`: Registro global do `HttpExceptionFilter`.


### 🏋️‍♂️ Especialização em UX/UI Design Sênior em Nutrição, Nutrição Esportiva & Treinamento Físico
- **Regras Globais de Engenharia (`AGENTS.md`)**:
  - **Atualização da Seção 5**: Formalizado o papel obrigatório de atuação como **Senior UX/UI Product Designer** especialista em plataformas de **Nutrição Clínica, Nutrição Esportiva, Composição Corporal e Treinamento Físico de Alta Performance**.
  - Diretrizes especializadas de usabilidade:
    - Minimização de cliques e carga cognitiva do profissional durante consultas clínicas presenciais e teleconsultas.
    - Domínio técnico dos fluxos de nutrição esportiva: VET com equações de atletas (Cunningham, Katch-McArdle, Tinsley), cálculo duplo de macronutrientes (% calórica e `g/kg/dia` conforme diretrizes ISSN), periodização nutricional por ciclo de treino e prescrição de suplementos estratégicos (creatina, cafeína, beta-alanina, carboidratos intra-treino, eletrólitos).
    - Avaliação de composição corporal e antropometria: gráficos comparativos temporais de % de gordura (%BF), massa livre de gordura (kg) e dobras cutâneas (Pollock 3/7, Faulkner, Guedes, Bioimpedância).
    - Portal e app do atleta: plano alimentar estruturado por horários, listas de substituição em um clique, fotos de refeições e metas de hidratação interativas.


### 💻 Regra Estrita de Engenharia Front-End & Dev Front-End Sênior (AGENTS.md)
- **Regras Globais de Engenharia (`AGENTS.md`)**:
  - **Inclusão da Seção 8**: Estabelecida regra obrigatória e permanente de atuação como Desenvolvedor Front-End Sênior em toda a camada de interface (`apps/web` e `apps/mobile`).
  - Auditoria contínua de componentização, eliminação de re-renderizações desnecessárias, mobile-first real (touch targets de 44-48px), acessibilidade completa (WCAG 2.1 AA/AAA com labels semânticos vinculados por `htmlFor`/`id`, `aria-invalid` e `aria-describedby`), otimização de Core Web Vitals (LCP, CLS, INP) e tratamento obrigatório dos 4 estados de UI (*Loading/Skeleton*, *Success/Data*, *Empty State*, *Error/Fallback*).
- **Frontend Web (`apps/web`)**:
  - `components/ui/AppInput.tsx`, `AppSelect.tsx`, `AppTextarea.tsx`: Inclusão de `useId()` do React para amarração semântica automática de `htmlFor` e `id`, atributos `aria-invalid`, `aria-required` e IDs de erro/ajuda para leitores de tela e acessibilidade móvel por toque.
  - `vite.config.ts`: Configuração avançada de code-splitting (`manualChunks`) separando os blocos de fornecedores `vendor-react` e `vendor-icons`, otimizando a velocidade de carregamento inicial (LCP) e tempo de cache do navegador.


### ⚖️ Diretrizes Oficiais de Desenvolvimento de Software para a LGPD (Lei 13.709/2018)
- **Governança e Diretrizes de Engenharia (`docs/LGPD_GUIDELINES.md`, `AGENTS.md`)**:
  - **Criação do Documento Mestre de Desenvolvimento LGPD**: Compilação de diretrizes técnicas e legais baseadas diretamente nas fontes oficiais da **Autoridade Nacional de Proteção de Dados (ANPD — gov.br/anpd)**, no **Framework PPSI (Programa de Privacidade e Segurança da Informação)** do Governo Federal e nas resoluções sanitárias e éticas do **CFN (nº 600/2018)** e **CFM (nº 1.821/2007)**.
  - **Inclusão da Seção 7 no `AGENTS.md`**: Regra permanente e obrigatória para engenheiros e agentes de IA, impondo:
    - *Privacy by Design* e *Privacy by Default* (Art. 46, § 2º) em 100% dos novos desenvolvimentos.
    - Princípio da Minimização de Dados (*Data Minimization* — Art. 6º, III), proibindo campos ou coletas indiscriminadas sem justificativa dietoterápica ou fiscal.
    - Tratamento restrito de dados sensíveis de saúde (Art. 11) sob a base legal de Tutela da Saúde ou consentimento destacado, com isolamento multi-tenant forçado via PostgreSQL RLS.
    - Proibição absoluta de exposição de dados clínicos ou credenciais em logs de servidor, console ou telemetria.
    - Registro obrigatório de acessos e modificações na tabela `audit_logs` (trilha de auditoria).
    - Mecanismos técnicos para exercício dos Direitos do Titular (Art. 18: exportação aberta JSON/PDF, retificação, revogação de consentimento e harmonização de eliminação com a guarda legal de prontuários por 20 anos).
    - Checklist de conformidade obrigatório (DoD) pré-entrega de qualquer PR ou funcionalidade.


### 🗄️ Regra Obrigatória de Engenharia de Banco de Dados & DBA Sênior PostgreSQL (AGENTS.md)
- **Regras Globais de Engenharia (`AGENTS.md`)**:
  - **Inclusão da Seção 6**: Estabelecida regra obrigatória e permanente de auditoria DBA sênior de PostgreSQL para todo DDL, migração e SQL gerado ou alterado no repositório.
  - Exigências estritas: indexação obrigatória de todas as foreign keys (prevenção de locks de tabela e joins lentos), `tenant_id` como primeira coluna nos índices de tabelas com RLS, aceleração de buscas parciais com trigramas `pg_trgm` (GIN), proibição de `SELECT *` em produção, uso de `TIMESTAMPTZ` e precisão numérica decimal explícita (`NUMERIC`), e controle idempotente de migrations.
- **Backend API (`apps/api`)**:
  - `0005_dba_performance_tuning_and_indexes.sql`:
    - Ativação das extensões `pg_trgm` e `btree_gist`.
    - Criação da tabela de rastreabilidade e governança `schema_migrations`.
    - Criação de índices em todas as foreign keys que careciam de cobertura (`tenant_domains.tenant_id`, `refresh_tokens.user_id`, `refresh_tokens.tenant_id`, `team_invitations.invited_by`, `nutritionist_profiles.user_id`).
    - Otimização de paginação e filtragem multi-tenant em `patients` (`idx_patients_tenant_created`, `idx_patients_tenant_status`).
    - Índices GIN trigram para aceleração de buscas textuais de pacientes por nome e e-mail (`idx_patients_trgm_name`, `idx_patients_trgm_email`).
    - Constraint defensiva `CHECK` para status de pacientes (`ACTIVE`, `INACTIVE`, `ARCHIVED`).
  - `database.service.ts`:
    - Implementação de rastreamento transacional de migrações na tabela `schema_migrations`, garantindo idempotência e prevenindo re-execuções desnecessárias.
    - Configuração de `statement_timeout: 10000` (10s) no pool para prevenção ativa contra exaustão de recursos e queries travadas.
  - `SECURITY.md`:
    - Atualização do inventário de segurança com proteções DBA, isolamento indexado de RLS e statement timeouts.


### 🎨 Padronização Visual Estrita de UI, Design System Unificado e Regra AGENTS.md
- **Regras Globais de Engenharia (`AGENTS.md`)**:
  - **Inclusão da Seção 5**: Estabelecida regra obrigatória e permanente de padronização visual para qualquer agente ou desenvolvedor.
  - Exigência de paridade estética absoluta: todos os campos de edição (`AppInput`), caixas de seleção (`AppSelect`), áreas de texto (`AppTextarea`), botões (`AppButton`), modais (`AppModal`) e grades (`ClinicalDataGrid`) devem compartilhar as mesmas alturas (`38px`), raio de borda (`0.5rem`), padding e foco conectado dinamicamente à cor primária (`var(--primary)`, `var(--primary-light)`).
  - Proibição de estilos avulsos e auditoria obrigatória pré-entrega em qualquer nova tela ou alteração de tela existente.
- **Frontend Web (`apps/web`)**:
  - `components/ui/AppSelect.tsx`: Criação do componente unificado de combobox com suporte a options/children, chevron SVG integrado, alturas de 38px e anel de foco reativo.
  - `components/ui/AppTextarea.tsx`: Criação do componente unificado de textarea multilinhas com estados de foco idênticos aos inputs.
  - `PatientProfileView.tsx`: Refatoração completa dos formulários e modais (Recordatório Alimentar, Prontuário, Restrições Alimentares e barra de filtros de busca) para adoção de `AppInput`, `AppSelect`, `AppTextarea` e `ygeia-select`.
  - `NewPatientModal.tsx` & `PatientDirectory.tsx` & `AdminDashboard.tsx` & `ScientificEngineInteractive.tsx`: Varredura e harmonização de comboboxes com a classe `ygeia-select` e foco no tema dinâmico.
  - `YgeiaLogo.tsx` & `ygeia-logo.svg`: Ajuste da cor do pulso cardíaco para verde menta vibrante (`#7eedd6`), alinhado 100% à imagem oficial de marca registrada fornecida pelo usuário.


### 📐 Otimização Visual do Menu do Perfil do Paciente (Prontuário)
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - **Redução de Espaçamento e Altura entre Itens**: Compactação do padding vertical e das margens entre categorias (`gap: 0.15rem`, padding `0.32rem`) e subitens (`gap: 0.05rem`, padding `0.24rem`), permitindo visualização de mais opções na tela sem necessidade de rolagem excessiva.
    - **Ajuste Tipográfico**: Redução refinada do tamanho das fontes dos títulos de categorias para `0.75rem` (12px) e dos subitens para `0.71875rem` (11.5px), conferindo uma experiência mais limpa, profissional e densa.

### 🥗 Expansão da Avaliação Nutricional: Anamnese, Recordatório, Prontuário e Restrições Alimentares
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - **Menu Lateral**:
      - Atualizado o rótulo do submenu de *"Anamnese e transcrição"* para exclusivamente *"Anamnese"*.
      - Habilitado o botão de ação rápida (`+`) no submenu *"Restrições alimentares"*.
    - **Grade de Recordatórios Alimentares**:
      - Implementado suporte a múltiplos recordatórios por paciente com persistência em `localStorage` (`ygeia_recalls_${patientId}`).
      - Adotado o padrão `ClinicalDataGrid` para exibição cronológica dos inquéritos alimentares (Recordatório 24 Horas, Registro Habitual, 3 Dias, QFA).
      - Modal de cadastro e edição de recordatórios com campo de anotações e refeições.
    - **Grade do Prontuário & Evolução Clínica**:
      - Unificada a linha do tempo do prontuário no padrão `ClinicalDataGrid`.
      - Múltiplas evoluções por paciente (`ygeia_prontuario_${patientId}`) com modal de anotação de conduta e retornos.
    - **Módulo e Grade de Restrições Alimentares**:
      - Criação da grade clínica completa de restrições com colunas: *Alimento ou Substância*, *Tipo / Motivo*, *Situação*, *Origem*, *Observação* e *Ações Rápidas*.
      - Modal de inclusão e edição com validação obrigatória de *Alimento* e *Motivo*.
      - Campo de texto para alimento acompanhado do texto de apoio: *"Se a restrição depende do preparo, inclua essa informação no nome"*.
      - Seletor de motivo com opções: *Alergia*, *Intolerância*, *Não Gosta*, *Outra restrição*.
      - Alternância de situação (Ativa / Inativa) em um clique e persistência individual por paciente (`ygeia_restrictions_${patientId}`).

### 📋 Simplificação da Grade de Anamneses: Foco em Data e Ações Rápidas
- **Frontend Web (`apps/web`)**:
  - `ClinicalDataGrid.tsx`:
    - **Remoção de Colunas Secundárias**: Removida a coluna de prévia *"Principais Queixas & Objetivos"* e a coluna de *"Tags Clínicas"* da grade.
    - **Foco na Data da Consulta**: A coluna principal agora destaca a data da consulta, título da anamnese, selo do modelo/template utilizado e tempo decorrido relativo com ícone de calendário.
    - **Preservação Integral das Ações Rápidas**: Mantida a coluna de ações rápidas fixa à direita (*sticky*) com visualização/edição no editor Word (`Eye`), download/impressão de PDF (`Download`), comparação de evolução clínica (`Split`) e exclusão segura (`Trash2`).
  - `PatientProfileView.tsx`:
    - Otimizado o mapeamento `clinicalAnamnesesItems` para processamento ultrarrápido sem varredura de tags desnecessárias.

### 🌿 Identidade Visual & Marca Registrada Oficial Ygeía (Υγεία)
- **Frontend Web (`apps/web`)**:
  - `YgeiaLogo.tsx`:
    - **Criação do Símbolo Vetorial SVG Oficial**: Vetorização precisa do emblema com folhas gêmeas botânicas (nutrição), escudo curvo de proteção e linha de batimento cardíaco / pulso vital (ECG).
    - **Customização Total de Cores**: Propriedades dinâmicas para alteração de cores primárias, secundárias e do traço de pulso (`color`, `secondaryColor`, `pulseColor`, `inverted`), garantindo total aderência ao White Label Studio e paletas personalizadas de clínicas.
    - **Variantes Flexíveis**: Suporte aos modos `icon` (apenas o símbolo vetorial), `badge` (com container arredondado e sombra de elevação) e `full` (com logotipo tipográfico "YGEÍA" e subtítulo opcional).
  - **Adoção do Logotipo em Toda a Plataforma**:
    - `Sidebar.tsx`: Substituição do ícone genérico pelo `YgeiaLogo` oficial tanto no modo expandido quanto no modo recolhido (`collapsed`).
    - `Navbar.tsx`: Incorporação do `YgeiaLogo` no cabeçalho institucional e lockup de marca.
    - `LoginPage.tsx`: Integração do `YgeiaLogo` com linhas menta no painel de login.
    - `public/ygeia-logo.svg` & `index.html`: Arquivo SVG estático e favicon oficial do navegador configurado.
    - `components/ui/index.ts`: Exportação de `YgeiaLogo` e `YgeiaLogoProps`.

### 🌟 Redesign UX/UI da Grade de Anamneses: Padrão Clinical Data Grid
- **Frontend Web (`apps/web`)**:
  - `ClinicalDataGrid.tsx`:
    - **Padrão de Grade Clínica de Dados Reutilizável**: Criado componente de alto nível para exibição longitudinal de registros de saúde, projetado para servir de referência para os demais módulos (antropometria, recordatório 24h, exames laboratoriais).
    - **KPI Strip de Resumo Clínico Superior**: Faixa de métricas instantâneas no topo exibindo *Total de Registros*, data da *Primeira Consulta*, *Último Retorno* (com tempo decorrido relativo em dias ou meses) e *Frequência Média* entre consultas.
    - **Barra de Controle & Filtros Inteligentes**:
      - Campo de busca em tempo real com limpeza rápida, filtrando títulos, prévias clínicas, modelos e tags simultaneamente.
      - Dropdown de filtro por modelo/template de anamnese (*Seções padrão*, *Anamnese Esportiva*, *Anamnese Infantil*, *Saúde Gastrointestinal*, *Anamnese em Branco*).
      - Ordenação cronológica dinâmica (*Mais recentes* vs. *Mais antigas*).
      - Alternador de visualização dual (*Tabela Lista* vs. *Cards Cronológicos / Linha do Tempo*).
    - **Visualização Tabela Lista (Dense Scanner View)**:
      - Tabela com linhas zebradas suaves, badges clínicas em cores temáticas, coluna de data com ícone de calendário e coluna de ações sticky (fixa à direita com sombra de elevação).
      - Ações unificadas de linha: Editar, Imprimir PDF, Comparar evolução e Excluir.
    - **Visualização Cards Cronológicos (Vertical Timeline)**:
      - Linha do tempo visual com marcadores circulares e conectores verticais.
      - Cartões com visualização em destaque do extrato da queixa principal e tags clínicas extraídas automaticamente (*Bristol Tipo 4*, *Sono Reparador*, *Hidratação 2.5L+*, *Treino Resistido*, *Emagrecimento*, *Saúde Intestinal*).
    - **Modal de Confirmação de Exclusão Segura**: Diálogo com backdrop desfocado, ícone de alerta vermelho e confirmação explícita para evitar exclusões acidentais de registros do prontuário.
    - **Paginação Integrada**: Componente `DataTablePagination` acoplado com controle de registros por página (5, 10, 20, 50) e navegação rápida entre páginas.
  - `PatientProfileView.tsx`:
    - Substituição da lista simples de anamneses pelo novo `<ClinicalDataGrid>`.
    - Mapeamento reativo de `clinicalAnamnesesItems` com extração inteligente de resumo e tags clínicas a partir das seções e do HTML do documento.
    - Exportação e integração de botões de adicionar anamnese, gerar PDF consolidado e comparação de evolução.
  - `components/ui/index.ts`:
    - Exportação pública de `ClinicalDataGrid` e da interface `ClinicalRecordItem`.

### 📄 Reformulação do Editor de Anamnese para Padrão Microsoft Word
- **Frontend Web (`apps/web`)**:
  - `AnamneseEditor.tsx`:
    - **Área de Trabalho em Folha A4 Realista**:
      - Substituição do campo simples por uma folha de documento A4 centralizada (`820px`, proporção e padding de documento `3.5rem 4rem`, cantos suaves e sombra de folha real) sobre uma mesa de trabalho cinza neutra (`#e2e8f0`).
      - Cabeçalho timbrado oficial de prontuário nutricional (*YGEÍA CLINICAL*) com nome do paciente, idade, data e CPF.
      - As 6 seções clínicas (*Queixa principal e objetivo*, *História clínica e medicamentos*, *Hábito intestinal*, *Hidratação*, *Rotina alimentar* e *Sono e atividade física*) pré-carregadas com títulos elegantes em azul escuro e linhas divisórias, com espaço de digitação fluído logo abaixo de cada uma.
    - **Barra de Ferramentas Ribbon Estilo Word / Docs**:
      - **Histórico**: Desfazer (`Undo`, Ctrl+Z), Refazer (`Redo`, Ctrl+Y) e Limpar Formatação (`Eraser`).
      - **Tipografia**: Seletor de famílias de fonte (*Inter*, *Arial*, *Calibri*, *Times New Roman*, *Georgia*, *Roboto*, *Courier New*) e tamanhos de fonte (*10 pt* a *32 pt*).
      - **Estilos de Bloco**: Menu de estilos de texto com Texto Normal (P), Título 1 (H1), Título 2 (H2), Título 3 (H3) e Citação/Destaque (`<blockquote>`).
      - **Formatação**: Negrito (`Bold`), Itálico (`Italic`), Sublinhado (`Underline`), Tachado (`Strikethrough`), Subscrito (`Subscript`) e Sobrescrito (`Superscript`).
      - **Cores & Marca-Texto**: Seletor de cores da fonte com 8 tonalidades clínicas e realce/marca-texto com 7 cores suaves.
      - **Parágrafo**: Alinhamento à esquerda, centralizado, à direita e justificado, listas com marcadores e numeradas, controle de recuo/indentação e espaçamento entre linhas (1.0, 1.15, 1.5, 2.0).
      - **Inserções Clínicas**: Tabela personalizada com cabeçalho colorido e células editáveis, linha horizontal divisória, links inline, inserção de data/hora atual e escalas médicas rápidas (*Bristol*, *Qualidade do Sono*, *Escala Visual de Dor EVA*).
    - **Barra de Status Inferior do Word**:
      - Contadores dinâmicos de palavras e caracteres em tempo real.
      - Indicador de estado de sincronização e modificações pendentes.
      - Controle de Zoom da folha A4 (75% a 150%) com atalhos de zoom in/zoom out.
    - **Recursos Documentais**:
      - Modo Foco em Tela Cheia (`Maximize2` / `Minimize2`).
      - Suporte nativo à impressão e exportação em PDF limpo via `window.print()`.
      - Título do documento customizável e atalhos completos de teclado (incluindo `Tab` para recuo de 4 espaços sem perder o foco).

### 👤 Revisão Completa dos Cadastros: Inserir, Editar e Excluir Pacientes com Persistência
- **Frontend Web (`apps/web`)**:
  - `AdminDashboard.tsx`:
    - **Persistência em LocalStorage (`ygeia_patients_list`)**: Pacientes criados, editados ou excluídos agora são gravados no `localStorage` através da função unificada `savePatients()`, garantindo que nenhuma alteração se perca após recarregar a página (F5) ou navegar entre abas do menu.
    - **Correção no Salvamento de Edições de Paciente**:
      - Corrigido o bug crítico onde `goal` recebia indevidamente `updatedP.protocolNotes ?? p.goal`, substituindo pelo mapeamento correto `updatedP.goal || updatedP.objective || p.goal`.
      - Mapeamento consistente de `name` e `fullName`, `gender` e `sex`, além de merge seguro do objeto `address`.
      - Sincronização imediata de `selectedPatientForView`: quando a edição é disparada a partir do prontuário (`PatientProfileView`), os dados do paciente aberto são atualizados em tempo real sem reter valores desatualizados.
    - **Sincronização em Background com a API**:
      - Criação (`POST /api/v1/patients`), atualização (`PUT /api/v1/patients/:id`) e exclusão (`DELETE /api/v1/patients/:id`) integradas automaticamente em segundo plano quando há sessão ativa com token.
    - **Chaves de Ciclo de Vida (`key`)**: Inclusão de `key` dinâmica no `<NewPatientView>` para forçar remontagem limpa dos estados de edição ao alternar entre diferentes pacientes.
  - `NewPatientView.tsx`:
    - Adicionado hook `useEffect` reativo para sincronizar todos os campos de formulário caso `initialPatient` se altere.
    - Adicionado botão primário de *"Salvar alterações"* diretamente no topo superior do formulário (ao lado de *"Fechar"*), permitindo salvar modificações a qualquer momento a partir de qualquer uma das etapas.
    - Disponibilizado botão de *"Salvar alterações"* na barra de ações inferior de todas as etapas intermediárias (Etapas 2 a 7) ao lado de *"Continuar"*.
  - `PatientDirectory.tsx`:
    - Confirmação de exclusão integrada com remoção reativa no estado e persistência garantida no `localStorage`.
- **Backend API (`apps/api`)**:
  - `patients.controller.ts` & `patients.service.ts`:
    - Implementado endpoint `@Delete(':id')` e método `deletePatient(tenantId, patientId)` assegurando isolamento multi-tenant estrito via `tenant_id` e políticas PostgreSQL RLS.

### 👤 Revisão Completa dos Cadastros: Inserir, Editar e Excluir Pacientes com Persistência
- **Frontend Web (`apps/web`)**:
  - `AdminDashboard.tsx`:
    - **Persistência em LocalStorage (`ygeia_patients_list`)**: Pacientes criados, editados ou excluídos agora são gravados no `localStorage` através da função unificada `savePatients()`, garantindo que nenhuma alteração se perca após recarregar a página (F5) ou navegar entre abas do menu.
    - **Correção no Salvamento de Edições de Paciente**:
      - Corrigido o bug crítico onde `goal` recebia indevidamente `updatedP.protocolNotes ?? p.goal`, substituindo pelo mapeamento correto `updatedP.goal || updatedP.objective || p.goal`.
      - Mapeamento consistente de `name` e `fullName`, `gender` e `sex`, além de merge seguro do objeto `address`.
      - Sincronização imediata de `selectedPatientForView`: quando a edição é disparada a partir do prontuário (`PatientProfileView`), os dados do paciente aberto são atualizados em tempo real sem reter valores desatualizados.
    - **Sincronização em Background com a API**:
      - Criação (`POST /api/v1/patients`), atualização (`PUT /api/v1/patients/:id`) e exclusão (`DELETE /api/v1/patients/:id`) integradas automaticamente em segundo plano quando há sessão ativa com token.
    - **Chaves de Ciclo de Vida (`key`)**: Inclusão de `key` dinâmica no `<NewPatientView>` para forçar remontagem limpa dos estados de edição ao alternar entre diferentes pacientes.
  - `NewPatientView.tsx`:
    - Adicionado hook `useEffect` reativo para sincronizar todos os campos de formulário caso `initialPatient` se altere.
    - Adicionado botão primário de *"Salvar alterações"* diretamente no topo superior do formulário (ao lado de *"Fechar"*), permitindo salvar modificações a qualquer momento a partir de qualquer uma das etapas.
    - Disponibilizado botão de *"Salvar alterações"* na barra de ações inferior de todas as etapas intermediárias (Etapas 2 a 7) ao lado de *"Continuar"*.
  - `PatientDirectory.tsx`:
    - Confirmação de exclusão integrada com remoção reativa no estado e persistência garantida no `localStorage`.
- **Backend API (`apps/api`)**:
  - `patients.controller.ts` & `patients.service.ts`:
    - Implementado endpoint `@Delete(':id')` e método `deletePatient(tenantId, patientId)` assegurando isolamento multi-tenant estrito via `tenant_id` e políticas PostgreSQL RLS.

### 🛡️ Política e Arquitetura de Segurança Anti-Invasão (Defense-in-Depth)
- **Governança & Ecossistema Geral**:
  - Criação do documento institucional [`SECURITY.md`](./SECURITY.md) cobrindo a matriz anti-invasão Zero Trust nos 3 projetos (`apps/api`, `apps/web` e `apps/mobile`), política de divulgação responsável de vulnerabilidades e checklist de conformidade.
  - Vínculo direto no [`README.md`](./README.md) com badge oficial de segurança ativa e documentação arquitetural.
  - Atualização do [`AGENTS.md`](./AGENTS.md) com a regra mandatória de sincronização contínua do `SECURITY.md` a cada alteração de segurança, criptografia, autenticação ou isolamento multi-tenant.
- **Backend API (`apps/api`)**:
  - `main.ts`:
    - Adicionado limite rígido de payload de requisição (`bodyLimit: 1MB`) no Fastify contra ataques de negação de serviço (DoS/DDoS).
    - Fortalecimento dos cabeçalhos HTTP via Fastify Helmet com `frameguard: { action: 'deny' }` (Anti-Clickjacking), `noSniff: true` (Anti-MIME sniffing) e `hidePoweredBy: true`.
- **Frontend Web (`apps/web`)**:
  - Documentação e auditoria das diretrizes de isolamento de cookies HttpOnly com SameSite Strict, escape nativo contra XSS e bloqueio de iframes maliciosos.
- **Mobile (`apps/mobile`)**:
  - Definição da arquitetura de hardware-backed secure storage (iOS Keychain / Android Keystore AES-256), TLS Pinning e bloqueio de print/gravação de tela em dados médicos.

### 🧭 Correções de UX e Ícones no Menu Principal (Sidebar)
- **Frontend Web (`apps/web`)**:
  - `Sidebar.tsx`:
    - Preservação rígida das proporções do logotipo (`34px x 34px`, `aspectRatio: 1 / 1`, `flexShrink: 0`) prevenindo deformação ou esmagamento ("amassar") nas transições de contração e expansão.
    - Inversão direcional da seta horizontal de recolhimento: aponta para a esquerda (`ChevronLeft`) quando expandido e inverte para a direita (`ChevronRight`) quando contraído, indicando com clareza o sentido do retorno.
    - Redução da tipografia do título do logotipo para `0.8125rem` (13px) e subtítulo para `0.65rem`.
    - Adição e renderização de ícones para todos os subitens do menu principal (`Pacientes`, `Cálculo TMB / GET`, `Planejador de Cardápios`, `Avaliação & Pregas`, `Exames Laboratoriais`, `Prescrição de Treinos`, etc.), viabilizando a navegação e cliques com tooltips no modo contraído.
  - `Header.tsx`:
    - Atualização do botão desktop de expansão lateral com `ChevronRight` unificado.

### 📝 Transformação do Editor de Anamneses e Ajustes do Grid
- **Frontend Web (`apps/web`)**:
  - `AnamneseEditor.tsx`:
    - Substituição das múltiplas caixas de texto isoladas por um editor de texto clínico contínuo e unificado (`contentEditable`), onde as 6 seções clínicas (*Queixa principal e objetivo*, *História clínica e medicamentos*, *Hábito intestinal*, *Hidratação*, *Rotina alimentar* e *Sono e atividade física*) já vêm pré-carregadas como títulos com espaçamento imediato para escrita do nutricionista.
    - Remoção completa da aba de transcrição de voz, simplificando a interface para foco total no registro clínico.
    - Suporte à formatação rica direta (Títulos H3, Negrito, Itálico, Listas com marcadores e numeradas, Alinhamento, Links, Tabelas e inserção de Escalas Clínicas como Bristol e Qualidade do Sono).
    - Preservação da sincronização e retrocompatibilidade com salvamento de conteúdo HTML e extração estruturada de seções.
  - `PatientProfileView.tsx`:
    - Remoção do botão de análise com inteligência artificial (`Wand2`) das linhas do grid de histórico de anamneses do paciente.

### 🩹 Correção Definitiva da Tela Branca ao Criar ou Abrir Anamnese (React Hook Order)
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - Resolução da exceção de runtime do React 19 (`Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement`).
    - Realocação do retorno antecipado condicional `if (isEditingAnamnese)` para após a execução incondicional de todos os hooks do componente (`useMemo`, `useState`, `useEffect`), assegurando estrita aderência às Regras dos Hooks do React.
  - `AnamneseEditor.tsx`:
    - Adição de proteção com operador de encadeamento opcional e fallbacks (`(sections?.campo || '').length`) em todas as 6 seções clínicas contra eventuais propriedades indefinidas em tempo de renderização.

### 🔘 Simplificação do Botão de Adicionar Anamnese
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - O botão **+ Adicionar anamnese** agora é um botão único e direto (removido o botão dividido, chevron e o menu suspenso de modelos que ficavam dentro dele).
    - O clique agora abre imediatamente o editor de anamnese com o template clínico completo carregado.

### 🔘 Simplificação do Botão de Adicionar Anamnese
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - O botão **+ Adicionar anamnese** agora é um botão único e direto (removido o botão dividido, chevron e o menu suspenso de modelos que ficavam dentro dele).
    - O clique agora abre imediatamente o editor de anamnese com o template clínico completo carregado.

### 📱 Formatação Automática de Telefones no Grid de Pacientes
- **Frontend Web (`apps/web`)**:
  - `countryDialCodes.tsx`:
    - Criação da função utilitária `formatPhoneDisplay(rawPhone)` capaz de reconhecer e formatar números gravados com DDI internacional (`+55`, `+1`, `+351`, etc.), prefixos sem sinal, ou números nacionais brutos de 10 e 11 dígitos no padrão brasileiro `(XX) XXXXX-XXXX` ou `(XX) XXXX-XXXX`.
  - `PatientDirectory.tsx`:
    - Aplicação de `formatPhoneDisplay` na coluna de contato do grid de pacientes, assegurando que nenhum telefone seja exibido como sequência crua de dígitos sem máscara.
    - Suporte à busca inteligente de pacientes por telefone: a busca agora encontra o paciente seja digitando o telefone com máscara/formatação ou apenas os dígitos limpos.
  - `AdminDashboard.tsx`:
    - Atualização do número inicial mockado do paciente principal para o formato padrão mascarado.

### 📱 Formatação Automática de Telefones no Grid de Pacientes
- **Frontend Web (`apps/web`)**:
  - `countryDialCodes.tsx`:
    - Criação da função utilitária `formatPhoneDisplay(rawPhone)` capaz de reconhecer e formatar números gravados com DDI internacional (`+55`, `+1`, `+351`, etc.), prefixos sem sinal, ou números nacionais brutos de 10 e 11 dígitos no padrão brasileiro `(XX) XXXXX-XXXX` ou `(XX) XXXX-XXXX`.
  - `PatientDirectory.tsx`:
    - Aplicação de `formatPhoneDisplay` na coluna de contato do grid de pacientes, assegurando que nenhum telefone seja exibido como sequência crua de dígitos sem máscara.
    - Suporte à busca inteligente de pacientes por telefone: a busca agora encontra o paciente seja digitando o telefone com máscara/formatação ou apenas os dígitos limpos.
  - `AdminDashboard.tsx`:
    - Atualização do número inicial mockado do paciente principal para o formato padrão mascarado.

### 🩹 Correção da Tela em Branco no Grid de Anamneses e Aprimoramento Visual do Editor
- **Frontend Web (`apps/web`)**:
  - `AnamneseEditor.tsx`:
    - Resolução definitiva do problema de carregamento de anamnese e visualização vazia/em branco ao clicar em inserção ou edição.
    - Transformação dos campos do canvas clínico em cards com bordas nítidas (`#e2e8f0`), background limpo, indicador de contagem de caracteres em tempo real e anel de foco dinâmico (`var(--primary)` e `var(--primary-light)`).
    - Inicialização robusta e à prova de falhas: novas anamneses com template "Seções padrão" agora são pré-preenchidas com dados clínicos orientadores, e anamneses existentes vindas de formatos antigos têm suas seções recuperadas automaticamente.
    - Aplicação de anel de foco e estados interativos com tema dinâmico no campo de transcrição de voz por inteligência artificial.
  - `PatientProfileView.tsx`:
    - Inclusão do componente de tratamento de exceções `AnamneseErrorBoundary` para proteger a interface contra quebras não tratadas em tempo de execução, oferecendo botão de recuperação segura.
    - Implementação de sanitização e migração defensiva de anamneses na função `handleOpenAnamneseForEdit`, garantindo que todas as 6 seções sejam strings válidas antes de abrir o editor.
    - Tornou toda a linha da anamnese no grid clicável (`cursor: pointer`), com feedback visual ao passar o mouse e isolamento de propagação de clique (`e.stopPropagation()`) nos botões de ação (IA, Calendário, Download, Comparar e Excluir).
    - Ajuste no atalho de adição rápida `+` no menu lateral clínico para inicializar o rascunho com o template padrão estruturado.

### 🧹 Limpeza e Simplificação do Menu Principal
- **Frontend Web (`apps/web`)**:
  - `Sidebar.tsx`:
    - Removidos do menu principal os módulos e itens solicitados:
      - *Clube de Vantagens*, *Minha Conta Admin* e *Gestão de Contas*.
      - Grupos de accordion *Atendimento* (pré e pós-consulta) e *Rotina* (agenda, daily, acompanhamentos, chat, tarefas).
      - Submenus de *Cadastros*: *Alimentos (TACO)*, *Suplementos & Doses*, *Modelos de Prescrição* e *Locais de Atendimento*.
    - Mantidos no menu de navegação: *Dashboard de Pacientes*, *Cadastros (Pacientes)*, *Nutrição* (TMB/GET, Cardápios, Antropometria, Exames), *Treinamento* e *Configurações*.
  - `AdminDashboard.tsx`:
    - Atualizados redirecionamentos rápidos do painel para o submenu ativo de pacientes (`cadastros_pacientes`).

### 🩹 Correção no Carregamento, Persistência e Sincronização de Anamneses
- **Frontend Web (`apps/web`)**:
  - `AnamneseEditor.tsx`:
    - Adição de sincronização reativa com `useEffect` para carregar imediatamente os dados da anamnese (`sections`, `selectedTemplate`, `transcriptionText`) sempre que um item for selecionado no grid ou um novo for criado.
    - Suporte a templates clínicos adicionais no seletor: *Anamnese Infantil*, *Saúde Gastrointestinal*, *Anamnese Esportiva*, *Seções padrão* e *Anamnese em Branco*.
    - Garantia de null-safety para iniciais, idade e identificadores do paciente.
  - `PatientProfileView.tsx`:
    - Implementação de persistência no `localStorage` indexada por paciente (`ygeia_anamneses_${patientId}`), evitando perdas de anamneses cadastradas ou editadas ao recarregar ou navegar entre pacientes.
    - Adição de menu dropdown com templates clínicos no botão *+ Adicionar anamnese ⌄*.
    - Proteção contra valores nulos/indefinidos em cálculos de idade, chaves numéricas do paciente e links de WhatsApp.
  - `AdminDashboard.tsx`:
    - Inclusão da propriedade `key={selectedPatientForView.id}` para remontagem e isolamento estrito de estado ao alternar entre pacientes.
    - Adição do botão de visualização rápida com olho (`Eye`) na lista de pacientes do painel inicial (`dashboard_pacientes`), permitindo acesso direto à ficha e anamneses sem etapas intermediárias.

### 📋 Grid de Múltiplas Anamneses (Layout 1:1 DietSystem)
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - Estruturação do grid de anamneses preenchidas com fidelidade total à imagem de referência:
      - Título da linha formatado por extenso: *Anamnese criada em 22 de novembro de 2026*.
      - Fileira de 6 botões de ação estilizados em cada linha da lista:
        1. *Assistente IA*: Botão em roxo suave com ícone de varinha mágica para insights e resumos clínicos.
        2. *Calendário*: Exibição e verificação da data da consulta.
        3. *Download*: Exportação e download de PDF individual da anamnese.
        4. *Comparação / Duplicação*: Ferramenta de comparação com consultas anteriores.
        5. *Edição*: Reabertura completa do preenchimento no `AnamneseEditor`.
        6. *Exclusão*: Remoção da anamnese com feedback instantâneo.
      - Inicialização de anamneses exemplares preservando a visualização exata da plataforma.

### 📝 Tela Completa de Preenchimento de Anamneses Múltiplas (Layout 1:1)
- **Frontend Web (`apps/web`)**:
  - `AnamneseEditor.tsx`:
    - Nova tela de preenchimento clínico estruturado construída 1:1 com a imagem de referência do DietSystem:
      - **Header**: Botão voltar (`<`), avatar com iniciais do paciente, nome, idade em anos e meses, pill interativo de *Sugestões* com switch, botão *Ver tutorial* e botão de ação *Salvar dados* respeitando o tema dinâmico (`var(--primary)`).
      - **Abas Clínicas**: Alternância entre *Anamnese* estruturada e *Transcrição* por voz com IA, acompanhadas de seletor de templates (*Seções padrão*, *Anamnese Esportiva*, *Infantil*, etc.).
      - **Toolbar de Edição Rica**: Seletor de cabeçalho *H3 Título 3* em pill suave, botões de formatação (negrito, itálico, marcadores, numeração, alinhamento, cores, links, tabelas), menu suspenso de *Escalas* clínicas (Bristol, Sono, etc.) e ícone de favoritar modelo.
      - **Canvas da Anamnese**: 6 seções padronizadas conforme imagem de referência:
        1. *Queixa principal e objetivo*
        2. *História clínica e medicamentos*
        3. *Hábito intestinal*
        4. *Hidratação*
        5. *Rotina alimentar*
        6. *Sono e atividade física*
  - `PatientProfileView.tsx`:
    - Integração de suporte a **múltiplas anamneses por paciente**:
      - Ao clicar em *+ Adicionar anamnese* (ou no `+` da sidebar), abre a tela do editor de anamnese.
      - Ao salvar, os dados são persistidos na lista do paciente, exibindo cards com título, data/hora, tipo de modelo e resumo do preenchimento.
      - Cada anamnese salva pode ser reaberta para edição completa ou excluída.

### 🧹 Limpeza de Seções na Visualização do Paciente
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - Removidos os itens de menu e páginas *"Perfil nutricional integrado"* e *"Teia de interconexões"* da sidebar de navegação clínica, simplificando a jornada de avaliação nutricional focando em anamnese, recordatório, prontuário, restrições e medicamentos.

### 🎨 Padronização e Conformidade 100% com o Tema Dinâmico White Label
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - Substituição integral de cores estáticas/hardcoded pelos tokens e variáveis CSS do tema dinâmico (`var(--primary)`, `var(--primary-hover)`, `var(--primary-light)`, `var(--primary-border)`).
    - Status pill `• ATIVO`, barra indicadora de grupo ativo da sidebar, subitens selecionados, badges de novidade, botões de adição (`+`), botões de ação e modal de nova anamnese agora refletem instantaneamente a identidade visual e as cores da clínica personalizada.
  - `NewPatientModal.tsx`:
    - Substituição das cores estáticas no item ativo da navegação vertical, ícones de notificação, switches toggle de envio de e-mail/WhatsApp de boas-vindas e botão principal de submissão do paciente.
  - `NewPatientView.tsx`:
    - Eliminação de fallbacks hardcoded no seletor de telefone unificado, padronizando os estados de foco e glow com `var(--primary)` e `var(--primary-glow)`.
  - `SettingsModule.tsx`:
    - Adaptação dos botões de ação de edição e salvamento dos dados pessoais para uso estrito de `var(--primary)` e `var(--primary-hover)`.

### 🏥 Tela Completa de Visualização Clínica do Paciente (Layout 1:1 DietSystem)
- **Frontend Web (`apps/web`)**:
  - `PatientProfileView.tsx`:
    - Reestruturação completa da tela para corresponder 1:1 à interface de referência enviada pelo usuário:
      - **Header Superior**:
        - Avatar quadrado em cinza claro com as iniciais do paciente.
        - Nome completo em destaque com pill verde `• ATIVO`.
        - Subtítulo com idade amigável (`X anos e Y meses`) e `chave XXXXXXXX` com botão de cópia rápida.
        - Botões de cabeçalho `[ 📄 Financeiro ]`, `[ ⏱️ Linha do tempo ]` e menu `[ ... ]` (com ações de editar cadastro, WhatsApp e exclusão).
      - **Sidebar de Navegação Clínica**:
        - Campo de busca instantânea `Buscar seção...`.
        - Todos os agrupamentos clínicos originais com suporte a expansão/recolhimento e indicador vertical verde:
          - *Perfil nutricional integrado*.
          - *Avaliação nutricional* (Anamnese e transcrição, Teia de interconexões, Recordatório alimentar, Prontuário, Restrições alimentares, Medicamentos [Novidade]).
          - *Antropometria* (Adulto, Criança e adolescente, Gestante, Bioimpedância, BodyScan 3D, Reganho GLP-1 [Novidade]).
          - *Prescrição dietética* (Gasto calórico, Plano alimentar, Orientações, Receitas, Produtos, Fórmulas).
          - *Avaliação bioquímica* (Upload de exame, Solicitar exames, Exames por texto, Análise de exames por IA).
          - *Pós-consulta* (Hidratação, Foto comparativa, Metas, Formulário, Ebooks, imagens, etc).
          - *Arquivos do paciente* (Recibo, Atestado, Contrato, Encaminhamento, Documentos compartilhados).
          - *Checklist de condutas*, *Aplicativo do paciente*, *Download ou envio de PDF's*.
        - Botões de atalho rápido `+` em cada subitem para inserção instantânea de registros.
      - **Workspace Principal de Anamneses e Transcrições**:
        - Título `Anamneses e transcrições` e subtítulo `Anamneses e gravações das consultas do paciente`.
        - Botões de topo `[ 🔗 PDF unificado ]` e `[ + Adicionar anamnese ⌄ ]`.
        - Estado vazio (empty state) idêntico à imagem de referência com ícone de pasta cinza e mensagem *"Nenhuma anamnese ou transcrição registrada."*.
        - Modal para cadastro e registro de novas anamneses e transcrições com inserção imediata no histórico do paciente.

### 👁️ Ação de Visualização de Pacientes no Grid & Tela de Prontuário Completa (Modelo DietSystem)
- **Frontend Web (`apps/web`)**:
  - `PatientDirectory.tsx`:
    - Adicionado botão de ação com ícone de olho (`Eye` do Lucide), estilizado com borda suave, cantos arredondados e sombra sutil, posicionado **na frente do lápis de editar** na coluna de ações do grid de pacientes.
    - O clique no olho aciona a visualização imediata do prontuário e ficha clínica do paciente (`onViewPatient`).
  - `PatientProfileView.tsx`:
    - Nova tela de visualização e gestão clínica de paciente inspirada diretamente na arquitetura e estrutura do DietSystem (`https://my.dietsystem.com.br/patients/1000001851`).
    - **Header & Hero Card**: Avatar com iniciais/foto, nome completo, badges de status, idade/nascimento, sexo de referência para cálculos, convênio, local de atendimento, objetivo clínico em destaque e badges de tags e patologias cadastradas.
    - **Ações Rápidas**: Disparo direto para WhatsApp do paciente (`wa.me` com mensagem personalizada), botão "Iniciar Consulta", "Editar Cadastro" e modal de exclusão segura.
    - **Régua de Métricas Rápidas**: Visualização instantânea de peso atual, variação de peso, IMC com classificação OMS, percentual de gordura corporal e meta calórica diária.
    - **Abas Clínicas Padronizadas**:
      1. *Prontuário & Linha do Tempo*: Histórico cronológico de consultas e atendimentos, box de inserção rápida de evolução clínica/alertas com salvamento instantâneo, e alertas clínicos em destaque.
      2. *Dados Cadastrais & Contato*: Dados pessoais, CPF, telefone formatado com bandeira do país, responsável legal para menores de idade, endereço completo e dados de convênio.
      3. *Plano Alimentar & Prescrição*: Resumo do VET (kcal/dia), divisão de macronutrientes (Carboidratos, Proteínas e Lipídios em gramas e %), lista cronológica de refeições estruturadas e botões de download de PDF e envio via WhatsApp.
      4. *Avaliação Antropométrica*: Medidas corporais, IMC, RCQ, massa magra/muscular e dobras cutâneas com protocolo Pollock 7 dobras.
      5. *Anamnese & Hábitos*: Queixa principal, histórico familiar, medicamentos, rotina de treino, qualidade do sono e avaliação digestiva (Escala de Bristol).
      6. *Exames & Documentos*: Tabela de exames laboratoriais recentes com faixas de referência e status.
  - `AdminDashboard.tsx`:
    - Integrado o modo `'view'` em `patientViewMode` e `selectedPatientForView`, permitindo navegação fluida entre grid, visualização detalhada, edição e criação.

### 📞 Formatação Dinâmica por Prefixo Internacional & Expansão de Banco de Dados
- **Frontend Web (`apps/web`)**:
  - `countryDialCodes.tsx`:
    - Adicionado suporte a máscaras e formatos nacionais para todos os 37 prefixos/países suportados (ex: EUA `(000) 000-0000`, Portugal `000 000 000`, Espanha `000 00 00 00`, Reino Unido `00000 000000`, França `00 00 00 00 00`, Alemanha `0000 0000000`, etc.).
    - Implementada a função `formatPhoneNumber(value, countryCode)` que formata dinamicamente conforme o usuário digita e reformata automaticamente o número existente ao alternar de país.
    - Placeholder e limites de caracteres (`maxLength`) dinâmicos sincronizados com o país selecionado.
  - `NewPatientView.tsx` e `NewPatientModal.tsx`:
    - Integração de `formatPhoneNumber`, placeholders dinâmicos e revalidação de formato em tempo real.
- **Backend & Banco de Dados (`apps/api` e `@ygeia/validation-schemas`)**:
  - `0004_expand_phone_fields.sql`: Nova migration garantindo que colunas de telefone (`phone`, `whatsapp`) tenham tamanho de `VARCHAR(64)`, suportando telefones internacionais completos com DDI, DDD e máscara.
  - `@ygeia/validation-schemas`: Ajustada a validação do schema `createPatientSchema` para aceitar telefones de 8 a 64 caracteres.

### 🌍 Bandeiras Gráficas em Alta Resolução para Todos os Prefixos Telefônicos Internacionais
- **Frontend Web (`apps/web`)**:
  - `countryDialCodes.tsx`: Criação de componente dedicado `CountryFlag` que renderiza bandeiras oficiais e nítidas para **todos os 37 países e prefixos** suportados (Brasil, EUA, Portugal, Espanha, Argentina, Alemanha, França, Itália, Japão, etc.), eliminando problemas de fontes de emojis no Windows.
  - `NewPatientView.tsx` e `NewPatientModal.tsx`:
    - Integração de `<CountryFlag />` tanto no seletor de DDI ativo quanto no dropdown pesquisável de países.
    - Sincronização completa da seleção do DDI com o salvamento do telefone em ambas as telas de cadastro.

### 📱 Padronização Visual do Campo de Telefone (Design Unificado com Bandeira e DDI)
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx` e `NewPatientModal.tsx`:
    - Unificação do campo de telefone em um container único com borda arredondada (`rounded-lg`), fundo branco e divisor vertical suave.
    - Seletor de país integrado à esquerda com bandeira nítida em SVG (Brasil 🇧🇷 com cores oficiais precisas), código DDI (`+55`) e seta indicadora (`⌄`).
    - Campo de número à direita com placeholder padronizado `(00) 00000-0000`, sem bordas internas e máscara automática de formatação.

### 🧹 Limpeza nos Rodapés de Cadastro de Pacientes
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx` e `NewPatientModal.tsx`: Remoção completa dos textos e links de rodapé (*"Vindo de outro software? Clique aqui para importar"* e *"Se precisar de ajuda, clique aqui 💬"*), deixando os formulários mais concisos e com foco total nas etapas clínicas.

### 🧹 Limpeza nos Rodapés de Cadastro de Pacientes
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx` e `NewPatientModal.tsx`: Remoção completa dos textos e links de rodapé (*"Vindo de outro software? Clique aqui para importar"* e *"Se precisar de ajuda, clique aqui 💬"*), deixando os formulários mais concisos e com foco total nas etapas clínicas.

### 🛠️ Ajuste de Layout Pixel-Perfect da Tela de Configurações (Fidelidade Total à Imagem de Referência)
- **Frontend Web (`apps/web`)**:
  - `styles.css`:
    - Ajustado breakpoint do grid `.ygeia-settings-layout` para manter a estrutura em 2 colunas (`240px 1fr`) em telas a partir de `768px` (prevenindo quebra de layout prematura em resoluções intermediárias).
  - `SettingsModule.tsx`:
    - **Cabeçalho**: Removido badge com fundo verde de `CONFIGURAÇÃO`, adotando o texto superior sutil em cinza com tracking espaçado (`0.12em`), idêntico à imagem de referência.
    - **Sidebar**:
      - Substituição do ícone de `Idioma` pelo ícone `Languages` (`文A`).
      - Neutralização visual da cor de `Zona de perigo` para manter a sobriedade idêntica ao design de referência.
      - Ajuste da cor de destaque do item ativo para pílula suave `#f1f5f9` com texto escuro `#0f172a`.
    - **Card de Dados Pessoais**:
      - Botão `Editar` com cantos levemente arredondados (`rounded-md`) e verde esmeralda `#10b981`.
      - Seção `Foto`: Container tracejado com avatar do profissional Bruno Ferreira (`/bruno-profile.jpg`), subtítulo `PNG, JPEG ou WEBP — máx. 10MB` e botões de ação `Alterar` e `Remover`.
      - Seções `IDENTIFICAÇÃO` e `ENDEREÇO`: Alinhamento milimétrico das colunas (largura fixa de 220px para rótulos) com traço `—` para campos sem valor cadastrado.

### 🧬 Ajuste em Sexo de Referência para Cálculos
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx`: Restrição estrita das opções do campo `Sexo de referência para cálculos *` exclusivamente para **Feminino** e **Masculino**, alinhando com as diretrizes e fórmulas bioenergéticas e de pregas cutâneas do CFN/OMS.

### 🛠️ Ajuste de Layout Pixel-Perfect da Tela de Configurações (Fidelidade Total à Imagem de Referência)
- **Frontend Web (`apps/web`)**:
  - `styles.css`:
    - Ajustado breakpoint do grid `.ygeia-settings-layout` para manter a estrutura em 2 colunas (`240px 1fr`) em telas a partir de `768px` (prevenindo quebra de layout prematura em resoluções intermediárias).
  - `SettingsModule.tsx`:
    - **Cabeçalho**: Removido badge com fundo verde de `CONFIGURAÇÃO`, adotando o texto superior sutil em cinza com tracking espaçado (`0.12em`), idêntico à imagem de referência.
    - **Sidebar**:
      - Substituição do ícone de `Idioma` pelo ícone `Languages` (`文A`).
      - Neutralização visual da cor de `Zona de perigo` para manter a sobriedade idêntica ao design de referência.
      - Ajuste da cor de destaque do item ativo para pílula suave `#f1f5f9` com texto escuro `#0f172a`.
    - **Card de Dados Pessoais**:
      - Botão `Editar` com cantos levemente arredondados (`rounded-md`) e verde esmeralda `#10b981`.
      - Seção `Foto`: Container tracejado com avatar do profissional Bruno Ferreira (`/bruno-profile.jpg`), subtítulo `PNG, JPEG ou WEBP — máx. 10MB` e botões de ação `Alterar` e `Remover`.
      - Seções `IDENTIFICAÇÃO` e `ENDEREÇO`: Alinhamento milimétrico das colunas (largura fixa de 220px para rótulos) com traço `—` para campos sem valor cadastrado.

### 🧬 Ajuste em Sexo de Referência para Cálculos
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx`: Restrição estrita das opções do campo `Sexo de referência para cálculos *` exclusivamente para **Feminino** e **Masculino**, alinhando com as diretrizes e fórmulas bioenergéticas e de pregas cutâneas do CFN/OMS.

### 🎨 Restauração Fiel e Alinhamento da Tela de Configurações (Padrão Better Health)
- **Frontend Web (`apps/web`)**:
  - `SettingsModule.tsx`:
    - Reestruturação completa do layout para corresponder 1:1 ao design do Better Health:
      - **Cabeçalho**: Adicionada tag superior `CONFIGURAÇÃO` em caixa alta com fundo sutil, título `Configurações` em destaque (1.75rem, bold 800) e subtítulo institucional.
      - **Layout em 2 Colunas (`.ygeia-settings-layout`)**:
        - **Sidebar Esquerda Aberta (`.ygeia-settings-sidebar`)**: Caixa de busca `Procurar` no topo com ícone e borda limpa, seguida pelos quatro grupos estruturados com títulos em cinza (`CONTA`, `ATENDIMENTO`, `DOCUMENTOS E ASSINATURA`, `APARÊNCIA`) e botões com ícones dedicados e pílula ativa em cinza claro (`#f1f5f9`).
        - **Card Principal Branco (`.ygeia-settings-content`)**: Cartão limpo com bordas e sombra suave contendo o conteúdo da sub-aba ativa.
      - **Aba Dados Pessoais Fiel à Referência**:
        - Modo de visualização limpo com botão `Editar` no canto superior direito.
        - Seção **Foto**: Caixa tracejada com avatar do profissional (`/bruno-profile.jpg`), textos informativos e botões `Alterar` e `Remover`.
        - Seções **IDENTIFICAÇÃO** e **ENDEREÇO**: Listagem em linhas horizontais divididas por divisores suaves (`Nome completo`, `Email`, `Telefone`, `CRN`, `CPF / CNPJ`, `Especialidades`, `CEP`, `Logradouro`, `Cidade / UF`).
        - Modo de edição acessível via botão `Editar` permitindo atualizar os dados e persistir em tempo real.
  - `styles.css`: Substituição do encapsulamento anterior por regras limpas de grid responsivo `.ygeia-settings-layout`, `.ygeia-settings-sidebar` e `.ygeia-settings-content`.

### ✨ Melhorias Avançadas no Cadastro de Pacientes & Componentes de Formulário
- **Frontend Web (`apps/web`)**:
  - `NewPatientView.tsx`:
    - **Seletor de DDI Internacional com Bandeirinhas**: Implementado botão seletor de país no campo de telefone com bandeiras emoji (37 países cobertos: Brasil 🇧🇷 +55, EUA 🇺🇸 +1, Portugal 🇵🇹 +351, Espanha 🇪🇸 +34, etc.), dropdown inteligente com campo de pesquisa em tempo real e fechamento ao clicar fora.
    - **Comboboxes Modernos (`.ygeia-select`)**: Padronização visual de todos os selects do formulário com seta SVG personalizada, padding proporcional, foco suave com `--primary-glow` e bordas refinadas.
    - **Campo de Sexo de Referência**: Título atualizado para `Sexo de referência para cálculos *` com indicação de obrigatoriedade e texto explicativo abaixo: *"Usado nos cálculos e nas faixas de referência. Revise conforme a avaliação clínica."*.
    - **Placeholders Padronizados**: Data de nascimento ajustada para `DD/MM/YYYY` e CPFs para `000.000.000-00`.
    - **Card de Responsável Legal**: Agrupamento em card isolado (`Dados do Responsável Legal`) contendo nome, CPF do responsável com máscara e nota explicativa para menores de idade.
    - **Combo de Objetivo Principal na Aba de Tratamento**: Adicionado combobox com os objetivos: *Emagrecimento*, *Hipertrofia*, *Manutenção*, *Performance Esportiva*, *Reeducação Alimentar* e *Saúde Digestiva*.
    - **Campo Dinâmico de Tags**: Input com botão `Adicionar Tag` e suporte à tecla Enter, renderizando badges coloridos com botão `X` para remoção individual.
    - **Campo Dinâmico de Patologias**: Input com botão `Adicionar Patologia` e suporte à tecla Enter, renderizando badges clínicos com botão `X` para remoção individual.
  - `PatientDirectory.tsx` & `AdminDashboard.tsx`: Atualização da interface `PatientRecord` e dos manipuladores de criação e edição para persistir `objective`, `tags` e `pathologies`.
  - `styles.css`: Estilização utilitária de `.ygeia-select` e `.ygeia-country-dropdown`.

### 🔍 Tipografia Refinada e Densidade Compacta do Grid de Pacientes (Fiel ao Better Health)
- **Frontend Web (`apps/web`)**:
  - `PatientDirectory.tsx`:
    - Redução e calibragem precisa dos tamanhos de fontes e paddings para coincidir 1:1 com o padrão estético compacto do Better Health (`AdminRoutinePatientsSection.tsx`).
    - Cabeçalhos de coluna (`thead th`): Reduzidos para `fontSize: '0.6875rem'` (11px), `fontWeight: 600`, tracking `0.05em`, caixa alta e padding enxuto de `0.75rem 1.25rem`.
    - Nome do paciente: Reduzido de `0.875rem` / bold 700 para `fontSize: '0.8125rem'` (13px), `fontWeight: 600` e cor `#0f172a`.
    - Subtítulo de localização do atendimento: Ajustado para `fontSize: '0.6875rem'` (11px) com cor `#94a3b8`.
    - Avatar do paciente / iniciais: Dimensionamento refinado de `40px` para `36px` (`fontSize: 0.75rem`).
    - Informações de contato (e-mail e telefone) e CPF: Tipografia compacta em `fontSize: '0.75rem'` (12px) com ícones em `12px`.
    - Badges de Convênio e Acesso App: Tipografia reduzida para `fontSize: '0.6875rem'` (11px), `fontWeight: 500` e padding de `0.2rem 0.55rem`.
    - Células da tabela (`tbody td`): Padding vertical reduzido de `1rem` para `0.625rem 1.25rem` (10px vertical), proporcionando altura de linha elegante e compacta.
    - Botões de ações: Redução do padding para `0.35rem`, ícones em `14px` e largura da coluna sticky ajustada para `90px`.
    - Cards de métricas superiores: Ajuste do número de destaque de `1.625rem` para `1.375rem` (22px) com padding interno de `1rem 1.25rem`.
    - Barra de busca e filtro: Input em `fontSize: '0.8125rem'` (13px) e seletor em `0.75rem`.
  - `DataTablePagination.tsx`:
    - Altura e padding do rodapé de paginação ajustados para `0.625rem 1.25rem`.
    - Botões numéricos e de navegação compactados para `24px` de altura, com ícones em `14px` e tipografia `0.6875rem`.
  - `AppTable.tsx`:
    - Alinhamento de todos os grids genéricos do sistema para a mesma densidade visual enxuta (`fontSize: 0.6875rem` no cabeçalho e `0.75rem` nas células, padding `0.625rem 1.25rem`).

### 🛠️ Correção e Responsividade Avançada no Grid de Pacientes (Padrão Better Health)
- **Frontend Web (`apps/web`)**:
  - `PatientDirectory.tsx`:
    - Adicionada largura mínima explícita de `850px` na `<table>` com container `overflowX: 'auto'` e aceleração touch `-webkit-overflow-scrolling: touch`.
    - Implementada fixação estática lateral (*sticky column*) para a coluna **Ações** (`position: sticky; right: 0; zIndex: 1`), com sombra suave de sobreposição e fundo consistente no hover da linha, garantindo que os botões de edição e exclusão jamais sejam cortados ou comprimidos em qualquer largura de tela ou dispositivo móvel.
    - Prevenção de quebra de linha com `white-space: nowrap` e largura fixa de `110px` para a coluna de ações.
  - `AppTable.tsx`: Aplicada a mesma padronização de `min-width: 850px` e coluna de ações *sticky right* para todos os grids genéricos do sistema.
  - `AdminDashboard.tsx`: Ajuste no padding do contêiner da visualização para evitar margens duplas e compressão prematura da tabela.

### ⚙️ Resiliência da API Backend em Desenvolvimento Local
- **Backend API (`apps/api`)**:
  - `DatabaseService`: Tratamento gracioso de indisponibilidade temporária de conexão com o PostgreSQL em modo de desenvolvimento local, mantendo a API em execução contínua para rotas e serviços auxiliares enquanto o contêiner ou serviço de banco de dados é iniciado.

### 📱 Mobile First Integral, Padronização de Configurações & Menus Principais (Cadastros, Nutrição e Treinamento)
- **Frontend Web (`apps/web`)**:
  - **Arquitetura Mobile First em Todos os Componentes e Telas**:
    - `Sidebar.tsx`: Implementado menu lateral responsivo off-canvas drawer para telas `< 1024px`, com deslize suave via CSS transitions, backdrop escuro com `backdrop-filter: blur(4px)`, fechamento automático ao selecionar itens e botão de fechar (`X`). No desktop (`>= 1024px`), preservado o comportamento retrátil em 72px e 260px.
    - `Header.tsx`: Adicionado botão hamburger com padrão de acessibilidade táctil (`touch-target`, altura mínima 44px) visível exclusivamente no mobile para controle do drawer, além de layout elástico para breadcrumbs e títulos sem quebra ou overflow horizontal.
    - `AppLayout.tsx`: Orquestração reativa do estado do drawer mobile (`mobileSidebarOpen`) conectando o botão do Header com a Sidebar e o backdrop escurecido.
    - `NewPatientView.tsx`: Substituição do grid rígido de 12 colunas por layout fluido `ygeia-wizard-container`. No mobile, o stepper de 8 etapas agora atua como uma fita horizontal touch (`ygeia-wizard-stepper`) com scroll momentum sem barra visível. Inputs e seletores agrupados em `ygeia-grid-1-2` empilhando verticalmente em 1 coluna em telas `< 640px` e expandindo para 2 colunas em telas maiores.
    - `PatientDirectory.tsx`: Grid de métricas de topo reconfigurado com `ygeia-grid-metrics` (1 coluna em smartphones, 2 colunas em phablets/tablets, 4 colunas em desktops), barra de busca e filtro empilháveis no mobile e tabela com contêiner com rolagem touch horizontal `-webkit-overflow-scrolling: touch`.
  - **Refatoração Completa do Módulo de Configurações (`SettingsModule.tsx`)**:
    - Migração integral para o Design System Ygeía utilizando `AppCard`, `AppButton`, `AppInput` e `AppBadge`.
    - Eliminação completa de cores estáticas hardcoded (`#10b981`, `#ecfdf5`, `#059669`), adotando variáveis CSS reativas de tema (`var(--primary)`, `var(--primary-light)`, `var(--primary-border)`, `var(--primary-hover)`).
    - Layout mobile-first responsivo (`ygeia-settings-container` e `ygeia-settings-nav`), onde as categorias de navegação tornam-se pílulas horizontais touch no mobile e sidebar lateral no desktop.
    - Padronização de todas as sub-abas: Dados pessoais, Senha e Segurança, Secretárias & Equipe, Papel Timbrado, Sincronização Google Calendar e Estúdio White-Label.
  - **Novos Menus Principais no Menu Lateral & Workspaces Clínicos Conectados**:
    - **`Cadastros`**:
      - `cadastros_pacientes`: Acesso direto à carteira e wizard de pacientes idênticos ao padrão Better Health.
      - `cadastros_alimentos`: Tabela TACO (UNICAMP) pesquisável por nome e categoria com detalhamento de macronutrientes (Kcal, Proteínas, Carboidratos, Lipídios, Fibras).
      - `cadastros_suplementos`: Catálogo de suplementos clínicos e fitoterápicos com dosagens e posologias recomendadas (Creatina, Whey, Ômega-3, Vitamina D3+K2, Magnésio, CoQ10).
      - `cadastros_modelos`: Modelos de prescrição pré-configurados (Hipertrofia Limpa, Emagrecimento, Low FODMAPs, Mediterrânea).
      - `cadastros_locais`: Gestão de salas físicas e atendimento por telemedicina segura.
    - **`Nutrição`**:
      - `nutricao_tmb`: Calculadora bioenergética interativa em tempo real com as estratégias científicas `MifflinStJeorStrategy` e `HarrisBenedictStrategy` de `@ygeia/domain-core`, fator de atividade física, metas calóricas (-500 kcal déficit, +350 kcal superávit) e distribuição de macronutrientes recomendada pelo CFN.
      - `nutricao_cardapio`: Planejador de cardápios com fracionamento em refeições (Café da Manhã, Almoço, Lanche, Jantar) e cálculo calórico por refeição.
      - `nutricao_antropometria`: Avaliação de composição corporal (% gordura Pollock 7 e 3 dobras, Faulkner, circunferências e Relação Cintura-Quadril).
      - `nutricao_exames`: Painel de biomarcadores laboratoriais com faixas de referência clínica (Glicemia, HbA1c, Perfil lipídico, Vitamina D, Ferritina).
    - **`Treinamento`**:
      - Prescrição de treinos com divisão semanal ABCD, banco de exercícios com bi-sets, cadência, sobrecarga progressiva e tempo de descanso.

## [Unreleased] - 2026-11-21

### 💎 Aplicação Global de Tema Customizado White-Label & Migração Completa do Design Better Health
- **Frontend Web (`apps/web`)**:
  - **Motor de Tema Dinâmico Global (`branding.ts` & `styles.css`)**:
    - Implementação de `applyClinicTheme`: Injeta e sincroniza instantaneamente no elemento raiz `:root` do DOM (`document.documentElement.style`) as variáveis CSS essenciais (`--primary`, `--primary-rgb`, `--primary-hover`, `--primary-light`, `--primary-soft`, `--primary-border`, `--primary-glow`, `--secondary`, `--accent`, `--bh-primary`, `--bh-primary-hover`, `--bh-primary-soft`, `--bh-primary-border`, `--bh-shadow-focus`, `--font-sans`).
    - Ponte de estilos CSS no `styles.css` mapeando classes Tailwind (`.bg-emerald-50`, `.bg-emerald-500`, `.text-emerald-600`, `.border-emerald-500`, anéis de foco) diretamente para os tokens do tema personalizado, eliminando o problema de telas com estilos mesclados ou verdes hardcoded.
    - Higienização e substituição de cores fixas no `Header.tsx`, `Sidebar.tsx`, `AdminDashboard.tsx`, `SettingsModule.tsx` e componentes de UI para consumirem as variáveis de tema.
    - Remoção do bloqueio em `branding.ts` que forçava paletas azuis de volta para verde esmeralda.
  - **Recriação Fiel das Telas de Paciente a Partir do Projeto Better Health**:
    - `PatientDirectory.tsx`: Recriado com fidelidade milimétrica a partir de `AdminRoutinePatientsSection.tsx` do Better Health:
      - Cabeçalho com tag `ROTINA CLÍNICA`, título `Pacientes`, botão `+ Novo paciente` com `UserPlus`.
      - 4 cards de métricas de topo (Total Pacientes, App Conectado, Com Convênio, Particulares).
      - Barra de busca e filtro de convênio (*Todos os Pacientes*, *Apenas com Convênio*, *Apenas Particulares*).
      - Tabela de dados com avatar/iniciais, localização do atendimento, contatos com ícones de e-mail e telefone, CPF, badge de convênio, indicador de acesso ao app (`App Ativo` / `Pendente`) e ações de edição e exclusão.
      - Modal de confirmação de exclusão com backdrop blur.
    - `NewPatientView.tsx`: Wizard completo das 8 etapas adaptado fielmente de `AdminNewPatientWizard.tsx`:
      - Stepper vertical responsivo com 8 etapas (*Dados pessoais*, *Tratamento e protocolos*, *Convênio*, *Local de atendimento*, *Foto do paciente*, *Endereço completo*, *Observação importante*, *Atestado e recibo*).
      - Busca automática de CEP via ViaCEP com autopreenchimento de logradouro, bairro, cidade e estado.
      - Formatação e máscaras reativas de CPF, telefone brasileiro (+55) e data de nascimento.
      - Seleção de 10 protocolos e metas clínicas com pílulas interativas.
      - Toggles reativos para notificação de boas-vindas por e-mail e WhatsApp.
      - Suporte integral a criação (`mode="create"`) e edição (`mode="edit"`) de pacientes.
    - `DataTablePagination.tsx`: Componente de paginação idêntico ao do Better Health integrado ao design system.


### 🎨 Padronização de Design System, White-Label Studio & Módulos Clínicos Evolva
- **Frontend Web (`apps/web`)**:
  - **Biblioteca Unificada de Componentes UI (`src/components/ui/`)**:
    - `AppButton`: Padronização de botões do sistema com variantes (`primary`, `secondary`, `outline`, `danger`, `ghost`), tamanhos (`sm`, `md`, `lg`), estado de carregamento e suporte a ícones.
    - `AppInput`: Input unificado com suporte a rótulo, ícone frontal, sufixo de unidade médica (`kg`, `ml`, `mg`, `UI`), anel de foco e mensagens de validação.
    - `AppCard`: Contêiner com variantes padronizadas (`default`, `metric`, `highlight`, `flat`) com bordas suaves e elevação consistente.
    - `AppBadge`: Pílulas de status semânticas (`success`, `warning`, `danger`, `info`, `neutral`).
    - `AppModal`: Diálogo modal acessível com desfoque de fundo (backdrop blur), suporte a tecla Escape e rodapé padronizado.
    - `AppTable`: Grid paginado genérico `<T>` com busca integrada, dropdown de filtros rápidos, cabeçalhos em caixa alta, hover interativo, clique para edição e barra completa de paginação.
  - **White-Label & Color Studio Sênior (`WhiteLabelStudio.tsx`)**:
    - Substituição completa de seletores nativos básicos por experiência de estúdio profissional:
      - 6 paletas médicas curadas (Esmeralda, Azul Clínico, Ametista, Sálvia, Coral, Titanium).
      - Motor de harmonização automática calculando cores secundárias e de destaque matematicamente a partir da cor primária.
      - Validador em tempo real de contraste e conformidade WCAG 2.2 AA (relação mínima 4.5:1).
      - Simulador multi-telas em tela dividida com visualização em tempo real do *Dashboard*, da *Tela de Login* e do *App Mobile do Paciente*.
  - **Módulos Clínicos Portados do Projeto Evolva (`src/components/patient/`)**:
    - `BodyMapSVG`: Silhueta anatômica vetorial interativa com os 6 sítios subcutâneos de aplicação GLP-1, rotação automática, pulso no sítio recomendado e destaque do último aplicado.
    - `HydrationWidget`: Marcador radial circular SVG de hidratação, cálculo de $35\text{ ml/kg}$, contador de volume restante e botões rápidos (+250ml, +500ml, -250ml).
    - `NutritionCard`: Proteção de massa magra a $1.4\text{ g/kg}$, balanço calórico diário e colunas detalhadas dos 4 macronutrientes (Proteínas em destaque coral, Carboidratos, Gorduras e Fibras).
    - `WeightCard`: Evolução ponderal com peso inicial, atual e meta, contador de quilos eliminados e barra percentual de progresso.
    - `ActiveMedicationCard`: Monitoramento de caneta/ampola ativa de incretina (Tirzepatida/Semaglutida), conversão de cliques, dosagem em seringa U-100 e contagem regressiva de 30 dias de estabilidade microbiológica.
    - `DayStripSelector`: Carrossel horizontal de dias da semana com marcadores visuais de dose e hidratação diária.
    - `PatientPortal`: Portal do paciente completo integrando todos os componentes clínicos em layout responsivo de 2 colunas.
  - **Refatoração da Gestão de Pacientes (`PatientDirectory.tsx`)**:
    - Adotou `AppTable`, `AppButton`, `AppBadge` e `AppCard` mantendo 100% de fidelidade ao layout do mockup aprovado.

### 📑 Tela de Seleção de Pacientes (100% Fiel à Referência) & Suporte a Edição
- **Frontend Web (`apps/web`)**:
  - **Tela de Seleção de Pacientes (`PatientDirectory.tsx`)**:
    - Tipografia, espaçamentos e hierarquia visual correspondendo estritamente ao mockup fornecido:
      - Fonte oficial **Plus Jakarta Sans** com pesos e tamanhos milimetricamente alinhados (`11px` para badges e rótulos secundários, `28px` no título `Pacientes`, `13px` no subtítulo, `12px` nos títulos de cards e `26px` nos valores métricos).
      - Tag superior `ROTINA CLÍNICA` em cápsula com fundo menta (`#ecfdf5`) e texto verde esmeralda (`#059669`).
      - Botão `+ Novo paciente` com ícone `UserPlus`, cantos arredondados (`0.5rem`) e sombra suave esmeralda.
      - **4 Cards Resumo KPI**:
        - `Total Pacientes` com ícone de usuários em verde menta.
        - `App Conectado` com ícone de smartphone em azul céu.
        - `Com Convênio` com ícone de escudo em lilás/roxo.
        - `Particulares` com ícone de cartão/recibo em âmbar.
      - **Barra de Pesquisa & Filtros**:
        - Card branco independente com ícone `Search` e placeholder *"Buscar paciente por nome, CPF, e-mail ou telefone..."*.
        - Filtro dropdown *"Filtrar: Todos os Pacientes ▾"* (com opções de Ativos, Convênios, Particulares e App Ativo).
      - **Tabela de Dados**:
        - Colunas: `PACIENTE`, `CONTATO`, `CPF`, `CONVÊNIO`, `ACESSO APP`, `AÇÕES`.
        - Linha com avatar em círculo com iniciais, nome em destaque, consultório, contatos com ícones de e-mail e telefone, badge de convênio e badge `🟢 App Ativo`.
        - Coluna de Ações com botão de Lápis (edição) e Lixeira (remoção).
        - **Abertura para Edição**: Clicar na linha do paciente ou no ícone de lápis carrega diretamente a tela de edição do paciente com todos os dados preenchidos.
      - **Rodapé de Paginação**:
        - Exibição de registros *"Exibindo 1-1 de 1 registros"*, seletor de *"Itens por página: 10 ▾"*, e controles de navegação `<<`, `<`, `1`, `>`, `>>`.
  - **Suporte a Edição de Paciente (`NewPatientView.tsx`)**:
    - Suporte aos modos `create` e `edit` com preenchimento reativo de todos os campos a partir do paciente selecionado (`initialPatient`).
    - Campos de sexo de referência para cálculos com nota clínica, sexo atribuído ao nascimento e identidade de gênero opcional.
    - Botão de ação alternando entre `Cadastrar` e `Salvar alterações`.
    - Integração de persistência no backend via `PUT /api/v1/patients/:id` e atualização em tempo real no dashboard.
  - **Higienização de Marca & Identidade Visual**:
    - Remoção absoluta de referências legadas para a marca oficial **Ygeía (Υγεία)** no cabeçalho, sidebar e fluxos de navegação.
- **Frontend Web (`apps/web`)**:
  - **Grid Paginado de Pacientes (`PatientDirectory.tsx`)**:
    - Tela principal do menu `Rotina -> Pacientes` contendo cabeçalho com contagem, busca por nome, CPF e e-mail, filtros de status (*Todos*, *Ativo*, *Inativo*) e exportação.
    - Tabela completa com seleção de linha, avatar com iniciais, CPF, telefone formatado, objetivo clínico, badge de status e ação de acesso direto ao prontuário.
    - Controles de paginação completos (*Anterior*, *Próxima*, seleção de itens por página de 8/15/30 e numeração de páginas).
  - **Tela Integrada de Cadastro de Paciente (`NewPatientView.tsx`)**:
    - Renderizada diretamente na área de trabalho da aplicação com Sidebar e Header preservados, correspondendo com precisão ao layout de `media_1795311187219_22060d3a.jpg`.
    - Badge `PACIENTES`, título, subtítulo, botão `Fechar` no canto superior direito para retorno imediato ao grid.
    - Formulário em 2 colunas com stepper vertical e botões de ação `Cancelar`, `Continuar` e `Cadastrar`.
  - **Conexão Dinâmica no Dashboard (`AdminDashboard.tsx`)**:
    - Transição entre Card 1, Grid Paginado e Formulário de Cadastro via botões `Ver todos os pacientes →` e `+ Cadastrar paciente`.

### 👥 Módulo de Cadastro de Pacientes & Stepper Clínico
- **Frontend Web (`apps/web`)**:
  - **Componente Modal `NewPatientModal.tsx`**:
    - Implementação de fidelidade estrita ao design do mockup `Novo paciente`:
      - **Navegação Lateral por Etapas**: Stepper vertical com 8 etapas: *Dados pessoais* (com indicador visual verde esmeralda e fundo mint), *Tratamento e protocolos*, *Convênio*, *Local de atendimento*, *Foto do paciente*, *Endereço completo*, *Observação importante* e *Atestado e recibo*.
      - **Etapa de Dados Pessoais**:
        - Campo obrigatório de nome completo.
        - Data de nascimento e seleção de sexo de referência para cálculos (com nota orientativa clínica).
        - Seleção de sexo atribuído ao nascimento e identidade de gênero opcional.
        - E-mail e telefone com seletor de DDI (`🇧🇷 +55`) e formatação em tempo real.
        - CPF do paciente, nome e CPF do responsável para menores de idade.
        - Seção de mensagens de boas-vindas com switches interativos para envio automático por e-mail e WhatsApp.
      - **Ações e Atalhos**: Botões `Cancelar` e `Cadastrar`, links de rodapé para importação de prontuários externos e suporte via WhatsApp.
  - **Integração no Painel Administrativo (`AdminDashboard.tsx`)**:
    - Acionamento direto do modal ao clicar no botão `+ Cadastrar paciente` do card principal ou através do menu `Rotina -> Pacientes`.
    - Atualização reativa da lista de pacientes em tela após a confirmação do cadastro.
- **Backend API (`apps/api`) & Banco de Dados**:
  - **Migração SQL `0003_patients_schema.sql`**:
    - Criação da tabela `patients` com suporte completo a dados pessoais, identificação civil, sexo biológico, identidade de gênero, contatos, dados de responsáveis e preferências de notificação.
    - Isolamento multi-tenant obrigatório via PostgreSQL Row-Level Security (`FORCE ROW LEVEL SECURITY`) com a política `tenant_isolation_patients`.
    - Índices otimizados por `tenant_id` com `full_name`, `email` e `cpf`.
  - **Módulo NestJS de Pacientes (`PatientsModule`, `PatientsService`, `PatientsController`)**:
    - Endpoints: `POST /api/v1/patients` para inserção transacional e `GET /api/v1/patients` para busca e listagem filtrada por tenant.

### 🌿 Identidade Visual Oficial Ygeía na Tela de Login & Sistema
- **Frontend Web (`apps/web`)**:
  - **Customização do Nome e Paleta Oficial**:
    - Substituição do nome e textos herdados de mockups externos pelo nome oficial do produto: **Ygeía (Υγεία)** e slogan *"Nutrição Clínica & Governança Metabólica"*.
    - Transição da paleta azul royal para a identidade verde esmeralda / floresta médica do Ygeía:
      - Cor Primária: `#059669` (Verde Esmeralda).
      - Cor Secundária: `#064e3b` (Verde Floresta Profundo).
      - Cor de Destaque: `#10b981` (Menta Vibrante).
    - Gradiente imersivo do painel Hero adaptado para o tom floresta/esmeralda com reflexos em menta.
  - **Aprimoramento de Textos e Placeholders**:
    - Texto explicativo atualizado para o contexto real de Nutricionista, Administrador e Paciente.
    - Placeholder do campo de e-mail atualizado para `admin@ygeia.com.br`.
    - Sanitização e migração transparente de valores legados em `localStorage` para a nova paleta e nome sem requerer limpeza manual de cache.

### 🔌 Reconfiguração e Isolamento das Portas de Desenvolvimento
- **Monorepo & Infraestrutura (`docker-compose.yml`, `apps/api`, `apps/web`, `apps/mobile`)**:
  - **Prevenção de Colisões**: Migração completa das portas padrão para faixas exclusivas e desimpedidas, evitando conflitos com outros projetos locais:
    - **Frontend Web**: Migrado de `5173` para `5190` (`http://localhost:5190`).
    - **Backend API**: Migrado de `3333` para `4333` (`http://localhost:4333`).
    - **Mobile App Metro**: Migrado de `8082` para `8095` (`http://localhost:8095`).
    - **PostgreSQL 16 (Docker)**: Porta externa mapeada de `5434` para `5440` (`localhost:5440`).
    - **Redis 7 (Docker)**: Porta externa mapeada de `6379` para `6385` (`localhost:6385`).
  - **Sincronização de Variáveis de Ambiente & Configurações**:
    - Atualização dos arquivos `.env` e `.env.example` da API e da Web.
    - Criação de `vite.config.ts` com tipagem de variáveis de ambiente em `src/vite-env.d.ts` para conexão com a nova porta da API.

### 🏥 Redesenho Executivo do Painel Administrativo & Menu Lateral Bidirecional
- **Frontend Web (`apps/web`)**:
  - **Novo Menu Lateral Executivo (`Sidebar.tsx`)**:
    - **Expansão e Colapso Bidirecional**:
      - **Horizontal**: Alternância suave entre modo expandido (260px) com labels, subtítulos e badges, e modo compacto (72px) em ícones com tooltips flutuantes instantâneos.
      - **Vertical (Acordeão)**: Menus aninhados para as categorias *Rotina* (Agenda, Pacientes, Daily, Acompanhamentos, Chat, Tarefas) e *Atendimento* (Formulário pré-consulta, Formulário pós-consulta) com setas indicativas de expansão e animação suave.
    - **Identidade Visual e Navegação**: Ícone de squircle com a marca clínica, busca inline (`Buscar no menu...`), seção `GOVERNANÇA & CLÍNICA`, itens diretos (*Gestão de Contas*, *Clube de Vantagens*, *Módulo de Treino*, *Configurações*, *Minha Conta Admin*), indicador de versão (`🟢 Versão v0.58.0`) e card inferior com avatar e botão de logout.
  - **Novo Top Header Executivo (`Header.tsx`)**:
    - Breadcrumb hierárquico com ícone Home, título bold, subtítulo contextual descritivo e badge em pílula translúcida verde *"🛡️ Acesso Administrativo Exclusivo"*.
  - **Dashboard de Pacientes em 2 Cards (`AdminDashboard.tsx`)**:
    - **Card Esquerdo**: Barra de busca de pacientes por nome/chave, listagem de pacientes cadastrados com avatar de iniciais, status ativo, rodapé com contagem total, link *"Ver todos os pacientes →"* e botão primário com ícone *"Cadastrar paciente"*.
    - **Card Direito**: Calendário horizontal da semana com seletor de dias interativo (`D 15`, `S 16`, ..., `S 21`) com botão de novo agendamento rápido `+`, e card de agendamento detalhado com status de confirmação e horário.
    - Respeito integral à cor primária e tipografia configurada no sistema.

### 🎨 Nova Tela de Login Split-Screen com Branding White Label Dinâmico
- **Frontend Web (`apps/web`)**:
  - **Redesenho Completo de `LoginPage.tsx` (Layout 50/50 em 2 Colunas)**:
    - **Coluna Esquerda (Hero Institucional)**: Fundo em gradiente imersivo que consome dinamicamente a paleta de cores (primária, secundária e destaque) configurada no painel de Configurações, badge translúcida *"🛡️ Acesso Seguro"*, headline de controle metabólico de precisão, card de destaque translúcido *"Curva histórica do Peso Inicial até o Peso Atual"* e identificação de software seguro.
    - **Coluna Direita (Formulário Limpo)**: Fundo branco, link de retorno à landing page, campos de entrada com ícones (`Mail` e `Key`), alternador de visibilidade de senha (olho), link *"Esqueci minha senha"* e botão *"Continuar para o Portal"* estilizados com a cor primária configurada.
  - **Módulo de Sincronização de Branding (`branding.ts`)**:
    - Centralização e sincronização reativa entre `SettingsModule`, `AppLayout`, `Sidebar` e `LoginPage` via storage e eventos globais (`ygeia_branding_updated`).
    - Substituição da cor azul estática por renderização adaptativa que respeita as preferências White Label selecionadas pelo nutricionista.

### 🔔 Sistema de Notificações Toast & Tratamento Padronizado de Erros da API
- **Frontend Web (`apps/web`)**:
  - **Motor de Tratamento e Normalização de Erros (`api-error-handler.ts`)**:
    - Parser universal capaz de processar `Response`, `Error`, payloads NestJS `{ statusCode, message, error }` e strings simples.
    - Dicionário semântico com mapeamento completo de status HTTP (400, 401, 403, 404, 409, 422, 429, 500, 502, 503) e tradução de mensagens técnicas para linguagem amigável em português.
    - Suporte a extração de listas detalhadas de validação Zod e detecção de falhas de conexão/rede (`Failed to fetch`).
  - **Sistema de Notificações Toast Reativo (`ToastContext`, `ToastContainer`, `ToastItem`)**:
    - Hook `useToast()` com métodos utilitários `toast.success()`, `toast.error()`, `toast.warning()` e `toast.info()`.
    - Barra de progresso animada com auto-dismiss configurável, pausa ao passar o cursor (`pauseOnHover`), fechamento manual e suporte a subdetalhes expansíveis para múltiplos erros de validação.
    - Contêiner fixo com empilhamento máximo de 4 notificações simultâneas.
    - Integração no `LoginPage` e `SettingsModule`, eliminando `alert()` nativo e banners estáticos fragmentados.

### 🧹 Limpeza Profunda: Eliminação Completa do Modo Demo & Refatorações de UX
- **Backend API (`apps/api`) & Banco de Dados**:
  - Remoção definitiva do seeder automático de dados de demonstração (`seedDefaultData`) que gerava a clínica fictícia `demo-clinica` e os usuários `admin@ygeia.com` e `paciente@ygeia.com`.
  - Remoção do fallback hardcoded para `demo-clinica` no endpoint `GET /api/v1/tenants/branding`, passando a retornar objeto de identidade padrão do sistema com tipagem estrita.
  - Expurgados do banco de dados PostgreSQL (`ygeia_db`) todos os registros da clínica demo e seus usuários atrelados.
- **Frontend Web (`apps/web`)**:
  - **Eliminação de Atalhos e Botões Demo**: Remoção total dos botões de login rápido em 1-clique com credenciais de teste (`handleQuickBrunoDemo`, `handleQuickAdminDemo`, `handleQuickPatientDemo`), divisores visuais e rótulos de demonstração em `LoginPage.tsx`.
  - **Limpeza do Cabeçalho (`Header.tsx`)**: Remoção dos controles de simulação de licenças ativas ("Licenças: Nutri ✓ Treino ✓"), deixando a barra superior limpa e focada exclusivamente no contexto de sessão e perfil do profissional.
  - **Ajuste de Parâmetros**: Atualização de placeholders e textos para consultório real sem referências à clínica demo.

### 🛠️ Configurações, Reformulação de Autenticação & Limpeza de UX
- **Frontend Web (`apps/web`)**:
  - **Módulo Unificado de Configurações (`SettingsModule`)**:
    - Layout em 2 colunas com navegação categorizada e busca em tempo real (`Procurar`).
    - Categorias estruturadas: `CONTA` (Dados pessoais, Senha, 2FA, Idioma, Zona de perigo), `ATENDIMENTO` (Locais, Tratamentos/tags, Google Calendar, Meus links, Secretárias), `DOCUMENTOS E ASSINATURA` (Papel timbrado, Imagem da assinatura, ICP-Brasil, Cartão CNPJ) e `APARÊNCIA` (Personalização White Label, PDF, App do Paciente, Meu menu).
    - Tela de Dados Pessoais com preview da foto do perfil, botão de edição/cancelamento e dados cadastrais do nutricionista (Nome, Email, Telefone, CRN, CPF/CNPJ, Especialidades e Endereço).
  - **Página de Login Dedicada & Fim dos Modais (`LoginPage`)**:
    - Substituição do modal de login flutuante por tela inteira exclusiva para autenticação profissional e de pacientes.
    - Seletor de perfil em abas (`🩺 Área do Nutricionista` e `🍎 Portal do Paciente`) com botões de 1-clique para teste rápido de credenciais.
    - Combo dropdown na Navbar para navegação direta ao login desejado.
  - **Eliminação de Recursos de Teste ("Experimentar" / 14 dias grátis)**:
    - Remoção de formulários de registro público de clínica (modelo privado SaaS B2B) e CTAs de teste gratuito na Navbar, Footer e telas de login.
    - Isolamento de sessão: login obrigatório para acesso aos painéis de admin e paciente, eliminando navegação de retorno à landing page sem logout formal.
  - **Aprimoramentos de Sidebar & Header**:
    - Remoção do prefixo "Módulo" dos menus laterais.
    - Controle retrátil da Sidebar (264px expandido / 72px recolhido) com preservação e restauração visual das descrições.
    - Remoção do seletor manual de papel no Header, mantendo apenas indicador contextual da sessão ativa.

## [0.1.0] - 2026-11-21

### 🏥 Fase 2 (Configuração da Clínica, Perfil do Nutricionista CRN, White Label Studio & Equipe RBAC)
- **Backend API (`apps/api`)**:
  - Migração de banco de dados `0002_tenant_setup_and_team.sql`:
    - Tabela `tenant_settings` para dados cadastrais e fiscais (CNPJ/CPF, razão social, WhatsApp, endereço completo).
    - Tabela `nutritionist_profiles` com validação de registro legal obrigatório perante o CFN (CFN Res. 600/2018), especialidades e flag de Responsável Técnico.
    - Evolução da tabela `tenant_branding` com `dark_logo_url`, `accent_color` e `letterhead_template_url`.
    - Tabela `team_invitations` com tokens criptográficos (SHA-256) de 48h de validade.
    - Imposição e habilitação forçada de **Row-Level Security (RLS)** em todas as novas tabelas com grant para `ygeia_app`.
  - Novos endpoints REST em `TenantsController`:
    - `GET /api/v1/tenants/settings` e `PUT /api/v1/tenants/settings` (dados cadastrais)
    - `GET /api/v1/tenants/profile` e `PUT /api/v1/tenants/profile` (perfil profissional & CRN)
    - `PUT /api/v1/tenants/branding` (atualização de cores, tipografia e logos White Label)
    - `GET /api/v1/tenants/team` e `POST /api/v1/tenants/team/invite` (gestão e convites de equipe)
  - Seeder de demonstração automático na inicialização: clínica `Ygeía Clínica Modelo` (`demo-clinica`) e usuária `admin@ygeia.com` / `senha123456` (`CLINIC_OWNER`).
- **Frontend Web (`apps/web`)**:
  - **Painel Administrativo da Clínica (`AdminDashboard`)**:
    - **White Label Studio**: personalização em tempo real de cores (primária, secundária, destaque), tipografias e logotipos, com pré-visualização ao vivo do timbrado de prescrição e do topo do aplicativo mobile do paciente.
    - **Dados Cadastrais da Clínica**: formulário completo de dados jurídicos (Razão Social, Nome Fantasia, CNPJ, WhatsApp comercial, endereço completo).
    - **Perfil Profissional & CRN**: dados do nutricionista, número do CRN (Res. CFN 600/2018), seleção de região do conselho (CRN-1 a CRN-11), especialidades em tags interativas e mini-bio.
    - **Gestão de Equipe & RBAC**: listagem de colaboradores com seus papéis (`CLINIC_OWNER`, `ADMIN`, `NUTRITIONIST`, `SECRETARY`), aviso de sigilo médico LGPD/CFN (bloqueio de prontuários para secretárias) e gerador de convites com link de ativação copiável.
  - **Modal de Autenticação (`AuthModal`)**:
    - Botão de acesso rápido em 1-clique para teste da clínica modelo (`Dra. Sofia Alencar`).
    - Abas para login e cadastro de nova clínica SaaS.
  - **Simulador Científico Interativo (`@ygeia/domain-core`) Totalmente Reformulado**:
    - **Cálculo de IMC & Classificação OMS**: Avaliação antropométrica instantânea com badge de estado nutricional (Eutrofia, Sobrepeso, Obesidade).
    - **Gasto Energético Total (GET / TDEE)**: Incorporação de fator de atividade física FAO/OMS (1.2 a 1.9).
    - **Objetivo Clínico Prescritivo**: Ajuste de meta calórica para Emagrecimento (-400 kcal), Manutenção ou Hipertrofia (+350 kcal).
    - **Presets Clínicos em 1-Clique**: Botões rápidos para *Hipertrofia* (2.2 g/kg), *Cutting* (2.0 g/kg), *Low Carb* e *Equilibrada*.
    - **Entrada Numérica Direta e Sliders Híbridos**: Permite tanto arrastar controles quanto digitar gramas ou medidas exatas.
    - **Balanço Calórico e Ajuste Automático**: Comparação visual entre VET dos macronutrientes e a Meta Calórica Alvo com botão de ajuste automático em carboidratos.
  - **Arquitetura de Navegação Modular & AppLayout**:
    - `AppLayout`: Layout base com Menu Lateral Esquerdo Retrátil Inteligente (264px expandido / 72px recolhido) e cabeçalho responsivo.
    - `Sidebar` Modular em 4 blocos de governança estrita:
      1. **Cadastros Gerais** (Universal/Sempre Ativo): Pacientes & Alunos CRM, Agenda, Avaliação Física e Cofre de Exames AES-256.
      2. **Nutrição** (Condicionado à Licença): Prescritor Nutricional, Tabela TACO, Biblioteca de Receitas e Suplementação.
      3. **Treinamento** (Condicionado à Licença): Prescritor de Treinos A/B/C/D, Banco de Exercícios, Periodização/1RM e Cardio.
      4. **Configurações** (Universal/Sempre Ativo): White Label Studio, Dados da Empresa, Perfil CRN/CREF e Equipe RBAC.
    - Seletor em tempo real no cabeçalho para alternar entre **Área do Nutricionista / Admin** e **Área do Paciente**, com simulador de licenças modulares (*Nutri*, *Treino* ou *Combo Completo*).
    - `PatientPortal`: Portal do paciente estilo *Apple Health* com anel interativo de hidratação (+250ml/+500ml), timeline de refeições com botões de substituição flexível de alimentos e painel de exames laboratoriais criptografados.
  - Conexão do botão "Entrar / Painel Admin" na Navbar com feedback de usuário logado.
- **Validação Compartilhada (`packages/validation-schemas`)**:
  - Zod schemas para `updateTenantSettingsSchema`, `updateNutritionistProfileSchema`, `updateTenantBrandingSchema`, `inviteTeamMemberSchema` e `registerClinicSchema`.

### 🌐 Plataforma & Monorepo Geral
- **Setup e Governança**:
  - Configuração do Monorepo com **Turborepo** e **pnpm workspaces**.
  - Versão única governada centralmente pelo `package.json` raiz (`"version": "0.1.0"`).
  - Script oficial de sincronização automatizada `scripts/sync-versions.ts` (`pnpm version:sync`).
  - Configuração de **Husky** com hooks `pre-commit` (`pnpm test` automatizado) e `commit-msg` (**Commitlint** com Conventional Commits v1.0.0).
  - Docker Compose local com **PostgreSQL 16** (porta 5434) e **Redis 7** (porta 6379).

### ⚙️ Backend API (`apps/api`)
- **Fase 1 (Multi-Tenancy, IAM, RLS e Autenticação)**:
  - Modelagem relacional e migrations das tabelas `tenants`, `tenant_domains`, `tenant_branding`, `users`, `refresh_tokens` e `audit_logs`.
  - Configuração de **Row-Level Security (RLS)** no PostgreSQL com `current_setting('app.current_tenant_id')`, isolando dados entre clínicas com usuário não-superuser `ygeia_app`.
  - Hashing de senhas com **Argon2id** (64MB memória, 3 iterações) e serviço de tokens JWT com expiração de 15 minutos.
  - Mecanismo de **Refresh Token com rotação automática e detecção de reuso** (revogação de toda a família de sessões em caso de sequestro).
  - Middleware de resolução de Tenant com `AsyncLocalStorage` via header `x-tenant-id` ou Host header (subdomínios e domínios próprios).
  - Endpoints `/api/v1/auth/register-clinic`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/me` e `/api/v1/tenants/branding`.
  - Bateria de testes unitários de segurança passando (Argon2id e JWT Token Service).

### 💻 Frontend Web (`apps/web`)
- **Landing Page Institucional Completa & Mobile-First**:
  - Destaque comercial e técnico das vantagens para clínicas e consultórios:
    - **Exames Laboratoriais Criptografados**: Criptografia de ponta a ponta (AES-256) e URLs pré-assinadas temporárias (15 min).
    - **SaaS 100% White Label**: Domínio próprio (`app.suaclinica.com.br`), cores, logo e PDFs personalizados.
    - **Prontuário CFN & LGPD**: Conformidade com resoluções CFN 306/2003 e 600/2018 com auditoria indelével.
    - **Motor Antropométrico & TMB**: Strategy Pattern ao vivo com Mifflin-St Jeor e Harris-Benedict.
    - **Tabela TACO Oficial & Cardápios**: Integração com TACO (Unicamp) e cálculo em tempo real.
    - **App Mobile React Native Offline-First**: Diário fotográfico, água e biometria nativa.
    - **Segurança de Nível Bancário**: PostgreSQL RLS, Argon2id e Cookies HttpOnly.
  - **Simulador Científico Interativo** embutido, executando cálculos ao vivo no navegador com `@ygeia/domain-core`.
  - Preview interativo do aplicativo móvel do paciente.
- Setup inicial da aplicação em **React 19** com **Vite** e TypeScript 5.x.
- Diretrizes estritas de **Mobile-First Responsive Design** e consumo dos design tokens White Label.
- Arquivo de configuração `.env.example`, `index.html`, `src/main.tsx` e `README.md` com instruções completas e changelog embutido.

### 📱 Aplicativo Mobile (`apps/mobile`)
- Setup inicial do app nativo em **React Native** com **Expo CNG** (Continuous Native Generation) e TypeScript.
- Configuração do `app.json` sincronizado com a versão central do Monorepo via script.
- Estrutura para `expo-secure-store`, `expo-local-authentication` (Face ID/Touch ID) e persistência offline com MMKV.
- Arquivo `README.md` com instruções de execução e changelog embutido.

### 🧠 Domínio Puro (`packages/domain-core`)
- Value Object `Macronutrients` com cálculo de VET e proporções calóricas (100% testado).
- Strategy Pattern para cálculo de Gasto Energético (TMB): `MifflinStJeorStrategy` e `HarrisBenedictStrategy` (100% testado).
- Zero acoplamento com frameworks ou banco de dados (Clean Architecture).

### 📐 Esquemas de Validação (`packages/validation-schemas`)
- Esquemas de validação Zod compartilhados: `loginSchema` e `createPatientSchema`.
- Inferência estrita de tipos TypeScript consumidos por Back, Web e Mobile.

### 📚 Documentação & Regras (`docs/`)
- **Evolução do Roadmap SaaS (Fase 2 Antecipada)**:
  - Inserção da **Fase 2: Configuração da Clínica, Perfil do Nutricionista (CRN), White Label Studio & Equipe (RBAC)** antes da gestão de pacientes.
  - Especificação das regras de negócio do onboarding SaaS: dados cadastrais (CNPJ/CPF, WhatsApp), exigência de CRN ativo (Res. CFN nº 600/2018), White Label Studio (contraste WCAG 2.2 AA) e matriz de permissões RBAC com sigilo médico para recepcionistas.
- Criação da central de documentação em `docs/`:
  - `docs/arquitetura/DOCS_ARQUITETURA_YGEIA.md` (Estudo arquitetural completo, DDD, Hexagonal, OWASP e Roadmap).
  - `docs/regras/fluxo-desenvolvimento.md` (Pipeline de 6 fases: Plano > Autorização > Desenvolvimento > Testes > Versionamento > Publicação).
  - `docs/regras/regras-negocio.md` (SaaS White Label, prontuário, resoluções CFN e conformidade LGPD).
  - `docs/regras/seguranca-apis.md` (Defense in depth, Postgres RLS, Argon2id, JWT rotation, Cookies HttpOnly).
  - `docs/regras/padroes-mobile-web.md` (Mobile-First 48px, thumb zone, offline-first e biometria).
  - `docs/regras/versionamento-governanca.md` (Governança SemVer, sync automatizado e regras de commit).
