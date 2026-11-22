import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

interface PeriWorkoutBannerProps {
  isTrainingDay: boolean;
  trainingTime?: string;
  onToggleTrainingDay: () => void;
}

export const PeriWorkoutBanner: React.FC<PeriWorkoutBannerProps> = ({
  isTrainingDay,
  trainingTime = '17:30',
  onToggleTrainingDay,
}) => {
  return (
    <View style={[styles.container, isTrainingDay ? styles.trainingActive : styles.restActive]}>
      <View style={styles.textCol}>
        <View style={styles.badgeRow}>
          <Text style={[styles.statusBadge, isTrainingDay ? styles.badgeTraining : styles.badgeRest]}>
            {isTrainingDay ? '⚡ DIA DE TREINO (ON)' : '🛋️ DIA DE DESCANSO (OFF)'}
          </Text>
          {isTrainingDay && (
            <Text style={styles.timeTag}>Horário previsto: {trainingTime}</Text>
          )}
        </View>

        <Text style={styles.title}>
          {isTrainingDay
            ? 'Modulação de Carboidratos & Nutrient Timing Ativos'
            : 'Recuperação Muscular & Reposição de Glicogênio'}
        </Text>
        <Text style={styles.description}>
          {isTrainingDay
            ? 'Refeições pré e pós-treino com aporte otimizado de carboidratos rápidos para suporte ao desempenho.'
            : 'Dieta com redução programada de carboidratos (-15%) e manutenção de proteínas de alto valor biológico.'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={onToggleTrainingDay}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleButtonText}>Alternar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trainingActive: {
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
  },
  restActive: {
    backgroundColor: '#f8fafc',
    borderColor: Colors.border,
  },
  textCol: {
    flex: 1,
    marginRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTraining: {
    backgroundColor: Colors.workoutBg,
    color: '#6d28d9',
  },
  badgeRest: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
  },
  timeTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6d28d9',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15,
  },
  toggleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
});
