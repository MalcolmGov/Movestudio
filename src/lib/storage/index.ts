/**
 * Storage factory — pick provider from env, return a singleton.
 *
 * Usage:
 *   import { storage } from './lib/storage'
 *   const projects = await storage.listProjects()
 */
import { LocalStorageProvider } from './local'
import { SupabaseStorageProvider } from './supabase'
import type { StorageProvider, ProviderKind } from './types'

export type { StorageProvider, ProviderKind } from './types'

function createProvider(): StorageProvider {
  const kind = (import.meta.env.VITE_STORAGE_PROVIDER as ProviderKind | undefined) ?? 'local'

  if (kind === 'supabase') {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
    if (!url || !key) {
      console.warn('[storage] VITE_STORAGE_PROVIDER=supabase but VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY missing — falling back to localStorage.')
      return new LocalStorageProvider()
    }
    return new SupabaseStorageProvider(url, key)
  }

  return new LocalStorageProvider()
}

export const storage: StorageProvider = createProvider()
