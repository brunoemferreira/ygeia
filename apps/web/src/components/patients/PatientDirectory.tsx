import React from 'react';
import {
  UserPlus,
  Users,
  Smartphone,
  Shield,
  CreditCard,
  Pencil,
  Trash2,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { getStoredBranding } from '../../utils/branding';
import { AppTable, ColumnDef, TableFilterOption } from '../ui/AppTable';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';
import { AppBadge } from '../ui/AppBadge';

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

  // KPI Calculations
  const totalCount = patients.length;
  const connectedAppCount = patients.filter((p) => p.welcomeEmail || p.welcomeWhatsapp || p.status === 'Ativo').length;
  const withInsuranceCount = patients.filter(
    (p) => p.insurancePlan && p.insurancePlan !== 'Particular' && p.insurancePlan !== '',
  ).length;
  const privateCount = patients.filter(
    (p) => !p.insurancePlan || p.insurancePlan === 'Particular',
  ).length;

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

  // Definição das Colunas Padronizadas da Tabela
  const columns: ColumnDef<PatientRecord>[] = [
    {
      id: 'paciente',
      header: 'PACIENTE',
      cell: (p) => (
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
            {p.initials || 'PA'}
          </div>
          <div>
            <div style={{ fontSize: '0.84375rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {p.name}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.15rem', fontWeight: 400 }}>
              {p.locationName || 'Meu consultório'}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contato',
      header: 'CONTATO',
      cell: (p) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#475569' }}>
            <Mail size={12} color="#94a3b8" />
            <span>{p.email || 'Não informado'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#475569' }}>
            <Phone size={12} color="#94a3b8" />
            <span>{p.phone || 'Não informado'}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'cpf',
      header: 'CPF',
      cell: (p) => (
        <span style={{ fontSize: '0.78125rem', color: '#334155', fontWeight: 500 }}>
          {p.cpf || '—'}
        </span>
      ),
    },
    {
      id: 'convenio',
      header: 'CONVÊNIO',
      cell: (p) => (
        <AppBadge variant="neutral">
          {p.insurancePlan || 'Particular'}
        </AppBadge>
      ),
    },
    {
      id: 'acesso_app',
      header: 'ACESSO APP',
      cell: () => (
        <AppBadge variant="success" icon={<CheckCircle2 size={12} />}>
          App Ativo
        </AppBadge>
      ),
    },
  ];

  // Opções de Filtro da Tabela
  const filterOptions: TableFilterOption<PatientRecord>[] = [
    { label: 'Cadastros Ativos', value: 'ATIVO', filterFn: (p) => p.status === 'Ativo' },
    { label: 'Com Convênio', value: 'CONVENIO', filterFn: (p) => !!p.insurancePlan && p.insurancePlan !== 'Particular' },
    { label: 'Particulares', value: 'PARTICULAR', filterFn: (p) => !p.insurancePlan || p.insurancePlan === 'Particular' },
    { label: 'App Ativo', value: 'APP_ATIVO', filterFn: (p) => Boolean(p.welcomeEmail || p.welcomeWhatsapp || p.status === 'Ativo') },
  ];

  const clinicLabel = branding.clinicName || 'Ygeía';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* 1. Header do Módulo */}
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

          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, fontWeight: 400 }}>
            Gestão completa de pacientes, convênios e credenciais do aplicativo {clinicLabel}.
          </p>
        </div>

        <AppButton
          variant="primary"
          icon={<UserPlus size={16} />}
          onClick={onNewPatient}
        >
          Novo paciente
        </AppButton>
      </div>

      {/* 2. Cards Resumo KPI Padronizados */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Card 1: Total Pacientes */}
        <AppCard variant="metric" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '105px' }}>
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
        </AppCard>

        {/* Card 2: App Conectado */}
        <AppCard variant="metric" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '105px' }}>
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
        </AppCard>

        {/* Card 3: Com Convênio */}
        <AppCard variant="metric" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '105px' }}>
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
        </AppCard>

        {/* Card 4: Particulares */}
        <AppCard variant="metric" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '105px' }}>
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
        </AppCard>
      </div>

      {/* 3. Tabela Padrão (AppTable) com Busca, Filtros, Hover e Ações */}
      <AppTable<PatientRecord>
        data={patients}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Buscar paciente por nome, CPF, e-mail ou telefone..."
        searchFilter={(p, term) => {
          return (
            p.name.toLowerCase().includes(term) ||
            p.email.toLowerCase().includes(term) ||
            (p.cpf && p.cpf.toLowerCase().includes(term)) ||
            p.phone.toLowerCase().includes(term)
          );
        }}
        filterOptions={filterOptions}
        onRowClick={handlePatientClick}
        actions={(patient) => (
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.65rem' }}>
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
        )}
      />
    </div>
  );
};
