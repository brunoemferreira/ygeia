import React from 'react';
import { Search, ChevronDown, ChevronRight, Plus } from 'lucide-react';

export interface MenuGroupItem {
  id: string;
  label: string;
  hasPlus?: boolean;
  badge?: string;
}

export interface MenuGroup {
  type: string;
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  children: MenuGroupItem[];
}

export interface PatientSidebarNavProps {
  menuGroups: MenuGroup[];
  activeSection: string;
  expandedGroups: Record<string, boolean>;
  sectionSearch: string;
  onSelectSection: (id: string) => void;
  onToggleGroup: (groupId: string) => void;
  onSearchChange: (value: string) => void;
  onStartNewAnamnese: () => void;
  onOpenNewRecallModal: () => void;
  onOpenNewProntuarioModal: () => void;
  onOpenNewRestrictionModal: () => void;
}

export const PatientSidebarNav: React.FC<PatientSidebarNavProps> = ({
  menuGroups,
  activeSection,
  expandedGroups,
  sectionSearch,
  onSelectSection,
  onToggleGroup,
  onSearchChange,
  onStartNewAnamnese,
  onOpenNewRecallModal,
  onOpenNewProntuarioModal,
  onOpenNewRestrictionModal,
}) => {
  const filteredMenuGroups = menuGroups
    .map((group) => {
      if (!sectionSearch.trim()) return group;
      const filteredChildren = group.children.filter((child) =>
        child.label.toLowerCase().includes(sectionSearch.toLowerCase())
      );
      if (filteredChildren.length > 0 || group.label.toLowerCase().includes(sectionSearch.toLowerCase())) {
        return { ...group, children: filteredChildren.length > 0 ? filteredChildren : group.children };
      }
      return null;
    })
    .filter(Boolean) as MenuGroup[];

  return (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #f1f5f9',
        padding: '0.75rem 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.15rem',
        overflowY: 'auto',
        height: 'calc(100vh - 65px)',
        position: 'sticky',
        top: '65px',
      }}
    >
      {/* Campo de Busca de Seção */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          borderRadius: '0.375rem',
          border: '1px solid #e2e8f0',
          padding: '0.35rem 0.55rem',
          marginBottom: '0.35rem',
          backgroundColor: '#ffffff',
        }}
      >
        <Search size={13} color="#94a3b8" />
        <input
          type="text"
          placeholder="Buscar seção..."
          value={sectionSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '0.75rem',
            color: '#334155',
            width: '100%',
            backgroundColor: 'transparent',
          }}
        />
      </div>

      {/* Lista de Grupos Expansíveis */}
      {filteredMenuGroups.map((item) => {
        const IconComponent = item.icon;
        const isExpanded = expandedGroups[item.id] ?? false;

        return (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              type="button"
              onClick={() => {
                onToggleGroup(item.id);
                if (!isExpanded && item.children && item.children.length > 0) {
                  if (item.id === 'prescricao_dietetica') {
                    onSelectSection('plano_alimentar');
                  } else {
                    onSelectSection(item.children[0].id);
                  }
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0.4rem 0.6rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#334155',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.15s ease',
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconComponent size={14} color="#64748b" />
                <span>{item.label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown size={13} color="#94a3b8" />
              ) : (
                <ChevronRight size={13} color="#94a3b8" />
              )}
            </button>

            {/* Filhos do Grupo */}
            {isExpanded && item.children && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: '1.25rem',
                  gap: '0.1rem',
                  marginTop: '0.1rem',
                  marginBottom: '0.25rem',
                }}
              >
                {item.children.map((sub) => {
                  const isSubActive = activeSection === sub.id;

                  return (
                    <div
                      key={sub.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '0.375rem',
                        backgroundColor: isSubActive ? 'var(--primary-light)' : 'transparent',
                        paddingRight: '0.35rem',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectSection(sub.id)}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.32rem 0.5rem',
                          border: 'none',
                          background: 'none',
                          color: isSubActive ? 'var(--primary)' : '#475569',
                          fontSize: '0.78125rem',
                          fontWeight: isSubActive ? 600 : 400,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          if (!isSubActive) (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                        }}
                        onMouseOut={(e) => {
                          if (!isSubActive) (e.currentTarget as HTMLElement).style.color = '#475569';
                        }}
                      >
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: isSubActive ? 'var(--primary)' : '#cbd5e1',
                          }}
                        />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {sub.label}
                        </span>
                        {sub.badge && (
                          <span
                            style={{
                              fontSize: '0.5625rem',
                              fontWeight: 700,
                              backgroundColor: '#fef3c7',
                              color: '#b45309',
                              padding: '0.05rem 0.3rem',
                              borderRadius: '9999px',
                              marginLeft: '0.2rem',
                            }}
                          >
                            {sub.badge}
                          </span>
                        )}
                      </button>

                      {/* Botão de Atalho (+) */}
                      {sub.hasPlus && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSection(sub.id);
                            if (sub.id === 'anamnese_transcricao') onStartNewAnamnese();
                            else if (sub.id === 'recordatorio_alimentar') onOpenNewRecallModal();
                            else if (sub.id === 'prontuario') onOpenNewProntuarioModal();
                            else if (sub.id === 'restricoes_alimentares') onOpenNewRestrictionModal();
                          }}
                          title={`Novo ${sub.label}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            borderRadius: '0.25rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                          }}
                          onMouseOver={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = '#e2e8f0';
                            (e.currentTarget as HTMLElement).style.color = '#334155';
                          }}
                          onMouseOut={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                          }}
                        >
                          <Plus size={11} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};
