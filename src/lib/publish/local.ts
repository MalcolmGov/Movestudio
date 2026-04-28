/**
 * Local publish service — triggers a browser download of the project's HTML.
 * Matches current "Export HTML" behaviour but behind the PublishService
 * interface so the UI can stay unchanged when we flip to a real host.
 */
import type { PublishService, PublishResult } from './types'
import type { Project } from '../../types'

export class LocalPublishService implements PublishService {
  /**
   * @param renderHtml  Caller-supplied function that turns a project into a
   *                    complete HTML document string. Kept as a dependency so
   *                    we don't duplicate the rendering logic that lives in
   *                    WebsiteBuilderPage's exportHtml().
   */
  constructor(private renderHtml: (project: Project) => string) {}

  canPublish(project: Project): { ok: boolean; reason?: string } {
    if (!project.name?.trim()) return { ok: false, reason: 'Project needs a name.' }
    const enabled = project.sections.filter(s => s.enabled)
    if (enabled.length === 0) return { ok: false, reason: 'At least one section must be enabled.' }
    return { ok: true }
  }

  async publish(project: Project): Promise<PublishResult> {
    const check = this.canPublish(project)
    if (!check.ok) {
      return { ok: false, url: null, message: check.reason ?? 'Cannot publish.' }
    }

    const html = this.renderHtml(project)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })

    // Trigger download in the browser.
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slugify(project.name)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return {
      ok: true,
      url: null,
      message: 'Published locally — downloaded as HTML. Hosted publishing lands Week 2.',
      localHtmlBlob: blob,
    }
  }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'site'
}
