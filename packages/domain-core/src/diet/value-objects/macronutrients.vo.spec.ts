import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Macronutrients } from './macronutrients.vo.js';

describe('Macronutrients Value Object', () => {
  it('deve calcular corretamente o total de calorias (4 kcal carb/prot, 9 kcal gord)', () => {
    // 100g prot (400), 200g carb (800), 50g gord (450) -> total 1650 kcal
    const macros = Macronutrients.create(100, 200, 50);
    assert.strictEqual(macros.totalKcal, 1650);
  });

  it('deve calcular as porcentagens de distribuição calórica', () => {
    const macros = Macronutrients.create(100, 200, 50);
    // 400 / 1650 = ~24.24%
    assert.ok(Math.abs(macros.proteinPercentage - 24.24) < 0.1);
  });

  it('deve rejeitar valores negativos lançando exceção', () => {
    assert.throws(() => {
      Macronutrients.create(-10, 100, 20);
    }, /valores negativos/);
  });
});
