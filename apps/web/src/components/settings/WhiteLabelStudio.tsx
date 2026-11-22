import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Palette,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Save,
  ShieldCheck,
  Smartphone,
  Layout,
  LogIn,
  Wand2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { AppButton } from '../ui/AppButton';
import { AppInput } from '../ui/AppInput';
import { AppCard } from '../ui/AppCard';
import { AppBadge } from '../ui/AppBadge';
import { useToast } from '../../context/ToastContext';
import {
  getStoredBranding,
  saveStoredBranding,
  DEFAULT_BRANDING,
  ClinicBranding,
  buildLoginHeroGradient,
  applyClinicTheme,
} from '../../utils/branding';

interface ColorPreset {
  id: string;
  name: string;
  category: string;
  primary: string;
  secondary: string;
  accent: string;
  description: string;
}

const PRESET_PALETTES: ColorPreset[] = [
  {
    id: 'emerald',
    name: 'Esmeralda Ygeía',
    category: 'Oficial',
    primary: '#059669',
    secondary: '#064e3b',
    accent: '#10b981',
    description: 'Saúde metabólica, renovação celular e conformidade médica.',
  },
  {
    id: 'ocean',
    name: 'Azul Clínico & Sky',
    category: 'Clínica',
    primary: '#0284c7',
    secondary: '#0c4a6e',
    accent: '#38bdf8',
    description: 'Confiança institucional, sobriedade e farmacocinética.',
  },
  {
    id: 'amethyst',
    name: 'Ametista & Longevidade',
    category: 'Integrativa',
    primary: '#7c3aed',
    secondary: '#4c1d95',
    accent: '#a78bfa',
    description: 'Nutrição funcional, anti-aging e equilíbrio integrativo.',
  },
  {
    id: 'sage',
    name: 'Sálvia Natural & Oliva',
    category: 'Biológica',
    primary: '#0d9488',
    secondary: '#134e4a',
    accent: '#2dd4bf',
    description: 'Nutrição orgânica, longevidade e harmonia natural.',
  },
  {
    id: 'coral',
    name: 'Coral & Vitalidade',
    category: 'Esportiva',
    primary: '#ea580c',
    secondary: '#7c2d12',
    accent: '#fb923c',
    description: 'Alta performance atlética, quebra metabólica e energia.',
  },
  {
    id: 'titanium',
    name: 'Titanium Executivo',
    category: 'Premium',
    primary: '#334155',
    secondary: '#0f172a',
    accent: '#64748b',
    description: 'Consultórios executivos de alto padrão e minimalismo estético.',
  },
];

// Helper para cálculo de contraste e luminância (WCAG 2.2)
function getLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

