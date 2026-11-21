# 📚 Documentação Oficial — YGEÍA (Υγεία)

Bem-vindo à central de documentação e engenharia da plataforma **YGEÍA (Υγεία)** — SaaS White Label de alta performance para nutricionistas e clínicas nutricionais.

---

## 🗂️ Estrutura da Documentação

A documentação está organizada nas seguintes seções:

```plaintext
docs/
├── README.md                            # Este índice geral
├── arquitetura/
│   └── DOCS_ARQUITETURA_YGEIA.md        # Estudo arquitetural profundo, DDD, Hexagonal, Roadmap e especificações
│
└── regras/                              # Regras obrigatórias do ecossistema YGEÍA
    ├── README.md                        # Visão geral das regras e conformidades
    ├── fluxo-desenvolvimento.md         # Pipeline: Plano > Autorização > Dev > Testes > Versionamento > Publicação
    ├── regras-negocio.md                # Regras de negócio, cálculos nutricionais, CFN e LGPD
    ├── seguranca-apis.md                # Diretrizes OWASP API Top 10, PostgreSQL RLS, JWT e criptografia
    ├── padroes-mobile-web.md            # Mobile-First no React Web e Offline-First no React Native
    └── versionamento-governanca.md      # Fonte única de versão, SemVer, pnpm version:sync e changelogs
```

---

## 🔗 Atalhos Rápidos

- 📐 **[Estudo de Arquitetura & Engenharia (DOCS_ARQUITETURA_YGEIA.md)](./arquitetura/DOCS_ARQUITETURA_YGEIA.md)**
- 🚦 **[Regra de Fluxo de Desenvolvimento](./regras/fluxo-desenvolvimento.md)**
- 🏢 **[Regras de Negócio & Compliance Nutricional](./regras/regras-negocio.md)**
- 🛡️ **[Segurança das APIs & Criptografia](./regras/seguranca-apis.md)**
- 📱 **[Padrões Mobile-First Web & React Native](./regras/padroes-mobile-web.md)**
- 🏷️ **[Versionamento Centralizado & Governança](./regras/versionamento-governanca.md)**

---

## 💡 Princípios Fundamentais do Projeto

1. **Clean Architecture & DDD Puro**: O domínio de negócio (`packages/domain-core`) não depende de nenhum framework ou banco de dados.
2. **Isolamento Absoluto Multi-Tenant**: Nenhuma consulta atinge tabelas sensíveis sem `tenant_id` validado e garantido via Row-Level Security (RLS) no PostgreSQL.
3. **YAGNI (You Aren't Gonna Need It)**: Construir o necessário com excelência e extensibilidade, sem complexidade acidental antecipada.
4. **Mobile-First Real**: A interface Web é projetada primeiramente para telas sensíveis ao toque (smartphones) e expande responsivamente para tablets e desktops.
5. **Auditoria Imutável (LGPD & CFN)**: Todos os acessos e modificações em dados de saúde geram logs de auditoria imutáveis com carimbo temporal.
