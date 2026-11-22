import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateConsumedMacros,
  calculateEquivalentQuantity,
  calculateHydrationPercentage,
  modulateOffDayCarbs,
} from './nutritionCalculations';
import { Meal } from '../types/patientApp';

describe('Mobile Nutrition Calculations (Patient App Logic)', () => {
  it('deve somar calorias e macronutrientes apenas das refeições concluídas', () => {
    const meals: Meal[] = [
      {
        id: '1',
        name: 'Café',
        time: '08:00',
        isCompleted: true,
        type: 'standard',
        calories: 400,
        protein: 30,
        carbs: 50,
        fats: 10,
        foods: [],
      },
      {
        id: '2',
        name: 'Almoço',
        time: '12:30',
        isCompleted: false, // não concluído
        type: 'standard',
        calories: 700,
        protein: 50,
        carbs: 80,
        fats: 15,
        foods: [],
      },
      {
        id: '3',
        name: 'Lanche',
        time: '16:00',
        isCompleted: true,
        type: 'standard',
        calories: 250,
        protein: 20,
        carbs: 30,
        fats: 5,
        foods: [],
      },
    ];

    const result = calculateConsumedMacros(meals);
    assert.strictEqual(result.calories, 650);
    assert.strictEqual(result.protein, 50);
    assert.strictEqual(result.carbs, 80);
    assert.strictEqual(result.fats, 15);
  });

  it('deve calcular a quantidade equivalente de substituição energética', () => {
    // Alimento original tem 240 kcal
    const originalFood = { calories: 240 };
    // Alimento substituto tem 120 kcal por 100g (ex: batata doce cozida)
    const grams = calculateEquivalentQuantity(originalFood, 120);

    // (240 / 120) * 100 = 200g
    assert.strictEqual(grams, 200);
  });

  it('deve calcular corretamente a porcentagem de hidratação sem estourar 100%', () => {
    assert.strictEqual(calculateHydrationPercentage(1500, 3000), 50);
    assert.strictEqual(calculateHydrationPercentage(3000, 3000), 100);
    assert.strictEqual(calculateHydrationPercentage(3500, 3000), 100);
    assert.strictEqual(calculateHydrationPercentage(0, 3000), 0);
  });

  it('deve aplicar redução de carboidratos em dia de descanso (OFF)', () => {
    // 300g de carbo no dia de treino com 25% de redução no descanso
    const offCarbs = modulateOffDayCarbs(300, 25);
    // 300 * 0.75 = 225g
    assert.strictEqual(offCarbs, 225);
  });
});
