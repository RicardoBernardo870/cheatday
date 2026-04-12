import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase, type Profile } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import router from '@/router';

/** Avoid stacking Supabase auth listeners when App remounts (e.g. Vite HMR). */
let authStateSubscription: { unsubscribe: () => void } | null = null;

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const profile = ref<Profile | null>(null);
  const loading = ref<boolean>(true);

  const isLoggedIn = computed(() => !!user.value);
  const needsOnboarding = computed(() => isLoggedIn.value && !profile.value?.onboarding_complete);

  const init = async () => {
    loading.value = true;
    const {
      data: { session: s },
    } = await supabase.auth.getSession();
    session.value = s;
    user.value = s?.user ?? null;

    if (user.value) await fetchProfile();

    if (!authStateSubscription) {
      const { data } = supabase.auth.onAuthStateChange(async (_, s) => {
        session.value = s;
        user.value = s?.user ?? null;
        if (user.value) {
          await fetchProfile();
        } else {
          profile.value = null;
        }
      });
      authStateSubscription = data.subscription;
    }

    loading.value = false;
  };

  const fetchProfile = async () => {
    if (!user.value) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single();
    if (!error && data) profile.value = data as Profile;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    user.value = null;
    session.value = null;
    profile.value = null;
    router.push({ name: 'login' });
  };

  const updateProfile = async (
    updates: Partial<
      Pick<Profile, 'display_name' | 'cheat_percentage' | 'meals_per_day' | 'onboarding_complete'>
    >
  ) => {
    if (!user.value) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
      .select()
      .single();
    if (error) throw error;
    if (data) profile.value = data as Profile;
  };

  return {
    user,
    session,
    profile,
    loading,
    isLoggedIn,
    needsOnboarding,
    init,
    fetchProfile,
    signUp,
    signIn,
    signInWithMagicLink,
    signOut,
    updateProfile,
  };
});
