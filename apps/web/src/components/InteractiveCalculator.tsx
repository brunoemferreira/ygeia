import React, { useState, useMemo } from 'react';
import {
  MifflinStJeorStrategy,
  HarrisBenedictStrategy,
  Macronutrients
} from '@ygeia/domain-core';
import { Flame, PieChart, Sparkles } from 'lucide-react';

export const InteractiveCalculator: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [ageYears, setAgeYears] = useState<number>(30);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [strategyName, setStrategyName] = useState<'mifflin' | 'harris'>('mifflin');

  // Macronutrient target grams
  const [proteinGrams, setProteinGrams] = useState<number>(150);
  const [carbsGrams, setCarbsGrams] = useState<number>(200);
  const [fatGrams, setFatGrams] = useState<number>(60);

  // Calculate TMB using Domain Strategy Pattern
  const tmbCalculated = useMemo(() => {
    const biometrics = { weightKg, heightCm, ageYears, gender };
    if (strategyName === 'mifflin') {
      const strategy = new MifflinStJeorStrategy();
      return Math.round(strategy.calculate(biometrics));
    } else {
      const strategy = new HarrisBenedictStrategy();
      return Math.round(strategy.calculate(biometrics));
    }
  }, [weightKg, heightCm, ageYears, gender, strategyName]);

  // Calculate Macronutrients using Domain Value Object
  const macroStats = useMemo(() => {
    try {
      const macros = Macronutrients.create(proteinGrams, carbsGrams, fatGrams);
      return {
        totalKcal: macros.totalKcal,
        percentages: {
          protein: Math.round(macros.proteinPercentage),
          carbohydrate: Math.round(macros.carbohydratePercentage),
          fat: Math.round(macros.fatPercentage)
        }
      };
    } catch {
      return { totalKcal: 0, percentages: { protein: 0, carbohydrate: 0, fat: 0 } };
    }
  }, [proteinGrams, carbsGrams, fatGrams]);

  return (
    <section id="calculadora" style={{ padding: '4rem 0', background: 'var(--gray-bg)', borderBottom: '1px solid var(--gray-border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Demonstração Interativa ao Vivo
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
            Experimente o Motor Científico em Tempo Real
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Este simulador executa o código puro do pacote <code>@ygeia/domain-core</code> no seu navegador com o Strategy Pattern.
          </p>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '2rem', alignItems: 'start' }}>
          {/* Card 1: Antropometria & TMB */}
          <div className="card card-highlight">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="icon-box icon-box-green" style={{ marginBottom: 0 }}>
                <Flame size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>1. Taxa Metabólica Basal (TMB)</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cálculo por Strategy Pattern</span>
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Sexo Biológico</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fórmula Científica</label>
                <select
                  className="form-select"
                  value={strategyName}
                  onChange={(e) => setStrategyName(e.target.value as 'mifflin' | 'harris')}
                >
                  <option value="mifflin">Mifflin-St Jeor (1990)</option>
                  <option value="harris">Harris-Benedict (1984)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input
                  type="number"
                  className="form-input"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Altura (cm)</label>
                <input
                  type="number"
                  className="form-input"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Idade (anos)</label>
                <input
                  type="number"
                  className="form-input"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{
              background: 'var(--primary-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>TMB Estimada:</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>
                  {tmbCalculated} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>kcal/dia</span>
                </div>
              </div>
              <span className="badge badge-primary">Precisão Clínica</span>
            </div>
          </div>

          {/* Card 2: Balanço de Macronutrientes (VO) */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="icon-box icon-box-blue" style={{ marginBottom: 0 }}>
                <PieChart size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>2. Balanço de Macronutrientes</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Value Object Imutável</span>
              </div>
            </div>

            <div className="grid grid-cols-3" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Proteína (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Carboidrato (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gordura (g)</label>
                <input
                  type="number"
                  className="form-input"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Visual Distribution Bar */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span style={{ color: '#0284c7' }}>Carb: {macroStats.percentages.carbohydrate}%</span>
                <span style={{ color: '#059669' }}>Prot: {macroStats.percentages.protein}%</span>
                <span style={{ color: '#d97706' }}>Gord: {macroStats.percentages.fat}%</span>
              </div>
              <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${macroStats.percentages.carbohydrate}%`, background: '#0284c7' }} />
                <div style={{ width: `${macroStats.percentages.protein}%`, background: '#059669' }} />
                <div style={{ width: `${macroStats.percentages.fat}%`, background: '#d97706' }} />
              </div>
            </div>

            <div style={{
              background: '#f1f5f9',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Valor Energético Total (VET):</span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>
                  {macroStats.totalKcal} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)' }}>kcal</span>
                </div>
              </div>
              <span className="badge badge-secondary">4-4-9 Atwater</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
