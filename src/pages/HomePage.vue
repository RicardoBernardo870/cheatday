<script setup lang="ts">
import { onMounted } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import { useMealsStore } from '@/stores/meals';
import { useLimits } from '@/composables/useLimits';

import CheatMealProgressBar from '@/components/CheatMealProgressBar.vue';

const categories = useCategoriesStore();
const meals = useMealsStore();
const limits = useLimits();

onMounted(async () => {
  await Promise.all([categories.fetch(), meals.fetchCurrentMonth()]);
});

const handleTap = async (categoryId: string) => {
  await meals.logMeal(categoryId);
};

const handleLongPress = async (categoryId: string) => {
  await meals.undoLastLog(categoryId);
};
</script>

<template>
  <div class="px-4 py-6 space-y-6">
    <CheatMealProgressBar />

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
        <span class="text-xs">this month</span>
      </button>
    </div>

    <div v-if="categories.categories.length === 0 && !categories.loading" class="text-center py-10">
      <div class="text-4xl mb-2">🍽️</div>
      <p>No categories yet</p>
    </div>

    <p class="text-center text-xs pt-2">Tap to log · Long press to undo</p>
  </div>
</template>
