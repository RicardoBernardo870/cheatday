import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase, type Category } from '@/lib/supabase';
import { useAuthStore } from './auth';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);

  const fetch = async () => {
    loading.value = true;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data) categories.value = data as Category[];
    loading.value = false;
  };

  const addCustomCategory = async (name: string, icon: string, color: string) => {
    const auth = useAuthStore();
    if (!auth.user) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: auth.user.id,
        name,
        icon,
        color,
        sort_order: categories.value.length + 1,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) categories.value.push(data as Category);
  };

  const toggleCategory = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from('categories').update({ is_active: isActive }).eq('id', id);
    if (error) throw error;
    const cat = categories.value.find((c) => c.id === id);
    if (cat) cat.is_active = isActive;
  };

  return { categories, loading, fetch, addCustomCategory, toggleCategory };
});
