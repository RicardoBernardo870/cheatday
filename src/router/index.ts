import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/pages/OnboardingPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/HomePage.vue')
        },
        {
          path: 'stats',
          name: 'stats',
          component: () => import('@/pages/StatsPage.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/SettingsPage.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  if (to.meta.requiresGuest && isLoggedIn) {
    return { name: 'home' }
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: 'login' }
  }

  if (isLoggedIn && to.name !== 'onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', session!.user.id)
      .single()

    if (profile && !profile.onboarding_complete) {
      return { name: 'onboarding' }
    }
  }
})

export default router
