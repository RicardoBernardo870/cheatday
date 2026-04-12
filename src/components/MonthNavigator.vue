<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

defineProps<{
  monthLabel: string;
  isCurrentMonth: boolean;
}>();

const emit = defineEmits<{
  prev: [];
  next: [];
  reset: [];
}>();
</script>

<template>
  <div class="flex items-center justify-between">
    <button @click="emit('prev')" class="p-1.5 glass-card rounded-xl transition-opacity">
      <ChevronLeft class="w-5 h-5" />
    </button>
    <div class="text-center">
      <h1 class="text-lg font-bold">{{ monthLabel }}</h1>
      <button
        v-if="!isCurrentMonth"
        @click="emit('reset')"
        class="text-xs text-primary underline"
      >
        Back to current
      </button>
    </div>
    <button
      @click="emit('next')"
      :disabled="isCurrentMonth"
      class="p-1.5 glass-card rounded-xl transition-opacity disabled:opacity-30"
    >
      <ChevronRight class="w-5 h-5" />
    </button>
  </div>
</template>
