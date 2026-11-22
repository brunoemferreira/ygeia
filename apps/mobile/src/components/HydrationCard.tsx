import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';

interface HydrationCardProps {
  currentMl: number;
  targetMl: number;
  onAddWater: (amountMl: number) => void;
  onReset?: () => void;
}

export const HydrationCard: React.FC<HydrationCardProps> = ({
  currentMl,
  targetMl,
  onAddWater,
}) => {
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Text style={styles.icon}>💧</Text>
          <View>
            <Text style={styles.title}>Meta de Hidratação</Text>
            <Text style={styles.subtitle}>Vital para absorção de nutrientes e performance</Text>
          </View>
        </View>
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.valueRow}>
          <Text style={styles.currentText}>{currentMl} ml</Text>
          <Text style={styles.targetText}>de {targetMl} ml recomendados</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.waterButton}
          onPress={() => onAddWater(200)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonIcon}>🥛</Text>
          <Text style={styles.buttonText}>+200 ml</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.waterButton}
          onPress={() => onAddWater(350)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonIcon}>🥤</Text>
          <Text style={styles.buttonText}>+350 ml</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.waterButton, styles.waterButtonPrimary]}
          onPress={() => onAddWater(500)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonIcon}>🧃</Text>
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>+500 ml</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.waterBorder,
    shadowColor: Colors.water,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  percentageBadge: {
    backgroundColor: Colors.waterLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.water,
  },
  progressSection: {
    marginBottom: 14,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  currentText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.water,
    marginRight: 6,
  },
  targetText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.water,
    borderRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  waterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    borderRadius: 10,
  },
  waterButtonPrimary: {
    backgroundColor: Colors.waterLight,
    borderColor: Colors.waterBorder,
  },
  buttonIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  buttonTextPrimary: {
    color: Colors.water,
  },
});
