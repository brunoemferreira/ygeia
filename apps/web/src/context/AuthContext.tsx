import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  tenantId: string;
  clinicName?: string;
  slug?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, slug?: string) => Promise<void>;
  registerClinic: (data: {
    clinicName: string;
    slug: string;
    ownerName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = ((import.meta as any).env?.VITE_API_URL || 'http://localhost:4333') + '/api/v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carrega sessão salva no localStorage
    const savedToken = localStorage.getItem('ygeia_token');
    const savedUser = localStorage.getItem('ygeia_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('ygeia_token');
        localStorage.removeItem('ygeia_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, slug?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, slug: slug || undefined }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Falha ao autenticar. Verifique e-mail e senha.');
      }

      const data = await res.json();
      setToken(data.accessToken);
      setUser(data.user);

      localStorage.setItem('ygeia_token', data.accessToken);
      localStorage.setItem('ygeia_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const registerClinic = async (formData: {
    clinicName: string;
    slug: string;
    ownerName: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register-clinic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao registrar clínica.');
      }

      const data = await res.json();
      setToken(data.accessToken);
      setUser(data.user);

      localStorage.setItem('ygeia_token', data.accessToken);
      localStorage.setItem('ygeia_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem('ygeia_user', JSON.stringify(userData));
      }
    } catch {
      // Ignora falha silenciosa de refresh
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ygeia_token');
    localStorage.removeItem('ygeia_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        registerClinic,
        logout,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
