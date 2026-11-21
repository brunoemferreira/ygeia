import React from 'react';
import { Smartphone, WifiOff, Camera, Droplets, Fingerprint } from 'lucide-react';

export const MobilePreviewSection: React.FC = () => {
  return (
    <section id="mobile" style={{ padding: '4rem 0', background: 'white' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Mobile App Highlights */}
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
              <Smartphone size={14} /> Aplicativo Paciente React Native
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '1.25rem' }}>
              Seu Paciente Engajado com o App da Sua Clínica
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              Chega de PDFs perdidos no WhatsApp. Entregue um aplicativo nativo em React Native de altíssima performance, com o nome e as cores do seu consultório, pronto para funcionar mesmo sem sinal de internet.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="icon-box icon-box-blue" style={{ marginBottom: 0, flexShrink: 0 }}>
                  <WifiOff size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Modo Offline-First</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    O paciente consulta a dieta no supermercado ou no restaurante mesmo sem 4G/Wi-Fi com cache em MMKV e SQLite.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="icon-box icon-box-green" style={{ marginBottom: 0, flexShrink: 0 }}>
                  <Camera size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Diário Alimentar Fotográfico</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Registro prático de fotos das refeições direto pela câmera do celular com compressão automática.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div className="icon-box icon-box-purple" style={{ marginBottom: 0, flexShrink: 0 }}>
                  <Fingerprint size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Face ID & Biometria Nativa</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Desbloqueio instantâneo e seguro sem necessidade de digitar senha toda vez que abrir o app.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Mockup Card */}
          <div style={{
            background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: '400px',
            margin: '0 auto',
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark)' }}>
                  App Clínica NutriLife
                </span>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                Online / Offline
              </span>
            </div>

            {/* Mockup Meal Card */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>Almoço — 12:30</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>620 kcal</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                150g Peito de Frango Grelhado<br />
                120g Arroz Integral com Cúrcuma<br />
                100g Brócolis ao Vapor + Salada Verde
              </p>
            </div>

            {/* Mockup Water Tracker */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Droplets size={16} color="#0284c7" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Meta de Água</span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0284c7' }}>2.100 / 3.000 ml</span>
              </div>
              <div style={{ height: '8px', background: '#e0f2fe', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', background: '#0284c7' }} />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                🔒 Protegido com SecureStore & Face ID
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
