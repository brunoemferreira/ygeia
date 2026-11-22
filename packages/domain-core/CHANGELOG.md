# Changelog - @ygeia/domain-core

Todas as alterações deste pacote de domínio puro serão documentadas aqui.
Este pacote adere ao [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

## [Unreleased] - 2026-11-22

### Adicionado
- **Abordagem Dual Adaptativa: Fórmulas de Nutrição Esportiva & Clínica Geral (`tmb-calculation.strategy.ts`, `macronutrients.vo.ts`)**:
  - Implementação das estratégias padrão-ouro de cálculo de TMB para atletas baseadas em Massa Livre de Gordura (MLG):
    - `CunninghamStrategy` (1980): $TMB = 500 + 22 \times MLG$.
    - `KatchMcArdleStrategy` (1996): $TMB = 370 + 21.6 \times MLG$.
    - `TinsleyStrategy` (2018): $TMB = 25.9 \times MLG + 284$ calibrada para praticantes de treinamento de força/resistido.
  - Implementação da estratégia internacional `OmsFaoStrategy` (1985/2004) para população geral estratificada por faixa etária.
  - Extensão do Value Object `Macronutrients`:
    - Suporte a instanciação a partir de prescrição esportiva `g/kg/dia` (`fromGramsPerKg`).
    - Suporte a instanciação a partir de VET alvo e percentuais clínicos (`fromCaloriesAndPercentages`).
    - Conversão e normalização em tempo real de gramas totais para `g/kg` com base no peso do paciente (`getGramsPerKg`).
  - Cobertura de testes unitários expandida para 13 testes passando (100% de sucesso).

## [0.1.0] - 2026-11-21

### Adicionado
- **Fase 0 (Setup do Monorepo & Domínio Puro)**:
  - Value Object `Macronutrients` com cálculo de VET (4 kcal para carboidrato/proteína e 9 kcal para gordura) e validações invariantes.
  - Testes unitários para `Macronutrients` (3/3 testes passando).
  - Padrão **Strategy** para cálculos de Taxa Metabólica Basal (TMB):
    - `MifflinStJeorStrategy` (1990) para homens e mulheres.
    - `HarrisBenedictStrategy` (1984) para homens e mulheres.
  - Testes unitários para as estratégias de TMB (3/3 testes passando).
  - Exportação unificada através de `src/index.ts`.
