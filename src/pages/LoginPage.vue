<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Button, InputText } from 'primevue';

const router = useRouter();
const auth = useAuthStore();

const email = ref<string>('');
const password = ref<string>('');
const error = ref<string>('');
const loading = ref<boolean>(false);
const mode = ref<'signin' | 'signup' | 'magic'>('signin');
const magicSent = ref<boolean>(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    if (mode.value === 'magic') {
      await auth.signInWithMagicLink(email.value);
      magicSent.value = true;
    } else if (mode.value === 'signup') {
      await auth.signUp(email.value, password.value);
      router.push({ name: 'onboarding' });
    } else {
      await auth.signIn(email.value, password.value);
      router.push({ name: 'home' });
    }
  } catch (e: any) {
    error.value = e.message ?? 'Something went wrong. Try again.';
  } finally {
    loading.value = false;
  }
}

const textButtonPt = {
  root: { class: 'text-sm underline bg-transparent border-none p-0 cursor-pointer' },
} as const;
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[#0f0f0f] items-center justify-center px-6 pt-safe">
    <div class="mb-10 text-center">
      <div class="text-6xl mb-3">🍔</div>
      <h1 class="text-3xl font-bold tracking-tight">CheatDay</h1>
      <p class="text-sm mt-1">Track your 80/20</p>
    </div>

    <div v-if="magicSent" class="text-center space-y-3">
      <div class="text-4xl">📬</div>
      <p class="font-semibold">Check your email</p>
      <p class="text-sm">
        We sent a sign-in link to <strong>{{ email }}</strong>
      </p>
      <Button
        @click="magicSent = false"
        label="Try again"
        :pt="{ root: { class: 'text-primary text-sm underline bg-transparent border-none p-0 cursor-pointer' } }"
        :ptOptions="{ mergeSections: false, mergeProps: false }"
      />
    </div>

    <form v-else @submit.prevent="submit" class="w-full max-w-sm space-y-4">
      <div>
        <label class="block text-sm mb-1">Email</label>
        <InputText
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div v-if="mode !== 'magic'">
        <label class="block text-sm mb-1">Password</label>
        <InputText
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>

      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

      <Button type="submit" :disabled="loading" class="w-full">
        <span v-if="loading">...</span>
        <span v-else-if="mode === 'signin'">Sign in</span>
        <span v-else-if="mode === 'signup'">Create account</span>
        <span v-else>Send magic link</span>
      </Button>

      <div class="flex flex-col items-center gap-2 pt-2">
        <Button
          v-if="mode !== 'magic'"
          type="button"
          label="Sign in with magic link instead"
          @click="mode = 'magic'"
          :pt="textButtonPt"
          :ptOptions="{ mergeSections: false, mergeProps: false }"
        />
        <Button
          v-if="mode === 'signin'"
          type="button"
          @click="mode = 'signup'"
          :pt="textButtonPt"
          :ptOptions="{ mergeSections: false, mergeProps: false }"
        >
          No account? <span class="text-primary underline">Sign up</span>
        </Button>
        <Button
          v-if="mode === 'signup' || mode === 'magic'"
          type="button"
          @click="mode = 'signin'"
          :pt="textButtonPt"
          :ptOptions="{ mergeSections: false, mergeProps: false }"
        >
          Already have an account?
          <span class="text-primary underline">Sign in</span>
        </Button>
      </div>
    </form>
  </div>
</template>
