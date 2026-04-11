<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from '@/composables/useTheme';

const theme = useTheme();
const isDark = ref<boolean>(theme.current() === 'dark');

function toggle() {
  theme.toggle();
  isDark.value = theme.current() === 'dark';
}
</script>

<template>
  <div class="glass-card rounded-2xl p-5 space-y-1">
    <h2 class="text-sm uppercase tracking-wider" style="color: var(--color-text-muted)">
      Appearance
    </h2>
    <div class="flex items-center justify-between pt-2">
      <div class="flex items-center gap-3">
        <span class="text-xl">{{ isDark ? '🌙' : '☀️' }}</span>
        <span class="font-medium" style="color: var(--color-text)">
          {{ isDark ? 'Dark mode' : 'Light mode' }}
        </span>
      </div>
      <button
        @click="toggle"
        :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
        class="relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none"
        :style="{ background: isDark ? 'rgba(255,107,107,0.85)' : 'rgba(209,209,214,0.8)' }"
      >
        <span
          class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200"
          :style="{ transform: isDark ? 'translateX(20px)' : 'translateX(0)' }"
        />
      </button>
    </div>
  </div>
</template>
