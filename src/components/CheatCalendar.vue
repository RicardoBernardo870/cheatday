<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MealLog } from '@/lib/supabase';

const props = defineProps<{
  logs: MealLog[];
  month: number; // 0-11
  year: number;
}>();

const emit = defineEmits<{
  'day-selected': [date: Date | null];
}>();

const selectedDay = ref<number | null>(null);

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const mealsByDay = computed(() => {
  const counts: Record<number, number> = {};
  for (const log of props.logs) {
    const d = new Date(log.logged_at);
    if (d.getFullYear() === props.year && d.getMonth() === props.month) {
      counts[d.getDate()] = (counts[d.getDate()] || 0) + 1;
    }
  }
  return counts;
});

const calendarCells = computed(() => {
  const firstDow = new Date(props.year, props.month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(props.year, props.month + 1, 0).getDate();
  const cells: Array<{ day: number; count: number } | null> = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, count: mealsByDay.value[d] ?? 0 });
  return cells;
});

const today = new Date();
const isCurrentMonth = computed(
  () => props.year === today.getFullYear() && props.month === today.getMonth()
);

/** Whether a given day number has already passed. */
const isPastDay = (day: number) => {
  if (!isCurrentMonth.value) return true; // entire past month
  return day < today.getDate();
};

const cellStyle = (count: number, day: number) => {
  if (count === 0) {
    // Clean day glow for past days only
    if (isPastDay(day)) return { background: 'rgba(93,199,183,0.12)' };
    return {};
  }
  if (count === 1) return { background: 'rgba(255,130,58,0.28)' };
  if (count === 2) return { background: 'rgba(255,130,58,0.58)' };
  return { background: 'rgba(163,21,47,0.80)' };
};

const selectDay = (day: number) => {
  if (selectedDay.value === day) {
    selectedDay.value = null;
    emit('day-selected', null);
  } else {
    selectedDay.value = day;
    emit('day-selected', new Date(props.year, props.month, day));
  }
}
</script>

<template>
  <div class="space-y-2">
    <!-- Day-of-week headers -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="label in DAY_LABELS"
        :key="label"
        class="text-center text-xs text-muted py-1 font-medium"
      >
        {{ label }}
      </div>
    </div>

    <!-- Day cells -->
    <div class="grid grid-cols-7 gap-1">
      <div v-for="(cell, i) in calendarCells" :key="i">
        <!-- Empty padding cell -->
        <div v-if="cell === null" class="aspect-square" />

        <!-- Day cell -->
        <button
          v-else
          @click="selectDay(cell.day)"
          :style="cellStyle(cell.count, cell.day)"
          :class="[
            'aspect-square w-full rounded-lg text-xs font-medium transition-all relative',
            cell.count === 0
              ? isPastDay(cell.day)
                ? 'text-success/70'
                : 'glass-card text-muted'
              : 'text-white',
            selectedDay === cell.day ? 'ring-2 ring-primary ring-offset-1 ring-offset-transparent' : '',
            isCurrentMonth && cell.day === today.getDate() ? 'font-bold underline underline-offset-2' : '',
          ]"
        >
          {{ cell.day }}
          <!-- Clean day checkmark -->
          <span
            v-if="cell.count === 0 && isPastDay(cell.day)"
            class="absolute bottom-0.5 right-0.5 text-success text-[7px] leading-none opacity-60"
          >
            ✓
          </span>
        </button>
      </div>
    </div>

    <!-- Selected day summary -->
    <div v-if="selectedDay" class="glass-card rounded-xl px-3 py-2 text-xs text-muted">
      <span class="font-medium text-[color:var(--color-text)]">
        {{ new Date(year, month, selectedDay).toLocaleDateString('default', { weekday: 'long', day: 'numeric', month: 'short' }) }}
      </span>
      —
      {{ mealsByDay[selectedDay] ?? 0 }} meal{{ (mealsByDay[selectedDay] ?? 0) !== 1 ? 's' : '' }} logged
    </div>
  </div>
</template>
