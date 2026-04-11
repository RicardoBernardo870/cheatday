<script setup lang="ts">
defineProps<{
  monthlyLimit: number;
  weeklyLimit: number;
}>();
</script>

<template>
  <div class="bg-card rounded-2xl p-5 space-y-2 border border-border">
    <p class="text-muted text-xs uppercase tracking-wider">Your limits</p>
    <div class="flex justify-between">
      <span class="text-sm">This month</span>
      <span class="font-bold text-primary">{{ monthlyLimit }} cheat meals</span>
    </div>
    <div class="flex justify-between">
      <span class="text-sm text-muted">Per week</span>
      <span class="text-muted">~{{ weeklyLimit }}</span>
    </div>
  </div>
</template>
