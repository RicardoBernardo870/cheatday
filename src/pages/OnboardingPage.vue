<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Button } from 'primevue';

import LimitsForm from '@/components/LimitsForm.vue';
import LimitsSummaryCard from '@/components/LimitsSummaryCard.vue';

const router = useRouter();
const auth = useAuthStore();

const cheatPercentage = ref<number>(20);
const mealsPerDay = ref<number>(3);
const saving = ref<boolean>(false);

const daysInMonth = computed(
  () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
);
const monthlyLimit = computed(() =>
  Math.round(mealsPerDay.value * daysInMonth.value * (cheatPercentage.value / 100))
);
const weeklyLimit = computed(() => Math.round(monthlyLimit.value / 4.33));

const finish = async () => {
  saving.value = true;
  try {
    await auth.updateProfile({
      cheat_percentage: cheatPercentage.value,
      meals_per_day: mealsPerDay.value,
      onboarding_complete: true,
    });
    router.push({ name: 'home' });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[color:var(--color-bg)] px-6 pt-safe">
    <div class="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
      <div class="text-center">
        <div class="text-5xl mb-4">🎯</div>
        <h1 class="text-2xl font-bold">Set your target</h1>
        <p class="text-muted text-sm mt-2">
          Science backs the <strong class="text-white">80/20 rule</strong> — 80% whole foods, 20%
          flexible. You can always change this later.
        </p>
      </div>

      <LimitsForm
        v-model:cheatPercentage="cheatPercentage"
        v-model:mealsPerDay="mealsPerDay"
        :showHints="true"
      />

      <LimitsSummaryCard :monthlyLimit="monthlyLimit" :weeklyLimit="weeklyLimit" />

      <Button
        @click="finish"
        :disabled="saving"
        class="w-full"
        :pt="{ root: { class: 'py-4 text-lg' } }"
      >
        {{ saving ? 'Saving...' : "Let's go 🚀" }}
      </Button>
    </div>
  </div>
</template>
