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
  Trash2,
  Edit2,
  MessageCircle,
  ClipboardList,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  Ban,
} from 'lucide-react';
import { PatientRecord } from './PatientDirectory';
import { AnamneseEditor, AnamneseData } from './AnamneseEditor';
import { useToast } from '../../context/ToastContext';
import { ClinicalDataGrid, ClinicalRecordItem, AppModal, AppInput, AppSelect, AppTextarea } from '../ui';

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

export interface RecallItem {
  id: string;
  title: string;
  date: string;
  templateType: string;
  notes?: string;
}

export interface ProntuarioItem {
  id: string;
  title: string;
  date: string;
  templateType: string;
  notes?: string;
}

export interface FoodRestriction {
  id: string;
  foodOrSubstance: string;
  reason: 'Alergia' | 'Intolerância' | 'Não Gosta' | 'Outra restrição';
  status: 'Ativa' | 'Inativa';
  origin: string;
  observation?: string;
  createdAt: string;
}

const getDefaultRecalls = (): RecallItem[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: `Recordatório 24 Horas - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`,
      date: now.toISOString(),
      templateType: 'Recordatório 24 Horas',
      notes: 'Consumo habitual com boa ingestão de água (2.2L). Café da manhã: Pão integral com queijo branco e café com leite. Almoço: Arroz, feijão, filé de frango e salada mista. Lanche da tarde: Iogurte com aveia. Jantar: Sopa de legumes com carne magra.',
    },
  ];
};

const getDefaultProntuario = (): ProntuarioItem[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: `Evolução Clínica e Conduta - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`,
      date: now.toISOString(),
      templateType: 'Evolução Clínica',
      notes: 'Primeira consulta de acolhimento. Paciente apresenta boa adesão e motivação para recomposição corporal e melhora gastrointestinal. Estabelecido plano inicial com déficit calórico moderado.',
    },
  ];
};

