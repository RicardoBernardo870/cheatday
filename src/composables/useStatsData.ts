import { computed, type Ref } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import type { MealLog } from '@/lib/supabase';

export const useStatsData = (
  displayLogs: Ref<MealLog[]>,
  selectedYear: Ref<number>,
  selectedMonth: Ref<number>
) => {
  const categories = useCategoriesStore();

  const freePassIds = computed(
    () => new Set(categories.categories.filter((c) => c.free_pass).map((c) => c.id))
  );

  const trackedLogs = computed(() =>
    displayLogs.value.filter((l) => !freePassIds.value.has(l.category_id))
  );

  const trackedCount = computed(() => trackedLogs.value.length);

  const categoryDonutData = computed(() =>
    categories.categories
      .filter((c) => !c.free_pass)
      .map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        count: trackedLogs.value.filter((l) => l.category_id === cat.id).length,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
  );

  const freePassData = computed(() =>
    categories.categories
      .filter((c) => c.free_pass)
      .map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        count: displayLogs.value.filter((l) => l.category_id === cat.id).length,
      }))
      .filter((c) => c.count > 0)
  );

  const weeklyBarData = computed(() => {
    const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
    const numWeeks = Math.ceil(daysInMonth / 7);
    const counts = Array(numWeeks).fill(0) as number[];

    for (const log of trackedLogs.value) {
      const day = new Date(log.logged_at).getDate();
      const idx = Math.floor((day - 1) / 7);
      if (idx < numWeeks) counts[idx]++;
    }

    return {
      labels: Array.from({ length: numWeeks }, (_, i) => `W${i + 1}`),
      counts,
    };
  });

  return {
    freePassIds,
    trackedLogs,
    trackedCount,
    categoryDonutData,
    freePassData,
    weeklyBarData,
  };
};
