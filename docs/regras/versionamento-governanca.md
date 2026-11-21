# 🏷️ Regras de Versionamento & Governança do Monorepo — YGEÍA

O ecossistema **YGEÍA** opera como um monorepo multi-aplicação com regras unificadas de versionamento, versionamento semântico (SemVer 2.0.0) e governança de código.

---

## 1. Fonte Única da Verdade (`package.json` Raiz)

Para evitar descompasso entre a versão da API, da Web, do Mobile e dos pacotes de domínio, o projeto adota **versão única centralizada**:

1. A propriedade `"version"` no arquivo raiz `package.json` é a **única fonte da verdade** para a versão do ecossistema:
   ```json
   {
     "name": "ygeia-monorepo",
     "version": "0.1.0",
     "private": true
   }
   ```
2. **Proibido alterar a versão manualmente nos subprojetos**:
   - Nunca edite a propriedade `version` diretamente em `apps/api/package.json`, `apps/web/package.json` ou `apps/mobile/app.json`.
3. **Script Oficial de Sincronização**:
   - Sempre que a versão raiz for incrementada, executa-se o script:
     ```bash
     pnpm version:sync
     ```
   - Este script atualiza automaticamente:
     - `apps/api/package.json`
     - `apps/web/package.json`
     - `apps/mobile/package.json` e `apps/mobile/app.json` (propriedade `expo.version`)
     - `packages/domain-core/package.json`
     - `packages/validation-schemas/package.json`

---

## 2. Política de Versionamento Semântico (SemVer 2.0.0)

O incremento da versão obedece rigorosamente às regras:

```
MAJOR.MINOR.PATCH (ex: 0.2.0)
```

- **MAJOR (x.0.0)**:
  - Alterações incompatíveis em contratos de API ou quebras fundamentais de arquitetura.
- **MINOR (0.x.0)**:
  - Conclusão e entrega de novas fases do roadmap (ex: Fase 1, Fase 2, Fase 3).
  - Adição de novos módulos de negócio retrocompatíveis.
- **PATCH (0.0.x)**:
  - Correções de segurança críticas, patches de bugs ou pequenas correções visuais sem alteração de contratos.

---

## 3. Gestão de Changelogs

1. **Changelog Raiz (`CHANGELOG.md`)**:
   - Consolida a visão holística de cada versão lançada na plataforma.
   - Organizado por data e versão SemVer.
2. **Changelogs Individuais de Cada Aplicação**:
   - Cada app possui seu próprio histórico granular de alterações:
     - `apps/api/CHANGELOG.md`
     - `apps/web/CHANGELOG.md`
     - `apps/mobile/CHANGELOG.md`
3. **Seções Obrigatórias em cada Release**:
   - `### Adicionado (Added)`: Novas rotas, telas ou funcionalidades.
   - `### Modificado (Changed)`: Alterações em comportamentos existentes.
   - `### Corrigido (Fixed)`: Correção de defeitos ou brechas.
   - `### Segurança (Security)`: Melhorias em criptografia, RLS e autenticação.

---

## 4. Governança de Qualidade com Husky & Linters

1. **Pre-commit Hook**:
   - Executa automaticamente `pnpm test` antes de permitir a criação do commit.
   - Impede commits com testes quebrados ou código com erros de tipagem TypeScript.
2. **Commit-msg Hook (Commitlint)**:
   - Valida que a mensagem de commit respeita **Conventional Commits v1.0.0**.
   - Padrão: `<tipo>(<escopo>): <mensagem>`.
3. **Imutabilidade e Rastreabilidade**:
   - Nenhuma funcionalidade é mesclada em `main` sem passar por bateria completa de validação.
