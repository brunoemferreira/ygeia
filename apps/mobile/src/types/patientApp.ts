export type PatientProfileMode = 'clinico' | 'esportivo';

export interface FoodSubstitution {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealFood {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  substitutions: FoodSubstitution[];
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  isCompleted: boolean;
  type: 'standard' | 'pre_workout' | 'post_workout' | 'peri_workout';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: MealFood[];
}

export interface HydrationLog {
  currentMl: number;
  targetMl: number;
  logs: Array<{ id: string; time: string; amountMl: number }>;
}

export interface Supplement {
  id: string;
  name: string;
  dose: string;
  timing: string;
  notes?: string;
  isTaken: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  mode: PatientProfileMode;
  objective: string;
  weight: number;
  targetWeight: number;
  bodyFatPercentage?: number;
  isTrainingDay: boolean;
  trainingTime?: string;
  targetCalories: number;
  targetProtein: number; // g
  targetCarbs: number; // g
  targetFats: number; // g
  targetWaterMl: number;
  nutritionist: {
    name: string;
    crn: string;
    clinic: string;
    phone: string;
  };
}
