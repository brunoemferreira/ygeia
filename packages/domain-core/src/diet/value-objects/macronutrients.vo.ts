/**
 * Value Object imutável que representa a distribuição de macronutrientes em gramas e calorias.
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
    return new Macronutrients(protein, carbs, fat);
  }

  public get totalKcal(): number {
    return this.proteinGrams * 4 + this.carbohydrateGrams * 4 + this.fatGrams * 9;
  }

  public get proteinPercentage(): number {
    return this.totalKcal === 0 ? 0 : ((this.proteinGrams * 4) / this.totalKcal) * 100;
  }

  public get carbohydratePercentage(): number {
    return this.totalKcal === 0 ? 0 : ((this.carbohydrateGrams * 4) / this.totalKcal) * 100;
  }

  public get fatPercentage(): number {
    return this.totalKcal === 0 ? 0 : ((this.fatGrams * 9) / this.totalKcal) * 100;
  }

  private validate(): void {
    if (this.proteinGrams < 0 || this.carbohydrateGrams < 0 || this.fatGrams < 0) {
      throw new Error('Macronutrientes não podem possuir valores negativos.');
    }
  }
}
