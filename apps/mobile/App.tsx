import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, View } from 'react-native';
import { Colors } from './src/theme/colors';
import { TabKey, BottomTabBar } from './src/components/BottomTabBar';
import { TopBar } from './src/components/TopBar';
import { TodayScreen } from './src/screens/TodayScreen';
import { FullPlanScreen } from './src/screens/FullPlanScreen';
import { EvolutionScreen } from './src/screens/EvolutionScreen';
import { NutritionistScreen } from './src/screens/NutritionistScreen';
import { initialProfile, initialMeals, initialSupplements } from './src/data/mockPatientData';
import { FoodSubstitution, Meal } from './src/types/patientApp';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('today');
  const [profile, setProfile] = useState(initialProfile);
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [supplements, setSupplements] = useState(initialSupplements);
  const [waterCurrentMl, setWaterCurrentMl] = useState(1850);

  // Alternar entre modo clínico geral e modo esportivo de alta performance
  const handleToggleMode = () => {
    setProfile((prev) => {
      const nextMode = prev.mode === 'esportivo' ? 'clinico' : 'esportivo';
      return {
        ...prev,
        mode: nextMode,
        objective:
          nextMode === 'esportivo'
            ? 'Hipertrofia & Recomposição Corporal'
            : 'Emagrecimento Sustentável & Reeducação Alimentar',
        targetCalories: nextMode === 'esportivo' ? 2650 : 2050,
        targetProtein: nextMode === 'esportivo' ? 165 : 110,
        targetCarbs: nextMode === 'esportivo' ? 330 : 240,
        targetFats: nextMode === 'esportivo' ? 65 : 55,
      };
    });
  };

  // Alternar dia de treino (ON) vs descanso (OFF)
  const handleToggleTrainingDay = () => {
    setProfile((prev) => {
      const isNextTraining = !prev.isTrainingDay;
      return {
        ...prev,
        isTrainingDay: isNextTraining,
        targetCalories: isNextTraining ? 2650 : 2250,
        targetCarbs: isNextTraining ? 330 : 240, // Redução programada de carbo no descanso
      };
    });
  };

  // Marcar refeição como concluída
  const handleToggleMeal = (mealId: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  // Marcar suplemento como tomado
  const handleToggleSupplement = (supId: string) => {
    setSupplements((prev) =>
      prev.map((s) => (s.id === supId ? { ...s, isTaken: !s.isTaken } : s))
    );
  };

  // Adicionar ingestão de água
  const handleAddWater = (amountMl: number) => {
    setWaterCurrentMl((prev) => prev + amountMl);
  };

  // Trocar alimento por um substituto equivalente
  const handleReplaceFood = (mealId: string, originalFoodId: string, sub: FoodSubstitution) => {
    setMeals((prev) =>
      prev.map((meal) => {
        if (meal.id !== mealId) return meal;

        const updatedFoods = meal.foods.map((food) => {
          if (food.id !== originalFoodId) return food;
          return {
            ...food,
            name: `${sub.name} (Substituído)`,
            quantity: sub.quantity,
            unit: sub.unit,
            calories: sub.calories,
            protein: sub.protein,
            carbs: sub.carbs,
            fats: sub.fats,
          };
        });

        // Recalcular macros totais da refeição
        const newCalories = updatedFoods.reduce((acc, f) => acc + f.calories, 0);
        const newProtein = updatedFoods.reduce((acc, f) => acc + f.protein, 0);
        const newCarbs = updatedFoods.reduce((acc, f) => acc + f.carbs, 0);
        const newFats = updatedFoods.reduce((acc, f) => acc + f.fats, 0);

        return {
          ...meal,
          foods: updatedFoods,
          calories: newCalories,
          protein: newProtein,
          carbs: newCarbs,
          fats: newFats,
        };
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Barra Superior com Perfil e Alternador de Modo */}
      <TopBar profile={profile} onToggleMode={handleToggleMode} />

      {/* Renderização Condicional da Tela Selecionada */}
      <View style={styles.content}>
        {activeTab === 'today' && (
          <TodayScreen
            profile={profile}
            meals={meals}
            supplements={supplements}
            onToggleMeal={handleToggleMeal}
            onToggleSupplement={handleToggleSupplement}
            onAddWater={handleAddWater}
            waterCurrentMl={waterCurrentMl}
            onToggleTrainingDay={handleToggleTrainingDay}
            onReplaceFood={handleReplaceFood}
          />
        )}

        {activeTab === 'plan' && <FullPlanScreen profile={profile} meals={meals} />}

        {activeTab === 'evolution' && <EvolutionScreen profile={profile} />}

        {activeTab === 'nutritionist' && <NutritionistScreen profile={profile} />}
      </View>

      {/* Barra de Navegação Inferior Nativa */}
      <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
