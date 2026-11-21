# Changelog Consolidado — YGEÍA (Υγεία)

Todas as mudanças notáveis deste projeto em todas as suas aplicações e pacotes estão consolidadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [0.1.0] - 2026-11-21

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
- Criação da central de documentação em `docs/`:
  - `docs/arquitetura/DOCS_ARQUITETURA_YGEIA.md` (Estudo arquitetural completo, DDD, Hexagonal, OWASP e Roadmap).
  - `docs/regras/fluxo-desenvolvimento.md` (Pipeline de 6 fases: Plano > Autorização > Desenvolvimento > Testes > Versionamento > Publicação).
  - `docs/regras/regras-negocio.md` (SaaS White Label, prontuário, resoluções CFN e conformidade LGPD).
  - `docs/regras/seguranca-apis.md` (Defense in depth, Postgres RLS, Argon2id, JWT rotation, Cookies HttpOnly).
  - `docs/regras/padroes-mobile-web.md` (Mobile-First 48px, thumb zone, offline-first e biometria).
  - `docs/regras/versionamento-governanca.md` (Governança SemVer, sync automatizado e regras de commit).
