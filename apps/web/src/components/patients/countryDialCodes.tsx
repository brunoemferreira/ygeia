import React, { useState } from 'react';

export interface CountryDialCode {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
  placeholder: string;
  maxLength: number;
}

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brasil', placeholder: '(00) 00000-0000', maxLength: 15 },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'Estados Unidos / Canadá', placeholder: '(000) 000-0000', maxLength: 14 },
  { code: 'PT', dialCode: '+351', flag: '🇵🇹', name: 'Portugal', placeholder: '000 000 000', maxLength: 11 },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Espanha', placeholder: '000 00 00 00', maxLength: 12 },
  { code: 'AR', dialCode: '+54', flag: '🇦🇷', name: 'Argentina', placeholder: '(00) 0000-0000', maxLength: 15 },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'Reino Unido', placeholder: '00000 000000', maxLength: 12 },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'França', placeholder: '00 00 00 00 00', maxLength: 14 },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Alemanha', placeholder: '0000 0000000', maxLength: 13 },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Itália', placeholder: '000 000 0000', maxLength: 12 },
  { code: 'UY', dialCode: '+598', flag: '🇺🇾', name: 'Uruguai', placeholder: '000 000 000', maxLength: 11 },
  { code: 'PY', dialCode: '+595', flag: '🇵🇾', name: 'Paraguai', placeholder: '000 000 000', maxLength: 11 },
  { code: 'CL', dialCode: '+56', flag: '🇨🇱', name: 'Chile', placeholder: '9 0000 0000', maxLength: 11 },
  { code: 'CO', dialCode: '+57', flag: '🇨🇴', name: 'Colômbia', placeholder: '000 000 0000', maxLength: 12 },
  { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'México', placeholder: '00 0000 0000', maxLength: 12 },
  { code: 'CH', dialCode: '+41', flag: '🇨🇭', name: 'Suíça', placeholder: '00 000 00 00', maxLength: 12 },
  { code: 'IE', dialCode: '+353', flag: '🇮🇪', name: 'Irlanda', placeholder: '00 000 0000', maxLength: 11 },
  { code: 'AO', dialCode: '+244', flag: '🇦🇴', name: 'Angola', placeholder: '000 000 000', maxLength: 11 },
  { code: 'MZ', dialCode: '+258', flag: '🇲🇿', name: 'Moçambique', placeholder: '00 000 0000', maxLength: 11 },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Austrália', placeholder: '0000 000 000', maxLength: 12 },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japão', placeholder: '00-0000-0000', maxLength: 13 },
  { code: 'PE', dialCode: '+51', flag: '🇵🇪', name: 'Peru', placeholder: '000 000 000', maxLength: 11 },
  { code: 'BO', dialCode: '+591', flag: '🇧🇴', name: 'Bolívia', placeholder: '0000 0000', maxLength: 9 },
  { code: 'EC', dialCode: '+593', flag: '🇪🇨', name: 'Equador', placeholder: '00 000 0000', maxLength: 11 },
  { code: 'VE', dialCode: '+58', flag: '🇻🇪', name: 'Venezuela', placeholder: '000-0000000', maxLength: 12 },
  { code: 'NL', dialCode: '+31', flag: '🇳🇱', name: 'Holanda', placeholder: '0 00 00 00 00', maxLength: 13 },
  { code: 'BE', dialCode: '+32', flag: '🇧🇪', name: 'Bélgica', placeholder: '000 00 00 00', maxLength: 12 },
  { code: 'SE', dialCode: '+46', flag: '🇸🇪', name: 'Suécia', placeholder: '00-000 00 00', maxLength: 13 },
  { code: 'NO', dialCode: '+47', flag: '🇳🇴', name: 'Noruega', placeholder: '000 00 000', maxLength: 10 },
  { code: 'DK', dialCode: '+45', flag: '🇩🇰', name: 'Dinamarca', placeholder: '00 00 00 00', maxLength: 11 },
  { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'Emirados Árabes', placeholder: '00 000 0000', maxLength: 11 },
  { code: 'ZA', dialCode: '+27', flag: '🇿🇦', name: 'África do Sul', placeholder: '00 000 0000', maxLength: 11 },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'Índia', placeholder: '00000 00000', maxLength: 11 },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China', placeholder: '000 0000 0000', maxLength: 13 },
  { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: 'Coreia do Sul', placeholder: '00-0000-0000', maxLength: 13 },
  { code: 'NZ', dialCode: '+64', flag: '🇳🇿', name: 'Nova Zelândia', placeholder: '000 000 0000', maxLength: 12 },
  { code: 'IL', dialCode: '+972', flag: '🇮🇱', name: 'Israel', placeholder: '00-000-0000', maxLength: 12 },
  { code: 'RU', dialCode: '+7', flag: '🇷🇺', name: 'Rússia', placeholder: '(000) 000-00-00', maxLength: 15 },
];

