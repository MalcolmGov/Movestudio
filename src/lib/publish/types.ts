/**
 * Publish service — takes a Project and deploys it to a public URL.
 *
 * Week 1: LocalPublishService (download HTML, same as current export).
 * Week 2: VercelPublishService (deploys to {slug}.movedigital.africa).
 */
import type { Project } from '../../types'

export interface PublishResult {
  url: string | null     // Live URL if hosted, null if local download only
  ok: boolean
  message: string
  localHtmlBlob?: Blob   // For download-only mode
}

export interface PublishService {
  /** Validate the project can be published (has at least one enabled section, has a name, etc.) */
  canPublish(project: Project): { ok: boolean; reason?: string }

  /** Publish the project. Returns live URL (if hosted) or blob (if local). */
  publish(project: Project): Promise<PublishResult>
}

export type PublishKind = 'local' | 'vercel'
