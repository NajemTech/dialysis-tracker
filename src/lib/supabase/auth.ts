
import { supabase, isSupabaseConfigured } from './client';
import type { AuthError, User } from '@supabase/supabase-js';

export async function signIn(email: string, password: string): Promise<{ data: User | null; error: AuthError | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } as AuthError };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data: data.user, error };
}

export async function signUp(email: string, password: string, name?: string): Promise<{ data: User | null; error: AuthError | null }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: { message: 'Supabase not configured' } as AuthError };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  return { data: data.user, error };
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  if (!isSupabaseConfigured()) {
    return { error: { message: 'Supabase not configured' } as AuthError };
  }

  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!isSupabaseConfigured()) {
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}
