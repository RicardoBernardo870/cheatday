<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/composables/useTheme';

const auth = useAuthStore();
const theme = useTheme();

const isDark = ref<boolean>(theme.current() === 'dark');

function toggleTheme() {
  theme.toggle();
  isDark.value = theme.current() === 'dark';
}

const cheatPercentage = ref<number>(auth.profile?.cheat_percentage ?? 20);
const mealsPerDay = ref<number>(auth.profile?.meals_per_day ?? 3);
const saving = ref<boolean>(false);
const saved = ref<boolean>(false);

watch(
  () => auth.profile,
  (p) => {
    if (p) {
      cheatPercentage.value = p.cheat_percentage;
      mealsPerDay.value = p.meals_per_day;
    }
  }
);

async function saveSettings() {
  saving.value = true;
  try {
    await auth.updateProfile({
      cheat_percentage: cheatPercentage.value,
      meals_per_day: mealsPerDay.value,
    });
    saved.value = true;
    setTimeout(() => (saved.value = false), 2000);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="px-4 py-6 space-y-8 max-w-sm mx-auto">
    <h1 class="text-xl font-bold">Settings</h1>

    <div class="glass-card rounded-2xl p-5 space-y-1">
      <p class="text-sm" style="color: var(--color-text-muted)">Signed in as</p>
      <p class="font-medium truncate" style="color: var(--color-text)">{{ auth.user?.email }}</p>
    </div>

    <!-- Theme toggle -->
    <div class="glass-card rounded-2xl p-5 space-y-1">
      <h2 class="text-sm uppercase tracking-wider" style="color: var(--color-text-muted)">
        Appearance
      </h2>
      <div class="flex items-center justify-between pt-2">
        <div class="flex items-center gap-3">
          <span class="text-xl">{{ isDark ? '🌙' : '☀️' }}</span>
          <span class="font-medium" style="color: var(--color-text)">{{
            isDark ? 'Dark mode' : 'Light mode'
          }}</span>
        </div>
        <!-- Toggle switch -->
        <button
          @click="toggleTheme"
          :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
          class="relative w-12 h-7 rounded-full transition-colors duration-200 focus:outline-none"
          :style="{
            background: isDark ? 'rgba(255,107,107,0.85)' : 'rgba(209,209,214,0.8)',
          }"
        >
          <span
            class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200"
            :style="{ transform: isDark ? 'translateX(20px)' : 'translateX(0)' }"
          />
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <h2 class="text-sm uppercase tracking-wider" style="color: var(--color-text-muted)">
        Your limits
      </h2>

      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <label class="font-medium">Cheat meal allowance</label>
          <span class="text-primary font-bold text-xl">{{ cheatPercentage }}%</span>
        </div>
        <input
          v-model="cheatPercentage"
          type="range"
          min="5"
          max="40"
          step="5"
          class="w-full accent-primary"
        />
      </div>

      <div class="space-y-3">
        <label class="font-medium">Meals per day</label>
        <div class="flex gap-3">
          <button
            v-for="n in [2, 3, 4, 5]"
            :key="n"
            @click="mealsPerDay = n"
            :class="[
              'flex-1 rounded-xl py-2 text-sm font-medium border transition-colors',
              mealsPerDay === n
                ? 'bg-primary border-primary text-white'
                : 'glass border-border text-muted',
            ]"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <button
        @click="saveSettings"
        :disabled="saving"
        class="w-full bg-primary text-white font-semibold rounded-xl py-3 transition-opacity disabled:opacity-50"
      >
        {{ saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes' }}
      </button>
    </div>

    <div class="pt-4">
      <button
        @click="auth.signOut"
        class="w-full border border-border text-muted rounded-xl py-3 text-sm"
      >
        Sign out
      </button>
    </div>
  </div>
</template>
