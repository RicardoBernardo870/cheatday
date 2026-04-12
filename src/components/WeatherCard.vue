<script setup lang="ts">
import { computed } from 'vue';
import { useLimits } from '@/composables/useLimits';

const limits = useLimits();

type WeatherState = 'chill' | 'rain' | 'storm';

const weatherState = computed<WeatherState>(() => {
  const warning = limits.monthlyWarning.value;
  if (warning === 'red') return 'storm';
  if (warning === 'orange' || warning === 'yellow') return 'rain';
  return 'chill';
});

const stateLabel = computed(() => {
  if (weatherState.value === 'storm') return 'Over limit!';
  if (weatherState.value === 'rain') return 'Getting wet!';
  return 'Smooth sailing';
});

const stateColor = computed(() => {
  if (weatherState.value === 'storm') return 'text-danger';
  if (weatherState.value === 'rain') return 'text-warn';
  return 'text-success';
});

// Generate staggered rain drops
const rainDrops = Array.from({ length: 15 }, (_, i) => ({
  x: 10 + (i * 26) % 390,
  delay: (i * 0.13) % 1.2,
  duration: 0.8 + (i % 4) * 0.15,
}));

const stormDrops = Array.from({ length: 25 }, (_, i) => ({
  x: 5 + (i * 16) % 395,
  delay: (i * 0.08) % 0.8,
  duration: 0.5 + (i % 3) * 0.1,
}));
</script>

