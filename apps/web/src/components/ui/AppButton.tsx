import React from 'react';
import { Loader2 } from 'lucide-react';
import { getStoredBranding } from '../../utils/branding';

export interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  style,
  className = '',
  ...props
}) => {
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: '0.4rem 0.75rem',
          fontSize: '0.75rem',
          borderRadius: '0.375rem',
          minHeight: '32px',
        };
      case 'lg':
        return {
          padding: '0.75rem 1.5rem',
          fontSize: '0.9375rem',
          borderRadius: '0.625rem',
          minHeight: '46px',
        };
      case 'md':
      default:
        return {
          padding: '0.55rem 1.15rem',
          fontSize: '0.8125rem',
          borderRadius: '0.5rem',
          minHeight: '38px',
        };
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: '#f1f5f9',
          color: '#334155',
          border: '1px solid #e2e8f0',
        };
      case 'outline':
        return {
          backgroundColor: '#ffffff',
          color: '#334155',
          border: '1px solid #cbd5e1',
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.25)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#64748b',
          border: 'none',
        };
      case 'primary':
      default:
        return {
          backgroundColor: primaryColor,
          color: '#ffffff',
          border: 'none',
          boxShadow: `0 2px 8px ${primaryColor}35`,
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.45rem',
    fontWeight: 700,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : loading ? 0.8 : 1,
    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    width: fullWidth ? '100%' : 'auto',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style,
  };

  return (
    <button
      disabled={disabled || loading}
      style={baseStyle}
      className={className}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </>
      )}
    </button>
  );
};
