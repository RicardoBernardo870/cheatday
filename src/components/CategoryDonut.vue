<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  type Plugin,
} from 'chart.js';

ChartJS.register(DoughnutController, ArcElement, Tooltip);

const props = defineProps<{
  data: Array<{ name: string; icon: string; color: string; count: number }>;
}>();

const totalMeals = computed(() => props.data.reduce((s, c) => s + c.count, 0));

// Center-text plugin: draws total + label in the donut hole
const centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const cx = (chartArea.left + chartArea.right) / 2;
    const cy = (chartArea.top + chartArea.bottom) / 2;
    const total = (chart.data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
    const textColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-text')
      .trim();
    const mutedColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-text-muted')
      .trim();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 28px system-ui, sans-serif';
    ctx.fillStyle = textColor || '#f5f0e8';
    ctx.fillText(String(total), cx, cy - 10);
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = mutedColor || 'rgba(245,240,232,0.45)';
    ctx.fillText('meals', cx, cy + 12);
    ctx.restore();
  },
};

const chartData = computed(() => ({
  labels: props.data.map((c) => c.name),
  datasets: [
    {
      data: props.data.map((c) => c.count),
      backgroundColor: props.data.map((c) => c.color),
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  cutout: '68%',
  plugins: {
    legend: { display: false },
    tooltip: {
      events: ['click' as const],
      callbacks: {
        label: (ctx: { label: string; parsed: number }) =>
          ` ${ctx.label}: ${ctx.parsed} meal${ctx.parsed !== 1 ? 's' : ''}`,
      },
    },
  },
}));
</script>

<template>
  <div class="space-y-4">
    <div v-if="totalMeals === 0" class="text-center py-8 text-muted text-sm">
      No meals logged this month
    </div>

    <template v-else>
      <!-- Donut -->
      <div class="max-w-[220px] mx-auto">
        <Doughnut :data="chartData" :options="chartOptions" :plugins="[centerTextPlugin]" />
      </div>

      <!-- Custom HTML legend (better tap targets on mobile) -->
      <div class="space-y-2">
        <div
          v-for="cat in data"
          :key="cat.name"
          class="flex items-center justify-between gap-3 text-sm"
        >
          <div class="flex items-center gap-2 min-w-0">
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0"
              :style="{ backgroundColor: cat.color }"
            />
            <span class="truncate">{{ cat.icon }} {{ cat.name }}</span>
          </div>
          <span class="font-semibold shrink-0" :style="{ color: cat.color }">{{ cat.count }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
