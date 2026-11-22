import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Copy,
  Clock,
  DollarSign,
  MoreHorizontal,
  Folder,
  User,
  Utensils,
  Activity,
  Calendar,
  CheckSquare,
  Smartphone,
  Download,
  Link2,
  Trash2,
  Edit2,
  MessageCircle,
  ClipboardList,
} from 'lucide-react';
import { PatientRecord } from './PatientDirectory';
import { useToast } from '../../context/ToastContext';

export interface PatientProfileViewProps {
  patient: PatientRecord;
  onBack: () => void;
  onEdit: (patient: PatientRecord) => void;
  onDelete?: (patientId: string) => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  patient,
  onBack,
  onEdit,
  onDelete,
}) => {
  const { toast } = useToast();

  // Seção ativa
  const [activeSection, setActiveSection] = useState<string>('anamnese_transcricao');

  // Estado de grupos do menu expandidos
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    avaliacao_nutricional: true,
    antropometria: true,
    prescricao_dietetica: false,
    avaliacao_bioquimica: false,
    pos_consulta: false,
    arquivos_paciente: false,
  });

  // Busca de seções no menu lateral
  const [sectionSearch, setSectionSearch] = useState('');

  // Dropdown de mais ações no topo
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Lista dinâmica de anamneses adicionadas
  const [anamneses, setAnamneses] = useState<Array<{ id: string; date: string; title: string; notes: string }>>([]);
  const [showAddAnamneseModal, setShowAddAnamneseModal] = useState(false);
  const [newAnamneseTitle, setNewAnamneseTitle] = useState('');
  const [newAnamneseNotes, setNewAnamneseNotes] = useState('');

  // Cálculo de idade amigável a partir da data de nascimento
  const patientAgeString = useMemo(() => {
    if (!patient.birthDate) return '45 anos e 7 meses';
    try {
      let bDate: Date;
      if (patient.birthDate.includes('/')) {
        const [d, m, y] = patient.birthDate.split('/');
        bDate = new Date(Number(y), Number(m) - 1, Number(d));
      } else {
        bDate = new Date(patient.birthDate);
      }
      if (isNaN(bDate.getTime())) return '45 anos e 7 meses';

      const now = new Date();
      let years = now.getFullYear() - bDate.getFullYear();
      let months = now.getMonth() - bDate.getMonth();
      if (months < 0 || (months === 0 && now.getDate() < bDate.getDate())) {
        years--;
        months += 12;
      }
      return `${years} anos e ${months} meses`;
    } catch {
      return '45 anos e 7 meses';
    }
  }, [patient.birthDate]);

  // Chave identificadora do paciente (chave numérica idêntica ao DietSystem)
  const patientKey = useMemo(() => {
    const numeric = (patient.id || '').replace(/\D/g, '');
    if (numeric.length >= 6) return numeric.slice(-8);
    let hash = 0;
    for (let i = 0; i < (patient.id || patient.name).length; i++) {
      hash = ((hash << 5) - hash) + (patient.id || patient.name).charCodeAt(i);
      hash |= 0;
    }
    return String(Math.abs(hash)).padStart(8, '7').slice(-8);
  }, [patient.id, patient.name]);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(patientKey);
    toast.success(`Chave ${patientKey} copiada para a área de transferência!`);
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const handleSaveAnamnese = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnamneseTitle.trim()) return;

    const entry = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      title: newAnamneseTitle.trim(),
      notes: newAnamneseNotes.trim() || 'Consulta clínica geral e avaliação de recordatório.',
    };

    setAnamneses([entry, ...anamneses]);
    setNewAnamneseTitle('');
    setNewAnamneseNotes('');
    setShowAddAnamneseModal(false);
    toast.success('Anamnese registrada com sucesso!');
  };

  // Extrair telefone para WhatsApp
  const phoneClean = (patient.phone || '').replace(/\D/g, '');
  const whatsappUrl = phoneClean
    ? `https://wa.me/${phoneClean.startsWith('55') ? phoneClean : '55' + phoneClean}?text=${encodeURIComponent(
        `Olá, ${patient.name}! Aqui é do seu consultório de nutrição.`
      )}`
    : null;

  // Definição das seções do menu lateral
  const menuGroups = [
    {
      type: 'group',
      id: 'avaliacao_nutricional',
      label: 'Avaliação nutricional',
      icon: ClipboardList,
      children: [
        { id: 'anamnese_transcricao', label: 'Anamnese e transcrição', hasPlus: true },
        { id: 'recordatorio_alimentar', label: 'Recordatório alimentar', hasPlus: true },
        { id: 'prontuario', label: 'Prontuário', hasPlus: true },
        { id: 'restricoes_alimentares', label: 'Restrições alimentares', hasPlus: false },
        { id: 'medicamentos', label: 'Medicamentos', hasPlus: false, badge: 'Novidade' },
      ],
    },
    {
      type: 'group',
      id: 'antropometria',
      label: 'Antropometria',
      icon: User,
      children: [
        { id: 'antropo_adulto', label: 'Adulto', hasPlus: true },
        { id: 'antropo_crianca', label: 'Criança e adolescente', hasPlus: true },
        { id: 'antropo_gestante', label: 'Gestante', hasPlus: true },
        { id: 'antropo_bioimpedancia', label: 'Bioimpedância', hasPlus: true },
        { id: 'antropo_bodyscan', label: 'BodyScan 3D', hasPlus: true },
        { id: 'antropo_glp1', label: 'Reganho GLP-1', hasPlus: true, badge: 'Novidade' },
      ],
    },
    {
      type: 'group',
      id: 'prescricao_dietetica',
      label: 'Prescrição dietética',
      icon: Utensils,
      children: [
        { id: 'gasto_calorico', label: 'Gasto calórico', hasPlus: true },
        { id: 'plano_alimentar', label: 'Plano alimentar', hasPlus: true },
        { id: 'orientacoes', label: 'Orientações', hasPlus: false },
        { id: 'receitas', label: 'Receitas', hasPlus: false },
        { id: 'produtos', label: 'Produtos', hasPlus: false },
        { id: 'formulas', label: 'Fórmulas', hasPlus: true },
      ],
    },
    {
      type: 'group',
      id: 'avaliacao_bioquimica',
      label: 'Avaliação bioquímica',
      icon: Activity,
      children: [
        { id: 'upload_exame', label: 'Upload de exame', hasPlus: true },
        { id: 'solicitar_exames', label: 'Solicitar exames', hasPlus: true },
        { id: 'exames_texto', label: 'Exames por texto', hasPlus: true },
        { id: 'analise_ia', label: 'Análise de exames por IA', hasPlus: true },
      ],
    },
    {
      type: 'group',
      id: 'pos_consulta',
      label: 'Pós-consulta',
      icon: Calendar,
      children: [
        { id: 'pos_hidratacao', label: 'Hidratação', hasPlus: true },
        { id: 'foto_comparativa', label: 'Foto comparativa', hasPlus: false },
        { id: 'pos_metas', label: 'Metas', hasPlus: false },
        { id: 'formulario', label: 'Formulário', hasPlus: true },
        { id: 'materiais_ebooks', label: 'Ebooks, imagens, etc', hasPlus: false },
      ],
    },
    {
      type: 'group',
      id: 'arquivos_paciente',
      label: 'Arquivos do paciente',
      icon: Folder,
      children: [
        { id: 'arquivo_recibo', label: 'Recibo', hasPlus: true },
        { id: 'arquivo_atestado', label: 'Atestado', hasPlus: true },
        { id: 'arquivo_contrato', label: 'Contrato', hasPlus: false },
        { id: 'arquivo_encaminhamento', label: 'Encaminhamento', hasPlus: true },
        { id: 'docs_compartilhados', label: 'Documentos compartilhados', hasPlus: false },
      ],
    },
    {
      type: 'single',
      id: 'checklist_condutas',
      label: 'Checklist de condutas',
      icon: CheckSquare,
    },
    {
      type: 'single',
      id: 'aplicativo_paciente',
      label: 'Aplicativo do paciente',
      icon: Smartphone,
    },
    {
      type: 'single',
      id: 'download_pdf',
      label: "Download ou envio de PDF's",
      icon: Download,
    },
  ];

  // Filtro de seções pela busca
  const filteredMenuGroups = useMemo(() => {
    if (!sectionSearch.trim()) return menuGroups;
    const q = sectionSearch.toLowerCase();
    return menuGroups
      .map((item) => {
        if (item.type === 'single') {
          return item.label.toLowerCase().includes(q) ? item : null;
        }
        const matchingChildren = item.children?.filter((c) => c.label.toLowerCase().includes(q));
        if (item.label.toLowerCase().includes(q) || (matchingChildren && matchingChildren.length > 0)) {
          return {
            ...item,
            children: matchingChildren && matchingChildren.length > 0 ? matchingChildren : item.children,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof menuGroups;
  }, [sectionSearch]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        margin: '-1rem -1.25rem',
        boxSizing: 'border-box',
      }}
    >
      {/* ========================================================
          1. HEADER SUPERIOR FIXO (MODELO DIETSYSTEM)
         ======================================================== */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Esquerda: Botão Voltar + Avatar + Nome + Idade/Chave */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <button
            type="button"
            onClick={onBack}
            title="Voltar para a lista de pacientes"
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
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
              (e.currentTarget as HTMLElement).style.color = '#0f172a';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
              (e.currentTarget as HTMLElement).style.color = '#64748b';
            }}
          >
            <ArrowLeft size={16} />
          </button>

          {/* Avatar com iniciais */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '0.5rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: '#334155',
              flexShrink: 0,
            }}
          >
            {patient.initials || 'JS'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                {patient.name}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.15rem 0.55rem',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  letterSpacing: '0.04em',
                }}
              >
                <span
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                  }}
                />
                {patient.status ? patient.status.toUpperCase() : 'ATIVO'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '0.1rem',
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
            onClick={() => {
              setActiveSection('arquivo_recibo');
              setExpandedGroups((prev) => ({ ...prev, arquivos_paciente: true }));
            }}
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
            onClick={() => {
              setActiveSection('prontuario');
              setExpandedGroups((prev) => ({ ...prev, avaliacao_nutricional: true }));
            }}
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

      {/* ========================================================
          2. CORPO PRINCIPAL COM SIDEBAR À ESQUERDA E WORKSPACE À DIREITA
         ======================================================== */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)' }}>
        {/* SIDEBAR DE NAVEGAÇÃO CLÍNICA (MODELO DIETSYSTEM) */}
        <aside
          style={{
            width: '260px',
            minWidth: '260px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #f1f5f9',
            padding: '1rem 0.65rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
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
              gap: '0.45rem',
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0',
              padding: '0.45rem 0.65rem',
              marginBottom: '0.65rem',
              backgroundColor: '#ffffff',
            }}
          >
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar seção..."
              value={sectionSearch}
              onChange={(e) => setSectionSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.78125rem',
                color: '#0f172a',
                width: '100%',
                backgroundColor: 'transparent',
              }}
            />
          </div>

          {/* Itens do Menu Lateral */}
          {filteredMenuGroups.map((item) => {
            if (item.type === 'single') {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : '#334155',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.1s ease',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={15} color={isActive ? 'var(--primary)' : '#64748b'} />
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                </button>
              );
            }

            // Grupo com filhos colapsáveis
            const GroupIcon = item.icon;
            const isExpanded = expandedGroups[item.id] ?? false;
            const hasActiveChild = item.children?.some((c) => c.id === activeSection);

            return (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: 'transparent',
                    color: hasActiveChild ? 'var(--primary)' : '#334155',
                    fontWeight: hasActiveChild ? 700 : 500,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                  onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                >
                  {/* Linha vertical verde indicadora do grupo ativo */}
                  {hasActiveChild && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '4px',
                        bottom: '4px',
                        width: '3px',
                        borderRadius: '0 2px 2px 0',
                        backgroundColor: 'var(--primary)',
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <GroupIcon size={15} color={hasActiveChild ? 'var(--primary)' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>

                  {isExpanded ? (
                    <ChevronDown size={14} color="#94a3b8" />
                  ) : (
                    <ChevronRight size={14} color="#94a3b8" />
                  )}
                </button>

                {/* Subitens colapsáveis */}
                {isExpanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingLeft: '1.25rem',
                      gap: '0.15rem',
                      marginTop: '0.1rem',
                    }}
                  >
                    {item.children?.map((sub) => {
                      const isSubActive = activeSection === sub.id;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => setActiveSection(sub.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.4rem 0.65rem',
                            borderRadius: '0.375rem',
                            backgroundColor: isSubActive ? 'var(--primary-light)' : 'transparent',
                            color: isSubActive ? 'var(--primary)' : '#475569',
                            fontWeight: isSubActive ? 600 : 400,
                            fontSize: '0.78125rem',
                            cursor: 'pointer',
                            transition: 'all 0.1s ease',
                          }}
                          onMouseOver={(e) => {
                            if (!isSubActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                          }}
                          onMouseOut={(e) => {
                            if (!isSubActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>•</span>
                            <span>{sub.label}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            {sub.badge && (
                              <span
                                style={{
                                  fontSize: '0.625rem',
                                  fontWeight: 700,
                                  color: 'var(--primary)',
                                  backgroundColor: 'var(--primary-light)',
                                  borderRadius: '0.25rem',
                                  padding: '0.1rem 0.35rem',
                                }}
                              >
                                {sub.badge}
                              </span>
                            )}
                            {sub.hasPlus && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveSection(sub.id);
                                  if (sub.id === 'anamnese_transcricao') {
                                    setShowAddAnamneseModal(true);
                                  } else {
                                    toast.info(`Adicionar novo item em: ${sub.label}`);
                                  }
                                }}
                                title={`Adicionar em ${sub.label}`}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--primary)',
                                  cursor: 'pointer',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Plus size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* WORKSPACE PRINCIPAL À DIREITA */}
        <main
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            padding: '1.75rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* ========================================================
              SEÇÃO: ANAMNESE E TRANSCRIÇÃO (EXATA DA IMAGEM)
             ======================================================== */}
          {activeSection === 'anamnese_transcricao' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
              {/* Cabeçalho da Seção */}
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
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Anamneses e transcrições
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                    Anamneses e gravações das consultas do paciente
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <button
                    type="button"
                    onClick={() => toast.info('Gerando PDF unificado de anamneses do paciente...')}
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
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
                  >
                    <Link2 size={14} color="#64748b" />
                    <span>PDF unificado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAddAnamneseModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      borderRadius: '0.375rem',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px var(--primary-border)',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
                  >
                    <Plus size={15} />
                    <span>Adicionar anamnese</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Lista ou Empty State da Imagem do DietSystem */}
              {anamneses.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    minHeight: '320px',
                    gap: '0.85rem',
                  }}
                >
                  {/* Ícone de pasta cinza minimalist da imagem */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8',
                    }}
                  >
                    <Folder size={48} strokeWidth={1.25} />
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                    Nenhuma anamnese ou transcrição registrada.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {anamneses.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        borderRadius: '0.625rem',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                        padding: '1rem 1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.date}</span>
                      </div>
                      <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                        {item.notes}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              SEÇÃO: PRONTUÁRIO & EVOLUÇÃO CLÍNICA
             ======================================================== */}
          {activeSection === 'prontuario' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Prontuário & Linha do Tempo Clínica
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Evoluções registradas, histórico de condutas e anotações clínicas
                </p>
              </div>

              <div
                style={{
                  borderRadius: '0.625rem',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  backgroundColor: '#f8fafc',
                }}
              >
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  ✍️ Registro de Evolução Clínica Rápida
                </h3>
                <textarea
                  placeholder="Digite a evolução clínica do paciente hoje..."
                  rows={3}
                  style={{
                    width: '100%',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    padding: '0.5rem',
                    fontSize: '0.8125rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => toast.success('Evolução clínica adicionada ao prontuário!')}
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.78125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
                    onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
                  >
                    Salvar no Prontuário
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SEÇÃO: PLANO ALIMENTAR & GASTO CALÓRICO
             ======================================================== */}
          {(activeSection === 'plano_alimentar' || activeSection === 'gasto_calorico') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Plano Alimentar & Prescrição
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                    Metas calóricas diárias, distribuição de macronutrientes e refeições
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toast.success('Gerando PDF do plano alimentar...')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0',
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#166534' }}>Meta Diária</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#14532d', marginTop: '0.15rem' }}>2.150 kcal</div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#1e40af' }}>Carboidratos</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.15rem' }}>242g (45%)</div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#166534' }}>Proteínas</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#14532d', marginTop: '0.15rem' }}>162g (30%)</div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#92400e' }}>Lipídios</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#78350f', marginTop: '0.15rem' }}>60g (25%)</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              SEÇÃO: ANTROPOMETRIA & BIOIMPEDÂNCIA
             ======================================================== */}
          {activeSection.startsWith('antropo_') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Avaliação Antropométrica & Composição Corporal
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                  Histórico de pesagem, bioimpedância, dobras cutâneas e perímetros
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Peso Atual</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>78.4 kg</div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>IMC</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>24.2 kg/m²</div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Gordura Corporal</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>16.8%</div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Massa Muscular</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>65.2 kg</div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              QUALQUER OUTRA SEÇÃO SELECIONADA
             ======================================================== */}
          {!['anamnese_transcricao', 'prontuario', 'plano_alimentar', 'gasto_calorico'].includes(activeSection) &&
            !activeSection.startsWith('antropo_') && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  minHeight: '320px',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <Folder size={48} strokeWidth={1.25} />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                  Nenhum registro encontrado nesta seção.
                </p>
                <button
                  type="button"
                  onClick={() => toast.info('Adicionar novo registro')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
                  onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
                >
                  <Plus size={14} />
                  <span>Adicionar registro</span>
                </button>
              </div>
            )}
        </main>
      </div>

      {/* ========================================================
          MODAL: ADICIONAR ANAMNESE (POPUP)
         ======================================================== */}
      {showAddAnamneseModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
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
              borderRadius: '0.75rem',
              maxWidth: '520px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Nova Anamnese ou Gravação
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 1rem 0' }}>
              Registre uma nova transcrição ou anotação de consulta para {patient.name}.
            </p>

            <form onSubmit={handleSaveAnamnese}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Título da Anamnese *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Primeira Consulta Nutricional, Retorno de 30 dias..."
                  value={newAnamneseTitle}
                  onChange={(e) => setNewAnamneseTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                  Anotações / Transcrição Clínica
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva o histórico, hábitos, queixas ou transcrição de áudio..."
                  value={newAnamneseNotes}
                  onChange={(e) => setNewAnamneseNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8125rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddAnamneseModal(false)}
                  style={{
                    borderRadius: '0.375rem',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    borderRadius: '0.375rem',
                    border: 'none',
                    backgroundColor: 'var(--primary)',
                    padding: '0.45rem 1rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
                  onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
                >
                  Salvar Anamnese
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
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
              borderRadius: '0.75rem',
              maxWidth: '400px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              Confirmar Exclusão
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              Tem certeza que deseja remover o paciente <strong>{patient.name}</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                style={{
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#64748b',
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
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: '#e11d48',
                  padding: '0.45rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
