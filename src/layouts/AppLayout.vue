<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-1 overflow-y-auto pt-safe pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.name" />
        </Transition>
      </RouterView>
    </main>

    <nav class="pb-safe">
      <div class="glass-card fixed bottom-0 w-full flex justify-around items-center h-20 pb-safe">
        <RouterLink
          to="/"
          :class="[
            'flex flex-col items-center gap-1 text-xs transition-colors min-w-[44px] min-h-[44px] justify-center',
            route.name === 'home' ? 'text-primary' : 'text-muted',
          ]"
        >
          <span class="text-2xl">🍔</span>
          <span>Log</span>
        </RouterLink>

        <RouterLink
          to="/stats"
          :class="[
            'flex flex-col items-center gap-1 text-xs transition-colors min-w-[44px] min-h-[44px] justify-center',
            route.name === 'stats' ? 'text-primary' : 'text-muted',
          ]"
        >
          <span class="text-2xl">📊</span>
          <span>Stats</span>
        </RouterLink>

        <RouterLink
          to="/settings"
          :class="[
            'flex flex-col items-center gap-1 text-xs transition-colors min-w-[44px] min-h-[44px] justify-center',
            route.name === 'settings' ? 'text-primary' : 'text-muted',
          ]"
        >
          <span class="text-2xl">⚙️</span>
          <span>Settings</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>
