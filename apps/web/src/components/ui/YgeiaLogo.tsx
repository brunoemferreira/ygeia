import React from 'react';

export interface YgeiaLogoProps {
  /** Tamanho do ícone/logo em pixels ou string CSS (ex: 24, 32, '2rem') */
  size?: number | string;
  /** Cor principal do símbolo (folha esquerda/escudo). Aceita HEX, RGB ou var CSS */
  color?: string;
  /** Cor secundária (folha direita). Se omitido, usa um tom sutilmente mais claro ou igual a color */
  secondaryColor?: string;
  /** Cor da linha de batimento cardíaco / pulso ECG */
  pulseColor?: string;
  /** Se verdadeiro, inverte o símbolo (folhas brancas, pulso na cor primária), ideal dentro de botões coloridos */
  inverted?: boolean;
  /** Formato de exibição: apenas o símbolo ('icon'), dentro de badge arredondado ('badge') ou símbolo + texto ('full') */
  variant?: 'icon' | 'badge' | 'full';
  /** Cor do texto quando variant === 'full' */
  textColor?: string;
  /** Subtítulo opcional exibido abaixo do nome na variante 'full' (ex: 'SISTEMA CLÍNICO') */
  subtitle?: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Estilos inline adicionais */
  style?: React.CSSProperties;
}

/**
 * Logotipo Oficial e Marca Registrada Ygeía (Υγεία).
 * Simboliza a união entre a botânica/nutrição (folhas gêmeas), a proteção do paciente (escudo)
 * e a vitalidade clínica (linha de pulso cardíaco ECG).
 * 100% SVG vetorial com suporte total a customização dinâmica de cores e White Label.
 */
export const YgeiaLogo: React.FC<YgeiaLogoProps> = ({
  size = 32,
  color,
  secondaryColor,
  pulseColor,
  inverted = false,
  variant = 'icon',
  textColor = '#0f172a',
  subtitle,
  className = '',
  style = {},
}) => {
  const numericSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 32;

  // Resolução de cores dinâmicas com fallback para as variáveis de tema
  const resolvedPrimaryColor = inverted
    ? '#ffffff'
    : color || 'var(--primary, #059669)';

  const resolvedSecondaryColor = inverted
    ? 'rgba(255, 255, 255, 0.92)'
    : secondaryColor || color || 'var(--primary-hover, #10b981)';

  const resolvedPulseColor = inverted
    ? color || 'var(--primary, #059669)'
    : pulseColor || '#7eedd6';

  // SVG do Símbolo Oficial
  const symbolSvg = (
    <svg
      width={numericSize}
      height={numericSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        flexShrink: 0,
        overflow: 'visible',
      }}
      aria-label="Símbolo Ygeía"
    >
      {/* Folha / Lóbulo Esquerdo (Botânica + Escudo) */}
      <path
        d="M 48 24 C 40 12, 22 8, 14 22 C 6 38, 11 62, 25 78 C 36 89, 46 95, 48 96 C 48 96, 48 30, 48 24 Z"
        fill={resolvedPrimaryColor}
      />

      {/* Folha / Lóbulo Direito (Botânica + Escudo) */}
      <path
        d="M 52 24 C 60 12, 78 8, 86 22 C 94 38, 89 62, 75 78 C 64 89, 54 95, 52 96 C 52 96, 52 30, 52 24 Z"
        fill={resolvedSecondaryColor}
      />

      {/* Linha de Pulso / Batimento Cardíaco (Vitalidade Clínica) */}
      <path
        d="M 8 52 L 32 52 L 38 64 L 47 18 L 55 84 L 63 34 L 69 52 L 92 52"
        stroke={resolvedPulseColor}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Variante: Badge Arredondado
  if (variant === 'badge') {
    const badgePadding = Math.round(numericSize * 0.22);
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: numericSize + badgePadding * 2,
          height: numericSize + badgePadding * 2,
          borderRadius: Math.round((numericSize + badgePadding * 2) * 0.28),
          background: color || 'var(--primary, #059669)',
          boxShadow: '0 2px 8px var(--primary-border, rgba(5, 150, 105, 0.25))',
          flexShrink: 0,
          ...style,
        }}
      >
        <YgeiaLogo
          size={numericSize}
          color="#ffffff"
          secondaryColor="rgba(255, 255, 255, 0.9)"
          pulseColor={color || 'var(--primary, #059669)'}
          variant="icon"
        />
      </div>
    );
  }

  // Variante: Completa com Tipografia Oficial
  if (variant === 'full') {
    return (
      <div
        className={`ygeia-brand-lockup ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.625rem',
          userSelect: 'none',
          ...style,
        }}
      >
        {symbolSvg}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontSize: `${Math.round(numericSize * 0.58)}px`,
              fontWeight: 800,
              color: textColor,
              letterSpacing: '-0.03em',
            }}
          >
            YGEÍA
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: `${Math.max(10, Math.round(numericSize * 0.28))}px`,
                fontWeight: 700,
                color: color || 'var(--primary, #059669)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginTop: '1px',
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Variante padrão: Apenas o Símbolo
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      {symbolSvg}
    </div>
  );
};

export default YgeiaLogo;
