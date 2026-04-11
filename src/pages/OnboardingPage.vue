<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();

const cheatPercentage = ref<number>(20);
const mealsPerDay = ref<number>(3);
const saving = ref<boolean>(false);

const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
const monthlyLimit = computed(() =>
  Math.round(mealsPerDay.value * daysInMonth * (cheatPercentage.value / 100))
);
const weeklyLimit = computed(() => Math.round(monthlyLimit.value / 4.33));

async function finish() {
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
  <div class="flex flex-col min-h-screen bg-[#0f0f0f] px-6 pt-safe">
    <div class="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
      <div class="text-center">
        <div class="text-5xl mb-4">🎯</div>
        <h1 class="text-2xl font-bold">Set your target</h1>
        <p class="text-muted text-sm mt-2">
          Science backs the <strong class="text-white">80/20 rule</strong> — 80% whole foods, 20%
          flexible. You can always change this later.
        </p>
      </div>

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
        <div class="flex justify-between text-xs text-muted">
          <span>5% strict</span>
          <span>40% flexible</span>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <label class="font-medium">Meals per day</label>
          <span class="text-primary font-bold text-xl">{{ mealsPerDay }}</span>
        </div>
        <div class="flex gap-3">
          <button
            v-for="n in [2, 3, 4, 5]"
            :key="n"
            @click="mealsPerDay = n"
            :class="[
              'flex-1 rounded-xl py-2 text-sm font-medium border transition-colors',
              mealsPerDay === n
                ? 'bg-primary border-primary text-white'
                : 'bg-card border-border text-muted',
            ]"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <div class="bg-card rounded-2xl p-5 space-y-2 border border-border">
        <p class="text-muted text-xs uppercase tracking-wider">Your limits</p>
        <div class="flex justify-between">
          <span class="text-sm">This month</span>
          <span class="font-bold text-primary">{{ monthlyLimit }} cheat meals</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-muted">Per week</span>
          <span class="text-muted">~{{ weeklyLimit }}</span>
        </div>
      </div>

      <button
        @click="finish"
        :disabled="saving"
        class="w-full bg-primary text-white font-semibold rounded-xl py-4 text-lg transition-opacity disabled:opacity-50"
      >
        {{ saving ? 'Saving...' : "Let's go 🚀" }}
      </button>
    </div>
  </div>
</template>
