import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Heart, LogOut, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (role?: 'professional' | 'patient') => void;
  onOpenAdmin: () => void;
  onOpenPatient: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenAdmin,
  onOpenPatient,
  onLogout,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-wrapper ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand Lockup: Clean & Minimalist */}
        <a href="#" className="brand-link">
          <div className="brand-icon">
            Υ
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
                onClick={user?.role === 'PATIENT' ? onOpenPatient : onOpenAdmin}
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
              {/* Patient Area Login Button */}
              <button
                onClick={onOpenPatient}
                style={{
                  background: 'transparent',
                  border: '1px solid #a7f3d0',
                  borderRadius: '9999px',
                  padding: '0.45rem 0.875rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#065f46',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.15s ease-in-out',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#ecfdf5';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <Heart size={14} color="#059669" />
                <span>Área do Paciente</span>
              </button>

              {/* Nutritionist / Admin Login Button */}
              <button
                onClick={onOpenAdmin}
                style={{
                  background: '#0f172a',
                  border: '1px solid #0f172a',
                  borderRadius: '9999px',
                  padding: '0.45rem 0.875rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.15s ease-in-out',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#1e293b';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#0f172a';
                }}
              >
                <Stethoscope size={14} color="#34d399" />
                <span>Entrar / Admin</span>
              </button>

              {/* Free Trial Button */}
              <button
                onClick={() => onOpenAuth('professional')}
                className="btn-primary header-cta"
                style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
              >
                <span>Experimentar</span>
                <ArrowRight size={14} />
              </button>
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
                  if (user?.role === 'PATIENT') onOpenPatient();
                  else onOpenAdmin();
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
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPatient();
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
                }}
              >
                🍎 Acessar Portal do Paciente
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
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
                }}
              >
                🩺 Entrar como Nutricionista / Admin
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
