# Changelog - @ygeia/domain-core

Todas as alterações deste pacote de domínio puro serão documentadas aqui.
Este pacote adere ao [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e [SemVer](https://semver.org/).

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
