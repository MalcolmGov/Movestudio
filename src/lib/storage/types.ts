/**
 * Storage provider interface — abstracts project + user persistence away
 * from localStorage. Swap implementations by setting VITE_STORAGE_PROVIDER.
 *
 * Week 1: LocalStorageProvider only (existing behaviour).
 * Week 2: SupabaseStorageProvider wired up with real DB.
 *
 * All methods are async so callers don't have to change when the backing
 * store flips from sync localStorage to remote HTTP.
 */
import type { Project, AuthUser, ActivityEvent } from '../../types'

export interface StorageProvider {
  // ── User / auth ─────────────────────────────────────────────────────────
  getUser(): Promise<AuthUser | null>
  setUser(u: AuthUser): Promise<void>
  clearUser(): Promise<void>

  // ── Projects ────────────────────────────────────────────────────────────
  listProjects(): Promise<Project[]>
  getProject(id: string): Promise<Project | null>
  saveProject(p: Project): Promise<void>
  deleteProject(id: string): Promise<void>

  // ── Activity log ────────────────────────────────────────────────────────
  logActivity(projectId: string, action: string, detail: string, icon?: string): Promise<void>
  getActivity(projectId: string): Promise<ActivityEvent[]>
}

export type ProviderKind = 'local' | 'supabase'
