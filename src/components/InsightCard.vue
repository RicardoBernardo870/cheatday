<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  subtitle: string;
  variant?: 'default' | 'warning';
}>();
</script>

<template>
  <div
    :class="[
      'rounded-2xl p-4 flex items-start gap-3 text-sm',
      variant === 'warning' ? 'bg-danger/10 border border-danger/30 text-danger' : 'glass-card',
    ]"
  >
    <span class="text-xl shrink-0">{{ icon }}</span>
    <div>
      <p class="font-bold">{{ title }}</p>
      <p class="text-sm opacity-80 mt-1">{{ subtitle }}</p>
    </div>
  </div>
</template>
