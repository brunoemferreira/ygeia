import React from 'react';
import { Droplets, Plus, Minus, Sparkles } from 'lucide-react';
import { AppCard } from '../ui/AppCard';

export interface HydrationWidgetProps {
  currentMl: number;
  goalMl?: number;
  weightKg?: number;
  onAddWater: (amountMl: number) => void;
}

export const HydrationWidget: React.FC<HydrationWidgetProps> = ({
  currentMl,
  goalMl,
  weightKg = 86,
  onAddWater,
}) => {
  // Fórmula Clínica: Peso (kg) * 35 ml/kg
  const safeGoalMl = goalMl && goalMl > 0 ? goalMl : Math.round(weightKg * 35);
  const progressRatio = Math.min(1, Math.max(0, currentMl / safeGoalMl));
  const progressPercent = Math.round(progressRatio * 100);
  const remainingMl = Math.max(0, safeGoalMl - currentMl);

  const currentLiters = (currentMl / 1000).toFixed(1).replace('.', ',');
  const goalLiters = (safeGoalMl / 1000).toFixed(1).replace('.', ',');

  // Parâmetros do mostrador radial SVG
  const size = 150;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <AppCard>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.5rem',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Droplets size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
              Hidratação Diária
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
              Meta clínica de 35 ml/kg ({weightKg} kg)
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '9999px',
            padding: '0.25rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0284c7',
          }}
        >
          {currentLiters} L <span style={{ color: '#64748b', fontWeight: 500 }}>/ {goalLiters} L</span>
        </div>
      </div>

      {/* Mostrador Radial SVG */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.5rem 0 1.25rem 0' }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size}>
            <defs>
              <linearGradient id="hydrationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {/* Trilha de fundo */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e0f2fe"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Arco de progresso */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#hydrationGradient)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: 'stroke-dashoffset 0.35s ease' }}
            />
          </svg>

          {/* Métricas Centrais */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {progressPercent}%
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7' }}>
              {currentMl} ml
            </span>
            {remainingMl > 0 ? (
              <span style={{ fontSize: '0.625rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                faltam {remainingMl} ml
              </span>
            ) : (
              <span style={{ fontSize: '0.625rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                <Sparkles size={10} /> Meta batida!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Botões Rápidos 1-Toque */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => onAddWater(250)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '0.5rem',
            padding: '0.55rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0284c7',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#e0f2fe')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff')}
        >
          <Plus size={13} />
          <span>250 ml</span>
        </button>

        <button
          type="button"
          onClick={() => onAddWater(500)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '0.5rem',
            padding: '0.55rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0284c7',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#e0f2fe')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f0f9ff')}
        >
          <Plus size={13} />
          <span>500 ml</span>
        </button>

        <button
          type="button"
          onClick={() => onAddWater(-250)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            padding: '0.55rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.12s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
        >
          <Minus size={13} />
          <span>250 ml</span>
        </button>
      </div>
    </AppCard>
  );
};
