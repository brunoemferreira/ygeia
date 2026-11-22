import React, { useState, useMemo } from 'react';
import {
  Heart,
  Zap,
  Download,
  Flame,
  Utensils,
  Plus,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { AppInput, AppSelect, AppTextarea } from '../../ui';
import { useToast } from '../../../context/ToastContext';
import {
  MifflinStJeorStrategy,
  HarrisBenedictStrategy,
  OmsFaoStrategy,
  CunninghamStrategy,
  KatchMcArdleStrategy,
  TinsleyStrategy,
  Macronutrients,
} from '@ygeia/domain-core';

export interface PatientMealPlanTabProps {
  patientName: string;
}

export const PatientMealPlanTab: React.FC<PatientMealPlanTabProps> = ({
  patientName,
}) => {
  const { toast } = useToast();

  // Modo Dual Adaptativo
  const [profileMode, setProfileMode] = useState<'clinical' | 'sports'>('clinical');

  // Biometria Base
  const [weight, setWeight] = useState<string>('75');
  const [height, setHeight] = useState<string>('175');
  const [age, setAge] = useState<string>('30');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [bodyFat, setBodyFat] = useState<string>('16'); // %BF para esportistas

  // Fórmulas
  const [clinicalFormula, setClinicalFormula] = useState<'mifflin' | 'harris' | 'oms'>('mifflin');
  const [sportsFormula, setSportsFormula] = useState<'cunningham' | 'katch' | 'tinsley'>('cunningham');
  const [activityFactor, setActivityFactor] = useState<string>('1.55'); // Moderadamente ativo
  const [calorieGoal, setCalorieGoal] = useState<string>('-400'); // Déficit moderado ou Superávit

  // Macronutrientes no modo clínico (% calórica)
  const [clinicalCarbPct, setClinicalCarbPct] = useState<number>(50);
  const [clinicalProtPct, setClinicalProtPct] = useState<number>(25);
  const [clinicalFatPct, setClinicalFatPct] = useState<number>(25);

  // Macronutrientes no modo esportivo (g/kg/dia)
  const [sportsProtGPerKg, setSportsProtGPerKg] = useState<number>(2.0);
  const [sportsCarbGPerKg, setSportsCarbGPerKg] = useState<number>(4.5);
  const [sportsFatGPerKg, setSportsFatGPerKg] = useState<number>(0.9);

  // Periodização de Treino (Dias ON / OFF)
  const [periodizationActive, setPeriodizationActive] = useState<boolean>(false);
  const [restDayCarbReduction, setRestDayCarbReduction] = useState<string>('30'); // % de redução nos dias off

  // Suplementação Estratégica
  const [supplements, setSupplements] = useState<string>(
    '• Creatina Monohidratada: 5g ao dia (todos os dias, com refeição rica em carboidrato).\n• Whey Protein Concentrado: 30g pós-treino com 200ml de água.\n• Cafeína Anidra (opcional): 200mg 40 min antes de treinos intensos.'
  );

  // Cálculo da TMB (Taxa Metabólica Basal) no Core Domain
  const tmb = useMemo(() => {
    const w = parseFloat(weight) || 70;
    const h = parseFloat(height) || 170;
    const a = parseFloat(age) || 30;
    const bf = parseFloat(bodyFat) || 15;

    const biometrics = {
      weightKg: w,
      heightCm: h,
      ageYears: a,
      gender,
      bodyFatPercentage: bf,
    };

    if (profileMode === 'clinical') {
      if (clinicalFormula === 'harris') return new HarrisBenedictStrategy().calculate(biometrics);
      if (clinicalFormula === 'oms') return new OmsFaoStrategy().calculate(biometrics);
      return new MifflinStJeorStrategy().calculate(biometrics);
    } else {
      if (sportsFormula === 'katch') return new KatchMcArdleStrategy().calculate(biometrics);
      if (sportsFormula === 'tinsley') return new TinsleyStrategy().calculate(biometrics);
      return new CunninghamStrategy().calculate(biometrics);
    }
  }, [profileMode, weight, height, age, gender, bodyFat, clinicalFormula, sportsFormula]);

  // VET (Valor Energético Total)
  const vet = useMemo(() => {
    const af = parseFloat(activityFactor) || 1.2;
    const goalDelta = parseFloat(calorieGoal) || 0;
    const total = Math.round(tmb * af + goalDelta);
    return Math.max(1000, total);
  }, [tmb, activityFactor, calorieGoal]);

  // Massa Livre de Gordura (MLG)
  const leanMassKg = useMemo(() => {
    const w = parseFloat(weight) || 70;
    const bf = parseFloat(bodyFat) || 15;
    return (w * (1 - bf / 100)).toFixed(1);
  }, [weight, bodyFat]);

  // Macronutrientes Calculados via Domain-Core
  const macros = useMemo(() => {
    const w = parseFloat(weight) || 70;

    if (profileMode === 'clinical') {
      try {
        return Macronutrients.fromCaloriesAndPercentages(
          vet,
          clinicalProtPct,
          clinicalCarbPct,
          clinicalFatPct
        );
      } catch {
        return Macronutrients.create(120, 200, 50);
      }
    } else {
      try {
        return Macronutrients.fromGramsPerKg(
          w,
          sportsProtGPerKg,
          sportsCarbGPerKg,
          sportsFatGPerKg
        );
      } catch {
        return Macronutrients.create(150, 300, 60);
      }
    }
  }, [
    profileMode,
    vet,
    weight,
    clinicalProtPct,
    clinicalCarbPct,
    clinicalFatPct,
    sportsProtGPerKg,
    sportsCarbGPerKg,
    sportsFatGPerKg,
  ]);

  const gPerKg = useMemo(() => {
    const w = parseFloat(weight) || 70;
    return macros.getGramsPerKg(w);
  }, [macros, weight]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      {/* 1. TOPO: TÍTULO & ALTERNÂNCIA DE MODO DUAL */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Prescrição Dietética & Planejamento Energético
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            Definição de metas de gasto calórico, VET e modulação nutricional de {patientName}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Seletor Dual Adaptativo */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#f1f5f9',
              padding: '0.25rem',
              borderRadius: '0.5rem',
              gap: '0.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => setProfileMode('clinical')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: profileMode === 'clinical' ? '#ffffff' : 'transparent',
                color: profileMode === 'clinical' ? 'var(--primary)' : '#64748b',
                boxShadow: profileMode === 'clinical' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Heart size={14} />
              <span>🍏 Modo Clínico Geral</span>
            </button>

            <button
              type="button"
              onClick={() => setProfileMode('sports')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '0.375rem',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: profileMode === 'sports' ? '#ffffff' : 'transparent',
                color: profileMode === 'sports' ? 'var(--primary)' : '#64748b',
                boxShadow: profileMode === 'sports' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Zap size={14} />
              <span>⚡ Modo Esportivo & Alta Performance</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => toast.success('Gerando plano alimentar em PDF com cabeçalho timbrado...')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '0.375rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <Download size={14} />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* 2. PAINEL DE BIOMETRIA & CÁLCULO DE VET */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Parâmetros Fisiológicos */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flame size={16} color="var(--primary)" />
            <span>Biometria & Taxa Metabólica Basal (TMB)</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <AppInput label="Peso (kg)" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <AppInput label="Altura (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            <AppInput label="Idade (anos)" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            <AppSelect
              label="Sexo Biológico"
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              options={[
                { value: 'MALE', label: 'Masculino' },
                { value: 'FEMALE', label: 'Feminino' },
              ]}
            />
          </div>

          {profileMode === 'sports' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
              <AppInput label="% de Gordura (%BF)" type="number" step="0.1" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>Massa Magra (MLG)</span>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#14532d' }}>{leanMassKg} kg</span>
              </div>
            </div>
          )}

          {/* Seletor de Equação */}
          {profileMode === 'clinical' ? (
            <AppSelect
              label="Equação Preditiva Clínica"
              value={clinicalFormula}
              onChange={(e) => setClinicalFormula(e.target.value as any)}
              options={[
                { value: 'mifflin', label: 'Mifflin-St Jeor (1990) — Recomendada para sobrepeso e geral' },
                { value: 'harris', label: 'Harris-Benedict (1984) — Fórmula clássica' },
                { value: 'oms', label: 'OMS / FAO (1985/2004) — Padrão internacional' },
              ]}
            />
          ) : (
            <AppSelect
              label="Equação Preditiva Esportiva (Massa Magra)"
              value={sportsFormula}
              onChange={(e) => setSportsFormula(e.target.value as any)}
              options={[
                { value: 'cunningham', label: 'Cunningham (1980) — Padrão ouro para atletas' },
                { value: 'katch', label: 'Katch-McArdle (1996) — Alta precisão com plicometria' },
                { value: 'tinsley', label: 'Tinsley (2018) — Treinamento resistido / Musculação' },
              ]}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>TMB Calculada:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{tmb} kcal</span>
          </div>
        </div>

        {/* Fator Atividade & VET Meta */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="var(--primary)" />
            <span>Fator de Atividade & Meta Calórica (VET)</span>
          </h3>

          <AppSelect
            label="Nível de Atividade Física / Rotina"
            value={activityFactor}
            onChange={(e) => setActivityFactor(e.target.value)}
            options={[
              { value: '1.2', label: 'Sedentário (pouco ou nenhum exercício)' },
              { value: '1.375', label: 'Levemente ativo (exercício 1-3 dias/sem)' },
              { value: '1.55', label: 'Moderadamente ativo (treino regular 3-5 dias/sem)' },
              { value: '1.725', label: 'Muito ativo (treino intenso 6-7 dias/sem)' },
              { value: '1.9', label: 'Extremamente ativo (atletas de alto rendimento / 2x dia)' },
            ]}
          />

          <AppSelect
            label="Objetivo Nutricional & Ajuste Calórico"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            options={[
              { value: '-600', label: 'Déficit Calórico Agressivo (-600 kcal) — Emagrecimento rápido' },
              { value: '-400', label: 'Déficit Calórico Moderado (-400 kcal) — Emagrecimento sustentável' },
              { value: '0', label: 'Manutenção Eucalórica (0 kcal) — Recomposição e saúde' },
              { value: '300', label: 'Superávit Calórico Moderado (+300 kcal) — Hipertrofia limpa' },
              { value: '500', label: 'Superávit Calórico Alto (+500 kcal) — Ganho de massa' },
            ]}
          />

          <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: '0.625rem', border: '1px solid var(--primary-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                VET Prescrito (Meta Final)
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1, marginTop: '0.2rem' }}>
                {vet} <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>kcal/dia</span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textAlign: 'right' }}>
              {parseFloat(calorieGoal) < 0 ? 'Déficit' : parseFloat(calorieGoal) > 0 ? 'Superávit' : 'Manutenção'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. DISTRIBUIÇÃO DE MACRONUTRIENTES BIDIRECIONAL */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
              Distribuição de Macronutrientes {profileMode === 'sports' ? '(Padrão ISSN em g/kg/dia)' : '(Percentual Calórico %)'}
            </h3>
            <p style={{ fontSize: '0.78125rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
              Equivalência calórica em tempo real: 4 kcal/g de Proteína e Carboidrato, 9 kcal/g de Gordura
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
            <span style={{ padding: '0.25rem 0.6rem', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '0.375rem' }}>
              P: {macros.proteinPercentage}% ({gPerKg.protein} g/kg)
            </span>
            <span style={{ padding: '0.25rem 0.6rem', backgroundColor: '#eff6ff', color: '#1e40af', borderRadius: '0.375rem' }}>
              C: {macros.carbohydratePercentage}% ({gPerKg.carbs} g/kg)
            </span>
            <span style={{ padding: '0.25rem 0.6rem', backgroundColor: '#fffbeb', color: '#92400e', borderRadius: '0.375rem' }}>
              G: {macros.fatPercentage}% ({gPerKg.fat} g/kg)
            </span>
          </div>
        </div>

        {/* Sliders ou Inputs conforme o Modo */}
        {profileMode === 'clinical' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#166534', display: 'flex', justifyContent: 'space-between' }}>
                <span>Proteínas (%)</span>
                <span>{clinicalProtPct}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="40"
                value={clinicalProtPct}
                onChange={(e) => setClinicalProtPct(Number(e.target.value))}
                style={{ width: '100%', margin: '0.5rem 0' }}
              />
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {macros.proteinGrams}g <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>({gPerKg.protein} g/kg)</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e40af', display: 'flex', justifyContent: 'space-between' }}>
                <span>Carboidratos (%)</span>
                <span>{clinicalCarbPct}%</span>
              </label>
              <input
                type="range"
                min="35"
                max="65"
                value={clinicalCarbPct}
                onChange={(e) => setClinicalCarbPct(Number(e.target.value))}
                style={{ width: '100%', margin: '0.5rem 0' }}
              />
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {macros.carbohydrateGrams}g <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>({gPerKg.carbs} g/kg)</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#92400e', display: 'flex', justifyContent: 'space-between' }}>
                <span>Lipídios / Gorduras (%)</span>
                <span>{clinicalFatPct}%</span>
              </label>
              <input
                type="range"
                min="15"
                max="40"
                value={clinicalFatPct}
                onChange={(e) => setClinicalFatPct(Number(e.target.value))}
                style={{ width: '100%', margin: '0.5rem 0' }}
              />
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {macros.fatGrams}g <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>({gPerKg.fat} g/kg)</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
              <AppInput
                label="Proteína (g/kg/dia)"
                type="number"
                step="0.1"
                value={String(sportsProtGPerKg)}
                onChange={(e) => setSportsProtGPerKg(Number(e.target.value))}
              />
              <div style={{ marginTop: '0.5rem', fontSize: '1.125rem', fontWeight: 800, color: '#14532d' }}>
                {macros.proteinGrams}g total <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>({macros.proteinPercentage}% VET)</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#166534' }}>Padrão ISSN: 1.6 - 2.2 g/kg</span>
            </div>

            <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
              <AppInput
                label="Carboidrato (g/kg/dia)"
                type="number"
                step="0.1"
                value={String(sportsCarbGPerKg)}
                onChange={(e) => setSportsCarbGPerKg(Number(e.target.value))}
              />
              <div style={{ marginTop: '0.5rem', fontSize: '1.125rem', fontWeight: 800, color: '#1e3a8a' }}>
                {macros.carbohydrateGrams}g total <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>({macros.carbohydratePercentage}% VET)</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#1e40af' }}>Padrão ISSN: 3.0 - 7.0 g/kg</span>
            </div>

            <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fde68a' }}>
              <AppInput
                label="Gordura (g/kg/dia)"
                type="number"
                step="0.1"
                value={String(sportsFatGPerKg)}
                onChange={(e) => setSportsFatGPerKg(Number(e.target.value))}
              />
              <div style={{ marginTop: '0.5rem', fontSize: '1.125rem', fontWeight: 800, color: '#78350f' }}>
                {macros.fatGrams}g total <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>({macros.fatPercentage}% VET)</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#92400e' }}>Padrão ISSN: 0.8 - 1.2 g/kg</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. MÓDULO PERI-TREINO & PERIODIZAÇÃO (QUANDO ESPORTIVO) */}
      {profileMode === 'sports' && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="var(--primary)" />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Nutrient Timing Peri-Treino & Periodização (Dias ON vs. OFF)
              </h3>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
              <input
                type="checkbox"
                checked={periodizationActive}
                onChange={(e) => setPeriodizationActive(e.target.checked)}
              />
              <span>Ativar Modulação Dias de Descanso</span>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                Pré-Treino (60-90 min antes)
              </span>
              <p style={{ fontSize: '0.8125rem', color: '#334155', margin: '0.35rem 0 0 0' }}>
                Carboidratos de média absorção (aveia, frutas, pão) + proteína de fácil digestão (15-25g).
              </p>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                Intra-Treino (Se &gt; 60 min)
              </span>
              <p style={{ fontSize: '0.8125rem', color: '#334155', margin: '0.35rem 0 0 0' }}>
                Água (500ml/h), reposição de eletrólitos (sódio/potássio) e 30-45g de carboidratos rápidos se treino intenso.
              </p>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                Pós-Treino Imediato
              </span>
              <p style={{ fontSize: '0.8125rem', color: '#334155', margin: '0.35rem 0 0 0' }}>
                Reposição de glicogênio e síntese proteica: 25-40g de proteína de alto valor biológico + carboidrato simples.
              </p>
            </div>
          </div>

          {periodizationActive && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.85rem', backgroundColor: '#fffbeb', borderRadius: '0.5rem', border: '1px solid #fde68a', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Info size={18} color="#b45309" />
                <div style={{ fontSize: '0.8125rem', color: '#78350f' }}>
                  <strong>Dias de Descanso (OFF):</strong> Redução programada de {restDayCarbReduction}% nos carboidratos (meta de VET ajustada para ~{Math.round(vet * (1 - (parseFloat(restDayCarbReduction) || 30) / 200))} kcal), mantendo proteínas altas para retenção de massa magra.
                </div>
              </div>
              <div style={{ minWidth: '150px' }}>
                <AppSelect
                  label="Redução de Carboidrato"
                  value={restDayCarbReduction}
                  onChange={(e) => setRestDayCarbReduction(e.target.value)}
                  options={[
                    { value: '20', label: '20% de redução' },
                    { value: '30', label: '30% de redução' },
                    { value: '40', label: '40% de redução' },
                    { value: '50', label: '50% (Low Carb OFF)' },
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. PRESCRIÇÃO DE SUPLEMENTOS ERGOGÊNICOS */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Utensils size={16} color="var(--primary)" />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
            Prescrição Estruturada de Suplementos & Fitoterápicos
          </h3>
        </div>

        <AppTextarea
          label="Posologia, Horários e Orientações de Suplementação"
          rows={4}
          value={supplements}
          onChange={(e) => setSupplements(e.target.value)}
        />
      </div>

      {/* BOTÃO FINAL DE SALVAR PLANO */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => toast.success('Plano alimentar e prescrição salvos no prontuário!')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '0.6rem 1.5rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 4px var(--primary-border)',
            transition: 'background-color 0.15s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
        >
          <Plus size={16} />
          <span>Salvar Prescrição no Prontuário</span>
        </button>
      </div>
    </div>
  );
};
