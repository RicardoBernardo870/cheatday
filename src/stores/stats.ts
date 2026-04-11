import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useMealsStore } from './meals';
import { useCategoriesStore } from './categories';
import type { MealLog } from '@/lib/supabase';

export const useStatsStore = defineStore('stats', () => {
  const meals = useMealsStore();
  const categories = useCategoriesStore();

  // ── Free-pass filter (shared) ─────────────────────────────────────────────
  const freePassIds = computed(
    () => new Set(categories.categories.filter((c) => c.free_pass).map((c) => c.id))
  );

  // ── All-time tracked logs ─────────────────────────────────────────────────
  const allTimeTrackedLogs = ref<MealLog[]>([]);
  const allTimeLoaded = ref(false);
  const allTimeLoading = ref(false);

  const fetchAllTime = async () => {
    if (allTimeLoaded.value) return;
    allTimeLoading.value = true;
    const logs = await meals.fetchAllTime();
    allTimeTrackedLogs.value = logs.filter((l) => !freePassIds.value.has(l.category_id));
    allTimeLoaded.value = true;
    allTimeLoading.value = false;
  };

  // ── Yearly data (cached per year) ────────────────────────────────────────
  const yearlyCache = ref<Record<number, number[]>>({});
  const yearlyLoading = ref(false);

  const fetchYearly = async (year: number) => {
    if (yearlyCache.value[year]) return;
    yearlyLoading.value = true;
    const logs = await meals.fetchByYear(year);
    const counts = Array(12).fill(0) as number[];
    for (const log of logs) {
      if (freePassIds.value.has(log.category_id)) continue;
      counts[new Date(log.logged_at).getMonth()]++;
    }
    yearlyCache.value = { ...yearlyCache.value, [year]: counts };
    yearlyLoading.value = false;
  };

  const getYearlyCounts = (year: number): number[] =>
    yearlyCache.value[year] ?? Array(12).fill(0);

  // ── Invalidation on meal changes ─────────────────────────────────────────
  watch(
    () => meals.logs.length,
    () => {
      allTimeLoaded.value = false;
      // Invalidate current year cache (the one that likely changed)
      const currentYear = new Date().getFullYear();
      const { [currentYear]: _, ...rest } = yearlyCache.value;
      yearlyCache.value = rest;
    }
  );

  return {
    freePassIds,
    allTimeTrackedLogs,
    allTimeLoading,
    yearlyLoading,
    fetchAllTime,
    fetchYearly,
    getYearlyCounts,
  };
});
