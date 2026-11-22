import React, { useState, useMemo } from 'react';
import {
  MifflinStJeorStrategy,
  HarrisBenedictStrategy,
  Macronutrients,
} from '@ygeia/domain-core';
import {
  Flame,
  PieChart,
  Zap,
  Scale,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense' | 'very_intense';
type GoalType = 'weight_loss' | 'maintenance' | 'muscle_gain';

const ACTIVITY_FACTORS: Record<ActivityLevel, { factor: number; label: string; desc: string }> = {
  sedentary: { factor: 1.2, label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
  light: { factor: 1.375, label: 'Leve (1-3x/sem)', desc: 'Treinos leves ocasionais' },
  moderate: { factor: 1.55, label: 'Moderado (3-5x/sem)', desc: 'Treinos moderados regulares' },
  intense: { factor: 1.725, label: 'Intenso (6-7x/sem)', desc: 'Treinos intensos frequentes' },
  very_intense: { factor: 1.9, label: 'Atleta / 2x dia', desc: 'Atleta ou trabalho pesado' },
};

const GOAL_ADJUSTMENTS: Record<GoalType, { kcal: number; label: string; icon: any; color: string }> = {
  weight_loss: { kcal: -400, label: 'Emagrecimento (-400 kcal)', icon: TrendingDown, color: '#059669' },
  maintenance: { kcal: 0, label: 'Manutenção (Normocalórica)', icon: Scale, color: '#0284c7' },
  muscle_gain: { kcal: 350, label: 'Hipertrofia (+350 kcal)', icon: TrendingUp, color: '#8b5cf6' },
};

export const ScientificEngineInteractive: React.FC = () => {
  // Biometrics
  const [weightKg, setWeightKg] = useState<number>(76);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [ageYears, setAgeYears] = useState<number>(29);
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [strategyKey, setStrategyKey] = useState<'mifflin' | 'harris'>('mifflin');

  // Lifestyle & Clinical Goal
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<GoalType>('muscle_gain');

  // Macronutrients (Grams)
  const [proteinGrams, setProteinGrams] = useState<number>(165);
  const [carbsGrams, setCarbsGrams] = useState<number>(250);
  const [fatGrams, setFatGrams] = useState<number>(65);

  // 1. IMC & Classificação OMS
  const { imc, imcCategory, imcColor } = useMemo(() => {
    const heightM = heightCm / 100;
    const value = weightKg / (heightM * heightM);
    const rounded = Number(value.toFixed(1));

    if (rounded < 18.5) return { imc: rounded, imcCategory: 'Abaixo do Peso', imcColor: '#eab308' };
    if (rounded < 25.0) return { imc: rounded, imcCategory: 'Eutrofia (Peso Normal)', imcColor: '#059669' };
    if (rounded < 30.0) return { imc: rounded, imcCategory: 'Sobrepeso', imcColor: '#f97316' };
    if (rounded < 35.0) return { imc: rounded, imcCategory: 'Obesidade Grau I', imcColor: '#ef4444' };
    return { imc: rounded, imcCategory: 'Obesidade Grau II+', imcColor: '#b91c1c' };
  }, [weightKg, heightCm]);

  // 2. TMB (Taxa Metabólica Basal) via Strategy Pattern (@ygeia/domain-core)
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

  // 3. GET (Gasto Energético Total)
  const getKcal = useMemo(() => {
    const factor = ACTIVITY_FACTORS[activityLevel].factor;
    return Math.round(tmb * factor);
  }, [tmb, activityLevel]);

  // 4. Meta Calórica Alvo
  const targetKcal = useMemo(() => {
    const adjustment = GOAL_ADJUSTMENTS[goal].kcal;
    return Math.max(1200, getKcal + adjustment);
  }, [getKcal, goal]);

  // 5. Macronutrientes via Domain VO (@ygeia/domain-core)
  const macroStats = useMemo(() => {
    try {
      const vo = Macronutrients.create(
        Math.max(0, proteinGrams),
        Math.max(0, carbsGrams),
        Math.max(0, fatGrams),
      );
      return {
        vet: vo.totalKcal,
        pPct: Math.round(vo.proteinPercentage),
        cPct: Math.round(vo.carbohydratePercentage),
        fPct: Math.round(vo.fatPercentage),
        pPerKg: (proteinGrams / weightKg).toFixed(1),
        cPerKg: (carbsGrams / weightKg).toFixed(1),
        fPerKg: (fatGrams / weightKg).toFixed(1),
      };
    } catch {
      return {
        vet: 0,
        pPct: 0,
        cPct: 0,
        fPct: 0,
        pPerKg: '0',
        cPerKg: '0',
        fPerKg: '0',
      };
    }
  }, [proteinGrams, carbsGrams, fatGrams, weightKg]);

  // 6. Diferença calórica entre a meta e os macronutrientes prescritos
  const calorieDelta = macroStats.vet - targetKcal;

  // 1-Click Clinical Macro Presets
  const applyPreset = (type: 'hypertrophy' | 'fat_loss' | 'low_carb' | 'balanced') => {
    if (type === 'hypertrophy') {
      const p = Math.round(weightKg * 2.2);
      const f = Math.round(weightKg * 0.9);
      const remainingKcal = Math.max(0, targetKcal - (p * 4 + f * 9));
      const c = Math.round(remainingKcal / 4);
      setProteinGrams(p);
      setFatGrams(f);
      setCarbsGrams(c);
    } else if (type === 'fat_loss') {
      const p = Math.round(weightKg * 2.0);
      const f = Math.round(weightKg * 0.7);
      const remainingKcal = Math.max(0, targetKcal - (p * 4 + f * 9));
      const c = Math.round(remainingKcal / 4);
      setProteinGrams(p);
      setFatGrams(f);
      setCarbsGrams(c);
    } else if (type === 'low_carb') {
      const p = Math.round(weightKg * 1.8);
      const c = Math.round(weightKg * 1.0);
      const remainingKcal = Math.max(0, targetKcal - (p * 4 + c * 4));
      const f = Math.round(remainingKcal / 9);
      setProteinGrams(p);
      setCarbsGrams(c);
      setFatGrams(f);
    } else {
      // Balanced 50% carbs, 25% prot, 25% fat
      const p = Math.round((targetKcal * 0.25) / 4);
      const c = Math.round((targetKcal * 0.5) / 4);
      const f = Math.round((targetKcal * 0.25) / 9);
      setProteinGrams(p);
      setCarbsGrams(c);
      setFatGrams(f);
    }
  };

  // Auto-adjust carbs to perfectly match target
  const handleBalanceWithCarbs = () => {
    const caloriesWithoutCarbs = proteinGrams * 4 + fatGrams * 9;
    const neededFromCarbs = Math.max(0, targetKcal - caloriesWithoutCarbs);
    setCarbsGrams(Math.round(neededFromCarbs / 4));
  };

  return (
    <section id="simulador" style={{ padding: '5rem 0', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem auto' }}>
          <span className="pill-badge pill-cyan" style={{ marginBottom: '1rem' }}>
            <Zap size={14} /> Domain-Driven Design & Strategy Pattern
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Motor Científico Nutricional ao Vivo
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', lineHeight: '1.6', margin: 0 }}>
            Simulação clínica real executada pelo pacote isolado <code>@ygeia/domain-core</code>. Altere a biometria, o fator de atividade e o objetivo clínico para recalcular TMB, GET e a distribuição de macronutrientes com zero latência.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* ========================================================
              CARD 1: AVALIAÇÃO ANTROPOMÉTRICA & GASTO ENERGÉTICO (TMB/GET)
             ======================================================== */}
          <div className="glass-card" style={{ padding: '2rem', background: 'white' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, margin: 0 }}>
                    1. Biometria & Gasto Energético
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    TMB • Fator Atividade • GET (FAO/OMS)
                  </span>
                </div>
              </div>
              <span className="pill-badge pill-emerald" style={{ fontSize: '0.6875rem' }}>
                Ao Vivo
              </span>
            </div>

            {/* Sexo & Fórmula */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Sexo Biológico
                </label>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  <button
                    type="button"
                    onClick={() => setGender('MALE')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: gender === 'MALE' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      background: gender === 'MALE' ? '#ecfdf5' : 'white',
                      color: gender === 'MALE' ? '#065f46' : '#64748b',
                    }}
                  >
                    Masculino
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('FEMALE')}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: gender === 'FEMALE' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      background: gender === 'FEMALE' ? '#ecfdf5' : 'white',
                      color: gender === 'FEMALE' ? '#065f46' : '#64748b',
                    }}
                  >
                    Feminino
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Equação Preditiva
                </label>
                <select
                  value={strategyKey}
                  onChange={(e) => setStrategyKey(e.target.value as any)}
                  className="ygeia-select"
                  style={{
                    minHeight: '38px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="mifflin">Mifflin-St Jeor (1990) [EAL]</option>
                  <option value="harris">Harris-Benedict (1984)</option>
                </select>
              </div>
            </div>

            {/* Sliders with Direct Number Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem', marginBottom: '1.25rem' }}>
              {/* Peso */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Peso Corporal
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input
                      type="number"
                      min="35"
                      max="200"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Math.max(30, Math.min(220, Number(e.target.value) || 0)))}
                      style={{
                        width: '64px',
                        padding: '0.25rem 0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#059669',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        textAlign: 'right',
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>kg</span>
                  </div>
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

              {/* Altura */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Estatura
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input
                      type="number"
                      min="120"
                      max="230"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Math.max(100, Math.min(240, Number(e.target.value) || 0)))}
                      style={{
                        width: '64px',
                        padding: '0.25rem 0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#059669',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        textAlign: 'right',
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>cm</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="135"
                  max="215"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>

              {/* Idade */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Idade
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input
                      type="number"
                      min="12"
                      max="100"
                      value={ageYears}
                      onChange={(e) => setAgeYears(Math.max(10, Math.min(105, Number(e.target.value) || 0)))}
                      style={{
                        width: '64px',
                        padding: '0.25rem 0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#059669',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        textAlign: 'right',
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>anos</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="16"
                  max="85"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* IMC Result Pill */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '0.625rem 0.875rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={16} color="#64748b" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                  Índice de Massa Corporal (IMC):
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>{imc} kg/m²</strong>
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: imcColor,
                  background: 'white',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  border: `1px solid ${imcColor}40`,
                }}>
                  {imcCategory}
                </span>
              </div>
            </div>

            {/* Nível de Atividade & Objetivo Clínico */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Fator de Atividade Física
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as any)}
                  className="ygeia-select"
                  style={{
                    minHeight: '38px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {Object.entries(ACTIVITY_FACTORS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label} (×{val.factor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Objetivo Clínico
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as any)}
                  className="ygeia-select"
                  style={{
                    minHeight: '38px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="weight_loss">Emagrecimento (-400 kcal)</option>
                  <option value="maintenance">Manutenção (GET)</option>
                  <option value="muscle_gain">Hipertrofia (+350 kcal)</option>
                </select>
              </div>
            </div>

            {/* Calculations Outcome Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* TMB Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                padding: '1rem',
              }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  TMB (Basal)
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                  {tmb} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>kcal</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                  {strategyKey === 'mifflin' ? 'Mifflin (1990)' : 'Harris (1984)'}
                </span>
              </div>

              {/* Target Kcal Card */}
              <div style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1px solid #a7f3d0',
                borderRadius: '0.75rem',
                padding: '1rem',
              }}>
                <span style={{ fontSize: '0.6875rem', color: '#065f46', fontWeight: 700, textTransform: 'uppercase' }}>
                  Meta Calórica Alvo
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#064e3b' }}>
                  {targetKcal} <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 500 }}>kcal</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                  GET: {getKcal} kcal
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              CARD 2: BALANÇO DE MACRONUTRIENTES & PRESCRIÇÃO CLÍNICA
             ======================================================== */}
          <div className="glass-card" style={{ padding: '2rem', background: 'white' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1875rem', fontWeight: 800, margin: 0 }}>
                    2. Prescrição de Macronutrientes
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Value Object Imutável • Fatores Atwater 4-4-9
                  </span>
                </div>
              </div>
              <span className="pill-badge pill-cyan" style={{ fontSize: '0.6875rem' }}>
                VET Dinâmico
              </span>
            </div>

            {/* 1-Click Clinical Presets */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                <Sparkles size={14} color="#059669" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
                  Presets Clínicos Rápidos (1-clique):
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => applyPreset('hypertrophy')}
                  style={{
                    padding: '0.5rem 0.625rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#ecfdf5'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                >
                  💪 <strong>Hipertrofia</strong> (2.2 g/kg)
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('fat_loss')}
                  style={{
                    padding: '0.5rem 0.625rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#ecfdf5'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                >
                  🔥 <strong>Cutting</strong> (2.0 g/kg)
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('low_carb')}
                  style={{
                    padding: '0.5rem 0.625rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#ecfdf5'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                >
                  🥑 <strong>Low Carb</strong> (1.0 g/kg C)
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset('balanced')}
                  style={{
                    padding: '0.5rem 0.625rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#ecfdf5'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
                >
                  🥗 <strong>Equilibrada</strong> (50/25/25)
                </button>
              </div>
            </div>

            {/* Macro Sliders with Direct Gram Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem', marginBottom: '1.25rem' }}>
              {/* Proteína */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }} />
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#065f46' }}>
                      Proteína (4 kcal/g)
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="400"
                      value={proteinGrams}
                      onChange={(e) => setProteinGrams(Math.max(0, Number(e.target.value) || 0))}
                      style={{
                        width: '64px',
                        padding: '0.25rem 0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#059669',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        textAlign: 'right',
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>g</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
                      {macroStats.pPerKg} g/kg
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="40"
                  max="320"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                />
              </div>

              {/* Carboidrato */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284c7' }} />
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0369a1' }}>
                      Carboidratos (4 kcal/g)
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="600"
                      value={carbsGrams}
                      onChange={(e) => setCarbsGrams(Math.max(0, Number(e.target.value) || 0))}
                      style={{
                        width: '64px',
                        padding: '0.25rem 0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#0284c7',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        textAlign: 'right',
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>g</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
                      {macroStats.cPerKg} g/kg
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  value={carbsGrams}
                  onChange={(e) => setCarbsGrams(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
                />
              </div>

              {/* Gordura */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ea580c' }} />
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#c2410c' }}>
                      Gorduras / Lipídios (9 kcal/g)
                    </label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <input
                      type="number"
                      min="0"
                      max="200"
                      value={fatGrams}
                      onChange={(e) => setFatGrams(Math.max(0, Number(e.target.value) || 0))}
                      style={{
                        width: '64px',
                        padding: '0.25rem 0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#ea580c',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.375rem',
                        textAlign: 'right',
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>g</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>
                      {macroStats.fPerKg} g/kg
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="15"
                  max="160"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ea580c', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Proportion Visual Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', height: '16px', borderRadius: '8px', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}>
                <div style={{ width: `${macroStats.pPct}%`, background: '#059669', transition: 'width 0.2s' }} title={`Proteína: ${macroStats.pPct}%`} />
                <div style={{ width: `${macroStats.cPct}%`, background: '#0284c7', transition: 'width 0.2s' }} title={`Carboidrato: ${macroStats.cPct}%`} />
                <div style={{ width: `${macroStats.fPct}%`, background: '#ea580c', transition: 'width 0.2s' }} title={`Gordura: ${macroStats.fPct}%`} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                <span style={{ color: '#059669' }}>● Prot: {macroStats.pPct}% ({proteinGrams * 4} kcal)</span>
                <span style={{ color: '#0284c7' }}>● Carb: {macroStats.cPct}% ({carbsGrams * 4} kcal)</span>
                <span style={{ color: '#ea580c' }}>● Gord: {macroStats.fPct}% ({fatGrams * 9} kcal)</span>
              </div>
            </div>

            {/* Calorie Match / Balance Card */}
            <div style={{
              background: Math.abs(calorieDelta) <= 50 ? '#ecfdf5' : calorieDelta > 50 ? '#fff7ed' : '#eff6ff',
              border: `1.5px solid ${Math.abs(calorieDelta) <= 50 ? '#6ee7b7' : calorieDelta > 50 ? '#fdba74' : '#bfdbfe'}`,
              borderRadius: '0.75rem',
              padding: '1.125rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                    VET Prescrito pelos Macros:
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    {macroStats.vet} <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#64748b' }}>kcal</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {Math.abs(calorieDelta) <= 50 ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      background: '#059669',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.375rem 0.625rem',
                      borderRadius: '9999px',
                    }}>
                      <CheckCircle2 size={14} />
                      Alinhado à Meta
                    </span>
                  ) : calorieDelta > 50 ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      background: '#ea580c',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.375rem 0.625rem',
                      borderRadius: '9999px',
                    }}>
                      +{calorieDelta} kcal acima
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      background: '#0284c7',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.375rem 0.625rem',
                      borderRadius: '9999px',
                    }}>
                      {calorieDelta} kcal abaixo
                    </span>
                  )}
                </div>
              </div>

              {/* Auto Balance Button if mismatch */}
              {Math.abs(calorieDelta) > 50 && (
                <button
                  type="button"
                  onClick={handleBalanceWithCarbs}
                  style={{
                    background: 'white',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.375rem',
                    padding: '0.375rem 0.625rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    marginTop: '0.25rem',
                  }}
                >
                  <Sparkles size={13} color="#059669" />
                  <span>Ajustar Carboidratos para igualar à meta ({targetKcal} kcal)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
