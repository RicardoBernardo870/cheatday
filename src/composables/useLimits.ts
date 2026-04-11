import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMealsStore } from '@/stores/meals'

export type WarningLevel = 'green' | 'yellow' | 'orange' | 'red'

export function useLimits() {
  const auth = useAuthStore()
  const meals = useMealsStore()

  const monthlyLimit = computed(() => {
    if (!auth.profile) return 0
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    return Math.round(auth.profile.meals_per_day * daysInMonth * (auth.profile.cheat_percentage / 100))
  })

  const weeklyLimit = computed(() => Math.round(monthlyLimit.value / 4.33))
  const dailySoftLimit = computed(() => Math.max(1, Math.round(weeklyLimit.value / 7)))

  const monthlyCount = computed(() => {
    const now = new Date()
    return meals.logs.filter(log => {
      const d = new Date(log.logged_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  })

  const weeklyCount = computed(() => {
    const now = new Date()
    const day = now.getDay() || 7
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - day + 1)
    startOfWeek.setHours(0, 0, 0, 0)
    return meals.logs.filter(log => new Date(log.logged_at) >= startOfWeek).length
  })

  const todayCount = computed(() => {
    const now = new Date()
    return meals.logs.filter(log => new Date(log.logged_at).toDateString() === now.toDateString()).length
  })

  function countForCategory(categoryId: string, period: 'today' | 'week' | 'month' = 'month') {
    const now = new Date()
    return meals.logs.filter(log => {
      if (log.category_id !== categoryId) return false
      const d = new Date(log.logged_at)
      if (period === 'today') return d.toDateString() === now.toDateString()
      if (period === 'week') {
        const day = now.getDay() || 7
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - day + 1)
        startOfWeek.setHours(0, 0, 0, 0)
        return d >= startOfWeek
      }
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }

  function warningLevel(used: number, limit: number): WarningLevel {
    if (limit === 0) return 'green'
    const pct = used / limit
    if (pct >= 1) return 'red'
    if (pct >= 0.85) return 'orange'
    if (pct >= 0.6) return 'yellow'
    return 'green'
  }

  const monthlyWarning = computed(() => warningLevel(monthlyCount.value, monthlyLimit.value))
  const weeklyWarning  = computed(() => warningLevel(weeklyCount.value,  weeklyLimit.value))
  const dailyWarning   = computed(() => warningLevel(todayCount.value,   dailySoftLimit.value))

  const activeWarning = computed((): WarningLevel => {
    const levels: WarningLevel[] = ['red', 'orange', 'yellow', 'green']
    for (const level of levels) {
      if (monthlyWarning.value === level || weeklyWarning.value === level || dailyWarning.value === level) return level
    }
    return 'green'
  })

  const warningMessage = computed(() => {
    if (monthlyCount.value >= monthlyLimit.value) return `You've hit your monthly limit of ${monthlyLimit.value} cheat meals.`
    if (weeklyCount.value >= weeklyLimit.value) return `Weekly limit reached (${weeklyLimit.value}). ${monthlyLimit.value - monthlyCount.value} left this month.`
    if (monthlyWarning.value === 'orange') return `${monthlyLimit.value - monthlyCount.value} cheat meals left this month — almost there.`
    if (weeklyWarning.value === 'yellow') return `${weeklyLimit.value - weeklyCount.value} left this week.`
    return null
  })

  const monthlyProgress = computed(() => Math.min(1, monthlyCount.value / Math.max(1, monthlyLimit.value)))
  const weeklyProgress  = computed(() => Math.min(1, weeklyCount.value  / Math.max(1, weeklyLimit.value)))

  return {
    monthlyLimit, weeklyLimit, dailySoftLimit,
    monthlyCount, weeklyCount, todayCount, countForCategory,
    monthlyWarning, weeklyWarning, dailyWarning, activeWarning, warningMessage,
    monthlyProgress, weeklyProgress
  }
}
