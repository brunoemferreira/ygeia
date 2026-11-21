/**
 * Gerenciador de Branding White Label do Ygeía
 * Persiste e sincroniza as cores da clínica (primária, secundária e destaque)
 * selecionadas no painel de Configurações com a Tela de Login e demais interfaces.
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
  clinicName: 'Better Health',
  primaryColor: '#1d4ed8', // Azul royal vibrante conforme mockup
  secondaryColor: '#091b3a', // Azul escuro profundo
  accentColor: '#3b82f6',
  fontFamily: 'Plus Jakarta Sans',
  slogan: 'Precision Nutrition & Clinical Care',
};

const STORAGE_KEY = 'ygeia_branding';

export function getStoredBranding(): ClinicBranding {
  if (typeof window === 'undefined') return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
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
  const updated = { ...current, ...branding };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ygeia_branding_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Constrói o gradiente linear rico para o painel esquerdo da Tela de Login
 * usando as cores selecionadas nas Configurações.
 */
export function buildLoginHeroGradient(primary: string, secondary?: string): string {
  const sec = secondary || '#091b3a';
  return `linear-gradient(145deg, ${sec} 0%, ${primary} 70%, #2563eb 100%)`;
}
