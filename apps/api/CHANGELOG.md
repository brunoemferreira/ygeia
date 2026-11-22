# Changelog - @ygeia/api

Todas as alterações notáveis da API serão registradas aqui.
Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [Unreleased] - 2026-11-22

### Modificado
- **Resiliência do DatabaseService em Ambiente de Desenvolvimento**:
  - `DatabaseService`: Tratamento de indisponibilidade temporária do PostgreSQL em ambiente de desenvolvimento local, evitando encerramento forçado da API quando o container ou serviço do banco ainda estiver iniciando.

## [Unreleased] - 2026-11-21

### Adicionado
- **Módulo e Entidade de Pacientes com RLS Multi-Tenant**:
  - Migração `0003_patients_schema.sql` criando tabela `patients` com dados clínicos, pessoais, de responsáveis e parâmetros de notificação.
  - Imposição estrita de Row-Level Security (`tenant_isolation_patients`) com grant para `ygeia_app`.
  - `PatientsService` e `PatientsController` com rotas `GET /api/v1/patients` e `POST /api/v1/patients`.

### Removido
- **Seeder de Demonstração & Fallback Demo**:
  - Removido o método `seedDefaultData()` de `DatabaseService`, prevenindo a injeção automática de `demo-clinica`, `admin@ygeia.com` e `paciente@ygeia.com`.
  - Removida a dependência da slug `demo-clinica` no endpoint `GET /tenants/branding`, retornando agora branding padrão do sistema.
  - Limpeza dos registros fictícios de demonstração da base de dados PostgreSQL.

## [0.1.0] - 2026-11-21

### Adicionado
- **Fase 2 (Configuração da Clínica, Perfil do Nutricionista CRN, White Label Studio & Equipe RBAC)**:
  - Migração `0002_tenant_setup_and_team.sql` com tabelas `tenant_settings`, `nutritionist_profiles`, alteração de `tenant_branding` e `team_invitations`.
  - Imposição de PostgreSQL Row-Level Security (RLS) para todas as novas entidades e grant para `ygeia_app`.
  - Endpoints em `TenantsController`: `GET`/`PUT` `/tenants/settings`, `GET`/`PUT` `/tenants/profile`, `PUT` `/tenants/branding`, `GET` `/tenants/team` e `POST` `/tenants/team/invite`.
  - Execução dinâmica e seeder de demonstração automático na inicialização da API (`demo-clinica` / `admin@ygeia.com` / `senha123456`).
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
