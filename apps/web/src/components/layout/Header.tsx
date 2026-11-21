import React from 'react';
import {
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { UserRoleMode } from './Sidebar';

interface HeaderProps {
  mode: UserRoleMode;
  onChangeMode: (mode: UserRoleMode) => void;
  activeModules: {
    nutrition: boolean;
    training: boolean;
  };
  onToggleModule: (module: 'nutrition' | 'training') => void;
  onBackToLanding: () => void;
  breadcrumbs: string;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onChangeMode,
  activeModules,
  onToggleModule,
  onBackToLanding,
  breadcrumbs,
}) => {
  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Breadcrumbs & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>
            {mode === 'professional' ? 'Workspace' : 'Portal'}
          </span>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
            {breadcrumbs}
          </span>
        </div>

        {mode === 'professional' && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
            }}
          >
            <ShieldCheck size={12} />
            RLS Ativo
          </span>
        )}
      </div>

      {/* Center: Interactive Mode Switcher (Nutricionista vs Paciente) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f1f5f9',
          borderRadius: '9999px',
          padding: '0.25rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <button
          type="button"
          onClick={() => onChangeMode('professional')}
          style={{
            padding: '0.375rem 0.875rem',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: mode === 'professional' ? '#0f172a' : 'transparent',
            color: mode === 'professional' ? '#ffffff' : '#64748b',
          }}
        >
          🩺 Nutricionista / Admin
        </button>

        <button
          type="button"
          onClick={() => onChangeMode('patient')}
          style={{
            padding: '0.375rem 0.875rem',
            borderRadius: '9999px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: mode === 'patient' ? '#059669' : 'transparent',
            color: mode === 'patient' ? '#ffffff' : '#64748b',
          }}
        >
          🍎 Área do Paciente
        </button>
      </div>

      {/* Right Actions & Module Licenses Simulator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Modular License Toggles (Available in Professional Mode) */}
        {mode === 'professional' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#f8fafc', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>
              Licenças:
            </span>
            <button
              type="button"
              onClick={() => onToggleModule('nutrition')}
              title="Alternar licença do Módulo Nutrição"
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: activeModules.nutrition ? '#ecfdf5' : '#f1f5f9',
                color: activeModules.nutrition ? '#059669' : '#94a3b8',
              }}
            >
              🥗 Nutri {activeModules.nutrition ? '✓' : '✗'}
            </button>
            <button
              type="button"
              onClick={() => onToggleModule('training')}
              title="Alternar licença do Módulo Treinamento"
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: activeModules.training ? '#eff6ff' : '#f1f5f9',
                color: activeModules.training ? '#1d4ed8' : '#94a3b8',
              }}
            >
              🏋️ Treino {activeModules.training ? '✓' : '✗'}
            </button>
          </div>
        )}

        {/* Back to Home CTA */}
        <button
          onClick={onBackToLanding}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: 'transparent',
            border: '1px solid #cbd5e1',
            borderRadius: '0.5rem',
            padding: '0.375rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          <ExternalLink size={14} />
          <span>Landing Page</span>
        </button>
      </div>
    </header>
  );
};
