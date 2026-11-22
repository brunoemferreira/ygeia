# Changelog Consolidado — YGEÍA (Υγεία)

Todas as mudanças notáveis deste projeto em todas as suas aplicações e pacotes estão consolidadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [Unreleased] - 2026-11-21

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
