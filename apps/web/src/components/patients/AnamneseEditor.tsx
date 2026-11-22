import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  PlayCircle,
  Sparkles,
  FileText,
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

  return `<h3 style="font-size: 0.9375rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem 0;">Queixa principal e objetivo</h3>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;">${qp ? escapeHtml(qp) : '<br>'}</p>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;"><br></p>

<h3 style="font-size: 0.9375rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0;">História clínica e medicamentos</h3>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;">${hc ? escapeHtml(hc) : '<br>'}</p>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;"><br></p>

<h3 style="font-size: 0.9375rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0;">Hábito intestinal</h3>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;">${hi ? escapeHtml(hi) : '<br>'}</p>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;"><br></p>

<h3 style="font-size: 0.9375rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0;">Hidratação</h3>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;">${hd ? escapeHtml(hd) : '<br>'}</p>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;"><br></p>

<h3 style="font-size: 0.9375rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0;">Rotina alimentar</h3>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;">${ra ? escapeHtml(ra) : '<br>'}</p>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;"><br></p>

<h3 style="font-size: 0.9375rem; font-weight: 700; color: #0f172a; margin: 1.25rem 0 0.4rem 0;">Sono e atividade física</h3>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;">${sf ? escapeHtml(sf) : '<br>'}</p>
<p style="margin: 0 0 1.25rem 0; min-height: 1.5rem; color: #334155; line-height: 1.6;"><br></p>`;
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

  // Toggle sugestões inteligentes
  const [suggestionsActive, setSuggestionsActive] = useState(true);

  // Template selecionado
  const [selectedTemplate, setSelectedTemplate] = useState(initialData?.templateType || 'Seções padrão');

  // Escalas clínicas dropdown
  const [showEscalasDropdown, setShowEscalasDropdown] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Sincroniza o editor de texto quando initialData for montado ou alterado
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = generateDocumentHtml(initialData, initialData?.templateType || 'Seções padrão');
    }
  }, [initialData]);

  // Aplicação de formatação na seleção
  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Troca de modelo / template
  const handleTemplateChange = (tmpl: string) => {
    setSelectedTemplate(tmpl);
    if (editorRef.current) {
      if (tmpl === 'Anamnese em Branco') {
        editorRef.current.innerHTML = '<p><br></p>';
        toast.info('Template em branco carregado.');
      } else {
        editorRef.current.innerHTML = generateDocumentHtml(null, tmpl);
        toast.info(`Template "${tmpl}" carregado com sucesso.`);
      }
    }
  };

  // Inserção de link
  const handleInsertLink = () => {
    const url = prompt('Insira o endereço URL para o link:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  // Inserção de tabela simples
  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.8125rem;">Parâmetro / Avaliação</th>
            <th style="border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; text-align: left; font-size: 0.8125rem;">Registro Clínico</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; font-size: 0.8125rem;">Meta / Diagnóstico</td>
            <td style="border: 1px solid #cbd5e1; padding: 0.5rem 0.75rem; font-size: 0.8125rem;">Preencher observação</td>
          </tr>
        </tbody>
      </table>
      <p><br></p>
    `;
    applyFormat('insertHTML', tableHtml);
  };

  // Inserção de escalas clínicas (Bristol, Sono, etc.)
  const handleApplyEscala = (escalaName: string, text: string) => {
    const block = `
      <div style="background-color: #f8fafc; border-left: 3px solid var(--primary); padding: 0.6rem 0.85rem; margin: 0.75rem 0; font-size: 0.875rem; color: #1e293b;">
        <strong>[${escalaName}]</strong>: ${escapeHtml(text)}
      </div>
      <p><br></p>
    `;
    applyFormat('insertHTML', block);
    setShowEscalasDropdown(false);
    toast.success(`Escala "${escalaName}" inserida no editor!`);
  };

  // Salvamento dos dados da Anamnese
  const handleSave = () => {
    const rawHtml = editorRef.current?.innerHTML || '';
    const rawText = editorRef.current?.innerText || '';
    const extractedSections = extractSectionsFromText(rawText);

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
      date: initialData?.date || now.toISOString(),
      templateType: selectedTemplate,
      contentHtml: rawHtml,
      sections: extractedSections,
    };

    onSave(anamneseRecord);
    toast.success('Anamnese salva com sucesso!');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ========================================================
          1. CABEÇALHO SUPERIOR (VOLTAR, PACIENTE, TUTORIAL, SALVAR)
         ======================================================== */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 2rem',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#ffffff',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Identificação do Paciente */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="button"
            onClick={onBack}
            title="Voltar ao perfil do paciente"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '0.4rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <ArrowLeft size={18} />
          </button>

          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8125rem',
            }}
          >
            {patientInitials}
          </div>

          <div>
            <h1 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {patientName}
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {patientAgeString}
            </span>
          </div>
        </div>

        {/* Controles da Direita */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Pill Sugestões */}
          <button
            type="button"
            onClick={() => {
              setSuggestionsActive(!suggestionsActive);
              toast.info(`Sugestões clínicas inteligentes ${!suggestionsActive ? 'ativadas' : 'desativadas'}.`);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '9999px',
              border: '1px solid #d1fae5',
              backgroundColor: '#ecfdf5',
              padding: '0.35rem 0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--primary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={14} color="var(--primary)" />
            <span>Sugestões</span>
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
                }}
              />
            </div>
          </button>

          {/* Botão Ver Tutorial */}
          <button
            type="button"
            onClick={() => toast.info('Tutorial do editor de anamnese interativo.')}
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
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff')}
          >
            <PlayCircle size={15} color="#64748b" />
            <span>Ver tutorial</span>
          </button>

          {/* Botão Salvar Dados */}
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
          2. LINHA DE SUB-CABEÇALHO (INDICADOR ANAMNESE + SEÇÕES PADRÃO)
         ======================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 2.5rem 0.5rem 2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Indicador Anamnese */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '0.5rem',
            backgroundColor: '#f1f5f9',
            padding: '0.2rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '0.375rem',
              padding: '0.4rem 0.95rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              backgroundColor: '#ffffff',
              color: '#0f172a',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <FileText size={14} color="#0f172a" />
            <span>Anamnese</span>
          </div>
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
            <option value="Anamnese em Branco">Anamnese em Branco</option>
          </select>
          <ChevronDown
            size={14}
            color="#94a3b8"
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* ========================================================
          3. BARRA DE FERRAMENTAS DO EDITOR (TOOLBAR RICA)
         ======================================================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 2.5rem',
          borderTop: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#ffffff',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Lado Esquerdo da Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {/* Seletor de Título H3 Título 3 */}
          <button
            type="button"
            onClick={() => applyFormat('formatBlock', '<h3>')}
            title="Formatar como H3 Título 3"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary)',
              borderRadius: '0.375rem',
              padding: '0.3rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>H3 Título 3</span>
            <ChevronDown size={12} color="var(--primary)" />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 0.35rem' }} />

          {/* Negrito B */}
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            title="Negrito (Ctrl+B)"
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              padding: '0.35rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.875rem',
              fontFamily: 'serif',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <Bold size={15} />
          </button>

          {/* Itálico I */}
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            title="Itálico (Ctrl+I)"
            style={{
              background: 'none',
              border: 'none',
              color: '#475569',
              padding: '0.35rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <Italic size={15} />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 0.35rem' }} />

          {/* Lista com Marcadores */}
          <button
            type="button"
            onClick={() => applyFormat('insertUnorderedList')}
            title="Lista com marcadores"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.35rem', borderRadius: '0.25rem', cursor: 'pointer' }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <List size={15} />
          </button>

          {/* Lista Numerada */}
          <button
            type="button"
            onClick={() => applyFormat('insertOrderedList')}
            title="Lista numerada"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.35rem', borderRadius: '0.25rem', cursor: 'pointer' }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <ListOrdered size={15} />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 0.35rem' }} />

          {/* Alinhamento */}
          <button
            type="button"
            onClick={() => applyFormat('justifyLeft')}
            title="Alinhar à esquerda"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.35rem', borderRadius: '0.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <AlignLeft size={15} />
            <ChevronDown size={11} color="#94a3b8" />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 0.35rem' }} />

          {/* Sublinhado / Formatação */}
          <button
            type="button"
            onClick={() => applyFormat('underline')}
            title="Sublinhado (Ctrl+U)"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.35rem', borderRadius: '0.25rem', cursor: 'pointer' }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <Type size={15} />
          </button>

          {/* Destaque / Cor */}
          <button
            type="button"
            onClick={() => applyFormat('foreColor', 'var(--primary)')}
            title="Destaque em cor do tema"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.35rem', borderRadius: '0.25rem', cursor: 'pointer' }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <Highlighter size={15} />
          </button>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#e2e8f0', margin: '0 0.35rem' }} />

          {/* Inserir Link */}
          <button
            type="button"
            onClick={handleInsertLink}
            title="Inserir link"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.35rem', borderRadius: '0.25rem', cursor: 'pointer' }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
          >
            <Link2 size={15} />
          </button>

          {/* Inserir Tabela */}
          <button
            type="button"
            onClick={handleInsertTable}
            title="Inserir tabela clínica"
            style={{ background: 'none', border: 'none', color: '#475569', padding: '0.35rem', borderRadius: '0.25rem', cursor: 'pointer' }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
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
          4. CANVAS DO EDITOR DE TEXTO (DOCUMENTO UNIFICADO)
         ======================================================== */}
      <main
        style={{
          flex: 1,
          padding: '2rem 2.5rem',
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          maxWidth: '920px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          style={{
            minHeight: '650px',
            outline: 'none',
            fontSize: '0.9375rem',
            lineHeight: '1.7',
            color: '#334155',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            cursor: 'text',
          }}
        />
      </main>
    </div>
  );
};
