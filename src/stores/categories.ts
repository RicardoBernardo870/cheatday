import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, type Category } from '@/lib/supabase'
import { useAuthStore } from './auth'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (!error && data) categories.value = data as Category[]
    loading.value = false
  }

  async function addCustomCategory(name: string, icon: string, color: string) {
    const auth = useAuthStore()
    if (!auth.user) return

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: auth.user.id,
        name,
        icon,
        color,
        sort_order: categories.value.length + 1
      })
      .select()
      .single()

    if (error) throw error
    if (data) categories.value.push(data as Category)
  }

  async function toggleCategory(id: string, isActive: boolean) {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: isActive })
      .eq('id', id)

    if (error) throw error
    const cat = categories.value.find(c => c.id === id)
    if (cat) cat.is_active = isActive
  }

  return { categories, loading, fetch, addCustomCategory, toggleCategory }
})
