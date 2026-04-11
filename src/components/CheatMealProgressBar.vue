<script setup lang="ts">
import { useLimits } from '@/composables/useLimits';
import { ProgressBar } from 'primevue';

const limits = useLimits();

const warningColors: Record<string, string> = {
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
};
</script>

<template>
  <div class="space-y-1">
    <div class="flex justify-between text-sm">
      <span class="">This month</span>
      <span :class="warningColors[limits.monthlyWarning.value]" class="font-semibold">
        {{ limits.monthlyCount.value }} / {{ limits.monthlyLimit.value }}
      </span>
    </div>

    <ProgressBar :value="limits.monthlyProgress.value * 100" :show-value="false" />

    <div class="flex justify-between text-xs">
      <span>Week: {{ limits.weeklyCount.value }}/{{ limits.weeklyLimit.value }}</span>
      <span>Today: {{ limits.todayCount.value }}/{{ limits.dailySoftLimit.value }}</span>
    </div>
  </div>

  <div
    v-if="limits.warningMessage.value"
    :class="{
      'bg-yellow-400/10 border-yellow-400/30 text-yellow-400':
        limits.activeWarning.value === 'yellow',
      'bg-orange-400/10 border-orange-400/30 text-orange-400':
        limits.activeWarning.value === 'orange',
      'bg-red-400/10 border-red-400/30 text-red-400': limits.activeWarning.value === 'red',
    }"
    class="border rounded-xl px-4 py-3 text-sm"
  >
    {{ limits.warningMessage.value }}
  </div>
</template>
