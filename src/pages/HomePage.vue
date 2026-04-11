<script setup lang="ts">
import { onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useCategoriesStore } from '@/stores/categories';
import { useMealsStore } from '@/stores/meals';
import { useLimits } from '@/composables/useLimits';

import CheatMealProgressBar from '@/components/CheatMealProgressBar.vue';
import CategoryCard from '@/components/CategoryCard.vue';
import SkeletonCard from '@/components/SkeletonCard.vue';

const categories = useCategoriesStore();
const meals = useMealsStore();
const limits = useLimits();
const toast = useToast();

onMounted(async () => {
  await Promise.all([categories.fetch(), meals.fetchCurrentMonth()]);
});

const handleTap = async (categoryId: string) => {
  if ('vibrate' in navigator) navigator.vibrate(10);
  await meals.logMeal(categoryId);
  const cat = categories.categories.find((c) => c.id === categoryId);
  toast.add({
    severity: 'success',
    summary: `${cat?.icon ?? ''} ${cat?.name ?? 'Meal'} logged`,
    life: 4000,
    group: 'meal',
    data: { categoryId },
  });
};

const handleLongPress = async (categoryId: string) => {
  if ('vibrate' in navigator) navigator.vibrate([10, 50, 10]);
  await meals.undoLastLog(categoryId);
};
</script>

<template>
  <div class="px-4 py-6 space-y-6">
    <CheatMealProgressBar />

    <!-- Loading skeleton -->
    <div v-if="categories.loading" class="grid grid-cols-2 gap-3">
      <SkeletonCard v-for="n in 4" :key="n" class="h-32" />
    </div>

    <!-- Category grid -->
    <div v-else-if="categories.categories.length > 0" class="grid grid-cols-2 gap-3">
      <CategoryCard
        v-for="cat in categories.categories"
        :key="cat.id"
        :id="cat.id"
        :icon="cat.icon"
        :name="cat.name"
        :color="cat.color"
        :count="limits.countForCategory(cat.id, 'month')"
        @tap="handleTap"
        @longpress="handleLongPress"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16 space-y-3">
      <div class="text-6xl">🍽️</div>
      <h2 class="font-semibold text-lg">No categories yet</h2>
      <p class="text-sm text-muted max-w-xs mx-auto">
        Your cheat meal categories will appear here once set up.
      </p>
    </div>

    <p class="text-center text-xs pt-2 text-muted">Tap to log · Long press to undo</p>
  </div>
</template>
