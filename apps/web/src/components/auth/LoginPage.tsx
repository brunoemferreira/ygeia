import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Lock,
  Mail,
  Building,
  UserCheck,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Stethoscope,
  Heart,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type LoginRoleMode = 'professional' | 'patient' | 'register';

interface LoginPageProps {
  initialRole?: LoginRoleMode;
  onBackToLanding: () => void;
  onSuccess: (targetRole?: 'professional' | 'patient') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = 'professional',
  onBackToLanding,
  onSuccess,
}) => {
  const { login, registerClinic } = useAuth();
  const [activeTab, setActiveTab] = useState<LoginRoleMode>(initialRole);

  useEffect(() => {
    setActiveTab(initialRole);
  }, [initialRole]);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [slug, setSlug] = useState('');
  const [loginSlug, setLoginSlug] = useState('');
  const [showAdvancedSlug, setShowAdvancedSlug] = useState(false);
  const [clinicName, setClinicName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1-Click Demo Login: Nutricionista / Admin (Dra. Camila Alencar)
  const handleQuickAdminDemo = async () => {
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

  // 1-Click Demo Login: Bruno Ferreira (Instituto BR)
  const handleQuickBrunoDemo = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('brunoemf@gmail.com', 'senha123456');
      onSuccess('professional');
    } catch (err: any) {
      setError(err.message || 'Falha ao logar com o usuário Bruno Ferreira.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login: Paciente
  const handleQuickPatientDemo = async () => {
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
      if (activeTab === 'professional') {
        await login(email.trim(), password, loginSlug.trim() || undefined);
        onSuccess('professional');
      } else if (activeTab === 'patient') {
        await login(email.trim(), password, loginSlug.trim() || undefined);
        onSuccess('patient');
      } else {
        await registerClinic({
          clinicName,
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          ownerName,
          email: email.trim(),
          password,
        });
        onSuccess('professional');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro na autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090d16',
        backgroundImage: 'radial-gradient(ellipse at top, #132338 0%, #090d16 70%)',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Bar */}
      <header
        style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(9, 13, 22, 0.75)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Back to landing button */}
        <button
          onClick={onBackToLanding}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            padding: '0.45rem 1rem',
            color: '#cbd5e1',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
            (e.currentTarget as HTMLElement).style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
          }}
        >
          <ArrowLeft size={15} />
          <span>Voltar ao site</span>
        </button>

        {/* Center Logo */}
        <div
          onClick={onBackToLanding}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.125rem',
              boxShadow: '0 0 15px rgba(5, 150, 105, 0.4)',
            }}
          >
            Υ
          </div>
          <span
            style={{
              fontSize: '1.125rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#ffffff',
            }}
          >
            YGEÍA
          </span>
        </div>

        {/* Security badge pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#34d399',
            backgroundColor: 'rgba(5, 150, 105, 0.12)',
            border: '1px solid rgba(5, 150, 105, 0.25)',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
          }}
        >
          <ShieldCheck size={14} />
          <span style={{ display: 'none' /* on mobile */ }} className="desktop-inline">
            AES-256 GCM • RLS Multi-Tenant
          </span>
          <span style={{ fontSize: '0.7rem' }}>Seguro</span>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 40px rgba(5, 150, 105, 0.08)',
            overflow: 'hidden',
            color: '#0f172a',
          }}
        >
          {/* Segmented Top Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '0.375rem',
              gap: '0.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setActiveTab('professional');
                setError(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                padding: '0.625rem 0.25rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: activeTab === 'professional' ? '#ffffff' : 'transparent',
                color: activeTab === 'professional' ? '#065f46' : '#64748b',
                boxShadow:
                  activeTab === 'professional'
                    ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)'
                    : 'none',
              }}
            >
              <Stethoscope size={14} color={activeTab === 'professional' ? '#059669' : '#94a3b8'} />
              <span>Nutricionista</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('patient');
                setError(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                padding: '0.625rem 0.25rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: activeTab === 'patient' ? '#ffffff' : 'transparent',
                color: activeTab === 'patient' ? '#065f46' : '#64748b',
                boxShadow:
                  activeTab === 'patient'
                    ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)'
                    : 'none',
              }}
            >
              <Heart size={14} color={activeTab === 'patient' ? '#059669' : '#94a3b8'} />
              <span>Paciente</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                padding: '0.625rem 0.25rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: activeTab === 'register' ? '#ffffff' : 'transparent',
                color: activeTab === 'register' ? '#065f46' : '#64748b',
                boxShadow:
                  activeTab === 'register'
                    ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)'
                    : 'none',
              }}
            >
              <Sparkles size={14} color={activeTab === 'register' ? '#059669' : '#94a3b8'} />
              <span>Criar Clínica</span>
            </button>
          </div>

          {/* Form Body */}
          <div style={{ padding: '2rem 1.75rem' }}>
            {/* Header info */}
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h1
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 800,
                  margin: '0 0 0.35rem 0',
                  color: '#0f172a',
                }}
              >
                {activeTab === 'professional' && 'Área do Nutricionista'}
                {activeTab === 'patient' && 'Portal do Paciente'}
                {activeTab === 'register' && 'Cadastrar Nova Clínica'}
              </h1>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
                {activeTab === 'professional' &&
                  'Acesse seu consultório digital, prescrições e prontuários.'}
                {activeTab === 'patient' &&
                  'Consulte seu plano de dieta, evolução e exames criptografados.'}
                {activeTab === 'register' &&
                  'Configure seu White Label multi-tenant com 14 dias grátis.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.625rem',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* 1-Click Quick Demo Fast Access Button */}
            {activeTab === 'professional' && (
              <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleQuickBrunoDemo}
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#f0fdf4',
                    border: '1.5px dashed #86efac',
                    borderRadius: '0.625rem',
                    padding: '0.75rem 1rem',
                    color: '#166534',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#dcfce7';
                    (e.currentTarget as HTMLElement).style.borderColor = '#4ade80';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f0fdf4';
                    (e.currentTarget as HTMLElement).style.borderColor = '#86efac';
                  }}
                >
                  <Sparkles size={16} color="#059669" />
                  <span>Entrar como Bruno Ferreira (Instituto BR)</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickAdminDemo}
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.625rem',
                    padding: '0.625rem 1rem',
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                  }}
                >
                  <Stethoscope size={15} color="#059669" />
                  <span>Entrar como Dra. Camila (Demo Modelo)</span>
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    margin: '0.75rem 0 0 0',
                  }}
                >
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                    ou acesse com e-mail
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                </div>
              </div>
            )}

            {activeTab === 'patient' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleQuickPatientDemo}
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: '#f0fdf4',
                    border: '1.5px dashed #86efac',
                    borderRadius: '0.625rem',
                    padding: '0.75rem 1rem',
                    color: '#166534',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#dcfce7';
                    (e.currentTarget as HTMLElement).style.borderColor = '#4ade80';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f0fdf4';
                    (e.currentTarget as HTMLElement).style.borderColor = '#86efac';
                  }}
                >
                  <Sparkles size={16} color="#059669" />
                  <span>Entrar com Conta Demo (Gabriel Rodrigues - Paciente)</span>
                </button>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    margin: '1.25rem 0 0.25rem 0',
                  }}
                >
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                  <span style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                    ou acesse com e-mail
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                </div>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Register specific fields */}
              {activeTab === 'register' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Nome da Clínica / Consultório
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
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
                          padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Subdomínio White Label
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        required
                        placeholder="vitalis"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                        style={{
                          flex: 1,
                          padding: '0.65rem 0.75rem',
                          borderRadius: '0.5rem 0 0 0.5rem',
                          border: '1px solid #cbd5e1',
                          borderRight: 'none',
                          fontSize: '0.875rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                      <span
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          padding: '0.65rem 0.75rem',
                          borderRadius: '0 0.5rem 0.5rem 0',
                          fontSize: '0.8125rem',
                          color: '#64748b',
                          fontWeight: 600,
                        }}
                      >
                        .ygeia.app
                      </span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                      Seu Nome Completo (Nutricionista Responsável)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <UserCheck size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dra. Camila Ferreira"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.875rem',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
                  E-mail
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    required
                    placeholder={
                      activeTab === 'patient'
                        ? 'paciente@email.com'
                        : 'nutricionista@consultorio.com'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.75rem 0.65rem 2.25rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                    Senha
                  </label>
                  {activeTab !== 'register' && (
                    <a
                      href="#esqueceu-senha"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Para redefinir sua senha, entre em contato com o suporte ou utilize o link enviado ao seu e-mail.');
                      }}
                      style={{ fontSize: '0.75rem', color: '#059669', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Esqueceu a senha?
                    </a>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.5rem 0.65rem 2.25rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me checkbox */}
              {activeTab !== 'register' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        accentColor: '#059669',
                        cursor: 'pointer',
                      }}
                    />
                    <label htmlFor="rememberMe" style={{ fontSize: '0.8125rem', color: '#64748b', cursor: 'pointer' }}>
                      Lembrar deste dispositivo por 30 dias
                    </label>
                  </div>

                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowAdvancedSlug(!showAdvancedSlug)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline',
                      }}
                    >
                      {showAdvancedSlug ? '▾ Ocultar identificador da clínica' : '▸ Informar identificador da clínica (opcional)'}
                    </button>
                    {showAdvancedSlug && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Ex: instituto-br ou demo-clinica"
                          value={loginSlug}
                          onChange={(e) => setLoginSlug(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.8125rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                        />
                        <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          Necessário apenas se você possuir conta em mais de uma clínica com o mesmo e-mail.
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.75rem',
                  width: '100%',
                  padding: '0.8125rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.25)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {loading ? (
                  <span>Processando...</span>
                ) : (
                  <span>
                    {activeTab === 'professional' && 'Entrar no Consultório'}
                    {activeTab === 'patient' && 'Acessar Portal do Paciente'}
                    {activeTab === 'register' && 'Criar Minha Clínica'}
                  </span>
                )}
              </button>
            </form>

            {/* Bottom helper */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #f1f5f9',
                textAlign: 'center',
                fontSize: '0.8125rem',
                color: '#64748b',
              }}
            >
              {activeTab === 'register' ? (
                <span>
                  Já possui uma clínica cadastrada?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('professional');
                      setError(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Fazer Login
                  </button>
                </span>
              ) : (
                <span>
                  Deseja assinar para seu consultório?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setError(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Cadastre-se grátis
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Footer security trust banner */}
          <div
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.6875rem',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            <CheckCircle2 size={13} color="#059669" />
            <span>Em conformidade com a LGPD e resoluções do CFN / CRN</span>
          </div>
        </div>
      </main>
    </div>
  );
};
