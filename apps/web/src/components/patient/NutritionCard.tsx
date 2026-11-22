import React, { useState } from 'react';
import { Utensils, Plus, Check } from 'lucide-react';
import { AppCard } from '../ui/AppCard';
import { AppModal } from '../ui/AppModal';
import { AppInput } from '../ui/AppInput';
import { AppButton } from '../ui/AppButton';

export interface NutritionCardProps {
  currentCalories?: number;
  calorieGoal?: number;
  currentProteinG: number;
  proteinGoalG?: number;
  weightKg?: number;
  onAddProtein: (proteinG: number) => void;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({
  currentCalories = 1680,
  calorieGoal = 2200,
  currentProteinG,
  proteinGoalG,
  weightKg = 86,
  onAddProtein,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proteinInput, setProteinInput] = useState('');

  // Fórmula Clínica: 1.4 g/kg de proteína para proteção de massa muscular
  const safeProteinGoal = proteinGoalG && proteinGoalG > 0 ? proteinGoalG : Math.round(weightKg * 1.4);
  const proteinRatio = Math.min(1, Math.max(0, currentProteinG / safeProteinGoal));

  // Estimativas de macronutrientes proporcionais
  const currentCarbsG = Math.round((currentCalories * 0.45) / 4);
  const carbsGoalG = Math.round((calorieGoal * 0.45) / 4);
  const currentFatG = Math.round((currentCalories * 0.25) / 9);
  const fatGoalG = Math.round((calorieGoal * 0.25) / 9);
  const currentFiberG = 22;
  const fiberGoalG = 30;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(proteinInput, 10);
    if (!isNaN(val) && val > 0) {
      onAddProtein(val);
      setProteinInput('');
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <AppCard>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '0.5rem',
                backgroundColor: '#ffe4e6',
                color: '#e11d48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Utensils size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                Nutrição & Proteína
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                Proteção de massa magra (1,4 g/kg • {weightKg} kg)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#e2e8f0')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
          >
            <Plus size={15} />
          </button>
        </div>

        {/* Calorias Consumidas */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '0.625rem',
            padding: '0.875rem',
            textAlign: 'center',
            marginBottom: '1rem',
            border: '1px solid #f1f5f9',
          }}
        >
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {currentCalories}{' '}
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
              / {calorieGoal} kcal
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', marginTop: '0.2rem' }}>
            Balanço energético diário calculado
          </div>
        </div>

        {/* 4 Colunas de Macronutrientes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {/* Proteína (Destaque Principal no GLP-1) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#e11d48' }}>Proteína</div>
            <div style={{ width: '100%', height: '6px', borderRadius: '9999px', backgroundColor: '#ffe4e6', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${proteinRatio * 100}%`,
                  height: '100%',
                  backgroundColor: '#e11d48',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#e11d48' }}>
              {currentProteinG}g <span style={{ color: '#94a3b8', fontWeight: 400 }}>/{safeProteinGoal}g</span>
            </div>
          </div>

          {/* Carboidratos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#0284c7' }}>Carbo</div>
            <div style={{ width: '100%', height: '6px', borderRadius: '9999px', backgroundColor: '#e0f2fe', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (currentCarbsG / carbsGoalG) * 100)}%`,
                  height: '100%',
                  backgroundColor: '#0284c7',
                  borderRadius: '9999px',
                }}
              />
            </div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#334155' }}>
              {currentCarbsG}g <span style={{ color: '#94a3b8', fontWeight: 400 }}>/{carbsGoalG}g</span>
            </div>
          </div>

          {/* Gorduras */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#f59e0b' }}>Gorduras</div>
            <div style={{ width: '100%', height: '6px', borderRadius: '9999px', backgroundColor: '#fef3c7', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (currentFatG / fatGoalG) * 100)}%`,
                  height: '100%',
                  backgroundColor: '#f59e0b',
                  borderRadius: '9999px',
                }}
              />
            </div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#334155' }}>
              {currentFatG}g <span style={{ color: '#94a3b8', fontWeight: 400 }}>/{fatGoalG}g</span>
            </div>
          </div>

          {/* Fibras */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#059669' }}>Fibras</div>
            <div style={{ width: '100%', height: '6px', borderRadius: '9999px', backgroundColor: '#ecfdf5', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, (currentFiberG / fiberGoalG) * 100)}%`,
                  height: '100%',
                  backgroundColor: '#059669',
                  borderRadius: '9999px',
                }}
              />
            </div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#334155' }}>
              {currentFiberG}g <span style={{ color: '#94a3b8', fontWeight: 400 }}>/{fiberGoalG}g</span>
            </div>
          </div>
        </div>
      </AppCard>

      {/* Modal de Registro de Proteína */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Aporte Proteico"
        subtitle="Informe a quantidade de proteína consumida na refeição (g)"
        footer={
          <>
            <AppButton variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </AppButton>
            <AppButton variant="primary" size="sm" icon={<Check size={14} />} onClick={handleConfirm}>
              Confirmar
            </AppButton>
          </>
        }
      >
        <form onSubmit={handleConfirm}>
          <AppInput
            label="Quantidade de Proteína"
            type="number"
            placeholder="Ex: 30"
            suffix="gramas"
            value={proteinInput}
            onChange={(e) => setProteinInput(e.target.value)}
            required
            autoFocus
          />
        </form>
      </AppModal>
    </>
  );
};
