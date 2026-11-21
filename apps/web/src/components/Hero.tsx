import React from 'react';
import { ShieldCheck, Lock, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section style={{
      padding: '3rem 0 4rem 0',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ecfdf5 100%)',
      borderBottom: '1px solid var(--gray-border)'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Badges Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <span className="badge badge-security">
            <Lock size={14} /> Exames Laboratoriais Criptografados
          </span>
          <span className="badge badge-primary">
            <Sparkles size={14} /> 100% White Label com Sua Marca
          </span>
          <span className="badge badge-secondary">
            <ShieldCheck size={14} /> Em Conformidade com CFN & LGPD
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '-1px',
          marginBottom: '1.25rem',
          color: 'var(--dark)'
        }}>
          A Plataforma Nutricional Definitiva com{' '}
          <span style={{
            background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            a Marca da Sua Clínica
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--text-muted)',
          maxWidth: '780px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.6
        }}>
          Eleve o padrão do seu consultório: laudos e exames laboratoriais criptografados, prontuário eletrônico blindado com auditoria indelével, motor de cálculo energético em tempo real e um aplicativo móvel nativo em React Native com modo Offline-First para seus pacientes.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '440px',
          margin: '0 auto 2.5rem auto'
        }}>
          <a href="#contato" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem' }}>
            Começar Teste Grátis de 14 Dias <ArrowRight size={20} />
          </a>
          <a href="#calculadora" className="btn btn-outline" style={{ width: '100%' }}>
            Testar Simulador Científico Online
          </a>
        </div>

        {/* Trust Points */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <CheckCircle size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
              Zero Vazamento: PostgreSQL RLS
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <CheckCircle size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
              Seu Próprio Domínio & Logo
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <CheckCircle size={20} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
              App Paciente Funciona Offline
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
