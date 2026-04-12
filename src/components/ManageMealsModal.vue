<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Dialog } from 'primevue';
import { useCategoriesStore } from '@/stores/categories';
import { useMealsStore } from '@/stores/meals';
import type { MealLog } from '@/lib/supabase';

const props = defineProps<{
  date: Date | undefined;
  logs: MealLog[];
}>();

const visible = defineModel<boolean>('visible', { default: false });

const emit = defineEmits<{
  deleted: [];
}>();

const categories = useCategoriesStore();
const meals = useMealsStore();
const deleting = ref<string | null>(null);
const confirmId = ref<string | null>(null);

const dateLabel = computed(() => {
  if (!props.date) return '';
  return props.date.toLocaleDateString('default', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
});

const mealsForDate = computed(() => {
  if (!props.date) return [];
  const d = props.date;
  return props.logs
    .filter((log) => {
      const ld = new Date(log.logged_at);
      return (
        ld.getDate() === d.getDate() &&
        ld.getMonth() === d.getMonth() &&
        ld.getFullYear() === d.getFullYear()
      );
    })
    .map((log) => {
      const cat = categories.categories.find((c) => c.id === log.category_id);
      return {
        ...log,
        categoryName: cat?.name ?? 'Unknown',
        categoryIcon: cat?.icon ?? '?',
        categoryColor: cat?.color ?? '#888',
        time: new Date(log.logged_at).toLocaleTimeString('default', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    });
});

// Reset confirm state when modal closes
watch(visible, (v) => {
  if (!v) confirmId.value = null;
});

const handleDelete = async (logId: string) => {
  if (confirmId.value !== logId) {
    confirmId.value = logId;
    return;
  }

  deleting.value = logId;
  try {
    if ('vibrate' in navigator) navigator.vibrate(10);
    await meals.deleteMeal(logId);
    confirmId.value = null;
    emit('deleted');

    // Auto-close if no meals left
    if (mealsForDate.value.length === 0) {
      visible.value = false;
    }
  } finally {
    deleting.value = null;
  }
};

const cancelConfirm = () => {
  confirmId.value = null;
};
</script>

<template>
  <Dialog v-model:visible="visible" modal :draggable="false" header="Manage Meals">
    <div class="space-y-4">
      <!-- Date header -->
      <p class="text-sm text-muted">
        Meals on <span class="font-semibold" style="color: var(--color-text)">{{ dateLabel }}</span>
      </p>

      <!-- Meal list -->
      <div v-if="mealsForDate.length > 0" class="space-y-2">
        <div
          v-for="meal in mealsForDate"
          :key="meal.id"
          class="glass-card rounded-xl px-4 py-3 flex items-center gap-3"
        >
          <span class="text-2xl">{{ meal.categoryIcon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ meal.categoryName }}</p>
            <p class="text-xs text-muted">{{ meal.time }}</p>
          </div>

          <!-- Delete / Confirm button -->
          <button
            v-if="confirmId !== meal.id"
            @click="handleDelete(meal.id)"
            :disabled="deleting === meal.id"
            class="p-2 rounded-lg text-muted hover:text-danger transition-colors active:scale-90 disabled:opacity-40"
            aria-label="Delete meal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>

          <!-- Confirm / Cancel buttons -->
          <div v-else class="flex items-center gap-1">
            <button
              @click="cancelConfirm"
              class="px-2 py-1 rounded-lg text-xs text-muted hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete(meal.id)"
              :disabled="deleting === meal.id"
              class="px-2 py-1 rounded-lg text-xs font-semibold text-white bg-danger/80 hover:bg-danger transition-colors active:scale-95 disabled:opacity-40"
            >
              {{ deleting === meal.id ? 'Deleting...' : 'Confirm' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-6 space-y-2">
        <p class="text-3xl">&#10024;</p>
        <p class="text-sm text-muted">No meals on this day</p>
      </div>
    </div>
  </Dialog>
</template>
