import React, { useState, useEffect } from 'react';
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
import { NewPatientView } from '../patients/NewPatientView';
import { PatientDirectory, PatientRecord } from '../patients/PatientDirectory';
import { getStoredBranding } from '../../utils/branding';

export interface AdminDashboardProps {
  onBackToHome?: () => void;
  activeItem?: string;
  onNavigateToItem?: (item: string) => void;
  hideHeader?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeItem = 'dashboard_pacientes',
  onNavigateToItem,
}) => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  // Modo de visualização na tela de Pacientes: 'grid' (Tabela Paginada), 'create' (Novo) ou 'edit' (Edição)
  const [patientViewMode, setPatientViewMode] = useState<'grid' | 'create' | 'edit'>('grid');
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<PatientRecord | null>(null);

  // State de busca de paciente no card 1
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(21);

  // Lista de pacientes da clínica com suporte a paginação e busca
  const [patients, setPatients] = useState<PatientRecord[]>([
    {
      id: '1',
      name: user?.fullName || 'Bruno Eduardo de Moura Ferreira',
      initials: 'BE',
      email: user?.email || 'brunoemf@gmail.com',
      phone: '19992922054',
      cpf: '218.980.718-29',
      birthDate: '15/04/1988',
      sex: 'Masculino',
      goal: 'Performance & Modulação Metabólica',
      status: 'Ativo',
      lastConsult: '21/11/2026',
      insurancePlan: 'Particular',
      locationName: 'Meu consultório',
      welcomeEmail: true,
      welcomeWhatsapp: true,
    },
    {
      id: '2',
      name: 'Maria Clara Silva de Oliveira',
      initials: 'MO',
      email: 'mariaclara.silva@email.com',
      phone: '(19) 98112-3344',
      cpf: '342.119.808-11',
      birthDate: '22/07/1995',
      sex: 'Feminino',
      goal: 'Emagrecimento & Reeducação Alimentar',
      status: 'Ativo',
      lastConsult: '19/11/2026',
      insurancePlan: 'Bradesco Saúde',
    },
    {
      id: '3',
      name: 'Lucas Gabriel Albuquerque',
      initials: 'LA',
      email: 'lucas.albuquerque@email.com',
      phone: '(11) 97233-4455',
      cpf: '419.002.398-44',
      birthDate: '10/11/1992',
      sex: 'Masculino',
      goal: 'Hipertrofia & Ganho de Massa Magra',
      status: 'Ativo',
      lastConsult: '17/11/2026',
      insurancePlan: 'SulAmérica',
    },
    {
      id: '4',
      name: 'Camila Fernandes Ribeiro',
      initials: 'CR',
      email: 'camila.ribeiro@email.com',
      phone: '(19) 99344-5566',
      cpf: '288.765.432-10',
      birthDate: '05/03/1990',
      sex: 'Feminino',
      goal: 'Manejo de Síndrome Metabólica & Insulina',
      status: 'Ativo',
      lastConsult: '14/11/2026',
      insurancePlan: 'Unimed',
    },
    {
      id: '5',
      name: 'Rodrigo Medeiros Fontes',
      initials: 'RF',
      email: 'rodrigo.fontes@email.com',
      phone: '(19) 99122-8899',
      cpf: '195.443.221-88',
      birthDate: '18/09/1985',
      sex: 'Masculino',
      goal: 'Performance Esportiva & Maratona',
      status: 'Ativo',
      lastConsult: '11/11/2026',
      insurancePlan: 'Particular',
    },
    {
      id: '6',
      name: 'Juliana Beatriz Santos',
      initials: 'JS',
      email: 'juliana.santos@email.com',
      phone: '(19) 98877-6655',
      cpf: '332.665.998-00',
      birthDate: '30/12/1997',
      sex: 'Feminino',
      goal: 'Nutrição na Gestação & Aleitamento',
      status: 'Ativo',
      lastConsult: '08/11/2026',
      insurancePlan: 'Amil',
    },
    {
      id: '7',
      name: 'Felipe Augusto Nogueira',
      initials: 'FN',
      email: 'felipe.nogueira@email.com',
      phone: '(11) 98455-1122',
      cpf: '450.123.789-55',
      birthDate: '12/01/1993',
      sex: 'Masculino',
      goal: 'Controle de Dislipidemia & Esteatose',
      status: 'Ativo',
      lastConsult: '02/11/2026',
      insurancePlan: 'Porto Seguro',
    },
    {
      id: '8',
      name: 'Beatriz Vasconcelos Lima',
      initials: 'BL',
      email: 'beatriz.lima@email.com',
      phone: '(19) 99655-4433',
      cpf: '390.876.543-21',
      birthDate: '25/06/1999',
      sex: 'Feminino',
      goal: 'Saúde Intestinal & Microbiota',
      status: 'Ativo',
      lastConsult: '28/10/2026',
      insurancePlan: 'Particular',
    },
    {
      id: '9',
      name: 'Thiago Henrique Carvalho',
      initials: 'TC',
      email: 'thiago.carvalho@email.com',
      phone: '(19) 98123-9900',
      cpf: '412.334.556-77',
      birthDate: '14/08/1987',
      sex: 'Masculino',
      goal: 'Recuperação Pós-Bariátrica',
      status: 'Inativo',
      lastConsult: '15/09/2026',
      insurancePlan: 'Unimed',
    },
    {
      id: '10',
      name: 'Renata Albuquerque Dias',
      initials: 'RD',
      email: 'renata.dias@email.com',
      phone: '(19) 99888-7711',
      cpf: '277.665.443-99',
      birthDate: '03/04/1994',
      sex: 'Feminino',
      goal: 'Dieta Anti-inflamatória & Autoimune',
      status: 'Ativo',
      lastConsult: '10/10/2026',
      insurancePlan: 'Bradesco Saúde',
    },
  ]);

  // Carrega pacientes reais cadastrados na API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const apiBase = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:4333') + '/api/v1';
        const res = await fetch(`${apiBase}/patients`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const apiPatients: PatientRecord[] = data.map((p: any) => ({
              id: p.id,
              name: p.fullName,
              initials: p.initials || 'PA',
              email: p.email || '',
              phone: p.phone || '',
              cpf: p.cpf || '',
              birthDate: p.birthDate || '',
              sex: p.biologicalSex === 'FEMALE' ? 'Feminino' : 'Masculino',
              goal: p.treatmentGoals || 'Performance & Modulação Metabólica',
              status: p.status === 'ACTIVE' ? 'Ativo' : 'Inativo',
              lastConsult: 'Recente',
              insurancePlan: p.insurancePlan || 'Particular',
            }));

            // Une pacientes da API preservando únicos por id
            setPatients((prev) => {
              const map = new Map<string, PatientRecord>();
              apiPatients.forEach((ap) => map.set(ap.id, ap));
              prev.forEach((pr) => {
                if (!map.has(pr.id)) map.set(pr.id, pr);
              });
              return Array.from(map.values());
            });
          }
        }
      } catch {}
    };
    fetchPatients();
  }, [token]);

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
                    onClick={() => {
                      setSelectedPatientForEdit(patient);
                      setPatientViewMode('edit');
                      if (onNavigateToItem) onNavigateToItem('rotina_pacientes');
                    }}
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
                  onClick={() => {
                    if (onNavigateToItem) onNavigateToItem('rotina_pacientes');
                    setPatientViewMode('grid');
                  }}
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
                  onClick={() => {
                    if (onNavigateToItem) onNavigateToItem('rotina_pacientes');
                    setPatientViewMode('create');
                  }}
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
        <>
          {patientViewMode === 'create' ? (
            <NewPatientView
              mode="create"
              onBackToGrid={() => setPatientViewMode('grid')}
              onPatientCreated={(newP) => {
                const newRecord: PatientRecord = {
                  id: newP.id || String(Date.now()),
                  name: newP.fullName,
                  initials: newP.initials || newP.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'PA',
                  email: newP.email || '',
                  phone: newP.phone || '',
                  cpf: newP.cpf || '',
                  birthDate: newP.birthDate || '',
                  sex: newP.biologicalSex === 'FEMALE' ? 'Feminino' : 'Masculino',
                  assignedSexAtBirth: newP.assignedSexAtBirth,
                  genderIdentity: newP.genderIdentity,
                  goal: newP.treatmentGoals || 'Performance & Modulação Metabólica',
                  status: 'Ativo',
                  lastConsult: 'Hoje',
                  insurancePlan: newP.insurancePlan || 'Particular',
                  locationName: newP.locationName || 'Meu consultório',
                  welcomeEmail: newP.welcomeEmail,
                  welcomeWhatsapp: newP.welcomeWhatsapp,
                };
                setPatients((prev) => [newRecord, ...prev]);
                setPatientViewMode('grid');
              }}
            />
          ) : patientViewMode === 'edit' ? (
            <NewPatientView
              mode="edit"
              initialPatient={selectedPatientForEdit}
              onBackToGrid={() => {
                setSelectedPatientForEdit(null);
                setPatientViewMode('grid');
              }}
              onPatientUpdated={(updatedP) => {
                setPatients((prev) =>
                  prev.map((p) => {
                    if (p.id === updatedP.id || (selectedPatientForEdit && p.id === selectedPatientForEdit.id)) {
                      return {
                        ...p,
                        name: updatedP.fullName || p.name,
                        initials: updatedP.fullName
                          ? updatedP.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                          : p.initials,
                        email: updatedP.email ?? p.email,
                        phone: updatedP.phone ?? p.phone,
                        cpf: updatedP.cpf ?? p.cpf,
                        birthDate: updatedP.birthDate ?? p.birthDate,
                        sex: updatedP.biologicalSex === 'FEMALE' ? 'Feminino' : 'Masculino',
                        assignedSexAtBirth: updatedP.assignedSexAtBirth,
                        genderIdentity: updatedP.genderIdentity,
                        goal: updatedP.treatmentGoals ?? p.goal,
                        insurancePlan: updatedP.insurancePlan ?? p.insurancePlan,
                        locationName: updatedP.locationName ?? p.locationName,
                        welcomeEmail: updatedP.welcomeEmail ?? p.welcomeEmail,
                        welcomeWhatsapp: updatedP.welcomeWhatsapp ?? p.welcomeWhatsapp,
                      };
                    }
                    return p;
                  })
                );
                setSelectedPatientForEdit(null);
                setPatientViewMode('grid');
              }}
            />
          ) : (
            <PatientDirectory
              patients={patients}
              onNewPatient={() => {
                setSelectedPatientForEdit(null);
                setPatientViewMode('create');
              }}
              onEditPatient={(patient) => {
                setSelectedPatientForEdit(patient);
                setPatientViewMode('edit');
              }}
              onDeletePatient={(patientId) => {
                setPatients((prev) => prev.filter((p) => p.id !== patientId));
              }}
              onSelectPatient={(p) => {
                setSelectedPatientForEdit(p);
                setPatientViewMode('edit');
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
