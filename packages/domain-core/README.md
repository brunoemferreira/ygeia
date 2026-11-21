# @ygeia/domain-core

> Núcleo de Domínio Puro da plataforma Ygeía (Υγεία).

## 🎯 Objetivo
Contém entidades, Value Objects, Domain Events e regras de negócio puras (cálculos de gasto energético, composição de macronutrientes, distribuição calórica). 
**Zero dependências de frameworks externos ou bancos de dados** (Clean Architecture).

## 📦 Conteúdo
- `diet/`: Value Objects como `Macronutrients`, regras de plano alimentar e cálculo calórico.
- `assessment/`: Strategy Pattern com fórmulas de cálculo de TMB/GET (*Mifflin-St Jeor*, *Harris-Benedict*).

## 🚀 Scripts
```bash
pnpm build # Compila TypeScript para dist/
pnpm test  # Executa testes unitários de domínio
```
