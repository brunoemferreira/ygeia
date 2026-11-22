import React from 'react';
import { getStoredBranding } from '../../utils/branding';

export interface AppCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'metric' | 'highlight' | 'flat';
  children: React.ReactNode;
}

export const AppCard: React.FC<AppCardProps> = ({
  variant = 'default',
  children,
  style,
  ...props
}) => {
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'highlight':
        return {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderLeft: `4px solid ${primaryColor}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        };
      case 'metric':
        return {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        };
      case 'flat':
        return {
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
        };
      case 'default':
      default:
        return {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        };
    }
  };

  return (
    <div
      style={{
        borderRadius: '0.75rem',
        padding: '1.25rem',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
