import React, { useState, forwardRef, useId } from 'react';
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
  id: customId,
  ...props
}, ref) => {
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';
  const [isFocused, setIsFocused] = useState(false);
  const generatedId = useId();
  const textareaId = customId || `ygeia-textarea-${generatedId}`;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  const hasError = Boolean(error);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={textareaId}
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

      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
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

AppTextarea.displayName = 'AppTextarea';
