import React, { useState, forwardRef, useId } from 'react';
import { getStoredBranding } from '../../utils/branding';

export interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leadingIcon?: React.ReactNode;
  suffix?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(({
  label,
  leadingIcon,
  suffix,
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
  const inputId = customId || `ygeia-input-${generatedId}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = Boolean(error);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
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

        <input
          ref={ref}
          id={inputId}
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
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            padding: '0.6rem 0',
            fontSize: '0.8125rem',
            color: '#0f172a',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            ...style,
          }}
          {...props}
        />

        {suffix && (
          <div
            style={{
              marginLeft: '0.5rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              padding: '0.15rem 0.5rem',
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#475569',
              whiteSpace: 'nowrap',
            }}
          >
            {suffix}
          </div>
        )}
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

AppInput.displayName = 'AppInput';
