<script setup lang="ts">
import { onMounted } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import { useMealsStore } from '@/stores/meals';
import { useLimits } from '@/composables/useLimits';

const categories = useCategoriesStore();
const meals = useMealsStore();
const limits = useLimits();

onMounted(async () => {
  await Promise.all([categories.fetch(), meals.fetchCurrentMonth()]);
});

async function handleTap(categoryId: string) {
  await meals.logMeal(categoryId);
}

async function handleLongPress(categoryId: string) {
  await meals.undoLastLog(categoryId);
}

const warningColors: Record<string, string> = {
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
};
</script>

<template>
  <div class="px-4 py-6 space-y-6">
    <div class="space-y-1">
      <div class="flex justify-between text-sm">
        <span class="text-muted">This month</span>
        <span :class="warningColors[limits.monthlyWarning.value]" class="font-semibold">
          {{ limits.monthlyCount.value }} / {{ limits.monthlyLimit.value }}
        </span>
      </div>
      <div class="h-2 bg-card rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="{
            'bg-green-400': limits.monthlyWarning.value === 'green',
            'bg-yellow-400': limits.monthlyWarning.value === 'yellow',
            'bg-orange-400': limits.monthlyWarning.value === 'orange',
            'bg-red-400': limits.monthlyWarning.value === 'red',
          }"
          :style="{ width: `${limits.monthlyProgress.value * 100}%` }"
        />
      </div>
      <div class="flex justify-between text-xs text-muted">
        <span>Week: {{ limits.weeklyCount.value }}/{{ limits.weeklyLimit.value }}</span>
        <span>Today: {{ limits.todayCount.value }}/{{ limits.dailySoftLimit.value }}</span>
      </div>
    </div>

    <div
      v-if="limits.warningMessage.value"
      :class="{
        'bg-yellow-400/10 border-yellow-400/30 text-yellow-400':
          limits.activeWarning.value === 'yellow',
        'bg-orange-400/10 border-orange-400/30 text-orange-400':
          limits.activeWarning.value === 'orange',
        'bg-red-400/10 border-red-400/30 text-red-400': limits.activeWarning.value === 'red',
      }"
      class="border rounded-xl px-4 py-3 text-sm"
    >
      {{ limits.warningMessage.value }}
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="cat in categories.categories"
        :key="cat.id"
        @click="handleTap(cat.id)"
        @contextmenu.prevent="handleLongPress(cat.id)"
        class="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform border border-border"
      >
        <span class="text-4xl">{{ cat.icon }}</span>
        <span class="text-sm font-medium">{{ cat.name }}</span>
        <span class="text-2xl font-bold" :style="{ color: cat.color }">
          {{ limits.countForCategory(cat.id, 'month') }}
        </span>
        <span class="text-xs text-muted">this month</span>
      </button>
    </div>

    <div
      v-if="categories.categories.length === 0 && !categories.loading"
      class="text-center py-10 text-muted"
    >
      <div class="text-4xl mb-2">🍽️</div>
      <p>No categories yet</p>
    </div>

    <p class="text-center text-xs text-muted pt-2">Tap to log · Long press to undo</p>
  </div>
</template>
