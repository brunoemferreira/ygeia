import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Smartphone,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Building,
  Phone,
  Mail,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getStoredBranding } from '../../utils/branding';
import { DataTablePagination } from '../ui/DataTablePagination';

export interface PatientRecord {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  sex?: string;
  gender?: string;
  goal?: string;
  status?: 'Ativo' | 'Inativo';
  lastConsult?: string;
  insurancePlan?: string;
  attendanceLocation?: string;
  locationName?: string;
  photoUrl?: string;
  hasUserAccount?: boolean;
  guardianName?: string;
  guardianCpf?: string;
  treatmentProtocols?: string[];
  protocolNotes?: string;
  insuranceCardNumber?: string;
  insuranceRepassAmount?: string;
  address?: {
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  notes?: string;
  sendWelcomeEmail?: boolean;
  sendWelcomeWhatsapp?: boolean;
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
  const clinicName = branding.clinicName || 'Ygeía';

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [insuranceFilter, setInsuranceFilter] = useState<'all' | 'insurance' | 'private'>('all');
  const [patientToDelete, setPatientToDelete] = useState<PatientRecord | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered Patients
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        (patient.email && patient.email.toLowerCase().includes(query)) ||
        (patient.cpf && patient.cpf.includes(query)) ||
        (patient.phone && patient.phone.includes(query));

      const hasInsurance = Boolean(
        patient.insurancePlan &&
        patient.insurancePlan !== 'Sem convênio' &&
        patient.insurancePlan !== 'Particular'
      );

      const matchesInsurance =
        insuranceFilter === 'all' ||
        (insuranceFilter === 'insurance' && hasInsurance) ||
        (insuranceFilter === 'private' && !hasInsurance);

      return matchesQuery && matchesInsurance;
    });
  }, [patients, searchQuery, insuranceFilter]);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  // Metrics
  const totalPatients = patients.length;
  const appActivePatients = patients.filter((p) => p.hasUserAccount || p.status === 'Ativo').length;
  const insuranceCount = patients.filter(
    (p) => p.insurancePlan && p.insurancePlan !== 'Sem convênio' && p.insurancePlan !== 'Particular'
  ).length;
  const privateCount = totalPatients - insuranceCount;

  const handlePatientRowClick = (patient: PatientRecord) => {
    if (onEditPatient) {
      onEditPatient(patient);
    } else if (onSelectPatient) {
      onSelectPatient(patient);
    }
  };

  const handleConfirmDelete = () => {
    if (!patientToDelete) return;
    if (onDeletePatient) {
      onDeletePatient(patientToDelete.id);
    }
    toast.success(`Paciente ${patientToDelete.name} removido com sucesso.`);
    setPatientToDelete(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* 1. Header Idêntico ao Better Health */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary-light)',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: 'var(--primary)',
              textTransform: 'uppercase',
            }}
          >
            ROTINA CLÍNICA
          </span>
          <h1
            style={{
              marginTop: '0.5rem',
              fontSize: '1.75rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              lineHeight: 1.2,
            }}
          >
            Pacientes
          </h1>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#64748b' }}>
            Gestão completa de pacientes, convênios e credenciais do aplicativo {clinicName}.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewPatient}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--primary)',
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
        >
          <UserPlus size={16} />
          <span>Novo paciente</span>
        </button>
      </div>

      {/* 2. Top Metrics Cards (Grid Responsivo Mobile First) */}
      <div className="ygeia-grid-metrics">
        {/* Card 1: Total Pacientes */}
        <div
          style={{
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              Total Pacientes
            </span>
            <div
              style={{
                borderRadius: '0.5rem',
                backgroundColor: 'var(--primary-light)',
                padding: '0.5rem',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={16} />
            </div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '1.625rem', fontWeight: 800, color: '#0f172a' }}>
            {totalPatients}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cadastros ativos</span>
        </div>

        {/* Card 2: App Conectado */}
        <div
          style={{
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              App Conectado
            </span>
            <div
              style={{
                borderRadius: '0.5rem',
                backgroundColor: '#eff6ff',
                padding: '0.5rem',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Smartphone size={16} />
            </div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '1.625rem', fontWeight: 800, color: '#0f172a' }}>
            {appActivePatients}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Usuários criados</span>
        </div>

        {/* Card 3: Com Convênio */}
        <div
          style={{
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              Com Convênio
            </span>
            <div
              style={{
                borderRadius: '0.5rem',
                backgroundColor: '#faf5ff',
                padding: '0.5rem',
                color: '#9333ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={16} />
            </div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '1.625rem', fontWeight: 800, color: '#0f172a' }}>
            {insuranceCount}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Repasses vinculados</span>
        </div>

        {/* Card 4: Particulares */}
        <div
          style={{
            borderRadius: '1rem',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '1.25rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
              Particulares
            </span>
            <div
              style={{
                borderRadius: '0.5rem',
                backgroundColor: '#fffbeb',
                padding: '0.5rem',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Building size={16} />
            </div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '1.625rem', fontWeight: 800, color: '#0f172a' }}>
            {privateCount}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Atendimento direto</span>
        </div>
      </div>

      {/* 3. Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '0.875rem 1rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar paciente por nome, CPF, e-mail ou telefone..."
            style={{
              width: '100%',
              borderRadius: '0.75rem',
              border: '1px solid #cbd5e1',
              padding: '0.5rem 1rem 0.5rem 2.5rem',
              fontSize: '0.875rem',
              color: '#0f172a',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
            Filtrar:
          </span>
          <select
            value={insuranceFilter}
            onChange={(e) => setInsuranceFilter(e.target.value as 'all' | 'insurance' | 'private')}
            style={{
              borderRadius: '0.75rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              padding: '0.5rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#334155',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">Todos os Pacientes</option>
            <option value="insurance">Apenas com Convênio</option>
            <option value="private">Apenas Particulares</option>
          </select>
        </div>
      </div>

      {/* 4. Patients Table Card */}
      <div
        style={{
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {filteredPatients.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                borderRadius: '9999px',
                backgroundColor: '#f1f5f9',
                padding: '1rem',
                color: '#94a3b8',
                marginBottom: '0.75rem',
              }}
            >
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
              {searchQuery ? 'Nenhum paciente encontrado para a busca' : 'Nenhum paciente cadastrado'}
            </h3>
            <p style={{ marginTop: '0.25rem', maxWidth: '360px', fontSize: '0.75rem', color: '#64748b' }}>
              {searchQuery
                ? 'Tente ajustar os termos da pesquisa ou remover os filtros aplicados.'
                : 'Cadastre o primeiro paciente para gerenciar a rotina clínica e liberar o aplicativo.'}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={onNewPatient}
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'var(--primary)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <UserPlus size={14} />
                <span>Cadastrar Primeiro Paciente</span>
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#64748b',
                  }}
                >
                  <th style={{ padding: '0.875rem 1.5rem' }}>Paciente</th>
                  <th style={{ padding: '0.875rem 1.5rem' }}>Contato</th>
                  <th style={{ padding: '0.875rem 1.5rem' }}>CPF</th>
                  <th style={{ padding: '0.875rem 1.5rem' }}>Convênio</th>
                  <th style={{ padding: '0.875rem 1.5rem' }}>Acesso App</th>
                  <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient) => {
                  const hasInsurance = Boolean(
                    patient.insurancePlan &&
                    patient.insurancePlan !== 'Sem convênio' &&
                    patient.insurancePlan !== 'Particular'
                  );
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => handlePatientRowClick(patient)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                      onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                    >
                      {/* Paciente */}
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {patient.photoUrl ? (
                            <img
                              src={patient.photoUrl}
                              alt={patient.name}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                boxShadow: '0 0 0 2px var(--primary-border)',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-soft)',
                                color: 'var(--primary)',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {patient.initials || 'PA'}
                            </div>
                          )}
                          <div>
                            <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '0.875rem' }}>
                              {patient.name}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.15rem 0 0 0' }}>
                              {patient.attendanceLocation || 'Meu consultório'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contato */}
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.75rem' }}>
                          {patient.email ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#475569' }}>
                              <Mail size={13} color="#94a3b8" />
                              <span>{patient.email}</span>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Sem e-mail</span>
                          )}
                          {patient.phone ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#475569' }}>
                              <Phone size={13} color="#94a3b8" />
                              <span>{patient.phone}</span>
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* CPF */}
                      <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#475569' }}>
                        {patient.cpf || '—'}
                      </td>

                      {/* Convênio */}
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {hasInsurance ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              borderRadius: '9999px',
                              backgroundColor: '#faf5ff',
                              border: '1px solid #e9d5ff',
                              padding: '0.25rem 0.625rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#9333ea',
                            }}
                          >
                            {patient.insurancePlan}
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              borderRadius: '9999px',
                              backgroundColor: '#f1f5f9',
                              padding: '0.25rem 0.625rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#475569',
                            }}
                          >
                            Particular
                          </span>
                        )}
                      </td>

                      {/* Acesso App */}
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {patient.hasUserAccount || patient.status === 'Ativo' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              borderRadius: '9999px',
                              backgroundColor: 'var(--primary-light)',
                              border: '1px solid var(--primary-border)',
                              padding: '0.25rem 0.625rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--primary)',
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>App Ativo</span>
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              borderRadius: '9999px',
                              backgroundColor: '#fffbeb',
                              border: '1px solid #fde68a',
                              padding: '0.25rem 0.625rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#b45309',
                            }}
                          >
                            <Clock size={13} />
                            <span>Pendente</span>
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '0.5rem',
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePatientRowClick(patient);
                            }}
                            title="Editar paciente"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '0.35rem',
                              color: '#64748b',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--primary)')}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPatientToDelete(patient);
                            }}
                            title="Excluir paciente"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '0.35rem',
                              color: '#64748b',
                              borderRadius: '0.375rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = '#ef4444')}
                            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredPatients.length > 0 && (
          <DataTablePagination
            totalItems={filteredPatients.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* 5. Delete Confirmation Modal Dialog */}
      {patientToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              borderRadius: '1rem',
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e11d48' }}>
              <div
                style={{
                  borderRadius: '9999px',
                  backgroundColor: '#ffe4e6',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Trash2 size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Excluir Paciente
              </h3>
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              Tem certeza que deseja excluir o cadastro de{' '}
              <strong style={{ color: '#0f172a' }}>{patientToDelete.name}</strong>? Essa ação é
              irreversível e revoga o acesso do paciente ao aplicativo móvel.
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                style={{
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                style={{
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#e11d48',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
