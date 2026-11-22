import React, { useState, forwardRef } from 'react';
import { getStoredBranding } from '../../utils/branding';

export interface AppTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * Componente Padronizado de Textarea do Design System Ygeía.
 * Garante raio de borda de 0.5rem, tipografia de 13px e
 * foco com anel reativo conectado à cor primária dinâmica da configuração.
 */
export const AppTextarea = forwardRef<HTMLTextAreaElement, AppTextareaProps>(({
  label,
  error,
  helperText,
  required,
  disabled,
  style,
  ...props
}, ref) => {
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';
  const [isFocused, setIsFocused] = useState(false);

  const hasError = Boolean(error);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: hasError ? '#ef4444' : '#0f172a',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        disabled={disabled}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        style={{
          width: '100%',
          backgroundColor: disabled ? '#f8fafc' : '#ffffff',
          border: `1px solid ${hasError ? '#ef4444' : isFocused ? primaryColor : '#cbd5e1'}`,
          borderRadius: '0.5rem',
          padding: '0.625rem 0.75rem',
          fontSize: '0.8125rem',
          color: '#0f172a',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          outline: 'none',
          boxSizing: 'border-box',
          resize: 'vertical',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: isFocused && !hasError ? `0 0 0 3px ${primaryColor}20` : 'none',
          ...style,
        }}
        {...props}
      />

      {hasError ? (
        <span style={{ fontSize: '0.71875rem', color: '#ef4444', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.71875rem', color: '#64748b', fontWeight: 400 }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

AppTextarea.displayName = 'AppTextarea';
