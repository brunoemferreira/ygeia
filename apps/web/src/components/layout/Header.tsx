import React from 'react';
import {
  Home,
  ShieldCheck,
  PanelLeftOpen,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { UserRoleMode } from './Sidebar';

interface HeaderProps {
  mode: UserRoleMode;
  onLogout: () => void;
  breadcrumbs: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onLogout,
  breadcrumbs,
  sidebarCollapsed,
  onToggleSidebar,
}) => {
  // Subtítulo descritivo conforme o item ativo
  const getSubDescription = () => {
    if (breadcrumbs.includes('Dashboard de Pacientes')) {
      return 'Visão executiva da carteira de pacientes, perfil de IMC (OMS), adesão e alertas de retorno';
    }
    if (breadcrumbs.includes('Pacientes')) {
      return 'Acesso rápido à carteira ativa de pacientes e histórico clínico';
    }
    if (breadcrumbs.includes('Agenda')) {
      return 'Controle de agendamentos, sessões confirmadas e horários disponíveis';
    }
    if (breadcrumbs.includes('Configurações')) {
      return 'Gerencie suas preferências, dados pessoais e configurações do sistema';
    }
    return 'Plataforma clínica de alta precisão e conformidade com o CFN';
  };

  const breadcrumbParts = breadcrumbs.split(' / ');
  const mainTitle = breadcrumbParts[breadcrumbParts.length - 1] || 'Dashboard de Pacientes';
  const parentCategory = breadcrumbParts.length > 1 ? breadcrumbParts[0] : 'Governança Clínica';

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Lado Esquerdo: Breadcrumbs & Título Descritivo (Estilo Mockup) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
        {/* Botão de alternar menu lateral (caso recolhido) */}
        {sidebarCollapsed && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Expandir Menu Lateral"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary)',
              borderRadius: '0.5rem',
              padding: '0.45rem',
              cursor: 'pointer',
              marginTop: '2px',
            }}
          >
            <PanelLeftOpen size={17} />
          </button>
        )}

        <div>
          {/* Linha 1: Breadcrumb com Home Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>
            <Home size={13} color="#94a3b8" />
            <ChevronRight size={11} color="#cbd5e1" />
            <span>{parentCategory}</span>
            <ChevronRight size={11} color="#cbd5e1" />
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{mainTitle}</span>
          </div>

          {/* Linha 2: Título em destaque + Descrição detalhada */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
              {parentCategory && parentCategory !== mainTitle ? `${parentCategory} • ${mainTitle}` : mainTitle}
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {getSubDescription()}
            </span>
          </div>
        </div>
      </div>

      {/* Lado Direito: Badge Acesso Administrativo Exclusivo & Ações */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.35rem 0.875rem',
            borderRadius: '9999px',
          }}
        >
          <ShieldCheck size={13} color="var(--primary)" />
          <span>
            {mode === 'professional' ? 'Acesso Administrativo Exclusivo' : 'Portal do Paciente'}
          </span>
        </div>

        {/* Botão Sair */}
        <button
          type="button"
          onClick={onLogout}
          title="Encerrar sessão com segurança"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'transparent',
            border: '1px solid #f1f5f9',
            borderRadius: '0.5rem',
            padding: '0.4rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#fef2f2';
            (e.currentTarget as HTMLElement).style.borderColor = '#fecaca';
            (e.currentTarget as HTMLElement).style.color = '#b91c1c';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.color = '#64748b';
          }}
        >
          <LogOut size={13} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};
