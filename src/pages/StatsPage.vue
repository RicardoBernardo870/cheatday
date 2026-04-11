<script setup lang="ts">
import { computed } from 'vue';
import { useMealsStore } from '@/stores/meals';
import { useCategoriesStore } from '@/stores/categories';
import { useLimits } from '@/composables/useLimits';

import StatsOverviewCards from '@/components/StatsOverviewCards.vue';
import CategoryBreakdownItem from '@/components/CategoryBreakdownItem.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';

const meals = useMealsStore();
const categories = useCategoriesStore();
const limits = useLimits();

const monthName = new Date().toLocaleString('default', { month: 'long' });

const isLoading = computed(() => categories.loading || meals.loading);

const categoryBreakdown = computed(() => {
  return categories.categories
    .map((cat) => ({
      ...cat,
      count: limits.countForCategory(cat.id, 'month'),
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
});
</script>

<template>
  <div class="px-4 py-6 space-y-6">
    <h1 class="text-xl font-bold">{{ monthName }}</h1>

    <!-- Loading skeleton -->
    <template v-if="isLoading">
      <div class="grid grid-cols-3 gap-3">
        <SkeletonCard v-for="n in 3" :key="n" class="h-20" />
      </div>
      <div class="space-y-3">
        <div class="h-4 w-24 glass-card rounded animate-pulse" />
        <SkeletonCard v-for="n in 3" :key="n" class="h-14" />
      </div>
    </template>

    <template v-else>
      <StatsOverviewCards
        :logged="limits.monthlyCount.value"
        :limit="limits.monthlyLimit.value"
        :remaining="Math.max(0, limits.monthlyLimit.value - limits.monthlyCount.value)"
      />

      <div class="space-y-3">
        <h2 class="text-sm text-muted uppercase tracking-wider">By category</h2>

        <CategoryBreakdownItem
          v-for="cat in categoryBreakdown"
          :key="cat.id"
          :icon="cat.icon"
          :name="cat.name"
          :color="cat.color"
          :count="cat.count"
          :totalCount="limits.monthlyCount.value"
        />

        <div v-if="categoryBreakdown.length === 0" class="text-center py-12 space-y-3">
          <p class="text-5xl">✨</p>
          <h2 class="font-semibold">Clean slate this month</h2>
          <p class="text-sm text-muted">
            No cheat meals logged yet — tap the Log tab to start tracking.
          </p>
        </div>
      </div>

      <p class="text-center text-xs text-muted">Calendar heatmap & weekly trend coming soon</p>
    </template>
  </div>
</template>
