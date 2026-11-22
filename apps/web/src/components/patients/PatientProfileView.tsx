import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Activity,
  FileText,
  Utensils,
  Scale,
  ClipboardList,
  Plus,
  Share2,
  Download,
  AlertCircle,
  MessageCircle,
  Heart,
  Sparkles,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import { PatientRecord } from './PatientDirectory';
import { CountryFlag, COUNTRY_DIAL_CODES } from './countryDialCodes';
import { useToast } from '../../context/ToastContext';

export interface PatientProfileViewProps {
  patient: PatientRecord;
  onBack: () => void;
  onEdit: (patient: PatientRecord) => void;
  onDelete?: (patientId: string) => void;
}

type TabKey = 'timeline' | 'details' | 'meal_plan' | 'anthropometry' | 'anamnesis' | 'exams';

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  onBack,
  onEdit,
  onDelete,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('timeline');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Estado para nova anotação clínica rápida
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'evolution' | 'alert' | 'whatsapp'>('evolution');
  const [notesList, setNotesList] = useState<
    Array<{ id: string; date: string; type: string; title: string; text: string; author: string }>
  >([
    {
      id: '1',
      date: 'Hoje, 09:30',
      type: 'evolution',
      title: 'Ajuste de Plano Alimentar & Hidratação',
      text: 'Paciente relatou melhora significativa na disposição matinal e adesão de 90% ao cardápio proposto. Aumentada ingestão hídrica para 35ml/kg.',
      author: 'Dra. Nutricionista',
    },
    {
      id: '2',
      date: '15/10/2026, 14:15',
      type: 'evolution',
      title: 'Consulta de Acompanhamento (Retorno)',
      text: 'Perda de 1.8kg de gordura corporal aferida por bioimpedância e manutenção integral da massa muscular esquelética. Ajustados micronutrientes pré-treino.',
      author: 'Dra. Nutricionista',
    },
    {
      id: '3',
      date: '10/09/2026, 10:00',
      type: 'alert',
      title: 'Primeira Consulta & Anamnese Clínica Inicial',
      text: 'Definido protocolo de modulação metabólica e reeducação alimentar focada em hipertrofia e composição corporal sustentável.',
      author: 'Dra. Nutricionista',
    },
  ]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const entry = {
      id: String(Date.now()),
      date: 'Hoje, agora',
      type: noteType,
      title:
        noteType === 'evolution'
          ? 'Evolução Clínica'
          : noteType === 'alert'
          ? 'Alerta Nutricional'
          : 'Registro de Contato',
      text: newNote.trim(),
      author: 'Você',
    };

    setNotesList([entry, ...notesList]);
    setNewNote('');
    toast.success('Anotação clínica adicionada ao prontuário!');
  };

  // Extrair número limpo de telefone para WhatsApp
  const phoneClean = (patient.phone || '').replace(/\D/g, '');
  const whatsappUrl = phoneClean
    ? `https://wa.me/${phoneClean.startsWith('55') ? phoneClean : '55' + phoneClean}?text=${encodeURIComponent(
        `Olá, ${patient.name}! Aqui é da clínica de nutrição. Como você está hoje?`
      )}`
    : null;

  // Encontrar bandeira do telefone
  const detectedCountry = COUNTRY_DIAL_CODES.find((c) =>
    (patient.phone || '').startsWith(c.dialCode)
  ) || COUNTRY_DIAL_CODES[0];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: 'var(--font-sans)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Barra de Navegação Superior (Breadcrumb + Ações) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
              (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
              (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
            }}
          >
            <ArrowLeft size={15} />
            <span>Voltar para Pacientes</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
            <span>Pacientes</span>
            <ChevronRight size={14} />
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{patient.name}</span>
          </div>
        </div>

        {/* Botões de Ação Principal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                borderRadius: '0.5rem',
                backgroundColor: '#25d366',
                color: '#ffffff',
                padding: '0.45rem 0.9rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 1px 2px rgba(37, 211, 102, 0.25)',
                transition: 'transform 0.1s ease',
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.92')}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => onEdit(patient)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              padding: '0.45rem 0.9rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
          >
            <Edit2 size={14} />
            <span>Editar Cadastro</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('timeline');
              toast.info('Consulta iniciada! Você pode adicionar registros clínicos na aba Prontuário.');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.45rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
          >
            <Sparkles size={15} />
            <span>Iniciar Consulta</span>
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              title="Excluir paciente"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.5rem',
                border: '1px solid #fee2e2',
                backgroundColor: '#fff1f2',
                color: '#e11d48',
                padding: '0.45rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#fecdd3')}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#fff1f2')}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {confirmDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(2px)',
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
              borderRadius: '1rem',
              maxWidth: '420px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Confirmar Exclusão
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Tem certeza que deseja remover o paciente <strong style={{ color: '#0f172a' }}>{patient.name}</strong>?
              Esta ação removerá o prontuário associado.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                style={{
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  padding: '0.5rem 1rem',
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
                  if (onDelete) onDelete(patient.id);
                  toast.success(`Paciente ${patient.name} removido com sucesso.`);
                  onBack();
                }}
                style={{
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#e11d48',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hero Card do Paciente (Identificação Completa Modelo DietSystem) */}
      <div
        style={{
          borderRadius: '1rem',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          {/* Avatar + Dados Principais */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {patient.photoUrl ? (
              <img
                src={patient.photoUrl}
                alt={patient.name}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0 0 0 3px var(--primary-border)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-soft)',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 3px var(--primary-border)',
                  flexShrink: 0,
                }}
              >
                {patient.initials || 'PA'}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {patient.name}
                </h1>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--primary-light)',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                    }}
                  />
                  {patient.status || 'Ativo'}
                </span>
                {patient.insurancePlan && patient.insurancePlan !== 'Particular' && (
                  <span
                    style={{
                      borderRadius: '9999px',
                      backgroundColor: '#faf5ff',
                      border: '1px solid #e9d5ff',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#9333ea',
                    }}
                  >
                    {patient.insurancePlan}
                  </span>
                )}
              </div>

              {/* Informações clínicas secundárias */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginTop: '0.45rem',
                  flexWrap: 'wrap',
                  fontSize: '0.8125rem',
                  color: '#64748b',
                }}
              >
                {patient.birthDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} color="#94a3b8" />
                    <span>Nasc.: {patient.birthDate}</span>
                  </div>
                )}
                {patient.sex && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Heart size={14} color="#94a3b8" />
                    <span>Sexo biológico: {patient.sex}</span>
                  </div>
                )}
                {patient.cpf && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'monospace' }}>
                    <span>CPF: {patient.cpf}</span>
                  </div>
                )}
                {patient.attendanceLocation && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="#94a3b8" />
                    <span>{patient.attendanceLocation}</span>
                  </div>
                )}
              </div>

              {/* Objetivo & Badges de tags */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.6rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    borderRadius: '0.375rem',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  🎯 Objetivo: {patient.objective || patient.goal || 'Performance & Composição Corporal'}
                </span>

                {(patient.tags || ['Adesão Alta', 'Rotina Intensa']).map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      borderRadius: '0.375rem',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#475569',
                    }}
                  >
                    #{tag}
                  </span>
                ))}

                {(patient.pathologies || []).map((pathology, idx) => (
                  <span
                    key={idx}
                    style={{
                      borderRadius: '0.375rem',
                      backgroundColor: '#fff1f2',
                      border: '1px solid #fecdd3',
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#e11d48',
                    }}
                  >
                    ⚠️ {pathology}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards (DietSystem Glance Bar) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
              gap: '0.65rem',
              minWidth: '280px',
              maxWidth: '460px',
              width: '100%',
            }}
          >
            <div
              style={{
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.65rem 0.85rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b' }}>Peso Atual</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                78.4 kg
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                <TrendingDown size={12} />
                <span>-2.1 kg</span>
              </div>
            </div>

            <div
              style={{
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.65rem 0.85rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b' }}>IMC</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                24.2
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#0284c7', fontWeight: 600 }}>Eutrofia</div>
            </div>

            <div
              style={{
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.65rem 0.85rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b' }}>Gordura %</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
                16.8%
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 600 }}>Ideal</div>
            </div>

            <div
              style={{
                borderRadius: '0.75rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.65rem 0.85rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748b' }}>Meta Calórica</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.15rem' }}>
                2.150
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>kcal / dia</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Abas de Navegação (Estrutura Completa DietSystem) */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          gap: '0.5rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {[
          { key: 'timeline', label: 'Prontuário & Linha do Tempo', icon: Clock },
          { key: 'details', label: 'Dados Cadastrais & Contato', icon: ClipboardList },
          { key: 'meal_plan', label: 'Plano Alimentar & Prescrição', icon: Utensils },
          { key: 'anthropometry', label: 'Avaliação Antropométrica', icon: Scale },
          { key: 'anamnesis', label: 'Anamnese & Hábitos', icon: Activity },
          { key: 'exams', label: 'Exames & Documentos', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--primary)' : '#64748b',
                border: 'none',
                background: 'transparent',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Conteúdo das Abas */}

      {/* ========================================================
          ABA 1: PRONTUÁRIO & LINHA DO TEMPO (DIETSYSTEM TIMELINE)
         ======================================================== */}
      {activeTab === 'timeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Coluna Esquerda: Linha do Tempo de Atendimentos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Box Adicionar Nota Rápida */}
            <div
              style={{
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.75rem 0' }}>
                ✍️ Adicionar Evolução Clínica / Nota de Consulta
              </h3>
              <form onSubmit={handleAddNote}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setNoteType('evolution')}
                    style={{
                      borderRadius: '0.375rem',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: noteType === 'evolution' ? 'var(--primary)' : '#e2e8f0',
                      backgroundColor: noteType === 'evolution' ? 'var(--primary-light)' : '#ffffff',
                      color: noteType === 'evolution' ? 'var(--primary)' : '#64748b',
                    }}
                  >
                    Evolução
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType('alert')}
                    style={{
                      borderRadius: '0.375rem',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: noteType === 'alert' ? '#e11d48' : '#e2e8f0',
                      backgroundColor: noteType === 'alert' ? '#fff1f2' : '#ffffff',
                      color: noteType === 'alert' ? '#e11d48' : '#64748b',
                    }}
                  >
                    Alerta Clínico
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType('whatsapp')}
                    style={{
                      borderRadius: '0.375rem',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: noteType === 'whatsapp' ? '#25d366' : '#e2e8f0',
                      backgroundColor: noteType === 'whatsapp' ? '#dcfce7' : '#ffffff',
                      color: noteType === 'whatsapp' ? '#15803d' : '#64748b',
                    }}
                  >
                    Contato WhatsApp
                  </button>
                </div>

                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Descreva a evolução do paciente, relatos de apetite, sintomas ou ajustes realizados no plano alimentar..."
                  rows={3}
                  style={{
                    width: '100%',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    padding: '0.625rem',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      padding: '0.45rem 1rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    <span>Salvar no Prontuário</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Timeline Feed */}
            <div
              style={{
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0' }}>
                Linha do Tempo de Atendimentos
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                {notesList.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '0.85rem',
                      position: 'relative',
                      paddingBottom: idx !== notesList.length - 1 ? '0.75rem' : '0',
                    }}
                  >
                    {/* Linha vertical conectora */}
                    {idx !== notesList.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '11px',
                          top: '24px',
                          bottom: 0,
                          width: '2px',
                          backgroundColor: '#e2e8f0',
                        }}
                      />
                    )}

                    {/* Ponto indicador */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor:
                          item.type === 'alert'
                            ? '#fff1f2'
                            : item.type === 'whatsapp'
                            ? '#dcfce7'
                            : 'var(--primary-light)',
                        border: '2px solid',
                        borderColor:
                          item.type === 'alert'
                            ? '#e11d48'
                            : item.type === 'whatsapp'
                            ? '#25d366'
                            : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor:
                            item.type === 'alert'
                              ? '#e11d48'
                              : item.type === 'whatsapp'
                              ? '#25d366'
                              : 'var(--primary)',
                        }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0f172a' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{item.date}</span>
                      </div>
                      <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                        {item.text}
                      </p>
                      <span style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
                        Registrado por: {item.author}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Alertas Clínicos & Resumo de Protocolos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.85rem 0' }}>
                🚨 Alertas Clínicos & Restrições
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div
                  style={{
                    borderRadius: '0.5rem',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    padding: '0.75rem',
                    fontSize: '0.8125rem',
                    color: '#92400e',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <AlertCircle size={16} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700 }}>Alergias & Intolerâncias:</span>
                    <p style={{ margin: '0.2rem 0 0 0' }}>
                      Nenhuma alergia medicamentosa severa declarada. Leve desconforto com lactose em altas doses.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: '0.5rem',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    padding: '0.75rem',
                    fontSize: '0.8125rem',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700 }}>Suplementação Ativa:</span>
                    <p style={{ margin: '0.2rem 0 0 0' }}>
                      Creatina monoidratada 5g/dia no pós-treino; Vitamina D3 2.000 UI com a refeição do almoço.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Rápidas de Contato */}
            <div
              style={{
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.85rem 0' }}>
                📞 Contato & Notificações
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Telefone / WhatsApp</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#0f172a' }}>
                    <CountryFlag code={detectedCountry.code} flag={detectedCountry.flag} />
                    <span>{patient.phone || 'Não informado'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>E-mail</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{patient.email || 'Não informado'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Local de Atendimento</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{patient.attendanceLocation || 'Meu consultório'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Acesso ao Aplicativo</span>
                  <span
                    style={{
                      borderRadius: '9999px',
                      padding: '0.15rem 0.55rem',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      backgroundColor: patient.hasUserAccount ? 'var(--primary-light)' : '#f1f5f9',
                      color: patient.hasUserAccount ? 'var(--primary)' : '#64748b',
                    }}
                  >
                    {patient.hasUserAccount ? 'Ativo' : 'Não convidado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 2: DADOS CADASTRAIS & CONTATO (COMPLETO)
         ======================================================== */}
      {activeTab === 'details' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: Identificação */}
          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                👤 Dados Pessoais & Identificação
              </h3>
              <button
                type="button"
                onClick={() => onEdit(patient)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Edit2 size={13} />
                <span>Editar dados</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Nome Completo</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                  {patient.name}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>CPF</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', fontFamily: 'monospace', color: '#0f172a' }}>
                  {patient.cpf || '—'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Data de Nascimento</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: '#0f172a' }}>
                  {patient.birthDate || '—'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Sexo de Referência para Cálculos</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: '#0f172a' }}>
                  {patient.sex || 'Não informado'}
                </p>
              </div>
            </div>

            {/* Responsável Legal (se menor de idade) */}
            {(patient.guardianName || patient.guardianCpf) && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.875rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                  Dados do Responsável Legal (Menor de Idade)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Nome do Responsável</span>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a' }}>
                      {patient.guardianName || '—'}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>CPF do Responsável</span>
                    <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.8125rem', fontFamily: 'monospace', color: '#0f172a' }}>
                      {patient.guardianCpf || '—'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Endereço & Localização */}
          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0' }}>
              📍 Endereço Residencial
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>CEP</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', fontFamily: 'monospace', color: '#0f172a' }}>
                  {patient.address?.cep || '—'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Logradouro</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: '#0f172a' }}>
                  {patient.address?.street
                    ? `${patient.address.street}, ${patient.address.number || 'S/N'}`
                    : '—'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Complemento / Bairro</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: '#0f172a' }}>
                  {patient.address?.neighborhood || patient.address?.complement || '—'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Cidade / UF</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: '#0f172a' }}>
                  {patient.address?.city ? `${patient.address.city} - ${patient.address.state || ''}` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Tratamento, Protocolos & Convênio */}
          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0' }}>
              🏷️ Protocolos de Tratamento & Convênio
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Objetivo Principal</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
                  {patient.objective || patient.goal || 'Performance & Composição Corporal'}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Tipo de Atendimento / Convênio</span>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: '#0f172a' }}>
                  {patient.insurancePlan || 'Particular'}
                </p>
              </div>

              {patient.insuranceCardNumber && (
                <div>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Nº da Carteirinha</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', fontFamily: 'monospace', color: '#0f172a' }}>
                    {patient.insuranceCardNumber}
                  </p>
                </div>
              )}

              {patient.insuranceRepassAmount && (
                <div>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Valor de Repasse</span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', fontWeight: 700, color: '#16a34a' }}>
                    R$ {patient.insuranceRepassAmount}
                  </p>
                </div>
              )}
            </div>

            {patient.notes && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Observações Adicionais</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
                  {patient.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 3: PLANO ALIMENTAR & PRESCRIÇÃO (DIETSYSTEM MEAL PLAN)
         ======================================================== */}
      {activeTab === 'meal_plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card Resumo Nutricional & Macros */}
          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Plano Ativo: Hipertrofia Limpa & Performance
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0 0' }}>
                  2.150 kcal / dia
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <button
                  type="button"
                  onClick={() => toast.success('Gerando PDF do plano alimentar para impressão...')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={14} />
                  <span>Baixar PDF</span>
                </button>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '0.5rem',
                      backgroundColor: '#25d366',
                      color: '#ffffff',
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <Share2 size={14} />
                    <span>Enviar no WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Barra de Distribuição de Macronutrientes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
              <div style={{ borderRadius: '0.5rem', backgroundColor: '#eff6ff', padding: '0.75rem', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#1e40af' }}>Carboidratos</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.15rem' }}>242g (45%)</div>
                <div style={{ fontSize: '0.6875rem', color: '#60a5fa' }}>3.1g / kg</div>
              </div>

              <div style={{ borderRadius: '0.5rem', backgroundColor: '#f0fdf4', padding: '0.75rem', borderLeft: '4px solid #22c55e' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#166534' }}>Proteínas</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#14532d', marginTop: '0.15rem' }}>162g (30%)</div>
                <div style={{ fontSize: '0.6875rem', color: '#4ade80' }}>2.1g / kg</div>
              </div>

              <div style={{ borderRadius: '0.5rem', backgroundColor: '#fffbeb', padding: '0.75rem', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#92400e' }}>Lipídios</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#78350f', marginTop: '0.15rem' }}>60g (25%)</div>
                <div style={{ fontSize: '0.6875rem', color: '#fcd34d' }}>0.76g / kg</div>
              </div>

              <div style={{ borderRadius: '0.5rem', backgroundColor: '#f5f3ff', padding: '0.75rem', borderLeft: '4px solid #8b5cf6' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#5b21b6' }}>Fibras & Água</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#4c1d95', marginTop: '0.15rem' }}>34g / 2.8L</div>
                <div style={{ fontSize: '0.6875rem', color: '#a78bfa' }}>Ótima meta</div>
              </div>
            </div>
          </div>

          {/* Lista de Refeições Diárias Modelo DietSystem */}
          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0' }}>
              🍽️ Refeições Estruturadas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                {
                  time: '07:30',
                  name: 'Café da Manhã (Desjejum)',
                  kcal: '420 kcal',
                  items: [
                    '3 unidades de Ovos mexidos preparados com azeite de oliva extra virgem',
                    '2 fatias de Pão 100% integral ou 100g de Mandioca cozida',
                    '1 fatia média de Mamão papaia com 1 colher de sopa de sementes de chia',
                    'Café preto sem açúcar (opcional com canela)',
                  ],
                },
                {
                  time: '10:30',
                  name: 'Colação / Lanche da Manhã',
                  kcal: '210 kcal',
                  items: [
                    '1 pote (160g) de Iogurte natural desnatado',
                    '20g de Farelo de aveia ou flocos finos',
                    '1 maçã média picada',
                  ],
                },
                {
                  time: '13:00',
                  name: 'Almoço Completo',
                  kcal: '680 kcal',
                  items: [
                    '140g de Peito de frango grelhado ou filé de tilápia',
                    '120g de Arroz integral cozido',
                    '80g de Feijão preto ou carioca',
                    'Salada à vontade (alface, rúcula, tomate, pepino) com 1 colher de sopa de azeite',
                  ],
                },
                {
                  time: '16:30',
                  name: 'Lanche da Tarde / Pré-Treino',
                  kcal: '340 kcal',
                  items: [
                    '1 unidade de Banana prata',
                    '30g de Whey Protein Concentrado (sabor baunilha ou chocolate)',
                    '15g de Pasta de amendoim integral',
                  ],
                },
                {
                  time: '20:00',
                  name: 'Jantar',
                  kcal: '500 kcal',
                  items: [
                    '130g de Patinho moído refogado ou carne magra grelhada',
                    '150g de Batata doce cozida ou abóbora cabotiá assada',
                    'Legumes no vapor (brócolis, cenoura e couve-flor à vontade)',
                  ],
                },
              ].map((meal, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: '0.625rem',
                    border: '1px solid #f1f5f9',
                    backgroundColor: '#f8fafc',
                    padding: '0.875rem 1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          borderRadius: '0.375rem',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          padding: '0.15rem 0.45rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {meal.time}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{meal.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{meal.kcal}</span>
                  </div>

                  <ul style={{ margin: '0.25rem 0 0 1.25rem', padding: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
                    {meal.items.map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 4: AVALIAÇÃO ANTROPOMÉTRICA (DIETSYSTEM BODY COMP)
         ======================================================== */}
      {activeTab === 'anthropometry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                📏 Medidas Antropométricas & Bioimpedância
              </h3>
              <button
                type="button"
                onClick={() => toast.info('Abrindo formulário de nova aferição antropométrica...')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Plus size={13} />
                <span>Nova Aferição</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Altura</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>180.0 cm</div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Estatura constante</div>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Circunferência da Cintura</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>83.5 cm</div>
                <div style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 600 }}>Baixo risco cardiovascular</div>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Circunferência do Quadril</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>98.0 cm</div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>RCQ: 0.85</div>
              </div>

              <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600 }}>Massa Magra (LBM)</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.15rem' }}>65.2 kg</div>
                <div style={{ fontSize: '0.6875rem', color: '#16a34a', fontWeight: 600 }}>83.2% de musculatura</div>
              </div>
            </div>

            {/* Dobras Cutâneas (Protocolo Pollock 7 Dobras) */}
            <div style={{ marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', margin: '0 0 0.65rem 0' }}>
                Dobras Cutâneas (Protocolo Pollock 7 Dobras)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                {[
                  { label: 'Tríceps', value: '11.0 mm' },
                  { label: 'Subescapular', value: '14.2 mm' },
                  { label: 'Suprailíaca', value: '13.5 mm' },
                  { label: 'Abdominal', value: '18.0 mm' },
                  { label: 'Coxa', value: '15.4 mm' },
                  { label: 'Peitoral', value: '9.8 mm' },
                  { label: 'Axilar Média', value: '10.5 mm' },
                ].map((skinfold, idx) => (
                  <div key={idx} style={{ padding: '0.5rem 0.65rem', borderRadius: '0.375rem', backgroundColor: '#f1f5f9', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>{skinfold.label}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginTop: '0.1rem' }}>{skinfold.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 5: ANAMNESE & HÁBITOS DE VIDA
         ======================================================== */}
      {activeTab === 'anamnesis' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.85rem 0' }}>
              🧬 Histórico Clínico & Queixa Principal
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Queixa Principal:</span>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b' }}>
                  Busca por aumento de energia ao longo do dia, ganho de massa magra e redução da gordura visceral.
                </p>
              </div>

              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Histórico Familiar:</span>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b' }}>
                  Pai com histórico de hipertensão arterial controlada; mãe sem histórico de doenças metabólicas.
                </p>
              </div>

              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Medicamentos em Uso:</span>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b' }}>
                  Nenhum medicamento de uso contínuo no momento.
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.85rem 0' }}>
              🏃‍♂️ Rotina & Estilo de Vida
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Atividade Física:</span>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b' }}>
                  Musculação 4 a 5 vezes por semana (treino de hipertrofia de 60 min) + 20 min cardio moderado.
                </p>
              </div>

              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Sono & Descanso:</span>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b' }}>
                  Média de 7 horas por noite, sono reparador, acorda sem cansaço excessivo.
                </p>
              </div>

              <div>
                <span style={{ fontWeight: 700, color: '#334155' }}>Saúde Intestinal:</span>
                <p style={{ margin: '0.2rem 0 0 0', color: '#64748b' }}>
                  Hábito regular (1 a 2 vezes ao dia), Escala de Bristol tipo 3 e 4 (formato cilíndrico e normal).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 6: EXAMES & DOCUMENTOS (DIETSYSTEM LABS)
         ======================================================== */}
      {activeTab === 'exams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              borderRadius: '0.875rem',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                🧪 Painel de Exames Laboratoriais Recentes
              </h3>
              <button
                type="button"
                onClick={() => toast.info('Anexar novo laudo laboratorial ou exame de sangue...')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Plus size={13} />
                <span>Anexar Laudo / Exame</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.75rem' }}>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Biomarcador</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Resultado</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Faixa de Referência Ideal</th>
                    <th style={{ padding: '0.65rem 0.75rem' }}>Classificação</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { marker: 'Glicemia de Jejum', result: '86 mg/dL', ref: '70 a 99 mg/dL', status: 'Ótimo', color: '#16a34a' },
                    { marker: 'Hemoglobina Glicada (HbA1c)', result: '5.1%', ref: '< 5.7%', status: 'Excelente', color: '#16a34a' },
                    { marker: 'Colesterol Total', result: '172 mg/dL', ref: '< 190 mg/dL', status: 'Desejável', color: '#16a34a' },
                    { marker: 'HDL (Bom Colesterol)', result: '58 mg/dL', ref: '> 40 mg/dL', status: 'Alto / Protetor', color: '#16a34a' },
                    { marker: 'Triglicerídeos', result: '92 mg/dL', ref: '< 150 mg/dL', status: 'Excelente', color: '#16a34a' },
                    { marker: 'Vitamina D (25-OH)', result: '38 ng/mL', ref: '30 a 60 ng/mL', status: 'Suficiente', color: '#16a34a' },
                    { marker: 'Ferritina Sérica', result: '115 ng/mL', ref: '30 a 400 ng/mL', status: 'Normal', color: '#16a34a' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#0f172a' }}>{row.marker}</td>
                      <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>{row.result}</td>
                      <td style={{ padding: '0.65rem 0.75rem', color: '#64748b' }}>{row.ref}</td>
                      <td style={{ padding: '0.65rem 0.75rem' }}>
                        <span
                          style={{
                            borderRadius: '9999px',
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            padding: '0.15rem 0.5rem',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            color: row.color,
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
