import React, { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--gray-border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--primary)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem'
          }}>
            Υ
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px', color: 'var(--dark)' }}>
              YGEÍA <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>SaaS</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              White Label para Nutrição
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        <nav style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
          <a href="#vantagens" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Vantagens</a>
          <a href="#seguranca" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Segurança & LGPD</a>
          <a href="#calculadora" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Simulador Científico</a>
          <a href="#mobile" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>App Mobile</a>
          <a href="#contato" className="btn btn-primary" style={{ minHeight: '40px', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
            Começar Grátis <ChevronRight size={16} />
          </a>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--dark)'
          }}
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'white',
          borderBottom: '1px solid var(--gray-border)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <a
            href="#vantagens"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, padding: '0.5rem 0' }}
          >
            🌟 Vantagens & Funcionalidades
          </a>
          <a
            href="#seguranca"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, padding: '0.5rem 0' }}
          >
            🔒 Exames Criptografados & LGPD
          </a>
          <a
            href="#calculadora"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, padding: '0.5rem 0' }}
          >
            ⚡ Simulador Científico de TMB
          </a>
          <a
            href="#mobile"
            onClick={() => setMobileMenuOpen(false)}
            style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 600, padding: '0.5rem 0' }}
          >
            📱 App Mobile para o Paciente
          </a>
          <a
            href="#contato"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Solicitar Demonstração Gratuita
          </a>
        </div>
      )}
    </header>
  );
};