<template>
  <div
    class="glass-card rounded-2xl overflow-hidden relative"
    role="img"
    :aria-label="`Cheat meal weather: ${stateLabel}. ${limits.monthlyCount.value} of ${limits.monthlyLimit.value} meals used.`"
  >
    <!-- Scene container with cross-fade transition -->
    <Transition name="weather-fade" mode="out-in">
      <!-- ═══ CHILL SCENE ═══ -->
      <div v-if="weatherState === 'chill'" key="chill" class="scene">
        <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
          <defs>
            <linearGradient id="sky-chill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#87CEEB" />
              <stop offset="60%" stop-color="#b0e0f0" />
              <stop offset="100%" stop-color="#ffe4b5" />
            </linearGradient>
            <radialGradient id="sun-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stop-color="rgba(255,220,100,0.9)" />
              <stop offset="60%" stop-color="rgba(255,200,60,0.3)" />
              <stop offset="100%" stop-color="rgba(255,200,60,0)" />
            </radialGradient>
          </defs>

          <!-- Sky -->
          <rect width="400" height="160" fill="url(#sky-chill)" />

          <!-- Sun -->
          <circle cx="320" cy="35" r="40" fill="url(#sun-glow)" class="sun-pulse" />
          <circle cx="320" cy="35" r="18" fill="#FFD700" />

          <!-- Water -->
          <path class="wave wave-back" d="M0,125 Q50,115 100,125 T200,125 T300,125 T400,125 V160 H0 Z" fill="rgba(0,150,200,0.25)" />
          <path class="wave wave-front" d="M0,130 Q50,120 100,130 T200,130 T300,130 T400,130 V160 H0 Z" fill="rgba(0,120,180,0.3)" />

          <!-- Sand -->
          <rect x="0" y="140" width="400" height="20" fill="#f5deb3" opacity="0.5" />

          <!-- Beach umbrella -->
          <line x1="100" y1="70" x2="100" y2="135" stroke="#8B4513" stroke-width="3" />
          <path d="M65,72 Q100,40 135,72" fill="#FF6347" />
          <path d="M65,72 Q82,55 100,72" fill="#FF4500" />
          <path d="M100,72 Q118,55 135,72" fill="#FF4500" />

          <!-- Person on lounger -->
          <text x="115" y="132" font-size="32" text-anchor="middle">🏖️</text>

          <!-- Coconut drink -->
          <text x="155" y="128" font-size="20" text-anchor="middle">🥥</text>

          <!-- Birds -->
          <text x="200" y="30" font-size="12" class="cloud-drift">🕊️</text>
          <text x="260" y="45" font-size="10" class="cloud-drift" style="animation-delay: -3s">🕊️</text>
        </svg>
      </div>

      <!-- ═══ RAIN SCENE ═══ -->
      <div v-else-if="weatherState === 'rain'" key="rain" class="scene">
        <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
          <defs>
            <linearGradient id="sky-rain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#5a6a7a" />
              <stop offset="100%" stop-color="#8a9aaa" />
            </linearGradient>
          </defs>

          <!-- Sky -->
          <rect width="400" height="160" fill="url(#sky-rain)" />

          <!-- Clouds -->
          <g class="cloud-drift">
            <ellipse cx="80" cy="30" rx="50" ry="20" fill="#6b7b8b" />
            <ellipse cx="110" cy="25" rx="40" ry="18" fill="#7b8b9b" />
            <ellipse cx="60" cy="28" rx="35" ry="16" fill="#8090a0" />
          </g>
          <g class="cloud-drift" style="animation-delay: -4s">
            <ellipse cx="280" cy="35" rx="55" ry="22" fill="#6b7b8b" />
            <ellipse cx="310" cy="30" rx="40" ry="18" fill="#7b8b9b" />
            <ellipse cx="255" cy="32" rx="35" ry="15" fill="#8090a0" />
          </g>

          <!-- Rain drops -->
          <line
            v-for="(drop, i) in rainDrops"
            :key="i"
            :x1="drop.x"
            :y1="-10"
            :x2="drop.x - 3"
            :y2="0"
            stroke="rgba(180,210,240,0.6)"
            stroke-width="1.5"
            stroke-linecap="round"
            class="rain-drop"
            :style="{ animationDelay: `${drop.delay}s`, animationDuration: `${drop.duration}s` }"
          />

          <!-- Wet ground -->
          <rect x="0" y="130" width="400" height="30" fill="rgba(80,100,120,0.3)" />

          <!-- Puddles -->
          <ellipse cx="120" cy="148" rx="30" ry="4" fill="rgba(150,180,210,0.3)" />
          <ellipse cx="300" cy="145" rx="25" ry="3" fill="rgba(150,180,210,0.25)" />

          <!-- Person with umbrella -->
          <text x="200" y="130" font-size="36" text-anchor="middle">😟</text>
          <text x="200" y="95" font-size="28" text-anchor="middle">☂️</text>

          <!-- Wet lounger -->
          <text x="130" y="142" font-size="18" text-anchor="middle" opacity="0.7">🪑</text>
        </svg>
      </div>

      <!-- ═══ STORM SCENE ═══ -->
      <div v-else key="storm" class="scene">
        <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" class="w-full h-full">
          <defs>
            <linearGradient id="sky-storm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1a1a2e" />
              <stop offset="50%" stop-color="#2d2d44" />
              <stop offset="100%" stop-color="#3a3a55" />
            </linearGradient>
          </defs>

          <!-- Sky -->
          <rect width="400" height="160" fill="url(#sky-storm)" />

          <!-- Lightning bolt -->
          <path
            class="lightning"
            d="M250,5 L240,45 L260,45 L235,95 L255,95 L220,145"
            fill="none"
            stroke="#FFE566"
            stroke-width="3"
            stroke-linejoin="bevel"
          />
          <!-- Second lightning -->
          <path
            class="lightning lightning-2"
            d="M340,10 L332,40 L348,40 L325,80"
            fill="none"
            stroke="#FFE566"
            stroke-width="2"
            stroke-linejoin="bevel"
          />

          <!-- Dense clouds -->
          <g class="cloud-drift" style="animation-duration: 6s">
            <ellipse cx="100" cy="22" rx="70" ry="24" fill="#2a2a3e" />
            <ellipse cx="140" cy="18" rx="50" ry="20" fill="#333350" />
            <ellipse cx="70" cy="20" rx="45" ry="18" fill="#383858" />
          </g>
          <g class="cloud-drift" style="animation-delay: -2s; animation-duration: 5s">
            <ellipse cx="300" cy="25" rx="65" ry="22" fill="#2a2a3e" />
            <ellipse cx="340" cy="20" rx="50" ry="20" fill="#333350" />
            <ellipse cx="270" cy="22" rx="40" ry="16" fill="#383858" />
          </g>

          <!-- Heavy rain -->
          <line
            v-for="(drop, i) in stormDrops"
            :key="i"
            :x1="drop.x"
            :y1="-10"
            :x2="drop.x - 6"
            :y2="5"
            stroke="rgba(160,190,220,0.5)"
            stroke-width="1.5"
            stroke-linecap="round"
            class="rain-drop storm-rain"
            :style="{ animationDelay: `${drop.delay}s`, animationDuration: `${drop.duration}s` }"
          />

          <!-- Flooded ground -->
          <rect x="0" y="125" width="400" height="35" fill="rgba(40,60,80,0.5)" />
          <path class="wave wave-storm" d="M0,130 Q30,126 60,130 T120,130 T180,130 T240,130 T300,130 T360,130 T400,130 V160 H0 Z" fill="rgba(60,80,110,0.3)" />

          <!-- Person struggling -->
          <text x="200" y="125" font-size="36" text-anchor="middle">😫</text>

          <!-- Broken umbrella -->
          <text x="210" y="90" font-size="24" text-anchor="middle" style="transform: rotate(25deg); transform-origin: 210px 85px">🌂</text>

          <!-- Wind indicator -->
          <text x="130" y="80" font-size="20" class="wind-blow">💨</text>
          <text x="280" y="110" font-size="16" class="wind-blow" style="animation-delay: -1.5s">💨</text>
        </svg>
      </div>
    </Transition>

    <!-- Glass overlay with count -->
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent px-4 py-3 flex items-end justify-between">
      <div>
        <p :class="['text-sm font-bold', stateColor]">{{ stateLabel }}</p>
      </div>
      <div class="text-right">
        <span class="text-2xl font-bold text-white tabular-nums">
          {{ limits.monthlyCount.value }}
        </span>
        <span class="text-sm text-white/60"> / {{ limits.monthlyLimit.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene {
  height: 160px;
}

/* ── Cross-fade transition ─────────────────────────────────────────────── */
.weather-fade-enter-active,
.weather-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.weather-fade-enter-from,
.weather-fade-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* ── Wave animation ────────────────────────────────────────────────────── */
.wave {
  animation: wave-drift 4s ease-in-out infinite;
}
.wave-back {
  animation-duration: 5s;
  animation-direction: reverse;
}
.wave-storm {
  animation-duration: 2s;
}

@keyframes wave-drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-15px); }
}

