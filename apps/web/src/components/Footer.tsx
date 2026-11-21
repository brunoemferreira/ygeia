import React from 'react';
import { Lock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: '#090d16',
      color: '#94a3b8',
      padding: '4.5rem 0 2rem 0',
      borderTop: '1px solid #1f2937'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                Υ
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.35rem', color: 'white', letterSpacing: '-0.03em' }}>
                YGEÍA (Υγεία)
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem', color: '#94a3b8' }}>
              Plataforma de alta performance para nutricionistas e clínicas que desejam autoridade com tecnologia própria White Label.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="pill-badge pill-danger" style={{ fontSize: '0.75rem' }}>
                <Lock size={12} /> LGPD Conforme
              </span>
              <span className="pill-badge pill-emerald" style={{ fontSize: '0.75rem' }}>
                <Award size={12} /> CFN 306 & 600
              </span>
            </div>
          </div>

          {/* Funcionalidades */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Funcionalidades
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.9rem' }}>
              <li><a href="#whitelabel" style={{ color: '#94a3b8', textDecoration: 'none' }}>White Label Studio</a></li>
              <li><a href="#cofre" style={{ color: '#94a3b8', textDecoration: 'none' }}>Exames Criptografados</a></li>
              <li><a href="#simulador" style={{ color: '#94a3b8', textDecoration: 'none' }}>Motor Científico de TMB</a></li>
              <li><a href="#mobile" style={{ color: '#94a3b8', textDecoration: 'none' }}>App Mobile Offline-First</a></li>
              <li><a href="#comparativo" style={{ color: '#94a3b8', textDecoration: 'none' }}>Prontuário CFN & LGPD</a></li>
            </ul>
          </div>

          {/* Segurança & Arquitetura */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Segurança & Infra
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.9rem' }}>
              <li>PostgreSQL Row-Level Security</li>
              <li>Criptografia Argon2id (OWASP)</li>
              <li>Cookies HttpOnly com SameSite</li>
              <li>Rotação de JWT & Anti-Reuso</li>
              <li>Trilha Indelével de Auditoria</li>
            </ul>
          </div>

          {/* CTA Box */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Comece no Seu Consultório
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1rem', color: '#94a3b8' }}>
              Coloque sua clínica em outro patamar tecnológico com 14 dias de teste gratuito sem compromisso.
            </p>
            <a
              href="#whitelabel"
              className="btn-primary"
              style={{ width: '100%', minHeight: '44px', fontSize: '0.9rem' }}
            >
              Criar Minha Clínica White Label
            </a>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1f2937',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div>
            © 2026 Ygeía (Υγεία). Todos os direitos reservados.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ color: '#64748b' }}>Termos de Uso</span>
            <span style={{ color: '#64748b' }}>Política de Privacidade (LGPD)</span>
            <span style={{ color: '#64748b' }}>Conformidade CFN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
