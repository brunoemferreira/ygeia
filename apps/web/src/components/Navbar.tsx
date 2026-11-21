import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(248, 250, 252, 0.75)',
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.05)' : 'none'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.35rem',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
          }}>
            Υ
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', color: '#0f172a', letterSpacing: '-0.03em' }}>
                YGEÍA
              </span>
              <span className="pill-badge pill-emerald" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}>
                <span className="pulsing-dot" /> White Label
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, letterSpacing: '-0.01em' }}>
              Plataforma para Nutricionistas & Clínicas
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <a href="#whitelabel" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.925rem', fontWeight: 600, transition: 'color 0.2s' }}>
            White Label Studio
          </a>
          <a href="#cofre" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.925rem', fontWeight: 600, transition: 'color 0.2s' }}>
            Exames Criptografados
          </a>
          <a href="#simulador" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.925rem', fontWeight: 600, transition: 'color 0.2s' }}>
            Motor Científico
          </a>
          <a href="#mobile" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.925rem', fontWeight: 600, transition: 'color 0.2s' }}>
            App Offline-First
          </a>
          <a href="#comparativo" style={{ textDecoration: 'none', color: '#475569', fontSize: '0.925rem', fontWeight: 600, transition: 'color 0.2s' }}>
            Diferenciais
          </a>
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href="#whitelabel" className="btn-primary" style={{ minHeight: '44px', padding: '0.625rem 1.25rem', fontSize: '0.9rem' }}>
            <span>Experimentar Grátis</span>
            <ArrowRight size={16} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="mobile-toggle"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
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

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
