# @ygeia/domain-core

> Núcleo de Domínio Puro da plataforma Ygeía (Υγεία).

## 🎯 Objetivo
Contém entidades, Value Objects, Domain Events e regras de negócio puras (cálculos de gasto energético, composição de macronutrientes, distribuição calórica). 
**Zero dependências de frameworks externos ou bancos de dados** (Clean Architecture).

## 📦 Conteúdo
- `diet/`: Value Objects como `Macronutrients`, regras de plano alimentar e cálculo calórico.
- `assessment/`: Strategy Pattern com fórmulas de cálculo de TMB/GET (*Mifflin-St Jeor*, *Harris-Benedict*).

## 🚀 Scripts & Instalação
```bash
# Na raiz do monorepo:
pnpm install

# Compilar TypeScript para dist/:
pnpm --filter @ygeia/domain-core build

# Executar testes unitários puros:
pnpm --filter @ygeia/domain-core test
```

---

## 📜 Changelog do Pacote

Consulte o histórico detalhado em [CHANGELOG.md](./CHANGELOG.md).

### Versão Atual: `v0.1.0` (2026-11-21)
- **Fase 0 (Setup do Monorepo & Domínio Puro)**:
  - Value Object `Macronutrients` com cálculo de VET (4 kcal carb/prot, 9 kcal gord) e invariantes (100% testado).
  - Strategy Pattern para Taxa Metabólica Basal (TMB): `MifflinStJeorStrategy` e `HarrisBenedictStrategy` (100% testado).
  - Exportação unificada via `src/index.ts`.
