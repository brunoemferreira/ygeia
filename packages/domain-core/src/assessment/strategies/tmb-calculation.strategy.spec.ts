import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  MifflinStJeorStrategy,
  HarrisBenedictStrategy,
  PatientBiometrics,
} from './tmb-calculation.strategy.js';

describe('TMB Calculation Strategies (Strategy Pattern)', () => {
  const malePatient: PatientBiometrics = {
    weightKg: 80,
    heightCm: 180,
    ageYears: 30,
    gender: 'MALE',
  };

  const femalePatient: PatientBiometrics = {
    weightKg: 60,
    heightCm: 165,
    ageYears: 28,
    gender: 'FEMALE',
  };

  it('deve calcular TMB corretamente via Mifflin-St Jeor para homem', () => {
    const strategy = new MifflinStJeorStrategy();
    // 10*80 (800) + 6.25*180 (1125) - 5*30 (150) + 5 = 1780 kcal
    assert.strictEqual(strategy.calculate(malePatient), 1780);
  });

  it('deve calcular TMB corretamente via Mifflin-St Jeor para mulher', () => {
    const strategy = new MifflinStJeorStrategy();
    // 10*60 (600) + 6.25*165 (1031.25) - 5*28 (140) - 161 = ~1330 kcal
    assert.strictEqual(strategy.calculate(femalePatient), 1330);
  });

  it('deve calcular TMB corretamente via Harris-Benedict para homem', () => {
    const strategy = new HarrisBenedictStrategy();
    // 88.362 + 13.397*80 + 4.799*180 - 5.677*30 = ~1854 kcal
    assert.strictEqual(strategy.calculate(malePatient), 1854);
  });
});
