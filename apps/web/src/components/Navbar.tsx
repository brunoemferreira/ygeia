import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <a href="#whitelabel" className="btn-primary header-cta">
            <span>Experimentar Grátis</span>
            <ArrowRight size={16} />
          </a>

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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
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
          <a
            href="#whitelabel"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Começar Demonstração Gratuita
          </a>
        </div>
      )}
    </header>
  );
};
