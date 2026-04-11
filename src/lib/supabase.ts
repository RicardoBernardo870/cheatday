import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Copy .env.example to .env and fill in your values.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export interface Profile {
  id: string
  display_name: string | null
  cheat_percentage: number
  meals_per_day: number
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  icon: string
  color: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface MealLog {
  id: string
  user_id: string
  category_id: string
  logged_at: string
  created_at: string
}

export interface MealLogWithCategory extends MealLog {
  categories: Pick<Category, 'name' | 'icon' | 'color'>
}
