# @ygeia/api — Backend NestJS (Fastify)

API RESTful de alta performance da plataforma Ygeía (Υγεία), implementada em **NestJS** com **Fastify Adapter**, seguindo princípios de **Clean Architecture**, **Domain-Driven Design (DDD)** e isolamento de segurança com **PostgreSQL Row-Level Security (RLS)**.

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js >= 20 LTS (Recomendado Node 22+)
- Docker & Docker Compose em execução (para Postgres e Redis)
- pnpm instalado globalmente

### Passos
```bash
# 1. Na raiz do monorepo, inicie os contêineres:
docker compose up -d

# 2. Instale as dependências:
pnpm install

# 3. Inicie o servidor em modo watch (desenvolvimento):
pnpm --filter @ygeia/api dev
```

O servidor inicializará por padrão na porta `3333` (ou a definida em `PORT`).

---

## ⚙️ Variáveis de Ambiente (`.env`)

Copie o arquivo de exemplo para iniciar:
```bash
cp .env.example .env
```

| Variável | Descrição | Exemplo Padrão |
| :--- | :--- | :--- |
| `PORT` | Porta de escuta da API HTTP | `3333` |
| `NODE_ENV` | Ambiente de execução (`development`, `production`) | `development` |
| `DATABASE_URL` | String de conexão com o PostgreSQL | `postgresql://ygeia_user:ygeia_password@localhost:5432/ygeia_db` |
| `REDIS_URL` | URL de conexão com o Redis | `redis://localhost:6379` |
| `JWT_SECRET` | Chave secreta para assinatura dos tokens | `change-me-in-production` |
| `CORS_ORIGINS` | Domínios permitidos (separados por vírgula) | `http://localhost:3000,http://localhost:5173` |

---

## 🏛️ Estrutura de Camadas
- `src/common/`: Middlewares globais (Helmet, Tenant Context, Rate Limiting).
- `src/modules/iam/`: Autenticação, usuários, MFA e tokens.
- `src/modules/tenancy/`: Gerenciamento de tenants, custom domains e branding.
- `src/modules/diet-planning/`: Prescrição nutricional e alimentos.
- `src/modules/patient/`: Prontuário eletrônico e anamnese.

---

## 📜 Changelog da Aplicação

Consulte o histórico detalhado em [CHANGELOG.md](./CHANGELOG.md).

### Versão Atual: `v0.1.0` (2026-11-21)
- **Fase 1 (Multi-Tenancy, IAM, RLS e Autenticação)**:
  - Migrations SQL com ativação de PostgreSQL Row-Level Security (`0001_initial_schema.sql`).
  - `DatabaseService` com transações e context injection de tenant (`SET app.current_tenant_id`).
  - `PasswordHasherService` com algoritmo Argon2id (64MB, 3 iterações).
  - `TokenService` com Access Token JWT de 15m e Refresh Token de 7 dias com rotação e detecção de reuso.
  - `TenantResolutionMiddleware` com `AsyncLocalStorage`.
  - Endpoints de autenticação (`/auth/register-clinic`, `/auth/login`, `/auth/refresh`, `/auth/me`) e branding (`/tenants/branding`).
- Setup inicial da API NestJS com Fastify Adapter e testes unitários.
