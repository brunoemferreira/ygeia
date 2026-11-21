# 🔄 Regra de Fluxo de Desenvolvimento — YGEÍA

Toda e qualquer nova funcionalidade, correção de bug, refatoração estrutural ou adição ao projeto YGEÍA **deve seguir obrigatoriamente** o pipeline formal de 6 etapas:

```
Plano ──► Autorização ──► Desenvolvimento ──► Testes ──► Versionamento ──► Publicação (Dev)
```

---

## 1. As 6 Fases da Esteira

### Etapa 1: Plano (Specification)
- Antes de redigir qualquer código de produção, é formulado um plano técnico abrangente contendo:
  - Objetivo e escopo da tarefa.
  - Modelos de banco de dados e migrações necessárias.
  - Entidades de domínio e Value Objects envolvidos.
  - Endpoints REST, contratos Zod e DTOs.
  - Casos de teste que serão implementados.
  - Impactos em segurança, multi-tenancy e performance.

### Etapa 2: Autorização (Explicit Approval)
- **Nenhum código de produção deve ser implementado sem a autorização explícita do usuário/líder técnico.**
- O plano é submetido para validação; ajustes solicitados são incorporados antes da aprovação final.

### Etapa 3: Desenvolvimento (Clean Implementation)
- A implementação ocorre respeitando:
  - Clean Architecture e DDD (Domain-Driven Design).
  - Isolamento de camadas: Domain Puro -> Application -> Infrastructure -> Presentation.
  - Princípio YAGNI: apenas o que foi planejado e necessário, sem código morto ou abstrações prematuras.
  - Validação estrita com TypeScript e esquemas Zod compartilhados.

### Etapa 4: Testes (Verification & Regression)
- A validação técnica ocorre em dois níveis:
  1. **Testes Unitários**: Garantem que as regras de negócio puras em `packages/domain-core` e os serviços da API funcionem isoladamente.
  2. **Testes de Integração / E2E**: Validam a comunicação real com PostgreSQL (verificando Row-Level Security), Redis e endpoints HTTP.
- Todos os testes devem passar com 100% de sucesso (`pnpm test`).

### Etapa 5: Versionamento (SemVer & Changelogs)
- A versão é incrementada na raiz `package.json` seguindo Semantic Versioning (SemVer 2.0.0):
  - `patch` (0.1.x): Correções de bugs e ajustes de segurança.
  - `minor` (0.x.0): Novas funcionalidades retrocompatíveis (ex: novas fases de roadmap).
  - `major` (x.0.0): Mudanças que quebram contratos públicos de API.
- Executa-se `pnpm version:sync` para sincronizar a versão entre `apps/api`, `apps/web`, `apps/mobile` e pacotes.
- Atualiza-se o `CHANGELOG.md` raiz e os changelogs individuais dos apps afetados.
- Atualiza-se o checklist de fases em `docs/arquitetura/DOCS_ARQUITETURA_YGEIA.md`.

### Etapa 6: Publicação para Testes do Dev (Staging Preview)
- O código é validado em ambiente local de desenvolvimento/staging com os serviços ativos (Docker Compose).
- Geração do commit semântico via Git seguindo Conventional Commits v1.0.0.

---

## 2. Padrão de Commits (Conventional Commits v1.0.0)

O repositório utiliza verificação automática via **Husky** e **Commitlint**. Commits que não respeitem este padrão serão sumariamente rejeitados.

### Formato Obrigatório:
```
<tipo>(<escopo>): <descrição em minúsculas e no presente/passado recente>
```

### Tipos Permitidos:
- `feat`: Nova funcionalidade para o usuário ou plataforma.
- `fix`: Correção de um bug ou inconsistência.
- `docs`: Modificações exclusivamente em documentação.
- `chore`: Atualizações de build, dependências ou ferramentas de suporte.
- `refactor`: Alteração de código que não corrige bug nem adiciona funcionalidade.
- `test`: Adição ou refatoração de testes automatizados.
- `perf`: Mudança de código que melhora a performance.

### Exemplos Válidos:
```bash
feat(iam): implement multi-tenancy, argon2id, jwt rotation and postgresql rls
feat(patient): implement patient management, clinical records and lgpd audit trail
docs(architecture): reorganize documentation into docs folder with governance rules
chore(deps): bump typescript to 5.8
```
