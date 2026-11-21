# Diretrizes e Regras do Projeto — Ygeía (Υγεία)

Este documento estabelece as regras e padrões de engenharia para qualquer agente ou desenvolvedor atuando neste repositório.

## 1. Regra Obrigatória de Changelog
- **Sempre atualizar o changelog dos projetos**: A cada nova feature, refatoração, correção de bug ou alteração estrutural, é obrigatório registrar a alteração no `CHANGELOG.md` da raiz e no `CHANGELOG.md` do pacote/aplicação afetado (ex: `apps/web/CHANGELOG.md`, `apps/api/CHANGELOG.md`, etc.).
- **Formato**: Seguir o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [Versionamento Semântico](https://semver.org/).
- **Clareza**: Descrever o impacto técnico e o valor de negócio das alterações com clareza em português.

## 2. Padrões de Commit
- **Conventional Commits**: Seguir estritamente a especificação (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).
- Mensagens de commit devem ser concisas e em minúsculas (ex: `feat(web): add settings module with category submenus`).

## 3. Segurança e Isolamento Multi-Tenant
- Isolamento estrito entre Tenant e Usuários via Row-Level Security (RLS) no PostgreSQL.
- Criptografia com Argon2id para senhas e tokens com rotação e detecção de reuso.
- Nenhum usuário deslogado pode acessar áreas protegidas do Nutricionista ou Paciente.
