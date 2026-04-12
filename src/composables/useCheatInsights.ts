import { computed, type Ref, type ComputedRef } from 'vue';
import type { MealLog } from '@/lib/supabase';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const useCheatInsights = (
  trackedLogs: Ref<MealLog[]> | ComputedRef<MealLog[]>,
  isCurrentMonth: ComputedRef<boolean>,
  monthlyLimit: ComputedRef<number>,
  allTimeTrackedLogs: Ref<MealLog[]>
) => {
  const dangerZone = computed(() => {
    const logs = allTimeTrackedLogs.value;
    if (logs.length < 3) return null;
    const dayCounts = Array(7).fill(0) as number[];
    for (const log of logs) {
      dayCounts[new Date(log.logged_at).getDay()]++;
    }
    const max = Math.max(...dayCounts);
    if (max === 0) return null;
    return { day: DAY_NAMES[dayCounts.indexOf(max)], count: max };
  });

  const burnRateForecast = computed(() => {
    if (!isCurrentMonth.value || trackedLogs.value.length === 0) return null;

    const logs = allTimeTrackedLogs.value;
    const limit = monthlyLimit.value;

    if (logs.length < 2) {
      // Not enough history — fall back to current month pace
      const now = new Date();
      const weeksElapsed = now.getDate() / 7;
      const rate = trackedLogs.value.length / weeksElapsed;
      const projected = Math.round(rate * 4.33);
      return { projected, limit, isOverLimit: projected > limit, rate: rate.toFixed(1) };
    }

    // Use full history: total meals / total weeks since first log
    const firstLogDate = new Date(logs[0].logged_at);
    const msElapsed = Date.now() - firstLogDate.getTime();
    const weeksElapsed = msElapsed / (1000 * 60 * 60 * 24 * 7);
    const rate = logs.length / weeksElapsed;
    const projected = Math.round(rate * 4.33);

    return { projected, limit, isOverLimit: projected > limit, rate: rate.toFixed(1) };
  });

  return { dangerZone, burnRateForecast };
};
