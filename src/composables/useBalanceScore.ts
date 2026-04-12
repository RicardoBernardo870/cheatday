import { computed, type Ref, type ComputedRef } from 'vue';
import type { MealLog } from '@/lib/supabase';

export type ScoreLevel = 'great' | 'good' | 'warning';

export const useBalanceScore = (
  trackedLogs: Ref<MealLog[]> | ComputedRef<MealLog[]>,
  isCurrentMonth: ComputedRef<boolean>,
  selectedYear: Ref<number>,
  selectedMonth: Ref<number>
) => {
  /** Total days to measure against: days elapsed (current month) or full month (past). */
  const totalDays = computed(() => {
    if (isCurrentMonth.value) return new Date().getDate();
    return new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
  });

  /** Number of unique calendar dates that had at least one cheat meal. */
  const uniqueCheatDays = computed(() => {
    const dates = new Set<string>();
    for (const log of trackedLogs.value) {
      dates.add(new Date(log.logged_at).toDateString());
    }
    return dates.size;
  });

  const cleanDays = computed(() => Math.max(0, totalDays.value - uniqueCheatDays.value));

  /** Balance Score: percentage of clean days in the period (0–100). */
  const balanceScore = computed(() => {
    if (totalDays.value === 0) return 100;
    return Math.round((cleanDays.value / totalDays.value) * 100);
  });

  /** Threshold-based level for theming the gauge. */
  const scoreLevel = computed((): ScoreLevel => {
    if (balanceScore.value > 80) return 'great';
    if (balanceScore.value >= 60) return 'good';
    return 'warning';
  });

  /** Human-friendly label: "You've stayed on track for 26 out of 30 days." */
  const scoreLabel = computed(() =>
    `${cleanDays.value} of ${totalDays.value} days clean`
  );

  return { totalDays, uniqueCheatDays, cleanDays, balanceScore, scoreLevel, scoreLabel };
};
