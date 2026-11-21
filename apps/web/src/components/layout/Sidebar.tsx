import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Calendar,
  Scale,
  ShieldCheck,
  UtensilsCrossed,
  BookOpen,
  Apple,
  Pill,
  Dumbbell,
  Video,
  Activity,
  HeartPulse,
  Palette,
  Stethoscope,
  Shield,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  Utensils,
  Droplets,
  TrendingUp,
  MessageCircleHeart,
  CalendarCheck,
} from 'lucide-react';

export type UserRoleMode = 'professional' | 'patient';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
}

interface NavSection {
  id: string;
  title: string;
  badge?: string;
  isLicensed?: boolean;
  items: NavItem[];
}

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
  activeModules: {
    nutrition: boolean;
    training: boolean;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  mode,
  collapsed,
  onToggleCollapse,
  activeItem,
  onSelectItem,
  clinicBranding,
  activeModules,
}) => {
  const { user } = useAuth();

  // Estado de recolhimento/expansão de cada seção do menu (Accordion)
  const [collapsedSections, setCollapsedSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Estrutura de Navegação Profissional (sem o termo "Módulo")
  const professionalSections: NavSection[] = [
    {
      id: 'cadastros',
      title: 'Cadastros Gerais',
      badge: 'Sempre Ativo',
      items: [
        { id: 'cadastros_pacientes', label: 'Pacientes & Alunos', icon: Users },
        { id: 'cadastros_agenda', label: 'Agenda & Agendamentos', icon: Calendar },
        { id: 'cadastros_antropometria', label: 'Avaliação Física & Antropometria', icon: Scale },
        { id: 'cadastros_exames', label: 'Cofre de Exames & Laudos', icon: ShieldCheck, badge: 'AES-256' },
      ],
    },
    {
      id: 'nutricao',
      title: 'Nutrição',
      isLicensed: activeModules.nutrition,
      badge: activeModules.nutrition ? 'Ativo' : 'Upgrade',
      items: [
        { id: 'nutri_prescritor', label: 'Prescritor Nutricional', icon: UtensilsCrossed },
        { id: 'nutri_taco', label: 'Tabela TACO & Alimentos', icon: Apple },
        { id: 'nutri_receitas', label: 'Biblioteca de Receitas', icon: BookOpen },
        { id: 'nutri_suplementos', label: 'Suplementação & Fitoterapia', icon: Pill },
      ],
    },
    {
      id: 'treinamento',
      title: 'Treinamento',
      isLicensed: activeModules.training,
      badge: activeModules.training ? 'Ativo' : 'Upgrade',
      items: [
        { id: 'treino_prescritor', label: 'Prescritor de Treinos', icon: Dumbbell },
        { id: 'treino_exercicios', label: 'Banco de Exercícios', icon: Video },
        { id: 'treino_periodizacao', label: 'Periodização & Volume', icon: Activity },
        { id: 'treino_cardio', label: 'Cardio & Frequência Cardíaca', icon: HeartPulse },
      ],
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      badge: 'Sempre Ativo',
      items: [
        { id: 'config_perfil', label: 'Perfil do Nutricionista (CRN/CREF)', icon: Stethoscope },
        { id: 'config_whitelabel', label: 'White Label & Marca', icon: Palette },
        { id: 'config_equipe', label: 'Equipe & Permissões RBAC', icon: Shield },
      ],
    },
  ];

  // Patient Sidebar Structure
  const patientSections = [
    {
      id: 'rotina',
      title: 'Minha Rotina',
      items: [
        { id: 'patient_diet', label: 'Meu Plano de Hoje', icon: Utensils },
        { id: 'patient_habits', label: 'Diário & Hidratação', icon: Droplets },
        { id: 'patient_supplements', label: 'Suplementação', icon: Pill },
      ],
    },
    {
      id: 'saude',
      title: 'Minha Saúde',
      items: [
        { id: 'patient_evolution', label: 'Minha Evolução', icon: TrendingUp },
        { id: 'patient_exams', label: 'Meus Exames (AES-256)', icon: Lock, badge: 'Seguro' },
      ],
    },
    {
      id: 'atendimento',
      title: 'Atendimento',
      items: [
        { id: 'patient_appointments', label: 'Minhas Consultas', icon: CalendarCheck },
        { id: 'patient_chat', label: 'Falar com Nutricionista', icon: MessageCircleHeart },
      ],
    },
  ];

  const sidebarWidth = collapsed ? '72px' : '264px';

  return (
    <aside
      style={{
        width: sidebarWidth,
        minWidth: sidebarWidth,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: mode === 'professional' ? '#090d16' : '#ffffff',
        borderRight: mode === 'professional' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
        color: mode === 'professional' ? '#f1f5f9' : '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        boxShadow: mode === 'patient' ? '2px 0 12px rgba(0,0,0,0.03)' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '1rem 0.5rem' : '1.25rem 1.25rem',
          borderBottom: mode === 'professional' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: collapsed ? '0.75rem' : 0,
        }}
      >
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: clinicBranding.primaryColor || '#059669',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.125rem',
                flexShrink: 0,
              }}
            >
              Υ
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  color: mode === 'professional' ? '#ffffff' : '#0f172a',
                }}
              >
                {clinicBranding.clinicName || 'Ygeía SaaS'}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: mode === 'professional' ? '#94a3b8' : '#64748b',
                  fontWeight: 600,
                }}
              >
                {mode === 'professional' ? 'Workspace Clínico' : 'Portal do Paciente'}
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={onToggleCollapse}
            title="Clique para expandir o menu lateral"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: clinicBranding.primaryColor || '#059669',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.125rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            Υ
          </div>
        )}

        {/* Expand / Collapse Button (ALWAYS VISIBLE AND ACCESSIBLE) */}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? 'Expandir Menu (Ver Descrições)' : 'Recolher Menu'}
          style={{
            background: collapsed
              ? mode === 'professional'
                ? 'rgba(255, 255, 255, 0.08)'
                : '#f1f5f9'
              : 'transparent',
            border: collapsed
              ? mode === 'professional'
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid #cbd5e1'
              : 'none',
            color: mode === 'professional' ? '#34d399' : '#059669',
            cursor: 'pointer',
            padding: '0.375rem',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: collapsed ? '34px' : 'auto',
            height: collapsed ? '34px' : 'auto',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              mode === 'professional' ? 'rgba(255,255,255,0.15)' : '#e2e8f0';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = collapsed
              ? mode === 'professional'
                ? 'rgba(255, 255, 255, 0.08)'
                : '#f1f5f9'
              : 'transparent';
          }}
        >
          {collapsed ? <ChevronRight size={18} strokeWidth={2.5} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Menu List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: collapsed ? '1rem 0.5rem' : '1rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {mode === 'professional' ? (
          professionalSections.map((section) => {
            const isLocked = section.isLicensed === false;
            const isSectionCollapsed = !!collapsedSections[section.id];

            return (
              <div key={section.id}>
                {!collapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    title={isSectionCollapsed ? `Expandir ${section.title}` : `Recolher ${section.title}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.35rem 0.5rem',
                      marginBottom: '0.25rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '0.375rem',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        mode === 'professional' ? 'rgba(255,255,255,0.06)' : '#f1f5f9';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      {isSectionCollapsed ? (
                        <ChevronRight size={13} color={mode === 'professional' ? '#64748b' : '#94a3b8'} />
                      ) : (
                        <ChevronDown size={13} color={mode === 'professional' ? '#64748b' : '#94a3b8'} />
                      )}
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: mode === 'professional' ? '#94a3b8' : '#64748b',
                        }}
                      >
                        {section.title}
                      </span>
                    </div>
                    {section.badge && (
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          padding: '0.125rem 0.375rem',
                          borderRadius: '9999px',
                          background:
                            section.badge === 'Upgrade'
                              ? 'rgba(234, 88, 12, 0.15)'
                              : 'rgba(5, 150, 105, 0.15)',
                          color: section.badge === 'Upgrade' ? '#ea580c' : '#10b981',
                        }}
                      >
                        {section.badge}
                      </span>
                    )}
                  </button>
                ) : (
                  <div
                    style={{
                      height: '1px',
                      background: mode === 'professional' ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
                      margin: '0.375rem 0.25rem',
                    }}
                  />
                )}

                {/* Section Items: recolhe se o menu estiver expandido e a seção marcada como recolhida */}
                {(!isSectionCollapsed || collapsed) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (!isLocked) onSelectItem(item.id);
                        }}
                        disabled={isLocked}
                        title={collapsed ? item.label : undefined}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: collapsed ? '0.625rem' : '0.625rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          background: isActive
                            ? mode === 'professional'
                              ? 'rgba(5, 150, 105, 0.2)'
                              : '#ecfdf5'
                            : 'transparent',
                          color: isLocked
                            ? '#475569'
                            : isActive
                            ? mode === 'professional'
                              ? '#34d399'
                              : '#059669'
                            : mode === 'professional'
                            ? '#cbd5e1'
                            : '#475569',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.8125rem',
                          justifyContent: collapsed ? 'center' : 'flex-start',
                          transition: 'all 0.15s ease',
                          width: '100%',
                          textAlign: 'left',
                          opacity: isLocked ? 0.45 : 1,
                        }}
                        onMouseOver={(e) => {
                          if (!isActive && !isLocked) {
                            (e.currentTarget as HTMLElement).style.backgroundColor =
                              mode === 'professional' ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isActive && !isLocked) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <Icon size={18} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                        {!collapsed && (
                          <span
                            style={{
                              flex: 1,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                        {!collapsed && item.badge && (
                          <span
                            style={{
                              fontSize: '0.625rem',
                              fontWeight: 700,
                              padding: '0.125rem 0.375rem',
                              borderRadius: '4px',
                              background: 'rgba(5, 150, 105, 0.2)',
                              color: '#34d399',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                        {!collapsed && isLocked && <Lock size={12} color="#64748b" />}
                      </button>
                    );
                  })}
                </div>
                )}
              </div>
            );
          })
        ) : (
          patientSections.map((section) => {
            const isSectionCollapsed = !!collapsedSections[section.id];

            return (
              <div key={section.id}>
                {!collapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    title={isSectionCollapsed ? `Expandir ${section.title}` : `Recolher ${section.title}`}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.35rem 0.5rem',
                      marginBottom: '0.25rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '0.375rem',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {isSectionCollapsed ? (
                      <ChevronRight size={13} color="#94a3b8" />
                    ) : (
                      <ChevronDown size={13} color="#94a3b8" />
                    )}
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: '#64748b',
                      }}
                    >
                      {section.title}
                    </span>
                  </button>
                ) : (
                  <div
                    style={{
                      height: '1px',
                      background: '#e2e8f0',
                      margin: '0.375rem 0.25rem',
                    }}
                  />
                )}

                {/* Patient Section Items */}
                {(!isSectionCollapsed || collapsed) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {section.items.map((item) => {
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
                            gap: '0.75rem',
                            padding: collapsed ? '0.625rem' : '0.625rem 0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            background: isActive ? '#ecfdf5' : 'transparent',
                            color: isActive ? '#059669' : '#334155',
                            fontWeight: isActive ? 700 : 500,
                            fontSize: '0.8125rem',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            transition: 'all 0.15s ease',
                            width: '100%',
                            textAlign: 'left',
                          }}
                          onMouseOver={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isActive) {
                              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <Icon size={18} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                          {!collapsed && (
                            <span
                              style={{
                                flex: 1,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.label}
                            </span>
                          )}
                          {!collapsed && item.badge && (
                            <span
                              style={{
                                fontSize: '0.625rem',
                                fontWeight: 700,
                                padding: '0.125rem 0.375rem',
                                borderRadius: '4px',
                                background: '#ecfdf5',
                                color: '#059669',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Profile Box */}
      <div
        style={{
          padding: '1rem',
          borderTop: mode === 'professional' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: mode === 'professional' ? 'rgba(0,0,0,0.2)' : '#fafafa',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: mode === 'professional' ? '#1e293b' : '#e0f2fe',
            color: mode === 'professional' ? '#34d399' : '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.8125rem',
            flexShrink: 0,
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          {mode === 'professional'
            ? user?.fullName
              ? user.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              : 'DR'
            : 'GR'}
        </div>

        {!collapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                color: mode === 'professional' ? '#ffffff' : '#0f172a',
              }}
            >
              {mode === 'professional' ? user?.fullName || 'Dra. Sofia Alencar' : 'Gabriel Rodrigues'}
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: mode === 'professional' ? '#94a3b8' : '#64748b',
              }}
            >
              {mode === 'professional'
                ? user?.role === 'CLINIC_OWNER'
                  ? 'Proprietário(a)'
                  : 'Nutricionista Clínico'
                : 'Plano Hipertrofia'}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
