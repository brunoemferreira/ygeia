import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Utensils,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getStoredBranding } from '../../utils/branding';
import { HydrationWidget } from './HydrationWidget';
import { NutritionCard } from './NutritionCard';
import { WeightCard } from './WeightCard';
import { BodyMapSVG, InjectionSiteId } from './BodyMapSVG';
import { ActiveMedicationCard } from './ActiveMedicationCard';
import { DayStripSelector, DayStripItem } from './DayStripSelector';
import { AppCard } from '../ui/AppCard';
import { AppBadge } from '../ui/AppBadge';

export const PatientPortal: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const branding = getStoredBranding();
  const primaryColor = branding.primaryColor || '#059669';

  // Estados Clínicos do Paciente (Sincronizados com o modelo Evolva)
  const [currentWeightKg, setCurrentWeightKg] = useState(84.2);
  const [initialWeightKg] = useState(92.5);
  const [targetWeightKg] = useState(74.0);

  // Hidratação (Meta clínica de 35 ml/kg: 84.2 * 35 = 2.947 ml)
  const [waterMl, setWaterMl] = useState(2100);

  // Proteína (Meta de 1.4 g/kg: 84.2 * 1.4 = 118 g)
  const [currentProteinG, setCurrentProteinG] = useState(94);

  // Mapa de Injeção Subcutânea GLP-1
  const [selectedSite, setSelectedSite] = useState<InjectionSiteId>('abd_left');
  const [recommendedSite] = useState<InjectionSiteId>('abd_left');
  const [lastAppliedSite] = useState<InjectionSiteId | null>('abd_right');

  // Caneta Ativa
  const [dosesApplied, setDosesApplied] = useState(2);
  const [openDaysCount] = useState(14);

  // Seleção Semanal de Dias
  const [selectedDateKey, setSelectedDateKey] = useState('2026-11-21');
  const weekDays: DayStripItem[] = [
    { dateKey: '2026-11-15', label: 'Dom', dayNumber: 15, hasWaterDot: true },
    { dateKey: '2026-11-16', label: 'Seg', dayNumber: 16, hasWaterDot: true },
    { dateKey: '2026-11-17', label: 'Ter', dayNumber: 17, hasWaterDot: true },
    { dateKey: '2026-11-18', label: 'Qua', dayNumber: 18, hasDoseDot: true, hasWaterDot: true },
    { dateKey: '2026-11-19', label: 'Qui', dayNumber: 19, hasWaterDot: true },
    { dateKey: '2026-11-20', label: 'Sex', dayNumber: 20, hasWaterDot: false },
    { dateKey: '2026-11-21', label: 'Sáb', dayNumber: 21, isToday: true, hasDoseDot: true, hasWaterDot: true },
  ];

  // Substituição alimentar do almoço
  const [lunchProtein, setLunchProtein] = useState<'frango' | 'tilapia' | 'tofu'>('frango');

  const handleAddWater = (amount: number) => {
    setWaterMl((prev) => Math.max(0, Math.min(5000, prev + amount)));
    if (amount > 0) {
      toast.success(`+${amount} ml de água registrados.`);
    }
  };

  const handleAddProtein = (amount: number) => {
    setCurrentProteinG((prev) => prev + amount);
    toast.success(`+${amount}g de proteína adicionados.`);
  };

  const handleSaveWeight = (newWeight: number) => {
    setCurrentWeightKg(newWeight);
    toast.success(`Peso de ${newWeight.toFixed(1).replace('.', ',')} kg registrado com sucesso!`);
  };

  const handleRegisterDose = () => {
    setDosesApplied((prev) => prev + 1);
    toast.success(`Aplicação no sítio "${selectedSite}" registrada com sucesso!`);
  };

  return (
    <div
      style={{
        padding: '2rem 1.5rem',
        maxWidth: '1240px',
        margin: '0 auto',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ========================================================
          1. TOP BANNER DE BOAS-VINDAS INSTITUCIONAL WHITE-LABEL
         ======================================================== */}
      <div
        style={{
          background: `linear-gradient(135deg, ${branding.secondaryColor} 0%, ${branding.primaryColor} 70%, #10b981 100%)`,
          borderRadius: '1.25rem',
          padding: '2rem 2.25rem',
          color: '#ffffff',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: `0 10px 25px -5px ${branding.primaryColor}40`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ zIndex: 1, maxWidth: '680px' }}>
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-block',
              marginBottom: '0.75rem',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            Plano Ativo • {branding.clinicName}
          </span>

          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            Olá, {user?.fullName || 'Gabriel'}! Você atingiu 82% da sua meta hoje.
          </h1>

          <p style={{ margin: 0, fontSize: '0.9375rem', opacity: 0.9, lineHeight: 1.5 }}>
            Sua próxima pesagem e consulta de bioimpedância está agendada para <strong>28/11</strong>. Mantenha a hidratação e o aporte proteico de segurança!
          </p>
        </div>
      </div>

      {/* ========================================================
          2. RÉGUA HORIZONTAL DE DIAS DA SEMANA (DAY STRIP)
         ======================================================== */}
      <div style={{ marginBottom: '1.75rem' }}>
        <DayStripSelector
          days={weekDays}
          selectedDateKey={selectedDateKey}
          onSelectDate={(key) => setSelectedDateKey(key)}
          primaryColor={primaryColor}
        />
      </div>

      {/* ========================================================
          3. GRID RESPONSIVO EM 2 COLUNAS (EXPERIÊNCIA EVOLVA)
         ======================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.75rem',
          alignItems: 'start',
        }}
      >
        {/* ====================================================
            COLUNA 1: METABÓLICO, GLP-1 & CORPO (ESQUERDA)
           ==================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: Caneta GLP-1 Ativa */}
          <ActiveMedicationCard
            medicationName="Mounjaro® (KwikPen)"
            activePrinciple="Tirzepatida"
            prescribedDoseMg={2.5}
            totalMgInPen={10}
            frequencyDays={7}
            dosesApplied={dosesApplied}
            openDaysCount={openDaysCount}
            presentationType="pen"
            onRegisterDose={handleRegisterDose}
          />

          {/* Card 2: Mapa Anatômico de Aplicação com Rotação */}
          <BodyMapSVG
            selectedSite={selectedSite}
            recommendedSite={recommendedSite}
            lastAppliedSite={lastAppliedSite}
            onSelectSite={(site) => {
              setSelectedSite(site);
              toast.info(`Sítio de aplicação selecionado: ${site}`);
            }}
          />

          {/* Card 3: Evolução Ponderal & Balança */}
          <WeightCard
            currentWeightKg={currentWeightKg}
            initialWeightKg={initialWeightKg}
            targetWeightKg={targetWeightKg}
            onSaveWeight={handleSaveWeight}
          />
        </div>

        {/* ====================================================
            COLUNA 2: NUTRIÇÃO, ÁGUA & PLANO ALIMENTAR (DIREITA)
           ==================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Card 1: Hidratação Diária (35 ml/kg) */}
          <HydrationWidget
            currentMl={waterMl}
            weightKg={currentWeightKg}
            onAddWater={handleAddWater}
          />

          {/* Card 2: Nutrição & Proteína (1.4 g/kg) */}
          <NutritionCard
            currentCalories={1720}
            calorieGoal={2200}
            currentProteinG={currentProteinG}
            weightKg={currentWeightKg}
            onAddProtein={handleAddProtein}
          />

          {/* Card 3: Plano Alimentar Interativo com Substituições */}
          <AppCard>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '0.5rem',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Utensils size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                    Meu Cardápio de Hoje
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                    Alimentos prescritos pela equipe de nutrição
                  </div>
                </div>
              </div>

              <AppBadge variant="info">Refeição 2 de 4</AppBadge>
            </div>

            {/* Refeição 1: Café da Manhã (Concluído) */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '0.625rem',
                padding: '0.875rem 1rem',
                border: '1px solid #e2e8f0',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>1. Café da Manhã (07:30)</span>
                </div>
                <AppBadge variant="success">Concluído</AppBadge>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5, paddingLeft: '1.4rem' }}>
                3 ovos mexidos com azeite extravirgem (5ml) + 40g de aveia em flocos finos com 1 banana prata.
              </div>
            </div>

            {/* Refeição 2: Almoço Principal com Substituição Inteligente */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0.625rem',
                padding: '1rem',
                border: `1.5px solid ${primaryColor}`,
                boxShadow: `0 4px 12px ${primaryColor}15`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>
                  <Clock size={16} color={primaryColor} />
                  <span>2. Almoço Principal (12:30)</span>
                </div>
                <AppBadge variant="info">Próxima</AppBadge>
              </div>

              {/* Seletor de Substituição Proteica */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '0.65rem 0.75rem', marginBottom: '0.75rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Opção de Proteína Substituta (Mesma equivalência nutricional):
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {(['frango', 'tilapia', 'tofu'] as const).map((opt) => {
                    const isSel = lunchProtein === opt;
                    const labels = {
                      frango: '150g Peito de Frango Grelhado',
                      tilapia: '180g Filé de Tilápia',
                      tofu: '200g Tofu Orgânico Grelhado',
                    };
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setLunchProtein(opt)}
                        title={labels[opt]}
                        style={{
                          flex: 1,
                          padding: '0.35rem 0.5rem',
                          borderRadius: '0.375rem',
                          border: isSel ? `1.5px solid ${primaryColor}` : '1px solid #cbd5e1',
                          backgroundColor: isSel ? `${primaryColor}15` : '#ffffff',
                          color: isSel ? primaryColor : '#475569',
                          fontSize: '0.6875rem',
                          fontWeight: isSel ? 700 : 500,
                          cursor: 'pointer',
                        }}
                      >
                        {opt === 'frango' ? '🍗 Frango' : opt === 'tilapia' ? '🐟 Tilápia' : '🌱 Tofu'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
                • 100g Arroz integral cozido + 80g Feijão preto
                <br />
                • Salada verde à vontade com rúcula, tomate cereja e pepino
                <br />• 1 colher de sobremesa de azeite extravirgem (5ml)
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
};
