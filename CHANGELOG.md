# Changelog Consolidado — YGEÍA (Υγεία)

Todas as mudanças notáveis deste projeto em todas as suas aplicações e pacotes estão consolidadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

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
