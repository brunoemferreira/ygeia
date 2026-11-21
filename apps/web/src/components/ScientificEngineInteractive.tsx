import React, { useState, useMemo } from 'react';
import {
  MifflinStJeorStrategy,
  HarrisBenedictStrategy,
  Macronutrients
} from '@ygeia/domain-core';
import { Flame, PieChart, Zap } from 'lucide-react';

export const ScientificEngineInteractive: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(76);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [ageYears, setAgeYears] = useState<number>(29);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [strategyKey, setStrategyKey] = useState<'mifflin' | 'harris'>('mifflin');

  // Macronutrients
  const [proteinGrams, setProteinGrams] = useState<number>(160);
  const [carbsGrams, setCarbsGrams] = useState<number>(220);
  const [fatGrams, setFatGrams] = useState<number>(65);

  // Strategy Execution via Domain Core
  const tmb = useMemo(() => {
    const biometrics = { weightKg, heightCm, ageYears, gender };
    if (strategyKey === 'mifflin') {
      const s = new MifflinStJeorStrategy();
      return Math.round(s.calculate(biometrics));
    } else {
      const s = new HarrisBenedictStrategy();
      return Math.round(s.calculate(biometrics));
    }
  }, [weightKg, heightCm, ageYears, gender, strategyKey]);

  // Macronutrients Math via Domain VO
  const macroStats = useMemo(() => {
    try {
      const vo = Macronutrients.create(proteinGrams, carbsGrams, fatGrams);
      return {
        vet: vo.totalKcal,
        pPct: Math.round(vo.proteinPercentage),
        cPct: Math.round(vo.carbohydratePercentage),
        fPct: Math.round(vo.fatPercentage),
        proteinPerKg: (proteinGrams / weightKg).toFixed(1)
      };
    } catch {
      return { vet: 0, pPct: 0, cPct: 0, fPct: 0, proteinPerKg: '0' };
    }
  }, [proteinGrams, carbsGrams, fatGrams, weightKg]);

  return (
    <section id="simulador" style={{ padding: '5rem 0', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="pill-badge pill-cyan" style={{ marginBottom: '1rem' }}>
            <Zap size={14} /> Domain-Driven Design Puro
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Motor Científico Executado ao Vivo no Seu Navegador
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Não confie em planilhas sujeitas a fórmulas corrompidas. O Ygeía possui um motor desacoplado (Strategy Pattern) no pacote <code>@ygeia/domain-core</code> com precisão clínica. Experimente alterar os parâmetros:
          </p>
        </div>

        <div className="grid-responsive-1-2" style={{ gap: '2.5rem', alignItems: 'start' }}>
          {/* TMB Card (Left) */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>1. Taxa Metabólica Basal (TMB)</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Strategy Pattern Polimórfico</span>
                </div>
              </div>
              <span className="pill-badge pill-emerald">Zero Latência</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Sexo Biológico
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setGender('MALE')}
                    className={gender === 'MALE' ? 'btn-primary' : 'btn-secondary'}
                    style={{ flex: 1, minHeight: '40px', padding: '0.5rem', fontSize: '0.875rem' }}
                  >
                    Masculino
                  </button>
                  <button
                    onClick={() => setGender('FEMALE')}
                    className={gender === 'FEMALE' ? 'btn-primary' : 'btn-secondary'}
                    style={{ flex: 1, minHeight: '40px', padding: '0.5rem', fontSize: '0.875rem' }}
                  >
                    Feminino
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Fórmula Científica
                </label>
                <select
                  className="input-field"
                  style={{ minHeight: '40px', padding: '0.5rem' }}
                  value={strategyKey}
                  onChange={(e) => setStrategyKey(e.target.value as 'mifflin' | 'harris')}
                >
                  <option value="mifflin">Mifflin-St Jeor (1990)</option>
                  <option value="harris">Harris-Benedict (1984)</option>
                </select>
              </div>
            </div>

            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span>Peso Atual</span>
                  <span style={{ color: '#059669' }}>{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span>Estatura</span>
                  <span style={{ color: '#059669' }}>{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="140"
                  max="215"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span>Idade</span>
                  <span style={{ color: '#059669' }}>{ageYears} anos</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="90"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* TMB Result Box */}
            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
              border: '1.5px solid #a7f3d0',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                  Gasto Metabólico Basal (TMB):
                </span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                  {tmb} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b' }}>kcal / dia</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="pill-badge pill-emerald" style={{ fontSize: '0.75rem' }}>
                  {strategyKey === 'mifflin' ? 'Mifflin (1990)' : 'Harris (1984)'}
                </span>
              </div>
            </div>
          </div>

          {/* Macronutrients Card (Right) */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem' }}>2. Balanço de Macronutrientes</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Value Object Imutável (VET)</span>
                </div>
              </div>
              <span className="pill-badge pill-cyan">4-4-9 Atwater</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span style={{ color: '#059669' }}>Proteína: {proteinGrams}g</span>
                  <span style={{ color: '#64748b' }}>{macroStats.proteinPerKg} g/kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="300"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span style={{ color: '#0284c7' }}>Carboidratos: {carbsGrams}g</span>
                  <span style={{ color: '#64748b' }}>{macroStats.cPct}% da dieta</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <span style={{ color: '#ea580c' }}>Gorduras: {fatGrams}g</span>
                  <span style={{ color: '#64748b' }}>{macroStats.fPct}% da dieta</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Proportion Visual Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}>
                <div style={{ width: `${macroStats.pPct}%`, background: '#059669' }} title="Proteína" />
                <div style={{ width: `${macroStats.cPct}%`, background: '#0284c7' }} title="Carboidrato" />
                <div style={{ width: `${macroStats.fPct}%`, background: '#ea580c' }} title="Gordura" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                <span style={{ color: '#059669' }}>● Prot: {macroStats.pPct}%</span>
                <span style={{ color: '#0284c7' }}>● Carb: {macroStats.cPct}%</span>
                <span style={{ color: '#ea580c' }}>● Gord: {macroStats.fPct}%</span>
              </div>
            </div>

            {/* Total VET Result Box */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '1.5px solid #bae6fd',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase' }}>
                  Valor Energético Total (VET):
                </span>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
                  {macroStats.vet} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b' }}>kcal</span>
                </div>
              </div>
              <span className="pill-badge pill-cyan" style={{ fontSize: '0.75rem' }}>
                Balanço Ideal
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
