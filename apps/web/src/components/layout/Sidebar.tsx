import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutGrid,
  Calendar,
  Users,
  CheckSquare,
  TrendingUp,
  MessageSquare,
  ListTodo,
  FileText,
  FileCheck,
  CreditCard,
  Sparkles,
  Dumbbell,
  Settings,
  UserCheck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Search,
  Heart,
  Utensils,
  Droplets,
  Pill,
  Lock,
  CalendarCheck,
  MessageCircleHeart,
} from 'lucide-react';

export type UserRoleMode = 'professional' | 'patient';

interface SidebarProps {
  mode: UserRoleMode;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeItem: string;
  onSelectItem: (id: string) => void;
  clinicBranding: {
    clinicName: string;
    primaryColor: string;
    secondaryColor: string;
  };
  activeModules?: Record<string, boolean>;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mode,
  collapsed,
  onToggleCollapse,
  activeItem,
  onSelectItem,
  clinicBranding,
  onLogout,
}) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Vertical accordion collapse states
  const [expandedRotina, setExpandedRotina] = useState(true);
  const [expandedAtendimento, setExpandedAtendimento] = useState(true);

  const primaryColor = clinicBranding.primaryColor || '#059669';

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const sidebarWidth = collapsed ? '72px' : '260px';

  // Submenus de Rotina
  const rotinaItems = [
    { id: 'rotina_agenda', label: 'Agenda', icon: Calendar },
    { id: 'rotina_pacientes', label: 'Pacientes', icon: Users },
    { id: 'rotina_daily', label: 'Daily', icon: CheckSquare },
    { id: 'rotina_acompanhamentos', label: 'Acompanhamentos', icon: TrendingUp },
    { id: 'rotina_chat', label: 'Chat com pacientes', icon: MessageSquare },
    { id: 'rotina_tarefas', label: 'Tarefas', icon: ListTodo },
  ];

  // Submenus de Atendimento
  const atendimentoItems = [
    { id: 'atendimento_pre', label: 'Formulário pré-consulta', icon: FileText },
    { id: 'atendimento_pos', label: 'Formulário pós-consulta', icon: FileCheck },
  ];

  // Itens Diretos
  const directItems = [
    { id: 'gestao_contas', label: 'Gestão de Contas', icon: CreditCard },
    { id: 'clube_vantagens', label: 'Clube de Vantagens', icon: Sparkles },
    { id: 'treino_modulo', label: 'Módulo de Treino', icon: Dumbbell },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'minha_conta', label: 'Minha Conta Admin', icon: UserCheck },
  ];

  // Itens do Paciente
  const patientItems = [
    { id: 'patient_diet', label: 'Meu Plano de Hoje', icon: Utensils },
    { id: 'patient_habits', label: 'Diário & Hidratação', icon: Droplets },
    { id: 'patient_supplements', label: 'Suplementação', icon: Pill },
    { id: 'patient_evolution', label: 'Minha Evolução', icon: TrendingUp },
    { id: 'patient_exams', label: 'Meus Exames (AES-256)', icon: Lock },
    { id: 'patient_appointments', label: 'Minhas Consultas', icon: CalendarCheck },
    { id: 'patient_chat', label: 'Falar com Nutricionista', icon: MessageCircleHeart },
  ];

  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ========================================================
          1. TOPO: LOGO DA MARCA & BOTÃO RETRÁTIL HORIZONTAL
         ======================================================== */}
      <div
        style={{
          padding: collapsed ? '1.1rem 0.5rem' : '1.1rem 1rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: primaryColor,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Heart size={18} fill="#ffffff" color="#ffffff" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  lineHeight: 1.2,
                }}
              >
                {clinicBranding.clinicName || 'Ygeía'}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: primaryColor,
                  fontWeight: 700,
                }}
              >
                {mode === 'professional' ? 'Admin Console' : 'Portal do Paciente'}
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={onToggleCollapse}
            title="Expandir Menu Lateral"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: primaryColor,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Heart size={18} fill="#ffffff" color="#ffffff" />
          </div>
        )}

        {/* Botão de Contração/Expansão Horizontal */}
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '0.35rem',
            borderRadius: '0.375rem',
            display: collapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* ========================================================
          2. CAMPO DE BUSCA NO MENU (Estilo do Mockup)
         ======================================================== */}
      {!collapsed && mode === 'professional' && (
        <div style={{ padding: '0.875rem 1rem 0.25rem 1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '0.65rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: primaryColor,
              }}
            />
            <input
              type="text"
              placeholder="Buscar no menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem 0.45rem 2.1rem',
                borderRadius: '0.5rem',
                border: `1.5px solid ${primaryColor}60`,
                fontSize: '0.75rem',
                color: '#334155',
                outline: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff',
              }}
              onFocus={(e) => (e.target.style.borderColor = primaryColor)}
              onBlur={(e) => (e.target.style.borderColor = `${primaryColor}60`)}
            />
          </div>
        </div>
      )}

      {/* ========================================================
          3. LISTA DE NAVEGAÇÃO
         ======================================================== */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: collapsed ? '0.75rem 0.35rem' : '0.75rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        {mode === 'professional' ? (
          <>
            {/* Categoria: GOVERNANÇA & CLÍNICA */}
            {!collapsed && (
              <div
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  letterSpacing: '0.06em',
                  padding: '0.5rem 0.6rem 0.25rem 0.6rem',
                  textTransform: 'uppercase',
                }}
              >
                Governança & Clínica
              </div>
            )}

            {/* Item Ativo Principal: Dashboard de Pacientes */}
            <button
              type="button"
              onClick={() => onSelectItem('dashboard_pacientes')}
              title={collapsed ? 'Dashboard de Pacientes' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: collapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                borderRadius: '0.5rem',
                border: activeItem === 'dashboard_pacientes' ? `1px solid ${primaryColor}40` : '1px solid transparent',
                backgroundColor: activeItem === 'dashboard_pacientes' ? '#ecfdf5' : 'transparent',
                color: activeItem === 'dashboard_pacientes' ? primaryColor : '#475569',
                fontWeight: activeItem === 'dashboard_pacientes' ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                width: '100%',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => {
                if (activeItem !== 'dashboard_pacientes') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseOut={(e) => {
                if (activeItem !== 'dashboard_pacientes') {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              <LayoutGrid size={16} strokeWidth={2.2} style={{ flexShrink: 0 }} />
              {!collapsed && <span>Dashboard de Pacientes</span>}
            </button>

            {/* Accordion Vertical: Rotina */}
            <div style={{ marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setExpandedRotina(!expandedRotina)}
                title={collapsed ? 'Rotina' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  width: '100%',
                  padding: collapsed ? '0.65rem 0' : '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#334155',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <Calendar size={16} color="#64748b" style={{ flexShrink: 0 }} />
                  {!collapsed && <span>Rotina</span>}
                </div>
                {!collapsed && (
                  <div>{expandedRotina ? <ChevronDown size={14} color="#94a3b8" /> : <ChevronRight size={14} color="#94a3b8" />}</div>
                )}
              </button>

              {/* Sub-itens de Rotina (Expandíveis/Contráteis Verticalmente) */}
              {expandedRotina && !collapsed && (
                <div style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.15rem' }}>
                  {rotinaItems.map((item) => {
                    const isActive = activeItem === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectItem(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          background: isActive ? '#ecfdf5' : 'transparent',
                          color: isActive ? primaryColor : '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: isActive ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                      >
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accordion Vertical: Atendimento */}
            <div style={{ marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setExpandedAtendimento(!expandedAtendimento)}
                title={collapsed ? 'Atendimento' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  width: '100%',
                  padding: collapsed ? '0.65rem 0' : '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#334155',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <FileText size={16} color="#64748b" style={{ flexShrink: 0 }} />
                  {!collapsed && <span>Atendimento</span>}
                </div>
                {!collapsed && (
                  <div>{expandedAtendimento ? <ChevronDown size={14} color="#94a3b8" /> : <ChevronRight size={14} color="#94a3b8" />}</div>
                )}
              </button>

              {/* Sub-itens de Atendimento */}
              {expandedAtendimento && !collapsed && (
                <div style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.15rem' }}>
                  {atendimentoItems.map((item) => {
                    const isActive = activeItem === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectItem(item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          background: isActive ? '#ecfdf5' : 'transparent',
                          color: isActive ? primaryColor : '#64748b',
                          fontSize: '0.75rem',
                          fontWeight: isActive ? 700 : 500,
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                      >
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Linha Divisória */}
            <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.5rem 0.25rem' }} />

            {/* Itens Diretos (Gestão de Contas, Clube, Treino, Configurações, Minha Conta) */}
            {directItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectItem(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: collapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                    color: isActive ? primaryColor : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    width: '100%',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.75} style={{ flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </>
        ) : (
          /* Navegação do Paciente */
          patientItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: collapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                  color: isActive ? primaryColor : '#475569',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  width: '100%',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  textAlign: 'left',
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })
        )}
      </div>

      {/* ========================================================
          4. RODAPÉ DO SIDEBAR: VERSÃO & CARD DO USUÁRIO
         ======================================================== */}
      <div
        style={{
          borderTop: '1px solid #f1f5f9',
          padding: collapsed ? '0.75rem 0.35rem' : '0.75rem 0.875rem',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
        }}
      >
        {/* Badge da Versão */}
        {!collapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.6875rem',
              color: '#64748b',
              padding: '0 0.25rem',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>Versão v0.58.0</span>
          </div>
        )}

        {/* Card do Usuário */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem',
                border: '1px solid #e2e8f0',
                flexShrink: 0,
              }}
            >
              {user?.fullName
                ? user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                : 'BF'}
            </div>

            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {user?.fullName || 'Bruno Ferreira'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                  Administrador • ADMIN
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              type="button"
              onClick={handleLogoutAction}
              title="Encerrar sessão"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.35rem',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.15s ease',
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = '#dc2626')}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
