import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { Meal, MealFood } from '../types/patientApp';

interface MealItemCardProps {
  meal: Meal;
  onToggleComplete: (mealId: string) => void;
  onRequestSubstitution: (food: MealFood) => void;
}

export const MealItemCard: React.FC<MealItemCardProps> = ({
  meal,
  onToggleComplete,
  onRequestSubstitution,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const isPeri = meal.type === 'pre_workout' || meal.type === 'post_workout';

  return (
    <View style={[styles.card, meal.isCompleted && styles.completedCard]}>
      {/* Header da Refeição */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.checkboxTouch}
          onPress={() => onToggleComplete(meal.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, meal.isCompleted && styles.checkboxChecked]}>
            {meal.isCompleted && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.titleArea}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.mealName, meal.isCompleted && styles.completedText]}>
              {meal.name}
            </Text>
            {isPeri && (
              <Text style={styles.periTag}>
                {meal.type === 'pre_workout' ? 'PRÉ-TREINO ⚡' : 'PÓS-TREINO 🏋️‍♂️'}
              </Text>
            )}
          </View>
          <Text style={styles.mealTime}>
            ⏰ {meal.time} • {meal.calories} kcal • P: {meal.protein}g • C: {meal.carbs}g • G: {meal.fats}g
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.chevronButton}>
          <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Alimentos Expansível */}
      {isExpanded && (
        <View style={styles.foodsList}>
          {meal.foods.map((food, idx) => (
            <View key={food.id} style={[styles.foodRow, idx > 0 && styles.foodRowBorder]}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodQuantity}>
                  {food.quantity} {food.unit} • {food.calories} kcal
                </Text>
              </View>

              {food.substitutions && food.substitutions.length > 0 && (
                <TouchableOpacity
                  style={styles.subButton}
                  onPress={() => onRequestSubstitution(food)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.subButtonText}>Substituições ⇄</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  completedCard: {
    backgroundColor: '#fafafa',
    borderColor: Colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  checkboxTouch: {
    paddingRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  titleArea: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  completedText: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  periTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7c3aed',
    backgroundColor: Colors.workoutBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mealTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chevronButton: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  chevron: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  foodsList: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  foodRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  foodInfo: {
    flex: 1,
    marginRight: 8,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  foodQuantity: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  subButton: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  subButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
});
