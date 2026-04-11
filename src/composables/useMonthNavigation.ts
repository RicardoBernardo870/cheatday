import { ref, computed, watch } from 'vue';
import { useMealsStore } from '@/stores/meals';
import type { MealLog } from '@/lib/supabase';

export const useMonthNavigation = () => {
  const meals = useMealsStore();
  const now = new Date();

  const selectedMonth = ref(now.getMonth());
  const selectedYear = ref(now.getFullYear());
  const displayLogs = ref<MealLog[]>([]);
  const statsLoading = ref(false);

  const isCurrentMonth = computed(
    () => selectedYear.value === now.getFullYear() && selectedMonth.value === now.getMonth()
  );

  const monthLabel = computed(() =>
    new Date(selectedYear.value, selectedMonth.value).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    })
  );

  const loadMonth = async () => {
    if (isCurrentMonth.value) {
      displayLogs.value = meals.logs;
      return;
    }
    statsLoading.value = true;
    displayLogs.value = await meals.fetchByMonth(selectedYear.value, selectedMonth.value);
    statsLoading.value = false;
  };

  const prevMonth = () => {
    if (selectedMonth.value === 0) {
      selectedMonth.value = 11;
      selectedYear.value--;
    } else {
      selectedMonth.value--;
    }
    loadMonth();
  };

  const nextMonth = () => {
    if (isCurrentMonth.value) return;
    if (selectedMonth.value === 11) {
      selectedMonth.value = 0;
      selectedYear.value++;
    } else {
      selectedMonth.value++;
    }
    loadMonth();
  };

  const resetToCurrentMonth = () => {
    selectedMonth.value = now.getMonth();
    selectedYear.value = now.getFullYear();
    loadMonth();
  };

  // Keep current-month logs in sync when user logs a meal
  watch(
    () => meals.logs,
    (newLogs) => {
      if (isCurrentMonth.value) displayLogs.value = newLogs;
    },
    { immediate: true }
  );

  return {
    selectedMonth,
    selectedYear,
    displayLogs,
    statsLoading,
    isCurrentMonth,
    monthLabel,
    loadMonth,
    prevMonth,
    nextMonth,
    resetToCurrentMonth,
  };
};
