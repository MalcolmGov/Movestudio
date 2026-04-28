/**
 * Vercel publish service — posts to our local /api/publish Vite middleware,
 * which holds the VERCEL_TOKEN server-side and calls the Vercel Deployments API.
 * Returns a live *.vercel.app URL within seconds. No git repo needed.
 */
import type { PublishService, PublishResult } from './types'
import type { Project } from '../../types'

export class VercelPublishService implements PublishService {
  constructor(
    private _apiUrl: string,
    private _domainRoot: string,
    private _renderHtml: (project: Project) => string,
  ) {}

  canPublish(project: Project): { ok: boolean; reason?: string } {
    if (!project.name?.trim()) return { ok: false, reason: 'Give your project a name before publishing.' }
    const enabled = project.sections.filter(s => s.enabled)
    if (enabled.length === 0) return { ok: false, reason: 'At least one section must be enabled.' }
    return { ok: true }
  }

  async publish(project: Project): Promise<PublishResult> {
    const check = this.canPublish(project)
    if (!check.ok) return { ok: false, url: null, message: check.reason ?? 'Cannot publish.' }

    const html = this._renderHtml(project)
    const slug = slugify(project.name)

    try {
      const res = await fetch(this._apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, html, projectName: project.name }),
      })

      const data = await res.json()

      if (!data.ok) {
        return { ok: false, url: null, message: data.error || 'Deployment failed. Check your VERCEL_TOKEN.' }
      }

      return {
        ok: true,
        url: data.url,
        message: `🎉 Live at ${data.url}`,
      }
    } catch (err: any) {
      return { ok: false, url: null, message: `Network error: ${err.message}` }
    }
  }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'site'
}
