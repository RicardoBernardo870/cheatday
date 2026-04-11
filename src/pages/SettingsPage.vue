<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Button } from 'primevue';

import ThemeToggle from '@/components/ThemeToggle.vue';
import LimitsForm from '@/components/LimitsForm.vue';

const auth = useAuthStore();

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

const saveSettings = async () => {
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
};
</script>

<template>
  <div class="px-4 py-6 space-y-8 max-w-sm mx-auto">
    <h1 class="text-xl font-bold">Settings</h1>

    <div class="glass-card rounded-2xl p-5 space-y-1">
      <p class="text-sm" style="color: var(--color-text-muted)">Signed in as</p>
      <p class="font-medium truncate" style="color: var(--color-text)">{{ auth.user?.email }}</p>
    </div>

    <ThemeToggle />

    <div class="space-y-6">
      <h2 class="text-sm uppercase tracking-wider" style="color: var(--color-text-muted)">
        Your limits
      </h2>

      <LimitsForm v-model:cheatPercentage="cheatPercentage" v-model:mealsPerDay="mealsPerDay" />

      <Button @click="saveSettings" :disabled="saving" class="w-full">
        {{ saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes' }}
      </Button>
    </div>

    <div class="pt-4">
      <Button
        @click="auth.signOut"
        label="Sign out"
        :pt="{
          root: {
            class: 'w-full glass rounded-xl py-3 text-sm text-[color:var(--color-text)] justify-center',
          },
        }"
        :ptOptions="{ mergeSections: false, mergeProps: false }"
      />
    </div>
  </div>
</template>