// Helper para escurecer ou clarear cor
function adjustHex(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export const WhiteLabelStudio: React.FC = () => {
  const { toast } = useToast();
  const [branding, setBranding] = useState<ClinicBranding>(() => getStoredBranding());
  const [activePreviewTab, setActivePreviewTab] = useState<'dashboard' | 'login' | 'patient'>('dashboard');
  const [isSaving, setIsSaving] = useState(false);

  // Análise de Contraste WCAG do botão principal sobre texto branco
  const contrastRatioWhite = useMemo(() => {
    return getContrastRatio(branding.primaryColor, '#ffffff');
  }, [branding.primaryColor]);

  const isWcagCompliant = contrastRatioWhite >= 4.5;

  const handleApplyPreset = (preset: ColorPreset) => {
    const updated = {
      ...branding,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    };
    setBranding(updated);
    applyClinicTheme(updated);
    toast.success(`Paleta "${preset.name}" aplicada à pré-visualização.`);
  };

  const handleAutoHarmonize = () => {
    const primary = branding.primaryColor;
    const secondary = adjustHex(primary, -35); // Versão profunda e contrastante
    const accent = adjustHex(primary, 30); // Versão vibrante e luminosa

    const updated = {
      ...branding,
      secondaryColor: secondary,
      accentColor: accent,
    };
    setBranding(updated);
    applyClinicTheme(updated);
    toast.success('Cores secundária e de destaque harmonizadas automaticamente.');
  };

  const handleResetDefaults = () => {
    setBranding({ ...DEFAULT_BRANDING });
    applyClinicTheme(DEFAULT_BRANDING);
    toast.info('Identidade visual restaurada para os padrões oficiais do Ygeía.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      saveStoredBranding(branding);
      toast.success('Identidade visual e marca sincronizadas com sucesso em todo o sistema!');
    } catch {
      toast.error('Erro ao salvar configurações de identidade visual.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Cabeçalho do Studio */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#059669',
              fontSize: '0.6875rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}
          >
            <Palette size={13} />
            <span>White-Label Studio & Design System</span>
          </div>

          <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
            Personalização de Marca & Identidade Visual
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0, fontWeight: 400 }}>
            Configure a marca, paleta de cores e tipografia do seu consultório com atualização e simulação em tempo real.
          </p>
        </div>

        {/* Ações Rápidas do Topo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <AppButton
            variant="outline"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={handleResetDefaults}
          >
            Restaurar Padrão
          </AppButton>

          <AppButton
            variant="primary"
            size="sm"
            icon={<Save size={14} />}
            loading={isSaving}
            onClick={handleSave}
          >
            Salvar Identidade
          </AppButton>
        </div>
      </div>

      {/* Grid Split-Screen 2 Colunas (Controles à Esquerda / Live Simulator à Direita) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 1.1fr) minmax(340px, 1fr)',
          gap: '1.75rem',
          alignItems: 'start',
        }}
      >
        {/* ========================================================
            COLUNA ESQUERDA: CONTROLES PROFISSIONAIS DE DESIGN
           ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: Marca & Naming */}
          <AppCard>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={16} color={branding.primaryColor} />
              <span>Nome da Marca & Consultório</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AppInput
                label="Nome do Consultório / Clínica"
                placeholder="Ex: Ygeía • Clínica de Nutrição"
                value={branding.clinicName}
                onChange={(e) => setBranding({ ...branding, clinicName: e.target.value })}
                required
              />

              <AppInput
                label="Slogan Institucional"
                placeholder="Ex: Nutrição Clínica & Governança Metabólica"
                value={branding.slogan || ''}
                onChange={(e) => setBranding({ ...branding, slogan: e.target.value })}
              />
            </div>
          </AppCard>

          {/* Card 2: Paletas Médicas Curadas (1-Clique) */}
          <AppCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="#eab308" />
                <span>Paletas Clínicas Pré-Testadas (1-Clique)</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 500 }}>
                6 temas estéticos
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {PRESET_PALETTES.map((preset) => {
                const isSelected =
                  branding.primaryColor.toLowerCase() === preset.primary.toLowerCase();
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    style={{
                      padding: '0.875rem',
                      borderRadius: '0.625rem',
                      border: `1.5px solid ${isSelected ? preset.primary : '#e2e8f0'}`,
                      backgroundColor: isSelected ? `${preset.primary}08` : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? `0 2px 10px ${preset.primary}25` : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                        {preset.name}
                      </span>
                      {isSelected && <CheckCircle2 size={15} color={preset.primary} />}
                    </div>

                    {/* Amostras das 3 cores */}
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: preset.primary, border: '2px solid #ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} title="Primária" />
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: preset.secondary, border: '2px solid #ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} title="Secundária" />
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: preset.accent, border: '2px solid #ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} title="Destaque" />
                    </div>

                    <div style={{ fontSize: '0.6875rem', color: '#64748b', lineHeight: 1.3 }}>
                      {preset.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </AppCard>

          {/* Card 3: Seletores Precisos & Harmonizador Automático */}
          <AppCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={16} color={branding.primaryColor} />
                <span>Cores Personalizadas do Sistema</span>
              </div>

              <button
                type="button"
                onClick={handleAutoHarmonize}
                title="Calcula cores secundárias e de destaque perfeitas com base na primária"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.375rem',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#e2e8f0')}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
              >
                <Wand2 size={13} color="#059669" />
                <span>Harmonizar Cores</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Cor Primária */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                    Cor Primária (Ação & Destaque)
                  </div>
                  <div style={{ fontSize: '0.71875rem', color: '#64748b' }}>
                    Aplicada em botões, abas ativas, tags e cabeçalhos.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: branding.primaryColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={branding.primaryColor.toUpperCase()}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    style={{
                      width: '85px',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>

              {/* Cor Secundária */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                    Cor Secundária (Profundidade & Fundo)
                  </div>
                  <div style={{ fontSize: '0.71875rem', color: '#64748b' }}>
                    Aplicada em fundos contrastantes e gradientes de login.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: branding.secondaryColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={branding.secondaryColor.toUpperCase()}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    style={{
                      width: '85px',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>

              {/* Cor de Destaque */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                    Cor de Destaque (Accent & Alertas)
                  </div>
                  <div style={{ fontSize: '0.71875rem', color: '#64748b' }}>
                    Aplicada em barras de progresso, ícones ativos e pílulas.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: branding.accentColor,
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <input
                      type="color"
                      value={branding.accentColor}
                      onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={branding.accentColor.toUpperCase()}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    style={{
                      width: '85px',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              </div>

              {/* Validador de Acessibilidade WCAG 2.2 AA */}
              <div
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: isWcagCompliant ? '#ecfdf5' : '#fffbeb',
                  border: `1px solid ${isWcagCompliant ? '#a7f3d0' : '#fde68a'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                {isWcagCompliant ? (
                  <ShieldCheck size={20} color="#059669" />
                ) : (
                  <AlertCircle size={20} color="#d97706" />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: isWcagCompliant ? '#065f46' : '#92400e' }}>
                    {isWcagCompliant
                      ? `Contraste WCAG 2.2 AA Aprovado (${contrastRatioWhite}:1)`
                      : `Atenção: Baixo Contraste no Texto (${contrastRatioWhite}:1)`}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: isWcagCompliant ? '#047857' : '#b45309' }}>
                    {isWcagCompliant
                      ? 'Excelente legibilidade garantida para botões médicos e etiquetas clínicas.'
                      : 'Recomendamos escurecer ligeiramente a cor primária para assegurar leitura confortável.'}
                  </div>
                </div>
              </div>
            </div>
          </AppCard>

          {/* Card 4: Tipografia */}
          <AppCard>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Tipografia Oficial
            </div>
            <select
              value={branding.fontFamily}
              onChange={(e) => setBranding({ ...branding, fontFamily: e.target.value })}
              className="ygeia-select"
              style={{
                minHeight: '38px',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Padrão Oficial Ygeía & Evolva)</option>
              <option value="Inter">Inter (Clean & Neutro)</option>
              <option value="Roboto">Roboto (Google Design System)</option>
              <option value="Poppins">Poppins (Geométrico & Moderno)</option>
            </select>
          </AppCard>
        </div>

        {/* ========================================================
            COLUNA DIREITA: LIVE PREVIEW SIMULATOR EM TEMPO REAL
           ======================================================== */}
        <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Barra de Abas do Simulador */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f1f5f9',
              padding: '0.35rem',
              borderRadius: '0.625rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <button
              type="button"
              onClick={() => setActivePreviewTab('dashboard')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.45rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: activePreviewTab === 'dashboard' ? '#ffffff' : 'transparent',
                color: activePreviewTab === 'dashboard' ? '#0f172a' : '#64748b',
                fontWeight: activePreviewTab === 'dashboard' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: activePreviewTab === 'dashboard' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Layout size={14} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('login')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.45rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: activePreviewTab === 'login' ? '#ffffff' : 'transparent',
                color: activePreviewTab === 'login' ? '#0f172a' : '#64748b',
                fontWeight: activePreviewTab === 'login' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: activePreviewTab === 'login' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <LogIn size={14} />
              <span>Login</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePreviewTab('patient')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.45rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: activePreviewTab === 'patient' ? '#ffffff' : 'transparent',
                color: activePreviewTab === 'patient' ? '#0f172a' : '#64748b',
                fontWeight: activePreviewTab === 'patient' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: activePreviewTab === 'patient' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Smartphone size={14} />
              <span>App Paciente</span>
            </button>
          </div>

          {/* SIMULADOR 1: PREVIEW DO DASHBOARD / WORKSPACE */}
          {activePreviewTab === 'dashboard' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
              }}
            >
              {/* Top Bar do Mockup */}
              <div
                style={{
                  padding: '0.65rem 1rem',
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8', marginLeft: '0.5rem', fontWeight: 600 }}>
                    app.ygeia.com.br
                  </span>
                </div>
                <AppBadge variant="success">Ao Vivo</AppBadge>
              </div>

              {/* Workspace Mockup View */}
              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', minHeight: '340px' }}>
                {/* Mini Sidebar */}
                <div style={{ backgroundColor: '#ffffff', borderRight: '1px solid #f1f5f9', padding: '0.875rem 0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: branding.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: 800 }}>Y</span>
                    </div>
                    <span style={{ fontSize: '0.71875rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {branding.clinicName}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', color: '#64748b' }}>
                      Dashboard
                    </div>
                    <div style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', backgroundColor: `${branding.primaryColor}15`, color: branding.primaryColor, fontSize: '0.6875rem', fontWeight: 700 }}>
                      • Pacientes
                    </div>
                    <div style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', color: '#64748b' }}>
                      Agenda
                    </div>
                    <div style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', color: '#64748b' }}>
                      Atendimento
                    </div>
                  </div>
                </div>

                {/* Mini Content Area */}
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {/* Mini Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.5625rem', color: branding.primaryColor, fontWeight: 800, backgroundColor: '#ecfdf5', padding: '0.15rem 0.4rem', borderRadius: '9999px' }}>
                        ROTINA CLÍNICA
                      </span>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                        Pacientes
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        backgroundColor: branding.primaryColor,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.375rem',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                      }}
                    >
                      + Novo paciente
                    </button>
                  </div>

                  {/* Mini Metric Cards (2x2) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.625rem', color: '#64748b' }}>Total Pacientes</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>1</div>
                      <div style={{ fontSize: '0.5625rem', color: '#94a3b8' }}>Cadastros ativos</div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.625rem', color: '#64748b' }}>App Conectado</div>
                      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>1</div>
                      <div style={{ fontSize: '0.5625rem', color: '#94a3b8' }}>Usuários criados</div>
                    </div>
                  </div>

                  {/* Mini Data Row */}
                  <div style={{ backgroundColor: '#ffffff', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        BE
                      </div>
                      <div>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#0f172a' }}>Bruno Ferreira</div>
                        <div style={{ fontSize: '0.5625rem', color: '#94a3b8' }}>Meu consultório</div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: branding.primaryColor, backgroundColor: '#ecfdf5', padding: '0.15rem 0.4rem', borderRadius: '9999px' }}>
                      App Ativo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIMULADOR 2: PREVIEW DA TELA DE LOGIN */}
          {activePreviewTab === 'login' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                minHeight: '340px',
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr',
              }}
            >
              {/* Lado Esquerdo: Hero Gradient */}
              <div
                style={{
                  background: buildLoginHeroGradient(branding.primaryColor, branding.secondaryColor),
                  padding: '1.25rem',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800 }}>{branding.clinicName}</div>
                  <div style={{ fontSize: '0.625rem', opacity: 0.8 }}>{branding.slogan}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.35rem' }}>
                    Controle metabólico diário em alta precisão.
                  </div>
                  <div style={{ fontSize: '0.625rem', opacity: 0.85 }}>
                    Governança clínica para nutricionistas e pacientes.
                  </div>
                </div>

                <div style={{ fontSize: '0.5625rem', opacity: 0.6 }}>Software Seguro • Ygeía</div>
              </div>

              {/* Lado Direito: Mini Formulário */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                  Entrar na conta
                </div>
                <div style={{ fontSize: '0.625rem', color: '#64748b', marginBottom: '0.875rem' }}>
                  Acesse o seu portal exclusivo
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ height: '24px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 0.4rem', fontSize: '0.625rem', display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                    email@exemplo.com
                  </div>
                  <div style={{ height: '24px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 0.4rem', fontSize: '0.625rem', display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
                    ••••••••
                  </div>
                  <button
                    type="button"
                    style={{
                      backgroundColor: branding.primaryColor,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.45rem',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      marginTop: '0.25rem',
                    }}
                  >
                    Acessar Portal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIMULADOR 3: PREVIEW DO APP MOBILE DO PACIENTE */}
          {activePreviewTab === 'patient' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.875rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.08)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Moldura de Smartphone */}
              <div
                style={{
                  width: '230px',
                  borderRadius: '1.5rem',
                  border: '6px solid #0f172a',
                  backgroundColor: '#0B1120',
                  color: '#ffffff',
                  padding: '1rem 0.75rem',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {/* Notch */}
                <div style={{ width: '60px', height: '4px', backgroundColor: '#334155', borderRadius: '9999px', margin: '0 auto 0.25rem auto' }} />

                {/* Banner do Paciente */}
                <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', padding: '0.65rem', border: '1px solid #334155' }}>
                  <span style={{ fontSize: '0.5rem', color: branding.accentColor, fontWeight: 800 }}>
                    {branding.clinicName}
                  </span>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 800, marginTop: '0.15rem' }}>
                    Olá, Gabriel!
                  </div>
                  <div style={{ fontSize: '0.5625rem', color: '#94A3B8' }}>Meta diária de água: 2.800 ml</div>
                </div>

                {/* Mini Card de Água */}
                <div style={{ backgroundColor: '#1E293B', borderRadius: '8px', padding: '0.65rem', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.5625rem', color: '#94A3B8' }}>Hidratação</div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#38BDF8' }}>1.750 ml</div>
                  </div>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: `${branding.primaryColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: branding.primaryColor, fontSize: '12px', fontWeight: 800 }}>
                    +
                  </div>
                </div>

                {/* Botão de Registro Rápido */}
                <button
                  type="button"
                  style={{
                    backgroundColor: branding.primaryColor,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                  }}
                >
                  Registrar Aplicação GLP-1
                </button>
              </div>
            </div>
          )}

          {/* Dica de Engenharia */}
          <div style={{ fontSize: '0.71875rem', color: '#64748b', textAlign: 'center' }}>
            <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} />
            As alterações são simuladas em tempo real. Clique em <strong>Salvar Identidade</strong> para persistir.
          </div>
        </div>
      </div>
    </div>
  );
};
