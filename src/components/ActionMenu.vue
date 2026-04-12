<script setup lang="ts">
import { Dialog } from 'primevue';

const visible = defineModel<boolean>('visible', { default: false });

defineProps<{
  dateLabel: string;
  hasMeals: boolean;
}>();

const emit = defineEmits<{
  add: [];
  manage: [];
}>();

const handleAdd = () => {
  visible.value = false;
  emit('add');
};

const handleManage = () => {
  visible.value = false;
  emit('manage');
};
</script>

<template>
  <Dialog v-model:visible="visible" modal :draggable="false" :header="dateLabel">
    <div class="space-y-2">
      <button
        @click="handleAdd"
        class="glass-card rounded-xl p-4 flex items-center gap-4 w-full active:scale-95 transition-transform"
      >
        <span
          class="w-10 h-10 rounded-full glass-primary flex items-center justify-center text-white text-lg"
          >+</span
        >
        <div class="text-left">
          <p class="font-semibold text-sm">Add Meal</p>
          <p class="text-xs text-muted">Log a cheat meal for this day</p>
        </div>
      </button>

      <button
        @click="handleManage"
        :disabled="!hasMeals"
        class="glass-card rounded-xl p-4 flex items-center gap-4 w-full active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none"
      >
        <span class="w-10 h-10 rounded-full glass flex items-center justify-center text-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </span>
        <div class="text-left">
          <p class="font-semibold text-sm">View / Remove Meals</p>
          <p class="text-xs text-muted">Manage logged meals for this day</p>
        </div>
      </button>
    </div>
  </Dialog>
</template>
