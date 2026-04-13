import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { TrackedFood, DailyLog, NutrientTotals, Symptom, UserProfile, NutrientLimits } from '@/types';
import { DEFAULT_LIMITS, PROTEIN_PER_KG, DEFAULT_WEIGHT } from '@/constants/config';
import { foodDatabase } from '@/constants/mockData';
import { getCurrentUser, onAuthStateChange, getProfile, updateProfile as updateProfileDB, getNutrientLimits, getFoodLogs, addFoodLog, deleteFoodLog } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

interface TrackingContextType {
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
  todayLog: DailyLog;
  addFood: (foodId: string, servings: number) => void;
  removeFood: (trackedId: string) => void;
  getTotals: (log?: DailyLog) => NutrientTotals;
  getLimits: () => { potassium: number; phosphorus: number; sodium: number; protein: number };
  addWater: (ml: number) => void;
  addSymptom: (type: string, severity: 1 | 2 | 3) => void;
  updateNotes: (notes: string) => void;
  getAllLogs: () => DailyLog[];
  getLogForDate: (date: string) => DailyLog | undefined;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean;
}

const TrackingContext = createContext<TrackingContextType | null>(null);

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

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<DailyLog[]>(loadLogs);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [nutrientLimits, setNutrientLimits] = useState<NutrientLimits | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const today = getToday();

  const todayLog: DailyLog = logs.find(l => l.date === today) || {
    date: today,
    trackedFoods: [],
    waterIntake: 0,
    symptoms: [],
    notes: '',
  };

  // Load user data on auth state change
  useEffect(() => {
    let mounted = true;

    const loadUserData = async (userId: string) => {
      try {
        const [profileData, limitsData, foodLogsData] = await Promise.all([
          getProfile(userId),
          getNutrientLimits(userId),
          getFoodLogs(userId),
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

        if (foodLogsData && foodLogsData.length > 0) {
          const dailyLogs: DailyLog[] = foodLogsData.reduce((acc: { [key: string]: DailyLog }, log) => {
            const date = log.logged_at.split('T')[0];
            if (!acc[date]) {
              acc[date] = {
                date,
                trackedFoods: [],
                waterIntake: 0,
                symptoms: [],
                notes: '',
              };
            }
            acc[date].trackedFoods.push({
              id: log.id,
              foodId: log.food_id,
              servings: log.quantity,
              timestamp: log.logged_at,
              date: log.logged_at.split('T')[0],
            });
            return acc;
          }, {});
          setLogs(Object.values(dailyLogs));
          saveLogs(Object.values(dailyLogs));
        }

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
      const currentLog = idx >= 0 ? prev[idx] : { date: today, trackedFoods: [], waterIntake: 0, symptoms: [], notes: '' };
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
    const food = foodDatabase.find(f => f.id === foodId);
    if (!food) return;

    const user = await getCurrentUser();
    if (!user) {
      // Fallback to localStorage if not authenticated
      const tracked: TrackedFood = {
        id: `tf-${Date.now()}`,
        foodId,
        servings,
        timestamp: new Date().toISOString(),
        date: today,
      };
      updateTodayLog(log => ({ ...log, trackedFoods: [...log.trackedFoods, tracked] }));
      return;
    }

    try {
      await addFoodLog(user.id, {
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

      const tracked: TrackedFood = {
        id: `tf-${Date.now()}`,
        foodId,
        servings,
        timestamp: new Date().toISOString(),
        date: today,
      };
      updateTodayLog(log => ({ ...log, trackedFoods: [...log.trackedFoods, tracked] }));
    } catch (error) {
      console.error('Error adding food log:', error);
      toast({
        title: 'Error',
        description: 'Failed to add food log',
        variant: 'destructive',
      });
    }
  }, [today, updateTodayLog, toast]);

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
        const food = foodDatabase.find(f => f.id === tf.foodId);
        if (!food) return acc;
        return {
          potassium: acc.potassium + food.potassium * tf.servings,
          phosphorus: acc.phosphorus + food.phosphorus * tf.servings,
          sodium: acc.sodium + food.sodium * tf.servings,
          protein: acc.protein + food.protein * tf.servings,
        };
      },
      { potassium: 0, phosphorus: 0, sodium: 0, protein: 0 }
    );
  }, [todayLog]);

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

  const addWater = useCallback((ml: number) => {
    updateTodayLog(log => ({ ...log, waterIntake: log.waterIntake + ml }));
  }, [updateTodayLog]);

  const addSymptom = useCallback((type: string, severity: 1 | 2 | 3) => {
    const symptom: Symptom = { id: `s-${Date.now()}`, type, severity, timestamp: new Date().toISOString() };
    updateTodayLog(log => ({ ...log, symptoms: [...log.symptoms, symptom] }));
  }, [updateTodayLog]);

  const updateNotes = useCallback((notes: string) => {
    updateTodayLog(log => ({ ...log, notes }));
  }, [updateTodayLog]);

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
      profile, updateProfile, todayLog, addFood, removeFood,
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
