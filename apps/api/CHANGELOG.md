# Changelog - @ygeia/api

Todas as alterações notáveis da API serão registradas aqui.
Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [0.1.0] - 2026-11-21

### Adicionado
- **Fase 1 (Multi-Tenancy, IAM, RLS e Autenticação)**:
  - Migrations SQL com ativação de PostgreSQL Row-Level Security (`0001_initial_schema.sql`).
  - `DatabaseService` com transações e context injection de tenant (`SET app.current_tenant_id`).
  - `PasswordHasherService` com algoritmo Argon2id.
  - `TokenService` com Access Token JWT de 15m e Refresh Token de 7 dias com rotação.
  - `TenantResolutionMiddleware` com `AsyncLocalStorage`.
  - Endpoints de autenticação (`/auth/register-clinic`, `/auth/login`, `/auth/refresh`, `/auth/me`) e branding (`/tenants/branding`).
- Setup fundacional do módulo NestJS com Fastify Adapter.
- Estrutura base de tipos e integração com `@ygeia/domain-core` e `@ygeia/validation-schemas`.
- Arquivo de documentação interna `README.md` e variáveis de ambiente `.env.example`.
