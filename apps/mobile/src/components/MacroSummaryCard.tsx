import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

interface MacroSummaryCardProps {
  currentCalories: number;
  targetCalories: number;
  currentProtein: number;
  targetProtein: number;
  currentCarbs: number;
  targetCarbs: number;
  currentFats: number;
  targetFats: number;
}

export const MacroSummaryCard: React.FC<MacroSummaryCardProps> = ({
  currentCalories,
  targetCalories,
  currentProtein,
  targetProtein,
  currentCarbs,
  targetCarbs,
  currentFats,
  targetFats,
}) => {
  const calPercent = Math.min(100, Math.round((currentCalories / targetCalories) * 100));

  return (
    <View style={styles.card}>
      <View style={styles.caloriesRow}>
        <View>
          <Text style={styles.sectionTitle}>Balanço Calórico do Dia</Text>
          <Text style={styles.caloriesValue}>
            {currentCalories}{' '}
            <Text style={styles.caloriesTarget}>/ {targetCalories} kcal</Text>
          </Text>
        </View>
        <View style={styles.calBadge}>
          <Text style={styles.calBadgeText}>{calPercent}% meta</Text>
        </View>
      </View>

      <View style={styles.calBarBg}>
        <View style={[styles.calBarFill, { width: `${calPercent}%` }]} />
      </View>

      {/* Grid de 3 Macros */}
      <View style={styles.macrosGrid}>
        {/* Proteína */}
        <View style={[styles.macroItem, { backgroundColor: Colors.proteinBg, borderColor: '#fecaca' }]}>
          <Text style={[styles.macroLabel, { color: Colors.protein }]}>Proteína</Text>
          <Text style={styles.macroValue}>
            {currentProtein}g <Text style={styles.macroTarget}>/{targetProtein}g</Text>
          </Text>
          <View style={styles.macroBarBg}>
            <View
              style={[
                styles.macroBarFill,
                {
                  backgroundColor: Colors.protein,
                  width: `${Math.min(100, Math.round((currentProtein / targetProtein) * 100))}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Carboidrato */}
        <View style={[styles.macroItem, { backgroundColor: Colors.carbBg, borderColor: '#fde68a' }]}>
          <Text style={[styles.macroLabel, { color: Colors.carb }]}>Carboidrato</Text>
          <Text style={styles.macroValue}>
            {currentCarbs}g <Text style={styles.macroTarget}>/{targetCarbs}g</Text>
          </Text>
          <View style={styles.macroBarBg}>
            <View
              style={[
                styles.macroBarFill,
                {
                  backgroundColor: Colors.carb,
                  width: `${Math.min(100, Math.round((currentCarbs / targetCarbs) * 100))}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Gorduras */}
        <View style={[styles.macroItem, { backgroundColor: Colors.fatBg, borderColor: '#bae6fd' }]}>
          <Text style={[styles.macroLabel, { color: Colors.fat }]}>Gorduras</Text>
          <Text style={styles.macroValue}>
            {currentFats}g <Text style={styles.macroTarget}>/{targetFats}g</Text>
          </Text>
          <View style={styles.macroBarBg}>
            <View
              style={[
                styles.macroBarFill,
                {
                  backgroundColor: Colors.fat,
                  width: `${Math.min(100, Math.round((currentFats / targetFats) * 100))}%`,
                },
              ]}
            />
          </View>
        </View>
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
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  caloriesValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  caloriesTarget: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  calBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  calBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  calBarBg: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  calBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  macroItem: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  macroLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  macroValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
  },
  macroTarget: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  macroBarBg: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
