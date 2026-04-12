<script setup lang="ts">
defineProps<{
  icon: string;
  name: string;
  color: string;
  count: number;
  totalCount: number;
}>();
</script>

<template>
  <div class="bg-card rounded-xl px-4 py-3 flex items-center gap-3 glass">
    <span class="text-2xl">{{ icon }}</span>
    <div class="flex-1">
      <div class="flex justify-between mb-1">
        <span class="text-sm font-medium">{{ name }}</span>
        <span class="text-sm font-bold" :style="{ color }">{{ count }}</span>
      </div>
      <div class="h-1.5 rounded-full overflow-hidden" style="background: var(--color-glass-border)">
        <div
          class="h-full rounded-full"
          :style="{
            width: `${Math.min(100, (count / Math.max(1, totalCount)) * 100)}%`,
            backgroundColor: color,
          }"
        />
      </div>
    </div>
  </div>
</template>
