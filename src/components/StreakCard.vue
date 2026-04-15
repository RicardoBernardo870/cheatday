<script setup lang="ts">
import { computed } from 'vue';
import type { StreakResult } from '@/composables/useStreak';

const props = defineProps<{
  streak: StreakResult;
  loading?: boolean;
}>();

type Level = 'hot' | 'warm' | 'calm';

/** ≥7 celebratory, ≥1 encouraging, 0 calm. */
const level = computed<Level>(() => {
  if (props.streak.currentStreak >= 7) return 'hot';
  if (props.streak.currentStreak >= 1) return 'warm';
  return 'calm';
});

const badgeColor = computed(() => {
  if (level.value === 'hot') return 'bg-primary/20 text-primary';
  if (level.value === 'warm') return 'bg-success/15 text-success';
  return 'bg-white/10 text-muted';
});

const numberColor = computed(() => {
  if (level.value === 'hot') return 'text-primary';
  if (level.value === 'warm') return 'text-success';
  return 'text-muted';
});

const dayWord = computed(() =>
  props.streak.currentStreak === 1 ? 'day' : 'days'
);

const subtitle = computed(() => {
  if (props.streak.isFirstDay) return 'Log your first meal to start tracking.';
  if (props.streak.currentStreak === 0) return 'Reset today — clean tomorrow starts a new streak.';
  if (props.streak.currentStreak === props.streak.bestStreak) {
    return `Personal best — keep it going.`;
  }
  return `Best ever: ${props.streak.bestStreak} ${props.streak.bestStreak === 1 ? 'day' : 'days'}`;
});

const headline = computed(() => {
  if (props.streak.isFirstDay) return 'Day one';
  if (props.streak.currentStreak === 0) return 'Streak reset';
  return `${props.streak.currentStreak} ${dayWord.value} clean`;
});
</script>

<template>
  <div
    v-if="!loading"
    class="glass-card rounded-2xl px-4 py-3 flex items-center gap-3"
    :data-level="level"
  >
    <!-- Flame badge -->
    <span
      :class="['w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 streak-flame', badgeColor]"
      aria-hidden="true"
    >
      🔥
    </span>

    <!-- Text -->
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold" style="color: var(--color-text)">
        {{ headline }}
      </p>
      <p class="text-xs text-muted">
        {{ subtitle }}
      </p>
    </div>

    <!-- Current streak number -->
    <span
      v-if="!streak.isFirstDay"
      :class="['text-2xl font-bold tabular-nums shrink-0', numberColor]"
      aria-label="current streak"
    >
      {{ streak.currentStreak }}
    </span>
  </div>
</template>

<style scoped>
.streak-flame {
  animation: streak-pulse 2.4s ease-in-out infinite;
}

[data-level='calm'] .streak-flame,
[data-level='warm'] .streak-flame {
  animation: none;
}

@keyframes streak-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .streak-flame {
    animation: none !important;
  }
}
</style>
