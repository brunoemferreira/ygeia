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
  clinicName: 'Ygeía',
  primaryColor: '#059669', // Verde Esmeralda Médico do Ygeía
  secondaryColor: '#064e3b', // Verde Floresta Profundo
  accentColor: '#10b981', // Verde Menta Vibrante
  fontFamily: 'Plus Jakarta Sans',
  slogan: 'Nutrição Clínica & Governança Metabólica',
};

const STORAGE_KEY = 'ygeia_branding';

export function getStoredBranding(): ClinicBranding {
  if (typeof window === 'undefined') return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Sanitização: migra 'Better Health' ou paleta azul legada para a identidade oficial Ygeía
      if (parsed.clinicName === 'Better Health') {
        parsed.clinicName = 'Ygeía';
      }
      if (parsed.slogan === 'Precision Nutrition & Clinical Care') {
        parsed.slogan = 'Nutrição Clínica & Governança Metabólica';
      }
      if (
        parsed.primaryColor === '#1d4ed8' ||
        parsed.primaryColor === '#1e3a8a' ||
        parsed.primaryColor === '#2563eb'
      ) {
        parsed.primaryColor = '#059669';
        parsed.secondaryColor = '#064e3b';
        parsed.accentColor = '#10b981';
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
  const updated = { ...current, ...branding };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ygeia_branding_updated', { detail: updated }));
  }
  return updated;
}

/**
 * Constrói o gradiente linear rico para o painel esquerdo da Tela de Login
 * usando a paleta oficial verde esmeralda / floresta do Ygeía.
 */
export function buildLoginHeroGradient(primary: string, secondary?: string): string {
  const sec = secondary || '#064e3b';
  return `linear-gradient(145deg, #022c22 0%, ${sec} 40%, ${primary} 80%, #10b981 100%)`;
}
