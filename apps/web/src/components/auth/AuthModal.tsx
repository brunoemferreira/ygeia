import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  Building,
  UserCheck,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Stethoscope,
  Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AuthTabMode = 'admin' | 'patient' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (targetRole?: 'professional' | 'patient') => void;
  initialRole?: 'professional' | 'patient';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'professional',
}) => {
  const { login, registerClinic } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTabMode>(
    initialRole === 'patient' ? 'patient' : 'admin',
  );

  useEffect(() => {
    if (initialRole === 'patient') {
      setActiveTab('patient');
    } else {
      setActiveTab('admin');
    }
  }, [initialRole, isOpen]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slug, setSlug] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 1-Click Demo Login: Dra. Sofia Alencar (Admin / Nutricionista)
  const handleQuickAdminDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('admin@ygeia.com', 'senha123456', 'demo-clinica');
      onSuccess('professional');
    } catch (err: any) {
      setError(err.message || 'Falha ao logar como demonstração de nutricionista.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login: Gabriel Rodrigues (Paciente)
  const handleQuickPatientDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('paciente@ygeia.com', 'senha123456', 'demo-clinica');
      onSuccess('patient');
    } catch (err: any) {
      setError(err.message || 'Falha ao logar como demonstração de paciente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'admin') {
        await login(email, password, slug || undefined);
        onSuccess('professional');
      } else if (activeTab === 'patient') {
        await login(email, password, slug || undefined);
        onSuccess('patient');
      } else {
        await registerClinic({
          clinicName,
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          ownerName,
          email,
          password,
        });
        onSuccess('professional');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '1.25rem',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background:
                  activeTab === 'patient'
                    ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                    : 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.1rem',
              }}
            >
              Υ
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' }}>
                {activeTab === 'patient'
                  ? 'Portal do Paciente Ygeía'
                  : activeTab === 'admin'
                  ? 'Acesso Nutricionista & Admin'
                  : 'Criar Nova Clínica SaaS'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                Acesso protegido com autenticação e isolamento RLS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '0.25rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content with scroll if needed */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
          {/* Tab Selector: Admin vs Paciente vs Cadastro */}
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              padding: '0.25rem',
              borderRadius: '0.625rem',
              marginBottom: '1.25rem',
              gap: '0.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.5rem 0.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: activeTab === 'admin' ? '#ffffff' : 'transparent',
                color: activeTab === 'admin' ? '#0f172a' : '#64748b',
                fontWeight: activeTab === 'admin' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                boxShadow: activeTab === 'admin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Stethoscope size={14} />
              <span>Nutri / Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('patient');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.5rem 0.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: activeTab === 'patient' ? '#ffffff' : 'transparent',
                color: activeTab === 'patient' ? '#059669' : '#64748b',
                fontWeight: activeTab === 'patient' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                boxShadow: activeTab === 'patient' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Heart size={14} />
              <span>Paciente</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError(null);
              }}
              style={{
                flex: 1,
                padding: '0.5rem 0.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: activeTab === 'register' ? '#ffffff' : 'transparent',
                color: activeTab === 'register' ? '#0f172a' : '#64748b',
                fontWeight: activeTab === 'register' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Building size={14} />
              <span>Criar Clínica</span>
            </button>
          </div>

          {/* 1-Click Fast Login Banners */}
          {activeTab === 'admin' && (
            <div
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid #cbd5e1',
                borderRadius: '0.75rem',
                padding: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <Sparkles size={16} color="#0f172a" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                  Acesso Rápido Nutricionista / Admin (Demo)
                </span>
              </div>
              <p style={{ margin: '0 0 0.625rem 0', fontSize: '0.75rem', color: '#475569' }}>
                Acesse como <strong>Dra. Sofia Alencar</strong> (proprietária da clínica com todas as permissões):
              </p>
              <button
                type="button"
                onClick={handleQuickAdminDemoLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '0.5rem',
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <UserCheck size={16} />
                <span>Entrar como Dra. Sofia (Nutri / Admin)</span>
              </button>
            </div>
          )}

          {activeTab === 'patient' && (
            <div
              style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1px solid #a7f3d0',
                borderRadius: '0.75rem',
                padding: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <Sparkles size={16} color="#059669" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#065f46' }}>
                  Acesso Rápido Portal do Paciente (Demo)
                </span>
              </div>
              <p style={{ margin: '0 0 0.625rem 0', fontSize: '0.75rem', color: '#047857' }}>
                Acesse como paciente <strong>Gabriel Rodrigues</strong> para visualizar seu plano de hoje, hidratação e exames:
              </p>
              <button
                type="button"
                onClick={handleQuickPatientDemoLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '0.5rem',
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <UserCheck size={16} />
                <span>Entrar como Gabriel (Paciente)</span>
              </button>
            </div>
          )}

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {activeTab === 'register' && (
              <>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Nome da Clínica ou Consultório
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building
                      size={16}
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                      }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Instituto Vitalis Nutrição"
                      value={clinicName}
                      onChange={(e) => {
                        setClinicName(e.target.value);
                        if (!slug) {
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem 0.625rem 2.25rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Slug do Subdomínio (identificador único)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: vitalis-nutricao"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                    Endereço da clínica: {slug || 'sua-clinica'}.ygeia.app
                  </span>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Nome do Nutricionista Responsável
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Lucas Silveira"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </>
            )}

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.25rem',
                }}
              >
                {activeTab === 'patient' ? 'E-mail do Paciente' : 'E-mail do Profissional'}
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder={
                    activeTab === 'patient' ? 'paciente@email.com' : 'nutricionista@clinica.com'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem 0.625rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.25rem',
                }}
              >
                Senha de Acesso
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="password"
                  required
                  placeholder="Mínimo de 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem 0.625rem 2.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {activeTab !== 'register' && (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: '0.25rem',
                  }}
                >
                  Identificador / Slug da Clínica (Opcional se seu e-mail for único)
                </label>
                <input
                  type="text"
                  placeholder="Ex: demo-clinica"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: activeTab === 'patient' ? '#059669' : '#0f172a',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                marginTop: '0.25rem',
                transition: 'background 0.15s ease',
              }}
            >
              {loading
                ? 'Autenticando...'
                : activeTab === 'patient'
                ? 'Entrar no Portal do Paciente'
                : activeTab === 'admin'
                ? 'Entrar no Painel do Nutricionista'
                : 'Criar Clínica e Acessar'}
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem',
              fontSize: '0.75rem',
              color: '#64748b',
            }}
          >
            <ShieldCheck size={14} color="#059669" />
            <span>Criptografia ponta-a-ponta, senhas com Argon2id e RLS ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
