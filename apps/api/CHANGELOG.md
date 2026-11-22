# Changelog - @ygeia/api

Todas as alterações notáveis da API serão registradas aqui.
Este projeto segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [Unreleased] - 2026-11-22

### Adicionado
- **Módulo Clínico Relacional com Isolamento Multi-Tenant por RLS (`ClinicalModule`, `clinical.service.ts`, `clinical.controller.ts`)**:
  - Implementação de serviços e controllers para gestão de anamneses, recordatórios alimentares (24h/QFA), evoluções de prontuário e restrições alimentares com RLS no PostgreSQL.
  - Projeção de colunas com nomenclatura camelCase e eliminação de `SELECT *`.
- **Migração 0006 com Padrão DBA Sênior (`0006_clinical_records_and_recalls.sql`)**:
  - Tabelas `patient_anamneses`, `patient_recalls`, `patient_medical_records` e `patient_restrictions`.
  - Índices de Foreign Key para todas as relações filhas e índices compostos de RLS com `tenant_id` como primeira coluna.
  - Habilitação compulsória de `FORCE ROW LEVEL SECURITY`.

### Adicionado
- **Validação Global de Payloads com Zod (`ZodValidationPipe`, `zod-validation.pipe.spec.ts`)**:
  - Implementação de pipe transformador com introspecção de schemas Zod e rejeição estruturada de campos maliciosos (HTTP 400).
  - Cobertura com testes unitários em `zod-validation.pipe.spec.ts`.
  - Injeção global como `APP_PIPE` no `AppModule`.
- **Trilha de Auditoria LGPD Assíncrona (`AuditLogInterceptor.ts`)**:
  - Criação de interceptor global registrando consultas e modificações em prontuários e dados de pacientes na tabela `audit_logs` (tenant, usuário, método/ação, IP e user-agent) via RxJS `tap` não-bloqueante.
  - Injeção global como `APP_INTERCEPTOR` no `AppModule`.

### Adicionado
- **Filtro Global de Exceções HTTP RFC 7807 & Probes de Liveness/Readiness (`http-exception.filter.ts`, `health.controller.ts`, `main.ts`)**:
  - Implementação de `HttpExceptionFilter` interceptando todas as exceções da API, sanitizando mensagens e formatando respostas de erro em JSON padronizado com código HTTP semântico, prevenindo vazamento de dados internos de infraestrutura.
  - Adição do método `ping()` no `DatabaseService` para medição de latência da conexão com o PostgreSQL em tempo real.
  - Endpoints de observabilidade no `HealthController`: `/health/live` para verificação de liveness do processo e `/health/ready` com verificação de prontidão e conectividade com o banco de dados.
  - Registro global do filtro no bootstrap do Fastify em `main.ts`.


### Adicionado
- **Governança DBA Sênior, Migrações Idempotentes e Tunning de Performance PostgreSQL (`0005_dba_performance_tuning_and_indexes.sql`, `database.service.ts`)**:
  - Migração `0005`:
    - Criação da tabela `schema_migrations` com registro de versões e timestamps de aplicação.
    - Ativação das extensões `pg_trgm` e `btree_gist`.
    - Criação de índices em foreign keys para eliminação de table locks e sequential scans em cascata: `idx_tenant_domains_tenant_id`, `idx_refresh_tokens_tenant_user`, `idx_refresh_tokens_user_id`, `idx_refresh_tokens_tenant_id`, `idx_team_invitations_invited_by`, `idx_nutritionist_profiles_user_id`.
    - Criação de índices compostos para isolamento multi-tenant (RLS) otimizado: `idx_patients_tenant_created` (`tenant_id, created_at DESC`) e `idx_patients_tenant_status` (`tenant_id, status`).
    - Criação de índices GIN com `gin_trgm_ops` para aceleração de buscas textuais de pacientes (`idx_patients_trgm_name`, `idx_patients_trgm_email`).
    - Adição de constraint `CHECK` para integridade de status de pacientes.
  - `DatabaseService`:
    - Suporte a migrações transacionais e rastreamento formal em `schema_migrations`.
    - Configuração de `statement_timeout: 10000` no pool de conexões.


### Adicionado
- **Endpoint e Serviço de Exclusão de Pacientes com Isolamento Multi-Tenant (`patients.controller.ts`, `patients.service.ts`)**:
  - Implementado o método `deletePatient(tenantId, patientId)` e rota `@Delete(':id')` no `PatientsController` com verificação rigorosa de isolamento por `tenant_id` e políticas RLS.
- **Controles Anti-Invasão e Fortalecimento de Cabeçalhos HTTP (`main.ts`, `SECURITY.md`)**:
  - Configuração de `bodyLimit: 1MB` no Fastify para prevenção de exaustão de memória e DoS por injeção de payloads maciços.
  - Ativação de cabeçalhos de segurança estritos via Fastify Helmet (`frameguard: { action: 'deny' }` contra Clickjacking, `noSniff: true` contra MIME-sniffing e ocultação do cabeçalho `X-Powered-By`).
  - Formalização do plano de conformidade com o OWASP API Security Top 10 e auditoria do PostgreSQL RLS no `SECURITY.md`.

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
