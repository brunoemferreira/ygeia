import React from 'react';
import { Lock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contato" style={{
      background: 'white',
      borderTop: '1px solid var(--gray-border)',
      padding: '3.5rem 0 2rem 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'var(--primary)',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                Υ
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--dark)' }}>
                YGEÍA (Υγεία)
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
              Plataforma SaaS White Label completa para nutricionistas e clínicas nutricionais de alto rendimento.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-security" style={{ fontSize: '0.75rem' }}>
                <Lock size={12} /> LGPD Conforme
              </span>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                <Award size={12} /> CFN 306 & 600
              </span>
            </div>
          </div>

          {/* Funcionalidades */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--dark)' }}>Funcionalidades</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>Exames Criptografados (AES-256)</li>
              <li>Prontuário Eletrônico & Anamnese</li>
              <li>Avaliação Antropométrica & TMB</li>
              <li>Tabela TACO & Cardápios em PDF</li>
              <li>App React Native Offline-First</li>
            </ul>
          </div>

          {/* Segurança & Tecnologia */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--dark)' }}>Segurança & Tech</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>PostgreSQL Row-Level Security</li>
              <li>Criptografia Argon2id</li>
              <li>Cookies Seguros HttpOnly</li>
              <li>Tokens JWT com Rotação Ativa</li>
              <li>Auditoria Indelével de Acessos</li>
            </ul>
          </div>

          {/* Comece Já */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--dark)' }}>Solicite Acesso</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Experimente a plataforma White Label no seu consultório por 14 dias sem compromisso.
            </p>
            <button
              onClick={() => alert('Obrigado pelo interesse! Nossa equipe entrará em contato.')}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.95rem' }}
            >
              Falar com Especialista
            </button>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--gray-border)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2026 Ygeía (Υγεία). Todos os direitos reservados.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Termos de Uso</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Política de Privacidade (LGPD)</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Segurança & RLS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
