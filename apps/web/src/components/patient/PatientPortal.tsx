import React, { useState } from 'react';
import {
  Droplets,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Plus,
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const [waterMl, setWaterMl] = useState(1750);
  const waterTargetMl = 2500;

  // Food substitution state
  const [lunchProtein, setLunchProtein] = useState<'frango' | 'tilapia' | 'tofu'>('frango');

  const addWater = (amount: number) => {
    setWaterMl((prev) => Math.min(4000, prev + amount));
  };

  const waterPercentage = Math.min(100, Math.round((waterMl / waterTargetMl) * 100));

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Banner Greeting */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          borderRadius: '1.25rem',
          padding: '2rem',
          color: 'white',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ zIndex: 1, maxWidth: '640px' }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.25rem 0.625rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-block',
              marginBottom: '0.75rem',
              backdropFilter: 'blur(4px)',
            }}
          >
            Plano Ativo • Instituto Vitalis (Dra. Sofia Alencar)
          </span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Olá, Gabriel! Você atingiu 78% da sua meta hoje.
          </h1>
          <p style={{ margin: 0, fontSize: '0.9375rem', opacity: 0.9, lineHeight: 1.5 }}>
            Seu próximo check-in de medidas e bioimpedância está agendado para <strong>28/11</strong>. Mantenha a hidratação e o consumo proteico!
          </p>
        </div>

        <div style={{ display: 'none', zIndex: 1, textAlign: 'right' }}>
          {/* Decorative element on desktop */}
        </div>
      </div>

      {/* 2-Column Responsive Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* COLUMN 1: PLANO ALIMENTAR INTERATIVO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                🍽️ Meu Plano Alimentar de Hoje
              </h2>
              <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                Meta Diária: 2.450 kcal • 170g Proteínas (2.2 g/kg)
              </span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#059669',
                background: '#ecfdf5',
                padding: '0.25rem 0.625rem',
                borderRadius: '9999px',
                border: '1px solid #a7f3d0',
              }}
            >
              Terça-feira
            </span>
          </div>

          {/* MEAL 1: CAFÉ DA MANHÃ (Concluído) */}
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="#059669" />
                <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>1. Café da Manhã</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(07:30)</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                Concluído ✓
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
              <li>3 ovos mexidos com cúrcuma e azeite extravirgem (5ml)</li>
              <li>40g de aveia em flocos finos com 1 banana prata fatiada</li>
              <li>Café preto sem açúcar (150ml)</li>
            </ul>
          </div>

          {/* MEAL 2: ALMOÇO (Com Substituição Flexível) */}
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.25rem',
              border: '1.5px solid #059669',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#059669" />
                <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>2. Almoço Principal</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(12:30)</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', background: '#f0f9ff', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                Próxima Refeição
              </span>
            </div>

            {/* Substitution Switcher */}
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '0.875rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Sparkles size={13} color="#059669" />
                <span>Substituição Flexível de Proteína (Autorizada pela Nutricionista):</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[
                  { id: 'frango', label: 'Peito de Frango (150g)' },
                  { id: 'tilapia', label: 'Filé de Tilápia (180g)' },
                  { id: 'tofu', label: 'Tofu Grelhado (200g)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLunchProtein(item.id as any)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: lunchProtein === item.id ? '1px solid #059669' : '1px solid #cbd5e1',
                      background: lunchProtein === item.id ? '#ecfdf5' : 'white',
                      color: lunchProtein === item.id ? '#065f46' : '#64748b',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
              <li>
                <strong>Opção Selecionada:</strong> {lunchProtein === 'frango' ? '150g de Peito de frango grelhado em tiras' : lunchProtein === 'tilapia' ? '180g de Filé de tilápia com ervas' : '200g de Tofu firme grelhado'}
              </li>
              <li>140g de arroz integral cozido ou 160g de mandioca cozida</li>
              <li>Salada verde à vontade (rúcula, alface, tomate) com 1 colher de sobremesa de azeite</li>
              <li>80g de feijão carioca em concha média</li>
            </ul>
          </div>

          {/* MEAL 3: JANTAR (Preview) */}
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="#94a3b8" />
                <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>3. Jantar</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(20:00)</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>620 kcal</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
              Salmão grelhado (140g) com purê de batata-doce (120g) e aspargos salteados.
            </p>
          </div>
        </div>

        {/* COLUMN 2: TRACKERS & SAÚDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* WATER TRACKER CARD */}
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplets size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                    Hidratação Diária
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Meta: {waterTargetMl} ml</span>
                </div>
              </div>
              <strong style={{ fontSize: '1.125rem', color: '#0284c7' }}>
                {waterMl} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>ml</span>
              </strong>
            </div>

            {/* Progress Bar */}
            <div style={{ background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: `${waterPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
                  borderRadius: '6px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '1.25rem' }}>
              <span>{waterPercentage}% concluído</span>
              <span>Faltam {Math.max(0, waterTargetMl - waterMl)} ml</span>
            </div>

            {/* Fast Water Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => addWater(250)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #bae6fd',
                  background: '#f0f9ff',
                  color: '#0369a1',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                }}
              >
                <Plus size={14} /> 250ml (Copo)
              </button>
              <button
                type="button"
                onClick={() => addWater(500)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #bae6fd',
                  background: '#f0f9ff',
                  color: '#0369a1',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                }}
              >
                <Plus size={14} /> 500ml (Garrafa)
              </button>
            </div>
          </div>

          {/* EXAMES CRIPTOGRAFADOS (AES-256) CARD */}
          <div
            style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="#059669" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                  Meus Exames Laboratoriais
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: '#065f46',
                  background: '#ecfdf5',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  border: '1px solid #a7f3d0',
                }}
              >
                Criptografia Ativa
              </span>
            </div>

            <p style={{ margin: '0 0 1rem 0', fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
              Seus laudos estão protegidos com criptografia de envelope <strong>AES-256-GCM</strong> e apenas você e sua nutricionista possuem as chaves de acesso.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem', background: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.8125rem' }}>
                <div>
                  <strong>Hemograma & Perfil Lipídico</strong>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Coleta: 15/10/2026 • Lab Fleury</div>
                </div>
                <span style={{ color: '#059669', fontWeight: 700 }}>Normal</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem', background: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.8125rem' }}>
                <div>
                  <strong>Painel Hormonal & Ferritina</strong>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Coleta: 15/10/2026 • Lab Fleury</div>
                </div>
                <span style={{ color: '#059669', fontWeight: 700 }}>Otimizado</span>
              </div>
            </div>
          </div>

          {/* PRÓXIMA CONSULTA */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '1rem',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                <Calendar size={20} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                  Retorno de Bioimpedância
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  28 de Novembro às 14:30 (Presencial)
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#94a3b8" />
          </div>
        </div>
      </div>
    </div>
  );
};
