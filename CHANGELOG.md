# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [0.1.0] - 2026-11-21

### Adicionado
- Estrutura inicial do Monorepo gerenciado via Turborepo e pnpm workspaces.
- Documentação técnica e estudo de arquitetura em `DOCS_ARQUITETURA_YGEIA.md`.
- Governança de versionamento com Conventional Commits e Commitlint.
- Script de sincronização de versão centralizada `scripts/sync-versions.ts`.
- Configuração local de banco de dados e mensageria com Docker Compose (PostgreSQL 16 com RLS + Redis 7).
- Criação dos módulos base `apps/api`, `apps/web`, `apps/mobile`, `packages/domain-core` e `packages/validation-schemas`.
