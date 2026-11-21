# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [0.1.0] - 2026-11-21

### Adicionado
- **Fase 1 (Multi-Tenancy, IAM, RLS e Autenticação)**:
  - Modelagem relacional e migrations das tabelas `tenants`, `tenant_domains`, `tenant_branding`, `users`, `refresh_tokens` e `audit_logs`.
  - Configuração de **Row-Level Security (RLS)** no PostgreSQL com `current_setting('app.current_tenant_id')`, isolando dados entre clínicas no nível do banco.
  - Hashing de senhas com **Argon2id** (64MB memória, 3 iterações) e serviço de tokens JWT com expiração de 15 minutos.
  - Mecanismo de **Refresh Token com rotação automática e detecção de reuso** (revogação da família de sessões em caso de sequestro).
  - Middleware de resolução de Tenant com `AsyncLocalStorage` via header `x-tenant-id` ou Host header (subdomínios e domínios próprios).
  - Endpoints `/api/v1/auth/register-clinic`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/me` e `/api/v1/tenants/branding`.
- Estrutura inicial do Monorepo gerenciado via Turborepo e pnpm workspaces.
- Documentação técnica e estudo de arquitetura em `DOCS_ARQUITETURA_YGEIA.md`.
- Governança de versionamento com Conventional Commits e Commitlint.
- Script de sincronização de versão centralizada `scripts/sync-versions.ts`.
- Configuração local de banco de dados e mensageria com Docker Compose (PostgreSQL 16 com RLS + Redis 7).
- Criação dos módulos base `apps/api`, `apps/web`, `apps/mobile`, `packages/domain-core` e `packages/validation-schemas`.
