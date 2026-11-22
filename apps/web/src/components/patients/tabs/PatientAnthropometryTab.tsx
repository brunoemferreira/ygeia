import React, { useState, useMemo } from 'react';
import { Zap, Scale, Heart, Flame } from 'lucide-react';
import { AppInput, AppSelect } from '../../ui';

export interface PatientAnthropometryTabProps {
  patientName: string;
}

export const PatientAnthropometryTab: React.FC<PatientAnthropometryTabProps> = ({
  patientName,
}) => {
  // Modo de Avaliação: 'clinical' (Geral / Emagrecimento) ou 'sports' (Esportivo / Alta Performance)
  const [assessmentMode, setAssessmentMode] = useState<'clinical' | 'sports'>('clinical');

  // Dados Clínicos Gerais
  const [weight, setWeight] = useState<string>('72.5');
  const [height, setHeight] = useState<string>('170');
  const [waist, setWaist] = useState<string>('82');
  const [hip, setHip] = useState<string>('98');

  // Dados Esportivos / Dobras Cutâneas (mm)
  const [sportsProtocol, setSportsProtocol] = useState<'pollock_3' | 'pollock_7' | 'faulkner'>('pollock_3');
  const [skinfoldChest, setSkinfoldChest] = useState<string>('12');
  const [skinfoldAbdomen, setSkinfoldAbdomen] = useState<string>('18');
  const [skinfoldThigh, setSkinfoldThigh] = useState<string>('15');
  const [skinfoldTriceps, setSkinfoldTriceps] = useState<string>('10');
  const [skinfoldSubscapular, setSkinfoldSubscapular] = useState<string>('14');

  // Cálculos Clínicos em Tempo Real
  const bmiData = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h || isNaN(w) || isNaN(h)) return null;
    const bmi = w / (h * h);
    let label = 'Eutrofia (Peso adequado)';
    let color = '#10b981';
    let bg = '#ecfdf5';

    if (bmi < 18.5) {
      label = 'Baixo peso';
      color = '#3b82f6';
      bg = '#eff6ff';
    } else if (bmi >= 25 && bmi < 30) {
      label = 'Sobrepeso';
      color = '#f59e0b';
      bg = '#fffbeb';
    } else if (bmi >= 30) {
      label = 'Obesidade';
      color = '#ef4444';
      bg = '#fef2f2';
    }

    return { value: bmi.toFixed(1), label, color, bg };
  }, [weight, height]);

  // Relação Cintura-Quadril (RCQ)
  const rcqData = useMemo(() => {
    const w = parseFloat(waist);
    const h = parseFloat(hip);
    if (!w || !h || isNaN(w) || isNaN(h)) return null;
    const rcq = w / h;
    const isElevated = rcq > 0.85;
    return {
      value: rcq.toFixed(2),
      isElevated,
      label: isElevated ? 'Risco cardiovascular moderado/alto' : 'Risco cardiovascular baixo',
      color: isElevated ? '#f59e0b' : '#10b981',
      bg: isElevated ? '#fffbeb' : '#ecfdf5',
    };
  }, [waist, hip]);

  // Estimativa Esportiva de Composição Corporal
  const sportsComposition = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || isNaN(w)) return null;

    // Estimativa aproximada via Jackson & Pollock 3 dobras
    const c = parseFloat(skinfoldChest) || 0;
    const a = parseFloat(skinfoldAbdomen) || 0;
    const t = parseFloat(skinfoldThigh) || 0;
    const sum = c + a + t;

    // Fator estimado para homens jovens adultos
    const bf = Math.max(5, Math.min(45, (sum * 0.15) + 3.5));
    const fatMassKg = (w * (bf / 100));
    const leanMassKg = w - fatMassKg;

    return {
      bf: bf.toFixed(1),
      fatMassKg: fatMassKg.toFixed(1),
      leanMassKg: leanMassKg.toFixed(1),
    };
  }, [weight, skinfoldChest, skinfoldAbdomen, skinfoldThigh]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
      {/* Cabeçalho com Seletor de Modo Dual Adaptativo */}
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
            Antropometria & Composição Corporal
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
            Acompanhamento biométrico longitudinal de {patientName}
          </p>
        </div>

        {/* Pílula de Alternância de Perfil Clínico vs. Esportivo */}
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
            onClick={() => setAssessmentMode('clinical')}
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
              backgroundColor: assessmentMode === 'clinical' ? '#ffffff' : 'transparent',
              color: assessmentMode === 'clinical' ? 'var(--primary)' : '#64748b',
              boxShadow: assessmentMode === 'clinical' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Heart size={14} />
            <span>🍏 Clínico Geral / Reeducação</span>
          </button>

          <button
            type="button"
            onClick={() => setAssessmentMode('sports')}
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
              backgroundColor: assessmentMode === 'sports' ? '#ffffff' : 'transparent',
              color: assessmentMode === 'sports' ? 'var(--primary)' : '#64748b',
              boxShadow: assessmentMode === 'sports' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Zap size={14} />
            <span>⚡ Esportivo / Alta Performance</span>
          </button>
        </div>
      </div>

      {/* Grid de Medidas Básicas (Compartilhado entre ambos os modos) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0' }}>
          <AppInput
            label="Peso Atual (kg)"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0' }}>
          <AppInput
            label="Estatura / Altura (cm)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0' }}>
          <AppInput
            label="Circunferência da Cintura (cm)"
            type="number"
            step="0.5"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.625rem', border: '1px solid #e2e8f0' }}>
          <AppInput
            label="Circunferência do Quadril (cm)"
            type="number"
            step="0.5"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
          />
        </div>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL: MODO CLÍNICO GERAL */}
      {assessmentMode === 'clinical' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Card de IMC Acessível */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <Scale size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>Índice de Massa Corporal (IMC)</h3>
            </div>
            {bmiData ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {bmiData.value} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>kg/m²</span>
                </span>
                <span
                  style={{
                    backgroundColor: bmiData.bg,
                    color: bmiData.color,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                  }}
                >
                  {bmiData.label}
                </span>
              </div>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Preencha peso e altura para calcular.</span>
            )}
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              Classificação padrão da Organização Mundial da Saúde (OMS) para adultos.
            </p>
          </div>

          {/* Card de Relação Cintura-Quadril */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <Heart size={18} color="#e11d48" />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0 }}>Relação Cintura-Quadril (RCQ)</h3>
            </div>
            {rcqData ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {rcqData.value}
                </span>
                <span
                  style={{
                    backgroundColor: rcqData.bg,
                    color: rcqData.color,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                  }}
                >
                  {rcqData.label}
                </span>
              </div>
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Preencha cintura e quadril para calcular.</span>
            )}
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              Indicador de distribuição de gordura corporal androide vs. ginoide e risco cardiovascular.
            </p>
          </div>
        </div>
      )}

      {/* RENDERIZAÇÃO CONDICIONAL: MODO ESPORTIVO / ALTA PERFORMANCE */}
      {assessmentMode === 'sports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Seletor de Protocolo Esportivo */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={18} color="#f97316" />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                  Protocolo de Dobras Cutâneas (Plicometria)
                </h3>
              </div>
              <div style={{ minWidth: '220px' }}>
                <AppSelect
                  value={sportsProtocol}
                  onChange={(e) => setSportsProtocol(e.target.value as any)}
                  options={[
                    { value: 'pollock_3', label: 'Pollock 3 Dobras (Peitoral, Abdômen, Coxa)' },
                    { value: 'pollock_7', label: 'Pollock 7 Dobras Completo' },
                    { value: 'faulkner', label: 'Faulkner 4 Dobras (Tríceps, Subescapular, etc.)' },
                  ]}
                />
              </div>
            </div>

            {/* Inputs de Dobras */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <AppInput
                label="Peitoral (mm)"
                type="number"
                value={skinfoldChest}
                onChange={(e) => setSkinfoldChest(e.target.value)}
              />
              <AppInput
                label="Abdômen (mm)"
                type="number"
                value={skinfoldAbdomen}
                onChange={(e) => setSkinfoldAbdomen(e.target.value)}
              />
              <AppInput
                label="Coxa Medial (mm)"
                type="number"
                value={skinfoldThigh}
                onChange={(e) => setSkinfoldThigh(e.target.value)}
              />
              <AppInput
                label="Tríceps (mm)"
                type="number"
                value={skinfoldTriceps}
                onChange={(e) => setSkinfoldTriceps(e.target.value)}
              />
              <AppInput
                label="Subescapular (mm)"
                type="number"
                value={skinfoldSubscapular}
                onChange={(e) => setSkinfoldSubscapular(e.target.value)}
              />
            </div>
          </div>

          {/* Cards de Composição Corporal Esportiva */}
          {sportsComposition && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Gordura Corporal (%BF)
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>
                  {sportsComposition.bf}%
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Massa Livre de Gordura (MLG)
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
                  {sportsComposition.leanMassKg} <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>kg</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                  Massa Gorda Total
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '0.35rem' }}>
                  {sportsComposition.fatMassKg} <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>kg</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