/**
 * Formata o número de telefone dinamicamente conforme os padrões e regras do país/prefixo selecionado.
 */
export function formatPhoneNumber(value: string, countryCode: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  switch (countryCode) {
    case 'BR': {
      // Brasil: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
      const d = digits.slice(0, 11);
      if (d.length <= 2) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
    }
    case 'US': {
      // Estados Unidos / Canadá: (XXX) XXX-XXXX
      const d = digits.slice(0, 10);
      if (d.length <= 3) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
    }
    case 'PT':
    case 'AO':
    case 'PE':
    case 'UY':
    case 'PY': {
      // Portugal, Angola, Peru, Uruguai, Paraguai: XXX XXX XXX
      const d = digits.slice(0, 9);
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)}`;
    }
    case 'ES':
    case 'BE': {
      // Espanha, Bélgica: XXX XX XX XX
      const d = digits.slice(0, 9);
      if (d.length <= 3) return d;
      if (d.length <= 5) return `${d.slice(0, 3)} ${d.slice(3)}`;
      if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
    }
    case 'FR':
    case 'NL': {
      // França, Holanda: XX XX XX XX XX
      const d = digits.slice(0, 10);
      if (d.length <= 2) return d;
      if (d.length <= 4) return `${d.slice(0, 2)} ${d.slice(2)}`;
      if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4)}`;
      if (d.length <= 8) return `${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 6)} ${d.slice(6)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`;
    }
    case 'GB':
    case 'IN': {
      // Reino Unido, Índia: XXXXX XXXXX
      const d = digits.slice(0, 11);
      if (d.length <= 5) return d;
      return `${d.slice(0, 5)} ${d.slice(5, 11)}`;
    }
    case 'DE': {
      // Alemanha: XXXX XXXXXXX
      const d = digits.slice(0, 11);
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 11)}`;
    }
    case 'IT':
    case 'CO':
    case 'NZ': {
      // Itália, Colômbia, Nova Zelândia: XXX XXX XXXX
      const d = digits.slice(0, 10);
      if (d.length <= 3) return d;
      if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 10)}`;
    }
    case 'MX': {
      // México: XX XXXX XXXX
      const d = digits.slice(0, 10);
      if (d.length <= 2) return d;
      if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6, 10)}`;
    }
    case 'CL': {
      // Chile: X XXXX XXXX
      const d = digits.slice(0, 9);
      if (d.length <= 1) return d;
      if (d.length <= 5) return `${d.slice(0, 1)} ${d.slice(1)}`;
      return `${d.slice(0, 1)} ${d.slice(1, 5)} ${d.slice(5, 9)}`;
    }
    case 'CH': {
      // Suíça: XX XXX XX XX
      const d = digits.slice(0, 9);
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      if (d.length <= 7) return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
    }
    case 'IE':
    case 'MZ':
    case 'EC':
    case 'AE':
    case 'ZA': {
      // Irlanda, Moçambique, Equador, Emirados Árabes, África do Sul: XX XXX XXXX
      const d = digits.slice(0, 9);
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)} ${d.slice(2)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 9)}`;
    }
    case 'AU': {
      // Austrália: XXXX XXX XXX
      const d = digits.slice(0, 10);
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 10)}`;
    }
    case 'JP':
    case 'KR': {
      // Japão, Coreia do Sul: XX-XXXX-XXXX
      const d = digits.slice(0, 11);
      if (d.length <= 2) return d;
      if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
      return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 11)}`;
    }
    case 'BO': {
      // Bolívia: XXXX XXXX
      const d = digits.slice(0, 8);
      if (d.length <= 4) return d;
      return `${d.slice(0, 4)} ${d.slice(4, 8)}`;
    }
    case 'VE': {
      // Venezuela: XXX-XXXXXXX
      const d = digits.slice(0, 10);
      if (d.length <= 3) return d;
      return `${d.slice(0, 3)}-${d.slice(3, 10)}`;
    }
    case 'SE': {
      // Suécia: XX-XXX XX XX
      const d = digits.slice(0, 9);
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
      if (d.length <= 7) return `${d.slice(0, 2)}-${d.slice(2, 5)} ${d.slice(5)}`;
      return `${d.slice(0, 2)}-${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
    }
    case 'NO': {
      // Noruega: XXX XX XXX
      const d = digits.slice(0, 8);
      if (d.length <= 3) return d;
      if (d.length <= 5) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)}`;
    }
    case 'DK': {
      // Dinamarca: XX XX XX XX
      const d = digits.slice(0, 8);
      if (d.length <= 2) return d;
      if (d.length <= 4) return `${d.slice(0, 2)} ${d.slice(2)}`;
      if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, 6)} ${d.slice(6, 8)}`;
    }
    case 'CN': {
      // China: XXX XXXX XXXX
      const d = digits.slice(0, 11);
      if (d.length <= 3) return d;
      if (d.length <= 7) return `${d.slice(0, 3)} ${d.slice(3)}`;
      return `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7, 11)}`;
    }
    case 'IL': {
      // Israel: XX-XXX-XXXX
      const d = digits.slice(0, 9);
      if (d.length <= 2) return d;
      if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
      return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 9)}`;
    }
    case 'RU': {
      // Rússia: (XXX) XXX-XX-XX
      const d = digits.slice(0, 10);
      if (d.length <= 3) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
      if (d.length <= 8) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
      return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
    }
    case 'AR': {
      // Argentina: (XX) XXXX-XXXX
      const d = digits.slice(0, 10);
      if (d.length <= 2) return `(${d}`;
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6, 10)}`;
    }
    default: {
      return digits.slice(0, 15);
    }
  }
}

/**
 * Formata um número de telefone salvo (seja ele gravado com DDI, sem DDI,
 * com formatação parcial ou apenas dígitos brutos) para exibição elegante no grid e em fichas.
 */
export function formatPhoneDisplay(rawPhone?: string | null): string {
  if (!rawPhone || !rawPhone.trim()) return '';
  const trimmed = rawPhone.trim();

  // Verifica se inicia com DDI com "+" (ex: "+55 19992922054" ou "+55 (19) 99292-2054")
  const matchedCountry = COUNTRY_DIAL_CODES.find((c) => trimmed.startsWith(c.dialCode));
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (matchedCountry) {
    const dialDigits = matchedCountry.dialCode.replace(/\D/g, '');
    if (digitsOnly.startsWith(dialDigits)) {
      const localDigits = digitsOnly.slice(dialDigits.length);
      if (!localDigits) return matchedCountry.dialCode;
      const formattedLocal = formatPhoneNumber(localDigits, matchedCountry.code);
      return `${matchedCountry.dialCode} ${formattedLocal}`.trim();
    }
  }

  // Se não tem prefixo "+" mas tem 12 ou 13 dígitos começando com "55" (Brasil sem "+")
  if ((digitsOnly.length === 12 || digitsOnly.length === 13) && digitsOnly.startsWith('55')) {
    const localDigits = digitsOnly.slice(2);
    return `+55 ${formatPhoneNumber(localDigits, 'BR')}`;
  }

  // Se é número padrão nacional brasileiro com DDD (10 ou 11 dígitos, ex: 19992922054 ou 1133445566)
  if (digitsOnly.length === 11 || digitsOnly.length === 10) {
    return formatPhoneNumber(digitsOnly, 'BR');
  }

  // Se já possui formatação rica (parênteses, traços), preserva
  if (trimmed.includes('(') || trimmed.includes('-') || trimmed.includes(' ')) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Componente que renderiza a bandeira colorida e nítida de QUALQUER país/prefixo,
 * funcionando perfeitamente em qualquer navegador e sistema operacional (incluindo Windows).
 */
export const CountryFlag: React.FC<{ code: string; flag?: string; width?: number; height?: number }> = ({
  code,
  flag,
  width = 20,
  height = 14,
}) => {
  const [hasError, setHasError] = useState(false);
  const lowerCode = code.toLowerCase();

  if (hasError) {
    return (
      <span
        style={{
          fontSize: `${height}px`,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {flag || code}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${lowerCode}.png`}
      srcSet={`https://flagcdn.com/w80/${lowerCode}.png 2x`}
      alt={`Bandeira de ${code}`}
      width={width}
      height={height}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        objectFit: 'cover',
        borderRadius: '2px',
        boxShadow: '0 0 1px rgba(0, 0, 0, 0.25)',
        display: 'inline-block',
        flexShrink: 0,
      }}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};
