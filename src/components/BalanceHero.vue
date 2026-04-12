<script setup lang="ts">
import { computed } from 'vue';
import type { ScoreLevel } from '@/composables/useBalanceScore';

const props = defineProps<{
  score: number;
  level: ScoreLevel;
  label: string;
  cleanDays: number;
  totalDays: number;
}>();

// ── SVG arc math ────────────────────────────────────────────────────────────
// Semi-circle gauge: center (120, 108), radius 80
// viewBox 0 0 240 120 — matching physical size to avoid scaling distortion
const CX = 120;
const CY = 108;
const R = 80;
const STROKE = 12;

// Full background arc (left → right, upper semicircle)
const bgArc = `M 40 108 A 80 76 0 1 1 200 100`;

const RX = 80;
const RY = 70;

// Progress arc: sweeps clockwise from the left endpoint
const progressArc = computed(() => {
  const pct = Math.min(100, Math.max(0, props.score)) / 100;
  if (pct === 0) return '';

  const angle = Math.PI * pct;

  // IMPORTANT: ellipse parametric equation
  const endX = CX - RX * Math.cos(angle);
  const endY = CY - RY * Math.sin(angle);

  const largeArc = pct > 0.5 ? 1 : 0;

  return `M ${CX - RX} ${CY} A ${RX} ${RY} 1 ${largeArc} 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`;
});

// ── Theme colors ────────────────────────────────────────────────────────────
const COLOR_MAP: Record<ScoreLevel, { stroke: string; glow: string; text: string }> = {
  great:   { stroke: '#5dc7b7', glow: 'rgba(93,199,183,0.35)', text: 'text-success' },
  good:    { stroke: '#ffbf5e', glow: 'rgba(255,191,94,0.30)',  text: 'text-warn' },
  warning: { stroke: '#ff6b6b', glow: 'rgba(255,107,107,0.30)', text: 'text-danger' },
};

const colors = computed(() => COLOR_MAP[props.level]);

const motivationalText = computed(() => {
  if (props.score >= 90) return 'Incredible discipline!';
  if (props.score >= 80) return 'Great balance, keep it up!';
  if (props.score >= 70) return 'Solid work, stay mindful.';
  if (props.score >= 60) return 'Decent balance, room to improve.';
  return 'Time to refocus!';
});
</script>

<template>
  <div class="glass-card rounded-2xl p-5 flex flex-col items-center">
    <!-- Semi-circular gauge -->
    <!-- <svg width="240" height="120" viewBox="0 0 240 120" class="overflow-visible">
 
      <path
        :d="bgArc"
        fill="none"
        stroke="var(--color-glass-border, rgba(255,255,255,0.1))"
        :stroke-width="STROKE"
        stroke-linecap="round"
      />

      <path
        v-if="progressArc"
        :d="progressArc"
        fill="none"
        :stroke="colors.stroke"
        :stroke-width="STROKE"
        stroke-linecap="round"
        :style="{ filter: `drop-shadow(0 0 8px ${colors.glow})` }"
      />
    </svg> -->

    <!-- Score number (overlaid on gauge center) -->
    <div class="text-center">
      <span :class="['text-4xl font-bold tabular-nums', colors.text]">
        {{ score }}%
      </span>
      <p class="text-xs text-muted mt-0.5 uppercase tracking-wider">Clean</p>
    </div>

    <!-- Supportive text -->
    <p class="text-sm mt-3 font-medium" style="color: var(--color-text)">
      {{ motivationalText }}
    </p>
    <p class="text-xs text-muted mt-1">{{ label }}</p>
  </div>
</template>
