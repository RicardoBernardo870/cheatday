<script setup lang="ts">
import { computed } from 'vue';
import { useMealsStore } from '@/stores/meals';
import { useCategoriesStore } from '@/stores/categories';
import { useLimits } from '@/composables/useLimits';

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

    <div class="grid grid-cols-3 gap-3">
      <div class="bg-card rounded-2xl p-4 text-center glass">
        <p class="text-2xl font-bold text-primary">
          {{ limits.monthlyCount.value }}
        </p>
        <p class="text-xs text-muted mt-1">logged</p>
      </div>
      <div class="bg-card rounded-2xl p-4 text-center glass">
        <p class="text-2xl font-bold">{{ limits.monthlyLimit.value }}</p>
        <p class="text-xs text-muted mt-1">limit</p>
      </div>
      <div class="bg-card rounded-2xl p-4 text-center glass">
        <p class="text-2xl font-bold text-green-400">
          {{ Math.max(0, limits.monthlyLimit.value - limits.monthlyCount.value) }}
        </p>
        <p class="text-xs text-muted mt-1">remaining</p>
      </div>
    </div>

    <div class="space-y-3">
      <h2 class="text-sm text-muted uppercase tracking-wider">By category</h2>
      <div
        v-for="cat in categoryBreakdown"
        :key="cat.id"
        class="bg-card rounded-xl px-4 py-3 flex items-center gap-3 glass"
      >
        <span class="text-2xl">{{ cat.icon }}</span>
        <div class="flex-1">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium">{{ cat.name }}</span>
            <span class="text-sm font-bold" :style="{ color: cat.color }">{{ cat.count }}</span>
          </div>
          <div class="h-1.5 bg-[#333] rounded-full overflow-hidden">
            <div
              class="h-full rounded-full"
              :style="{
                width: `${Math.min(100, (cat.count / Math.max(1, limits.monthlyCount.value)) * 100)}%`,
                backgroundColor: cat.color,
              }"
            />
          </div>
        </div>
      </div>

      <div v-if="categoryBreakdown.length === 0" class="text-center py-8 text-muted">
        <p class="text-4xl mb-2">✨</p>
        <p class="text-sm">No cheat meals logged yet this month</p>
      </div>
    </div>

    <p class="text-center text-xs text-muted">Calendar heatmap & weekly trend coming soon</p>
  </div>
</template>
