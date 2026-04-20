import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { TrackedFood, DailyLog, NutrientTotals, Symptom, UserProfile, NutrientLimits, FoodItem } from '@/types';
import { DEFAULT_LIMITS, PROTEIN_PER_KG, DEFAULT_WEIGHT } from '@/constants/config';
import {
  getCurrentUser,
  onAuthStateChange,
  getProfile,
  updateProfile as updateProfileDB,
  getNutrientLimits,
  getFoodLogs,
  addFoodLog,
  deleteFoodLog,
  getFoods,
  getWaterLogs,
  addWaterLog,
  getDailyNotes,
  upsertDailyNote,
  getSymptomLogs,
  addSymptomLog,
} from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

interface TrackingContextType {
  profile: UserProfile;
  foods: FoodItem[];
  updateProfile: (p: Partial<UserProfile>) => void;
  todayLog: DailyLog;
  addFood: (foodId: string, servings: number) => Promise<boolean>;
  removeFood: (trackedId: string) => void;
  getTotals: (log?: DailyLog) => NutrientTotals;
  getLimits: () => { potassium: number; phosphorus: number; sodium: number; protein: number };
  addWater: (ml: number) => Promise<boolean>;
  addSymptom: (type: string, severity: 1 | 2 | 3) => Promise<boolean>;
  updateNotes: (notes: string) => Promise<boolean>;
  getAllLogs: () => DailyLog[];
  getLogForDate: (date: string) => DailyLog | undefined;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const TrackingContext = createContext<TrackingContextType | null>(null);
type FoodRow = Database['public']['Tables']['foods']['Row'];
type FoodLogRow = Database['public']['Tables']['food_logs']['Row'];
type WaterLogRow = Database['public']['Tables']['water_logs']['Row'];
type DailyNoteRow = Database['public']['Tables']['daily_notes']['Row'];
type SymptomLogRow = Database['public']['Tables']['symptom_logs']['Row'];

function loadLogs(): DailyLog[] {
  const saved = localStorage.getItem('dt-logs');
  return saved ? JSON.parse(saved) : [];
}

function saveLogs(logs: DailyLog[]) {
  localStorage.setItem('dt-logs', JSON.stringify(logs));
}

function loadProfile(): UserProfile {
  const saved = localStorage.getItem('dt-profile');
  return saved ? JSON.parse(saved) : { name: '', weight: DEFAULT_WEIGHT, language: 'en', darkMode: false };
}

function mapFoodRowToItem(food: FoodRow): FoodItem {
  return {
    id: food.id,
    nameEn: food.name,
    nameAr: food.name_ar || food.name,
    category: food.category,
    categoryAr: food.category_ar || food.category,
    servingSize: food.serving_size,
    servingSizeAr: food.serving_size_ar || food.serving_size,
    potassium: food.potassium_mg,
    phosphorus: food.phosphorus_mg,
    sodium: food.sodium_mg,
    protein: food.protein_g,
  };
}

function mapFoodLogToTrackedFood(log: FoodLogRow): TrackedFood {
  return {
    id: log.id,
    foodId: log.food_id,
    servings: log.quantity,
    timestamp: log.logged_at,
    date: log.logged_at.split('T')[0],
    foodName: log.food_name,
    foodNameAr: log.food_name_ar || log.food_name,
    category: log.category,
    categoryAr: log.category_ar || log.category,
    servingSize: log.serving_size,
    servingSizeAr: log.serving_size_ar || log.serving_size,
    potassium: log.potassium_mg,
    phosphorus: log.phosphorus_mg,
    sodium: log.sodium_mg,
    protein: log.protein_g,
  };
}

function createEmptyDailyLog(date: string): DailyLog {
  return {
    date,
    trackedFoods: [],
    waterIntake: 0,
    symptoms: [],
    notes: '',
  };
}

function ensureDailyLog(acc: Record<string, DailyLog>, date: string) {
  if (!acc[date]) {
    acc[date] = createEmptyDailyLog(date);
  }
  return acc[date];
}

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<DailyLog[]>(loadLogs);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [nutrientLimits, setNutrientLimits] = useState<NutrientLimits | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const today = getToday();

