import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Eye,
  Edit2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SettingsModule } from '../settings/SettingsModule';
import { NewPatientView } from '../patients/NewPatientView';
import { PatientDirectory, PatientRecord } from '../patients/PatientDirectory';
import { PatientProfileView } from '../patients/PatientProfileView';
import { getStoredBranding } from '../../utils/branding';
import { AppCard, AppButton, AppInput, AppBadge } from '../ui';
import { MifflinStJeorStrategy, HarrisBenedictStrategy } from '@ygeia/domain-core';

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

  // Modo de visualização na tela de Pacientes: 'grid' (Tabela Paginada), 'create' (Novo), 'edit' (Edição) ou 'view' (Prontuário/Perfil)
  const [patientViewMode, setPatientViewMode] = useState<'grid' | 'create' | 'edit' | 'view'>('grid');
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<PatientRecord | null>(null);
  const [selectedPatientForView, setSelectedPatientForView] = useState<PatientRecord | null>(null);

  // State de busca de paciente no card 1
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState(21);

  // Bioenergética & TMB Calculation State
  const [tmbWeight, setTmbWeight] = useState(78);
  const [tmbHeight, setTmbHeight] = useState(178);
  const [tmbAge, setTmbAge] = useState(32);
  const [tmbSex, setTmbSex] = useState<'MALE' | 'FEMALE'>('MALE');
  const [tmbFormula, setTmbFormula] = useState<'mifflin' | 'harris'>('mifflin');
  const [tmbActivity, setTmbActivity] = useState(1.55);
  const [tmbGoal, setTmbGoal] = useState<'deficit' | 'maintenance' | 'surplus'>('deficit');

  // Bioenergética Calculation using @ygeia/domain-core strategies
  const mifflinCalc = new MifflinStJeorStrategy();
  const harrisCalc = new HarrisBenedictStrategy();
  const activeStrategy = tmbFormula === 'mifflin' ? mifflinCalc : harrisCalc;
  const calculatedTmb = activeStrategy.calculate({
    weightKg: tmbWeight,
    heightCm: tmbHeight,
    ageYears: tmbAge,
    gender: tmbSex,
  });
  const calculatedGet = Math.round(calculatedTmb * tmbActivity);
  const targetCalories =
    tmbGoal === 'deficit'
      ? Math.round(calculatedGet - 500)
      : tmbGoal === 'surplus'
      ? Math.round(calculatedGet + 350)
      : calculatedGet;

  // TACO Foods Search State
  const [tacoSearch, setTacoSearch] = useState('');
  const [tacoCategory, setTacoCategory] = useState('ALL');

  // Workout Split State
  const [activeWorkoutSplit, setActiveWorkoutSplit] = useState('A');

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
        padding: '1rem 1.25rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        width: '100%',
        boxSizing: 'border-box',
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
                      padding: '0.65rem 0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      border: '1px solid transparent',
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                      (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9';
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                    }}
                    onClick={() => {
                      setSelectedPatientForView(patient);
                      setPatientViewMode('view');
                      if (onNavigateToItem) onNavigateToItem('cadastros_pacientes');
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

                    {/* Ações Rápidas: Olhinho de Visualização e Lápis de Edição */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientForView(patient);
                          setPatientViewMode('view');
                          if (onNavigateToItem) onNavigateToItem('cadastros_pacientes');
                        }}
                        title="Visualizar anamnese e prontuário"
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          padding: '0.35rem',
                          color: '#64748b',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-light)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-border)';
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                          (e.currentTarget as HTMLElement).style.color = '#64748b';
                          (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                        }}
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientForEdit(patient);
                          setPatientViewMode('edit');
                          if (onNavigateToItem) onNavigateToItem('cadastros_pacientes');
                        }}
                        title="Editar cadastro do paciente"
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          padding: '0.35rem',
                          color: '#64748b',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                          (e.currentTarget as HTMLElement).style.color = '#0f172a';
                        }}
                        onMouseOut={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                          (e.currentTarget as HTMLElement).style.color = '#64748b';
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
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
                    if (onNavigateToItem) onNavigateToItem('cadastros_pacientes');
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
                    if (onNavigateToItem) onNavigateToItem('cadastros_pacientes');
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
                          background: isSelected ? 'var(--primary-light)' : 'transparent',
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

      {/* ========================================================
          VIEW: PACIENTES (ROTINA & CADASTROS)
         ======================================================== */}
      {(activeItem === 'rotina_pacientes' || activeItem === 'cadastros_pacientes') && (
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
                  sex: newP.gender || 'Não informado',
                  gender: newP.gender,
                  goal: newP.protocolNotes || 'Emagrecimento Saudável',
                  status: 'Ativo',
                  lastConsult: 'Hoje',
                  insurancePlan: newP.insurancePlan || 'Sem convênio',
                  attendanceLocation: newP.attendanceLocation || 'Consultório Principal (Matriz)',
                  photoUrl: newP.photoUrl,
                  guardianName: newP.guardianName,
                  guardianCpf: newP.guardianCpf,
                  objective: newP.objective || newP.goal,
                  tags: newP.tags || [],
                  pathologies: newP.pathologies || [],
                  treatmentProtocols: newP.treatmentProtocols,
                  protocolNotes: newP.protocolNotes,
                  insuranceCardNumber: newP.insuranceCardNumber,
                  insuranceRepassAmount: newP.insuranceRepassAmount,
                  address: newP.address,
                  notes: newP.notes,
                  sendWelcomeEmail: newP.sendWelcomeEmail,
                  sendWelcomeWhatsapp: newP.sendWelcomeWhatsapp,
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
                        sex: updatedP.gender ?? p.sex,
                        gender: updatedP.gender ?? p.gender,
                        goal: updatedP.protocolNotes ?? p.goal,
                        insurancePlan: updatedP.insurancePlan ?? p.insurancePlan,
                        attendanceLocation: updatedP.attendanceLocation ?? p.attendanceLocation,
                        photoUrl: updatedP.photoUrl ?? p.photoUrl,
                        guardianName: updatedP.guardianName ?? p.guardianName,
                        guardianCpf: updatedP.guardianCpf ?? p.guardianCpf,
                        objective: updatedP.objective ?? p.objective,
                        tags: updatedP.tags ?? p.tags,
                        pathologies: updatedP.pathologies ?? p.pathologies,
                        treatmentProtocols: updatedP.treatmentProtocols ?? p.treatmentProtocols,
                        protocolNotes: updatedP.protocolNotes ?? p.protocolNotes,
                        insuranceCardNumber: updatedP.insuranceCardNumber ?? p.insuranceCardNumber,
                        insuranceRepassAmount: updatedP.insuranceRepassAmount ?? p.insuranceRepassAmount,
                        address: updatedP.address ?? p.address,
                        notes: updatedP.notes ?? p.notes,
                        sendWelcomeEmail: updatedP.sendWelcomeEmail ?? p.sendWelcomeEmail,
                        sendWelcomeWhatsapp: updatedP.sendWelcomeWhatsapp ?? p.sendWelcomeWhatsapp,
                      };
                    }
                    return p;
                  })
                );
                setSelectedPatientForEdit(null);
                setPatientViewMode('grid');
              }}
            />
          ) : patientViewMode === 'view' && selectedPatientForView ? (
            <PatientProfileView
              key={selectedPatientForView.id}
              patient={selectedPatientForView}
              onBack={() => {
                setSelectedPatientForView(null);
                setPatientViewMode('grid');
              }}
              onEdit={(p) => {
                setSelectedPatientForEdit(p);
                setPatientViewMode('edit');
              }}
              onDelete={(id) => {
                setPatients((prev) => prev.filter((p) => p.id !== id));
                setSelectedPatientForView(null);
                setPatientViewMode('grid');
              }}
            />
          ) : (
            <PatientDirectory
              patients={patients}
              onNewPatient={() => {
                setSelectedPatientForEdit(null);
                setSelectedPatientForView(null);
                setPatientViewMode('create');
              }}
              onEditPatient={(patient) => {
                setSelectedPatientForEdit(patient);
                setPatientViewMode('edit');
              }}
              onViewPatient={(patient) => {
                setSelectedPatientForView(patient);
                setPatientViewMode('view');
              }}
              onDeletePatient={(patientId) => {
                setPatients((prev) => prev.filter((p) => p.id !== patientId));
              }}
              onSelectPatient={(p) => {
                setSelectedPatientForView(p);
                setPatientViewMode('view');
              }}
            />
          )}
        </>
      )}

      {/* ========================================================
          CADASTROS: ALIMENTOS & TABELA TACO
         ======================================================== */}
      {activeItem === 'cadastros_alimentos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              🥗 Banco de Alimentos & Tabela TACO (UNICAMP)
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Base de dados nacional de composição centesimal por 100g para montagem de planos alimentares de precisão.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <AppInput
                placeholder="Buscar por alimento (ex: Arroz, Frango, Aveia, Ovo)..."
                value={tacoSearch}
                onChange={(e) => setTacoSearch(e.target.value)}
              />
            </div>
            <select
              value={tacoCategory}
              onChange={(e) => setTacoCategory(e.target.value)}
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                padding: '0.5rem 0.875rem',
                fontSize: '0.8125rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            >
              <option value="ALL">Todas as Categorias</option>
              <option value="CEREAIS">Cereais & Derivados</option>
              <option value="CARNES">Carnes & Ovos</option>
              <option value="FRUTAS">Frutas & Polpas</option>
              <option value="LATICINIOS">Leites & Laticínios</option>
              <option value="LEGUMINOSAS">Leguminosas</option>
            </select>
          </div>

          <AppCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Alimento (100g)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Energia</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Proteínas</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Carboidratos</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Lipídios</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Fibras</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Arroz, integral, cozido', kcal: 124, ptn: 2.6, cho: 25.8, lip: 1.0, fib: 2.7, cat: 'Cereais' },
                    { name: 'Peito de frango, sem pele, grelhado', kcal: 159, ptn: 32.0, cho: 0.0, lip: 2.5, fib: 0.0, cat: 'Carnes' },
                    { name: 'Aveia, flocos, crua', kcal: 394, ptn: 13.9, cho: 66.6, lip: 8.5, fib: 9.1, cat: 'Cereais' },
                    { name: 'Ovo, de galinha, inteiro, cozido', kcal: 146, ptn: 13.3, cho: 0.6, lip: 9.5, fib: 0.0, cat: 'Carnes' },
                    { name: 'Banana, prata, crua', kcal: 98, ptn: 1.3, cho: 26.0, lip: 0.1, fib: 2.0, cat: 'Frutas' },
                    { name: 'Feijão, carioca, cozido', kcal: 76, ptn: 4.8, cho: 13.6, lip: 0.5, fib: 8.5, cat: 'Leguminosas' },
                  ]
                    .filter((item) => !tacoSearch || item.name.toLowerCase().includes(tacoSearch.toLowerCase()))
                    .map((food, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                          <div>{food.name}</div>
                          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>{food.cat}</span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {food.kcal} kcal
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{food.ptn} g</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{food.cho} g</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{food.lip} g</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{food.fib} g</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </AppCard>
        </div>
      )}

      {/* ========================================================
          CADASTROS: SUPLEMENTOS & FITOTERÁPICOS
         ======================================================== */}
      {activeItem === 'cadastros_suplementos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              💊 Catálogo de Suplementos & Fitoterápicos
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Formulário de suplementação com posologia recomendada e evidências científicas grau A.
            </p>
          </div>

          <div className="ygeia-grid-1-3">
            {[
              {
                title: 'Creatina Monoidratada',
                dose: '3g a 5g ao dia (uso crônico)',
                purpose: 'Ressíntese rápida de ATP e hidratação intracelular',
                tag: 'Evidência A',
              },
              {
                title: 'Whey Protein Isolado (WPI 90%)',
                dose: '30g pós-treino ou lanches',
                purpose: 'Síntese proteica muscular (MPS) e aporte de Leucina',
                tag: 'Evidência A',
              },
              {
                title: 'Ômega-3 Ultra DHA + EPA',
                dose: '2g a 3g / dia com refeição gordurosa',
                purpose: 'Modulação de eicosanoides e sensibilidade insulínica',
                tag: 'Anti-inflamatório',
              },
              {
                title: 'Vitamina D3 + K2 (MK-7)',
                dose: '2.000 a 5.000 UI / dia',
                purpose: 'Saúde óssea, modulação imune e otimização hormonal',
                tag: 'Micronutriente',
              },
              {
                title: 'Magnésio Bisglicinato + Inositol',
                dose: '300mg de magnésio elementar à noite',
                purpose: 'Relaxamento neuromuscular e qualidade de sono REM',
                tag: 'Neuroproteção',
              },
              {
                title: 'Coenzima Q10 (Ubiquinona)',
                dose: '100mg a 200mg pela manhã',
                purpose: 'Fosforilação oxidativa mitocondrial e ação antioxidante',
                tag: 'Bioenergética',
              },
            ].map((sup, idx) => (
              <AppCard key={idx} variant="default">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {sup.title}
                  </h3>
                  <AppBadge variant="info">{sup.tag}</AppBadge>
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                  {sup.dose}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                  {sup.purpose}
                </p>
              </AppCard>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          CADASTROS: MODELOS & LOCAIS
         ======================================================== */}
      {activeItem === 'cadastros_modelos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              📋 Modelos Clínicos de Prescrição
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Modelos de dietas e protocolos prontos para aplicação rápida em consultas.
            </p>
          </div>

          <div className="ygeia-grid-1-2">
            {[
              { title: 'Hipertrofia Limpa (Clean Bulk)', kcal: '2.800 kcal', ptn: '2.2 g/kg', focus: 'Ganho com acúmulo mínimo de gordura' },
              { title: 'Emagrecimento com Preservação de Massa Magra', kcal: '1.750 kcal', ptn: '2.0 g/kg', focus: 'Déficit calórico de 500 kcal com alta saciedade' },
              { title: 'Modulação Intestinal & Dieta Low FODMAPs', kcal: '2.000 kcal', ptn: '1.8 g/kg', focus: 'Alívio de sintomas de SII e redução de estufamento' },
              { title: 'Dieta Mediterrânea Cardioprotetora', kcal: '2.200 kcal', ptn: '1.6 g/kg', focus: 'Rica em MUFAs, PUFAs, polifenóis e fibras solúveis' },
            ].map((model, idx) => (
              <AppCard key={idx} variant="default">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  {model.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <AppBadge variant="success">{model.kcal}</AppBadge>
                  <AppBadge variant="neutral">{model.ptn}</AppBadge>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  {model.focus}
                </p>
              </AppCard>
            ))}
          </div>
        </div>
      )}

      {activeItem === 'cadastros_locais' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              📍 Locais de Atendimento Clínico
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Unidades físicas e canais remotos habilitados para agendamentos.
            </p>
          </div>

          <div className="ygeia-grid-1-2">
            {[
              { name: 'Consultório Principal (Matriz)', address: 'Rua Doutor Jeber Juabre, nº 145, Campinas - SP', type: 'Presencial', active: true },
              { name: 'Atendimento Telemedicina / Remoto', address: 'Plataforma Segura Ygeía Meet (CFN 659)', type: 'Online', active: true },
              { name: 'Clínica Integrada Jardins', address: 'Alameda Santos, 1200 - São Paulo - SP', type: 'Presencial', active: true },
            ].map((loc, idx) => (
              <AppCard key={idx} variant="default">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {loc.name}
                  </h3>
                  <AppBadge variant="success">Ativo</AppBadge>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {loc.type}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
                  {loc.address}
                </p>
              </AppCard>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          NUTRIÇÃO: CÁLCULO TMB & GET (INTERATIVO COM @YGEIA/DOMAIN-CORE)
         ======================================================== */}
      {activeItem === 'nutricao_tmb' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              🔥 Cálculo Bioenergético: TMB & GET
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Taxa Metabólica Basal e Gasto Energético Total calculados em tempo real com validação científica.
            </p>
          </div>

          <div className="ygeia-grid-1-2">
            {/* Bloco 1: Parâmetros Biométricos */}
            <AppCard variant="default">
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                Dados Biométricos do Paciente
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="ygeia-grid-1-2">
                  <AppInput
                    label="Peso Atual (kg)"
                    type="number"
                    value={tmbWeight}
                    onChange={(e) => setTmbWeight(Number(e.target.value) || 0)}
                  />
                  <AppInput
                    label="Altura (cm)"
                    type="number"
                    value={tmbHeight}
                    onChange={(e) => setTmbHeight(Number(e.target.value) || 0)}
                  />
                </div>

                <div className="ygeia-grid-1-2">
                  <AppInput
                    label="Idade (anos)"
                    type="number"
                    value={tmbAge}
                    onChange={(e) => setTmbAge(Number(e.target.value) || 0)}
                  />
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Sexo Biológico
                    </label>
                    <select
                      value={tmbSex}
                      onChange={(e) => setTmbSex(e.target.value as 'MALE' | 'FEMALE')}
                      style={{
                        width: '100%',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <option value="MALE">Masculino</option>
                      <option value="FEMALE">Feminino</option>
                    </select>
                  </div>
                </div>

                <div className="ygeia-grid-1-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Fórmula Padrão
                    </label>
                    <select
                      value={tmbFormula}
                      onChange={(e) => setTmbFormula(e.target.value as 'mifflin' | 'harris')}
                      style={{
                        width: '100%',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <option value="mifflin">Mifflin-St Jeor (1990) - Recomendada</option>
                      <option value="harris">Harris-Benedict (1984)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Nível de Atividade Física
                    </label>
                    <select
                      value={tmbActivity}
                      onChange={(e) => setTmbActivity(Number(e.target.value))}
                      style={{
                        width: '100%',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.8125rem',
                      }}
                    >
                      <option value="1.2">Sedentário (1.20)</option>
                      <option value="1.375">Levemente Ativo (1.375)</option>
                      <option value="1.55">Moderadamente Ativo (1.55)</option>
                      <option value="1.725">Muito Ativo (1.725)</option>
                      <option value="1.9">Extremamente Ativo (1.90)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                    Objetivo Clínico
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {[
                      { id: 'deficit', label: 'Déficit Calórico (-500 kcal)' },
                      { id: 'maintenance', label: 'Manutenção do Peso' },
                      { id: 'surplus', label: 'Superávit Calórico (+350 kcal)' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setTmbGoal(g.id as any)}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: tmbGoal === g.id ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                          backgroundColor: tmbGoal === g.id ? 'var(--primary-light)' : '#ffffff',
                          color: tmbGoal === g.id ? 'var(--primary)' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </AppCard>

            {/* Bloco 2: Resultados Bioenergéticos Calculados */}
            <AppCard variant="default" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                  Resultados Bioenergéticos em Tempo Real
                </div>

                <div className="ygeia-grid-1-3" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b' }}>TMB BASAL</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                      {calculatedTmb}
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>kcal / dia</span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b' }}>GET TOTAL</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                      {calculatedGet}
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>kcal / dia</span>
                  </div>

                  <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid var(--primary-border)' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)' }}>CALORIAS META</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                      {targetCalories}
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--primary)' }}>kcal / dia</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Distribuição Sugerida de Macronutrientes (CFN / ISSN)
                  </div>
                  <div className="ygeia-grid-1-3">
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Proteínas (2.0 g/kg)</span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        {Math.round(tmbWeight * 2.0)}g ({Math.round(tmbWeight * 2.0 * 4)} kcal)
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Lipídios (0.9 g/kg)</span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        {Math.round(tmbWeight * 0.9)}g ({Math.round(tmbWeight * 0.9 * 9)} kcal)
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Carboidratos (Saldo)</span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        {Math.max(0, Math.round((targetCalories - (tmbWeight * 2.0 * 4 + tmbWeight * 0.9 * 9)) / 4))}g
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <AppButton
                  variant="primary"
                  fullWidth
                  onClick={() => toast.success('Cálculo bioenergético salvo no prontuário do paciente!')}
                >
                  Salvar Prescrição Calórica
                </AppButton>
              </div>
            </AppCard>
          </div>
        </div>
      )}

      {/* ========================================================
          NUTRIÇÃO: CARDÁPIO, ANTROPOMETRIA & EXAMES
         ======================================================== */}
      {activeItem === 'nutricao_cardapio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              🍎 Planejador de Cardápios & Fracionamento
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Montagem de refeições com cálculo nutricional dinâmico e opções de substituição equivalentes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { meal: 'Café da Manhã (07:30)', items: 'Ovos mexidos (3 un) + Pão 100% integral (2 fatias) + Café preto sem açúcar + Mamão papaia (100g)', kcal: 450 },
              { meal: 'Almoço (12:30)', items: 'Arroz integral (150g) + Feijão preto (100g) + Peito de frango grelhado (180g) + Azeite extravirgem (10ml) + Salada crua à vontade', kcal: 680 },
              { meal: 'Lanche da Tarde (16:30)', items: 'Whey Protein Isolado (30g) + Aveia em flocos (40g) + Banana prata (1 un) + Pasta de amendoim integral (15g)', kcal: 420 },
              { meal: 'Jantar (20:00)', items: 'Batata doce cozida (150g) + Patinho moído magro (160g) + Brócolis e cenoura no vapor', kcal: 520 },
            ].map((m, idx) => (
              <AppCard key={idx} variant="default">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {m.meal}
                  </h3>
                  <AppBadge variant="success">{m.kcal} kcal</AppBadge>
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>
                  {m.items}
                </p>
              </AppCard>
            ))}
          </div>
        </div>
      )}

      {activeItem === 'nutricao_antropometria' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              📏 Avaliação Antropométrica & Pregas Cutâneas
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Protocolos de Pollock 7 dobras, 3 dobras, Faulkner, circunferências e Relação Cintura-Quadril (RCQ).
            </p>
          </div>

          <div className="ygeia-grid-1-3">
            <AppCard variant="default">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Composição Corporal
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>% Gordura (Pollock 7):</span>
                  <strong style={{ color: 'var(--primary)' }}>13.4%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Massa Magra:</span>
                  <strong style={{ color: '#0f172a' }}>67.5 kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Massa Gorda:</span>
                  <strong style={{ color: '#0f172a' }}>10.5 kg</strong>
                </div>
              </div>
            </AppCard>

            <AppCard variant="default">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Circunferências (cm)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Cintura:</span>
                  <strong>81.0 cm</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Quadril:</span>
                  <strong>98.5 cm</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Relação Cintura-Quadril:</span>
                  <strong style={{ color: 'var(--primary)' }}>0.82 (Baixo Risco)</strong>
                </div>
              </div>
            </AppCard>

            <AppCard variant="default">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                Pregas Cutâneas (mm)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Subescapular / Tríceps:</span>
                  <strong>11mm / 9mm</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Suprailíaca / Abdominal:</span>
                  <strong>12mm / 14mm</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Coxa / Peitoral:</span>
                  <strong>10mm / 7mm</strong>
                </div>
              </div>
            </AppCard>
          </div>
        </div>
      )}

      {activeItem === 'nutricao_exames' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              🔬 Exames Laboratoriais & Prontuário AES-256
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Acompanhamento de biomarcadores sanguíneos com faixas de referência clínica otimizadas.
            </p>
          </div>

          <AppCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Biomarcador</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Último Valor</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Faixa de Referência</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { exam: 'Glicemia de Jejum', val: '86 mg/dL', ref: '70 - 99 mg/dL', status: 'Excelente' },
                    { exam: 'Hemoglobina Glicada (HbA1c)', val: '5.1 %', ref: '< 5.7 %', status: 'Excelente' },
                    { exam: 'HDL Colesterol', val: '58 mg/dL', ref: '> 40 mg/dL', status: 'Ótimo' },
                    { exam: 'Triglicerídeos', val: '82 mg/dL', ref: '< 150 mg/dL', status: 'Excelente' },
                    { exam: 'Vitamina D (25-OH)', val: '44 ng/mL', ref: '30 - 60 ng/mL', status: 'Suficiente' },
                    { exam: 'Ferritina Sérica', val: '145 ng/mL', ref: '30 - 300 ng/mL', status: 'Equilibrado' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{row.exam}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{row.val}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{row.ref}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <AppBadge variant="success">{row.status}</AppBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AppCard>
        </div>
      )}

      {/* ========================================================
          TREINAMENTO: PRESCRIÇÃO, EXERCÍCIOS, DIVISÃO & VOLUME
         ======================================================== */}
      {(activeItem.startsWith('treino_') || activeItem === 'treino_modulo') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              🏋️ Módulo de Treinamento & Prescrição
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
              Divisão semanal ABCD, bi-sets, cadência, sobrecarga progressiva e volume semanal de séries.
            </p>
          </div>

          {/* Seletor de Divisão Semanal */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'A', label: 'Treino A: Peito, Deltóide Anterior & Tríceps' },
              { id: 'B', label: 'Treino B: Dorsal, Deltóide Posterior & Bíceps' },
              { id: 'C', label: 'Treino C: Quadríceps, Glúteos & Panturrilhas' },
              { id: 'D', label: 'Treino D: Ombros Completo, Abdômen & Posterior' },
            ].map((split) => (
              <button
                key={split.id}
                type="button"
                onClick={() => setActiveWorkoutSplit(split.id)}
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: '0.5rem',
                  border: activeWorkoutSplit === split.id ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                  backgroundColor: activeWorkoutSplit === split.id ? 'var(--primary-light)' : '#ffffff',
                  color: activeWorkoutSplit === split.id ? 'var(--primary)' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {split.label}
              </button>
            ))}
          </div>

          {/* Exercícios da Ficha */}
          <AppCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Ordem</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Exercício</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Séries x Reps</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Descanso</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Método / Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { order: '1', name: 'Supino Reto com Barra', sets: '4 x 8 a 10', rest: '90s', note: 'Sobrecarga progressiva, cadência 2-0-2' },
                    { order: '2', name: 'Supino Inclinado com Halteres', sets: '3 x 10 a 12', rest: '75s', note: 'Banco a 30 graus, ênfase clavicular' },
                    { order: '3 (Bi-set)', name: 'Crucifixo Máquina + Flexão Solo', sets: '3 x 12 + falha', rest: '60s', note: 'Bi-set agonista sem descanso intermediário' },
                    { order: '4', name: 'Desenvolvimento Militar com Halteres', sets: '4 x 10', rest: '75s', note: 'Escápulas estáveis' },
                    { order: '5', name: 'Tríceps Corda na Polia', sets: '4 x 12 a 15', rest: '45s', note: 'Pico de contração de 1 segundo' },
                  ].map((ex, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{ex.order}</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{ex.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#334155' }}>{ex.sets}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{ex.rest}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{ex.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AppCard>
        </div>
      )}

      {/* ========================================================
          OUTROS ITENS (Daily, Acompanhamentos, Chat, Tarefas, etc.)
         ======================================================== */}
      {activeItem === 'rotina_daily' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            ☀️ Daily & Atividades do Dia
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Fluxo diário de atendimentos, confirmação de presença e retorno de exames.
          </p>
        </AppCard>
      )}

      {activeItem === 'rotina_acompanhamentos' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            📈 Acompanhamentos Clínicos & Linha do Tempo
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Evolução de peso, bioimpedância e aderência nutricional ao longo dos meses.
          </p>
        </AppCard>
      )}

      {activeItem === 'rotina_chat' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            💬 Chat com Pacientes (Canal Direto)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Comunicação criptografada para esclarecimento de dúvidas e ajustes no plano alimentar.
          </p>
        </AppCard>
      )}

      {activeItem === 'rotina_tarefas' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            ✅ Tarefas Clínicas Pendentes
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Prontuários para finalizar, exames para laudar e prescrições em aberto.
          </p>
        </AppCard>
      )}

      {activeItem === 'atendimento_pre' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            📝 Formulário Pré-Consulta (Anamnese Prévia)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Questionário prévio enviado via WhatsApp/e-mail para coleta de histórico de hábitos antes da consulta.
          </p>
        </AppCard>
      )}

      {activeItem === 'atendimento_pos' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            📄 Formulário Pós-Consulta (Check-in de Adesão)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Acompanhamento de digestão, energia, adesão calórica e dúvidas nos primeiros 15 dias.
          </p>
        </AppCard>
      )}

      {activeItem === 'gestao_contas' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            💳 Gestão Financeira & Convênios
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Controle de honorários, repasses de convênios médicos e faturamento do consultório.
          </p>
        </AppCard>
      )}

      {activeItem === 'clube_vantagens' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            ✨ Clube de Vantagens & Parcerias
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Cupons exclusivos em farmácias de manipulação, lojas de suplementos e exames.
          </p>
        </AppCard>
      )}

      {activeItem === 'minha_conta' && (
        <AppCard variant="default">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            👤 Minha Conta Admin
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Informações do plano contratado, assinatura e segurança da conta.
          </p>
        </AppCard>
      )}
    </div>
  );
};
