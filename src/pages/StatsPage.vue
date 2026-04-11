<script setup lang="ts">
import { computed } from 'vue';
import { useMealsStore } from '@/stores/meals';
import { useCategoriesStore } from '@/stores/categories';
import { useLimits } from '@/composables/useLimits';

import StatsOverviewCards from '@/components/StatsOverviewCards.vue';
import CategoryBreakdownItem from '@/components/CategoryBreakdownItem.vue';

const meals = useMealsStore();
const categories = useCategoriesStore();
const limits = useLimits();

const monthName = new Date().toLocaleString('default', { month: 'long' });

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

      <div v-if="categoryBreakdown.length === 0" class="text-center py-8 text-muted">
        <p class="text-4xl mb-2">✨</p>
        <p class="text-sm">No cheat meals logged yet this month</p>
      </div>
    </div>

    <p class="text-center text-xs text-muted">Calendar heatmap & weekly trend coming soon</p>
  </div>
</template>
