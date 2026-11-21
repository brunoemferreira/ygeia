import React from 'react';
import {
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRoleMode } from './Sidebar';

interface HeaderProps {
  mode: UserRoleMode;
  activeModules: {
    nutrition: boolean;
    training: boolean;
  };
  onToggleModule: (module: 'nutrition' | 'training') => void;
  onLogout: () => void;
  breadcrumbs: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  activeModules,
  onToggleModule,
  onLogout,
  breadcrumbs,
  sidebarCollapsed,
  onToggleSidebar,
}) => {
  const { user } = useAuth();
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
      {/* Left: Sidebar Toggle + Breadcrumbs & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Quick Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title={sidebarCollapsed ? 'Expandir menu lateral (ver descrições)' : 'Recolher menu lateral'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: sidebarCollapsed ? '#ecfdf5' : '#f8fafc',
            border: `1px solid ${sidebarCollapsed ? '#6ee7b7' : '#cbd5e1'}`,
            color: sidebarCollapsed ? '#059669' : '#475569',
            borderRadius: '0.375rem',
            padding: '0.4rem',
            cursor: 'pointer',
          }}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

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

      {/* Center: Context Badge (Indica o ambiente conforme login do usuário) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          background: mode === 'professional' ? '#f8fafc' : '#ecfdf5',
          borderRadius: '9999px',
          padding: '0.3rem 0.875rem',
          border: `1px solid ${mode === 'professional' ? '#e2e8f0' : '#a7f3d0'}`,
          fontSize: '0.75rem',
          fontWeight: 700,
          color: mode === 'professional' ? '#334155' : '#065f46',
        }}
      >
        <span>{mode === 'professional' ? '🩺 Painel do Nutricionista' : '🍎 Portal do Paciente'}</span>
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
              title="Alternar licença: Nutrição"
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
              title="Alternar licença: Treinamento"
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

        {/* User identification badge */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              padding: '0.25rem 0.625rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            <User size={13} color="#059669" />
            <span>{user.fullName || user.email}</span>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          title="Encerrar sessão com segurança"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            padding: '0.375rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#b91c1c',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#fee2e2';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#fef2f2';
          }}
        >
          <LogOut size={14} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};
