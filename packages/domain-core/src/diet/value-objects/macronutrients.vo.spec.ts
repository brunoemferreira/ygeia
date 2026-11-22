import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Macronutrients } from './macronutrients.vo.js';

describe('Macronutrients Value Object (Bidirectional % and g/kg)', () => {
  it('deve calcular corretamente o total de calorias (4 kcal carb/prot, 9 kcal gord)', () => {
    const macros = Macronutrients.create(100, 200, 50);
    assert.strictEqual(macros.totalKcal, 1650);
  });

  it('deve calcular as porcentagens de distribuição calórica', () => {
    const macros = Macronutrients.create(100, 200, 50);
    // 400 / 1650 = ~24%
    assert.strictEqual(macros.proteinPercentage, 24);
  });

  it('deve instanciar a partir de prescrição esportiva g/kg/dia', () => {
    // Atleta de 70kg: 2.0 g/kg proteína (140g), 5.0 g/kg carbo (350g), 1.0 g/kg gordura (70g)
    const macros = Macronutrients.fromGramsPerKg(70, 2.0, 5.0, 1.0);
    assert.strictEqual(macros.proteinGrams, 140);
    assert.strictEqual(macros.carbohydrateGrams, 350);
    assert.strictEqual(macros.fatGrams, 70);
    // VET: 140*4 (560) + 350*4 (1400) + 70*9 (630) = 2590 kcal
    assert.strictEqual(macros.totalKcal, 2590);
  });

  it('deve converter corretamente de calorias alvo e percentuais clínicos', () => {
    // Paciente clínico geral: 2000 kcal com 50% carbo (1000 kcal = 250g), 20% prot (400 kcal = 100g), 30% gord (600 kcal = 66.7g)
    const macros = Macronutrients.fromCaloriesAndPercentages(2000, 20, 50, 30);
    assert.strictEqual(macros.proteinGrams, 100);
    assert.strictEqual(macros.carbohydrateGrams, 250);
    assert.strictEqual(macros.fatGrams, 66.7);
    assert.strictEqual(macros.totalKcal, 2000);
  });

  it('deve calcular g/kg a partir de um peso de referência', () => {
    const macros = Macronutrients.create(160, 240, 60);
    const gPerKg = macros.getGramsPerKg(80);
    assert.strictEqual(gPerKg.protein, 2.0);
    assert.strictEqual(gPerKg.carbs, 3.0);
    assert.strictEqual(gPerKg.fat, 0.75);
  });

  it('deve rejeitar valores negativos lançando exceção', () => {
    assert.throws(() => {
      Macronutrients.create(-10, 100, 20);
    }, /valores negativos/);
  });
});
