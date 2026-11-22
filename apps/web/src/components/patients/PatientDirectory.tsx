import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Users,
  Smartphone,
  Shield,
  CreditCard,
  Pencil,
  Trash2,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getStoredBranding } from '../../utils/branding';

export interface PatientRecord {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  sex?: string;
  assignedSexAtBirth?: string;
  genderIdentity?: string;
  goal: string;
  status: 'Ativo' | 'Inativo';
  lastConsult: string;
  insurancePlan?: string;
  locationName?: string;
  guardianName?: string;
  guardianCpf?: string;
  welcomeEmail?: boolean;
  welcomeWhatsapp?: boolean;
}

export interface PatientDirectoryProps {
  patients: PatientRecord[];
  onNewPatient: () => void;
  onEditPatient?: (patient: PatientRecord) => void;
  onDeletePatient?: (patientId: string) => void;
  onSelectPatient?: (patient: PatientRecord) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  patients,
  onNewPatient,
  onEditPatient,
  onDeletePatient,
  onSelectPatient,
}) => {
  const { toast } = useToast();
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // KPI Calculations
  const totalCount = patients.length;
  const connectedAppCount = patients.filter((p) => p.welcomeEmail || p.welcomeWhatsapp || p.status === 'Ativo').length;
  const withInsuranceCount = patients.filter(
    (p) => p.insurancePlan && p.insurancePlan !== 'Particular' && p.insurancePlan !== '',
  ).length;
  const privateCount = patients.filter(
    (p) => !p.insurancePlan || p.insurancePlan === 'Particular',
  ).length;

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const s = searchTerm.toLowerCase();
      const matchSearch =
        !s ||
        p.name.toLowerCase().includes(s) ||
        p.email.toLowerCase().includes(s) ||
        (p.cpf && p.cpf.toLowerCase().includes(s)) ||
        p.phone.toLowerCase().includes(s);

      let matchFilter = true;
      if (filterType === 'ATIVO') {
        matchFilter = p.status === 'Ativo';
      } else if (filterType === 'CONVENIO') {
        matchFilter = !!p.insurancePlan && p.insurancePlan !== 'Particular';
      } else if (filterType === 'PARTICULAR') {
        matchFilter = !p.insurancePlan || p.insurancePlan === 'Particular';
      } else if (filterType === 'APP_ATIVO') {
        matchFilter = p.welcomeEmail || p.welcomeWhatsapp || p.status === 'Ativo';
      }

      return matchSearch && matchFilter;
    });
  }, [patients, searchTerm, filterType]);

  // Paginated patients
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  const handlePatientClick = (patient: PatientRecord) => {
    if (onEditPatient) {
      onEditPatient(patient);
    } else if (onSelectPatient) {
      onSelectPatient(patient);
    }
  };

  const handleDelete = (e: React.MouseEvent, patient: PatientRecord) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja remover o paciente ${patient.name}?`)) {
      if (onDeletePatient) {
        onDeletePatient(patient.id);
      }
      toast.success(`Paciente ${patient.name} removido.`);
    }
  };

  const clinicLabel = branding.clinicName || 'Ygeía';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ========================================================
          1. TOPO: BADGE + TÍTULO + BOTÃO NOVO PACIENTE
         ======================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          {/* Badge ROTINA CLÍNICA */}
          <div
            style={{
              display: 'inline-block',
              fontSize: '0.6875rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: '#059669',
              backgroundColor: '#ecfdf5',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              marginBottom: '0.35rem',
              textTransform: 'uppercase',
            }}
          >
            ROTINA CLÍNICA
          </div>

          {/* Título Principal */}
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 0.2rem 0',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            Pacientes
          </h1>

          {/* Subtítulo orientativo */}
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, fontWeight: 400 }}>
            Gestão completa de pacientes, convênios e credenciais do aplicativo {clinicLabel}.
          </p>
        </div>

        {/* Botão + Novo paciente */}
        <button
          type="button"
          onClick={onNewPatient}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.625rem 1.15rem',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.28)',
            transition: 'background-color 0.15s ease, transform 0.1s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#047857')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#059669')}
        >
          <UserPlus size={16} />
          <span>Novo paciente</span>
        </button>
      </div>

      {/* ========================================================
          2. CARDS DE RESUMO KPI (4 COLUNAS IDÊNTICAS AO MOCKUP)
         ======================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Card 1: Total Pacientes */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '105px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              Total Pacientes
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '0.5rem',
                backgroundColor: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
              {totalCount}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>
              Cadastros ativos
            </div>
          </div>
        </div>

        {/* Card 2: App Conectado */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '105px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              App Conectado
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '0.5rem',
                backgroundColor: '#eff6ff',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Smartphone size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
              {connectedAppCount}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>
              Usuários criados
            </div>
          </div>
        </div>

        {/* Card 3: Com Convênio */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '105px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              Com Convênio
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '0.5rem',
                backgroundColor: '#faf5ff',
                color: '#a855f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
              {withInsuranceCount}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>
              Repasses vinculados
            </div>
          </div>
        </div>

        {/* Card 4: Particulares */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '1.1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '105px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              Particulares
            </span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '0.5rem',
                backgroundColor: '#fffbeb',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={16} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15 }}>
              {privateCount}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.2rem', fontWeight: 500 }}>
              Atendimento direto
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. BARRA DE BUSCA & FILTRO (CARD BRANCO INDEPENDENTE)
         ======================================================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Campo de Busca Livre */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            flex: 1,
            minWidth: '280px',
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Buscar paciente por nome, CPF, e-mail ou telefone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.8125rem',
              color: '#0f172a',
              fontFamily: 'inherit',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* Dropdown de Filtro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>
            Filtrar:
          </label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#334155',
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <option value="ALL">Todos os Pacientes</option>
            <option value="ATIVO">Cadastros Ativos</option>
            <option value="CONVENIO">Com Convênio</option>
            <option value="PARTICULAR">Particulares</option>
            <option value="APP_ATIVO">App Ativo</option>
          </select>
        </div>
      </div>

      {/* ========================================================
          4. TABELA DE PACIENTES (GRID COM SCROLL E DESIGN EXATO)
         ======================================================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: '#ffffff',
                }}
              >
                <th
                  style={{
                    padding: '0.875rem 1.25rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  PACIENTE
                </th>
                <th
                  style={{
                    padding: '0.875rem 1rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  CONTATO
                </th>
                <th
                  style={{
                    padding: '0.875rem 1rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  CPF
                </th>
                <th
                  style={{
                    padding: '0.875rem 1rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  CONVÊNIO
                </th>
                <th
                  style={{
                    padding: '0.875rem 1rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  ACESSO APP
                </th>
                <th
                  style={{
                    padding: '0.875rem 1.25rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    textAlign: 'right',
                  }}
                >
                  AÇÕES
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                      Nenhum paciente localizado
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Ajuste os filtros de pesquisa ou cadastre um novo paciente.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => {
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => handlePatientClick(patient)}
                      title="Clique para editar este paciente"
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background-color 0.12s ease',
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                      onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
                    >
                      {/* Coluna 1: PACIENTE (Avatar + Nome + Consultório) */}
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#d1fae5',
                              color: '#065f46',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {patient.initials || 'PA'}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: '0.84375rem',
                                fontWeight: 700,
                                color: '#0f172a',
                                lineHeight: 1.2,
                              }}
                            >
                              {patient.name}
                            </div>
                            <div
                              style={{
                                fontSize: '0.6875rem',
                                color: '#94a3b8',
                                marginTop: '0.15rem',
                                fontWeight: 400,
                              }}
                            >
                              {patient.locationName || 'Meu consultório'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Coluna 2: CONTATO (E-mail + Telefone) */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#475569' }}>
                            <Mail size={12} color="#94a3b8" />
                            <span>{patient.email || 'Não informado'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#475569' }}>
                            <Phone size={12} color="#94a3b8" />
                            <span>{patient.phone || 'Não informado'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Coluna 3: CPF */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{ fontSize: '0.78125rem', color: '#334155', fontWeight: 500 }}>
                          {patient.cpf || '—'}
                        </span>
                      </td>

                      {/* Coluna 4: CONVÊNIO */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            borderRadius: '9999px',
                            padding: '0.2rem 0.65rem',
                          }}
                        >
                          {patient.insurancePlan || 'Particular'}
                        </span>
                      </td>

                      {/* Coluna 5: ACESSO APP */}
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#059669',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            borderRadius: '9999px',
                            padding: '0.2rem 0.65rem',
                          }}
                        >
                          <CheckCircle2 size={12} color="#059669" />
                          <span>App Ativo</span>
                        </span>
                      </td>

                      {/* Coluna 6: AÇÕES (Lápis de edição + Lixeira) */}
                      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '0.65rem',
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePatientClick(patient);
                            }}
                            title="Editar paciente"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = '#059669')}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, patient)}
                            title="Remover paciente"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ========================================================
            5. RODAPÉ DA TABELA: PAGINAÇÃO EXATA
           ======================================================== */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Lado Esquerdo: Exibindo X-Y de Z registros + Itens por página */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Exibindo {filteredPatients.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredPatients.length)} de {filteredPatients.length} registros
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Itens por página:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  color: '#334155',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Lado Direito: Navegação de Páginas (<<, <, 1, 2, >, >>) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
              title="Primeira página"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.3rem',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                color: currentPage <= 1 ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronsLeft size={15} />
            </button>

            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              title="Página anterior"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.3rem',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                color: currentPage <= 1 ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '0.375rem',
                    backgroundColor: isActive ? primaryColor : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              title="Próxima página"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.3rem',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                color: currentPage >= totalPages ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronRight size={15} />
            </button>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title="Última página"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.3rem',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                color: currentPage >= totalPages ? '#cbd5e1' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
