/**
 * Value Object imutável que representa a distribuição de macronutrientes em gramas e calorias.
 * Suporta conversão bidirecional entre gramas absolutas, percentuais calóricos e prescrição g/kg/dia.
 */
export class Macronutrients {
  private constructor(
    public readonly proteinGrams: number,
    public readonly carbohydrateGrams: number,
    public readonly fatGrams: number,
  ) {
    this.validate();
  }

  public static create(protein: number, carbs: number, fat: number): Macronutrients {
    return new Macronutrients(
      Math.round(protein * 10) / 10,
      Math.round(carbs * 10) / 10,
      Math.round(fat * 10) / 10,
    );
  }

  /**
   * Construtor para nutrição esportiva e clínica baseada em gramas por quilo de peso corporal (g/kg/dia).
   */
  public static fromGramsPerKg(
    weightKg: number,
    proteinGPerKg: number,
    carbsGPerKg: number,
    fatGPerKg: number,
  ): Macronutrients {
    if (weightKg <= 0) {
      throw new Error('Peso corporal deve ser maior que zero para o cálculo de g/kg/dia.');
    }
    return new Macronutrients(
      Math.round(weightKg * proteinGPerKg * 10) / 10,
      Math.round(weightKg * carbsGPerKg * 10) / 10,
      Math.round(weightKg * fatGPerKg * 10) / 10,
    );
  }

  /**
   * Construtor para clínica geral baseado em VET alvo (kcal) e distribuição percentual (ex: 50% C, 20% P, 30% G).
   */
  public static fromCaloriesAndPercentages(
    targetKcal: number,
    proteinPct: number,
    carbsPct: number,
    fatPct: number,
  ): Macronutrients {
    if (targetKcal <= 0) {
      throw new Error('VET alvo deve ser maior que zero.');
    }
    const sumPct = proteinPct + carbsPct + fatPct;
    if (Math.abs(sumPct - 100) > 1) {
      throw new Error(`A soma dos percentuais calóricos deve ser 100% (atual: ${sumPct}%).`);
    }

    const proteinGrams = (targetKcal * (proteinPct / 100)) / 4;
    const carbsGrams = (targetKcal * (carbsPct / 100)) / 4;
    const fatGrams = (targetKcal * (fatPct / 100)) / 9;

    return new Macronutrients(
      Math.round(proteinGrams * 10) / 10,
      Math.round(carbsGrams * 10) / 10,
      Math.round(fatGrams * 10) / 10,
    );
  }

  public get totalKcal(): number {
    return Math.round(this.proteinGrams * 4 + this.carbohydrateGrams * 4 + this.fatGrams * 9);
  }

  public get proteinPercentage(): number {
    return this.totalKcal === 0 ? 0 : Math.round(((this.proteinGrams * 4) / this.totalKcal) * 100);
  }

  public get carbohydratePercentage(): number {
    return this.totalKcal === 0 ? 0 : Math.round(((this.carbohydrateGrams * 4) / this.totalKcal) * 100);
  }

  public get fatPercentage(): number {
    return this.totalKcal === 0 ? 0 : Math.round(((this.fatGrams * 9) / this.totalKcal) * 100);
  }

  /**
   * Retorna os valores normalizados em gramas por quilo (g/kg/dia).
   */
  public getGramsPerKg(weightKg: number): { protein: number; carbs: number; fat: number } {
    if (weightKg <= 0) {
      return { protein: 0, carbs: 0, fat: 0 };
    }
    return {
      protein: Math.round((this.proteinGrams / weightKg) * 100) / 100,
      carbs: Math.round((this.carbohydrateGrams / weightKg) * 100) / 100,
      fat: Math.round((this.fatGrams / weightKg) * 100) / 100,
    };
  }

  private validate(): void {
    if (this.proteinGrams < 0 || this.carbohydrateGrams < 0 || this.fatGrams < 0) {
      throw new Error('Macronutrientes não podem possuir valores negativos.');
    }
  }
}