/* ── Rain animation ────────────────────────────────────────────────────── */
.rain-drop {
  animation: rain-fall 1s linear infinite;
}
.storm-rain {
  animation-name: rain-fall-heavy;
}

@keyframes rain-fall {
  0% { transform: translateY(-20px); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.5; }
  100% { transform: translateY(170px); opacity: 0; }
}

@keyframes rain-fall-heavy {
  0% { transform: translateY(-20px) translateX(0); opacity: 0; }
  10% { opacity: 0.6; }
  90% { opacity: 0.4; }
  100% { transform: translateY(180px) translateX(-10px); opacity: 0; }
}

/* ── Lightning animation ───────────────────────────────────────────────── */
.lightning {
  opacity: 0;
  animation: lightning-flash 4s ease infinite;
  filter: drop-shadow(0 0 8px rgba(255, 229, 102, 0.8));
}
.lightning-2 {
  animation-delay: 1.8s;
  animation-duration: 5s;
}

@keyframes lightning-flash {
  0%, 44%, 50%, 54%, 100% { opacity: 0; }
  45% { opacity: 1; }
  46% { opacity: 0.2; }
  47%, 49% { opacity: 0; }
  51% { opacity: 0.9; }
  53% { opacity: 0.3; }
}

/* ── Cloud drift ───────────────────────────────────────────────────────── */
.cloud-drift {
  animation: cloud-drift 8s ease-in-out infinite;
}

@keyframes cloud-drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(12px); }
}

/* ── Sun pulse ─────────────────────────────────────────────────────────── */
.sun-pulse {
  animation: sun-pulse 3s ease-in-out infinite;
}

@keyframes sun-pulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}

/* ── Wind blow ─────────────────────────────────────────────────────────── */
.wind-blow {
  animation: wind-blow 2s ease-in-out infinite;
}

@keyframes wind-blow {
  0%, 100% { transform: translateX(0); opacity: 0.6; }
  50% { transform: translateX(-20px); opacity: 1; }
}

/* ── Accessibility ─────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .wave,
  .rain-drop,
  .lightning,
  .cloud-drift,
  .sun-pulse,
  .wind-blow {
    animation: none !important;
  }
  .lightning {
    opacity: 0.5;
  }
}
</style>
