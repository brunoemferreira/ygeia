# Diretrizes e Regras do Projeto — Ygeía (Υγεία)

Este documento estabelece as regras e padrões de engenharia para qualquer agente ou desenvolvedor atuando neste repositório.

## 1. Regra Obrigatória de Changelog
- **Sempre atualizar o changelog dos projetos**: A cada nova feature, refatoração, correção de bug ou alteração estrutural, é obrigatório registrar a alteração no `CHANGELOG.md` da raiz e no `CHANGELOG.md` do pacote/aplicação afetado (ex: `apps/web/CHANGELOG.md`, `apps/api/CHANGELOG.md`, etc.).
- **Formato**: Seguir o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Versionamento Semântico](https://semver.org/).
- **Clareza**: Descrever o impacto técnico e o valor de negócio das alterações com clareza em português.

## 2. Padrões de Commit
- **Conventional Commits**: Seguir estritamente a especificação (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- Mensagens de commit devem ser concisas e em minúsculas (ex: `feat(web): add settings module with category submenus`).

## 3. Segurança e Isolamento Multi-Tenant
- Isolamento estrito entre Tenant e Usuários via Row-Level Security (RLS) no PostgreSQL.
- Criptografia com Argon2id para senhas e tokens com rotação e detecção de reuso.
- Nenhum usuário deslogado pode acessar áreas protegidas do Nutricionista ou Paciente.

## 4. Manutenção Obrigatória do Documento de Segurança (`SECURITY.md`)
- A cada nova funcionalidade, alteração em fluxos de autenticação, criptografia, cabeçalhos de rede, isolamento multi-tenant ou atualização/patch de segurança, é **obrigatório atualizar o arquivo `SECURITY.md`** na raiz do repositório.
- Manter o inventário de proteções ativas e o plano de segurança anti-invasão sempre sincronizados com o código-fonte dos 3 projetos (`apps/api`, `apps/web` e `apps/mobile`).

## 5. Regra Estrita de UX/UI Design Sênior Especialista em Nutrição Clínica Geral, Nutrição Esportiva e Treinamento Físico
- **Atuação Obrigatória como UX/UI Designer Sênior Especialista**: O agente ou desenvolvedor DEVE atuar como um **Senior Product UX/UI Designer** com ampla experiência e histórico comprovado no desenvolvimento de plataformas web e aplicativos móveis para as áreas de **Nutrição Clínica Geral, Nutrição Esportiva, Composição Corporal e Treinamento Físico**.
  - **Equilíbrio e Abordagem Dual Adaptativa (Clínico Geral vs. Esportivo de Alta Performance)**:
    - O Ygeía **NÃO** é exclusivo para atletas. O software atende com idêntico rigor e excelência:
      1. **Público Clínico Geral / População Convencional**: Pessoas comuns buscando emagrecimento sustentável, reeducação alimentar, qualidade de vida, controle de doenças crônicas (diabetes, hipertensão, dislipidemia, esteatose hepática), saúde intestinal, idosos e gestantes. Para esse público, a interface DEVE ser acolhedora, descomplicada, com cálculos acessíveis (Mifflin-St Jeor, Harris-Benedict, OMS), distribuição balanceada de macros em percentuais e gramas, lista prática de substituições do dia a dia e metas realistas de hábitos, sem assustar o paciente com jargões ou complexidades esportivas desnecessárias.
      2. **Público Esportivo & Atletas de Alta Performance**: Atletas amadores e profissionais, praticantes de musculação avançada, crossfit, corrida, lutas e endurance. Para esse público, a plataforma disponibiliza todo o arsenal analítico: equações preditivas baseadas em massa magra (Cunningham, Katch-McArdle, Tinsley), macronutrientes em `g/kg/dia` (padrão ISSN), modulação de carboidratos peri-treino (*nutrient timing*), periodização de dias de treino vs. descanso e suplementação ergogênica.
    - O sistema deve permitir ao nutricionista selecionar intuitivamente o perfil/objetivo do paciente ou alternar com fluidez entre ferramentas clínicas gerais e esportivas avançadas sem fricção.
  - **Ergonomia e Eficiência no Atendimento**:
    - **Minimização de Fricção e Cliques**: O nutricionista precisa atender o paciente/atleta sem perder contato visual. Formulários e grids devem permitir preenchimento fluido, atalhos de teclado, dados essenciais escaneáveis sem rolagem excessiva e auto-cálculos automáticos em tempo real.
    - **Domínio dos Fluxos Clínicos e Esportivos**:
      - Calculadoras de VET com alternância inteligente de fórmulas (Mifflin, Harris, Cunningham, Katch-McArdle).
      - Distribuição de macronutrientes flexível: visualização simultânea em % calórico, gramas totais e `g/kg/dia`.
      - Módulo peri-treino e suplementação quando o paciente pratica exercícios físicos regulares ou treinos intensos.
    - **Antropometria, Composição Corporal & Evolução Física**:
      - Apresentação visual limpa e comparativa de protocolos antropométricos (IMC e circunferências para público geral; Pollock 3 e 7 dobras, Faulkner, Guedes, Bioimpedância tetrapolar para esportistas).
      - Gráficos temporais de evolução (peso, % de gordura, massa livre de gordura e massa muscular esquelética).
    - **Experiência do Paciente e Atleta (Mobile First)**:
      - Telas motivadoras e intuitivas no aplicativo móvel: visualização do plano alimentar por horários, listas de substituição de alimentos em um toque, diário de fotos de refeições, metas de hidratação com feedback tátil e acompanhamento de adesão à dieta adaptado à rotina do paciente.
  - **TODOS os componentes do software DEVEM ter rigorosamente o mesmo padrão visual**:
    - **Campos de Edição / Inputs (`AppInput`)**:
      - Altura padronizada: `minHeight: 38px`.
      - Borda e raio: `1px solid #cbd5e1`, `borderRadius: 0.5rem` (8px).
      - Tipografia: `0.8125rem` (13px), fonte `'Plus Jakarta Sans', system-ui, sans-serif`, peso normal/500, cor `#0f172a`, placeholder `#94a3b8`.
      - Foco e ativação: borda `var(--primary)` e anel de foco `box-shadow: 0 0 0 3px var(--primary-light)`.
      - Labels: `fontSize: 0.8125rem`, `fontWeight: 700`, cor `#0f172a`, asterisco obrigatório em `#ef4444`.
    - **Caixas de Seleção / Combos (`AppSelect`)**:
      - **IDÊNTICOS AOS EDITS**: Mesma altura (`minHeight: 38px`), mesmo raio de borda (`0.5rem`), mesmo padding, mesma borda e anel de foco `box-shadow: 0 0 0 3px var(--primary-light)`.
      - Ícone chevron indicador discreto à direita (`#94a3b8`).
      - **É ESTRITAMENTE PROIBIDO** criar elementos `<select>` nativos crus com estilos avulsos ou alturas divergentes. Sempre utilizar o componente unificado `AppSelect`.
    - **Áreas de Texto Multilinha (`AppTextarea`)**:
      - Seguir exatamente a mesma borda, raio (`0.5rem`), tipografia e anel de foco `box-shadow: 0 0 0 3px var(--primary-light)`.
    - **Uso Obrigatório das Cores da Configuração (White Label)**:
      - NUNCA usar cores primárias estáticas (ex: `#059669` hardcoded) em elementos de interação, foco de inputs, abas, botões primários ou seleções.
      - Utilizar SEMPRE as variáveis CSS do tema: `var(--primary)`, `var(--primary-hover)`, `var(--primary-light)`, `var(--primary-border)`.
    - **Auditoria Obrigatória Pré-Entrega**:
      - A cada nova funcionalidade, alteração em tela existente ou criação de nova tela, o agente/desenvolvedor DEVE OBRIGATORIAMENTE revisar todos os componentes da tela (edits, combos, botões, modais, tabelas) e certificar-se de que estão 100% aderentes ao Design System unificado e à usabilidade especializada da área de nutrição e treinamento físico. Nenhuma tela com inputs desalinhados, jargões confusos ou cores estáticas divergentes pode ser entregue.

## 6. Regra Estrita de Banco de Dados & DBA Sênior PostgreSQL Obrigatório
- **Atuação Obrigatória como DBA Sênior de PostgreSQL**: Toda estrutura de banco de dados, DDL (tabelas, colunas, chaves, enums, tipos), migrações e comandos SQL (queries, inserts, updates, deletes) criados ou modificados no projeto DEVEM ser minuciosamente revisados sob a ótica de um DBA sênior de PostgreSQL, avaliando necessidade de tunning, indexação, concorrência e conformidade com as melhores práticas de engenharia de dados.
  - **Indexação Obrigatória de Foreign Keys**: Nenhuma chave estrangeira (`REFERENCES`) pode existir sem um índice correspondente na tabela filha. Índices de FK são essenciais no PostgreSQL para evitar locks de tabela (`ShareRowExclusiveLock`) em operações de exclusão ou atualização na tabela pai e evitar sequential scans em joins frequentes.
  - **Composição de Índices com Isolamento Multi-Tenant (RLS)**: Em tabelas com Row-Level Security, o `tenant_id` DEVE ser obrigatoriamente a primeira coluna (coluna líder) de qualquer índice composto (ex: `(tenant_id, email)`, `(tenant_id, created_at DESC)`, `(tenant_id, status)`), permitindo que o planejador utilize Index Scans restritos ao tenant.
  - **Aceleração de Buscas Textuais com Trigramas (`pg_trgm`)**: Consultas com `ILIKE '%termo%'` ou `LOWER(coluna) LIKE '%termo%'` não utilizam índices B-tree convencionais. Devem ser empregados índices `GIN` com a classe de operadores `gin_trgm_ops` da extensão `pg_trgm` para buscas parciais eficientes em prontuários, nomes de pacientes e catálogos.
  - **Proibição de `SELECT *` em Produção**: Consultas na camada de repositório e serviços devem explicitar nominalmente cada coluna necessária, otimizando I/O de rede, cache de buffers (`shared_buffers`) e permitindo consultas do tipo *Index-Only Scan*.
  - **Tipagem e Modelagem Robusta**:
    - Utilizar sempre `TIMESTAMPTZ` (com fuso horário) para qualquer data/hora.
    - Utilizar tipos numéricos com escala e precisão explícitas (`NUMERIC(p, s)`) para medidas antropométricas, calorias e dosagens nutricionais (evitar `FLOAT` ou `DOUBLE PRECISION` sujeitos a imprecisões binárias).
    - Defaults sensatos com `NOT NULL` defensivo e constraints `CHECK` e `UNIQUE` para garantir integridade a nível de banco de dados.
  - **Rastreabilidade e Idempotência de Migrations**:
    - Toda migração deve ser estritamente versionada e registrada em tabela de governança (`schema_migrations`).
    - Nenhuma migração pode falhar em re-execução ou deixar a base em estado inconsistente.
  - **Auditoria Obrigatória DBA Pré-Entrega**:
    - A cada nova migration, alteração de schema ou adição de query SQL, o agente/desenvolvedor DEVE verificar se os índices foram criados, se há risco de Seq Scan desnecessário e se as políticas de RLS e integridade referencial estão ativas e otimizadas.

## 7. Regra Obrigatória de Conformidade com a LGPD e Proteção de Dados Sensíveis de Saúde
- **Obrigatoriedade de Cumprimento das Diretrizes LGPD**: Todo desenvolvimento de software (APIs, telas, formulários, componentes mobile, banco de dados, relatórios e tarefas agendadas) DEVE seguir rigorosamente o documento [`docs/LGPD_GUIDELINES.md`](./docs/LGPD_GUIDELINES.md) e as normas oficiais da ANPD (gov.br/anpd).
  - **Privacy by Design e by Default (Art. 46, § 2º)**: A privacidade e a proteção de dados sensíveis devem ser contempladas desde a concepção do requisito até a entrega em produção, com configurações mais protetivas ativadas por padrão.
  - **Minimização de Dados (Art. 6º, III)**: É terminantemente proibido criar campos ou coletar dados desnecessários para a finalidade dietoterápica ou fiscal. Campos opcionais devem ser claramente identificados como `(opcional)`.
  - **Isolamento de Dados Sensíveis de Saúde (Art. 11)**: Dados de prontuário, anamnese, antropometria, exames e recordatórios alimentares só podem ser acessados com base na Tutela da Saúde por profissional de saúde ou consentimento específico, sempre isolados via Row-Level Security (RLS) no PostgreSQL.
  - **Higienização de Logs**: É expressamente proibido registrar dados pessoais sensíveis (CPFs, nomes, diagnósticos, prontuários ou senhas) em logs de console, arquivos de log de servidor ou plataformas de telemetria.
  - **Trilha de Auditoria Obrigatória (`audit_logs`)**: Toda consulta, alteração ou exportação de dados clínicos deve registrar evento na tabela `audit_logs` com operador, timestamp com fuso, IP e recurso afetado.
  - **Direitos do Titular (Art. 18)**: Garantir canais técnicos para exportação de dados (portabilidade JSON/PDF), retificação e cancelamento de comunicações, observando a obrigatoriedade legal de guarda do prontuário por 20 anos (Art. 16, I da LGPD c/c Resoluções CFN/CFM).
  - **Auditoria Obrigatória LGPD Pré-Entrega**: Todo PR ou funcionalidade entregue deve passar pelo Checklist Obrigatório de Desenvolvimento constante em `docs/LGPD_GUIDELINES.md`.

## 8. Regra Estrita de Engenharia Front-End & Desenvolvedor Front-End Sênior Obrigatório
- **Atuação Obrigatória como Dev Front-End Sênior**: Toda arquitetura, componentes, layouts, hooks, fluxos de estado, renderização e estilização no front-end (`apps/web` e `apps/mobile`) DEVEM ser rigorosamente revisados sob a ótica de um Desenvolvedor Front-End Sênior, avaliando performance, componentização limpa, usabilidade, acessibilidade e conformidade com os mais altos padrões da indústria.
  - **Revisão Sistemática de Melhorias e Otimizações**:
    - Após a criação ou alteração de qualquer tela, componente ou fluxo, realizar auditoria crítica em busca de oportunidades de refatoração, simplificação de estado, eliminação de re-renderizações inúteis (`useMemo`, `useCallback`, `React.memo` quando aplicável) e separação de responsabilidades (Single Responsibility Principle).
  - **Mobile-First & Responsividade Real**:
    - Toda tela deve ser funcional e ergonomicamente perfeita tanto em dispositivos móveis (375px+) quanto em telas ultralargas (1920px+).
    - Touch targets mínimos de 44px a 48px para botões e links navegáveis em dispositivos móveis, sem sobreposições acidentais ou rolagem horizontal quebrada.
  - **Acessibilidade Web (a11y - WCAG 2.1 AA/AAA)**:
    - Uso de elementos semânticos HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<button>`).
    - Vinculação obrigatória de `<label htmlFor={id}>` ao elemento de entrada (`id`), com atributos `aria-invalid`, `aria-required` e `aria-describedby` para erros e textos de apoio.
    - Contraste cromático adequado entre texto e fundo (mínimo de 4.5:1 para texto normal e 3:1 para texto grande).
    - Foco visível (`focus-visible`) e navegação completa por teclado.
  - **Desempenho & Core Web Vitals**:
    - **LCP (Largest Contentful Paint)**: Otimização de imagens, SVGs e carregamento de fontes.
    - **CLS (Cumulative Layout Shift)**: Reserva explícita de dimensões (`width`, `height`, skeletons/spinners) para evitar pulos de layout durante o carregamento de dados.
    - **INP (Interaction to Next Paint)**: Feedback tátil e visual imediato em cliques e transições de tela (< 100ms).
    - **Code Splitting & Bundle Size**: Otimização de chunks (`manualChunks`) e lazy loading para módulos e editores pesados.
  - **Tratamento Elegante de Estados de Interface**:
    - Toda visualização que carrega ou processa dados DEVE obrigatoriamente contemplar os 4 estados de UI:
      1. *Loading / Skeleton* (carregamento suave sem flicker).
      2. *Success / Data* (exibição rica dos dados estruturados).
      3. *Empty State* (ilustração ou ícone amigável, mensagem contextual e botão de ação direta para o usuário cadastrar o primeiro registro).
      4. *Error State / Fallback* (mensagem clara com botão de tentar novamente / retry).
  - **Auditoria Obrigatória Front-End Pré-Entrega**:
    - O agente/desenvolvedor DEVE verificar se os componentes do Design System unificado (`AppInput`, `AppSelect`, `AppButton`, `AppModal`, `ClinicalDataGrid`) foram utilizados, se não há inline styles duplicados dispensáveis, se não há avisos no console e se a tela responde com fluidez em mobile e desktop.

## 9. Regra Estrita de Engenharia Back-End, Arquitetura de Software & Dev Back-End Sênior Obrigatório
- **Atuação Obrigatória como Arquiteto de Software & Dev Back-End Sênior**: Toda arquitetura, endpoints de API, serviços, microsserviços/módulos, camadas de repositório, middlewares, segurança de transporte, controle de concorrência e modelagem de domínio no back-end (`apps/api` e pacotes compartilhados) DEVEM ser rigorosamente revisados sob a ótica de um Engenheiro de Back-End Sênior e Arquiteto de Software.
  - **Pilares de Alta Performance & Baixa Latência**:
    - **I/O Não Bloqueante e Event Loop Saudável**: Evitar operações síncronas bloqueantes (`fs.readFileSync` em tempo de requisição, loops CPU-bound não fragmentados, regexes catastróficas ReDoS).
    - **Otimização de Payload & Serialização**: Projeção estrita de colunas no banco para DTOs enxutos, serialização acelerada (Fastify JSON stringify / `class-transformer` eficiente), compressão HTTP (Gzip/Brotli) e paginação baseada em cursor ou `limit/offset` indexado.
    - **Pool de Conexões e Gestão de Recursos**: Reuso rigoroso de conexões via `pg.Pool`, liberação defensiva no bloco `finally`, timeouts de statement para blindagem contra queries lentas e prevenção de memory leaks.
  - **Confiabilidade, Resiliência & Transações Atômicas**:
    - **Atomicidade (ACID)**: Operações multi-tabela (ex: criar clínica + usuário administrador + branding + termos) DEVEM rodar obrigatoriamente dentro de transações de banco (`BEGIN ... COMMIT / ROLLBACK`).
    - **Tratamento Uniforme de Erros (RFC 7807 / Standard Envelope)**: Respostas de erro padronizadas com código HTTP semântico, mensagem clara para o usuário em português e código interno de erro (ex: `TENANT_NOT_FOUND`, `INVALID_CREDENTIALS`), sem nunca expor stack traces ou detalhes internos da infraestrutura em produção através do `HttpExceptionFilter`.
    - **Health Checks & Observabilidade Robusta**: Endpoints de integridade ativos (`/health/live`, `/health/ready`) checando conectividade com PostgreSQL com latência de resposta, além de logs estruturados (JSON) com correlação de requisição (`x-request-id`).
  - **Segurança de APIs (OWASP API Security Top 10 & Defesa em Profundidade)**:
    - **Validação de Entrada Estrita**: Validação e sanitização profunda de 100% dos payloads, parâmetros de rota e queries via Zod / ValidationPipes (previne API1, API2 e API3).
    - **Isolamento Multi-Tenant Garantido**: Nenhuma rota pode confiar cegamente em `tenant_id` vindo do corpo da requisição; o tenant deve ser resolvido e injetado pelo contexto criptográfico da sessão JWT ou subdomínio verificado, e blindado pelo PostgreSQL RLS.
    - **Rate Limiting & Anti-Abuso**: Proteção contra força bruta em rotas sensíveis (`/auth/login`, `/auth/refresh`, envio de convites) e limitação de taxa por IP/Tenant.
    - **Timing-Safe Operations**: Comparações de hashes e tokens com algoritmos resistentes a ataques de temporização (`crypto.timingSafeEqual`).
  - **Clean Architecture & DDD (Domain-Driven Design)**:
    - O domínio de negócio (`@ygeia/domain-core`) deve permanecer puro, sem dependência de NestJS, Fastify, banco de dados ou bibliotecas externas.
    - Serviços de aplicação orquestram casos de uso; controladores apenas recebem DTOs, delegam e retornam respostas HTTP sem acoplamento de regra de negócio.
  - **Auditoria Obrigatória Back-End Pré-Entrega**:
    - O agente/desenvolvedor DEVE auditar: se o endpoint possui testes automatizados unitários/integração, se há validação de payload, se o tratamento de erro está encapsulado, se a transação atômica está ativa e se o isolamento multi-tenant está garantido.