  const todayLog: DailyLog = logs.find(l => l.date === today) || createEmptyDailyLog(today);

  useEffect(() => {
    let mounted = true;

    const loadFoods = async () => {
      try {
        const foodsData = await getFoods();
        if (!mounted) return;
        setFoods(foodsData.map(mapFoodRowToItem));
      } catch (error) {
        console.error('Error loading foods:', error);
      }
    };

    void loadFoods();

    return () => {
      mounted = false;
    };
  }, []);

  // Load user data on auth state change
  useEffect(() => {
    let mounted = true;

    const loadUserData = async (userId: string) => {
      try {
        const [profileData, limitsData, foodLogsData, waterLogsData, dailyNotesData, symptomLogsData] = await Promise.all([
          getProfile(userId),
          getNutrientLimits(userId),
          getFoodLogs(userId),
          getWaterLogs(userId),
          getDailyNotes(userId),
          getSymptomLogs(userId),
        ]);

        if (!mounted) return;

        if (profileData) {
          const userProfile: UserProfile = {
            name: profileData.full_name || '',
            weight: profileData.weight_kg || DEFAULT_WEIGHT,
            language: profileData.language as 'en' | 'ar' || 'en',
            darkMode: profileData.dark_mode || false,
          };
          setProfile(userProfile);
          localStorage.setItem('dt-profile', JSON.stringify(userProfile));
        }

        if (limitsData) {
          setNutrientLimits({
            potassium: limitsData.potassium_mg,
            phosphorus: limitsData.phosphorus_mg,
            sodium: limitsData.sodium_mg,
            protein: limitsData.protein_g,
          });
        }

        const dailyLogsByDate = foodLogsData.reduce((acc: Record<string, DailyLog>, log) => {
          const date = log.logged_at.split('T')[0];
          ensureDailyLog(acc, date).trackedFoods.push(mapFoodLogToTrackedFood(log));
          return acc;
        }, {});

        waterLogsData.forEach((log: WaterLogRow) => {
          ensureDailyLog(dailyLogsByDate, log.date).waterIntake += log.amount_ml;
        });

        dailyNotesData.forEach((note: DailyNoteRow) => {
          ensureDailyLog(dailyLogsByDate, note.date).notes = note.notes;
        });

        symptomLogsData.forEach((symptom: SymptomLogRow) => {
          ensureDailyLog(dailyLogsByDate, symptom.date).symptoms.push({
            id: symptom.id,
            type: symptom.symptom_type,
            severity: symptom.severity as 1 | 2 | 3,
            timestamp: symptom.logged_at,
          });
        });

        const nextLogs = Object.values(dailyLogsByDate);
        setLogs(nextLogs);
        saveLogs(nextLogs);

        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    void getCurrentUser().then(async (user) => {
      if (user && mounted) {
        await loadUserData(user.id);
      }
    });

    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        await loadUserData(user.id);
      } else {
        setIsLoggedIn(false);
        setProfile(loadProfile());
        setNutrientLimits(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [toast]);

  const updateLogs = useCallback((updater: (prev: DailyLog[]) => DailyLog[]) => {
    setLogs(prev => {
      const next = updater(prev);
      saveLogs(next);
      return next;
    });
  }, []);

  const updateTodayLog = useCallback((updater: (log: DailyLog) => DailyLog) => {
    updateLogs(prev => {
      const idx = prev.findIndex(l => l.date === today);
      const currentLog = idx >= 0 ? prev[idx] : createEmptyDailyLog(today);
      const updated = updater(currentLog);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [...prev, updated];
    });
  }, [today, updateLogs]);

  const updateProfile = useCallback(async (p: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...p };
      localStorage.setItem('dt-profile', JSON.stringify(next));
      return next;
    });

    const user = await getCurrentUser();
    if (user) {
      try {
        await updateProfileDB(user.id, {
          full_name: p.name || null,
          weight_kg: p.weight || null,
          language: p.language || 'en',
          dark_mode: p.darkMode || false,
        });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  }, []);

  const addFood = useCallback(async (foodId: string, servings: number) => {
    const food = foods.find(f => f.id === foodId);
    if (!food) return false;

    const user = await getCurrentUser();
    if (!user) {
      // Fallback to localStorage if not authenticated
      const tracked: TrackedFood = {
        id: `tf-${Date.now()}`,
        foodId,
        servings,
        timestamp: new Date().toISOString(),
        date: today,
        foodName: food.nameEn,
        foodNameAr: food.nameAr,
        category: food.category,
        categoryAr: food.categoryAr,
        servingSize: food.servingSize,
        servingSizeAr: food.servingSizeAr,
        potassium: food.potassium * servings,
        phosphorus: food.phosphorus * servings,
        sodium: food.sodium * servings,
        protein: food.protein * servings,
      };
      updateTodayLog(log => ({ ...log, trackedFoods: [...log.trackedFoods, tracked] }));
      toast({
        title: 'Success',
        description: 'Meal added successfully',
        variant: 'success',
      });
      return true;
    }

    try {
      const createdLog = await addFoodLog(user.id, {
        user_id: user.id,
        food_id: foodId,
        food_name: food.nameEn,
        food_name_ar: food.nameAr,
        category: food.category,
        category_ar: food.categoryAr,
        serving_size: food.servingSize,
        serving_size_ar: food.servingSizeAr,
        quantity: servings,
        potassium_mg: food.potassium * servings,
        phosphorus_mg: food.phosphorus * servings,
        sodium_mg: food.sodium * servings,
        protein_g: food.protein * servings,
        logged_at: new Date().toISOString(),
      });

      if (!createdLog) {
        throw new Error('Failed to create food log');
      }

      const tracked = mapFoodLogToTrackedFood(createdLog);
      updateTodayLog(log => ({ ...log, trackedFoods: [...log.trackedFoods, tracked] }));
      toast({
        title: 'Success',
        description: 'Meal added successfully',
        variant: 'success',
      });
      return true;
    } catch (error) {
      console.error('Error adding food log:', error);
      toast({
        title: 'Error',
        description: 'Failed to add food log',
        variant: 'destructive',
      });
      return false;
    }
  }, [foods, today, updateTodayLog, toast]);

  const removeFood = useCallback(async (trackedId: string) => {
    const user = await getCurrentUser();
    if (user) {
      try {
        await deleteFoodLog(trackedId);
      } catch (error) {
        console.error('Error deleting food log:', error);
      }
    }
    updateTodayLog(log => ({
      ...log,
      trackedFoods: log.trackedFoods.filter(f => f.id !== trackedId),
    }));
  }, [updateTodayLog]);

  const getTotals = useCallback((log?: DailyLog): NutrientTotals => {
    const target = log || todayLog;
    return target.trackedFoods.reduce(
      (acc, tf) => {
        const fallbackFood = foods.find(food => food.id === tf.foodId);
        return {
          potassium: acc.potassium + (tf.potassium ?? ((fallbackFood?.potassium || 0) * tf.servings)),
          phosphorus: acc.phosphorus + (tf.phosphorus ?? ((fallbackFood?.phosphorus || 0) * tf.servings)),
          sodium: acc.sodium + (tf.sodium ?? ((fallbackFood?.sodium || 0) * tf.servings)),
          protein: acc.protein + (tf.protein ?? ((fallbackFood?.protein || 0) * tf.servings)),
        };
      },
      { potassium: 0, phosphorus: 0, sodium: 0, protein: 0 }
    );
  }, [foods, todayLog]);

  const getLimits = useCallback(() => {
    if (nutrientLimits) {
      return {
        potassium: nutrientLimits.potassium,
        phosphorus: nutrientLimits.phosphorus,
        sodium: nutrientLimits.sodium,
        protein: nutrientLimits.protein,
      };
    }
    return {
      ...DEFAULT_LIMITS,
      protein: Math.round((profile.weight || DEFAULT_WEIGHT) * PROTEIN_PER_KG),
    };
  }, [nutrientLimits, profile.weight]);

  const addWater = useCallback(async (ml: number) => {
      const user = await getCurrentUser();

      if (!user) {
        updateTodayLog(log => ({ ...log, waterIntake: log.waterIntake + ml }));
        return true;
      }

      try {
        const createdLog = await addWaterLog(user.id, {
          user_id: user.id,
          date: today,
          amount_ml: ml,
          logged_at: new Date().toISOString(),
        });

        if (!createdLog) {
          throw new Error('Failed to create water log');
        }

        updateTodayLog(log => ({ ...log, waterIntake: log.waterIntake + createdLog.amount_ml }));
        return true;
      } catch (error) {
        console.error('Error adding water log:', error);
        toast({
          title: 'Error',
          description: 'Failed to add water log',
          variant: 'destructive',
        });
        return false;
      }
  }, [today, toast, updateTodayLog]);

  const addSymptom = useCallback(async (type: string, severity: 1 | 2 | 3) => {
      const user = await getCurrentUser();
      const timestamp = new Date().toISOString();

      if (!user) {
        const symptom: Symptom = { id: `s-${Date.now()}`, type, severity, timestamp };
        updateTodayLog(log => ({ ...log, symptoms: [...log.symptoms, symptom] }));
        return true;
      }

      try {
        const createdLog = await addSymptomLog(user.id, {
          user_id: user.id,
          date: today,
          symptom_type: type,
          severity,
          logged_at: timestamp,
        });

        if (!createdLog) {
          throw new Error('Failed to create symptom log');
        }

        const symptom: Symptom = {
          id: createdLog.id,
          type: createdLog.symptom_type,
          severity: createdLog.severity as 1 | 2 | 3,
          timestamp: createdLog.logged_at,
        };
        updateTodayLog(log => ({ ...log, symptoms: [...log.symptoms, symptom] }));
        return true;
      } catch (error) {
        console.error('Error adding symptom log:', error);
        toast({
          title: 'Error',
          description: 'Failed to add symptom',
          variant: 'destructive',
        });
        return false;
      }
  }, [today, toast, updateTodayLog]);

  const updateNotes = useCallback(async (notes: string) => {
      const user = await getCurrentUser();

      if (!user) {
        updateTodayLog(log => ({ ...log, notes }));
        return true;
      }

      try {
        const savedNote = await upsertDailyNote(user.id, {
          user_id: user.id,
          date: today,
          notes,
        });

        if (!savedNote) {
          throw new Error('Failed to save note');
        }

        updateTodayLog(log => ({ ...log, notes: savedNote.notes }));
        return true;
      } catch (error) {
        console.error('Error saving note:', error);
        toast({
          title: 'Error',
          description: 'Failed to save note',
          variant: 'destructive',
        });
        return false;
      }
  }, [today, toast, updateTodayLog]);

  const getAllLogs = useCallback(() => logs, [logs]);

  const getLogForDate = useCallback((date: string) => logs.find(l => l.date === date), [logs]);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    localStorage.setItem('dt-loggedin', 'true');
  }, []);

  const logout = useCallback(async () => {
    const { signOut } = await import('@/lib/supabase');
    await signOut();
    setIsLoggedIn(false);
    localStorage.removeItem('dt-loggedin');
  }, []);

  useEffect(() => {
    if (profile.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.darkMode]);

  return (
    <TrackingContext.Provider value={{
      profile, foods, updateProfile, todayLog, addFood, removeFood,
      getTotals, getLimits, addWater, addSymptom, updateNotes,
      getAllLogs, getLogForDate, isLoggedIn, login, logout, loading,
    }}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error('useTracking must be used within TrackingProvider');
  return ctx;
}
