<script setup lang="ts">
import { onMounted } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import { useMealsStore } from '@/stores/meals';
import { useLimits } from '@/composables/useLimits';

import CheatMealProgressBar from '@/components/CheatMealProgressBar.vue';
import CategoryCard from '@/components/CategoryCard.vue';

const categories = useCategoriesStore();
const meals = useMealsStore();
const limits = useLimits();

onMounted(async () => {
  await Promise.all([categories.fetch(), meals.fetchCurrentMonth()]);
});
</script>

<template>
  <div class="px-4 py-6 space-y-6">
    <CheatMealProgressBar />

    <div class="grid grid-cols-2 gap-3">
      <CategoryCard
        v-for="cat in categories.categories"
        :key="cat.id"
        :id="cat.id"
        :icon="cat.icon"
        :name="cat.name"
        :color="cat.color"
        :count="limits.countForCategory(cat.id, 'month')"
        @tap="meals.logMeal($event)"
        @longpress="meals.undoLastLog($event)"
      />
    </div>

    <div v-if="categories.categories.length === 0 && !categories.loading" class="text-center py-10">
      <div class="text-4xl mb-2">🍽️</div>
      <p>No categories yet</p>
    </div>

    <p class="text-center text-xs pt-2">Tap to log · Long press to undo</p>
  </div>
</template>
