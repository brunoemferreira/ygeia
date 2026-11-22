import { Meal, MealFood } from '../types/patientApp';

export interface ConsumedMacros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

/**
 * Calcula o total de calorias e macronutrientes apenas das refeições marcadas como concluídas.
 */
export function calculateConsumedMacros(meals: Meal[]): ConsumedMacros {
  return meals.reduce(
    (acc, meal) => {
      if (meal.isCompleted) {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fats += meal.fats;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
}

/**
 * Calcula a quantidade de alimento equivalente para manter o mesmo aporte calórico.
 */
export function calculateEquivalentQuantity(
  originalFood: Pick<MealFood, 'calories'>,
  targetCaloriesPer100g: number
): number {
  if (targetCaloriesPer100g <= 0) {
    throw new Error('Calorias por 100g do alimento alvo devem ser maiores que zero.');
  }
  const grams = (originalFood.calories / targetCaloriesPer100g) * 100;
  return Math.round(grams);
}

/**
 * Calcula o percentual de adesão à meta de água (limitado a 100% ou retorno exato).
 */
export function calculateHydrationPercentage(currentMl: number, targetMl: number): number {
  if (targetMl <= 0) return 0;
  const ratio = (currentMl / targetMl) * 100;
  return Math.min(100, Math.round(ratio));
}

/**
 * Modula a ingestão de carboidratos para dias de descanso (OFF).
 */
export function modulateOffDayCarbs(trainingDayCarbs: number, reductionPercentage = 25): number {
  if (reductionPercentage < 0 || reductionPercentage > 100) {
    throw new Error('A porcentagem de redução de carboidratos deve estar entre 0 e 100.');
  }
  const factor = (100 - reductionPercentage) / 100;
  return Math.round(trainingDayCarbs * factor);
}
