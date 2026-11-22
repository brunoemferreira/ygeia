import React, { useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Clock,
  DollarSign,
  MoreHorizontal,
  Edit2,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import { PatientRecord } from '../PatientDirectory';
import { useToast } from '../../../context/ToastContext';

export interface PatientHeaderCardProps {
  patient: PatientRecord;
  patientName: string;
  patientInitials: string;
  patientAgeString: string;
  patientKey: string;
  onBack: () => void;
  onEdit: (patient: PatientRecord) => void;
  onDelete?: (id: string | number) => void;
  onNavigateSection: (sectionId: string, groupKey?: string) => void;
}

export const PatientHeaderCard: React.FC<PatientHeaderCardProps> = ({
  patient,
  patientName,
  patientInitials,
  patientAgeString,
  patientKey,
  onBack,
  onEdit,
  onDelete,
  onNavigateSection,
}) => {
  const { toast } = useToast();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const phoneClean = (patient?.phone || '').replace(/\D/g, '');
  const whatsappUrl = phoneClean
    ? `https://wa.me/${phoneClean.startsWith('55') ? phoneClean : '55' + phoneClean}?text=${encodeURIComponent(
        `Olá, ${patientName}! Aqui é do seu consultório de nutrição.`
      )}`
    : null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(patientKey);
    toast.success(`Chave ${patientKey} copiada para a área de transferência!`);
  };

  return (
    <>
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Esquerda: Voltar + Avatar + Nome + Idade/Chave */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onBack}
            title="Voltar aos pacientes"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
          >
            <ArrowLeft size={16} />
          </button>

          {/* Avatar com badge */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.9375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              }}
            >
              {patientInitials}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2px solid #ffffff',
              }}
            />
          </div>

          {/* Dados do Paciente */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {patientName}
              </h1>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                }}
              >
                Ativo
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '0.15rem',
              }}
            >
              <span>{patientAgeString}</span>
              <span>•</span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span>chave {patientKey}</span>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  title="Copiar chave do paciente"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Direita: Ações Rápidas (Financeiro, Linha do Tempo, Mais Ações) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
          <button
            type="button"
            onClick={() => onNavigateSection('arquivo_recibo', 'arquivos_paciente')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
          >
            <DollarSign size={14} color="#64748b" />
            <span>Financeiro</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection('prontuario', 'avaliacao_nutricional')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
          >
            <Clock size={14} color="#64748b" />
            <span>Linha do tempo</span>
          </button>

          {/* Botão Dropdown Mais Ações (...) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="Mais opções do paciente"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '0.375rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <MoreHorizontal size={16} />
            </button>

            {showMoreMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '200px',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '0.35rem 0',
                  zIndex: 50,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMoreMenu(false);
                    onEdit(patient);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.5rem 1rem',
                    fontSize: '0.8125rem',
                    color: '#334155',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                  onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                >
                  <Edit2 size={14} />
                  <span>Editar cadastro</span>
                </button>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMoreMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.5rem 1rem',
                      fontSize: '0.8125rem',
                      color: '#16a34a',
                      textDecoration: 'none',
                      boxSizing: 'border-box',
                    }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f0fdf4')}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                  >
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </a>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setConfirmDelete(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.5rem 1rem',
                      fontSize: '0.8125rem',
                      color: '#e11d48',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderTop: '1px solid #f1f5f9',
                    }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#fff1f2')}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                  >
                    <Trash2 size={14} />
                    <span>Excluir paciente</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Confirmação de Exclusão */}
      {confirmDelete && onDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '440px',
              width: '100%',
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <Trash2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Excluir paciente?
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 1.25rem 0' }}>
              Tem certeza que deseja excluir <strong>{patientName}</strong>? Todas as consultas, anamneses, planos e
              históricos vinculados serão removidos.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  onDelete(patient.id);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: '#e11d48',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
