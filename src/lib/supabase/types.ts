
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          weight_kg: number | null;
          language: string;
          dark_mode: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          weight_kg?: number | null;
          language?: string;
          dark_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          weight_kg?: number | null;
          language?: string;
          dark_mode?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      nutrient_limits: {
        Row: {
          id: string;
          user_id: string;
          potassium_mg: number;
          phosphorus_mg: number;
          sodium_mg: number;
          protein_g: number;
          water_ml: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          potassium_mg: number;
          phosphorus_mg: number;
          sodium_mg: number;
          protein_g: number;
          water_ml?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          potassium_mg?: number;
          phosphorus_mg?: number;
          sodium_mg?: number;
          protein_g?: number;
          water_ml?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          name: string;
          name_ar: string | null;
          category: string;
          category_ar: string | null;
          serving_size: string;
          serving_size_ar: string | null;
          potassium_mg: number;
          phosphorus_mg: number;
          sodium_mg: number;
          protein_g: number;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_ar?: string | null;
          category: string;
          category_ar?: string | null;
          serving_size: string;
          serving_size_ar?: string | null;
          potassium_mg: number;
          phosphorus_mg: number;
          sodium_mg: number;
          protein_g: number;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_ar?: string | null;
          category?: string;
          category_ar?: string | null;
          serving_size?: string;
          serving_size_ar?: string | null;
          potassium_mg?: number;
          phosphorus_mg?: number;
          sodium_mg?: number;
          protein_g?: number;
          is_default?: boolean;
          created_at?: string;
        };
      };
      food_logs: {
        Row: {
          id: string;
          user_id: string;
          food_id: string;
          food_name: string;
          food_name_ar: string | null;
          category: string;
          category_ar: string | null;
          serving_size: string;
          serving_size_ar: string | null;
          quantity: number;
          potassium_mg: number;
          phosphorus_mg: number;
          sodium_mg: number;
          protein_g: number;
          meal_type: string | null;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_id: string;
          food_name: string;
          food_name_ar?: string | null;
          category: string;
          category_ar?: string | null;
          serving_size: string;
          serving_size_ar?: string | null;
          quantity: number;
          potassium_mg: number;
          phosphorus_mg: number;
          sodium_mg: number;
          protein_g: number;
          meal_type?: string | null;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_id?: string;
          food_name?: string;
          food_name_ar?: string | null;
          category?: string;
          category_ar?: string | null;
          serving_size?: string;
          serving_size_ar?: string | null;
          quantity?: number;
          potassium_mg?: number;
          phosphorus_mg?: number;
          sodium_mg?: number;
          protein_g?: number;
          meal_type?: string | null;
          logged_at?: string;
          created_at?: string;
        };
      };
      water_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          amount_ml: number;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          amount_ml: number;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          amount_ml?: number;
          logged_at?: string;
          created_at?: string;
        };
      };
      daily_notes: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          notes: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      symptom_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          symptom_type: string;
          severity: number;
          logged_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          symptom_type: string;
          severity: number;
          logged_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          symptom_type?: string;
          severity?: number;
          logged_at?: string;
          created_at?: string;
        };
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          title_ar: string | null;
          type: string;
          reminder_time: string;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          title_ar?: string | null;
          type: string;
          reminder_time: string;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          title_ar?: string | null;
          type?: string;
          reminder_time?: string;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
