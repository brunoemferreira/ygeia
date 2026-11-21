import React, { useState } from 'react';
import { Smartphone, WifiOff, Camera, Droplets, Fingerprint, Plus } from 'lucide-react';

export const MobileAppMockup: React.FC = () => {
  const [waterMl, setWaterMl] = useState(2250);
  const targetWater = 3000;

  const addWater = () => {
    setWaterMl((prev) => Math.min(prev + 250, 4000));
  };

  const waterPercentage = Math.min(Math.round((waterMl / targetWater) * 100), 100);

  return (
    <section id="mobile" style={{ padding: '5rem 0', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Copy & Value Propositions */}
          <div>
            <span className="pill-badge pill-cyan" style={{ marginBottom: '1rem' }}>
              <Smartphone size={14} /> React Native & Expo CNG
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1.25rem' }}>
              O Paciente Leva a Sua Marca no Bolso. Inclusive Sem Internet.
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Quantas vezes seu paciente deixou de seguir a dieta porque estava no supermercado sem sinal 4G? Com o app nativo do Ygeía, o plano alimentar e a lista de compras ficam salvos localmente em <strong>MMKV e SQLite</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <WifiOff size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                    Arquitetura Offline-First Real
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                    Acesso instantâneo mesmo no modo avião. Registros de água e refeições offline entram numa fila de sincronização e sobem automaticamente ao restabelecer conexão.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Camera size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                    Diário Fotográfico com Câmera Nativa
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                    O paciente tira fotos do prato antes de comer. As imagens são comprimidas localmente no aparelho para não consumir o plano de dados móveis.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Fingerprint size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                    Biometria Nativa & Privacy Screen
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5' }}>
                    Desbloqueio com Face ID ou impressão digital via <code>expo-local-authentication</code>. Ao trocar de app, a tela é ofuscada para proteger os dados de saúde.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic iPhone 16 Pro Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '320px',
              height: '640px',
              background: '#090d16',
              borderRadius: '48px',
              padding: '12px',
              boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.35), 0 0 0 2px #334155',
              position: 'relative'
            }}>
              {/* Dynamic Island */}
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '95px',
                height: '24px',
                background: 'black',
                borderRadius: '12px',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1e293b' }} />
              </div>

              {/* Inner Screen */}
              <div style={{
                width: '100%',
                height: '100%',
                background: '#f8fafc',
                borderRadius: '38px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* App Header */}
                <div style={{
                  background: 'linear-gradient(180deg, #059669 0%, #047857 100%)',
                  color: 'white',
                  padding: '38px 16px 14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
                      Clínica Vitalis Nutrição
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      Olá, Mariana! 👋
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '10px',
                    fontWeight: 700
                  }}>
                    Offline ✓
                  </span>
                </div>

                {/* Inner Content */}
                <div style={{ padding: '14px', flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Next Meal */}
                  <div style={{ background: 'white', borderRadius: '12px', padding: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>ALMOÇO — 12:30</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>680 kcal</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#334155', lineHeight: '1.4' }}>
                      • 150g Peito de Frango Grelhado<br />
                      • 120g Arroz Integral com Cúrcuma<br />
                      • Salada Verde à vontade c/ Azeite
                    </div>
                    <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Foto registrada ✓</span>
                      <Camera size={14} color="#059669" />
                    </div>
                  </div>

                  {/* Interactive Water Tracker */}
                  <div style={{ background: 'white', borderRadius: '12px', padding: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Droplets size={14} color="#0284c7" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Meta de Água</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284c7' }}>
                        {waterMl} / {targetWater} ml ({waterPercentage}%)
                      </span>
                    </div>

                    <div style={{ height: '8px', background: '#e0f2fe', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ width: `${waterPercentage}%`, height: '100%', background: '#0284c7', transition: 'width 0.3s ease' }} />
                    </div>

                    <button
                      onClick={addWater}
                      style={{
                        width: '100%',
                        padding: '6px',
                        background: '#f0f9ff',
                        color: '#0284c7',
                        border: '1px dashed #bae6fd',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={12} /> Adicionar 250ml
                    </button>
                  </div>

                  {/* Biometric Security Badge */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '8px',
                    textAlign: 'center',
                    fontSize: '0.65rem',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}>
                    <Fingerprint size={12} color="#059669" />
                    Protegido por Face ID & SecureStore
                  </div>
                </div>

                {/* Bottom App Navigation */}
                <div style={{
                  background: 'white',
                  borderTop: '1px solid #e2e8f0',
                  padding: '8px 16px 20px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.65rem',
                  color: '#64748b'
                }}>
                  <div style={{ color: '#059669', fontWeight: 800, textAlign: 'center' }}>Dieta</div>
                  <div style={{ textAlign: 'center' }}>Diário</div>
                  <div style={{ textAlign: 'center' }}>Evolução</div>
                  <div style={{ textAlign: 'center' }}>Clínica</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
