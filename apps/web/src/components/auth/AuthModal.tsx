import React, { useState } from 'react';
import { X, Lock, Mail, Building, UserCheck, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, registerClinic } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slug, setSlug] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('admin@ygeia.com', 'senha123456', 'demo-clinica');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Falha ao logar como demonstração.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password, slug || undefined);
      } else {
        await registerClinic({
          clinicName,
          slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
          ownerName,
          email,
          password,
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1.25rem',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}>
              Υ
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                {mode === 'login' ? 'Painel Administrativo da Clínica' : 'Cadastrar Nova Clínica SaaS'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                Acesso seguro multi-tenant com isolamento RLS
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

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* 1-Click Demo Login Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
            border: '1px solid #a7f3d0',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={18} color="#059669" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#065f46' }}>
                Acesso Rápido de Demonstração
              </span>
            </div>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: '#047857' }}>
              Acesse instantaneamente a <strong>Ygeía Clínica Modelo</strong> como <strong>Dra. Sofia Alencar</strong> com todas as permissões de dona da clínica:
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.625rem',
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
                transition: 'all 0.2s',
              }}
            >
              <UserCheck size={16} />
              <span>Entrar com 1-Clique (Demo Clínica Modelo)</span>
            </button>
          </div>

          {/* Tab Selector */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '1.25rem',
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              style={{
                flex: 1,
                padding: '0.625rem',
                background: 'transparent',
                border: 'none',
                borderBottom: mode === 'login' ? '2px solid #059669' : '2px solid transparent',
                color: mode === 'login' ? '#059669' : '#64748b',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Já tenho Clínica (Entrar)
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              style={{
                flex: 1,
                padding: '0.625rem',
                background: 'transparent',
                border: 'none',
                borderBottom: mode === 'register' ? '2px solid #059669' : '2px solid transparent',
                color: mode === 'register' ? '#059669' : '#64748b',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Criar Nova Clínica SaaS
            </button>
          </div>

          {error && (
            <div style={{
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
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'register' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                    Nome da Clínica ou Consultório
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
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
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
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Seu endereço será: {slug || 'sua-clinica'}.ygeia.app
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                E-mail Profissional
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  placeholder="seu-email@clinica.com.br"
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
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                Senha de Acesso
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
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

            {mode === 'login' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Slug da Clínica (Opcional se seu e-mail for único)
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
                background: '#0f172a',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              {loading ? 'Processando...' : mode === 'login' ? 'Entrar no Painel da Clínica' : 'Criar Clínica e Acessar Painel'}
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: '#64748b',
          }}>
            <ShieldCheck size={14} color="#059669" />
            <span>Criptografia ponta-a-ponta, senhas com Argon2id e RLS ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
