import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  details?: string[];
  duration?: number; // ms, default: 4500 (success/info), 6500 (error/warning)
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const duration =
    toast.duration ?? (toast.type === 'error' || toast.details?.length ? 6500 : 4000);

  useEffect(() => {
    if (duration <= 0) return;

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            onDismiss(toast.id);
            return 0;
          }
          return Math.max(0, prev - step);
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast.id, duration, isPaused, onDismiss]);

  // Design tokens por tipo de Toast
  const themeConfig = {
    success: {
      bg: '#ffffff',
      border: '#a7f3d0',
      progressBar: '#10b981',
      iconColor: '#059669',
      titleColor: '#065f46',
      icon: CheckCircle2,
      badge: 'Sucesso',
      badgeBg: '#ecfdf5',
    },
    error: {
      bg: '#ffffff',
      border: '#fecaca',
      progressBar: '#ef4444',
      iconColor: '#dc2626',
      titleColor: '#991b1b',
      icon: AlertCircle,
      badge: 'Erro',
      badgeBg: '#fef2f2',
    },
    warning: {
      bg: '#ffffff',
      border: '#fde68a',
      progressBar: '#f59e0b',
      iconColor: '#d97706',
      titleColor: '#92400e',
      icon: AlertTriangle,
      badge: 'Atenção',
      badgeBg: '#fffbeb',
    },
    info: {
      bg: '#ffffff',
      border: '#bae6fd',
      progressBar: '#0284c7',
      iconColor: '#0284c7',
      titleColor: '#075985',
      icon: Info,
      badge: 'Informação',
      badgeBg: '#f0f9ff',
    },
  }[toast.type];

  const Icon = themeConfig.icon;

  return (
    <div
      role="alert"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        backgroundColor: themeConfig.bg,
        border: `1px solid ${themeConfig.border}`,
        borderRadius: '0.75rem',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '380px',
        overflow: 'hidden',
        pointerEvents: 'auto',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div style={{ padding: '0.875rem 1rem 0.875rem 0.875rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        {/* Status Icon */}
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          <Icon size={20} color={themeConfig.iconColor} strokeWidth={2.2} />
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: themeConfig.titleColor,
              }}
            >
              {toast.title || themeConfig.badge}
            </span>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '0.8125rem',
              lineHeight: '1.4',
              color: '#334155',
              wordBreak: 'break-word',
            }}
          >
            {toast.message}
          </p>

          {/* Subdetalhes Expansíveis para Erros de Validação da API */}
          {toast.details && toast.details.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: themeConfig.iconColor,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>{showDetails ? 'Ocultar detalhes' : `Ver detalhes (${toast.details.length})`}</span>
                {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              {showDetails && (
                <ul
                  style={{
                    margin: '0.375rem 0 0 0',
                    paddingLeft: '1.125rem',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    lineHeight: '1.4',
                  }}
                >
                  {toast.details.map((detail, idx) => (
                    <li key={idx} style={{ marginTop: '0.15rem' }}>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Manual Dismiss Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Fechar notificação"
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'color 0.15s ease',
          }}
          onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = '#475569')}
          onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')}
        >
          <X size={15} />
        </button>
      </div>

      {/* Dynamic Animated Progress Bar */}
      {duration > 0 && (
        <div
          style={{
            height: '3px',
            width: '100%',
            backgroundColor: '#f1f5f9',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: themeConfig.progressBar,
              transition: isPaused ? 'none' : 'width 0.05s linear',
            }}
          />
        </div>
      )}
    </div>
  );
};
