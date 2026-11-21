import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenAdmin }) => {
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
            <button
              onClick={onOpenAdmin}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.125rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ShieldCheck size={16} />
              <span>Painel ({user?.fullName ? user.fullName.split(' ')[0] : 'Clínica'})</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={onOpenAuth}
                style={{
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  borderRadius: '9999px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.15s ease-in-out',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <User size={15} color="#059669" />
                <span>Entrar / Admin</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="btn-primary header-cta"
                style={{ cursor: 'pointer' }}
              >
                <span>Experimentar Grátis</span>
                <ArrowRight size={16} />
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
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}>
          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="btn-primary"
              style={{ width: '100%', marginBottom: '0.5rem' }}
            >
              Acessar Painel Administrativo da Clínica
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
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
                marginBottom: '0.5rem',
              }}
            >
              Entrar na Minha Clínica / Admin
            </button>
          )}

          <a
            href="#whitelabel"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 0' }}
          >
            🎨 White Label Studio (Sua Marca)
          </a>
          <a
            href="#cofre"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 0' }}
          >
            🔒 Exames Criptografados (AES-256)
          </a>
          <a
            href="#simulador"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 0' }}
          >
            ⚡ Motor Científico ao Vivo
          </a>
          <a
            href="#mobile"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 0' }}
          >
            📱 App Mobile Paciente (React Native)
          </a>
          <a
            href="#comparativo"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 0' }}
          >
            ⚖️ Ygeía vs. Softwares Convencionais
          </a>
        </div>
      )}
    </header>
  );
};
