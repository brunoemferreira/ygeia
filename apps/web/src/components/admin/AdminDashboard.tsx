import React, { useState } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SettingsModule } from '../settings/SettingsModule';
import { getStoredBranding } from '../../utils/branding';

export interface AdminDashboardProps {
  onBackToHome?: () => void;
  activeItem?: string;
  hideHeader?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeItem = 'dashboard_pacientes',
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  // State de busca de paciente
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(21);

  // Lista de pacientes
  const [patients] = useState([
    {
      id: '1',
      name: user?.fullName || 'Bruno Eduardo de Moura Ferreira',
      initials: 'BF',
      email: user?.email || 'brunoemf@gmail.com',
      phone: '(19) 99292-2000',
      goal: 'Performance & Modulação Metabólica',
      status: 'Ativo',
      lastConsult: '21/11/2026',
    },
  ]);

  // Lista de agendamentos
  const [appointments] = useState([
    {
      id: '1',
      patientName: user?.fullName || 'Bruno Eduardo de Moura Ferreira',
      status: 'Agendado',
      type: 'Agendamento',
      dayLabel: 'Amanhã',
      time: '08:00',
    },
  ]);

  // Dias da semana para a régua de calendário do mockup
  const weekDays = [
    { label: 'D', day: 15, hasDot: false },
    { label: 'S', day: 16, hasDot: false },
    { label: 'T', day: 17, hasDot: false },
    { label: 'Q', day: 18, hasDot: true },
    { label: 'Q', day: 19, hasDot: false },
    { label: 'S', day: 20, hasDot: false },
    { label: 'S', day: 21, hasDot: false, isToday: true },
  ];

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()),
  );

  return (
    <div
      style={{
        minHeight: '100%',
        backgroundColor: '#f4f8f7',
        padding: '1.75rem 2rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ========================================================
          VIEW: DASHBOARD DE PACIENTES (EXATAMENTE COMO NO MOCKUP)
         ======================================================== */}
      {activeItem === 'dashboard_pacientes' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '1.5rem',
            alignItems: 'start',
          }}
        >
          {/* ====================================================
              CARD 1 (ESQUERDA): BUSCA E LISTA DE PACIENTES
             ==================================================== */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '440px',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Campo de Busca de Paciente */}
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="text"
                  placeholder="Buscar paciente por nome ou chave..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: '0.625rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = primaryColor)}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>

              {/* Lista de Pacientes Encontrados */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                    onClick={() => toast.info(`Prontuário de ${patient.name} selecionado.`)}
                  >
                    {/* Avatar em Círculo com Iniciais */}
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#e2e8f0',
                        color: '#475569',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {patient.initials}
                    </div>

                    {/* Nome do Paciente */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {patient.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé do Card: Contador & Ações */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1.25rem',
                borderTop: '1px solid #f1f5f9',
                marginTop: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                {patients.length} pacientes no total
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  type="button"
                  onClick={() => toast.info('Carregando base completa de pacientes...')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: primaryColor,
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>Ver todos os pacientes</span>
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => toast.success('Formulário de cadastro aberto com sucesso.')}
                  style={{
                    backgroundColor: primaryColor,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    boxShadow: `0 2px 8px ${primaryColor}35`,
                  }}
                >
                  <Plus size={15} />
                  <span>Cadastrar paciente</span>
                </button>
              </div>
            </div>
          </div>

          {/* ====================================================
              CARD 2 (DIREITA): AGENDA SEMANAL & ATENDIMENTOS
             ==================================================== */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '440px',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Régua de Navegação Semanal de Dias */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid #f1f5f9',
                  marginBottom: '1.5rem',
                  gap: '0.35rem',
                }}
              >
                {/* Seta Esquerda */}
                <button
                  type="button"
                  onClick={() => toast.info('Navegando para a semana anterior')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Dias da Semana (D S T Q Q S S) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, justifyContent: 'space-around' }}>
                  {weekDays.map((w) => {
                    const isSelected = selectedDay === w.day;
                    return (
                      <button
                        key={w.day}
                        type="button"
                        onClick={() => setSelectedDay(w.day)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.2rem',
                          background: isSelected ? '#ecfdf5' : 'transparent',
                          border: isSelected ? `1px solid ${primaryColor}40` : '1px solid transparent',
                          borderRadius: '0.5rem',
                          padding: '0.4rem 0.55rem',
                          cursor: 'pointer',
                          minWidth: '34px',
                        }}
                      >
                        <span style={{ fontSize: '0.6875rem', color: isSelected ? primaryColor : '#64748b', fontWeight: 600 }}>
                          {w.label}
                        </span>
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: isSelected ? 800 : 600,
                            color: isSelected ? primaryColor : '#0f172a',
                          }}
                        >
                          {w.day}
                        </span>
                        {w.hasDot && (
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: primaryColor }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Seta Direita */}
                <button
                  type="button"
                  onClick={() => toast.info('Navegando para a próxima semana')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '0.35rem',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ChevronRight size={16} />
                </button>

                {/* Botão + de Novo Agendamento */}
                <button
                  type="button"
                  onClick={() => toast.success('Novo agendamento de consulta iniciado.')}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '0.25rem',
                  }}
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Item de Agendamento */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.875rem 1rem',
                      borderRadius: '0.625rem',
                      border: '1px solid #f1f5f9',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                        {apt.patientName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {apt.type} • {apt.status}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {apt.dayLabel}
                      </div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                        {apt.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW: CONFIGURAÇÕES UNIFICADAS
         ======================================================== */}
      {(activeItem === 'configuracoes' || activeItem.startsWith('config')) && (
        <SettingsModule />
      )}

      {/* ========================================================
          OUTRAS VIEWS (Agenda, CRM, Treino, etc.)
         ======================================================== */}
      {activeItem === 'rotina_agenda' && (
        <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            📅 Agenda de Consultas & Sessões
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Visão completa do calendário clínico integrado com sincronização automática do Google Calendar.
          </p>
        </div>
      )}

      {activeItem === 'rotina_pacientes' && (
        <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            👥 Carteira de Pacientes
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Gerenciamento completo de prontuários, anamneses, metas de peso e exames laboratoriais.
          </p>
        </div>
      )}
    </div>
  );
};
