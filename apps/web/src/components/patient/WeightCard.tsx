import React, { useState } from 'react';
import { Scale, Plus, TrendingDown, Check } from 'lucide-react';
import { AppCard } from '../ui/AppCard';
import { AppModal } from '../ui/AppModal';
import { AppInput } from '../ui/AppInput';
import { AppButton } from '../ui/AppButton';

export interface WeightCardProps {
  currentWeightKg: number;
  targetWeightKg?: number;
  initialWeightKg?: number;
  onSaveWeight: (weightKg: number) => void;
}

export const WeightCard: React.FC<WeightCardProps> = ({
  currentWeightKg,
  targetWeightKg = 75,
  initialWeightKg = 92.5,
  onSaveWeight,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weightInput, setWeightInput] = useState(String(currentWeightKg || ''));

  // Perda ponderal total
  const totalLostKg = Math.max(0, Number((initialWeightKg - currentWeightKg).toFixed(1)));
  const totalToLoseKg = Math.max(0.1, Number((initialWeightKg - targetWeightKg).toFixed(1)));
  const progressPercent = Math.min(100, Math.max(0, Math.round((totalLostKg / totalToLoseKg) * 100)));

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(weightInput.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 30 && parsed <= 350) {
      onSaveWeight(parsed);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <AppCard>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Ícone da Balança */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '0.625rem',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Scale size={22} />
          </div>

          {/* Dados de Peso */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Peso Atual: </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {currentWeightKg.toFixed(1).replace('.', ',')} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>kg</span>
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Meta: <strong style={{ color: '#0f172a' }}>{targetWeightKg.toFixed(1).replace('.', ',')} kg</strong>
              </div>
            </div>

            {/* Barra de Progresso da Perda */}
            <div style={{ width: '100%', height: '8px', borderRadius: '9999px', backgroundColor: '#f1f5f9', overflow: 'hidden', marginBottom: '0.35rem' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: '#059669',
                  borderRadius: '9999px',
                  transition: 'width 0.35s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#059669', fontWeight: 700 }}>
                <TrendingDown size={12} />
                <span>{totalLostKg > 0 ? `-${totalLostKg.toFixed(1).replace('.', ',')} kg eliminados` : 'Início do tratamento'}</span>
              </div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>{progressPercent}% da meta</span>
            </div>
          </div>

          {/* Botão Rápido de Registro (+) */}
          <button
            type="button"
            onClick={() => {
              setWeightInput(String(currentWeightKg));
              setIsModalOpen(true);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 0.15s ease',
            }}
            onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#e2e8f0')}
            onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f1f5f9')}
          >
            <Plus size={16} />
          </button>
        </div>
      </AppCard>

      {/* Modal de Registro de Peso */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Pesagem"
        subtitle="Informe o peso aferido na balança pela manhã em jejum"
        footer={
          <>
            <AppButton variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </AppButton>
            <AppButton variant="primary" size="sm" icon={<Check size={14} />} onClick={handleConfirm}>
              Salvar Peso
            </AppButton>
          </>
        }
      >
        <form onSubmit={handleConfirm}>
          <AppInput
            label="Peso Atual"
            type="text"
            placeholder="Ex: 84.5"
            suffix="kg"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            required
            autoFocus
          />
        </form>
      </AppModal>
    </>
  );
};
