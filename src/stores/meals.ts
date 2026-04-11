import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase, type MealLog } from '@/lib/supabase';
import { useAuthStore } from './auth';
import { useOfflineSync } from '@/composables/useOfflineSync';

export const useMealsStore = defineStore('meals', () => {
  const logs = ref<MealLog[]>([]);
  const loading = ref(false);

  const { queueOfflineLog, syncOfflineQueue } = useOfflineSync();

  const fetchCurrentMonth = async () => {
    const auth = useAuthStore();
    if (!auth.user) return;

    loading.value = true;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    try {
      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', auth.user.id)
        .gte('logged_at', start)
        .lte('logged_at', end)
        .order('logged_at', { ascending: false });

      if (!error && data) logs.value = data as MealLog[];
    } finally {
      loading.value = false;
    }
  };

  const fetchByMonth = async (year: number, month: number): Promise<MealLog[]> => {
    const auth = useAuthStore();
    if (!auth.user) return [];

    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

    const { data, error } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', auth.user.id)
      .gte('logged_at', start)
      .lte('logged_at', end)
      .order('logged_at', { ascending: false });

    if (error || !data) return [];
    return data as MealLog[];
  };

  const fetchAllTime = async (): Promise<MealLog[]> => {
    const auth = useAuthStore();
    if (!auth.user) return [];

    const { data, error } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('logged_at', { ascending: true });

    if (error || !data) return [];
    return data as MealLog[];
  };

  const fetchByYear = async (year: number): Promise<MealLog[]> => {
    const auth = useAuthStore();
    if (!auth.user) return [];

    const start = new Date(year, 0, 1).toISOString();
    const end = new Date(year, 11, 31, 23, 59, 59).toISOString();

    const { data, error } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', auth.user.id)
      .gte('logged_at', start)
      .lte('logged_at', end)
      .order('logged_at', { ascending: false });

    if (error || !data) return [];
    return data as MealLog[];
  };

  const logMeal = async (categoryId: string, date?: Date) => {
    const auth = useAuthStore();
    if (!auth.user) return;

    const now = new Date();
    const logDate = date ?? now;

    // Combine selected date with current time for chronological ordering within the day
    const loggedAt = new Date(
      logDate.getFullYear(),
      logDate.getMonth(),
      logDate.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    ).toISOString();

    const isCurrentMonth =
      logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();

    const newLog: Omit<MealLog, 'id' | 'created_at'> = {
      user_id: auth.user.id,
      category_id: categoryId,
      logged_at: loggedAt,
    };

    if (!navigator.onLine) {
      const tempLog: MealLog = {
        ...newLog,
        id: `offline-${Date.now()}`,
        created_at: loggedAt,
      };
      if (isCurrentMonth) logs.value.unshift(tempLog);
      await queueOfflineLog(newLog);
      return;
    }

    const { data, error } = await supabase.from('meal_logs').insert(newLog).select().single();
    if (error) throw error;
    if (data && isCurrentMonth) logs.value.unshift(data as MealLog);
  };

  const undoLastLog = async (categoryId: string) => {
    const lastLog = logs.value.find((l) => l.category_id === categoryId);
    if (!lastLog) return;

    if (lastLog.id.startsWith('offline-')) {
      logs.value = logs.value.filter((l) => l.id !== lastLog.id);
      return;
    }

    const { error } = await supabase.from('meal_logs').delete().eq('id', lastLog.id);
    if (error) throw error;
    logs.value = logs.value.filter((l) => l.id !== lastLog.id);
  };

  const syncIfOnline = async () => {
    if (navigator.onLine) {
      await syncOfflineQueue();
      await fetchCurrentMonth();
    }
  };

  return {
    logs,
    loading,
    fetchCurrentMonth,
    fetchByMonth,
    fetchByYear,
    fetchAllTime,
    logMeal,
    undoLastLog,
    syncIfOnline,
  };
});
