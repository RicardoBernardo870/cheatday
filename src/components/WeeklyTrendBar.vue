<script setup lang="ts">
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  type ScriptableContext,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useChartTheme } from '@/composables/useChartTheme';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, annotationPlugin);

const props = defineProps<{
  labels: string[];
  counts: number[];
  weeklyLimit: number;
}>();

const { isDark, textMuted, gridColor } = useChartTheme();

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Cheat meals',
      data: props.counts,
      backgroundColor: (ctx: ScriptableContext<'bar'>) => {
        const chart = ctx.chart;
        const { chartArea } = chart;
        if (!chartArea) return 'rgba(255,130,58,0.7)';
        const gradient = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(255,130,58,0.85)');
        gradient.addColorStop(1, 'rgba(255,130,58,0.10)');
        return gradient;
      },
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      events: ['click' as const],
      callbacks: {
        label: (ctx: { parsed: { y: number } }) =>
          ` ${ctx.parsed.y} meal${ctx.parsed.y !== 1 ? 's' : ''}`,
      },
    },
    annotation: {
      annotations: {
        limitLine: {
          type: 'line' as const,
          yMin: props.weeklyLimit,
          yMax: props.weeklyLimit,
          borderColor: 'rgba(163,21,47,0.70)',
          borderWidth: 2,
          borderDash: [6, 4],
          label: {
            display: true,
            content: `Limit: ${props.weeklyLimit}`,
            position: 'end' as const,
            backgroundColor: 'rgba(163,21,47,0.15)',
            color: 'rgba(163,21,47,0.9)',
            font: { size: 11 },
            padding: { x: 6, y: 3 },
          },
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: textMuted.value, font: { size: 12 } },
    },
    y: {
      beginAtZero: true,
      grid: { color: gridColor.value, drawBorder: false },
      border: { display: false },
      ticks: { color: textMuted.value, stepSize: 1, font: { size: 11 } },
    },
  },
}));
</script>

<template>
  <div class="h-40">
    <Bar :key="isDark ? 'dark' : 'light'" :data="chartData" :options="chartOptions" />
  </div>
</template>
