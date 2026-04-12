import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';
import { useMealsStore } from '@/stores/meals';
import { useCategoriesStore } from '@/stores/categories';
import type { MealLog } from '@/lib/supabase';

export interface MomResult {
  currentCount: number;
  previousCount: number;
  delta: number;
  percentChange: number | null; // null when previous is 0
  isFirstMonth: boolean;
  previousMonthName: string;
}

export const useMomComparison = (
  trackedLogs: Ref<MealLog[]> | ComputedRef<MealLog[]>,
  selectedYear: Ref<number>,
  selectedMonth: Ref<number>
) => {
  const meals = useMealsStore();
  const categories = useCategoriesStore();

  const previousMonthLogs = ref<MealLog[]>([]);
  const loading = ref(false);

  const freePassIds = computed(
    () => new Set(categories.categories.filter((c) => c.free_pass).map((c) => c.id))
  );

  const previousMonthName = computed(() => {
    let prevMonth = selectedMonth.value - 1;
    let prevYear = selectedYear.value;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    return new Date(prevYear, prevMonth).toLocaleString('default', { month: 'long' });
  });

  const loadPreviousMonth = async () => {
    let prevMonth = selectedMonth.value - 1;
    let prevYear = selectedYear.value;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    loading.value = true;
    const logs = await meals.fetchByMonth(prevYear, prevMonth);
    previousMonthLogs.value = logs.filter((l) => !freePassIds.value.has(l.category_id));
    loading.value = false;
  };

  // Reload when the viewed month changes
  watch(
    [selectedYear, selectedMonth],
    () => loadPreviousMonth(),
    { immediate: true }
  );

  const mom = computed<MomResult>(() => {
    const currentCount = trackedLogs.value.length;
    const previousCount = previousMonthLogs.value.length;
    const delta = currentCount - previousCount;
    const isFirstMonth = previousCount === 0 && currentCount === 0;
    const percentChange =
      previousCount === 0 ? null : Math.round((delta / previousCount) * 100);

    return {
      currentCount,
      previousCount,
      delta,
      percentChange,
      isFirstMonth,
      previousMonthName: previousMonthName.value,
    };
  });

  return { mom, loading };
};
