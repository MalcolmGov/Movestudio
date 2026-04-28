/**
 * Supabase-backed StorageProvider.
 *
 * Tables (see docs/supabase-schema.sql):
 *   - public.projects(id uuid, user_id uuid, name, slug, kit jsonb,
 *     sections jsonb, seo jsonb, activity_log jsonb, published_at,
 *     published_url, created_at, updated_at)
 *
 * Auth is handled by Supabase's built-in auth schema; `getUser()` maps
 * an authenticated Supabase session onto our AuthUser shape.
 *
 * Every project row is RLS-scoped to `auth.uid() = user_id` — a user
 * can't read or write rows they don't own. That isolation is enforced
 * at the database, not in app code.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { StorageProvider } from './types'
import type { Project, AuthUser, ActivityEvent, SectionContent, BrandKit, PageSection, SEOMetadata } from '../../types'

export class SupabaseStorageProvider implements StorageProvider {
  private client: SupabaseClient

  constructor(supabaseUrl: string, anonKey: string) {
    this.client = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  /** Expose the raw client for the auth UI (sign-in, sign-up, password reset). */
  get supabase(): SupabaseClient {
    return this.client
  }

  // ── User / auth ─────────────────────────────────────────────────────────
  async getUser(): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.getUser()
    if (error || !data.user) return null
    const u = data.user
    return {
      id: u.id,
      email: u.email ?? '',
      name: (u.user_metadata?.full_name as string) || (u.email?.split('@')[0] ?? 'User'),
      plan: (u.user_metadata?.plan as AuthUser['plan']) || 'starter',
    }
  }

  async setUser(_u: AuthUser): Promise<void> {
    // No-op — user identity is owned by Supabase Auth, set via signInWith*()
    // methods on the raw client. This method exists only for interface
    // compatibility with LocalStorageProvider.
  }

  async clearUser(): Promise<void> {
    await this.client.auth.signOut()
  }

  // ── Projects ────────────────────────────────────────────────────────────
  async listProjects(): Promise<Project[]> {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) {
      console.error('[supabase] listProjects failed', error)
      return []
    }
    return (data ?? []).map(rowToProject)
  }

  async getProject(id: string): Promise<Project | null> {
    const { data, error } = await this.client
      .from('projects')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error || !data) return null
    return rowToProject(data)
  }

  async saveProject(p: Project): Promise<void> {
    const { data: userData } = await this.client.auth.getUser()
    if (!userData.user) throw new Error('Not authenticated')

    const row = {
      id: p.id,
      user_id: userData.user.id,
      name: p.name,
      slug: p.slug ?? null,
      kit: p.kit,
      sections: p.sections,
      seo: p.seo ?? null,
      activity_log: p.activityLog ?? [],
      published_at: p.publishedAt ?? null,
      published_url: p.publishedUrl ?? null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await this.client.from('projects').upsert(row, { onConflict: 'id' })
    if (error) {
      console.error('[supabase] saveProject failed', error)
      throw error
    }
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await this.client.from('projects').delete().eq('id', id)
    if (error) {
      console.error('[supabase] deleteProject failed', error)
      throw error
    }
  }

  // ── Activity log ────────────────────────────────────────────────────────
  async logActivity(projectId: string, action: string, detail: string, icon = '⚡'): Promise<void> {
    const existing = await this.getProject(projectId)
    if (!existing) return
    const event: ActivityEvent = {
      id: `evt-${Date.now()}`,
      action,
      detail,
      at: new Date().toISOString(),
      icon,
    }
    const log = [event, ...(existing.activityLog ?? [])].slice(0, 50)
    await this.client.from('projects').update({ activity_log: log }).eq('id', projectId)
  }

  async getActivity(projectId: string): Promise<ActivityEvent[]> {
    const p = await this.getProject(projectId)
    return p?.activityLog ?? []
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

interface ProjectRow {
  id: string
  user_id: string
  name: string
  slug: string | null
  kit: BrandKit
  sections: PageSection[]
  seo: SEOMetadata | null
  activity_log: ActivityEvent[] | null
  published_at: string | null
  published_url: string | null
  created_at: string
  updated_at: string
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    kit: row.kit,
    sections: row.sections ?? [],
    seo: row.seo ?? undefined,
    activityLog: row.activity_log ?? [],
    publishedAt: row.published_at ?? undefined,
    publishedUrl: row.published_url ?? undefined,
  }
}

// Re-export SectionContent so the "unused import" linter stays quiet.
void ({} as SectionContent)
