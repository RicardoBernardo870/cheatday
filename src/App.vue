<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Toast } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/auth'
import { useMealsStore } from '@/stores/meals'
import { useTheme } from '@/composables/useTheme'

const auth = useAuthStore()
const meals = useMealsStore()
const theme = useTheme()
const toast = useToast()

const syncWhenBackOnline = () => {
  void meals.syncIfOnline()
}

onMounted(async () => {
  theme.init()
  await auth.init()
  window.addEventListener('focus', syncWhenBackOnline)
  window.addEventListener('online', syncWhenBackOnline)
})

onUnmounted(() => {
  window.removeEventListener('focus', syncWhenBackOnline)
  window.removeEventListener('online', syncWhenBackOnline)
})
</script>

<template>
  <div class="min-h-screen bg-base transition-colors duration-300" style="color: var(--color-text)">
    <div v-if="auth.loading" class="flex items-center justify-center min-h-screen">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
    <RouterView v-else v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <Toast group="meal" position="bottom-right">
      <template #message="{ message }">
        <div class="flex items-center justify-between w-full gap-4">
          <span class="font-semibold text-sm">{{ message.summary }}</span>
          <button
            v-if="(message as any).data?.canUndo !== false"
            @click="() => { meals.undoLastLog((message as any).data.categoryId); toast.remove(message) }"
            class="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white/15 shrink-0 hover:bg-white/25 active:scale-95 transition-all"
          >
            Undo
          </button>
        </div>
      </template>
    </Toast>
  </div>
</template>
