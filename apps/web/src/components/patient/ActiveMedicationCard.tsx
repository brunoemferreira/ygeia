import React from 'react';
import { Pill, Syringe, AlertTriangle, Clock } from 'lucide-react';
import { AppCard } from '../ui/AppCard';
import { AppBadge } from '../ui/AppBadge';
import { AppButton } from '../ui/AppButton';

export interface ActiveMedicationCardProps {
  medicationName?: string;
  activePrinciple?: string;
  prescribedDoseMg?: number;
  totalMgInPen?: number;
  frequencyDays?: number;
  dosesApplied?: number;
  openDaysCount?: number;
  presentationType?: 'pen' | 'vial_syringe';
  onRegisterDose?: () => void;
}

export const ActiveMedicationCard: React.FC<ActiveMedicationCardProps> = ({
  medicationName = 'Mounjaro® (KwikPen)',
  activePrinciple = 'Tirzepatida',
  prescribedDoseMg = 2.5,
  totalMgInPen = 10,
  frequencyDays: _frequencyDays = 7,
  dosesApplied = 2,
  openDaysCount = 14,
  presentationType = 'pen',
  onRegisterDose,
}) => {
  // Cálculos Farmacotécnicos (espelhando PenCalculatorService do Evolva)
  const fullDosesCount = Math.floor(totalMgInPen / prescribedDoseMg);
  const remainingDoses = Math.max(0, fullDosesCount - dosesApplied);
  const remainingMg = Math.max(0, totalMgInPen - dosesApplied * prescribedDoseMg);

  // Cliques de caneta (60 ou 72 cliques dependendo do dispositivo)
  const clicksPerDose = Math.round((prescribedDoseMg / 2.5) * 60);

  // Unidades de seringa U-100 para ampolas (ex: 10mg em 2ml = 5mg/ml -> 2.5mg = 0.5ml = 50 UI)
  const concentrationMgMl = 5;
  const volumeMl = prescribedDoseMg / concentrationMgMl;
  const syringeUnitsU100 = Math.round(volumeMl * 100);

  // Alerta de estabilidade microbiológica em 30 dias
  const isExpiringSoon = openDaysCount >= 23;
  const daysRemaining = Math.max(0, 30 - openDaysCount);

  return (
    <AppCard>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '0.5rem',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {presentationType === 'pen' ? <Pill size={18} /> : <Syringe size={18} />}
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
              {medicationName}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
              {activePrinciple} • Dose semanal de {prescribedDoseMg} mg
            </div>
          </div>
        </div>

        <AppBadge variant={remainingDoses > 0 ? 'success' : 'warning'}>
          {remainingDoses > 0 ? `${remainingDoses} doses restantes` : 'Caneta finalizada'}
        </AppBadge>
      </div>

      {/* Grid de Métricas de Doses & Cliques */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '0.625rem',
          padding: '0.75rem',
          border: '1px solid #f1f5f9',
          marginBottom: '1rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.625rem', color: '#64748b' }}>Dose Prescrita</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            {prescribedDoseMg} <span style={{ fontSize: '0.6875rem' }}>mg</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.625rem', color: '#64748b' }}>
            {presentationType === 'pen' ? 'Cliques na Caneta' : 'Seringa U-100'}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>
            {presentationType === 'pen' ? `${clicksPerDose} cliques` : `${syringeUnitsU100} UI`}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.625rem', color: '#64748b' }}>Estoque na Caneta</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            {remainingMg} <span style={{ fontSize: '0.6875rem' }}>/ {totalMgInPen} mg</span>
          </div>
        </div>
      </div>

      {/* Alerta de Estabilidade Microbiológica (30 dias após abertura) */}
      <div
        style={{
          padding: '0.65rem 0.85rem',
          borderRadius: '0.5rem',
          backgroundColor: isExpiringSoon ? '#fffbeb' : '#f8fafc',
          border: `1px solid ${isExpiringSoon ? '#fde68a' : '#e2e8f0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          fontSize: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {isExpiringSoon ? (
            <AlertTriangle size={15} color="#d97706" />
          ) : (
            <Clock size={15} color="#64748b" />
          )}
          <span style={{ color: isExpiringSoon ? '#92400e' : '#475569', fontWeight: 500 }}>
            Aberta há <strong>{openDaysCount} dias</strong> (estabilidade garantida de 30 dias)
          </span>
        </div>

        <span style={{ fontWeight: 700, color: isExpiringSoon ? '#d97706' : '#059669' }}>
          {daysRemaining} dias restantes
        </span>
      </div>

      {/* Botão de Registro de Aplicação */}
      {onRegisterDose && (
        <AppButton
          variant="primary"
          size="sm"
          fullWidth
          icon={<Syringe size={14} />}
          onClick={onRegisterDose}
        >
          Registrar Aplicação Semanal
        </AppButton>
      )}
    </AppCard>
  );
};

