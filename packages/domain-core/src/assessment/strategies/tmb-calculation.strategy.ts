export interface PatientBiometrics {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'MALE' | 'FEMALE';
  bodyFatPercentage?: number;
}

export interface ITmbCalculationStrategy {
  readonly name: string;
  calculate(biometrics: PatientBiometrics): number;
}

export class MifflinStJeorStrategy implements ITmbCalculationStrategy {
  readonly name = 'Mifflin-St Jeor (1990)';

  calculate(biometrics: PatientBiometrics): number {
    const { weightKg, heightCm, ageYears, gender } = biometrics;
    const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
    return gender === 'MALE' ? Math.round(base + 5) : Math.round(base - 161);
  }
}

export class HarrisBenedictStrategy implements ITmbCalculationStrategy {
  readonly name = 'Harris-Benedict (1984)';

  calculate(biometrics: PatientBiometrics): number {
    const { weightKg, heightCm, ageYears, gender } = biometrics;
    if (gender === 'MALE') {
      return Math.round(88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears);
    }
    return Math.round(447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears);
  }
}
