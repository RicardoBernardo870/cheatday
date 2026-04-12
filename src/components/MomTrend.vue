<script setup lang="ts">
import { computed } from 'vue';
import type { MomResult } from '@/composables/useMomComparison';

const props = defineProps<{
  mom: MomResult;
  loading?: boolean;
}>();

/** "fewer" is good (green), "more" is bad (red), "same" is neutral */
const trend = computed(() => {
  if (props.mom.delta < 0) return 'improved';
  if (props.mom.delta > 0) return 'regressed';
  return 'same';
});

const arrowIcon = computed(() => {
  if (trend.value === 'improved') return '↓';
  if (trend.value === 'regressed') return '↑';
  return '→';
});

const trendColor = computed(() => {
  if (trend.value === 'improved') return 'text-success';
  if (trend.value === 'regressed') return 'text-danger';
  return 'text-muted';
});

const badgeColor = computed(() => {
  if (trend.value === 'improved') return 'bg-success/15 text-success';
  if (trend.value === 'regressed') return 'bg-danger/15 text-danger';
  return 'bg-white/10 text-muted';
});

const summaryText = computed(() => {
  const { delta, percentChange, previousMonthName, previousCount } = props.mom;

  if (props.mom.isFirstMonth) return 'First month tracked — no comparison yet.';
  if (previousCount === 0) return `No meals logged in ${previousMonthName}.`;
  if (delta === 0) return `Same as ${previousMonthName}.`;

  const absDelta = Math.abs(delta);
  const mealWord = absDelta === 1 ? 'meal' : 'meals';
  const pctStr = percentChange !== null ? `${Math.abs(percentChange)}%` : '';

  if (delta < 0) {
    return `${pctStr ? pctStr + ' fewer' : `${absDelta} fewer ${mealWord}`} than ${previousMonthName}`;
  }
  return `${pctStr ? pctStr + ' more' : `${absDelta} more ${mealWord}`} than ${previousMonthName}`;
});
</script>

<template>
  <!-- Hidden when loading or first month with zero data both months -->
  <div
    v-if="!loading && !mom.isFirstMonth"
    class="glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
  >
    <!-- Trend arrow badge -->
    <span
      :class="['w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0', badgeColor]"
    >
      {{ arrowIcon }}
    </span>

    <!-- Text -->
    <div class="min-w-0">
      <p class="text-sm font-semibold" style="color: var(--color-text)">
        Month over month
      </p>
      <p :class="['text-xs', trendColor]">
        {{ summaryText }}
      </p>
    </div>

    <!-- Delta number -->
    <span
      v-if="mom.percentChange !== null && mom.delta !== 0"
      :class="['ml-auto text-lg font-bold tabular-nums shrink-0', trendColor]"
    >
      {{ mom.delta > 0 ? '+' : '' }}{{ mom.percentChange }}%
    </span>
  </div>
</template>
