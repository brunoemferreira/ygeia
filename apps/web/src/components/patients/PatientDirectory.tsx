import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Download,
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
  goal: string;
  status: 'Ativo' | 'Inativo';
  lastConsult: string;
  insurancePlan?: string;
}

export interface PatientDirectoryProps {
  patients: PatientRecord[];
  onNewPatient: () => void;
  onSelectPatient?: (patient: PatientRecord) => void;
}

export const PatientDirectory: React.FC<PatientDirectoryProps> = ({
  patients,
  onNewPatient,
  onSelectPatient,
}) => {
  const { toast } = useToast();
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Ativo' | 'Inativo'>('ALL');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Filtered list
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.cpf && p.cpf.includes(searchTerm)) ||
        p.phone.includes(searchTerm);

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [patients, searchTerm, statusFilter]);

  // Paginated slice
  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  const handleRowClick = (patient: PatientRecord) => {
    setSelectedPatientId(patient.id === selectedPatientId ? null : patient.id);
    if (onSelectPatient) {
      onSelectPatient(patient);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Top Header & Barra de Ações Rápidas */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
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
              letterSpacing: '0.06em',
              color: '#475569',
              backgroundColor: '#e2e8f0',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              marginBottom: '0.35rem',
              textTransform: 'uppercase',
            }}
          >
            Pacientes
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem 0', letterSpacing: '-0.02em' }}>
            Carteira de Pacientes
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            Gerenciamento completo da base de prontuários, planos nutricionais e histórico clínico
          </p>
        </div>

        {/* Botão Novo Paciente */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => toast.info('Exportando planilha de pacientes em formato XLSX...')}
            title="Exportar base de pacientes"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              padding: '0.6rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
          >
            <Download size={15} />
            <span>Exportar</span>
          </button>

          <button
            type="button"
            onClick={onNewPatient}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.65rem 1.35rem',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
              transition: 'transform 0.1s ease, opacity 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.92')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <Plus size={16} />
            <span>Novo paciente</span>
          </button>
        </div>
      </div>

      {/* Card Principal: Filtros + Grid de Dados Paginado */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Barra de Filtros e Busca */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Campo de Busca */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              padding: '0.5rem 0.85rem',
              width: '100%',
              maxWidth: '380px',
            }}
          >
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou e-mail..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.8125rem',
                color: '#0f172a',
                width: '100%',
              }}
            />
          </div>

          {/* Filtros de Status (Tabs) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginRight: '0.25rem' }}>
              Status:
            </span>
            {(['ALL', 'Ativo', 'Inativo'] as const).map((st) => {
              const isSelected = statusFilter === st;
              const label = st === 'ALL' ? 'Todos' : st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  style={{
                    backgroundColor: isSelected ? '#ecfdf5' : '#f8fafc',
                    color: isSelected ? '#059669' : '#64748b',
                    border: isSelected ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabela de Dados (Grid) */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 700, width: '40px' }}>#</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Paciente</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>CPF</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Telefone / Contato</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Objetivo Clínico</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.875rem 1.5rem', fontWeight: 700, textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <User size={32} color="#cbd5e1" style={{ margin: '0 auto 0.75rem auto' }} />
                    <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                      Nenhum paciente encontrado
                    </div>
                    <div style={{ fontSize: '0.75rem' }}>
                      Tente ajustar os filtros de busca ou cadastre um novo paciente.
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((p, index) => {
                  const isSelected = selectedPatientId === p.id;
                  const itemIndex = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => handleRowClick(p)}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Checkbox / Índice */}
                      <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>
                        {itemIndex}
                      </td>

                      {/* Paciente (Avatar + Nome + E-mail) */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: isSelected ? '#10b981' : '#e2e8f0',
                              color: isSelected ? '#ffffff' : '#334155',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.8125rem',
                              flexShrink: 0,
                            }}
                          >
                            {p.initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                              {p.name}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                              {p.email || 'E-mail não cadastrado'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CPF */}
                      <td style={{ padding: '1rem', color: '#475569', fontFamily: 'monospace' }}>
                        {p.cpf || 'Não informado'}
                      </td>

                      {/* Telefone */}
                      <td style={{ padding: '1rem', color: '#475569' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Phone size={13} color="#059669" />
                          <span>{p.phone || 'Sem telefone'}</span>
                        </div>
                      </td>

                      {/* Objetivo Clínico */}
                      <td style={{ padding: '1rem', color: '#334155', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.goal}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: p.status === 'Ativo' ? '#ecfdf5' : '#f1f5f9',
                            color: p.status === 'Ativo' ? '#065f46' : '#64748b',
                            border: p.status === 'Ativo' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                            borderRadius: '9999px',
                            padding: '0.2rem 0.55rem',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: p.status === 'Ativo' ? '#10b981' : '#94a3b8',
                            }}
                          />
                          <span>{p.status}</span>
                        </span>
                      </td>

                      {/* Ações */}
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(`Abrindo prontuário de ${p.name}...`);
                            }}
                            style={{
                              backgroundColor: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              color: '#059669',
                              borderRadius: '0.375rem',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseOver={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '#059669';
                              (e.currentTarget as HTMLElement).style.color = '#ffffff';
                            }}
                            onMouseOut={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '#ecfdf5';
                              (e.currentTarget as HTMLElement).style.color = '#059669';
                            }}
                          >
                            Prontuário
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

        {/* Rodapé de Paginação */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Contagem */}
          <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Mostrando <strong>{filteredPatients.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> a{' '}
            <strong>{Math.min(currentPage * pageSize, filteredPatients.length)}</strong> de{' '}
            <strong>{filteredPatients.length}</strong> pacientes
          </div>

          {/* Controles de Navegação */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Itens por página */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
              <span>Exibir:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  padding: '0.2rem 0.4rem',
                  fontSize: '0.75rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              >
                <option value={8}>8</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
              </select>
            </div>

            {/* Anterior */}
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                backgroundColor: '#ffffff',
                color: currentPage <= 1 ? '#cbd5e1' : '#334155',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={14} />
              <span>Anterior</span>
            </button>

            {/* Páginas */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '0.375rem',
                    border: isCurrent ? `1px solid ${primaryColor}` : '1px solid #e2e8f0',
                    backgroundColor: isCurrent ? primaryColor : '#ffffff',
                    color: isCurrent ? '#ffffff' : '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Próxima */}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                backgroundColor: '#ffffff',
                color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <span>Próxima</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
