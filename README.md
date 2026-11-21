# YGEÍA (Υγεία) — SaaS White Label para Nutricionistas

[![Repository](https://img.shields.io/badge/GitHub-brunoemferreira%2Fygeia-blue?logo=github)](https://github.com/brunoemferreira/ygeia.git)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22_LTS-green?logo=node.js)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10%2B-red?logo=nestjs)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19_Mobile--First-cyan?logo=react)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React_Native-Expo_CNG-61DAFB?logo=react)](https://reactnative.dev/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-v1.0.0-yellow.svg)](https://conventionalcommits.org)
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey.svg)](#)

> **Ygeía (Υγεία)**: Do grego antigo *Saúde*. Plataforma SaaS White Label completa projetada para nutricionistas individuais, consultórios e clínicas nutricionais multiprofissionais, automatizando o controle de pacientes, anamnese, cálculos antropométricos e prescrição dietética.

---

## 📖 Documentação de Arquitetura & Engenharia

O estudo completo de arquitetura, modelagem de domínio (DDD), padrões de projeto, segurança e roadmap está detalhado no documento oficial:

📄 **[DOCS_ARQUITETURA_YGEIA.md](./DOCS_ARQUITETURA_YGEIA.md)**

---

## 🏛️ Visão Geral da Arquitetura

O ecossistema é organizado como um **Monólito Modular** baseado em **Clean Architecture** e **DDD**, operando em um monorepo gerenciado por **Turborepo** e **pnpm workspaces**:

```plaintext
ygeia/
├── README.md                         # Documentação Raiz do Ecossistema
├── DOCS_ARQUITETURA_YGEIA.md         # Estudo Completo de Arquitetura & Especificação
├── CHANGELOG.md                      # Histórico Global de Mudanças (SemVer)
├── package.json                      # Versão Única Central ("version": "x.y.z")
│
├── apps/
│   ├── api/                          # Backend NestJS (Fastify + TypeScript)
│   ├── web/                          # Frontend React (Mobile-First + Tailwind)
│   └── mobile/                       # App Mobile Nativo em React Native (Expo Bare + TypeScript)
│
└── packages/
    ├── domain-core/                  # Entidades de Domínio, VOs e Fórmulas Nutricionais
    ├── api-client/                   # Cliente HTTP tipado com suporte offline
    ├── validation-schemas/           # Esquemas Zod compartilhados entre Back, Web e Mobile
    └── ui-tokens/                    # Cores, espaçamentos e design tokens do White Label
```

---

## 🚀 Stack Tecnológica

- **Backend**: Node.js 22 LTS, TypeScript 5.x, NestJS 10+ (Fastify Adapter), PostgreSQL 16+ com Row-Level Security (RLS), Redis 7+ e BullMQ.
- **Frontend Web**: React 19, TypeScript, Vite/Next.js, Tailwind CSS e Shadcn/UI (Filosofia estrita de **Mobile-First Responsive Design**).
- **Mobile**: React Native 0.74+ com New Architecture, Expo CNG (Continuous Native Generation), MMKV, SQLite/WatermelonDB (Offline-First) e biometria nativa.
- **Segurança**: Hashing com Argon2id, tokens com rotação automática em cookies HttpOnly na Web e hardware-backed SecureStore no Mobile, 2FA via TOTP (RFC 6238), Dynamic CORS e proteção OWASP API Top 10.
- **White Label**: Resolução de tenant via Host header (subdomínios e domínios próprios com Cloudflare for SaaS) e injeção dinâmica de CSS variables no `:root` e MMKV no mobile.

---

## 🔄 Regra e Ciclo de Desenvolvimento Estrito

Toda e qualquer funcionalidade ou ajuste no projeto segue rigorosamente o pipeline:

```
Plano ──► Autorização ──► Desenvolvimento ──► Testes ──► Versionamento ──► Publicação (Dev)
```

1. **Plano**: Especificação detalhada da funcionalidade, impactos nas camadas e modelos.
2. **Autorização**: Aprovação explícita do plano antes de redigir código de produção.
3. **Desenvolvimento**: Implementação com Clean Code, DDD, Design Patterns e Conventional Commits.
4. **Testes**: Execução de testes unitários, testes de integração e validação de regressão.
5. **Versionamento**: Bump da versão central no `package.json`, sincronização nos apps/pacotes e atualização dos `CHANGELOG.md`.
6. **Publicação para Testes do Dev**: Build e disponibilização no ambiente de staging/preview local para homologação.

---

## 📌 Versionamento Centralizado (`package.json`)

A versão definida na raiz (`package.json`) é a **fonte única da verdade** da plataforma e é sincronizada automaticamente com todos os apps e pacotes através do script:

```bash
pnpm version:sync
```

---

## 🛠️ Instalação e Desenvolvimento Local

### Pré-requisitos
- **Node.js**: >= 20.x (Recomendado 22 LTS)
- **pnpm**: >= 9.x (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Docker & Docker Compose**: Para execução dos contêineres do PostgreSQL e Redis

### Clonar o Repositório
```bash
git clone https://github.com/brunoemferreira/ygeia.git
cd ygeia
```

### Inicializar os Serviços Locais
```bash
docker compose up -d
```

### Instalar Dependências e Executar
```bash
pnpm install
pnpm dev
```

---

## 📄 Licença

Proprietário. Todos os direitos reservados à plataforma **Ygeía (Υγεία)**.
