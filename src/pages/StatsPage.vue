<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMealsStore } from '@/stores/meals';
import { useCategoriesStore } from '@/stores/categories';
import { useStatsStore } from '@/stores/stats';
import { useLimits } from '@/composables/useLimits';
import { useMonthNavigation } from '@/composables/useMonthNavigation';
import { useStatsData } from '@/composables/useStatsData';
import { useCheatInsights } from '@/composables/useCheatInsights';

import MonthNavigator from '@/components/MonthNavigator.vue';
import StatsOverviewCards from '@/components/StatsOverviewCards.vue';
import InsightCard from '@/components/InsightCard.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';
import CheatCalendar from '@/components/CheatCalendar.vue';
import CategoryDonut from '@/components/CategoryDonut.vue';
import WeeklyTrendBar from '@/components/WeeklyTrendBar.vue';
import YearlyTrendBar from '@/components/YearlyTrendBar.vue';
import PastMealModal from '@/components/PastMealModal.vue';

const meals = useMealsStore();
const categories = useCategoriesStore();
const stats = useStatsStore();
const { allTimeTrackedLogs } = storeToRefs(stats);
const limits = useLimits();

const {
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
} = useMonthNavigation();

// ── Past meal modal ────────────────────────────────────────────────────────
const showPastMealModal = ref(false);
const pastMealDate = ref<Date>();

const onDaySelected = (date: Date | null) => {
  if (!date) return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);
  if (selected > today) return;
  pastMealDate.value = date;
  showPastMealModal.value = true;
};

const onPastMealLogged = async (date: Date) => {
  stats.invalidate(date.getFullYear());
  await Promise.all([loadMonth(), stats.fetchYearly(selectedYear.value), stats.fetchAllTime()]);
};

const { trackedLogs, trackedCount, categoryDonutData, freePassData, weeklyBarData } =
  useStatsData(displayLogs, selectedYear, selectedMonth);

const { dangerZone, burnRateForecast } = useCheatInsights(
  trackedLogs,
  isCurrentMonth,
  limits.monthlyLimit,
  allTimeTrackedLogs
);

// ── Yearly chart ────────────────────────────────────────────────────────────
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const yearlyCounts = computed(() => stats.getYearlyCounts(selectedYear.value));

const currentMonthIndex = computed(() => {
  const now = new Date();
  return selectedYear.value === now.getFullYear() ? now.getMonth() : undefined;
});

// Reload yearly data when the selected year changes
watch(selectedYear, (year) => stats.fetchYearly(year), { immediate: true });

const isLoading = computed(() => categories.loading || meals.loading || statsLoading.value);

onMounted(() => {
  Promise.all([
    meals.fetchCurrentMonth(),
    stats.fetchAllTime(),
  ]);
});
</script>

<template>
  <div class="px-4 py-6 space-y-6">
    <!-- Month navigation -->
    <MonthNavigator
      :month-label="monthLabel"
      :is-current-month="isCurrentMonth"
      @prev="prevMonth"
      @next="nextMonth"
      @reset="resetToCurrentMonth"
    />

    <!-- Loading skeleton -->
    <template v-if="isLoading">
      <div class="grid grid-cols-3 gap-3">
        <SkeletonCard v-for="n in 3" :key="n" class="h-20" />
      </div>
      <SkeletonCard class="h-52" />
      <SkeletonCard class="h-40" />
    </template>

    <template v-else>
      <!-- Overview cards -->
      <StatsOverviewCards
        :logged="trackedCount"
        :limit="limits.monthlyLimit.value"
        :remaining="Math.max(0, limits.monthlyLimit.value - trackedCount)"
      />

      <!-- Burn rate forecast -->
      <InsightCard
        v-if="burnRateForecast"
        :icon="burnRateForecast.isOverLimit ? '⚠️' : '📈'"
        :title="burnRateForecast.isOverLimit ? 'On track to exceed limit' : 'Pace looks good'"
        :subtitle="`At ${burnRateForecast.rate} meals/week you'll hit ~${burnRateForecast.projected} this month (limit ${burnRateForecast.limit})`"
        :variant="burnRateForecast.isOverLimit ? 'warning' : 'default'"
      />

      <!-- Heatmap -->
      <div class="glass-card rounded-2xl p-4 space-y-3">
        <h2 class="text-sm text-muted uppercase tracking-wider">Daily heatmap</h2>
        <CheatCalendar
          :logs="trackedLogs"
          :month="selectedMonth"
          :year="selectedYear"
          @day-selected="onDaySelected"
        />
      </div>

      <!-- Danger zone insight -->
      <InsightCard
        v-if="dangerZone"
        icon="🔥"
        :title="`${dangerZone.day} is your danger zone`"
        :subtitle="`${dangerZone.count} meals logged on that day this month`"
      />

      <!-- Category donut -->
      <div class="glass-card rounded-2xl p-4 space-y-3">
        <h2 class="text-sm text-muted uppercase tracking-wider">By category</h2>
        <CategoryDonut :data="categoryDonutData" />
      </div>

      <!-- Weekly trend bar -->
      <div class="glass-card rounded-2xl p-4 space-y-3">
        <h2 class="text-sm text-muted uppercase tracking-wider">Weekly trend</h2>
        <WeeklyTrendBar
          :labels="weeklyBarData.labels"
          :counts="weeklyBarData.counts"
          :weekly-limit="limits.weeklyLimit.value"
        />
      </div>

      <!-- Yearly trend bar -->
      <div class="glass-card rounded-2xl p-4 space-y-3">
        <h2 class="text-sm text-muted uppercase tracking-wider">
          {{ selectedYear }} overview
        </h2>
        <template v-if="stats.yearlyLoading">
          <SkeletonCard class="h-44" />
        </template>
        <YearlyTrendBar
          v-else
          :labels="MONTH_LABELS"
          :counts="yearlyCounts"
          :monthly-limit="limits.monthlyLimit.value"
          :current-month-index="currentMonthIndex"
        />
      </div>

      <!-- Free pass treats -->
      <div v-if="freePassData.length > 0" class="space-y-3">
        <div class="flex items-center gap-2">
          <h2 class="text-sm text-muted uppercase tracking-wider">Free pass treats</h2>
          <span class="text-xs glass-card rounded-full px-2 py-0.5 text-muted">doesn't count</span>
        </div>
        <div class="glass-card rounded-2xl p-4 space-y-3">
          <div
            v-for="cat in freePassData"
            :key="cat.name"
            class="flex items-center gap-3 text-sm"
          >
            <span class="text-xl">{{ cat.icon }}</span>
            <span class="flex-1 font-medium">{{ cat.name }}</span>
            <span class="font-bold" :style="{ color: cat.color }">{{ cat.count }}</span>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="trackedCount === 0 && freePassData.length === 0"
        class="text-center py-8 space-y-3"
      >
        <p class="text-5xl">✨</p>
        <h2 class="font-semibold">Clean slate</h2>
        <p class="text-sm text-muted">No cheat meals logged for {{ monthLabel }}.</p>
      </div>

      <p class="text-center text-xs text-muted pb-2">
        Tap calendar days to log a past meal
      </p>
    </template>

    <PastMealModal
      v-model:visible="showPastMealModal"
      :initial-date="pastMealDate"
      @logged="onPastMealLogged"
    />
  </div>
</template>
