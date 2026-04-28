/**
 * LocalStorage-backed provider — mirrors the existing Storage object in
 * types.ts but behind an async interface. No behaviour change.
 */
import type { StorageProvider } from './types'
import type { Project, AuthUser, ActivityEvent } from '../../types'

const KEY_USER = 'bs_user'
const KEY_PROJECTS = 'bs_projects'

function readProjects(): Project[] {
  try { return JSON.parse(localStorage.getItem(KEY_PROJECTS) || '[]') } catch { return [] }
}

function writeProjects(projects: Project[]): void {
  localStorage.setItem(KEY_PROJECTS, JSON.stringify(projects))
}

export class LocalStorageProvider implements StorageProvider {
  async getUser(): Promise<AuthUser | null> {
    try { return JSON.parse(localStorage.getItem(KEY_USER) || 'null') } catch { return null }
  }
  async setUser(u: AuthUser): Promise<void> {
    localStorage.setItem(KEY_USER, JSON.stringify(u))
  }
  async clearUser(): Promise<void> {
    localStorage.removeItem(KEY_USER)
  }

  async listProjects(): Promise<Project[]> {
    return readProjects()
  }
  async getProject(id: string): Promise<Project | null> {
    return readProjects().find(p => p.id === id) ?? null
  }
  async saveProject(p: Project): Promise<void> {
    const projects = readProjects().filter(x => x.id !== p.id)
    writeProjects([{ ...p, updatedAt: new Date().toISOString() }, ...projects])
  }
  async deleteProject(id: string): Promise<void> {
    writeProjects(readProjects().filter(p => p.id !== id))
  }

  async logActivity(projectId: string, action: string, detail: string, icon = '⚡'): Promise<void> {
    const projects = readProjects()
    const idx = projects.findIndex(p => p.id === projectId)
    if (idx === -1) return
    const event: ActivityEvent = { id: `evt-${Date.now()}`, action, detail, at: new Date().toISOString(), icon }
    projects[idx] = { ...projects[idx], activityLog: [event, ...(projects[idx].activityLog || [])].slice(0, 50) }
    writeProjects(projects)
  }
  async getActivity(projectId: string): Promise<ActivityEvent[]> {
    const p = readProjects().find(x => x.id === projectId)
    return p?.activityLog || []
  }
}
