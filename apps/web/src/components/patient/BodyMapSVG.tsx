import React from 'react';
import { Sparkles, ShieldCheck, Check } from 'lucide-react';

export type InjectionSiteId =
  | 'abd_left'
  | 'abd_right'
  | 'thigh_left'
  | 'thigh_right'
  | 'arm_left'
  | 'arm_right';

export interface SitePosition {
  id: InjectionSiteId;
  topPercent: number;
  leftPercent: number;
  label: string;
  shortLabel: string;
}

// Coordenadas calibradas anatomicamente sobre silhueta frontal
// Visão espelhada médica: o lado direito do paciente aparece à esquerda da tela (D)
export const SITE_POSITIONS: SitePosition[] = [
  { id: 'arm_right', topPercent: 38, leftPercent: 27, label: 'Braço Direito', shortLabel: 'Braço D' },
  { id: 'arm_left', topPercent: 38, leftPercent: 73, label: 'Braço Esquerdo', shortLabel: 'Braço E' },
  { id: 'abd_right', topPercent: 54, leftPercent: 41, label: 'Abdômen Direito', shortLabel: 'Abd D' },
  { id: 'abd_left', topPercent: 54, leftPercent: 59, label: 'Abdômen Esquerdo', shortLabel: 'Abd E' },
  { id: 'thigh_right', topPercent: 76, leftPercent: 38, label: 'Coxa Direita', shortLabel: 'Coxa D' },
  { id: 'thigh_left', topPercent: 76, leftPercent: 62, label: 'Coxa Esquerda', shortLabel: 'Coxa E' },
];

export interface BodyMapSVGProps {
  selectedSite: InjectionSiteId;
  recommendedSite?: InjectionSiteId;
  lastAppliedSite?: InjectionSiteId | null;
  onSelectSite: (siteId: InjectionSiteId) => void;
  interactive?: boolean;
}

export const BodyMapSVG: React.FC<BodyMapSVGProps> = ({
  selectedSite,
  recommendedSite = 'abd_left',
  lastAppliedSite = 'abd_right',
  onSelectSite,
  interactive = true,
}) => {
  const selectedObj = SITE_POSITIONS.find((s) => s.id === selectedSite);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Header com Orientação Médica */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <ShieldCheck size={16} color="#059669" />
            <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
              Mapa Anatômico de Aplicação Subcutânea
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
            Rotação automática de quadrantes para prevenir lipohipertrofia e fibrose tecidual.
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '9999px',
            padding: '0.2rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: '#059669',
          }}
        >
          <Sparkles size={12} />
          <span>Sítio Recomendado: {SITE_POSITIONS.find((s) => s.id === recommendedSite)?.shortLabel}</span>
        </div>
      </div>

      {/* Silhueta Vetorial Anatômica Responsiva com Nós Interativos */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '360px',
          height: '420px',
          margin: '0 auto',
          backgroundColor: '#f8fafc',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* SVG da Silhueta Anatômica Humana */}
        <svg
          viewBox="0 0 300 450"
          style={{ width: '100%', height: '100%', opacity: 0.95 }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Gradiente da Silhueta */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Cabeça */}
          <ellipse cx="150" cy="45" rx="22" ry="28" fill="url(#bodyGradient)" />
          {/* Pescoço */}
          <rect x="144" y="70" width="12" height="18" fill="url(#bodyGradient)" rx="4" />

          {/* Tronco / Ombros / Abdômen */}
          <path
            d="M 105 88 
               C 120 84, 180 84, 195 88
               C 215 95, 222 135, 218 165
               C 215 190, 208 240, 202 260
               C 192 280, 160 282, 150 282
               C 140 282, 108 280, 98 260
               C 92 240, 85 190, 82 165
               C 78 135, 85 95, 105 88 Z"
            fill="url(#bodyGradient)"
          />

          {/* Braço Direito (Esquerda visual) */}
          <path
            d="M 85 95
               C 70 120, 62 160, 60 200
               C 58 230, 56 250, 52 270
               C 50 278, 62 282, 66 274
               C 72 250, 78 220, 82 180
               C 85 150, 88 120, 92 105 Z"
            fill="url(#bodyGradient)"
          />

          {/* Braço Esquerdo (Direita visual) */}
          <path
            d="M 215 95
               C 230 120, 238 160, 240 200
               C 242 230, 244 250, 248 270
               C 250 278, 238 282, 234 274
               C 228 250, 222 220, 218 180
               C 215 150, 212 120, 208 105 Z"
            fill="url(#bodyGradient)"
          />

          {/* Perna Direita (Esquerda visual) */}
          <path
            d="M 112 275
               C 114 300, 115 340, 114 380
               C 113 410, 112 435, 115 442
               C 118 448, 132 448, 134 442
               C 137 420, 140 380, 144 340
               C 148 300, 149 282, 148 280 Z"
            fill="url(#bodyGradient)"
          />

          {/* Perna Esquerda (Direita visual) */}
          <path
            d="M 188 275
               C 186 300, 185 340, 186 380
               C 187 410, 188 435, 185 442
               C 182 448, 168 448, 166 442
               C 163 420, 160 380, 156 340
               C 152 300, 151 282, 152 280 Z"
            fill="url(#bodyGradient)"
          />

          {/* Umbigo / Referência anatômica */}
          <circle cx="150" cy="225" r="3" fill="#94a3b8" />
        </svg>

        {/* Nós Interativos Sobrepostos */}
        {SITE_POSITIONS.map((site) => {
          const isSelected = selectedSite === site.id;
          const isRecommended = recommendedSite === site.id;
          const isLast = lastAppliedSite === site.id;

          let bg = '#ffffff';
          let border = '#94a3b8';
          let textColor = '#334155';
          let scale = '1';

          if (isSelected) {
            bg = '#059669';
            border = '#064e3b';
            textColor = '#ffffff';
            scale = '1.15';
          } else if (isRecommended) {
            bg = '#d1fae5';
            border = '#10b981';
            textColor = '#065f46';
          } else if (isLast) {
            bg = '#fef3c7';
            border = '#d97706';
            textColor = '#92400e';
          }

          return (
            <button
              key={site.id}
              type="button"
              disabled={!interactive}
              onClick={() => onSelectSite(site.id)}
              title={`${site.label} ${isRecommended ? '• Recomendado' : isLast ? '• Última aplicação' : ''}`}
              style={{
                position: 'absolute',
                top: `${site.topPercent}%`,
                left: `${site.leftPercent}%`,
                transform: `translate(-50%, -50%) scale(${scale})`,
                backgroundColor: bg,
                border: `2px solid ${border}`,
                color: textColor,
                borderRadius: '9999px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                cursor: interactive ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: isSelected
                  ? '0 4px 12px rgba(5, 150, 105, 0.4)'
                  : '0 2px 6px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.15s ease',
                zIndex: isSelected ? 10 : 5,
              }}
            >
              {isSelected && <Check size={11} strokeWidth={3} />}
              <span>{site.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Legenda de Rotação */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
          padding: '0.75rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          border: '1px solid #f1f5f9',
          fontSize: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#059669' }} />
          <span style={{ fontWeight: 600, color: '#0f172a' }}>Selecionado ({selectedObj?.shortLabel})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d1fae5', border: '1.5px solid #10b981' }} />
          <span style={{ color: '#475569' }}>Próximo Recomendado</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#fef3c7', border: '1.5px solid #d97706' }} />
          <span style={{ color: '#475569' }}>Última Aplicação</span>
        </div>
      </div>
    </div>
  );
};
