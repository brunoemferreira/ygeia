import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Table,
  Link2,
  Unlink,
  Minus,
  Printer,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
  Eraser,
  Clock,
  Check,
  ChevronDown,
  Sparkles,
  Palette,
  Highlighter,
  ZoomIn,
  ZoomOut,
  Sliders,
  Type,
} from 'lucide-react';
import { PatientRecord } from './PatientDirectory';
import { useToast } from '../../context/ToastContext';

export interface AnamneseData {
  id: string;
  patientId: string;
  title: string;
  date: string;
  templateType: string;
  contentHtml?: string;
  sections?: {
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

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
};

const extractSectionsFromText = (text: string) => {
  const titles = [
    'Queixa principal e objetivo',
    'História clínica e medicamentos',
    'Hábito intestinal',
    'Hidratação',
    'Rotina alimentar',
    'Sono e atividade física',
  ];

  const result = {
    queixaPrincipal: '',
    historiaClinica: '',
    habitoIntestinal: '',
    hidratacao: '',
    rotinaAlimentar: '',
    sonoAtividadeFisica: '',
  };

  const keys: (keyof typeof result)[] = [
    'queixaPrincipal',
    'historiaClinica',
    'habitoIntestinal',
    'hidratacao',
    'rotinaAlimentar',
    'sonoAtividadeFisica',
  ];

  for (let i = 0; i < titles.length; i++) {
    const currentTitle = titles[i];
    const nextTitle = titles[i + 1];

    const startIdx = text.indexOf(currentTitle);
    if (startIdx !== -1) {
      const contentStart = startIdx + currentTitle.length;
      let contentEnd = text.length;
      if (nextTitle) {
        const nextIdx = text.indexOf(nextTitle, contentStart);
        if (nextIdx !== -1) {
          contentEnd = nextIdx;
        }
      }
      result[keys[i]] = text.slice(contentStart, contentEnd).trim();
    }
  }

  return result;
};

const TEXT_COLORS = [
  { label: 'Automático (Preto)', color: '#0f172a' },
  { label: 'Cinza Escuro', color: '#475569' },
  { label: 'Verde Clínico (Ygeía)', color: '#059669' },
  { label: 'Azul Médico', color: '#2563eb' },
  { label: 'Vermelho Alerta', color: '#dc2626' },
  { label: 'Laranja / Âmbar', color: '#d97706' },
  { label: 'Roxo / Magenta', color: '#9333ea' },
  { label: 'Verde Musgo', color: '#15803d' },
];

const HIGHLIGHT_COLORS = [
  { label: 'Sem realce', color: 'transparent' },
  { label: 'Amarelo Canário', color: '#fef08a' },
  { label: 'Verde Menta', color: '#bbf7d0' },
  { label: 'Ciano Claro', color: '#bae6fd' },
  { label: 'Rosa Suave', color: '#fbcfe8' },
  { label: 'Laranja Claro', color: '#fed7aa' },
  { label: 'Cinza Realce', color: '#e2e8f0' },
];

const FONT_FAMILIES = [
  { label: 'Inter (Padrão)', value: "'Inter', sans-serif" },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Calibri', value: "'Calibri', 'Segoe UI', sans-serif" },
  { label: 'Times New Roman', value: "'Times New Roman', serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Courier New (Mono)', value: "'Courier New', monospace" },
];

const FONT_SIZES = [
  { label: '10 pt', value: '1' },
  { label: '11 pt', value: '2' },
  { label: '12 pt', value: '3' },
  { label: '14 pt', value: '4' },
  { label: '18 pt', value: '5' },
  { label: '24 pt', value: '6' },
  { label: '32 pt', value: '7' },
];

const generateDocumentHtml = (data?: AnamneseData | null, template: string = 'Seções padrão') => {
  if (data?.contentHtml && data.contentHtml.trim() !== '') {
    return data.contentHtml;
  }

  if (template === 'Anamnese em Branco') {
    return '<p><br></p>';
  }

  const qp = data?.sections?.queixaPrincipal || '';
  const hc = data?.sections?.historiaClinica || '';
  const hi = data?.sections?.habitoIntestinal || '';
  const hd = data?.sections?.hidratacao || '';
  const ra = data?.sections?.rotinaAlimentar || '';
  const sf = data?.sections?.sonoAtividadeFisica || '';

  return `
    <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem 0; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.25rem;">Queixa principal e objetivo</h3>
    <p style="margin: 0.35rem 0 1.25rem 0; min-height: 1.75rem; color: #334155; line-height: 1.6;">${qp ? escapeHtml(qp) : '<br>'}</p>

    <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.25rem;">História clínica e medicamentos</h3>
    <p style="margin: 0.35rem 0 1.25rem 0; min-height: 1.75rem; color: #334155; line-height: 1.6;">${hc ? escapeHtml(hc) : '<br>'}</p>

    <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.25rem;">Hábito intestinal</h3>
    <p style="margin: 0.35rem 0 1.25rem 0; min-height: 1.75rem; color: #334155; line-height: 1.6;">${hi ? escapeHtml(hi) : '<br>'}</p>

    <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.25rem;">Hidratação</h3>
    <p style="margin: 0.35rem 0 1.25rem 0; min-height: 1.75rem; color: #334155; line-height: 1.6;">${hd ? escapeHtml(hd) : '<br>'}</p>

    <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.25rem;">Rotina alimentar</h3>
    <p style="margin: 0.35rem 0 1.25rem 0; min-height: 1.75rem; color: #334155; line-height: 1.6;">${ra ? escapeHtml(ra) : '<br>'}</p>

    <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 0.25rem;">Sono e atividade física</h3>
    <p style="margin: 0.35rem 0 1.25rem 0; min-height: 1.75rem; color: #334155; line-height: 1.6;">${sf ? escapeHtml(sf) : '<br>'}</p>
  `;
};

export const AnamneseEditor: React.FC<AnamneseEditorProps> = ({
  patient,
  patientAgeString,
  initialData,
  onBack,
  onSave,
}) => {
  const { toast } = useToast();
  const editorRef = useRef<HTMLDivElement>(null);

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

  // Estados principais
  const [documentTitle, setDocumentTitle] = useState(
    initialData?.title || `Anamnese Clínica - ${new Date().toLocaleDateString('pt-BR')}`
  );
  const [selectedTemplate, setSelectedTemplate] = useState(initialData?.templateType || 'Seções padrão');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Estados de dropdowns
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showEscalasMenu, setShowEscalasMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);

  // Inicializa o conteúdo do documento
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = generateDocumentHtml(initialData, initialData?.templateType || 'Seções padrão');
      updateStats();
    }
  }, [initialData]);

  // Atualiza contador de palavras e caracteres
  const updateStats = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
      setCharCount(text.length);
      setHasUnsavedChanges(true);
    }
  }, []);

  // Executa comandos de formatação com preservação de foco
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    updateStats();
  };

  // Aplica estilos de bloco (H1, H2, H3, P, Blockquote)
  const applyBlockFormat = (tag: string) => {
    execCmd('formatBlock', tag);
    setShowHeadingMenu(false);
  };

  // Aplica cor de texto
  const applyTextColor = (color: string) => {
    execCmd('foreColor', color);
    setShowColorPicker(false);
  };

  // Aplica realce/marca-texto
  const applyHighlightColor = (color: string) => {
    execCmd('hiliteColor', color);
    setShowHighlightPicker(false);
  };

  // Aplica espaçamento entre linhas
  const applyLineSpacing = (spacing: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentBlock = range.commonAncestorContainer.parentElement;
      if (parentBlock && editorRef.current?.contains(parentBlock)) {
        parentBlock.style.lineHeight = spacing;
      }
    }
    setShowSpacingMenu(false);
  };

  // Inserção de link seguro
  const handleInsertLink = () => {
    const url = prompt('Digite o endereço da URL (ex: https://exames.com.br):');
    if (url) {
      const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      execCmd('createLink', formattedUrl);
      toast.success('Link inserido com sucesso.');
    }
  };

  // Inserção de data e hora atual
  const handleInsertDateTime = () => {
    const now = new Date();
    const str = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    execCmd('insertHTML', `<strong>${str}</strong> `);
    toast.info('Data e hora inseridas.');
  };

  // Inserção de tabela médica Word-style
  const handleInsertTable = (rows = 3, cols = 3) => {
    let tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 1.25rem 0; border: 1px solid #cbd5e1; font-size: 0.875rem;">
        <thead>
          <tr style="background-color: #f1f5f9; color: #0f172a;">
    `;
    for (let c = 0; c < cols; c++) {
      tableHtml += `<th style="border: 1px solid #cbd5e1; padding: 0.6rem 0.85rem; text-align: left; font-weight: 700;">Coluna ${c + 1}</th>`;
    }
    tableHtml += `
          </tr>
        </thead>
        <tbody>
    `;
    for (let r = 0; r < rows; r++) {
      tableHtml += `<tr>`;
      for (let c = 0; c < cols; c++) {
        tableHtml += `<td style="border: 1px solid #cbd5e1; padding: 0.6rem 0.85rem; color: #334155;">Dado ${r + 1}.${c + 1}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `
        </tbody>
      </table>
      <p><br></p>
    `;
    execCmd('insertHTML', tableHtml);
    toast.success(`Tabela ${rows}x${cols} inserida com sucesso.`);
  };

  // Inserção de escalas clínicas com templates ricos
  const handleInsertEscala = (tipo: string) => {
    let escalaHtml = '';
    if (tipo === 'bristol') {
      escalaHtml = `
        <div style="background-color: #f8fafc; border-left: 4px solid var(--primary); padding: 0.85rem 1rem; margin: 1rem 0; border-radius: 0 0.5rem 0.5rem 0;">
          <h4 style="margin: 0 0 0.35rem 0; font-size: 0.9375rem; color: #0f172a; font-weight: 700;">📋 Escala de Fezes de Bristol</h4>
          <p style="margin: 0; font-size: 0.875rem; color: #334155; line-height: 1.5;">
            <strong>Resultado:</strong> Tipo 4 (Em formato de salsicha ou cobra, suave e macio — considerado padrão ouro e normal).
          </p>
          <p style="margin: 0.35rem 0 0 0; font-size: 0.8125rem; color: #64748b;">
            Frequência: 1x ao dia | Sem dor ou esforço evacuatório relatado.
          </p>
        </div>
        <p><br></p>
      `;
    } else if (tipo === 'sono') {
      escalaHtml = `
        <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 0.85rem 1rem; margin: 1rem 0; border-radius: 0 0.5rem 0.5rem 0;">
          <h4 style="margin: 0 0 0.35rem 0; font-size: 0.9375rem; color: #0f172a; font-weight: 700;">🌙 Avaliação de Qualidade do Sono</h4>
          <p style="margin: 0; font-size: 0.875rem; color: #334155; line-height: 1.5;">
            <strong>Duração média:</strong> 7 a 8 horas/noite | <strong>Latência:</strong> 15 minutos | <strong>Acordar:</strong> Disposto, sono reparador.
          </p>
        </div>
        <p><br></p>
      `;
    } else if (tipo === 'eva') {
      escalaHtml = `
        <div style="background-color: #f8fafc; border-left: 4px solid #ef4444; padding: 0.85rem 1rem; margin: 1rem 0; border-radius: 0 0.5rem 0.5rem 0;">
          <h4 style="margin: 0 0 0.35rem 0; font-size: 0.9375rem; color: #0f172a; font-weight: 700;">⚡ Escala Visual Analógica de Dor (EVA)</h4>
          <p style="margin: 0; font-size: 0.875rem; color: #334155;">
            <strong>Nível de desconforto/dor:</strong> 0 de 10 (Ausência de dores articulares ou abdominais).
          </p>
        </div>
        <p><br></p>
      `;
    }
    execCmd('insertHTML', escalaHtml);
    setShowEscalasMenu(false);
    toast.success('Escala clínica inserida.');
  };

  // Troca de Modelo de Anamnese
  const handleTemplateChange = (tmpl: string) => {
    setSelectedTemplate(tmpl);
    if (editorRef.current) {
      if (tmpl === 'Anamnese em Branco') {
        editorRef.current.innerHTML = '<p><br></p>';
        toast.info('Template em branco carregado.');
      } else {
        editorRef.current.innerHTML = generateDocumentHtml(null, tmpl);
        toast.info(`Template "${tmpl}" carregado.`);
      }
      updateStats();
    }
  };

  // Tratamento de teclas especiais (Tab = indentação; Enter em título = parágrafo)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      execCmd('insertText', '    ');
    }
  };

  // Impressão / Exportação para PDF nativa
  const handlePrint = () => {
    window.print();
  };

  // Salvamento do Documento
  const handleSave = () => {
    const rawHtml = editorRef.current?.innerHTML || '';
    const rawText = editorRef.current?.innerText || '';
    const extractedSections = extractSectionsFromText(rawText);

    const now = new Date();
    const anamneseRecord: AnamneseData = {
      id: initialData?.id || String(Date.now()),
      patientId: patient?.id || 'default',
      title: documentTitle.trim() || `Anamnese Clínica - ${now.toLocaleDateString('pt-BR')}`,
      date: initialData?.date || now.toISOString(),
      templateType: selectedTemplate,
      contentHtml: rawHtml,
      sections: extractedSections,
    };

    onSave(anamneseRecord);
    setHasUnsavedChanges(false);
    toast.success('Anamnese salva com sucesso!');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: isFullScreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: isFullScreen ? 9999 : 1,
      }}
    >
      {/* ========================================================
          1. BARRA SUPERIOR DE AÇÃO (TÍTULO DO DOCUMENTO & BOTÕES)
         ======================================================== */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1.5rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        {/* Esquerda: Voltar + Título do Documento Editável + Paciente */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            onClick={onBack}
            title="Voltar ao perfil do paciente"
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              color: '#475569',
              padding: '0.45rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
          >
            <ArrowLeft size={16} />
          </button>

          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}
          >
            {patientInitials}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => {
                setDocumentTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              placeholder="Título da Anamnese..."
              style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: '#0f172a',
                border: '1px solid transparent',
                borderRadius: '0.375rem',
                padding: '0.15rem 0.4rem',
                backgroundColor: 'transparent',
                outline: 'none',
                maxWidth: '360px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'transparent';
                e.target.style.backgroundColor = 'transparent';
              }}
            />
            <span style={{ fontSize: '0.6875rem', color: '#64748b', paddingLeft: '0.4rem' }}>
              Paciente: <strong>{patientName}</strong> ({patientAgeString})
            </span>
          </div>
        </div>

        {/* Direita: Modelo, Imprimir, Foco e Salvar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Seletor de Modelo */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              style={{
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                padding: '0.45rem 2rem 0.45rem 0.75rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#ffffff',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              <option value="Seções padrão">Modelo: Seções padrão</option>
              <option value="Anamnese em Branco">Modelo: Em Branco</option>
              <option value="Anamnese Esportiva">Modelo: Nutrição Esportiva</option>
              <option value="Saúde Gastrointestinal">Modelo: Gastrointestinal</option>
            </select>
            <ChevronDown
              size={13}
              color="#94a3b8"
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>

          {/* Imprimir / Exportar PDF */}
          <button
            type="button"
            onClick={handlePrint}
            title="Imprimir documento ou salvar como PDF (Ctrl+P)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              padding: '0.45rem 0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            <Printer size={15} color="#64748b" />
            <span className="desktop-only">Imprimir</span>
          </button>

          {/* Modo Tela Cheia / Foco */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title={isFullScreen ? 'Sair da tela cheia' : 'Modo Foco em Tela Cheia'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              padding: '0.45rem',
              color: '#334155',
              cursor: 'pointer',
            }}
          >
            {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Botão Salvar Dados */}
          <button
            type="button"
            onClick={handleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '0.45rem 1.15rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Check size={16} />
            <span>Salvar dados</span>
          </button>
        </div>
      </header>

      {/* ========================================================
          2. BARRA DE FERRAMENTAS DO WORD (RIBBON COMPLETO)
         ======================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.35rem 1.25rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          gap: '0.25rem',
          flexWrap: 'wrap',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          userSelect: 'none',
        }}
        onMouseDown={(e) => {
          // Previne que cliques na toolbar retirem a seleção do texto
          if ((e.target as HTMLElement).tagName !== 'SELECT' && (e.target as HTMLElement).tagName !== 'INPUT') {
            e.preventDefault();
          }
        }}
      >
        {/* GRUPO 1: HISTÓRICO (UNDO / REDO) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          <button
            type="button"
            onClick={() => execCmd('undo')}
            title="Desfazer (Ctrl+Z)"
            style={toolbarBtnStyle}
          >
            <Undo size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            title="Refazer (Ctrl+Y)"
            style={toolbarBtnStyle}
          >
            <Redo size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('removeFormat')}
            title="Limpar toda a formatação"
            style={toolbarBtnStyle}
          >
            <Eraser size={14} />
          </button>
        </div>

        <div style={separatorStyle} />

        {/* GRUPO 2: TIPOGRAFIA (FONTE E TAMANHO) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {/* Seletor de Família da Fonte */}
          <select
            onChange={(e) => execCmd('fontName', e.target.value)}
            defaultValue="'Inter', sans-serif"
            title="Fonte do texto"
            style={{
              borderRadius: '0.375rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '120px',
            }}
          >
            {FONT_FAMILIES.map((f, i) => (
              <option key={i} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Seletor de Tamanho */}
          <select
            onChange={(e) => execCmd('fontSize', e.target.value)}
            defaultValue="3"
            title="Tamanho da fonte"
            style={{
              borderRadius: '0.375rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              padding: '0.25rem 0.4rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
              width: '65px',
            }}
          >
            {FONT_SIZES.map((s, i) => (
              <option key={i} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Estilos de Bloco / Títulos (H1, H2, H3, P) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
              title="Estilo de título e parágrafo"
              style={{
                ...toolbarBtnStyle,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <Type size={13} />
              <span>Estilo</span>
              <ChevronDown size={11} color="#94a3b8" />
            </button>

            {showHeadingMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '0.35rem 0',
                  zIndex: 100,
                  minWidth: '170px',
                }}
              >
                <button
                  type="button"
                  onClick={() => applyBlockFormat('<p>')}
                  style={dropdownItemStyle}
                >
                  <span style={{ fontSize: '0.875rem' }}>Texto Normal (P)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyBlockFormat('<h1>')}
                  style={dropdownItemStyle}
                >
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>Título 1 (H1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyBlockFormat('<h2>')}
                  style={dropdownItemStyle}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Título 2 (H2)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyBlockFormat('<h3>')}
                  style={dropdownItemStyle}
                >
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>Título 3 (H3)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyBlockFormat('<blockquote>')}
                  style={dropdownItemStyle}
                >
                  <span style={{ fontStyle: 'italic', color: '#64748b' }}>Citação / Destaque</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={separatorStyle} />

        {/* GRUPO 3: FORMATAÇÃO BÁSICA (B, I, U, S, Sub, Sup) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          <button
            type="button"
            onClick={() => execCmd('bold')}
            title="Negrito (Ctrl+B)"
            style={{ ...toolbarBtnStyle, fontWeight: 800 }}
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            title="Itálico (Ctrl+I)"
            style={toolbarBtnStyle}
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            title="Sublinhado (Ctrl+U)"
            style={toolbarBtnStyle}
          >
            <Underline size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            title="Tachado"
            style={toolbarBtnStyle}
          >
            <Strikethrough size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('subscript')}
            title="Subscrito (ex: H₂O)"
            style={toolbarBtnStyle}
          >
            <Subscript size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('superscript')}
            title="Sobrescrito (ex: m²)"
            style={toolbarBtnStyle}
          >
            <Superscript size={14} />
          </button>
        </div>

        <div style={separatorStyle} />

        {/* GRUPO 4: CORES DO WORD (COR DA FONTE & REALCE) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          {/* Cor do Texto */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              title="Cor do Texto"
              style={{ ...toolbarBtnStyle, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <Palette size={14} color="#0f172a" />
              <ChevronDown size={10} color="#94a3b8" />
            </button>

            {showColorPicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '0.5rem',
                  zIndex: 100,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.35rem',
                  width: '140px',
                }}
              >
                {TEXT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTextColor(c.color)}
                    title={c.label}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '0.25rem',
                      backgroundColor: c.color,
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Realce / Marca-texto */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              title="Cor de Realce do Texto (Marca-texto)"
              style={{ ...toolbarBtnStyle, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <Highlighter size={14} color="#d97706" />
              <ChevronDown size={10} color="#94a3b8" />
            </button>

            {showHighlightPicker && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '0.5rem',
                  zIndex: 100,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.35rem',
                  width: '140px',
                }}
              >
                {HIGHLIGHT_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyHighlightColor(c.color)}
                    title={c.label}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '0.25rem',
                      backgroundColor: c.color === 'transparent' ? '#ffffff' : c.color,
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer',
                      fontSize: '0.6rem',
                    }}
                  >
                    {c.color === 'transparent' ? '✕' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={separatorStyle} />

        {/* GRUPO 5: PARÁGRAFO & ALINHAMENTO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            title="Alinhar à Esquerda (Ctrl+L)"
            style={toolbarBtnStyle}
          >
            <AlignLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            title="Centralizar (Ctrl+E)"
            style={toolbarBtnStyle}
          >
            <AlignCenter size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            title="Alinhar à Direita (Ctrl+R)"
            style={toolbarBtnStyle}
          >
            <AlignRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyFull')}
            title="Justificar (Ctrl+J)"
            style={toolbarBtnStyle}
          >
            <AlignJustify size={14} />
          </button>

          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            title="Lista com Marcadores"
            style={toolbarBtnStyle}
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            title="Lista Numerada"
            style={toolbarBtnStyle}
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('outdent')}
            title="Diminuir Recuo"
            style={toolbarBtnStyle}
          >
            <Outdent size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('indent')}
            title="Aumentar Recuo"
            style={toolbarBtnStyle}
          >
            <Indent size={14} />
          </button>

          {/* Espaçamento entre Linhas */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowSpacingMenu(!showSpacingMenu)}
              title="Espaçamento entre Linhas"
              style={{ ...toolbarBtnStyle, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <Sliders size={13} />
              <ChevronDown size={10} color="#94a3b8" />
            </button>

            {showSpacingMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '0.35rem 0',
                  zIndex: 100,
                  minWidth: '130px',
                }}
              >
                {['1.0', '1.15', '1.5', '2.0'].map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => applyLineSpacing(sp)}
                    style={dropdownItemStyle}
                  >
                    <span>Espaço {sp}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={separatorStyle} />

        {/* GRUPO 6: INSERÇÕES (TABELA, LINK, LINHA, DATA/HORA, ESCALAS) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          <button
            type="button"
            onClick={() => handleInsertTable(3, 3)}
            title="Inserir Tabela 3x3"
            style={toolbarBtnStyle}
          >
            <Table size={14} />
          </button>
          <button
            type="button"
            onClick={handleInsertLink}
            title="Inserir Link (Ctrl+K)"
            style={toolbarBtnStyle}
          >
            <Link2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('unlink')}
            title="Remover Link"
            style={toolbarBtnStyle}
          >
            <Unlink size={14} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertHorizontalRule')}
            title="Linha Horizontal Divisória"
            style={toolbarBtnStyle}
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            onClick={handleInsertDateTime}
            title="Inserir Data e Hora Atual"
            style={toolbarBtnStyle}
          >
            <Clock size={14} />
          </button>

          {/* Dropdown de Escalas Clínicas Prontas */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowEscalasMenu(!showEscalasMenu)}
              title="Inserir Escalas Clínicas Prontas"
              style={{
                ...toolbarBtnStyle,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                border: '1px solid #cbd5e1',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--primary)',
              }}
            >
              <Sparkles size={13} color="var(--primary)" />
              <span>Escalas</span>
              <ChevronDown size={11} color="#94a3b8" />
            </button>

            {showEscalasMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '0.4rem 0',
                  zIndex: 100,
                  minWidth: '220px',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleInsertEscala('bristol')}
                  style={dropdownItemStyle}
                >
                  <span>📋 Escala de Fezes de Bristol</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertEscala('sono')}
                  style={dropdownItemStyle}
                >
                  <span>🌙 Qualidade do Sono</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertEscala('eva')}
                  style={dropdownItemStyle}
                >
                  <span>⚡ Escala Visual de Dor (EVA)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          3. ÁREA DE TRABALHO DA FOLHA A4 (CANVAS WORD REALISTA)
         ======================================================== */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
          backgroundColor: '#e2e8f0',
        }}
        onClick={() => {
          // Fecha menus ao clicar fora
          if (showColorPicker) setShowColorPicker(false);
          if (showHighlightPicker) setShowHighlightPicker(false);
          if (showEscalasMenu) setShowEscalasMenu(false);
          if (showHeadingMenu) setShowHeadingMenu(false);
          if (showSpacingMenu) setShowSpacingMenu(false);
        }}
      >
        {/* Folha A4 Centralizada com Sombra Realista */}
        <div
          className="print-page"
          style={{
            width: '100%',
            maxWidth: '820px',
            minHeight: '1050px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            padding: '3.5rem 4rem',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease',
          }}
        >
          {/* Cabeçalho da Folha Clínica (Word Letterhead) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '1.25rem',
              marginBottom: '1.75rem',
              borderBottom: '2px solid var(--primary)',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                Prontuário Nutricional — Avaliação Clínica
              </h2>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                Paciente: <strong>{patientName}</strong> | Idade: {patientAgeString} | CPF: {patient?.cpf || 'Não informado'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                }}
              >
                YGEÍA CLINICAL
              </span>
              <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Área de Digitação Contínua Editável (Word Document Body) */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={updateStats}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              outline: 'none',
              fontSize: '0.9375rem',
              lineHeight: '1.7',
              color: '#1e293b',
              minHeight: '750px',
              cursor: 'text',
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>
      </div>

      {/* ========================================================
          4. BARRA DE STATUS INFERIOR (WORD STATUS BAR)
         ======================================================== */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.4rem 1.5rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.75rem',
          color: '#64748b',
          flexWrap: 'wrap',
          gap: '0.75rem',
          userSelect: 'none',
        }}
      >
        {/* Esquerda: Status da Página e Palavras */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span>Página 1 de 1</span>
          <span>{wordCount} palavras</span>
          <span>{charCount} caracteres</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: hasUnsavedChanges ? '#d97706' : '#16a34a' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: hasUnsavedChanges ? '#d97706' : '#16a34a',
              }}
            />
            {hasUnsavedChanges ? 'Alterações não salvas' : 'Documento sincronizado'}
          </span>
        </div>

        {/* Direita: Controle de Zoom Word-style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
            title="Reduzir Zoom"
            style={{ ...toolbarBtnStyle, padding: '0.2rem' }}
          >
            <ZoomOut size={13} />
          </button>
          <span style={{ fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
            title="Aumentar Zoom"
            style={{ ...toolbarBtnStyle, padding: '0.2rem' }}
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </footer>
    </div>
  );
};

// Estilos utilitários dos botões da Toolbar Word
const toolbarBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#475569',
  padding: '0.35rem 0.45rem',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};

const separatorStyle: React.CSSProperties = {
  width: '1px',
  height: '20px',
  backgroundColor: '#e2e8f0',
  margin: '0 0.35rem',
};

const dropdownItemStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  padding: '0.45rem 1rem',
  fontSize: '0.8125rem',
  border: 'none',
  background: 'transparent',
  color: '#0f172a',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};
