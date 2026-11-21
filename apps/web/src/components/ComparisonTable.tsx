import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const comparisons = [
    {
      feature: 'Identidade Visual & Branding',
      ygeia: '100% White Label com Sua Marca, Suas Cores e Seu Domínio Próprio',
      traditional: 'Estampa o logotipo do software no celular e no PDF do seu paciente',
      advantage: true
    },
    {
      feature: 'Segurança de Exames Laboratoriais',
      ygeia: 'Cofre criptografado AES-256 com URLs assinadas temporárias de 15 min',
      traditional: 'Arquivos em links públicos permanentes vulneráveis a vazamentos',
      advantage: true
    },
    {
      feature: 'Isolamento de Dados Multi-Tenancy',
      ygeia: 'PostgreSQL Row-Level Security (RLS) forçado no kernel do banco de dados',
      traditional: 'Bancos compartilhados sem isolamento em nível de sistema de banco',
      advantage: true
    },
    {
      feature: 'Aplicativo Mobile do Paciente',
      ygeia: 'Nativo em React Native com modo Offline-First, câmera nativa e Face ID',
      traditional: 'Webviews lentas adaptadas que travam se faltar sinal de internet',
      advantage: true
    },
    {
      feature: 'Auditoria Legal & LGPD / CFN',
      ygeia: 'Trilha de auditoria indelével (IP, usuário, microssegundos) em cada prontuário',
      traditional: 'Logs superficiais sem conformidade estrita com a tutela da saúde',
      advantage: true
    },
    {
      feature: 'Ergonomia de Atendimento',
      ygeia: 'Mobile-First real (touch targets 48px, thumb zone e split-view desktop)',
      traditional: 'Interfaces desktop antigas de 2012 que ficam minúsculas no smartphone',
      advantage: true
    }
  ];

  return (
    <section id="comparativo" style={{ padding: '5rem 0', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="pill-badge pill-emerald" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} /> Comparativo Técnico
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Por que o Ygeía é um Salto de Geração Tecnológica?
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Compare a arquitetura moderna do Ygeía com as soluções de nutrição legadas do mercado brasileiro:
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr',
            padding: '1.5rem',
            background: '#090d16',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.95rem'
          }}>
            <div>RECURSO / CAPACIDADE</div>
            <div style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>YGEÍA WHITE LABEL</span>
              <span className="pill-badge pill-emerald" style={{ fontSize: '0.65rem' }}>Sua Marca</span>
            </div>
            <div style={{ color: '#94a3b8' }}>SOFTWARES CONVENCIONAIS</div>
          </div>

          {/* Table Rows */}
          {comparisons.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr',
                padding: '1.25rem 1.5rem',
                borderBottom: idx < comparisons.length - 1 ? '1px solid #f1f5f9' : 'none',
                background: idx % 2 === 0 ? 'white' : '#fcfcfc',
                alignItems: 'center',
                fontSize: '0.9rem'
              }}
            >
              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                {row.feature}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#047857', fontWeight: 600 }}>
                <Check size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} strokeWidth={3} />
                <span>{row.ygeia}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#64748b' }}>
                <X size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} strokeWidth={2.5} />
                <span>{row.traditional}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
