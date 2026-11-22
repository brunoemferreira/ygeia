import React, { useState, useEffect } from 'react';
import { YgeiaLogo } from '../ui';
import {
  ArrowLeft,
  Mail,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  getStoredBranding,
  buildLoginHeroGradient,
  ClinicBranding,
} from '../../utils/branding';

export type LoginRoleMode = 'professional' | 'patient';

interface LoginPageProps {
  initialRole?: LoginRoleMode;
  onBackToLanding: () => void;
  onSuccess: (targetRole?: 'professional' | 'patient') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToLanding,
  onSuccess,
}) => {
  const { login } = useAuth();
  const { toast } = useToast();

  // Branding sincronizado dinamicamente com as Configurações
  const [branding, setBranding] = useState<ClinicBranding>(() => getStoredBranding());

  useEffect(() => {
    const handleBrandingChange = () => {
      setBranding(getStoredBranding());
    };
    window.addEventListener('ygeia_branding_updated', handleBrandingChange);
    return () => window.removeEventListener('ygeia_branding_updated', handleBrandingChange);
  }, []);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginSlug, setLoginSlug] = useState('');
  const [showAdvancedSlug, setShowAdvancedSlug] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email.trim(), password, loginSlug.trim() || undefined);
      toast.success('Autenticado com sucesso! Acessando o seu portal...');
      onSuccess();
    } catch (err: any) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  const heroGradient = buildLoginHeroGradient(branding.primaryColor, branding.secondaryColor);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        backgroundColor: '#ffffff',
        fontFamily: `'${branding.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      }}
    >
      {/* ========================================================
          COLUNA ESQUERDA: HERO INSTITUCIONAL DINÂMICO
          (Utiliza a cor configurada em Configurações no lugar do azul)
         ======================================================== */}
      <aside
        style={{
          background: heroGradient,
          color: '#ffffff',
          padding: '3.5rem 3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '480px',
        }}
      >
        {/* Efeito sutil de brilho no fundo */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-20%',
            width: '420px',
            height: '420px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Header: Logo + Nome da Clínica */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              flexShrink: 0,
            }}
          >
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.clinicName}
                style={{ width: '26px', height: '26px', objectFit: 'contain' }}
              />
            ) : (
              <YgeiaLogo size={24} color="#ffffff" pulseColor="#a7f3d0" />
            )}
          </div>
          <div>
            <div style={{ fontSize: '1.1875rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {branding.clinicName || 'Ygeía'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 500 }}>
              {branding.slogan || 'Nutrição Clínica & Governança Metabólica'}
            </div>
          </div>
        </div>

        {/* Middle Content Block */}
        <div style={{ maxWidth: '520px', position: 'relative', zIndex: 2, margin: '2.5rem 0' }}>
          {/* Badge: Acesso Seguro */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              padding: '0.3rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(6px)',
            }}
          >
            <ShieldCheck size={14} color="#ffffff" />
            <span>Acesso Seguro</span>
          </div>

          {/* Headline Principal */}
          <h1
            style={{
              fontSize: '2.15rem',
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: '-0.03em',
              margin: '0 0 1.25rem 0',
              color: '#ffffff',
            }}
          >
            Controle metabólico diário e governança clínica em alta precisão.
          </h1>

          {/* Descrição orientativa de perfis */}
          <p
            style={{
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '0 0 2rem 0',
            }}
          >
            Ao autenticar como <strong>Nutricionista ou Administrador</strong>, você acessa o console
            executivo de governança clínica. Ao autenticar como <strong>Paciente</strong>, você é
            direcionado ao seu portal metabólico com plano alimentar, hidratação e metas.
          </p>

          {/* Card Transtranslúcido: Curva histórica */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '0.875rem',
              padding: '0.875rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CheckCircle2 size={18} color="#34d399" />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
              Curva histórica do Peso Inicial até o Peso Atual
            </span>
          </div>
        </div>

        {/* Bottom Footer: Software Seguro */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.65)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Lock size={13} color="rgba(255, 255, 255, 0.75)" />
          <span>Software Seguro</span>
        </div>
      </aside>

      {/* ========================================================
          COLUNA DIREITA: FORMULÁRIO DE LOGIN
          (Fundo branco limpo, foco e botões usando branding.primaryColor)
         ======================================================== */}
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2rem',
          backgroundColor: '#ffffff',
        }}
      >
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Voltar para a Página Inicial */}
          <button
            type="button"
            onClick={onBackToLanding}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              padding: 0,
              color: '#64748b',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '2rem',
              transition: 'color 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.color = '#0f172a')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
          >
            <ArrowLeft size={16} />
            <span>Voltar para a Página Inicial</span>
          </button>

          {/* Título & Instrução */}
          <div style={{ marginBottom: '2rem' }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                margin: '0 0 0.5rem 0',
              }}
            >
              Entrar na sua conta
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Insira suas credenciais para acessar seu ambiente exclusivo.
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* E-mail de acesso */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.375rem',
                }}
              >
                E-mail de acesso
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder="admin@ygeia.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.875rem 0.75rem 2.6rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = branding.primaryColor)}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.375rem',
                }}
              >
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>
                  Senha
                </label>
                <a
                  href="#esqueceu-senha"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Para redefinir sua senha, solicite ao administrador do consultório.');
                  }}
                  style={{
                    fontSize: '0.75rem',
                    color: branding.primaryColor,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Esqueci minha senha
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Key
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.6rem 0.75rem 2.6rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.875rem',
                    color: '#0f172a',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = branding.primaryColor)}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
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

            {/* Identificador opcional da clínica */}
            <div>
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
                {showAdvancedSlug
                  ? '▾ Ocultar identificador da clínica'
                  : '▸ Informar identificador da clínica (opcional)'}
              </button>
              {showAdvancedSlug && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Ex: seu-consultorio ou deixe em branco"
                    value={loginSlug}
                    onChange={(e) => setLoginSlug(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.8125rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Necessário apenas se possuir conta em múltiplos consultórios com o mesmo e-mail.
                  </div>
                </div>
              )}
            </div>

            {/* Botão de Acesso Dinâmico (Usa branding.primaryColor) */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: branding.primaryColor,
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'opacity 0.15s ease, transform 0.1s ease',
                boxShadow: `0 4px 14px ${branding.primaryColor}40`,
                opacity: loading ? 0.75 : 1,
              }}
            >
              <LogIn size={16} />
              <span>{loading ? 'Acessando...' : 'Continuar para o Portal'}</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
