<script setup lang="ts">
defineProps<{
  cheatPercentage: number;
  mealsPerDay: number;
  showHints?: boolean;
}>();

const emit = defineEmits<{
  'update:cheatPercentage': [value: number];
  'update:mealsPerDay': [value: number];
}>();
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="font-medium">Cheat meal allowance</label>
        <span class="text-primary font-bold text-xl">{{ cheatPercentage }}%</span>
      </div>
      <input
        :value="cheatPercentage"
        @input="emit('update:cheatPercentage', Number(($event.target as HTMLInputElement).value))"
        type="range"
        min="5"
        max="40"
        step="5"
        class="w-full accent-primary"
      />
      <div v-if="showHints" class="flex justify-between text-xs text-muted">
        <span>5% strict</span>
        <span>40% flexible</span>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <label class="font-medium">Meals per day</label>
        <span class="text-primary font-bold text-xl">{{ mealsPerDay }}</span>
      </div>
      <div class="flex gap-3">
        <button
          v-for="n in [2, 3, 4, 5]"
          :key="n"
          type="button"
          @click="emit('update:mealsPerDay', n)"
          :class="[
            'flex-1 rounded-xl py-2 text-sm font-medium border transition-colors',
            mealsPerDay === n
              ? 'bg-primary border-primary text-white'
              : 'glass-card border-border text-muted',
          ]"
        >
          {{ n }}
        </button>
      </div>
    </div>
  </div>
</template>
