import { openDB } from 'idb'
import { supabase } from '@/lib/supabase'
import type { MealLog } from '@/lib/supabase'

const DB_NAME = 'cheatday-offline'
const STORE_NAME = 'meal-queue'

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'tempId', autoIncrement: true })
      }
    }
  })
}

export function useOfflineSync() {
  async function queueOfflineLog(log: Omit<MealLog, 'id' | 'created_at'>) {
    const db = await getDB()
    await db.add(STORE_NAME, { ...log, tempId: undefined })
  }

  async function syncOfflineQueue() {
    const db = await getDB()
    const all = await db.getAll(STORE_NAME)
    if (!all.length) return

    for (const item of all) {
      const { tempId, ...log } = item
      const { error } = await supabase.from('meal_logs').insert(log)
      if (!error) await db.delete(STORE_NAME, tempId)
    }
  }

  async function pendingCount(): Promise<number> {
    const db = await getDB()
    return db.count(STORE_NAME)
  }

  return { queueOfflineLog, syncOfflineQueue, pendingCount }
}
