import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  PlayCircle,
  Sparkles,
  FileText,
  Mic,
  ChevronDown,
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  Type,
  Highlighter,
  Link2,
  Table,
  Paperclip,
  Star,
} from 'lucide-react';
import { PatientRecord } from './PatientDirectory';
import { useToast } from '../../context/ToastContext';

export interface AnamneseData {
  id: string;
  patientId: string;
  title: string;
  date: string;
  templateType: string;
  sections: {
    queixaPrincipal: string;
    historiaClinica: string;
    habitoIntestinal: string;
    hidratacao: string;
    rotinaAlimentar: string;
    sonoAtividadeFisica: string;
  };
  transcriptionText?: string;
  hasAudioRecording?: boolean;
}

export interface AnamneseEditorProps {
  patient: PatientRecord;
  patientAgeString: string;
  initialData?: AnamneseData | null;
  onBack: () => void;
  onSave: (anamnese: AnamneseData) => void;
}

export const AnamneseEditor: React.FC<AnamneseEditorProps> = ({
  patient,
  patientAgeString,
  initialData,
  onBack,
  onSave,
}) => {
  const { toast } = useToast();

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

  // Abas superiores: 'anamnese' ou 'transcricao'
  const [activeTab, setActiveTab] = useState<'anamnese' | 'transcricao'>('anamnese');

  // Toggle sugestões inteligentes
  const [suggestionsActive, setSuggestionsActive] = useState(true);

  // Template selecionado
  const [selectedTemplate, setSelectedTemplate] = useState(initialData?.templateType || 'Seções padrão');

  // Seções da Anamnese com fallback clínico padrão garantido
  const [sections, setSections] = useState(() => ({
    queixaPrincipal:
      initialData?.sections?.queixaPrincipal ||
      (initialData as any)?.notes ||
      'Acompanhamento nutricional periódico e modulação da composição corporal.',
    historiaClinica:
      initialData?.sections?.historiaClinica ||
      'Sem comorbidades relatadas. Sem histórico de alergias alimentares.',
    habitoIntestinal:
      initialData?.sections?.habitoIntestinal ||
      'Hábito intestinal regular, fezes tipo 4 da escala de Bristol.',
    hidratacao:
      initialData?.sections?.hidratacao ||
      'Consumo habitual de aproximadamente 2,5 litros de água por dia.',
    rotinaAlimentar:
      initialData?.sections?.rotinaAlimentar ||
      'Refeições diárias regulares: café da manhã, almoço, lanche e jantar.',
    sonoAtividadeFisica:
      initialData?.sections?.sonoAtividadeFisica ||
      '7 a 8 horas de sono de boa qualidade. Pratica atividade física regular.',
  }));

  // Sincroniza dados sempre que initialData mudar (garante carregamento correto ao abrir anamnese)
  useEffect(() => {
    if (initialData) {
      const raw = initialData.sections || ({} as any);
      const legacy = (initialData as any)?.notes || '';
      setSections({
        queixaPrincipal:
          typeof raw.queixaPrincipal === 'string' && raw.queixaPrincipal.trim() !== ''
            ? raw.queixaPrincipal
            : legacy || 'Acompanhamento nutricional periódico e modulação da composição corporal.',
        historiaClinica:
          typeof raw.historiaClinica === 'string' && raw.historiaClinica.trim() !== ''
            ? raw.historiaClinica
            : 'Sem comorbidades relatadas. Sem histórico de alergias alimentares.',
        habitoIntestinal:
          typeof raw.habitoIntestinal === 'string' && raw.habitoIntestinal.trim() !== ''
            ? raw.habitoIntestinal
            : 'Hábito intestinal regular, fezes tipo 4 da escala de Bristol.',
        hidratacao:
          typeof raw.hidratacao === 'string' && raw.hidratacao.trim() !== ''
            ? raw.hidratacao
            : 'Consumo habitual de aproximadamente 2,5 litros de água por dia.',
        rotinaAlimentar:
          typeof raw.rotinaAlimentar === 'string' && raw.rotinaAlimentar.trim() !== ''
            ? raw.rotinaAlimentar
            : 'Refeições diárias regulares: café da manhã, almoço, lanche e jantar.',
        sonoAtividadeFisica:
          typeof raw.sonoAtividadeFisica === 'string' && raw.sonoAtividadeFisica.trim() !== ''
            ? raw.sonoAtividadeFisica
            : '7 a 8 horas de sono de boa qualidade. Pratica atividade física regular.',
      });
      setSelectedTemplate(initialData.templateType || 'Seções padrão');
      setTranscriptionText(initialData.transcriptionText || '');
    } else {
      setSections({
        queixaPrincipal: 'Acompanhamento nutricional periódico e modulação da composição corporal.',
        historiaClinica: 'Sem comorbidades relatadas. Sem histórico de alergias alimentares.',
        habitoIntestinal: 'Hábito intestinal regular, fezes tipo 4 da escala de Bristol.',
        hidratacao: 'Consumo habitual de aproximadamente 2,5 litros de água por dia.',
        rotinaAlimentar: 'Refeições diárias regulares: café da manhã, almoço, lanche e jantar.',
        sonoAtividadeFisica: '7 a 8 horas de sono de boa qualidade. Pratica atividade física regular.',
      });
      setSelectedTemplate('Seções padrão');
      setTranscriptionText('');
    }
  }, [initialData]);

  // Gravação de áudio / transcrição
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcriptionText, setTranscriptionText] = useState(initialData?.transcriptionText || '');

  // Escalas clínicas dropdown
  const [showEscalasDropdown, setShowEscalasDropdown] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Template switcher
  const handleTemplateChange = (tmpl: string) => {
    setSelectedTemplate(tmpl);
    if (tmpl === 'Anamnese Esportiva') {
      setSections({
        queixaPrincipal: 'Objetivo atlético: aumento de VO2 máx, hipertrofia e rendimento competitivo.',
        historiaClinica: 'Sem lesões osteoarticulares recentes. Uso prévio de pré-treino e creatina.',
        habitoIntestinal: 'Hábito regular, Bristol tipo 4, sem desconforto durante provas ou treinos intensos.',
        hidratacao: 'Consumo habitual de 3.5L de água/dia + repositor hidroeletrolítico intra-treino.',
        rotinaAlimentar: 'Carboidratos complexos no pré-treino imediato; aporte proteico de 2.0g/kg distribuído em 5 refeições.',
        sonoAtividadeFisica: 'Treino de corrida 4x/semana + musculação 3x/semana. Sono de 8 horas reparador.',
      });
      toast.info('Template de Anamnese Esportiva aplicado!');
    } else if (tmpl === 'Anamnese Infantil') {
      setSections({
        queixaPrincipal: 'Acompanhamento do desenvolvimento pondero-estatural e seletividade alimentar infantil.',
        historiaClinica: 'Histórico de aleitamento materno até os 6 meses. Sem alergias alimentares conhecidas.',
        habitoIntestinal: 'Evacuação diária sem dor ou esforço; consistência pastosa / Bristol 4.',
        hidratacao: 'Consumo de água em copo de transição (~1.2L ao dia) e sucos naturais ocasionais.',
        rotinaAlimentar: 'Café da manhã, lanche escolar, almoço, lanche da tarde e jantar em família.',
        sonoAtividadeFisica: 'Sono de 9 a 10 horas contínuas. Brincadeiras ativas e natação 2x/semana.',
      });
      toast.info('Template de Anamnese Infantil aplicado!');
    } else if (tmpl === 'Saúde Gastrointestinal') {
      setSections({
        queixaPrincipal: 'Sintomas gastrointestinais recorrentes: distensão abdominal pós-prandial e flatulência.',
        historiaClinica: 'Histórico de gastrite leve; sem diagnóstico prévio de SII ou doença celíaca.',
        habitoIntestinal: 'Alternância entre fezes Bristol 3 e 5; desconforto associado a laticínios.',
        hidratacao: 'Ingestão de água fracionada de 2L/dia, redução voluntária de refrigerantes.',
        rotinaAlimentar: 'Investigação inicial pelo protocolo Low-FODMAP; redução de alimentos fermentáveis.',
        sonoAtividadeFisica: 'Sono fragmentado em noites com desconforto gástrico. Caminhadas leves.',
      });
      toast.info('Template de Saúde Gastrointestinal aplicado!');
    } else if (tmpl === 'Anamnese em Branco') {
      setSections({
        queixaPrincipal: '',
        historiaClinica: '',
        habitoIntestinal: '',
        hidratacao: '',
        rotinaAlimentar: '',
        sonoAtividadeFisica: '',
      });
      toast.info('Template em branco carregado.');
    } else if (tmpl === 'Seções padrão') {
      setSections({
        queixaPrincipal: initialData?.sections?.queixaPrincipal || 'Acompanhamento nutricional periódico e modulação da composição corporal.',
        historiaClinica: initialData?.sections?.historiaClinica || 'Sem comorbidades relatadas.',
        habitoIntestinal: initialData?.sections?.habitoIntestinal || 'Hábito regular, fezes tipo 4 de Bristol.',
        hidratacao: initialData?.sections?.hidratacao || 'Consumo habitual de 2.5L de água/dia.',
        rotinaAlimentar: initialData?.sections?.rotinaAlimentar || 'Café da manhã, almoço e jantar estruturados.',
        sonoAtividadeFisica: initialData?.sections?.sonoAtividadeFisica || '7 a 8 horas de sono reparador. Musculação 4x/semana.',
      });
      toast.info('Template de Seções Padrão restaurado!');
    }
  };

  const handleApplyEscala = (escalaName: string, text: string) => {
    setSections((prev) => ({
      ...prev,
      habitoIntestinal: prev.habitoIntestinal ? `${prev.habitoIntestinal}\n${text}` : text,
    }));
    setShowEscalasDropdown(false);
    toast.success(`Escala ${escalaName} inserida na anamnese!`);
  };

  const handleSave = () => {
    const now = new Date();
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const defaultTitle = `Anamnese criada em ${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;

    const anamneseRecord: AnamneseData = {
      id: initialData?.id || String(Date.now()),
      patientId: patient?.id || 'default',
      title: initialData?.title || defaultTitle,
      date: now.toISOString(),
      templateType: selectedTemplate,
      sections,
      transcriptionText,
      hasAudioRecording: Boolean(transcriptionText || recordingSeconds > 0),
    };

    onSave(anamneseRecord);
    toast.success('Anamnese do paciente salva com sucesso!');
  };

  // Simulação de gravação
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info('Gravação de consulta iniciada. Fale normalmente com o paciente...');
      const timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            clearInterval(timer);
            setIsRecording(false);
            setTranscriptionText(
              'Paciente relata queixa principal de cansaço vespertino e dificuldade para ganhar massa magra. Refere ingestão de cerca de 1,5L de água por dia. Intestino funciona diariamente sem queixas de constipação. Pratica musculação três vezes na semana.'
            );
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setTranscriptionText(
        'Paciente relata queixa principal de cansaço vespertino e dificuldade para ganhar massa magra. Refere ingestão de cerca de 1,5L de água por dia. Intestino funciona diariamente sem queixas de constipação. Pratica musculação três vezes na semana.'
      );
      toast.success('Gravação finalizada e transcrita com inteligência artificial!');
    }
  };

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
          1. HEADER SUPERIOR (MODELO EXATO DA IMAGEM)
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
        }}
      >
        {/* Esquerda: Botão Voltar + Avatar + Nome + Idade */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            onClick={onBack}
            title="Voltar"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.35rem',
              borderRadius: '0.375rem',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <ArrowLeft size={16} />
          </button>

          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '0.5rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8125rem',
              color: '#334155',
              flexShrink: 0,
            }}
          >
            {patientInitials}
          </div>

          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
              {patientName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {patientAgeString || '45 anos e 7 meses'}
            </div>
          </div>
        </div>

        {/* Direita: Sugestões Toggle + Ver tutorial + Salvar dados */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Pill Sugestões com Switch */}
          <div
            onClick={() => setSuggestionsActive(!suggestionsActive)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '9999px',
              border: '1px solid var(--primary-border)',
              backgroundColor: 'var(--primary-light)',
              padding: '0.35rem 0.75rem',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)' }}>
              Sugestões
            </span>
            {/* Toggle Switch */}
            <div
              style={{
                width: '32px',
                height: '18px',
                borderRadius: '9999px',
                backgroundColor: suggestionsActive ? 'var(--primary)' : '#cbd5e1',
                position: 'relative',
                transition: 'background-color 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '2px',
                  left: suggestionsActive ? '16px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>

          {/* Botão Ver Tutorial */}
          <button
            type="button"
            onClick={() => toast.info('Abrindo guia e tutorial de preenchimento clínico...')}
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
            <PlayCircle size={15} color="#64748b" />
            <span>Ver tutorial</span>
          </button>

          {/* Botão Salvar Dados (Tema Dinâmico) */}
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.5rem 1.25rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 2px var(--primary-border)',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary-hover)')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--primary)')}
          >
            Salvar dados
          </button>
        </div>
      </header>

      {/* ========================================================
          2. TOOLBAR ROW 1 (ABAS ANAMNESE/TRANSCRIÇÃO + SEÇÕES PADRÃO)
         ======================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 2rem 0.5rem 2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Switch de Abas: Anamnese / Transcrição */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '0.5rem',
            backgroundColor: '#f1f5f9',
            padding: '0.2rem',
            gap: '0.2rem',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('anamnese')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '0.375rem',
              padding: '0.4rem 0.95rem',
              fontSize: '0.8125rem',
              fontWeight: activeTab === 'anamnese' ? 700 : 500,
              backgroundColor: activeTab === 'anamnese' ? '#ffffff' : 'transparent',
              color: activeTab === 'anamnese' ? '#0f172a' : '#64748b',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'anamnese' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <FileText size={14} color={activeTab === 'anamnese' ? '#0f172a' : '#64748b'} />
            <span>Anamnese</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transcricao')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '0.375rem',
              padding: '0.4rem 0.95rem',
              fontSize: '0.8125rem',
              fontWeight: activeTab === 'transcricao' ? 700 : 500,
              backgroundColor: activeTab === 'transcricao' ? '#ffffff' : 'transparent',
              color: activeTab === 'transcricao' ? '#0f172a' : '#64748b',
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'transcricao' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Mic size={14} color={activeTab === 'transcricao' ? '#0f172a' : '#64748b'} />
            <span>Transcrição</span>
          </button>
        </div>

        {/* Dropdown Seções padrão */}
        <div style={{ position: 'relative' }}>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            style={{
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0',
              padding: '0.45rem 2rem 0.45rem 0.85rem',
              fontSize: '0.8125rem',
              color: '#334155',
              backgroundColor: '#ffffff',
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              minWidth: '180px',
            }}
          >
            <option value="Seções padrão">Seções padrão</option>
            <option value="Anamnese Esportiva">Anamnese Esportiva</option>
            <option value="Anamnese Infantil">Anamnese Infantil</option>
            <option value="Saúde Gastrointestinal">Saúde Gastrointestinal</option>
          </select>
          <ChevronDown
            size={14}
            color="#94a3b8"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* ========================================================
          3. TOOLBAR ROW 2 (FORMATAÇÃO DE TEXTO + ESCALAS + ESTRELA)
         ======================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 2rem 0.65rem 2rem',
          borderBottom: '1px solid #f1f5f9',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Botões de Formatação */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {/* H3 Título 3 Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderRadius: '0.375rem',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              padding: '0.25rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary)',
              cursor: 'pointer',
            }}
          >
            <span>H3 Título 3</span>
            <ChevronDown size={12} />
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 0.35rem' }} />

          {/* Negrito, Itálico, Listas, Alinhamento */}
          <button
            type="button"
            title="Negrito"
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              padding: '0.3rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.875rem',
              fontFamily: 'serif',
            }}
          >
            <Bold size={15} />
          </button>

          <button
            type="button"
            title="Itálico"
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              padding: '0.3rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontStyle: 'italic',
            }}
          >
            <Italic size={15} />
          </button>

          <button
            type="button"
            title="Lista com marcadores"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.3rem', cursor: 'pointer' }}
          >
            <List size={15} />
          </button>

          <button
            type="button"
            title="Lista numerada"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.3rem', cursor: 'pointer' }}
          >
            <ListOrdered size={15} />
          </button>

          <button
            type="button"
            title="Alinhamento"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <AlignLeft size={15} />
            <ChevronDown size={11} color="#94a3b8" />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 0.35rem' }} />

          <button
            type="button"
            title="Cor do texto"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.3rem', cursor: 'pointer' }}
          >
            <Type size={15} />
          </button>

          <button
            type="button"
            title="Destaque"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.3rem', cursor: 'pointer' }}
          >
            <Highlighter size={15} />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 0.35rem' }} />

          <button
            type="button"
            title="Inserir link"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.3rem', cursor: 'pointer' }}
          >
            <Link2 size={15} />
          </button>

          <button
            type="button"
            title="Inserir tabela"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.3rem', cursor: 'pointer' }}
          >
            <Table size={15} />
          </button>
        </div>

        {/* Lado Direito da Toolbar: Escalas + Estrela */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowEscalasDropdown(!showEscalasDropdown)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'none',
              border: 'none',
              fontSize: '0.8125rem',
              color: '#334155',
              cursor: 'pointer',
              padding: '0.3rem 0.5rem',
              borderRadius: '0.375rem',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <Paperclip size={14} color="#64748b" />
            <span>Escalas</span>
            <ChevronDown size={13} color="#94a3b8" />
          </button>

          {showEscalasDropdown && (
            <div
              style={{
                position: 'absolute',
                right: '30px',
                top: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                padding: '0.4rem 0',
                minWidth: '220px',
                zIndex: 50,
              }}
            >
              <button
                type="button"
                onClick={() => handleApplyEscala('Bristol', 'Escala de Bristol: Tipo 4 (Em forma de salsicha ou cobra, suave e macio - normal).')}
                style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.8125rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
              >
                Escala de Fezes de Bristol
              </button>
              <button
                type="button"
                onClick={() => handleApplyEscala('Qualidade do Sono', 'Escala de Sono: 8 horas/noite, acordar disposto sem fadiga residual.')}
                style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.8125rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
              >
                Escala de Qualidade do Sono
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsStarred(!isStarred)}
            title={isStarred ? 'Remover dos favoritos' : 'Favoritar este modelo'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isStarred ? '#f59e0b' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Star size={16} fill={isStarred ? '#f59e0b' : 'none'} />
          </button>
        </div>
      </div>

      {/* ========================================================
          4. CANVAS DE CONTEÚDO (CANVAS DA ANAMNESE IDÊNTICO À IMAGEM)
         ======================================================== */}
      <main
        style={{
          flex: 1,
          padding: '1.5rem 2.5rem',
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          maxWidth: '920px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {activeTab === 'anamnese' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Seção 1: Queixa principal e objetivo */}
            <div
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '0.85rem 1rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Queixa principal e objetivo
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  {sections.queixaPrincipal.length} caracteres
                </span>
              </div>
              <textarea
                value={sections.queixaPrincipal}
                onChange={(e) => setSections({ ...sections, queixaPrincipal: e.target.value })}
                placeholder="Descreva o motivo da consulta, queixas clínicas e expectativas nutricionais do paciente..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: '#334155',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box',
                  minHeight: '76px',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>

            {/* Seção 2: História clínica e medicamentos */}
            <div
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '0.85rem 1rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  História clínica e medicamentos
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  {sections.historiaClinica.length} caracteres
                </span>
              </div>
              <textarea
                value={sections.historiaClinica}
                onChange={(e) => setSections({ ...sections, historiaClinica: e.target.value })}
                placeholder="Diagnósticos prévios, exames recentes, cirurgias e medicamentos de uso contínuo..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: '#334155',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box',
                  minHeight: '76px',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>

            {/* Seção 3: Hábito intestinal */}
            <div
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '0.85rem 1rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Hábito intestinal
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  {sections.habitoIntestinal.length} caracteres
                </span>
              </div>
              <textarea
                value={sections.habitoIntestinal}
                onChange={(e) => setSections({ ...sections, habitoIntestinal: e.target.value })}
                placeholder="Frequência evacuatória, consistência das fezes (Bristol), sintomas de distensão ou desconforto..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: '#334155',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box',
                  minHeight: '76px',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>

            {/* Seção 4: Hidratação */}
            <div
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '0.85rem 1rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Hidratação
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  {sections.hidratacao.length} caracteres
                </span>
              </div>
              <textarea
                value={sections.hidratacao}
                onChange={(e) => setSections({ ...sections, hidratacao: e.target.value })}
                placeholder="Consumo hídrico diário estimado em litros/ml, consumo de chás, café e outras bebidas..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: '#334155',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box',
                  minHeight: '76px',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>

            {/* Seção 5: Rotina alimentar */}
            <div
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '0.85rem 1rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Rotina alimentar
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  {sections.rotinaAlimentar.length} caracteres
                </span>
              </div>
              <textarea
                value={sections.rotinaAlimentar}
                onChange={(e) => setSections({ ...sections, rotinaAlimentar: e.target.value })}
                placeholder="Horários habituais de refeições, preferências, aversões e locais onde realiza as refeições..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: '#334155',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box',
                  minHeight: '76px',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>

            {/* Seção 6: Sono e atividade física */}
            <div
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                padding: '0.85rem 1rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Sono e atividade física
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                  {sections.sonoAtividadeFisica.length} caracteres
                </span>
              </div>
              <textarea
                value={sections.sonoAtividadeFisica}
                onChange={(e) => setSections({ ...sections, sonoAtividadeFisica: e.target.value })}
                placeholder="Horas e qualidade de sono por noite, frequência e modalidades de exercício praticadas..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: '#334155',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box',
                  minHeight: '76px',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              />
            </div>
          </div>
        ) : (
          /* ABA DE TRANSCRIÇÃO & GRAVAÇÃO COM IA */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                🎙️ Gravação & Transcrição Inteligente da Consulta
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
                Grave a conversa da consulta presencial ou remota. A inteligência artificial transcreve e organiza os dados clínicos automaticamente.
              </p>

              <button
                type="button"
                onClick={toggleRecording}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: isRecording ? '#e11d48' : 'var(--primary)',
                  color: '#ffffff',
                  padding: '0.65rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px var(--primary-border)',
                }}
              >
                <Mic size={16} />
                <span>{isRecording ? `Gravando (${recordingSeconds}s)... Clique para Parar` : 'Iniciar Gravação de Voz'}</span>
              </button>
            </div>

            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Texto Transcrito
              </h4>
              <textarea
                value={transcriptionText}
                onChange={(e) => setTranscriptionText(e.target.value)}
                placeholder="A transcrição de áudio gerada pela IA aparecerá aqui para você revisar e editar..."
                rows={6}
                style={{
                  width: '100%',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  padding: '0.75rem',
                  fontSize: '0.8125rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--primary-light)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
