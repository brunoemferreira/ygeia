import React, { useState, useEffect, useRef } from 'react';
import { YgeiaLogo } from './ui';
import {
  Menu,
  X,
  ShieldCheck,
  Heart,
  LogOut,
  Stethoscope,
  ChevronDown,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onNavigateToLogin: (role?: 'professional' | 'patient') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateToLogin,
  onLogout,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar o dropdown de login ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`header-wrapper ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand Lockup: Clean & Minimalist com Marca Registrada Ygeía */}
        <a href="#" className="brand-link" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <div className="brand-icon" style={{ padding: '3px' }}>
            <YgeiaLogo size={24} inverted color="#059669" />
          </div>
          <span className="brand-title">
            YGEÍA
          </span>
        </a>

        {/* Center Desktop Navigation */}
        <nav className="nav-menu">
          <a href="#whitelabel" className="nav-link">
            White Label Studio
          </a>
          <a href="#cofre" className="nav-link">
            Exames Criptografados
          </a>
          <a href="#simulador" className="nav-link">
            Motor Científico
          </a>
          <a href="#mobile" className="nav-link">
            App Mobile
          </a>
          <a href="#comparativo" className="nav-link">
            Diferenciais
          </a>
        </nav>

        {/* Right Header Actions */}
        <div className="header-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {/* Enter Workspace Button */}
              <button
                onClick={() => onNavigateToLogin(user?.role === 'PATIENT' ? 'patient' : 'professional')}
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  borderRadius: '9999px',
                }}
              >
                {user?.role === 'PATIENT' ? <Heart size={15} /> : <ShieldCheck size={15} />}
                <span>
                  {user?.role === 'PATIENT'
                    ? `Portal (${user?.fullName?.split(' ')[0] || 'Paciente'})`
                    : `Painel (${user?.fullName?.split(' ')[0] || 'Nutri'})`}
                </span>
              </button>

              {/* Quick Logout Button */}
              <button
                onClick={onLogout}
                title="Encerrar sessão"
                style={{
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.5rem 0.75rem',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#fef2f2';
                  (e.currentTarget as HTMLElement).style.color = '#dc2626';
                  (e.currentTarget as HTMLElement).style.borderColor = '#fecaca';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#64748b';
                  (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
                }}
              >
                <LogOut size={13} />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              {/* Combo Dropdown de Acesso / Login */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  style={{
                    background: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '9999px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease-in-out',
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#1e293b';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#0f172a';
                  }}
                >
                  <LogIn size={14} color="#34d399" />
                  <span>Entrar</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: loginDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: '#94a3b8',
                    }}
                  />
                </button>

                {/* Dropdown Menu Popover */}
                {loginDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '270px',
                      backgroundColor: '#ffffff',
                      borderRadius: '0.875rem',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e2e8f0',
                      padding: '0.5rem',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setLoginDropdownOpen(false);
                        onNavigateToLogin('professional');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#ecfdf5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Stethoscope size={16} color="#059669" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0f172a' }}>
                          Área do Nutricionista
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                          Consultório, agenda e prescrições
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginDropdownOpen(false);
                        onNavigateToLogin('patient');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseOver={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#fef2f2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Heart size={16} color="#dc2626" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0f172a' }}>
                          Portal do Paciente
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                          Dieta, treinos e exames
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle-btn"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToLogin(user?.role === 'PATIENT' ? 'patient' : 'professional');
                }}
                className="btn-primary"
                style={{ width: '100%' }}
              >
                Acessar {user?.role === 'PATIENT' ? 'Portal do Paciente' : 'Painel da Clínica'}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  borderRadius: '0.5rem',
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                Sair da Conta
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Acessar Plataforma
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToLogin('professional');
                }}
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Stethoscope size={16} color="#34d399" />
                <span>Área do Nutricionista / Admin</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToLogin('patient');
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #a7f3d0',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Heart size={16} color="#059669" />
                <span>Portal do Paciente</span>
              </button>
            </div>
          )}

          <a
            href="#whitelabel"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.9375rem', padding: '0.4rem 0' }}
          >
            🎨 White Label Studio (Sua Marca)
          </a>
          <a
            href="#cofre"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.9375rem', padding: '0.4rem 0' }}
          >
            🔒 Exames Criptografados (AES-256)
          </a>
          <a
            href="#simulador"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.9375rem', padding: '0.4rem 0' }}
          >
            ⚡ Motor Científico ao Vivo
          </a>
          <a
            href="#mobile"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.9375rem', padding: '0.4rem 0' }}
          >
            📱 App Mobile Paciente (React Native)
          </a>
          <a
            href="#comparativo"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '0.9375rem', padding: '0.4rem 0' }}
          >
            ⚖️ Ygeía vs. Softwares Convencionais
          </a>
        </div>
      )}
    </header>
  );
};
