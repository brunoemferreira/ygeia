import React, { useState } from 'react';

export interface CountryDialCode {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'Estados Unidos / Canadá' },
  { code: 'PT', dialCode: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Espanha' },
  { code: 'AR', dialCode: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'França' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Alemanha' },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Itália' },
  { code: 'UY', dialCode: '+598', flag: '🇺🇾', name: 'Uruguai' },
  { code: 'PY', dialCode: '+595', flag: '🇵🇾', name: 'Paraguai' },
  { code: 'CL', dialCode: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: 'CO', dialCode: '+57', flag: '🇨🇴', name: 'Colômbia' },
  { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'México' },
  { code: 'CH', dialCode: '+41', flag: '🇨🇭', name: 'Suíça' },
  { code: 'IE', dialCode: '+353', flag: '🇮🇪', name: 'Irlanda' },
  { code: 'AO', dialCode: '+244', flag: '🇦🇴', name: 'Angola' },
  { code: 'MZ', dialCode: '+258', flag: '🇲🇿', name: 'Moçambique' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Austrália' },
  { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japão' },
  { code: 'PE', dialCode: '+51', flag: '🇵🇪', name: 'Peru' },
  { code: 'BO', dialCode: '+591', flag: '🇧🇴', name: 'Bolívia' },
  { code: 'EC', dialCode: '+593', flag: '🇪🇨', name: 'Equador' },
  { code: 'VE', dialCode: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: 'NL', dialCode: '+31', flag: '🇳🇱', name: 'Holanda' },
  { code: 'BE', dialCode: '+32', flag: '🇧🇪', name: 'Bélgica' },
  { code: 'SE', dialCode: '+46', flag: '🇸🇪', name: 'Suécia' },
  { code: 'NO', dialCode: '+47', flag: '🇳🇴', name: 'Noruega' },
  { code: 'DK', dialCode: '+45', flag: '🇩🇰', name: 'Dinamarca' },
  { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'Emirados Árabes' },
  { code: 'ZA', dialCode: '+27', flag: '🇿🇦', name: 'África do Sul' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'Índia' },
  { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: 'Coreia do Sul' },
  { code: 'NZ', dialCode: '+64', flag: '🇳🇿', name: 'Nova Zelândia' },
  { code: 'IL', dialCode: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: 'RU', dialCode: '+7', flag: '🇷🇺', name: 'Rússia' },
];

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
