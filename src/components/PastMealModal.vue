<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Dialog, DatePicker, Button } from 'primevue';
import { useToast } from 'primevue/usetoast';
import type { ToastMessageOptions } from 'primevue/toast';
import { useCategoriesStore } from '@/stores/categories';
import { useMealsStore } from '@/stores/meals';

const props = defineProps<{
  initialDate?: Date;
}>();

const visible = defineModel<boolean>('visible', { default: false });

const emit = defineEmits<{
  logged: [date: Date];
}>();

const categories = useCategoriesStore();
const meals = useMealsStore();
const toast = useToast();

const today = new Date();
const selectedDate = ref<Date>(props.initialDate ?? new Date());
const logging = ref(false);

// Reset date when modal opens
watch(
  () => visible.value,
  (isVisible) => {
    if (isVisible) {
      selectedDate.value = props.initialDate ?? new Date();
    }
  }
);

// Update when initialDate changes while visible
watch(
  () => props.initialDate,
  (date) => {
    if (date && visible.value) {
      selectedDate.value = date;
    }
  }
);

const isFutureDate = computed(() => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const s = new Date(selectedDate.value);
  s.setHours(0, 0, 0, 0);
  return s > t;
});

const dateLabel = computed(() =>
  selectedDate.value.toLocaleDateString('default', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  })
);

const isToday = computed(() => {
  const s = new Date(selectedDate.value);
  const t = new Date();
  return (
    s.getDate() === t.getDate() &&
    s.getMonth() === t.getMonth() &&
    s.getFullYear() === t.getFullYear()
  );
});

const logForDate = async (categoryId: string) => {
  if (isFutureDate.value || logging.value) return;
  logging.value = true;

  try {
    if ('vibrate' in navigator) navigator.vibrate(10);
    await meals.logMeal(categoryId, selectedDate.value);

    const cat = categories.categories.find((c) => c.id === categoryId);
    const summary = isToday.value
      ? `${cat?.icon ?? ''} ${cat?.name ?? 'Meal'} logged`
      : `${cat?.icon ?? ''} ${cat?.name ?? 'Meal'} logged for ${dateLabel.value}`;

    toast.add({
      severity: 'success',
      summary,
      closable: false,
      life: 4000,
      group: 'meal',
      data: { categoryId, canUndo: false },
    } as ToastMessageOptions & { data: { categoryId: string; canUndo: boolean } });

    emit('logged', selectedDate.value);
    visible.value = false;
  } finally {
    logging.value = false;
  }
};
</script>

<template>
  <Dialog v-model:visible="visible" header="Log a past meal" modal :draggable="false">
    <div class="space-y-5">
      <!-- Date picker -->
      <div>
        <p class="text-xs text-muted uppercase tracking-wider mb-2">Select date</p>
        <DatePicker v-model="selectedDate" :maxDate="today" inline />
      </div>

      <!-- Selected date label -->
      <p v-if="isFutureDate" class="text-sm text-danger font-medium">
        Future dates are not allowed
      </p>
      <p v-else class="text-sm text-muted">
        Logging for <span class="font-semibold" style="color: var(--color-text)">{{ dateLabel }}</span>
      </p>

      <!-- Category grid -->
      <div>
        <p class="text-xs text-muted uppercase tracking-wider mb-2">Pick a category</p>
        <div class="grid grid-cols-2 gap-2">
          <Button
            v-for="cat in categories.categories"
            :key="cat.id"
            @click="logForDate(cat.id)"
            :disabled="isFutureDate || logging"
            :pt="{
              root: {
                class:
                  'glass-card rounded-xl p-3 flex items-center gap-3 w-full active:scale-95 transition-transform disabled:opacity-40',
              },
            }"
            :ptOptions="{ mergeSections: false, mergeProps: false }"
          >
            <span class="text-2xl">{{ cat.icon }}</span>
            <span class="text-sm font-medium text-left">{{ cat.name }}</span>
          </Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
