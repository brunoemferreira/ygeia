import React, { useState, useMemo, useEffect } from 'react';
import {
  ClipboardList,
  User,
  Utensils,
  Activity,
  Calendar,
  CheckSquare,
  Smartphone,
  Folder,
} from 'lucide-react';
import { PatientRecord } from './PatientDirectory';
import { AnamneseData } from './AnamneseEditor';
import { useToast } from '../../context/ToastContext';
import { ClinicalApiService } from '../../services/clinicalService';
import {
  PatientHeaderCard,
  PatientSidebarNav,
  PatientAnamneseTab,
  PatientRecallsTab,
  RecallItem,
  PatientMedicalRecordsTab,
  ProntuarioItem,
  PatientRestrictionsTab,
  FoodRestriction,
  PatientAnthropometryTab,
  PatientMealPlanTab,
  MenuGroup,
} from './tabs';

export interface PatientProfileViewProps {
  patient: PatientRecord;
  onBack: () => void;
  onEdit: (patient: PatientRecord) => void;
  onDelete?: (id: string | number) => void;
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
    patientName
      .split(' ')
      .slice(0, 2)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() || 'P';

  // Navegação de Submenus e Seções
  const [activeSection, setActiveSection] = useState<string>('anamnese_transcricao');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    avaliacao_nutricional: true,
    antropometria: false,
    prescricao_dietetica: false,
    avaliacao_bioquimica: false,
    metas_adesao: false,
    comunicacao_engajamento: false,
    gestao_consultorio: false,
    arquivos_paciente: false,
  });
  const [sectionSearch, setSectionSearch] = useState('');

  // 1. Estado da Anamnese
  const anamneseStorageKey = `ygeia_anamneses_${patientId}`;
  const [isEditingAnamnese, setIsEditingAnamnese] = useState(false);
  const [editingAnamneseData, setEditingAnamneseData] = useState<AnamneseData | null>(null);

  const getDefaultAnamneses = (): AnamneseData[] => [
    {
      id: '1',
      patientId: patientId,
      title: 'Anamnese Nutricional Completa — 1ª Consulta',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      templateType: 'Seções padrão',
      sections: {
        queixaPrincipal: 'Busca emagrecimento saudável, redução de cansaço pós-prandial e melhora da saúde intestinal.',
        historiaClinica: 'Nega diabetes. Histórico familiar de hipertensão arterial. Exames recentes normais.',
        habitoIntestinal: 'Constipação moderada (escala Bristol tipo 2), ritmo de 3 em 3 dias.',
        hidratacao: 'Ingestão hídrica baixa relatada (cerca de 800ml a 1000ml por dia).',
        rotinaAlimentar: 'Café da manhã rápido (café preto e pão com manteiga). Almoço em restaurante a quilo. Jantar tardio.',
        sonoAtividadeFisica: 'Dorme cerca de 6h por noite. Pratica caminhada leve 2 vezes na semana.',
      },
    },
    {
      id: '2',
      patientId: patientId,
      title: 'Retorno 30 Dias — Análise de Adesão e Hábitos',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      templateType: 'Seções padrão',
      sections: {
        queixaPrincipal: 'Excelente resposta ao aumento do consumo de água e fibras. Relata mais disposição matinal.',
        historiaClinica: 'Sem queixas de desconforto gastrointestinal. Menor vontade de doces no período noturno.',
        habitoIntestinal: 'Evacuação diária agora (escala Bristol tipo 4).',
        hidratacao: 'Atingindo meta de 2.2 litros de água diariamente com garrafa graduada.',
        rotinaAlimentar: 'Seguindo bem as substituições do café e lanches da tarde.',
        sonoAtividadeFisica: 'Iniciou musculação 3x por semana.',
      },
    },
  ];

  const [anamnesesList, setAnamnesesList] = useState<AnamneseData[]>(() => {
    try {
      const stored = localStorage.getItem(anamneseStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getDefaultAnamneses();
  });

  const saveAnamnesesToStorage = (updatedList: AnamneseData[]) => {
    setAnamnesesList(updatedList);
    try {
      localStorage.setItem(anamneseStorageKey, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Erro ao salvar anamneses no storage:', e);
    }
  };

  const handleStartNewAnamnese = (templateType: string = 'Seções padrão') => {
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
      sections: {
        queixaPrincipal: '',
        historiaClinica: '',
        habitoIntestinal: '',
        hidratacao: '',
        rotinaAlimentar: '',
        sonoAtividadeFisica: '',
      },
    };
    setEditingAnamneseData(newDraft);
    setIsEditingAnamnese(true);
  };

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

    setEditingAnamneseData({
      ...item,
      templateType: item?.templateType || 'Seções padrão',
      contentHtml: item?.contentHtml || '',
      sections: safeSections,
    });
    setIsEditingAnamnese(true);
  };

  // 2. Estado de Recordatórios
  const recallStorageKey = `ygeia_recalls_${patientId}`;
  const [recallsList, setRecallsList] = useState<RecallItem[]>(() => {
    try {
      const stored = localStorage.getItem(recallStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    const now = new Date();
    return [
      {
        id: '1',
        title: 'Recordatório 24 Horas — Dia Habitual de Trabalho',
        templateType: 'Recordatório 24 Horas',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: '07h30: Café com leite desnatado + pão francês com queijo minas.\n12h30: Arroz branco (3 colheres), feijão (1 concha), filé de frango grelhado e salada.\n16h00: 1 maçã + 3 castanhas.\n20h00: Omelete de 2 ovos com tomate e orégano.',
      },
    ];
  });

  const saveRecallsToStorage = (updated: RecallItem[]) => {
    setRecallsList(updated);
    try {
      localStorage.setItem(recallStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar recordatórios:', e);
    }
  };

  // 3. Estado do Prontuário
  const prontuarioStorageKey = `ygeia_prontuario_${patientId}`;
  const [prontuarioList, setProntuarioList] = useState<ProntuarioItem[]>(() => {
    try {
      const stored = localStorage.getItem(prontuarioStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    const now = new Date();
    return [
      {
        id: '1',
        title: 'Evolução Clínica e Alinhamento de Conduta',
        templateType: 'Evolução Clínica',
        date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Paciente evoluindo com boa adesão ao déficit calórico programado. Redução de 1.8 kg no primeiro mês. Ajustada suplementação de creatina e meta hídrica.',
      },
    ];
  });

  const saveProntuarioToStorage = (updated: ProntuarioItem[]) => {
    setProntuarioList(updated);
    try {
      localStorage.setItem(prontuarioStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar prontuário:', e);
    }
  };

  // 4. Estado de Restrições Alimentares
  const restrictionStorageKey = `ygeia_restrictions_${patientId}`;
  const [restrictionsList, setRestrictionsList] = useState<FoodRestriction[]>(() => {
    try {
      const stored = localStorage.getItem(restrictionStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: '1',
        foodOrSubstance: 'Leite de vaca e derivados integrais',
        reason: 'Intolerância',
        status: 'Ativa',
        origin: 'Relatado pelo paciente',
        observation: 'Apresenta distensão abdominal e flatulência intensa após ingestão de lactose não hidrolisada.',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        foodOrSubstance: 'Camarão e frutos do mar',
        reason: 'Alergia',
        status: 'Ativa',
        origin: 'Diagnóstico médico prévio',
        observation: 'Alergia com episódios de urticária e edema de lábios na infância.',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        foodOrSubstance: 'Coentro',
        reason: 'Não Gosta',
        status: 'Ativa',
        origin: 'Aversão alimentar',
        observation: 'Sensibilidade gustativa a aldeídos (gosto de sabão). Evitar em preparações.',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const saveRestrictionsToStorage = (updated: FoodRestriction[]) => {
    setRestrictionsList(updated);
    try {
      localStorage.setItem(restrictionStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar restrições:', e);
    }
  };

  // Carregamento inicial assíncrono dos módulos clínicos via API com fallback transparente
  useEffect(() => {
    let isMounted = true;
    async function loadClinicalData() {
      try {
        const [anamneses, recalls, records, restrictions] = await Promise.all([
          ClinicalApiService.getAnamneses(patientId),
          ClinicalApiService.getRecalls(patientId),
          ClinicalApiService.getMedicalRecords(patientId),
          ClinicalApiService.getRestrictions(patientId),
        ]);
        if (isMounted) {
          if (anamneses.length > 0) setAnamnesesList(anamneses);
          if (recalls.length > 0) setRecallsList(recalls);
          if (records.length > 0) setProntuarioList(records);
          if (restrictions.length > 0) setRestrictionsList(restrictions);
        }
      } catch (err) {
        console.warn('Erro ao carregar dados clínicos da API:', err);
      }
    }
    loadClinicalData();
    return () => {
      isMounted = false;
    };
  }, [patientId]);

  // Idade calculada
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

  // Chave numérica
  const patientKey = useMemo(() => {
    const rawId = String(patient?.id || patientName || '1000001851');
    const numeric = rawId.replace(/\D/g, '');
    if (numeric.length >= 6) return numeric.slice(-8);
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
      hash = (hash << 5) - hash + rawId.charCodeAt(i);
      hash |= 0;
    }
    return String(Math.abs(hash)).padStart(8, '7').slice(-8);
  }, [patient?.id, patientName]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const menuGroups: MenuGroup[] = [
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
      id: 'metas_adesao',
      label: 'Metas e adesão',
      icon: CheckSquare,
      children: [
        { id: 'metas_habitos', label: 'Metas de hábitos', hasPlus: true },
        { id: 'rastreamento_metabolico', label: 'Rastreamento metabólico', hasPlus: true },
      ],
    },
    {
      type: 'group',
      id: 'comunicacao_engajamento',
      label: 'Comunicação e app',
      icon: Smartphone,
      children: [
        { id: 'diario_alimentar', label: 'Diário alimentar', hasPlus: false },
        { id: 'mensagens_chat', label: 'Chat do paciente', hasPlus: false },
      ],
    },
    {
      type: 'group',
      id: 'gestao_consultorio',
      label: 'Agendamento e retornos',
      icon: Calendar,
      children: [
        { id: 'consultas_retornos', label: 'Histórico de consultas', hasPlus: true },
      ],
    },
    {
      type: 'group',
      id: 'arquivos_paciente',
      label: 'Arquivos e recibos',
      icon: Folder,
      children: [
        { id: 'arquivo_recibo', label: 'Recibos emitidos', hasPlus: true },
        { id: 'documentos_anexos', label: 'Documentos anexos', hasPlus: true },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* 1. CABEÇALHO DO PACIENTE */}
      <PatientHeaderCard
        patient={patient}
        patientName={patientName}
        patientInitials={patientInitials}
        patientAgeString={patientAgeString}
        patientKey={patientKey}
        onBack={onBack}
        onEdit={onEdit}
        onDelete={onDelete}
        onNavigateSection={(sectionId, groupKey) => {
          setActiveSection(sectionId);
          if (groupKey) setExpandedGroups((prev) => ({ ...prev, [groupKey]: true }));
        }}
      />

      {/* 2. CORPO: SIDEBAR À ESQUERDA E CONTEÚDO MODULAR À DIREITA */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)' }}>
        <PatientSidebarNav
          menuGroups={menuGroups}
          activeSection={activeSection}
          expandedGroups={expandedGroups}
          sectionSearch={sectionSearch}
          onSelectSection={(id) => setActiveSection(id)}
          onToggleGroup={toggleGroup}
          onSearchChange={(val) => setSectionSearch(val)}
          onStartNewAnamnese={() => handleStartNewAnamnese('Seções padrão')}
          onOpenNewRecallModal={() => setActiveSection('recordatorio_alimentar')}
          onOpenNewProntuarioModal={() => setActiveSection('prontuario')}
          onOpenNewRestrictionModal={() => setActiveSection('restricoes_alimentares')}
        />

        {/* WORKSPACE PRINCIPAL DAS ABAS */}
        <main
          style={{
            flex: 1,
            backgroundColor: '#ffffff',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* ABA: ANAMNESE */}
          {activeSection === 'anamnese_transcricao' && (
            <PatientAnamneseTab
              patient={patient}
              patientAgeString={patientAgeString}
              isEditingAnamnese={isEditingAnamnese}
              editingAnamneseData={editingAnamneseData}
              anamnesesList={anamnesesList}
              onStartNewAnamnese={handleStartNewAnamnese}
              onOpenAnamneseForEdit={handleOpenAnamneseForEdit}
              onSaveAnamnese={async (updated) => {
                const existingIndex = anamnesesList.findIndex((a) => a.id === updated.id);
                let newList: AnamneseData[];
                if (existingIndex >= 0) {
                  newList = [...anamnesesList];
                  newList[existingIndex] = updated;
                } else {
                  newList = [updated, ...anamnesesList];
                }
                saveAnamnesesToStorage(newList);
                setIsEditingAnamnese(false);
                toast.success('Anamnese salva com sucesso!');
                await ClinicalApiService.saveAnamnese(patientId, updated);
              }}
              onCancelAnamnese={() => setIsEditingAnamnese(false)}
              onDeleteAnamnese={async (id) => {
                const updated = anamnesesList.filter((a) => a.id !== id);
                saveAnamnesesToStorage(updated);
                toast.success('Anamnese excluída com sucesso.');
                await ClinicalApiService.deleteAnamnese(patientId, id);
              }}
            />
          )}

          {/* ABA: RECORDATÓRIO ALIMENTAR */}
          {activeSection === 'recordatorio_alimentar' && (
            <PatientRecallsTab
              recallsList={recallsList}
              onSaveRecalls={async (updated) => {
                saveRecallsToStorage(updated);
                if (updated.length > 0) {
                  await ClinicalApiService.saveRecall(patientId, updated[0]);
                }
              }}
            />
          )}

          {/* ABA: PRONTUÁRIO & LINHA DO TEMPO */}
          {activeSection === 'prontuario' && (
            <PatientMedicalRecordsTab
              prontuarioList={prontuarioList}
              onSaveProntuario={async (updated) => {
                saveProntuarioToStorage(updated);
                if (updated.length > 0) {
                  await ClinicalApiService.saveMedicalRecord(patientId, updated[0]);
                }
              }}
            />
          )}

          {/* ABA: RESTRIÇÕES ALIMENTARES */}
          {activeSection === 'restricoes_alimentares' && (
            <PatientRestrictionsTab
              restrictionsList={restrictionsList}
              onSaveRestrictions={async (updated) => {
                saveRestrictionsToStorage(updated);
                if (updated.length > 0) {
                  await ClinicalApiService.saveRestriction(patientId, updated[0]);
                }
              }}
            />
          )}

          {/* ABA: ANTROPOMETRIA & COMPOSIÇÃO CORPORAL (DUAL ADAPTATIVA) */}
          {activeSection.startsWith('antropo_') && (
            <PatientAnthropometryTab patientName={patientName} />
          )}

          {/* ABA: PLANO ALIMENTAR & GASTO CALÓRICO (DUAL ADAPTATIVA CLÍNICA & ESPORTIVA) */}
          {(activeSection === 'plano_alimentar' || activeSection === 'gasto_calorico') && (
            <PatientMealPlanTab patientName={patientName} />
          )}

          {/* DEMAIS SEÇÕES (FALLBACK LIMPO) */}
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
                    padding: '0.45rem 1rem',
                    borderRadius: '0.375rem',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Criar primeiro registro
                </button>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};
