import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  MifflinStJeorStrategy,
  HarrisBenedictStrategy,
  OmsFaoStrategy,
  CunninghamStrategy,
  KatchMcArdleStrategy,
  TinsleyStrategy,
  PatientBiometrics,
} from './tmb-calculation.strategy.js';

describe('TMB Calculation Strategies (Strategy Pattern - Dual Clinical & Sports)', () => {
  const malePatient: PatientBiometrics = {
    weightKg: 80,
    heightCm: 180,
    ageYears: 30,
    gender: 'MALE',
    bodyFatPercentage: 15, // MLG estimada = 80 * 0.85 = 68 kg
  };

  const femalePatient: PatientBiometrics = {
    weightKg: 60,
    heightCm: 165,
    ageYears: 28,
    gender: 'FEMALE',
    leanMassKg: 46, // MLG explícita = 46 kg
  };

  // 1. Clínico Geral
  it('deve calcular TMB corretamente via Mifflin-St Jeor para homem', () => {
    const strategy = new MifflinStJeorStrategy();
    assert.strictEqual(strategy.calculate(malePatient), 1780);
  });

  it('deve calcular TMB corretamente via Mifflin-St Jeor para mulher', () => {
    const strategy = new MifflinStJeorStrategy();
    assert.strictEqual(strategy.calculate(femalePatient), 1330);
  });

  it('deve calcular TMB corretamente via Harris-Benedict para homem', () => {
    const strategy = new HarrisBenedictStrategy();
    assert.strictEqual(strategy.calculate(malePatient), 1854);
  });

  it('deve calcular TMB via OMS / FAO para adulto', () => {
    const strategy = new OmsFaoStrategy();
    // Homem 30 anos: 15.3 * 80 + 679 = 1903 kcal
    assert.strictEqual(strategy.calculate(malePatient), 1903);
  });

  // 2. Nutrição Esportiva (Baseada em Massa Magra / MLG)
  it('deve calcular TMB de atleta via Cunningham (1980) a partir da MLG', () => {
    const strategy = new CunninghamStrategy();
    // MLG do malePatient = 68 kg -> 500 + 22 * 68 = 1996 kcal
    assert.strictEqual(strategy.calculate(malePatient), 1996);
  });

  it('deve calcular TMB de atleta via Katch-McArdle (1996)', () => {
    const strategy = new KatchMcArdleStrategy();
    // MLG do malePatient = 68 kg -> 370 + 21.6 * 68 = 1839 kcal
    assert.strictEqual(strategy.calculate(malePatient), 1839);
  });

  it('deve calcular TMB para treinamento resistido via Tinsley (2018)', () => {
    const strategy = new TinsleyStrategy();
    // MLG da femalePatient = 46 kg -> 25.9 * 46 + 284 = 1475 kcal
    assert.strictEqual(strategy.calculate(femalePatient), 1475);
  });
});
