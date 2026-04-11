import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, type MealLog } from '@/lib/supabase'
import { useAuthStore } from './auth'
import { useOfflineSync } from '@/composables/useOfflineSync'

export const useMealsStore = defineStore('meals', () => {
  const logs = ref<MealLog[]>([])
  const loading = ref(false)

  const { queueOfflineLog, syncOfflineQueue } = useOfflineSync()

  async function fetchCurrentMonth() {
    const auth = useAuthStore()
    if (!auth.user) return

    loading.value = true
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

    try {
      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', auth.user.id)
        .gte('logged_at', start)
        .lte('logged_at', end)
        .order('logged_at', { ascending: false })

      if (!error && data) logs.value = data as MealLog[]
    } finally {
      loading.value = false
    }
  }

  async function logMeal(categoryId: string) {
    const auth = useAuthStore()
    if (!auth.user) return

    const newLog: Omit<MealLog, 'id' | 'created_at'> = {
      user_id: auth.user.id,
      category_id: categoryId,
      logged_at: new Date().toISOString()
    }

    if (!navigator.onLine) {
      const tempLog: MealLog = { ...newLog, id: `offline-${Date.now()}`, created_at: newLog.logged_at }
      logs.value.unshift(tempLog)
      await queueOfflineLog(newLog)
      return
    }

    const { data, error } = await supabase
      .from('meal_logs')
      .insert(newLog)
      .select()
      .single()

    if (error) throw error
    if (data) logs.value.unshift(data as MealLog)
  }

  async function undoLastLog(categoryId: string) {
    const lastLog = logs.value.find(l => l.category_id === categoryId)
    if (!lastLog) return

    if (lastLog.id.startsWith('offline-')) {
      logs.value = logs.value.filter(l => l.id !== lastLog.id)
      return
    }

    const { error } = await supabase
      .from('meal_logs')
      .delete()
      .eq('id', lastLog.id)

    if (error) throw error
    logs.value = logs.value.filter(l => l.id !== lastLog.id)
  }

  async function syncIfOnline() {
    if (navigator.onLine) {
      await syncOfflineQueue()
      await fetchCurrentMonth()
    }
  }

  return { logs, loading, fetchCurrentMonth, logMeal, undoLastLog, syncIfOnline }
})