const getDefaultRestrictions = (): FoodRestriction[] => [
  {
    id: '1',
    foodOrSubstance: 'Camarão e Frutos do Mar',
    reason: 'Alergia',
    status: 'Ativa',
    origin: 'Relatado pelo paciente',
    observation: 'Edema de glote e urticária imediata após contato.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    foodOrSubstance: 'Leite de vaca / Lactose',
    reason: 'Intolerância',
    status: 'Ativa',
    origin: 'Avaliação clínica',
    observation: 'Distensão abdominal e desconforto digestivo moderado.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    foodOrSubstance: 'Coentro',
    reason: 'Não Gosta',
    status: 'Ativa',
    origin: 'Relatado pelo paciente',
    observation: 'Aversão ao sabor característico.',
    createdAt: new Date().toISOString(),
  },
];

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

  // Itens mapeados para o padrão ClinicalDataGrid (focado na Data da Consulta e Ações Rápidas)
  const clinicalAnamnesesItems: ClinicalRecordItem[] = useMemo(() => {
    return anamnesesList.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      templateType: item.templateType || 'Seções padrão',
      raw: item,
    }));
  }, [anamnesesList]);

  // ========================================================
  // RECURSOS LONGITUDINAIS: RECORDATÓRIO, PRONTUÁRIO & RESTRIÇÕES
  // ========================================================
  const recallStorageKey = `ygeia_recalls_${patientId}`;
  const prontuarioStorageKey = `ygeia_prontuario_${patientId}`;
  const restrictionStorageKey = `ygeia_restrictions_${patientId}`;

  // Recordatórios Alimentares
  const [recallsList, setRecallsList] = useState<RecallItem[]>(() => {
    try {
      const stored = localStorage.getItem(`ygeia_recalls_${patientId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getDefaultRecalls();
  });
  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [editingRecall, setEditingRecall] = useState<RecallItem | null>(null);
  const [recallForm, setRecallForm] = useState<{ title: string; templateType: string; date: string; notes: string }>({
    title: '',
    templateType: 'Recordatório 24 Horas',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const saveRecallsToStorage = (updated: RecallItem[]) => {
    setRecallsList(updated);
    try {
      localStorage.setItem(recallStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar recordatórios:', e);
    }
  };

  const clinicalRecallsItems: ClinicalRecordItem[] = useMemo(() => {
    return recallsList.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      templateType: item.templateType || 'Recordatório 24 Horas',
      raw: item,
    }));
  }, [recallsList]);

  // Prontuário & Evolução Clínica
  const [prontuarioList, setProntuarioList] = useState<ProntuarioItem[]>(() => {
    try {
      const stored = localStorage.getItem(`ygeia_prontuario_${patientId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getDefaultProntuario();
  });
  const [isProntuarioModalOpen, setIsProntuarioModalOpen] = useState(false);
  const [editingProntuario, setEditingProntuario] = useState<ProntuarioItem | null>(null);
  const [prontuarioForm, setProntuarioForm] = useState<{ title: string; templateType: string; date: string; notes: string }>({
    title: '',
    templateType: 'Evolução Clínica',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const saveProntuarioToStorage = (updated: ProntuarioItem[]) => {
    setProntuarioList(updated);
    try {
      localStorage.setItem(prontuarioStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar prontuário:', e);
    }
  };

  const clinicalProntuarioItems: ClinicalRecordItem[] = useMemo(() => {
    return prontuarioList.map((item) => ({
      id: item.id,
      title: item.title,
      date: item.date,
      templateType: item.templateType || 'Evolução Clínica',
      raw: item,
    }));
  }, [prontuarioList]);

  // Restrições Alimentares
  const [restrictionsList, setRestrictionsList] = useState<FoodRestriction[]>(() => {
    try {
      const stored = localStorage.getItem(`ygeia_restrictions_${patientId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getDefaultRestrictions();
  });
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);
  const [editingRestriction, setEditingRestriction] = useState<FoodRestriction | null>(null);
  const [restrictionForm, setRestrictionForm] = useState<{
    foodOrSubstance: string;
    reason: 'Alergia' | 'Intolerância' | 'Não Gosta' | 'Outra restrição';
    status: 'Ativa' | 'Inativa';
    origin: string;
    observation: string;
  }>({
    foodOrSubstance: '',
    reason: 'Alergia',
    status: 'Ativa',
    origin: 'Relatado pelo paciente',
    observation: '',
  });
  const [restrictionSearchQuery, setRestrictionSearchQuery] = useState('');
  const [restrictionFilterReason, setRestrictionFilterReason] = useState('ALL');
  const [restrictionFilterStatus, setRestrictionFilterStatus] = useState('ALL');

  const saveRestrictionsToStorage = (updated: FoodRestriction[]) => {
    setRestrictionsList(updated);
    try {
      localStorage.setItem(restrictionStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar restrições:', e);
    }
  };

  const filteredRestrictions = useMemo(() => {
    return restrictionsList.filter((r) => {
      const q = restrictionSearchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.foodOrSubstance.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        (r.observation && r.observation.toLowerCase().includes(q));

      const matchesReason = restrictionFilterReason === 'ALL' || r.reason === restrictionFilterReason;
      const matchesStatus = restrictionFilterStatus === 'ALL' || r.status === restrictionFilterStatus;

      return matchesQuery && matchesReason && matchesStatus;
    });
  }, [restrictionsList, restrictionSearchQuery, restrictionFilterReason, restrictionFilterStatus]);

  // Ações de Recordatório
  const handleOpenNewRecallModal = () => {
    const now = new Date();
    setEditingRecall(null);
    setRecallForm({
      title: `Recordatório 24 Horas - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`,
      templateType: 'Recordatório 24 Horas',
      date: now.toISOString().split('T')[0],
      notes: '',
    });
    setIsRecallModalOpen(true);
  };

  const handleEditRecall = (item: RecallItem) => {
    setEditingRecall(item);
    setRecallForm({
      title: item.title,
      templateType: item.templateType || 'Recordatório 24 Horas',
      date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: item.notes || '',
    });
    setIsRecallModalOpen(true);
  };

  const handleSaveRecall = () => {
    if (!recallForm.title.trim()) {
      toast.error('Informe um título para o recordatório alimentar.');
      return;
    }
    if (editingRecall) {
      const updated = recallsList.map((r) =>
        r.id === editingRecall.id
          ? {
              ...r,
              title: recallForm.title.trim(),
              templateType: recallForm.templateType,
              date: new Date(recallForm.date).toISOString(),
              notes: recallForm.notes,
            }
          : r
      );
      saveRecallsToStorage(updated);
      toast.success('Recordatório alimentar atualizado com sucesso.');
    } else {
      const newRecall: RecallItem = {
        id: String(Date.now()),
        title: recallForm.title.trim(),
        templateType: recallForm.templateType,
        date: new Date(recallForm.date).toISOString(),
        notes: recallForm.notes,
      };
      saveRecallsToStorage([newRecall, ...recallsList]);
      toast.success('Novo recordatório alimentar registrado com sucesso.');
    }
    setIsRecallModalOpen(false);
  };

  const handleDeleteRecall = (id: string) => {
    const updated = recallsList.filter((r) => r.id !== id);
    saveRecallsToStorage(updated);
    toast.success('Recordatório alimentar excluído.');
  };

  // Ações de Prontuário
  const handleOpenNewProntuarioModal = () => {
    const now = new Date();
    setEditingProntuario(null);
    setProntuarioForm({
      title: `Evolução Clínica - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`,
      templateType: 'Evolução Clínica',
      date: now.toISOString().split('T')[0],
      notes: '',
    });
    setIsProntuarioModalOpen(true);
  };

  const handleEditProntuario = (item: ProntuarioItem) => {
    setEditingProntuario(item);
    setProntuarioForm({
      title: item.title,
      templateType: item.templateType || 'Evolução Clínica',
      date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: item.notes || '',
    });
    setIsProntuarioModalOpen(true);
  };

  const handleSaveProntuario = () => {
    if (!prontuarioForm.title.trim()) {
      toast.error('Informe o título da evolução clínica.');
      return;
    }
    if (editingProntuario) {
      const updated = prontuarioList.map((p) =>
        p.id === editingProntuario.id
          ? {
              ...p,
              title: prontuarioForm.title.trim(),
              templateType: prontuarioForm.templateType,
              date: new Date(prontuarioForm.date).toISOString(),
              notes: prontuarioForm.notes,
            }
          : p
      );
      saveProntuarioToStorage(updated);
      toast.success('Registro do prontuário atualizado com sucesso.');
    } else {
      const newProntuario: ProntuarioItem = {
        id: String(Date.now()),
        title: prontuarioForm.title.trim(),
        templateType: prontuarioForm.templateType,
        date: new Date(prontuarioForm.date).toISOString(),
        notes: prontuarioForm.notes,
      };
      saveProntuarioToStorage([newProntuario, ...prontuarioList]);
      toast.success('Evolução clínica adicionada ao prontuário.');
    }
    setIsProntuarioModalOpen(false);
  };

  const handleDeleteProntuario = (id: string) => {
    const updated = prontuarioList.filter((p) => p.id !== id);
    saveProntuarioToStorage(updated);
    toast.success('Registro do prontuário excluído.');
  };

  // Ações de Restrições Alimentares
  const handleOpenNewRestrictionModal = () => {
    setEditingRestriction(null);
    setRestrictionForm({
      foodOrSubstance: '',
      reason: 'Alergia',
      status: 'Ativa',
      origin: 'Relatado pelo paciente',
      observation: '',
    });
    setIsRestrictionModalOpen(true);
  };

  const handleEditRestriction = (item: FoodRestriction) => {
    setEditingRestriction(item);
    setRestrictionForm({
      foodOrSubstance: item.foodOrSubstance,
      reason: item.reason,
      status: item.status,
      origin: item.origin || 'Relatado pelo paciente',
      observation: item.observation || '',
    });
    setIsRestrictionModalOpen(true);
  };

  const handleSaveRestriction = () => {
    if (!restrictionForm.foodOrSubstance.trim()) {
      toast.error('O alimento ou substância é obrigatório.');
      return;
    }
    if (!restrictionForm.reason) {
      toast.error('O motivo da restrição é obrigatório.');
      return;
    }

    if (editingRestriction) {
      const updated = restrictionsList.map((r) =>
        r.id === editingRestriction.id
          ? {
              ...r,
              foodOrSubstance: restrictionForm.foodOrSubstance.trim(),
              reason: restrictionForm.reason,
              status: restrictionForm.status,
              origin: restrictionForm.origin,
              observation: restrictionForm.observation.trim() || undefined,
            }
          : r
      );
      saveRestrictionsToStorage(updated);
      toast.success('Restrição alimentar atualizada com sucesso.');
    } else {
      const newRestriction: FoodRestriction = {
        id: String(Date.now()),
        foodOrSubstance: restrictionForm.foodOrSubstance.trim(),
        reason: restrictionForm.reason,
        status: restrictionForm.status,
        origin: restrictionForm.origin,
        observation: restrictionForm.observation.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      saveRestrictionsToStorage([newRestriction, ...restrictionsList]);
      toast.success('Restrição alimentar cadastrada com sucesso.');
    }
    setIsRestrictionModalOpen(false);
  };

  const handleDeleteRestriction = (id: string) => {
    const updated = restrictionsList.filter((r) => r.id !== id);
    saveRestrictionsToStorage(updated);
    toast.success('Restrição alimentar removida com sucesso.');
  };

  const handleToggleRestrictionStatus = (item: FoodRestriction) => {
    const newStatus: 'Ativa' | 'Inativa' = item.status === 'Ativa' ? 'Inativa' : 'Ativa';
    const updated = restrictionsList.map((r) => (r.id === item.id ? { ...r, status: newStatus } : r));
    saveRestrictionsToStorage(updated);
    toast.info(`Situação de "${item.foodOrSubstance}" alterada para ${newStatus}.`);
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

  // Iniciar nova anamnese com template padrão carregado (títulos para preenchimento)
  const handleStartNewAnamnese = (templateType: string = 'Seções padrão') => {
    let initialSections = {
      queixaPrincipal: '',
      historiaClinica: '',
      habitoIntestinal: '',
      hidratacao: '',
      rotinaAlimentar: '',
      sonoAtividadeFisica: '',
    };

    if (templateType === 'Anamnese Esportiva') {
      initialSections = {
        queixaPrincipal: '',
        historiaClinica: '',
        habitoIntestinal: '',
        hidratacao: '',
        rotinaAlimentar: '',
        sonoAtividadeFisica: '',
      };
    } else if (templateType === 'Anamnese Infantil') {
      initialSections = {
        queixaPrincipal: '',
        historiaClinica: '',
        habitoIntestinal: '',
        hidratacao: '',
        rotinaAlimentar: '',
        sonoAtividadeFisica: '',
      };
    } else if (templateType === 'Saúde Gastrointestinal') {
      initialSections = {
        queixaPrincipal: '',
        historiaClinica: '',
        habitoIntestinal: '',
        hidratacao: '',
        rotinaAlimentar: '',
        sonoAtividadeFisica: '',
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
      contentHtml: '',
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
      queixaPrincipal: typeof rawSections.queixaPrincipal === 'string' ? rawSections.queixaPrincipal : legacyNotes,
      historiaClinica: typeof rawSections.historiaClinica === 'string' ? rawSections.historiaClinica : '',
      habitoIntestinal: typeof rawSections.habitoIntestinal === 'string' ? rawSections.habitoIntestinal : '',
      hidratacao: typeof rawSections.hidratacao === 'string' ? rawSections.hidratacao : '',
      rotinaAlimentar: typeof rawSections.rotinaAlimentar === 'string' ? rawSections.rotinaAlimentar : '',
      sonoAtividadeFisica: typeof rawSections.sonoAtividadeFisica === 'string' ? rawSections.sonoAtividadeFisica : '',
    };

    const sanitizedData: AnamneseData = {
      ...item,
      templateType: item?.templateType || 'Seções padrão',
      contentHtml: item?.contentHtml || '',
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
        { id: 'anamnese_transcricao', label: 'Anamnese', hasPlus: true },
        { id: 'recordatorio_alimentar', label: 'Recordatório alimentar', hasPlus: true },
        { id: 'prontuario', label: 'Prontuário', hasPlus: true },
        { id: 'restricoes_alimentares', label: 'Restrições alimentares', hasPlus: true },
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
            padding: '0.75rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem',
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
              gap: '0.4rem',
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0',
              padding: '0.35rem 0.55rem',
              marginBottom: '0.35rem',
              backgroundColor: '#ffffff',
            }}
          >
            <Search size={13} color="#94a3b8" />
            <input
              type="text"
              placeholder="Buscar seção..."
              value={sectionSearch}
              onChange={(e) => setSectionSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '0.75rem',
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
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.32rem 0.55rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : '#334155',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.75rem',
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
                  <Icon size={14} color={isActive ? 'var(--primary)' : '#64748b'} />
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
                    padding: '0.32rem 0.55rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: 'transparent',
                    color: hasActiveChild ? 'var(--primary)' : '#334155',
                    fontWeight: hasActiveChild ? 700 : 600,
                    fontSize: '0.75rem',
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
                        top: '3px',
                        bottom: '3px',
                        width: '3px',
                        borderRadius: '0 2px 2px 0',
                        backgroundColor: 'var(--primary)',
                      }}
                    />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <GroupIcon size={14} color={hasActiveChild ? 'var(--primary)' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>

                  {isExpanded ? (
                    <ChevronDown size={13} color="#94a3b8" />
                  ) : (
                    <ChevronRight size={13} color="#94a3b8" />
                  )}
                </button>

                {/* Subitens colapsáveis */}
                {isExpanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingLeft: '1.1rem',
                      gap: '0.05rem',
                      marginTop: '0.05rem',
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
                            padding: '0.24rem 0.5rem',
                            borderRadius: '0.375rem',
                            backgroundColor: isSubActive ? 'var(--primary-light)' : 'transparent',
                            color: isSubActive ? 'var(--primary)' : '#475569',
                            fontWeight: isSubActive ? 600 : 400,
                            fontSize: '0.71875rem',
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.65rem', color: isSubActive ? 'var(--primary)' : '#94a3b8' }}>•</span>
                            <span>{sub.label}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            {sub.badge && (
                              <span
                                style={{
                                  fontSize: '0.5625rem',
                                  fontWeight: 700,
                                  color: 'var(--primary)',
                                  backgroundColor: 'var(--primary-light)',
                                  borderRadius: '0.2rem',
                                  padding: '0.05rem 0.3rem',
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
                                  } else if (sub.id === 'recordatorio_alimentar') {
                                    handleOpenNewRecallModal();
                                  } else if (sub.id === 'prontuario') {
                                    handleOpenNewProntuarioModal();
                                  } else if (sub.id === 'restricoes_alimentares') {
                                    handleOpenNewRestrictionModal();
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
                                <Plus size={12} />
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
              SEÇÃO: ANAMNESE (CLINICAL DATA GRID)
             ======================================================== */}
          {activeSection === 'anamnese_transcricao' && (
            <ClinicalDataGrid
              title="Anamnese"
              subtitle="Registro de consultas, queixas e evolução clínica do paciente"
              items={clinicalAnamnesesItems}
              itemLabel="anamneses"
              templates={['Seções padrão', 'Anamnese Esportiva', 'Anamnese Infantil', 'Saúde Gastrointestinal', 'Anamnese em Branco']}
              onNew={() => handleStartNewAnamnese('Seções padrão')}
              onEdit={(item) => handleOpenAnamneseForEdit(item.raw || item)}
              onDelete={(item) => {
                const updated = anamnesesList.filter((a) => a.id !== item.id);
                saveAnamnesesToStorage(updated);
                toast.success('Anamnese excluída com sucesso.');
              }}
              onPrint={(item) => {
                toast.success(`Gerando PDF clínico da anamnese: ${item.title}...`);
              }}
              onCompare={(item) => {
                toast.info(`Comparando evolução clínica a partir de ${item.title}...`);
              }}
              onExportAll={() => {
                toast.info('Gerando prontuário consolidado em PDF de todas as anamneses...');
              }}
            />
          )}

          {/* ========================================================
              SEÇÃO: RECORDATÓRIO ALIMENTAR (CLINICAL DATA GRID)
             ======================================================== */}
          {activeSection === 'recordatorio_alimentar' && (
            <ClinicalDataGrid
              title="Recordatório Alimentar"
              subtitle="Inquéritos alimentares de 24h, hábitos e questionários de consumo do paciente"
              items={clinicalRecallsItems}
              itemLabel="recordatórios"
              templates={['Recordatório 24 Horas', 'Registro Habitual', 'Registro de 3 Dias', 'QFA - Frequência']}
              onNew={handleOpenNewRecallModal}
              onEdit={(item) => handleEditRecall(item.raw || item)}
              onDelete={(item) => handleDeleteRecall(item.id)}
              onPrint={(item) => {
                toast.success(`Gerando PDF do recordatório: ${item.title}...`);
              }}
              onCompare={() => {
                toast.info('Comparando consumo alimentar com consultas anteriores...');
              }}
              onExportAll={() => {
                toast.info('Gerando consolidado em PDF de todos os recordatórios...');
              }}
            />
          )}

          {/* ========================================================
              SEÇÃO: PRONTUÁRIO & EVOLUÇÃO CLÍNICA (CLINICAL DATA GRID)
             ======================================================== */}
          {activeSection === 'prontuario' && (
            <ClinicalDataGrid
              title="Prontuário & Linha do Tempo Clínica"
              subtitle="Histórico longitudinal de condutas, anotações de evolução e intercorrências"
              items={clinicalProntuarioItems}
              itemLabel="evoluções"
              templates={['Evolução Clínica', 'Consulta de Retorno', 'Ajuste de Conduta', 'Intercorrência']}
              onNew={handleOpenNewProntuarioModal}
              onEdit={(item) => handleEditProntuario(item.raw || item)}
              onDelete={(item) => handleDeleteProntuario(item.id)}
              onPrint={(item) => {
                toast.success(`Imprimindo evolução do prontuário: ${item.title}...`);
              }}
              onCompare={() => {
                toast.info('Comparando linha do tempo clínica...');
              }}
              onExportAll={() => {
                toast.info('Exportando prontuário integral em PDF...');
              }}
            />
          )}

          {/* ========================================================
              SEÇÃO: RESTRIÇÕES ALIMENTARES (GRADE CLÍNICA COMPLETA)
             ======================================================== */}
          {activeSection === 'restricoes_alimentares' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
              {/* Cabeçalho */}
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
                    Restrições Alimentares
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                    Alergias, intolerâncias e aversões alimentares relatadas ou diagnosticadas
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <button
                    type="button"
                    onClick={handleOpenNewRestrictionModal}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
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
                    <span>Adicionar restrição</span>
                  </button>
                </div>
              </div>

              {/* Barra de Filtros e Busca */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.625rem',
                }}
              >
                {/* Campo de Busca */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px', position: 'relative' }}>
                  <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem' }} />
                  <input
                    type="text"
                    value={restrictionSearchQuery}
                    onChange={(e) => setRestrictionSearchQuery(e.target.value)}
                    placeholder="Buscar alimento, motivo, origem..."
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary)';
                      e.target.style.boxShadow = '0 0 0 3px var(--primary-light, rgba(5, 150, 105, 0.15))';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#cbd5e1';
                      e.target.style.boxShadow = 'none';
                    }}
                    style={{
                      width: '100%',
                      minHeight: '38px',
                      padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                      fontSize: '0.8125rem',
                      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      backgroundColor: '#ffffff',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                    }}
                  />
                  {restrictionSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRestrictionSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filtro por Motivo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px' }}>
                  <select
                    value={restrictionFilterReason}
                    onChange={(e) => setRestrictionFilterReason(e.target.value)}
                    className="ygeia-select"
                    style={{ minHeight: '38px', fontSize: '0.8125rem', padding: '0.45rem 2rem 0.45rem 0.75rem' }}
                  >
                    <option value="ALL">Todos os motivos</option>
                    <option value="Alergia">Alergia</option>
                    <option value="Intolerância">Intolerância</option>
                    <option value="Não Gosta">Não Gosta</option>
                    <option value="Outra restrição">Outra restrição</option>
                  </select>
                </div>

                {/* Filtro por Situação */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '130px' }}>
                  <select
                    value={restrictionFilterStatus}
                    onChange={(e) => setRestrictionFilterStatus(e.target.value)}
                    className="ygeia-select"
                    style={{ minHeight: '38px', fontSize: '0.8125rem', padding: '0.45rem 2rem 0.45rem 0.75rem' }}
                  >
                    <option value="ALL">Todas</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                  </select>
                </div>
              </div>

              {/* Tabela de Restrições */}
              {filteredRestrictions.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3.5rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px dashed #cbd5e1',
                    backgroundColor: '#f8fafc',
                    textAlign: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <Ban size={40} color="#94a3b8" />
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                    Nenhuma restrição alimentar encontrada.
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                    Cadastre alimentos com alergia, intolerância ou recusa do paciente.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenNewRestrictionModal}
                    style={{
                      marginTop: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '0.375rem',
                      padding: '0.45rem 0.95rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} />
                    <span>Adicionar primeira restrição</span>
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    borderRadius: '0.75rem',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ overflowX: 'auto', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                          <th style={{ padding: '0.75rem 1.25rem' }}>Alimento ou Substância</th>
                          <th style={{ padding: '0.75rem 1.25rem', width: '150px' }}>Tipo / Motivo</th>
                          <th style={{ padding: '0.75rem 1.25rem', width: '110px' }}>Situação</th>
                          <th style={{ padding: '0.75rem 1.25rem', width: '180px' }}>Origem</th>
                          <th style={{ padding: '0.75rem 1.25rem' }}>Observação</th>
                          <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right', width: '120px' }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRestrictions.map((item) => {
                          const getReasonBadgeStyle = (reason: string) => {
                            switch (reason) {
                              case 'Alergia':
                                return {
                                  bg: '#fee2e2',
                                  color: '#dc2626',
                                  border: '#fca5a5',
                                  icon: AlertTriangle,
                                };
                              case 'Intolerância':
                                return {
                                  bg: '#ffedd5',
                                  color: '#ea580c',
                                  border: '#fdba74',
                                  icon: AlertCircle,
                                };
                              case 'Não Gosta':
                                return {
                                  bg: '#ede9fe',
                                  color: '#7c3aed',
                                  border: '#c4b5fd',
                                  icon: Ban,
                                };
                              default:
                                return {
                                  bg: '#f1f5f9',
                                  color: '#475569',
                                  border: '#cbd5e1',
                                  icon: AlertCircle,
                                };
                            }
                          };

                          const badge = getReasonBadgeStyle(item.reason);
                          const BadgeIcon = badge.icon;
                          const isAtiva = item.status === 'Ativa';

                          return (
                            <tr
                              key={item.id}
                              style={{
                                borderBottom: '1px solid #f1f5f9',
                                transition: 'background-color 0.15s ease',
                              }}
                              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
                            >
                              {/* 1. Alimento ou Substância */}
                              <td style={{ padding: '0.85rem 1.25rem' }}>
                                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>
                                  {item.foodOrSubstance}
                                </span>
                              </td>

                              {/* 2. Tipo / Motivo */}
                              <td style={{ padding: '0.85rem 1.25rem' }}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    backgroundColor: badge.bg,
                                    color: badge.color,
                                    border: `1px solid ${badge.border}`,
                                    borderRadius: '9999px',
                                    padding: '0.15rem 0.6rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  <BadgeIcon size={12} />
                                  <span>{item.reason}</span>
                                </span>
                              </td>

                              {/* 3. Situação */}
                              <td style={{ padding: '0.85rem 1.25rem' }}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleRestrictionStatus(item)}
                                  title="Clique para alternar a situação"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    backgroundColor: isAtiva ? 'var(--primary-light)' : '#f1f5f9',
                                    color: isAtiva ? 'var(--primary)' : '#64748b',
                                    border: `1px solid ${isAtiva ? 'var(--primary-border)' : '#cbd5e1'}`,
                                    borderRadius: '0.375rem',
                                    padding: '0.15rem 0.55rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <span
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      backgroundColor: isAtiva ? 'var(--primary)' : '#94a3b8',
                                    }}
                                  />
                                  <span>{item.status}</span>
                                </button>
                              </td>

                              {/* 4. Origem */}
                              <td style={{ padding: '0.85rem 1.25rem', color: '#475569', fontSize: '0.8125rem' }}>
                                {item.origin}
                              </td>

                              {/* 5. Observação */}
                              <td style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.8125rem' }}>
                                {item.observation || <span style={{ color: '#cbd5e1' }}>—</span>}
                              </td>

                              {/* 6. Ações */}
                              <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleEditRestriction(item)}
                                    title="Editar restrição"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '30px',
                                      height: '30px',
                                      borderRadius: '0.375rem',
                                      border: '1px solid #e2e8f0',
                                      backgroundColor: '#ffffff',
                                      color: '#64748b',
                                      cursor: 'pointer',
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
                                    <Edit2 size={13} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRestriction(item.id)}
                                    title="Excluir restrição"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '30px',
                                      height: '30px',
                                      borderRadius: '0.375rem',
                                      border: '1px solid #e2e8f0',
                                      backgroundColor: '#ffffff',
                                      color: '#64748b',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                    }}
                                    onMouseOver={(e) => {
                                      (e.currentTarget as HTMLElement).style.backgroundColor = '#fff1f2';
                                      (e.currentTarget as HTMLElement).style.color = '#e11d48';
                                      (e.currentTarget as HTMLElement).style.borderColor = '#fecdd3';
                                    }}
                                    onMouseOut={(e) => {
                                      (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                                      (e.currentTarget as HTMLElement).style.color = '#64748b';
                                      (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
          {!['anamnese_transcricao', 'recordatorio_alimentar', 'prontuario', 'restricoes_alimentares', 'plano_alimentar', 'gasto_calorico'].includes(activeSection) &&
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

      {/* MODAL: REGISTRAR / EDITAR RECORDATÓRIO ALIMENTAR */}
      <AppModal
        isOpen={isRecallModalOpen}
        onClose={() => setIsRecallModalOpen(false)}
        title={editingRecall ? 'Editar Recordatório Alimentar' : 'Novo Recordatório Alimentar'}
        subtitle="Registro de consumo e hábitos alimentares do paciente"
        maxWidth="540px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
            <button
              type="button"
              onClick={() => setIsRecallModalOpen(false)}
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
              onClick={handleSaveRecall}
              style={{
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: 'var(--primary)',
                padding: '0.45rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Salvar Recordatório
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AppInput
            label="Título do Recordatório"
            required
            type="text"
            value={recallForm.title}
            onChange={(e) => setRecallForm({ ...recallForm, title: e.target.value })}
            placeholder="Ex: Recordatório 24 Horas - Consulta Inicial"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <AppSelect
              label="Modelo / Tipo"
              value={recallForm.templateType}
              onChange={(e) => setRecallForm({ ...recallForm, templateType: e.target.value })}
              options={[
                { value: 'Recordatório 24 Horas', label: 'Recordatório 24 Horas' },
                { value: 'Registro Habitual', label: 'Registro Habitual' },
                { value: 'Registro de 3 Dias', label: 'Registro de 3 Dias' },
                { value: 'QFA - Frequência', label: 'QFA - Frequência' },
              ]}
            />

            <AppInput
              label="Data da Coleta"
              type="date"
              value={recallForm.date}
              onChange={(e) => setRecallForm({ ...recallForm, date: e.target.value })}
            />
          </div>

          <AppTextarea
            label="Refeições, Alimentos & Horários"
            rows={4}
            value={recallForm.notes}
            onChange={(e) => setRecallForm({ ...recallForm, notes: e.target.value })}
            placeholder="Descreva as refeições consumidas pelo paciente, horários aproximados, quantidades e marcas..."
          />
        </div>
      </AppModal>

      {/* MODAL: REGISTRAR / EDITAR EVOLUÇÃO DO PRONTUÁRIO */}
      <AppModal
        isOpen={isProntuarioModalOpen}
        onClose={() => setIsProntuarioModalOpen(false)}
        title={editingProntuario ? 'Editar Evolução Clínica' : 'Nova Evolução Clínica'}
        subtitle="Registro no prontuário oficial e linha do tempo"
        maxWidth="540px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
            <button
              type="button"
              onClick={() => setIsProntuarioModalOpen(false)}
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
              onClick={handleSaveProntuario}
              style={{
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: 'var(--primary)',
                padding: '0.45rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Salvar no Prontuário
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AppInput
            label="Título da Evolução"
            required
            type="text"
            value={prontuarioForm.title}
            onChange={(e) => setProntuarioForm({ ...prontuarioForm, title: e.target.value })}
            placeholder="Ex: Consulta de Retorno - Ajuste Calórico"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <AppSelect
              label="Tipo / Categoria"
              value={prontuarioForm.templateType}
              onChange={(e) => setProntuarioForm({ ...prontuarioForm, templateType: e.target.value })}
              options={[
                { value: 'Evolução Clínica', label: 'Evolução Clínica' },
                { value: 'Consulta de Retorno', label: 'Consulta de Retorno' },
                { value: 'Ajuste de Conduta', label: 'Ajuste de Conduta' },
                { value: 'Intercorrência', label: 'Intercorrência' },
              ]}
            />

            <AppInput
              label="Data da Evolução"
              type="date"
              value={prontuarioForm.date}
              onChange={(e) => setProntuarioForm({ ...prontuarioForm, date: e.target.value })}
            />
          </div>

          <AppTextarea
            label="Conduta Clínica e Anotações"
            rows={4}
            value={prontuarioForm.notes}
            onChange={(e) => setProntuarioForm({ ...prontuarioForm, notes: e.target.value })}
            placeholder="Descreva a avaliação do encontro, respostas aos protocolos e orientações fornecidas..."
          />
        </div>
      </AppModal>

      {/* MODAL: ADICIONAR / EDITAR RESTRIÇÃO ALIMENTAR */}
      <AppModal
        isOpen={isRestrictionModalOpen}
        onClose={() => setIsRestrictionModalOpen(false)}
        title={editingRestriction ? 'Editar Restrição Alimentar' : 'Adicionar Restrição Alimentar'}
        subtitle="Mapeamento de alergias, intolerâncias e preferências alimentares"
        maxWidth="500px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
            <button
              type="button"
              onClick={() => setIsRestrictionModalOpen(false)}
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
              onClick={handleSaveRestriction}
              style={{
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: 'var(--primary)',
                padding: '0.45rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Salvar restrição
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Campo: Alimento ou Substância com texto explicativo padronizado */}
          <AppInput
            label="Alimento ou substância"
            required
            type="text"
            value={restrictionForm.foodOrSubstance}
            onChange={(e) => setRestrictionForm({ ...restrictionForm, foodOrSubstance: e.target.value })}
            placeholder="Ex: Leite de vaca, Glúten, Camarão, Ovo..."
            helperText="Se a restrição depende do preparo, inclua essa informação no nome"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* Campo Selecionável: Motivo */}
            <AppSelect
              label="Motivo"
              required
              value={restrictionForm.reason}
              onChange={(e) => setRestrictionForm({ ...restrictionForm, reason: e.target.value as any })}
              options={[
                { value: 'Alergia', label: 'Alergia' },
                { value: 'Intolerância', label: 'Intolerância' },
                { value: 'Não Gosta', label: 'Não Gosta' },
                { value: 'Outra restrição', label: 'Outra restrição' },
              ]}
            />

            {/* Campo: Situação */}
            <AppSelect
              label="Situação"
              value={restrictionForm.status}
              onChange={(e) => setRestrictionForm({ ...restrictionForm, status: e.target.value as any })}
              options={[
                { value: 'Ativa', label: 'Ativa' },
                { value: 'Inativa', label: 'Inativa' },
              ]}
            />
          </div>

          {/* Campo: Origem */}
          <AppSelect
            label="Origem"
            value={restrictionForm.origin}
            onChange={(e) => setRestrictionForm({ ...restrictionForm, origin: e.target.value })}
            options={[
              { value: 'Relatado pelo paciente', label: 'Relatado pelo paciente' },
              { value: 'Avaliação clínica', label: 'Avaliação clínica' },
              { value: 'Exame laboratorial', label: 'Exame laboratorial' },
              { value: 'Histórico prévio', label: 'Histórico prévio' },
            ]}
          />

          {/* Campo Opcional: Observação */}
          <AppTextarea
            label="Observação"
            rows={3}
            value={restrictionForm.observation}
            onChange={(e) => setRestrictionForm({ ...restrictionForm, observation: e.target.value })}
            placeholder="Descreva sintomas, manifestações clínicas ou orientações adicionais..."
            helperText="Opcional"
          />
        </div>
      </AppModal>

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
