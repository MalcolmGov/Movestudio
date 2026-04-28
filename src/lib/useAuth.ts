/**
 * useAuth — thin hook over the StorageProvider's getUser().
 *
 * For the Supabase provider, also subscribes to auth state changes so
 * the UI reacts instantly to sign-in / sign-out. For the localStorage
 * provider, getUser() just reads from localStorage on mount.
 */
import { useEffect, useState } from 'react'
import { storage } from './storage'
import { SupabaseStorageProvider } from './storage/supabase'
import type { AuthUser } from '../types'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    storage.getUser().then(u => {
      if (mounted) {
        setUser(u)
        setLoading(false)
      }
    })

    // Subscribe to Supabase auth state changes so the UI stays fresh.
    if (storage instanceof SupabaseStorageProvider) {
      const { data: sub } = storage.supabase.auth.onAuthStateChange(() => {
        storage.getUser().then(u => { if (mounted) setUser(u) })
      })
      return () => { mounted = false; sub.subscription.unsubscribe() }
    }

    return () => { mounted = false }
  }, [])

  return { user, loading, signedIn: !!user }
}
