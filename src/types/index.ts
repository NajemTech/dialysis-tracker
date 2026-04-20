export interface FoodItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  servingSize: string;
  servingSizeAr: string;
  potassium: number;
  phosphorus: number;
  sodium: number;
  protein: number;
}

export interface TrackedFood {
  id: string;
  foodId: string;
  servings: number;
  timestamp: string;
  date: string;
  foodName?: string;
  foodNameAr?: string;
  category?: string;
  categoryAr?: string;
  servingSize?: string;
  servingSizeAr?: string;
  potassium?: number;
  phosphorus?: number;
  sodium?: number;
  protein?: number;
}

export interface DailyLog {
  date: string;
  trackedFoods: TrackedFood[];
  waterIntake: number;
  symptoms: Symptom[];
  notes: string;
}

export interface Symptom {
  id: string;
  type: string;
  severity: 1 | 2 | 3;
  timestamp: string;
}

export interface Reminder {
  id: string;
  titleEn: string;
  titleAr: string;
  type: 'medication' | 'doctor' | 'gym' | 'shopping' | 'personal';
  time: string;
  days: number[];
  active: boolean;
}

export interface NutrientLimits {
  potassium: number;
  phosphorus: number;
  sodium: number;
  protein: number;
}

export interface UserProfile {
  name: string;
  weight: number;
  language: 'en' | 'ar';
  darkMode: boolean;
}

export interface NutrientTotals {
  potassium: number;
  phosphorus: number;
  sodium: number;
  protein: number;
}

export type Language = 'en' | 'ar';
