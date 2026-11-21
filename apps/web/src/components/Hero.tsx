import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, Check, Sparkles, Activity, FileText, ChevronRight } from 'lucide-react';

interface ClinicPreset {
  name: string;
  doctor: string;
  crn: string;
  primaryColor: string;
  secondaryColor: string;
  subdomain: string;
  specialty: string;
}

const CLINIC_PRESETS: ClinicPreset[] = [
  {
    name: 'Instituto Vitalis Nutrição',
    doctor: 'Dra. Camila Ferreira',
    crn: 'CRN-3 48.912/P',
    primaryColor: '#059669',
    secondaryColor: '#0284c7',
    subdomain: 'vitalis.ygeia.app',
    specialty: 'Nutrição Clínica & Longevidade'
  },
  {
    name: 'Apex High Performance',
    doctor: 'Dr. Rodrigo Mendes',
    crn: 'CRN-4 22.450/P',
    primaryColor: '#dc2626',
    secondaryColor: '#ea580c',
    subdomain: 'apex.nutrimendes.com.br',
    specialty: 'Nutrição Esportiva & Hipertrofia'
  },
  {
    name: 'Harmonie Saúde & Equilíbrio',
    doctor: 'Dra. Beatriz Prado',
    crn: 'CRN-8 31.029/P',
    primaryColor: '#7c3aed',
    secondaryColor: '#db2777',
    subdomain: 'harmonie.ygeia.app',
    specialty: 'Saúde da Mulher & Fertilidade'
  }
];

