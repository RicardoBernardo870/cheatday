<script setup lang="ts">
defineProps<{
  id: string;
  icon: string;
  name: string;
  color: string;
  count: number;
}>();

const emit = defineEmits<{
  tap: [id: string];
  longpress: [id: string];
}>();
</script>

<template>
  <button
    @click="emit('tap', id)"
    @contextmenu.prevent="emit('longpress', id)"
    class="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
  >
    <span class="text-4xl">{{ icon }}</span>
    <span class="text-sm font-medium">{{ name }}</span>
    <span class="text-2xl font-bold" :style="{ color }">{{ count }}</span>
    <span class="text-xs">this month</span>
  </button>
</template>
