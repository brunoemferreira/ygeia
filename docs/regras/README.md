# 📋 Guia Central de Regras do Ecossistema — YGEÍA

Todas as aplicações (`apps/api`, `apps/web`, `apps/mobile`) e pacotes (`packages/*`) do ecossistema **YGEÍA** são regidos por um conjunto formal de diretrizes de engenharia, segurança e conformidade legal.

---

## 📑 Índice de Regras

| Documento | Descrição | Escopo |
| :--- | :--- | :--- |
| **[Fluxo de Desenvolvimento](./fluxo-desenvolvimento.md)** | Pipeline obrigatório `Plano > Autorização > Dev > Testes > Versionamento > Publicação` e Conventional Commits. | Todos os Desenvolvedores & Agentes |
| **[Regras de Negócio & Compliance](./regras-negocio.md)** | Regras de domínio clínico, prontuário eletrônico, CFN (Res. 600/2018) e LGPD (dados sensíveis). | Backend, Domínio, Frontend, Mobile |
| **[Segurança das APIs & Criptografia](./seguranca-apis.md)** | Diretrizes OWASP API Top 10, Argon2id, RLS no PostgreSQL, Cookies HttpOnly e isolamento de tenants. | Backend, Infraestrutura |
| **[Padrões Mobile & Web Mobile-First](./padroes-mobile-web.md)** | Diretrizes de UX/UI Mobile-First no React, touch targets de 48px, Offline-First e biometria no React Native. | Frontend Web, App Mobile |
| **[Versionamento & Governança](./versionamento-governanca.md)** | Fonte única de versão no `package.json` raiz, script de sincronização, SemVer e `CHANGELOG.md`. | Monorepo, CI/CD |

---

## ⚖️ Conformidade e Auditoria

O não cumprimento de qualquer regra contida nestes documentos bloqueia a esteira de desenvolvimento através dos linters, hooks de Git (Husky) ou rejeição em revisão de código.
