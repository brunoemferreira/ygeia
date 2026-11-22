import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { YgeiaLogo } from '../ui';
import {
  LayoutGrid,
  Users,
  TrendingUp,
  Dumbbell,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  Search,
  Utensils,
  Droplets,
  Pill,
  Lock,
  CalendarCheck,
  MessageCircleHeart,
  FolderPlus,
  Apple,
  Activity,
  X,
  Layers,
  Flame,
  Award,
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
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mode,
  collapsed,
  onToggleCollapse,
  activeItem,
  onSelectItem,
  clinicBranding,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Vertical accordion collapse states
  const [expandedCadastros, setExpandedCadastros] = useState(true);
  const [expandedNutricao, setExpandedNutricao] = useState(true);
  const [expandedTreinamento, setExpandedTreinamento] = useState(true);

  const primaryColor = clinicBranding.primaryColor || '#059669';

  const handleSelectItem = (id: string) => {
    onSelectItem(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const sidebarWidth = collapsed ? '72px' : '260px';

  // Submenus de Cadastros (Apenas Pacientes conforme solicitado)
  const cadastrosItems = [
    { id: 'cadastros_pacientes', label: 'Pacientes', icon: Users },
  ];

  // Submenus de Nutrição
  const nutricaoItems = [
    { id: 'nutricao_tmb', label: 'Cálculo TMB / GET', icon: Flame },
    { id: 'nutricao_cardapio', label: 'Planejador de Cardápios', icon: Apple },
    { id: 'nutricao_antropometria', label: 'Avaliação & Pregas', icon: Activity },
    { id: 'nutricao_exames', label: 'Exames Laboratoriais', icon: Lock },
  ];

  // Submenus de Treinamento
  const treinamentoItems = [
    { id: 'treino_prescricao', label: 'Prescrição de Treinos', icon: Dumbbell },
    { id: 'treino_exercicios', label: 'Exercícios & Bi-Sets', icon: Layers },
    { id: 'treino_divisao', label: 'Divisão Semanal (ABCD)', icon: CalendarCheck },
    { id: 'treino_volume', label: 'Volume & Sobrecarga', icon: Award },
  ];

  // Itens Diretos (Apenas Configurações mantido)
  const directItems = [
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
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

  // Helper de Accordion para reutilização
  const renderAccordionGroup = (
    title: string,
    icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }>,
    isExpanded: boolean,
    onToggle: () => void,
    items: Array<{ id: string; label: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; style?: React.CSSProperties }> }>,
  ) => {
    const IconComponent = icon;
    const hasActiveChild = items.some((i) => i.id === activeItem);

    return (
      <div style={{ marginTop: '0.25rem' }}>
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? title : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            width: '100%',
            padding: collapsed ? '0.65rem 0' : '0.5rem 0.75rem',
            background: hasActiveChild && collapsed ? 'var(--primary-light)' : 'transparent',
            border: 'none',
            borderRadius: '0.5rem',
            color: hasActiveChild ? primaryColor : '#334155',
            fontSize: '0.8125rem',
            fontWeight: hasActiveChild ? 700 : 600,
            cursor: 'pointer',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = hasActiveChild && collapsed ? 'var(--primary-light)' : 'transparent')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <IconComponent size={16} color={hasActiveChild ? primaryColor : '#64748b'} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{title}</span>}
          </div>
          {!collapsed && (
            <div>{isExpanded ? <ChevronDown size={14} color="#94a3b8" /> : <ChevronRight size={14} color="#94a3b8" />}</div>
          )}
        </button>

        {/* Sub-itens: Exibidos com ícones tanto expandido quanto recolhido */}
        {isExpanded && (
          <div
            style={{
              paddingLeft: collapsed ? '0' : '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.15rem',
              marginTop: '0.15rem',
              alignItems: collapsed ? 'center' : 'stretch',
            }}
          >
            {items
              .filter((item) => !searchTerm || item.label.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((item) => {
                const ItemIcon = item.icon;
                const isActive = activeItem === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item.id)}
                    title={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      gap: '0.5rem',
                      padding: collapsed ? '0.5rem 0' : '0.4rem 0.65rem',
                      borderRadius: '0.375rem',
                      border: isActive && collapsed ? `1px solid ${primaryColor}40` : 'none',
                      background: isActive ? 'var(--primary-light)' : 'transparent',
                      color: isActive ? primaryColor : '#64748b',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: collapsed ? '36px' : '100%',
                      height: collapsed ? '36px' : 'auto',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <ItemIcon size={14} strokeWidth={isActive ? 2.2 : 1.75} style={{ flexShrink: 0 }} />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`ygeia-sidebar-drawer ${mobileOpen ? 'open' : ''}`}
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
          1. TOPO: LOGO DA MARCA, BOTÃO RETRÁTIL & CLOSE MOBILE
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
        {collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                minWidth: '34px',
                minHeight: '34px',
                maxWidth: '34px',
                maxHeight: '34px',
                borderRadius: '9px',
                background: primaryColor,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                aspectRatio: '1 / 1',
                boxShadow: '0 2px 6px var(--primary-border, rgba(5, 150, 105, 0.25))',
              }}
            >
              <YgeiaLogo size={22} inverted color={primaryColor} />
            </div>

            <button
              type="button"
              onClick={onToggleCollapse}
              className="desktop-only"
              title="Expandir Menu"
              style={{
                background: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                color: primaryColor,
                cursor: 'pointer',
                padding: '0.3rem',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
                width: '28px',
                height: '28px',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)';
                (e.currentTarget as HTMLElement).style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-light)';
                (e.currentTarget as HTMLElement).style.color = primaryColor;
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  minWidth: '34px',
                  minHeight: '34px',
                  maxWidth: '34px',
                  maxHeight: '34px',
                  borderRadius: '9px',
                  background: primaryColor,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  aspectRatio: '1 / 1',
                  boxShadow: '0 2px 6px var(--primary-border, rgba(5, 150, 105, 0.25))',
                }}
              >
                <YgeiaLogo size={22} inverted color={primaryColor} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    lineHeight: 1.2,
                  }}
                >
                  {(!clinicBranding.clinicName || clinicBranding.clinicName.includes('Better Health'))
                    ? 'Ygeía'
                    : clinicBranding.clinicName}
                </div>
                <div
                  style={{
                    fontSize: '0.65rem',
                    color: primaryColor,
                    fontWeight: 700,
                  }}
                >
                  {mode === 'professional' ? 'Admin Console' : 'Portal do Paciente'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {/* Botão de Fechar no Mobile */}
              {onCloseMobile && (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="mobile-only"
                  title="Fechar Menu"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    borderRadius: '0.375rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              )}

              {/* Botão de Contração/Expansão Horizontal (Desktop) */}
              <button
                type="button"
                onClick={onToggleCollapse}
                className="desktop-only"
                title="Recolher Menu"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: '0.375rem',
                  display: 'flex',
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
          </>
        )}
      </div>

      {/* ========================================================
          2. CAMPO DE BUSCA NO MENU
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
              onClick={() => handleSelectItem('dashboard_pacientes')}
              title={collapsed ? 'Dashboard de Pacientes' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: collapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                borderRadius: '0.5rem',
                border: activeItem === 'dashboard_pacientes' ? `1px solid ${primaryColor}40` : '1px solid transparent',
                backgroundColor: activeItem === 'dashboard_pacientes' ? 'var(--primary-light)' : 'transparent',
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

            {/* ========================================================
                NOVOS MENUS PRINCIPAIS EXIGIDOS PELO USUÁRIO
               ======================================================== */}

            {/* Menu 1: Cadastros */}
            {renderAccordionGroup(
              'Cadastros',
              FolderPlus,
              expandedCadastros,
              () => setExpandedCadastros(!expandedCadastros),
              cadastrosItems,
            )}

            {/* Menu 2: Nutrição */}
            {renderAccordionGroup(
              'Nutrição',
              Apple,
              expandedNutricao,
              () => setExpandedNutricao(!expandedNutricao),
              nutricaoItems,
            )}

            {/* Menu 3: Treinamento */}
            {renderAccordionGroup(
              'Treinamento',
              Dumbbell,
              expandedTreinamento,
              () => setExpandedTreinamento(!expandedTreinamento),
              treinamentoItems,
            )}

            {/* Linha Divisória */}
            <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.5rem 0.25rem' }} />

            {/* Itens Diretos (Configurações) */}
            {directItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: collapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
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
                onClick={() => handleSelectItem(item.id)}
                title={collapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: collapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
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
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
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
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              {user?.fullName
                ? user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'AH'}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {user?.fullName || 'Administrador Geral'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                  {mode === 'professional' ? 'Administrador • ADMIN' : 'Paciente • VIP'}
                </div>
              </div>
            )}
          </div>

          {/* Botão Sair */}
          {!collapsed && (
            <button
              type="button"
              onClick={handleLogoutAction}
              title="Encerrar Sessão"
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
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
