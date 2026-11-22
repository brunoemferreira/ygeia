import React, { useState, useMemo, useEffect, Component, ErrorInfo, ReactNode } from 'react';
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
  Wand2,
  Split,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { PatientRecord } from './PatientDirectory';
import { AnamneseEditor, AnamneseData } from './AnamneseEditor';
import { useToast } from '../../context/ToastContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AnamneseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AnamneseEditor ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            margin: '2rem',
            border: '1px solid #fee2e2',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <AlertCircle size={24} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Houve uma falha ao renderizar a anamnese
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            Não foi possível exibir os dados da anamnese no momento. Clique abaixo para retornar à lista com segurança.
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              this.props.onReset();
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.55rem 1.25rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} />
            <span>Voltar ao histórico de anamneses</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

  const patientId = String(patient?.id || '1');
  const patientName = patient?.name || (patient as any)?.fullName || 'Paciente';
  const patientInitials =
    patient?.initials ||
    patientName
      .trim()
      .split(/\s+/)
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'PA';

  // Chave de armazenamento no localStorage por paciente
  const storageKey = `ygeia_anamneses_${patientId}`;

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

  // Múltiplas anamneses por paciente & tela de edição
  const [isEditingAnamnese, setIsEditingAnamnese] = useState(false);
  const [editingAnamneseData, setEditingAnamneseData] = useState<AnamneseData | null>(null);

  // Anamneses padrão caso não existam no localStorage
  const getDefaultAnamneses = (): AnamneseData[] => [
    {
      id: 'anamnese_1',
      patientId: patientId,
      title: 'Anamnese criada em 22 de novembro de 2026',
      date: '2026-11-22T08:00:00Z',
      templateType: 'Seções padrão',
      sections: {
        queixaPrincipal: 'Acompanhamento nutricional periódico e modulação da composição corporal.',
        historiaClinica: 'Sem comorbidades relatadas.',
        habitoIntestinal: 'Hábito regular, fezes tipo 4 de Bristol.',
        hidratacao: 'Consumo habitual de 2.5L de água/dia.',
        rotinaAlimentar: 'Café da manhã, almoço e jantar estruturados.',
        sonoAtividadeFisica: '7 a 8 horas de sono reparador. Musculação 4x/semana.',
      },
    },
    {
      id: 'anamnese_2',
      patientId: patientId,
      title: 'Anamnese criada em 22 de novembro de 2026',
      date: '2026-11-22T09:30:00Z',
      templateType: 'Seções padrão',
      sections: {
        queixaPrincipal: 'Reeducação alimentar e ganho de massa magra.',
        historiaClinica: 'Boa tolerância às orientações nutricionais.',
        habitoIntestinal: 'Funcionamento digestivo normal.',
        hidratacao: '2.8L de água/dia.',
        rotinaAlimentar: 'Distribuição calórica fracionada.',
        sonoAtividadeFisica: 'Treino e descanso adequados.',
      },
    },
  ];

  const [anamnesesList, setAnamnesesList] = useState<AnamneseData[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar anamneses do localStorage:', e);
    }
    return getDefaultAnamneses();
  });

  // Atualiza a lista quando o paciente mudar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAnamnesesList(parsed);
          return;
        }
      }
      setAnamnesesList(getDefaultAnamneses());
    } catch (e) {
      console.warn('Erro ao atualizar anamneses:', e);
      setAnamnesesList(getDefaultAnamneses());
    }
  }, [patientId, storageKey]);

  // Persiste no localStorage quando a lista for alterada
  const saveAnamnesesToStorage = (updatedList: AnamneseData[]) => {
    setAnamnesesList(updatedList);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
  };

  // Cálculo de idade amigável a partir da data de nascimento
  const patientAgeString = useMemo(() => {
    if (!patient?.birthDate) return '45 anos e 7 meses';
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
  }, [patient?.birthDate]);

  // Chave identificadora do paciente (chave numérica idêntica ao DietSystem)
  const patientKey = useMemo(() => {
    const rawId = String(patient?.id || patientName || '1000001851');
    const numeric = rawId.replace(/\D/g, '');
    if (numeric.length >= 6) return numeric.slice(-8);
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
      hash = ((hash << 5) - hash) + rawId.charCodeAt(i);
      hash |= 0;
    }
    return String(Math.abs(hash)).padStart(8, '7').slice(-8);
  }, [patient?.id, patientName]);

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

  // Extrair telefone para WhatsApp
  const phoneClean = (patient?.phone || '').replace(/\D/g, '');
  const whatsappUrl = phoneClean
    ? `https://wa.me/${phoneClean.startsWith('55') ? phoneClean : '55' + phoneClean}?text=${encodeURIComponent(
        `Olá, ${patientName}! Aqui é do seu consultório de nutrição.`
      )}`
    : null;

  // Iniciar nova anamnese com template padrão garantido
  const handleStartNewAnamnese = (templateType: string = 'Seções padrão') => {
    let initialSections = {
      queixaPrincipal: 'Acompanhamento nutricional periódico e modulação da composição corporal.',
      historiaClinica: 'Sem comorbidades relatadas. Sem histórico de alergias ou intolerâncias alimentares conhecidas.',
      habitoIntestinal: 'Hábito intestinal regular, fezes tipo 4 da escala de Bristol.',
      hidratacao: 'Consumo habitual de aproximadamente 2,5 litros de água por dia.',
      rotinaAlimentar: 'Café da manhã, almoço, lanche da tarde e jantar estruturados.',
      sonoAtividadeFisica: '7 a 8 horas de sono reparador por noite. Pratica musculação ou aeróbico 4x/semana.',
    };

    if (templateType === 'Anamnese Esportiva') {
      initialSections = {
        queixaPrincipal: 'Objetivo atlético: aumento de VO2 máx, hipertrofia e rendimento competitivo.',
        historiaClinica: 'Sem lesões osteoarticulares recentes. Uso prévio de pré-treino e creatina.',
        habitoIntestinal: 'Hábito regular, Bristol tipo 4, sem desconforto durante provas ou treinos intensos.',
        hidratacao: 'Consumo habitual de 3.5L de água/dia + repositor hidroeletrolítico intra-treino.',
        rotinaAlimentar: 'Carboidratos complexos no pré-treino imediato; aporte proteico de 2.0g/kg distribuído em 5 refeições.',
        sonoAtividadeFisica: 'Treino de corrida 4x/semana + musculação 3x/semana. Sono de 8 horas reparador.',
      };
    } else if (templateType === 'Anamnese Infantil') {
      initialSections = {
        queixaPrincipal: 'Acompanhamento do desenvolvimento pondero-estatural e seletividade alimentar infantil.',
        historiaClinica: 'Histórico de aleitamento materno até os 6 meses. Sem alergias alimentares conhecidas.',
        habitoIntestinal: 'Evacuação diária sem dor ou esforço; consistência pastosa / Bristol 4.',
        hidratacao: 'Consumo de água em copo de transição (~1.2L ao dia) e sucos naturais ocasionais.',
        rotinaAlimentar: 'Café da manhã, lanche escolar, almoço, lanche da tarde e jantar em família.',
        sonoAtividadeFisica: 'Sono de 9 a 10 horas contínuas. Brincadeiras ativas e natação 2x/semana.',
      };
    } else if (templateType === 'Saúde Gastrointestinal') {
      initialSections = {
        queixaPrincipal: 'Sintomas gastrointestinais recorrentes: distensão abdominal pós-prandial e flatulência.',
        historiaClinica: 'Histórico de gastrite leve; sem diagnóstico prévio de SII ou doença celíaca.',
        habitoIntestinal: 'Alternância entre fezes Bristol 3 e 5; desconforto associado a laticínios.',
        hidratacao: 'Ingestão de água fracionada de 2L/dia, redução voluntária de refrigerantes.',
        rotinaAlimentar: 'Investigação inicial pelo protocolo Low-FODMAP; redução de alimentos fermentáveis.',
        sonoAtividadeFisica: 'Sono fragmentado em noites com desconforto gástrico. Caminhadas leves.',
      };
    } else if (templateType === 'Anamnese em Branco') {
      initialSections = {
        queixaPrincipal: '',
        historiaClinica: '',
        habitoIntestinal: '',
        hidratacao: '',
        rotinaAlimentar: '',
        sonoAtividadeFisica: '',
      };
    }

    const now = new Date();
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const newDraft: AnamneseData = {
      id: String(Date.now()),
      patientId: patientId,
      title: `Anamnese criada em ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`,
      date: now.toISOString(),
      templateType,
      sections: initialSections,
    };

    setEditingAnamneseData(newDraft);
    setIsEditingAnamnese(true);
  };

  // Abrir anamnese existente com sanitização defensiva dos campos
  const handleOpenAnamneseForEdit = (item: AnamneseData) => {
    const rawSections = item?.sections || ({} as any);
    const legacyNotes = (item as any)?.notes || '';

    const safeSections = {
      queixaPrincipal:
        typeof rawSections.queixaPrincipal === 'string' && rawSections.queixaPrincipal.trim() !== ''
          ? rawSections.queixaPrincipal
          : legacyNotes || 'Acompanhamento nutricional periódico e modulação da composição corporal.',
      historiaClinica:
        typeof rawSections.historiaClinica === 'string' && rawSections.historiaClinica.trim() !== ''
          ? rawSections.historiaClinica
          : 'Sem comorbidades relatadas. Sem histórico de alergias alimentares.',
      habitoIntestinal:
        typeof rawSections.habitoIntestinal === 'string' && rawSections.habitoIntestinal.trim() !== ''
          ? rawSections.habitoIntestinal
          : 'Hábito intestinal regular, fezes tipo 4 da escala de Bristol.',
      hidratacao:
        typeof rawSections.hidratacao === 'string' && rawSections.hidratacao.trim() !== ''
          ? rawSections.hidratacao
          : 'Consumo habitual de aproximadamente 2,5 litros de água por dia.',
      rotinaAlimentar:
        typeof rawSections.rotinaAlimentar === 'string' && rawSections.rotinaAlimentar.trim() !== ''
          ? rawSections.rotinaAlimentar
          : 'Refeições regulares: café da manhã, almoço, lanche da tarde e jantar.',
      sonoAtividadeFisica:
        typeof rawSections.sonoAtividadeFisica === 'string' && rawSections.sonoAtividadeFisica.trim() !== ''
          ? rawSections.sonoAtividadeFisica
          : '7 a 8 horas de sono de boa qualidade. Pratica atividade física regular.',
    };

    const sanitizedData: AnamneseData = {
      ...item,
      templateType: item?.templateType || 'Seções padrão',
      sections: safeSections,
    };

    setEditingAnamneseData(sanitizedData);
    setIsEditingAnamnese(true);
  };

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

  // Se o usuário estiver preenchendo/editando uma anamnese, exibe a tela do editor completa protegida por ErrorBoundary
  if (isEditingAnamnese) {
    return (
      <AnamneseErrorBoundary
        onReset={() => {
          setIsEditingAnamnese(false);
          setEditingAnamneseData(null);
        }}
      >
        <AnamneseEditor
          patient={patient}
          patientAgeString={patientAgeString}
          initialData={editingAnamneseData}
          onBack={() => {
            setIsEditingAnamnese(false);
            setEditingAnamneseData(null);
          }}
          onSave={(saved) => {
            const index = anamnesesList.findIndex((a) => a.id === saved.id);
            let updated: AnamneseData[];
            if (index >= 0) {
              updated = [...anamnesesList];
              updated[index] = saved;
            } else {
              updated = [saved, ...anamnesesList];
            }
            saveAnamnesesToStorage(updated);
            setIsEditingAnamnese(false);
            setEditingAnamneseData(null);
          }}
        />
      </AnamneseErrorBoundary>
    );
  }

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
            {patientInitials}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                {patientName}
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
                                  handleStartNewAnamnese('Seções padrão');
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
                    onClick={() => handleStartNewAnamnese('Seções padrão')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      borderRadius: '0.375rem',
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
                  </button>
                </div>
              </div>

              {/* Lista ou Empty State da Imagem do DietSystem */}
              {anamnesesList.length === 0 ? (
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
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {anamnesesList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenAnamneseForEdit(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 0.75rem',
                        borderRadius: '0.5rem',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                      onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                    >
                      {/* Título: Anamnese criada em 22 de novembro de 2026 */}
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#0f172a',
                        }}
                      >
                        {item.title}
                      </span>

                      {/* 6 Botões de Ação Idênticos à Imagem */}
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 1. Assistente IA / Resumo (Roxo) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info('Gerando análise clínica e resumo de conduta com IA...');
                          }}
                          title="Análise com Inteligência Artificial"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '0.375rem',
                            border: '1px solid #ddd6fe',
                            backgroundColor: '#f5f3ff',
                            color: '#8b5cf6',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ede9fe')}
                          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f5f3ff')}
                        >
                          <Wand2 size={14} />
                        </button>

                        {/* 2. Calendário / Data da Consulta */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info('Data da consulta registrada: ' + item.date);
                          }}
                          title="Data da consulta"
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
                          <Calendar size={14} />
                        </button>

                        {/* 3. Baixar PDF */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success('Baixando PDF formatado desta anamnese...');
                          }}
                          title="Baixar PDF da anamnese"
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
                          <Download size={14} />
                        </button>

                        {/* 4. Comparar / Duplicar */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info('Comparar evolução com consultas anteriores...');
                          }}
                          title="Comparar evolução clínica"
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
                          <Split size={14} />
                        </button>

                        {/* 5. Editar Anamnese */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAnamneseForEdit(item);
                          }}
                          title="Editar anamnese"
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
                          <Edit2 size={14} />
                        </button>

                        {/* 6. Excluir Anamnese */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = anamnesesList.filter((a) => a.id !== item.id);
                            saveAnamnesesToStorage(updated);
                            toast.success('Anamnese excluída com sucesso.');
                          }}
                          title="Excluir anamnese"
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
                            (e.currentTarget as HTMLElement).style.backgroundColor = '#fff1f2';
                            (e.currentTarget as HTMLElement).style.borderColor = '#fecdd3';
                            (e.currentTarget as HTMLElement).style.color = '#e11d48';
                          }}
                          onMouseOut={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                            (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                            (e.currentTarget as HTMLElement).style.color = '#64748b';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
