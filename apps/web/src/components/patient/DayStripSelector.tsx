import React from 'react';

export interface DayStripItem {
  dateKey: string;
  label: string; // 'D', 'S', 'T', 'Q', 'Q', 'S', 'S'
  dayNumber: number;
  hasDoseDot?: boolean;
  hasWaterDot?: boolean;
  isToday?: boolean;
}

export interface DayStripSelectorProps {
  days: DayStripItem[];
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
  primaryColor?: string;
}

export const DayStripSelector: React.FC<DayStripSelectorProps> = ({
  days,
  selectedDateKey,
  onSelectDate,
  primaryColor = '#059669',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        padding: '0.5rem 0.75rem',
        gap: '0.35rem',
        overflowX: 'auto',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {days.map((d) => {
        const isSelected = d.dateKey === selectedDateKey;
        return (
          <button
            key={d.dateKey}
            type="button"
            onClick={() => onSelectDate(d.dateKey)}
            style={{
              flex: 1,
              minWidth: '40px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.2rem',
              padding: '0.45rem 0.35rem',
              borderRadius: '0.5rem',
              border: isSelected ? `1.5px solid ${primaryColor}` : '1.5px solid transparent',
              backgroundColor: isSelected ? `${primaryColor}10` : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: isSelected ? primaryColor : '#64748b',
              }}
            >
              {d.label}
            </span>

            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: isSelected || d.isToday ? 800 : 600,
                color: isSelected ? primaryColor : '#0f172a',
              }}
            >
              {d.dayNumber}
            </span>

            {/* Ponto indicador de aplicação ou meta */}
            <div style={{ height: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              {d.hasDoseDot && (
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: primaryColor,
                  }}
                  title="Aplicação programada"
                />
              )}
              {d.hasWaterDot && (
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#0284c7',
                  }}
                  title="Meta de hidratação batida"
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
