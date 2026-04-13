
import { supabase, isSupabaseConfigured } from './client';
import type { Database } from './types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type NutrientLimits = Database['public']['Tables']['nutrient_limits']['Row'];
type FoodLog = Database['public']['Tables']['food_logs']['Row'];
type Food = Database['public']['Tables']['foods']['Row'];
type Reminder = Database['public']['Tables']['reminders']['Row'];

// Profile Operations
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile['Insert']>): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

export async function createProfile(userId: string, profile: Profile['Insert']): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }

  return data;
}

// Nutrient Limits Operations
export async function getNutrientLimits(userId: string): Promise<NutrientLimits | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('nutrient_limits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching nutrient limits:', error);
    return null;
  }

  return data;
}

export async function updateNutrientLimits(userId: string, limits: Partial<NutrientLimits['Insert']>): Promise<NutrientLimits | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('nutrient_limits')
    .upsert({
      user_id: userId,
      ...limits,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating nutrient limits:', error);
    return null;
  }

  return data;
}

// Food Logs Operations
export async function getFoodLogs(userId: string, startDate?: string, endDate?: string): Promise<FoodLog[]> {
  if (!isSupabaseConfigured()) return [];

  let query = supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false });

  if (startDate) {
    query = query.gte('logged_at', startDate);
  }

  if (endDate) {
    query = query.lte('logged_at', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching food logs:', error);
    return [];
  }

  return data || [];
}

export async function addFoodLog(userId: string, log: FoodLog['Insert']): Promise<FoodLog | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('food_logs')
    .insert(log)
    .select()
    .single();

  if (error) {
    console.error('Error adding food log:', error);
    return null;
  }

  return data;
}

export async function deleteFoodLog(logId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', logId);

  if (error) {
    console.error('Error deleting food log:', error);
    return false;
  }

  return true;
}

// Foods Operations
export async function getFoods(category?: string): Promise<Food[]> {
  if (!isSupabaseConfigured()) return [];

  let query = supabase
    .from('foods')
    .select('*')
    .order('name', { ascending: true });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching foods:', error);
    return [];
  }

  return data || [];
}

export async function searchFoods(query: string): Promise<Food[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .or(`name.ilike.%${query}%,name_ar.ilike.%${query}%`)
    .order('name', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error searching foods:', error);
    return [];
  }

  return data || [];
}

// Reminders Operations
export async function getReminders(userId: string): Promise<Reminder[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('reminder_time', { ascending: true });

  if (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }

  return data || [];
}

export async function addReminder(userId: string, reminder: Reminder['Insert']): Promise<Reminder | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('reminders')
    .insert({ ...reminder, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error('Error adding reminder:', error);
    return null;
  }

  return data;
}

export async function updateReminder(reminderId: string, updates: Partial<Reminder['Update']>): Promise<Reminder | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('reminders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', reminderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating reminder:', error);
    return null;
  }

  return data;
}

export async function deleteReminder(reminderId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', reminderId);

  if (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }

  return true;
}
