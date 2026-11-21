import React, { useState } from 'react';
import { Sparkles, Palette, Globe, CheckCircle2, Sliders, Smartphone } from 'lucide-react';

export const WhiteLabelStudioInteractive: React.FC = () => {
  const [clinicName, setClinicName] = useState('Clínica Nutrição & Vida');
  const [professionalName, setProfessionalName] = useState('Dra. Amanda Castro');
  const [crn, setCrn] = useState('CRN-3 54.321/P');
  const [primaryColor, setPrimaryColor] = useState('#059669');
  const [customDomain, setCustomDomain] = useState('app.nutricaovida.com.br');

  const colorPresets = ['#059669', '#0284c7', '#7c3aed', '#dc2626', '#ea580c', '#0f766e'];

  return (
    <section id="whitelabel" style={{ padding: '5rem 0', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem auto' }}>
          <span className="pill-badge pill-emerald" style={{ marginBottom: '1rem' }}>
            <Palette size={14} /> White Label Studio
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Sua Marca em 100% dos Pontos de Contato com o Paciente
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Chega de colocar seus pacientes para baixar um aplicativo com a logo de terceiros. No Ygeía, você customiza paleta de cores, tipografia, logotipo, domínio próprio e papel timbrado. Faça o teste abaixo:
          </p>
        </div>

        <div className="grid-responsive-1-2" style={{ gap: '2.5rem', alignItems: 'start' }}>
          {/* Controls Panel (Left) */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <Sliders size={20} color={primaryColor} />
              <h3 style={{ fontSize: '1.25rem' }}>Painel de Customização White Label</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Nome Fantasia da Clínica / Consultório
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Ex: Instituto Vitalis"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                    Nutricionista Responsável
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={professionalName}
                    onChange={(e) => setProfessionalName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                    Registro Profissional (CRN)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={crn}
                    onChange={(e) => setCrn(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                  Cor Primária da Identidade Visual
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {colorPresets.map((c) => (
                    <button
                      key={c}
                      onClick={() => setPrimaryColor(c)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: c,
                        border: primaryColor === c ? '3px solid #0f172a' : '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease'
                      }}
                      aria-label={`Cor ${c}`}
                    />
                  ))}
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: '40px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem' }}>
                  Domínio Personalizado (CNAME Próprio)
                </label>
                <div style={{ position: 'relative' }}>
                  <Globe size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '40px' }}
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.75rem', padding: '1rem', background: '#ecfdf5', borderRadius: '10px', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={20} color="#059669" />
              <span style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>
                Certificado SSL automático e validação de contraste WCAG 2.2 AA ativos.
              </span>
            </div>
          </div>

          {/* Live Preview Panel (Right) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Preview em Tempo Real
              </span>
              <span className="pill-badge pill-emerald">
                <Sparkles size={14} /> Atualização Instantânea
              </span>
            </div>

            {/* Mockup Card 1: Official Prescription Letterhead */}
            <div style={{
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <div style={{ borderBottom: `3px solid ${primaryColor}`, paddingBottom: '1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.35rem', color: primaryColor, marginBottom: '0.25rem' }}>
                    {clinicName || 'Nome da Sua Clínica'}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                    {professionalName} • {crn}
                  </div>
                </div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: primaryColor,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem'
                }}>
                  {clinicName.charAt(0) || 'C'}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.6' }}>
                <strong>Prescrição Dietética:</strong> Plano de Reeducação Alimentar 2.400 kcal<br />
                <strong>Paciente:</strong> Mariana Souza Silva • Data: 21/11/2026<br />
                <span style={{ color: '#64748b' }}>Exportado automaticamente com timbre oficial da clínica em PDF.</span>
              </div>

              <div style={{
                marginTop: '1.25rem',
                borderTop: '1px dashed #cbd5e1',
                paddingTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                <span>Acesse sua dieta no app: <strong>{customDomain}</strong></span>
                <span>Assinatura Digital Validada</span>
              </div>
            </div>

            {/* Mockup Card 2: Mobile Patient Portal Header */}
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                background: primaryColor,
                color: 'white',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Aplicativo do Paciente
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                    {clinicName}
                  </div>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={16} />
                </div>
              </div>
              <div style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Responsável Técnico: <strong>{professionalName}</strong></span>
                <span style={{ color: primaryColor, fontWeight: 700 }}>{crn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
