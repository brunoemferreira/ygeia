/**
 * Gerenciador de Branding White Label do Ygeía
 * Persiste e sincroniza as cores da clínica (primária, secundária e destaque)
 * e aplica dinamicamente as variáveis CSS (:root) em 100% da aplicação.
 */

export interface ClinicBranding {
  clinicName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  fontFamily: string;
  slogan?: string;
}

export const DEFAULT_BRANDING: ClinicBranding = {
  clinicName: 'Ygeía',
  primaryColor: '#059669', // Verde Esmeralda Médico padrão
  secondaryColor: '#064e3b', // Verde Floresta Profundo
  accentColor: '#10b981', // Verde Menta Vibrante
  fontFamily: 'Inter',
  slogan: 'Nutrição Clínica & Governança Metabólica',
};

const STORAGE_KEY = 'ygeia_branding';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '').trim();
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map((c) => c + c).join('')
    : cleanHex;

  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return hex;
  }
}

export function darkenHex(hex: string, percent: number): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    const factor = Math.max(0, Math.min(1, 1 - percent / 100));
    const dr = Math.round(r * factor);
    const dg = Math.round(g * factor);
    const db = Math.round(b * factor);
    return `#${((1 << 24) + (dr << 16) + (dg << 8) + db).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}

export function lightenHex(hex: string, percent: number): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    const factor = Math.max(0, Math.min(1, percent / 100));
    const lr = Math.round(r + (255 - r) * factor);
    const lg = Math.round(g + (255 - g) * factor);
    const lb = Math.round(b + (255 - b) * factor);
    return `#${((1 << 24) + (lr << 16) + (lg << 8) + lb).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}

/**
 * Aplica o tema completo da clínica no elemento raiz :root do DOM,
 * garantindo que 100% dos componentes e telas reflitam a identidade personalizada.
 */
export function applyClinicTheme(branding: ClinicBranding): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const primary = branding.primaryColor || DEFAULT_BRANDING.primaryColor;
  const secondary = branding.secondaryColor || DEFAULT_BRANDING.secondaryColor;
  const accent = branding.accentColor || DEFAULT_BRANDING.accentColor;
  const font = branding.fontFamily || DEFAULT_BRANDING.fontFamily;

  const { r, g, b } = hexToRgb(primary);
  const hoverColor = darkenHex(primary, 12);
  const darkColor = darkenHex(primary, 24);
  const lightColor = hexToRgba(primary, 0.08);
  const softColor = hexToRgba(primary, 0.14);
  const borderColor = hexToRgba(primary, 0.28);
  const glowColor = hexToRgba(primary, 0.25);

  const secRgb = hexToRgb(secondary);
  const accRgb = hexToRgb(accent);

  // 1. Tokens Padrão do Ygeía
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
  root.style.setProperty('--primary-hover', hoverColor);
  root.style.setProperty('--primary-dark', darkColor);
  root.style.setProperty('--primary-light', lightColor);
  root.style.setProperty('--primary-soft', softColor);
  root.style.setProperty('--primary-border', borderColor);
  root.style.setProperty('--primary-glow', glowColor);

  root.style.setProperty('--secondary', secondary);
  root.style.setProperty('--secondary-rgb', `${secRgb.r}, ${secRgb.g}, ${secRgb.b}`);
  root.style.setProperty('--secondary-light', hexToRgba(secondary, 0.08));

  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-rgb', `${accRgb.r}, ${accRgb.g}, ${accRgb.b}`);
  root.style.setProperty('--accent-light', hexToRgba(accent, 0.08));

  // 2. Tokens de Alta Fidelidade Better Health (--bh-*)
  root.style.setProperty('--bh-primary', primary);
  root.style.setProperty('--bh-primary-hover', hoverColor);
  root.style.setProperty('--bh-primary-dark', darkColor);
  root.style.setProperty('--bh-primary-soft', lightColor);
  root.style.setProperty('--bh-primary-border', borderColor);
  root.style.setProperty('--bh-shadow-focus', `0 0 0 3px ${glowColor}`);

  // 3. Tipografia
  root.style.setProperty('--font-sans', `'${font}', 'Inter', system-ui, -apple-system, sans-serif`);
  root.style.setProperty('--bh-font-sans', `'${font}', 'Inter', system-ui, -apple-system, sans-serif`);
}

export function getStoredBranding(): ClinicBranding {
  if (typeof window === 'undefined') return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.clinicName) {
        parsed.clinicName = DEFAULT_BRANDING.clinicName;
      }
      if (!parsed.slogan) {
        parsed.slogan = DEFAULT_BRANDING.slogan;
      }
      return {
        ...DEFAULT_BRANDING,
        ...parsed,
      };
    }
  } catch {}
  return DEFAULT_BRANDING;
}

export function saveStoredBranding(branding: Partial<ClinicBranding>): ClinicBranding {
  const current = getStoredBranding();
  const updated: ClinicBranding = { ...current, ...branding };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    applyClinicTheme(updated);
    window.dispatchEvent(new CustomEvent('ygeia_branding_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Constrói o gradiente linear rico para o painel esquerdo da Tela de Login
 * usando as cores primária e secundária personalizadas.
 */
export function buildLoginHeroGradient(primary: string, secondary?: string): string {
  const sec = secondary || darkenHex(primary, 25);
  const dark = darkenHex(sec, 35);
  const light = lightenHex(primary, 20);
  return `linear-gradient(145deg, ${dark} 0%, ${sec} 40%, ${primary} 80%, ${light} 100%)`;
}

// Auto-inicialização imediata do tema na carga da biblioteca
if (typeof window !== 'undefined') {
  applyClinicTheme(getStoredBranding());
}
