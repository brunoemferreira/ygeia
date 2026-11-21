---
description: Regra mandatória de manutenção e atualização contínua do changelog dos projetos
always_on: true
---

# Regra: Atualização Contínua de Changelog

Sempre que realizar modificações, implementações de novas funcionalidades, correções de bugs ou limpezas de código neste repositório:

1. **Atualizar o `CHANGELOG.md` na raiz do monorepo** sob a versão corrente / `[Unreleased]`, categorizando as alterações por aplicação/pacote afetado (`apps/web`, `apps/api`, `packages/domain-core`, etc.).
2. **Atualizar o `CHANGELOG.md` do pacote específico** correspondente (ex: `apps/web/CHANGELOG.md` para mudanças no front-end web).
3. Seguir o padrão **Keep a Changelog** (`Adicionado`, `Modificado`, `Removido`, `Corrigido`).
4. Não finalizar a tarefa ou commit sem garantir que os changelogs reflitam as mudanças executadas.
