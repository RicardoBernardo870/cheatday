<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMealsStore } from '@/stores/meals'
import { useTheme } from '@/composables/useTheme'

const auth = useAuthStore()
const meals = useMealsStore()
const theme = useTheme()

onMounted(async () => {
  theme.init()
  await auth.init()
  window.addEventListener('focus', () => meals.syncIfOnline())
  window.addEventListener('online', () => meals.syncIfOnline())
})
</script>

<template>
  <div class="min-h-screen bg-base dark:bg-base text-gray-900 dark:text-white transition-colors duration-200">
    <div v-if="auth.loading" class="flex items-center justify-center min-h-screen">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
    <RouterView v-else />
  </div>
</template>
