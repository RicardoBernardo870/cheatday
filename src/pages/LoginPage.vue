<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

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
      <button @click="magicSent = false" class="text-primary text-sm underline">Try again</button>
    </div>

    <form v-else @submit.prevent="submit" class="w-full max-w-sm space-y-4">
      <div>
        <label class="block text-sm mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
          class="w-full bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div v-if="mode !== 'magic'">
        <label class="block text-sm mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="w-full bg-card border border-border rounded-xl px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-primary text-white font-semibold rounded-xl py-3 transition-opacity disabled:opacity-50"
      >
        <span v-if="loading">...</span>
        <span v-else-if="mode === 'signin'">Sign in</span>
        <span v-else-if="mode === 'signup'">Create account</span>
        <span v-else>Send magic link</span>
      </button>

      <div class="flex flex-col items-center gap-2 pt-2">
        <button
          v-if="mode !== 'magic'"
          type="button"
          @click="mode = 'magic'"
          class="text-sm underline"
        >
          Sign in with magic link instead
        </button>
        <button v-if="mode === 'signin'" type="button" @click="mode = 'signup'" class="text-sm">
          No account? <span class="text-primary underline">Sign up</span>
        </button>
        <button
          v-if="mode === 'signup' || mode === 'magic'"
          type="button"
          @click="mode = 'signin'"
          class="text-sm"
        >
          Already have an account?
          <span class="text-primary underline">Sign in</span>
        </button>
      </div>
    </form>
  </div>
</template>
