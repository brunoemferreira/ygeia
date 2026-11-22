import React from 'react';

export type AppBadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface AppBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: AppBadgeVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  variant = 'neutral',
  icon,
  children,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#059669',
        };
      case 'warning':
        return {
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          color: '#d97706',
        };
      case 'danger':
        return {
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
        };
      case 'info':
        return {
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#2563eb',
        };
      case 'neutral':
      default:
        return {
          backgroundColor: '#f1f5f9',
          border: '1px solid #e2e8f0',
          color: '#475569',
        };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: '0.6875rem',
        fontWeight: 600,
        borderRadius: '9999px',
        padding: '0.2rem 0.65rem',
        lineHeight: 1.2,
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
