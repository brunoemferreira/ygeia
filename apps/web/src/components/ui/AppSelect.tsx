import React, { useState, forwardRef, useId } from 'react';
import { getStoredBranding } from '../../utils/branding';

export interface AppSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AppSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  leadingIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  options?: AppSelectOption[];
  placeholder?: string;
}

/**
 * Componente Padronizado de Seleção / Combobox do Design System Ygeía.
 * Garante altura exata de 38px, borda 0.5rem, tipografia de 13px e
 * foco com halo reativo conectado à cor primária dinâmica da configuração.
 */
export const AppSelect = forwardRef<HTMLSelectElement, AppSelectProps>(({
  label,
  leadingIcon,
  error,
  helperText,
  required,
  disabled,
  options,
  placeholder,
  children,
  style,
  value,
  id: customId,
  ...props
}, ref) => {
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const selectId = customId || `ygeia-select-${generatedId}`;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const hasError = Boolean(error);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={selectId}
          style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: hasError ? '#ef4444' : '#0f172a',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: disabled ? '#f8fafc' : '#ffffff',
          border: `1px solid ${hasError ? '#ef4444' : isFocused ? primaryColor : '#cbd5e1'}`,
          borderRadius: '0.5rem',
          padding: '0 0.75rem',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: isFocused && !hasError ? `0 0 0 3px ${primaryColor}20` : 'none',
          boxSizing: 'border-box',
          minHeight: '38px',
        }}
      >
        {leadingIcon && (
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '0.5rem', color: '#94a3b8' }}>
            {leadingIcon}
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          value={value}
          aria-invalid={hasError}
          aria-required={required}
          aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            height: '100%',
            padding: '0.55rem 1.5rem 0.55rem 0',
            fontSize: '0.8125rem',
            color: disabled ? '#94a3b8' : '#0f172a',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...style,
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {/* Chevron Icon Padronizado */}
        <div
          style={{
            position: 'absolute',
            right: '0.75rem',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            color: isFocused ? primaryColor : '#94a3b8',
            transition: 'color 0.15s ease',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {hasError ? (
        <span id={errorId} style={{ fontSize: '0.71875rem', color: '#ef4444', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} style={{ fontSize: '0.71875rem', color: '#64748b', fontWeight: 400 }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

AppSelect.displayName = 'AppSelect';
