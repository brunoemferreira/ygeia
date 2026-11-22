import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { PatientProfile, Meal } from '../types/patientApp';

interface FullPlanScreenProps {
  profile: PatientProfile;
  meals: Meal[];
}

export const FullPlanScreen: React.FC<FullPlanScreenProps> = ({ profile, meals }) => {
  const isSports = profile.mode === 'esportivo';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Banner de Identificação */}
      <View style={styles.headerCard}>
        <Text style={styles.tag}>
          {isSports ? '⚡ Protocolo Esportivo & Alta Performance' : '🍏 Prescrição Clínica Geral & Hábitos'}
        </Text>
        <Text style={styles.planTitle}>Plano Alimentar Individualizado</Text>
        <Text style={styles.nutritionistNote}>
          Prescrito por {profile.nutritionist.name} ({profile.nutritionist.crn})
        </Text>

        <View style={styles.targetsRow}>
          <View style={styles.targetCol}>
            <Text style={styles.targetVal}>{profile.targetCalories}</Text>
            <Text style={styles.targetLbl}>kcal / dia</Text>
          </View>
          <View style={styles.targetCol}>
            <Text style={styles.targetVal}>{profile.targetProtein}g</Text>
            <Text style={styles.targetLbl}>
              Proteína ({isSports ? `${(profile.targetProtein / profile.weight).toFixed(1)} g/kg` : '25%'})
            </Text>
          </View>
          <View style={styles.targetCol}>
            <Text style={styles.targetVal}>{profile.targetCarbs}g</Text>
            <Text style={styles.targetLbl}>Carboidratos</Text>
          </View>
          <View style={styles.targetCol}>
            <Text style={styles.targetVal}>{profile.targetFats}g</Text>
            <Text style={styles.targetLbl}>Gorduras</Text>
          </View>
        </View>
      </View>

      {/* Orientações Gerais */}
      <View style={styles.guideCard}>
        <Text style={styles.guideTitle}>💡 Recomendações Dietoterápicas</Text>
        <Text style={styles.guideText}>
          • Priorize alimentos in natura e minimamente processados.{'\n'}
          • Não pule refeições programadas para evitar catabolismo e desregulação de saciedade.{'\n'}
          • Ao fazer substituições, utilize o botão "Substituições" para manter a mesma densidade calórica e proporção de macronutrientes.{'\n'}
          • Em dias de treino, consuma o pré-treino 60 a 90 minutos antes do início do esforço físico.
        </Text>
      </View>

      {/* Lista de Todas as Refeições Detalhadas */}
      <Text style={styles.listHeader}>Horários & Cardápio Completo ({meals.length} refeições)</Text>

      {meals.map((meal) => (
        <View key={meal.id} style={styles.mealDetailCard}>
          <View style={styles.mealHeader}>
            <View>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.mealTime}>⏰ {meal.time}</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={styles.macroPillText}>{meal.calories} kcal</Text>
            </View>
          </View>

          <View style={styles.foodList}>
            {meal.foods.map((food) => (
              <View key={food.id} style={styles.foodRow}>
                <Text style={styles.foodBullet}>•</Text>
                <View style={styles.foodTextGroup}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodDose}>
                    {food.quantity} {food.unit} ({food.calories} kcal | P: {food.protein}g C: {food.carbs}g G: {food.fats}g)
                  </Text>
                  {food.substitutions.length > 0 && (
                    <Text style={styles.subNote}>
                      Substitutos disponíveis: {food.substitutions.map((s) => s.name).join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  headerCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
  },
  tag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  nutritionistNote: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 14,
  },
  targetsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  targetCol: {
    alignItems: 'center',
    flex: 1,
  },
  targetVal: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  targetLbl: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  guideCard: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  guideText: {
    fontSize: 12,
    color: '#065f46',
    lineHeight: 18,
  },
  listHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  mealDetailCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 8,
    marginBottom: 8,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  mealTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  macroPill: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  macroPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  foodList: {
    gap: 8,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  foodBullet: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 6,
    lineHeight: 18,
  },
  foodTextGroup: {
    flex: 1,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  foodDose: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  subNote: {
    fontSize: 10,
    color: Colors.primary,
    fontStyle: 'italic',
    marginTop: 2,
  },
});
