import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastData, ToastType } from '../components/toast/ToastItem';
import { ToastContainer } from '../components/toast/ToastContainer';
import { parseApiError } from '../utils/api-error-handler';

export interface ToastOptions {
  title?: string;
  duration?: number;
  details?: string[];
}

export interface ToastContextType {
  toast: {
    success: (message: string, options?: ToastOptions) => string;
    error: (errorOrMessage: unknown, options?: ToastOptions) => string;
    warning: (message: string, options?: ToastOptions) => string;
    info: (message: string, options?: ToastOptions) => string;
    dismiss: (id: string) => void;
    dismissAll: () => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const MAX_TOASTS = 4;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions): string => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastData = {
        id,
        type,
        message,
        title: options?.title,
        duration: options?.duration,
        details: options?.details,
      };

      setToasts((prev) => {
        const next = [newToast, ...prev];
        return next.slice(0, MAX_TOASTS);
      });

      return id;
    },
    [],
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast('success', message, options);
    },
    [addToast],
  );

  const error = useCallback(
    (errorOrMessage: unknown, options?: ToastOptions) => {
      const normalized = parseApiError(errorOrMessage);
      return addToast('error', normalized.message, {
        title: options?.title || normalized.title,
        duration: options?.duration,
        details: options?.details || normalized.details,
      });
    },
    [addToast],
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast('warning', message, options);
    },
    [addToast],
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast('info', message, options);
    },
    [addToast],
  );

  return (
    <ToastContext.Provider
      value={{
        toast: {
          success,
          error,
          warning,
          info,
          dismiss,
          dismissAll,
        },
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