export const Hero: React.FC = () => {
  const [activeClinic, setActiveClinic] = useState<ClinicPreset>(CLINIC_PRESETS[0]);

  return (
    <section className="hero-wrapper">
      <div className="ambient-mesh" />

      <div className="container" style={{ textAlign: 'center' }}>
        {/* Floating Top Pill */}
        <div style={{ display: 'inline-flex', marginBottom: '1.75rem' }}>
          <a
            href="#cofre"
            className="pill-badge pill-danger"
            style={{
              textDecoration: 'none',
              padding: '0.4rem 1rem',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)',
              background: 'white'
            }}
          >
            <Lock size={14} color="#dc2626" />
            <span style={{ fontWeight: 700, color: '#991b1b' }}>Novo Padrão de Saúde:</span>
            <span style={{ color: '#475569' }}>Cofre Criptografado de Exames (AES-256)</span>
            <ChevronRight size={14} color="#94a3b8" />
          </a>
        </div>

        {/* Primary Headline */}
        <h1 style={{
          fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
          maxWidth: '1000px',
          margin: '0 auto 1.5rem auto',
          letterSpacing: '-0.035em',
          fontWeight: 800
        }}>
          O primeiro ecossistema White Label onde sua clínica nutricional é a{' '}
          <span className="text-gradient-emerald">dona da própria tecnologia.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          maxWidth: '780px',
          margin: '0 auto 2.5rem auto',
          color: '#475569',
          fontWeight: 400
        }}>
          Diga adeus aos softwares genéricos que estampam a marca deles no celular do seu paciente. Entregue exames laboratoriais criptografados, prontuário com auditoria LGPD, cálculos científicos de TMB em tempo real e um app nativo Offline-First com o <strong>seu nome, suas cores e seu domínio próprio</strong>.
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '3rem'
        }}>
          <a href="#whitelabel" className="btn-primary" style={{ fontSize: '1.05rem' }}>
            <span>Personalizar Minha Clínica Agora</span>
            <ArrowRight size={18} />
          </a>
          <a href="#simulador" className="btn-secondary" style={{ fontSize: '1.05rem' }}>
            <Activity size={18} color="#059669" />
            <span>Testar Motor Científico</span>
          </a>
        </div>

        {/* Trust Points */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '4rem',
          fontSize: '0.875rem',
          color: '#64748b',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={18} color="#059669" strokeWidth={3} />
            <span>Conformidade CFN 306/2003 & 600/2018</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={18} color="#059669" strokeWidth={3} />
            <span>PostgreSQL Row-Level Security (RLS)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={18} color="#059669" strokeWidth={3} />
            <span>App Paciente Funciona sem Internet</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE LIVE PRODUCT HERO SHOWCASE                         */}
        {/* ============================================================== */}
        <div style={{
          position: 'relative',
          maxWidth: '1100px',
          margin: '0 auto',
          borderRadius: '24px',
          padding: '10px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(241, 245, 249, 0.6) 100%)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.8)'
        }}>
          {/* Clinic Selector Toolbar */}
          <div style={{
            background: '#090d16',
            color: 'white',
            borderRadius: '16px 16px 0 0',
            padding: '0.875rem 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textAlign: 'left' }}>
              <span className="pulsing-dot" />
              <span style={{ fontSize: '0.825rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Simulador White Label ao Vivo:
              </span>
            </div>

            {/* Presets Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CLINIC_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveClinic(preset)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: activeClinic.name === preset.name ? `2px solid ${preset.primaryColor}` : '1px solid #334155',
                    background: activeClinic.name === preset.name ? 'rgba(255,255,255,0.12)' : '#1e293b',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: preset.primaryColor }} />
                  {preset.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic Dashboard Chrome */}
          <div style={{
            background: 'white',
            borderRadius: '0 0 16px 16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            textAlign: 'left'
          }}>
            {/* Top Browser Bar */}
            <div style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{
                background: 'white',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '0.25rem 1rem',
                fontSize: '0.8rem',
                color: '#475569',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Lock size={12} color="#059669" />
                https://{activeClinic.subdomain}/prontuario/paciente/8932
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                {activeClinic.crn}
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Patient Card */}
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.25rem',
                background: '#fafafa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: activeClinic.primaryColor,
                      color: 'white',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      LM
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>Lucas Mendes</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>32 anos • 78.4 kg • 1.82 m</div>
                    </div>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(5,150,105,0.1)',
                    color: activeClinic.primaryColor
                  }}>
                    Ativo
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                  <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>IMC</div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>23.6</div>
                  </div>
                  <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Gordura %</div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>13.2%</div>
                  </div>
                  <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>TMB</div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>1.840 kcal</div>
                  </div>
                </div>

                <div style={{
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color={activeClinic.primaryColor} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Prescrição Hipertrofia 2.800 kcal</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>Atualizada</span>
                </div>
              </div>

              {/* Encrypted Exam Vault Card */}
              <div style={{
                border: '1px solid #fecaca',
                borderRadius: '14px',
                padding: '1.25rem',
                background: '#fffbfb',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lock size={18} color="#dc2626" />
                    <span style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.95rem' }}>
                      Cofre de Exames Criptografados
                    </span>
                  </div>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fca5a5'
                  }}>
                    AES-256 GCM
                  </span>
                </div>

                <div style={{ background: 'white', padding: '0.75rem', borderRadius: '8px', border: '1px solid #fed7d7', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span
                      title="Hemograma_Completo_Perfil_Lipidico.pdf"
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Hemograma_Completo.pdf
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', flexShrink: 0 }}>2.4 MB</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={14} /> URL assinada (expira em 14:32m)
                  </div>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  background: '#f8fafc',
                  padding: '0.6rem',
                  borderRadius: '6px',
                  lineHeight: '1.4',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                }}>
                  🔒 <strong>Auditoria LGPD:</strong> Acesso registrado por <code>{activeClinic.doctor}</code> (IP 189.34.12.9) às 17:34 UTC.
                </div>
              </div>
            </div>

            {/* Bottom Clinic Banner */}
            <div style={{
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              padding: '0.85rem 1.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              color: '#475569'
            }}>
              <div>
                <strong>Identidade Ativa:</strong> {activeClinic.name} ({activeClinic.specialty})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: activeClinic.primaryColor }}>
                <Sparkles size={16} /> 100% White Label com Sua Marca
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
