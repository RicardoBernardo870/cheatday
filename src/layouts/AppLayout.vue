<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-1 overflow-y-auto pt-safe">
      <RouterView />
    </main>

    <nav class="bg-card border-t border-border pb-safe">
      <div class="flex justify-around items-center h-16">

        <RouterLink to="/" :class="['flex flex-col items-center gap-1 text-xs transition-colors', route.name === 'home' ? 'text-primary' : 'text-muted']">
          <span class="text-2xl">🍔</span>
          <span>Log</span>
        </RouterLink>

        <RouterLink to="/stats" :class="['flex flex-col items-center gap-1 text-xs transition-colors', route.name === 'stats' ? 'text-primary' : 'text-muted']">
          <span class="text-2xl">📊</span>
          <span>Stats</span>
        </RouterLink>

        <RouterLink to="/settings" :class="['flex flex-col items-center gap-1 text-xs transition-colors', route.name === 'settings' ? 'text-primary' : 'text-muted']">
          <span class="text-2xl">⚙️</span>
          <span>Settings</span>
        </RouterLink>

      </div>
    </nav>
  </div>
</template>
