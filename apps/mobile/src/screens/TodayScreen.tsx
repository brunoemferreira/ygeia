import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { PatientProfile, Meal, MealFood, FoodSubstitution, Supplement } from '../types/patientApp';
import { HydrationCard } from '../components/HydrationCard';
import { MacroSummaryCard } from '../components/MacroSummaryCard';
import { PeriWorkoutBanner } from '../components/PeriWorkoutBanner';
import { MealItemCard } from '../components/MealItemCard';
import { FoodSubstitutionModal } from '../components/FoodSubstitutionModal';

interface TodayScreenProps {
  profile: PatientProfile;
  meals: Meal[];
  supplements: Supplement[];
  onToggleMeal: (mealId: string) => void;
  onToggleSupplement: (supId: string) => void;
  onAddWater: (amountMl: number) => void;
  waterCurrentMl: number;
  onToggleTrainingDay: () => void;
  onReplaceFood: (mealId: string, originalFoodId: string, sub: FoodSubstitution) => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  profile,
  meals,
  supplements,
  onToggleMeal,
  onToggleSupplement,
  onAddWater,
  waterCurrentMl,
  onToggleTrainingDay,
  onReplaceFood,
}) => {
  const [activeSubFood, setActiveSubFood] = useState<{ food: MealFood; mealId: string } | null>(null);

  // Calcular macros consumidos pelas refeições concluídas
  const consumed = meals.reduce(
    (acc, m) => {
      if (m.isCompleted) {
        acc.calories += m.calories;
        acc.protein += m.protein;
        acc.carbs += m.carbs;
        acc.fats += m.fats;
      }
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner Adaptativo Peri-Treino (apenas no modo esportivo ou se treinar) */}
      {profile.mode === 'esportivo' && (
        <PeriWorkoutBanner
          isTrainingDay={profile.isTrainingDay}
          trainingTime={profile.trainingTime}
          onToggleTrainingDay={onToggleTrainingDay}
        />
      )}

      {/* Resumo de Calorias & Macronutrientes */}
      <MacroSummaryCard
        currentCalories={consumed.calories}
        targetCalories={profile.targetCalories}
        currentProtein={consumed.protein}
        targetProtein={profile.targetProtein}
        currentCarbs={consumed.carbs}
        targetCarbs={profile.targetCarbs}
        currentFats={consumed.fats}
        targetFats={profile.targetFats}
      />

      {/* Hidratação Tátil */}
      <HydrationCard
        currentMl={waterCurrentMl}
        targetMl={profile.targetWaterMl}
        onAddWater={onAddWater}
      />

      {/* Suplementação Diária Estruturada */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💊 Suplementação Diária</Text>
        <Text style={styles.sectionBadge}>
          {supplements.filter((s) => s.isTaken).length}/{supplements.length} tomados
        </Text>
      </View>

      <View style={styles.supplementsContainer}>
        {supplements.map((sup) => (
          <TouchableOpacity
            key={sup.id}
            style={[styles.supplementItem, sup.isTaken && styles.supplementTaken]}
            onPress={() => onToggleSupplement(sup.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, sup.isTaken && styles.checkboxChecked]}>
              {sup.isTaken && <Text style={styles.checkText}>✓</Text>}
            </View>
            <View style={styles.supInfo}>
              <Text style={[styles.supName, sup.isTaken && styles.supNameTaken]}>
                {sup.name}
              </Text>
              <Text style={styles.supDose}>
                {sup.dose} • {sup.timing}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Refeições Cronológicas do Dia */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🍽️ Refeições do Dia</Text>
        <Text style={styles.sectionBadge}>
          {meals.filter((m) => m.isCompleted).length}/{meals.length} realizadas
        </Text>
      </View>

      {meals.map((meal) => (
        <MealItemCard
          key={meal.id}
          meal={meal}
          onToggleComplete={onToggleMeal}
          onRequestSubstitution={(food) => setActiveSubFood({ food, mealId: meal.id })}
        />
      ))}

      {/* Espaço final para o BottomTabBar não tapar conteúdo */}
      <View style={{ height: 40 }} />

      {/* Modal de Substituição de Alimentos em 1 Toque */}
      {activeSubFood && (
        <FoodSubstitutionModal
          visible={!!activeSubFood}
          food={activeSubFood.food}
          onClose={() => setActiveSubFood(null)}
          onSelectSubstitution={(originalFoodId, sub) => {
            onReplaceFood(activeSubFood.mealId, originalFoodId, sub);
            setActiveSubFood(null);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    backgroundColor: Colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  supplementsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  supplementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  supplementTaken: {
    opacity: 0.65,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  supInfo: {
    flex: 1,
  },
  supName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  supNameTaken: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  supDose: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
});
