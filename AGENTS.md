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

## 4. Manutenção Obrigatória do Documento de Segurança (`SECURITY.md`)
- A cada nova funcionalidade, alteração em fluxos de autenticação, criptografia, cabeçalhos de rede, isolamento multi-tenant ou atualização/patch de segurança, é **obrigatório atualizar o arquivo `SECURITY.md`** na raiz do repositório.
- Manter o inventário de proteções ativas e o plano de segurança anti-invasão sempre sincronizados com o código-fonte dos 3 projetos (`apps/api`, `apps/web` e `apps/mobile`).

## 5. Regra Estrita de Padronização Visual e Design System Obrigatório (UI/UX)
- **TODOS os componentes do software DEVEM ter rigorosamente o mesmo padrão visual**:
  - **Campos de Edição / Inputs (`AppInput`)**:
    - Altura padronizada: `minHeight: 38px`.
    - Borda e raio: `1px solid #cbd5e1`, `borderRadius: 0.5rem` (8px).
    - Tipografia: `0.8125rem` (13px), fonte `'Plus Jakarta Sans', system-ui, sans-serif`, peso normal/500, cor `#0f172a`, placeholder `#94a3b8`.
    - Foco e ativação: borda `var(--primary)` e anel de foco `box-shadow: 0 0 0 3px var(--primary-light)`.
    - Labels: `fontSize: 0.8125rem`, `fontWeight: 700`, cor `#0f172a`, asterisco obrigatório em `#ef4444`.
  - **Caixas de Seleção / Combos (`AppSelect`)**:
    - **IDÊNTICOS AOS EDITS**: Mesma altura (`minHeight: 38px`), mesmo raio de borda (`0.5rem`), mesmo padding, mesma borda e anel de foco `box-shadow: 0 0 0 3px var(--primary-light)`.
    - Ícone chevron indicador discreto à direita (`#94a3b8`).
    - **É ESTRITAMENTE PROIBIDO** criar elementos `<select>` nativos crus com estilos avulsos ou alturas divergentes. Sempre utilizar o componente unificado `AppSelect`.
  - **Áreas de Texto Multilinha (`AppTextarea`)**:
    - Seguir exatamente a mesma borda, raio (`0.5rem`), tipografia e anel de foco `box-shadow: 0 0 0 3px var(--primary-light)`.
  - **Uso Obrigatório das Cores da Configuração (White Label)**:
    - NUNCA usar cores primárias estáticas (ex: `#059669` hardcoded) em elementos de interação, foco de inputs, abas, botões primários ou seleções.
    - Utilizar SEMPRE as variáveis CSS do tema: `var(--primary)`, `var(--primary-hover)`, `var(--primary-light)`, `var(--primary-border)`.
  - **Auditoria Obrigatória Pré-Entrega**:
    - A cada nova funcionalidade, alteração em tela existente ou criação de nova tela, o agente/desenvolvedor DEVE OBRIGATORIAMENTE revisar todos os componentes da tela (edits, combos, botões, modais, tabelas) e certificar-se de que estão 100% aderentes ao Design System unificado. Nenhuma tela com inputs desalinhados ou cores estáticas divergentes pode ser entregue.

