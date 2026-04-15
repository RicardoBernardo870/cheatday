import { computed, type Ref, type ComputedRef } from 'vue';
import type { MealLog } from '@/lib/supabase';

export interface StreakResult {
  /** Consecutive clean days counted backward from today (inclusive if today is clean). */
  currentStreak: number;
  /** Longest run of clean days ever observed in the log history. */
  bestStreak: number;
  /** True when the user has no tracked logs at all — show a friendly first-day state. */
  isFirstDay: boolean;
}

/** "YYYY-MM-DD" key from a local Date (ignores time of day). */
const localDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const addDays = (d: Date, delta: number): Date => {
  const next = new Date(d);
  next.setDate(next.getDate() + delta);
  next.setHours(0, 0, 0, 0);
  return next;
};

export const useStreak = (
  allTimeTrackedLogs: Ref<MealLog[]> | ComputedRef<MealLog[]>
) => {
  /** Set of local-calendar dates (YYYY-MM-DD) that contain at least one tracked cheat meal. */
  const cheatDaySet = computed(() => {
    const s = new Set<string>();
    for (const log of allTimeTrackedLogs.value) {
      s.add(localDateKey(new Date(log.logged_at)));
    }
    return s;
  });

  /** Earliest tracked cheat day, or null if none exist. */
  const earliestCheatDay = computed<Date | null>(() => {
    let min: number | null = null;
    for (const log of allTimeTrackedLogs.value) {
      const t = new Date(log.logged_at).getTime();
      if (min === null || t < min) min = t;
    }
    if (min === null) return null;
    const d = new Date(min);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const currentStreak = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const set = cheatDaySet.value;

    // If today is a cheat day, current streak is 0.
    if (set.has(localDateKey(today))) return 0;

    // Walk backward day by day while each is clean. Cap at 365 to avoid runaway loops
    // when the user has never logged anything.
    let count = 0;
    const MAX = 365;
    let cursor = today;
    while (count < MAX) {
      if (set.has(localDateKey(cursor))) break;
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  });

  const bestStreak = computed(() => {
    const earliest = earliestCheatDay.value;
    // No history at all → best streak is just the current streak (could still be 0 on day 1).
    if (!earliest) return currentStreak.value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const set = cheatDaySet.value;

    let best = 0;
    let run = 0;
    let cursor = new Date(earliest);

    // Walk forward from the first cheat day up to and including today.
    while (cursor.getTime() <= today.getTime()) {
      if (set.has(localDateKey(cursor))) {
        run = 0;
      } else {
        run += 1;
        if (run > best) best = run;
      }
      cursor = addDays(cursor, 1);
    }

    // Current streak may extend beyond any historical window (e.g. user stopped logging).
    return Math.max(best, currentStreak.value);
  });

  const isFirstDay = computed(() => allTimeTrackedLogs.value.length === 0);

  const streak = computed<StreakResult>(() => ({
    currentStreak: currentStreak.value,
    bestStreak: bestStreak.value,
    isFirstDay: isFirstDay.value,
  }));

  return { streak, currentStreak, bestStreak, isFirstDay };
};
