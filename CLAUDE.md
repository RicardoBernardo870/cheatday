# CheatDay — Claude Project Memory

CheatDay is a Vue 3 + TypeScript PWA for tracking cheat meals against an 80/20 monthly budget. Data lives in Supabase with an IndexedDB offline mirror.

## Tech stack

- **Vue 3** (Composition API, `<script setup lang="ts">`) + **Vue Router 4**
- **Pinia** (setup-style stores) with `storeToRefs` at the call site
- **PrimeVue 4** unstyled, with a global passthrough in `src/primevue/pt.ts`
- **Tailwind 3** + custom CSS variables (`--color-text`, etc.) for light/dark theming
- **Supabase** (`@supabase/supabase-js`) for auth + persistence
- **idb** for IndexedDB offline queue (`src/services/offline.ts`)
- **Chart.js** + `vue-chartjs` for Stats page visualisations
- **Vite 7** with `vite-plugin-pwa` (Workbox), full PWA ready for iOS + Android
- **vue-tsc** for typecheck

## Conventions (follow these exactly)

- **Arrow functions** in `<script setup>`. No `function` keyword inside components/composables.
- **One component per file**, name in PascalCase, emits typed via `defineEmits<{ … }>()`.
- **Composables** live in `src/composables/useXxx.ts`, return plain refs/computeds.
- **Stores** live in `src/stores/xxx.ts`, setup syntax, export `useXxxStore`.
- **Glass design system**: reuse the `glass-card` class; gauge/progress uses CSS vars from `src/style.css`.
- **PrimeVue** components: style via `:pt` with `:ptOptions="{ mergeSections: false, mergeProps: false }"` when overriding root.
- **Toast** groups: `meal` group is reserved for meal-log feedback (see `App.vue`).
- **No emojis in code** unless the file already uses them (icons, UI copy). Don't sprinkle them in new logic.
- **Tailwind utility classes** over inline styles, except when a CSS var drives the value.
- **Safe areas**: respect `env(safe-area-inset-bottom)` / `pt-safe` on layout shells.

## File map (the parts that matter)

```
src/
  App.vue                       # app shell: auth init, online sync, meal toast
  main.ts                       # Pinia + Router + PrimeVue mount
  layouts/AppLayout.vue         # bottom nav, safe-area handling
  pages/
    HomePage.vue                # Log screen: WeatherCard + category grid
    StatsPage.vue               # Charts, MoM trend, balance hero
    SettingsPage.vue
  components/
    WeatherCard.vue             # CHE-18 animated weather scene
    CheatMealProgressBar.vue    # Compact monthly progress
    CategoryCard.vue            # Tap to log; undo via toast
    PastMealModal.vue           # CHE-14 log for past date
    BalanceHero.vue             # Semi-circular SVG gauge
    MomTrend.vue                # Month-over-month delta card
  stores/
    auth.ts categories.ts meals.ts stats.ts
  composables/
    useLimits.ts useTheme.ts useCheatInsights.ts
    useMomComparison.ts useBalanceScore.ts
  services/
    supabase.ts offline.ts
  primevue/pt.ts                # Global PrimeVue passthrough
vite.config.ts                  # PWA manifest + Workbox runtime caching
```

## Branch + PR policy

- **Protected branches**: never push directly to `main`/`master` or `dev`.
- **Base for new work**: always branch from `dev` (pulled fresh).
- **Branch name**: match Linear's `gitBranchName` for the issue (lowercased, e.g. `ricardobernardo/che-19-short-title`).
- **Commits**: Conventional-style summary, reference the Linear issue — `feat(CHE-19): add XYZ`.
  - Always include the `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` trailer.
- **PRs**: target `dev` (never `main`). Title starts with the Linear ID. Body has `## Summary` + `## Test plan`.
- **Never force-push** shared branches. Never `--no-verify`.

## Linear

- Team prefix: **CHE-**
- Workflow states used: Backlog → Todo → In Progress → In Review → Done
- When picking work, prefer **Todo** issues assigned to the current user; fall back to unassigned Backlog.
- When creating a new issue (ideation), write it with a crisp title, a short "Why" paragraph, and concrete acceptance criteria — small enough to finish in one session.

## Quality gates (must pass before any push)

Run from the repo root:

```bash
npx vue-tsc --noEmit      # typecheck — zero errors
npx vite build            # production build — must succeed
```

If the change touches UI animations, also verify `prefers-reduced-motion` disables them, and both themes render.

## PWA

- Manifest + icons are generated into `public/icons/` and wired via `vite.config.ts`.
- Don't regress: iOS apple-touch-icon, maskable Android icon, `theme-color` media queries in `index.html`.

## Autonomous workflow

- `/work` — run one full iteration (pick/create issue → branch → implement → verify → PR).
- `/ideate` — surface one concrete improvement and file a Linear issue (no code changes).
- `/loop /work` — run iterations back-to-back, self-paced, until stopped.

See `.claude/commands/work.md` and `.claude/commands/ideate.md` for the exact playbook.
