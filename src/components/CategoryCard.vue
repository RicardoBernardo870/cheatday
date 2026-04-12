<script setup lang="ts">
import { Button } from 'primevue';

defineProps<{
  id: string;
  icon: string;
  name: string;
  color: string;
  count: number;
}>();

const emit = defineEmits<{
  tap: [id: string];
}>();
</script>

<template>
  <Button
    @click="emit('tap', id)"
    :pt="{
      root: {
        class:
          'glass-card rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform w-full',
      },
    }"
    :ptOptions="{ mergeSections: false, mergeProps: false }"
  >
    <span class="text-4xl">{{ icon }}</span>
    <span class="text-sm font-medium">{{ name }}</span>
    <span class="text-2xl font-bold" :style="{ color }">{{ count }}</span>
    <span class="text-xs">this month</span>
  </Button>
</template>
