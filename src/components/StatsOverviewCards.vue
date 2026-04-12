<script setup lang="ts">
defineProps<{
  logged: number;
  limit: number;
  remaining: number;
}>();
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <div class="bg-card rounded-2xl p-4 text-center glass">
      <p class="text-2xl font-bold text-primary">{{ logged }}</p>
      <p class="text-xs text-muted mt-1">logged</p>
    </div>
    <div class="bg-card rounded-2xl p-4 text-center glass">
      <p class="text-2xl font-bold">{{ limit }}</p>
      <p class="text-xs text-muted mt-1">limit</p>
    </div>
    <div class="bg-card rounded-2xl p-4 text-center glass">
      <p class="text-2xl font-bold text-green-400">{{ remaining }}</p>
      <p class="text-xs text-muted mt-1">remaining</p>
    </div>
  </div>
</template>
