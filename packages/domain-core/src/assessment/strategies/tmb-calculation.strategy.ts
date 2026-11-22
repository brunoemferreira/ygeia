export interface PatientBiometrics {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'MALE' | 'FEMALE';
  bodyFatPercentage?: number;
  leanMassKg?: number;
}

export interface ITmbCalculationStrategy {
  readonly name: string;
  readonly category: 'CLINICAL' | 'SPORTS';
  calculate(biometrics: PatientBiometrics): number;
}

/**
 * Função utilitária para extrair ou estimar a Massa Livre de Gordura (MLG) em kg.
 */
function resolveLeanMassKg(biometrics: PatientBiometrics): number {
  if (typeof biometrics.leanMassKg === 'number' && biometrics.leanMassKg > 0) {
    return biometrics.leanMassKg;
  }
  if (typeof biometrics.bodyFatPercentage === 'number' && biometrics.bodyFatPercentage > 0) {
    return biometrics.weightKg * (1 - biometrics.bodyFatPercentage / 100);
  }
  // Estimativa de referência caso nem MLG nem %BF tenham sido coletados (homens ~82% MLG, mulheres ~76% MLG)
  const defaultLbmFactor = biometrics.gender === 'MALE' ? 0.82 : 0.76;
  return biometrics.weightKg * defaultLbmFactor;
}

// ==========================================
// ESTRATÉGIAS CLÍNICAS GERAIS
// ==========================================

export class MifflinStJeorStrategy implements ITmbCalculationStrategy {
  readonly name = 'Mifflin-St Jeor (1990)';
  readonly category = 'CLINICAL' as const;

  calculate(biometrics: PatientBiometrics): number {
    const { weightKg, heightCm, ageYears, gender } = biometrics;
    const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
    return gender === 'MALE' ? Math.round(base + 5) : Math.round(base - 161);
  }
}

export class HarrisBenedictStrategy implements ITmbCalculationStrategy {
  readonly name = 'Harris-Benedict (1984)';
  readonly category = 'CLINICAL' as const;

  calculate(biometrics: PatientBiometrics): number {
    const { weightKg, heightCm, ageYears, gender } = biometrics;
    if (gender === 'MALE') {
      return Math.round(88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears);
    }
    return Math.round(447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears);
  }
}

export class OmsFaoStrategy implements ITmbCalculationStrategy {
  readonly name = 'OMS / FAO (1985/2004)';
  readonly category = 'CLINICAL' as const;

  calculate(biometrics: PatientBiometrics): number {
    const { weightKg, ageYears, gender } = biometrics;

    if (gender === 'MALE') {
      if (ageYears < 3) return Math.round(60.9 * weightKg - 54);
      if (ageYears <= 10) return Math.round(22.7 * weightKg + 495);
      if (ageYears <= 18) return Math.round(17.5 * weightKg + 651);
      if (ageYears <= 30) return Math.round(15.3 * weightKg + 679);
      if (ageYears <= 60) return Math.round(11.6 * weightKg + 879);
      return Math.round(13.5 * weightKg + 487);
    } else {
      if (ageYears < 3) return Math.round(61.0 * weightKg - 51);
      if (ageYears <= 10) return Math.round(22.5 * weightKg + 499);
      if (ageYears <= 18) return Math.round(12.2 * weightKg + 746);
      if (ageYears <= 30) return Math.round(14.7 * weightKg + 496);
      if (ageYears <= 60) return Math.round(8.7 * weightKg + 829);
      return Math.round(10.5 * weightKg + 596);
    }
  }
}

// ==========================================
// ESTRATÉGIAS ESPORTIVAS / ALTA PERFORMANCE
// ==========================================

export class CunninghamStrategy implements ITmbCalculationStrategy {
  readonly name = 'Cunningham (1980)';
  readonly category = 'SPORTS' as const;

  calculate(biometrics: PatientBiometrics): number {
    const lbm = resolveLeanMassKg(biometrics);
    // Fórmula padrão ouro para atletas: TMB = 500 + (22 * MLG)
    return Math.round(500 + 22 * lbm);
  }
}

export class KatchMcArdleStrategy implements ITmbCalculationStrategy {
  readonly name = 'Katch-McArdle (1996)';
  readonly category = 'SPORTS' as const;

  calculate(biometrics: PatientBiometrics): number {
    const lbm = resolveLeanMassKg(biometrics);
    // TMB = 370 + (21.6 * MLG)
    return Math.round(370 + 21.6 * lbm);
  }
}

export class TinsleyStrategy implements ITmbCalculationStrategy {
  readonly name = 'Tinsley (2018)';
  readonly category = 'SPORTS' as const;

  calculate(biometrics: PatientBiometrics): number {
    const lbm = resolveLeanMassKg(biometrics);
    // Equação calibrada especificamente para praticantes de treinamento de força: TMB = 25.9 * MLG + 284
    return Math.round(25.9 * lbm + 284);
  }
}
