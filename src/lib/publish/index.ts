/**
 * Publish factory — pick provider from env, return a singleton.
 *
 * Caller must supply the HTML renderer (lives in WebsiteBuilderPage).
 * We don't import the renderer here to avoid circular deps.
 */
import { LocalPublishService } from './local'
import { VercelPublishService } from './vercel'
import type { PublishService, PublishKind } from './types'
import type { Project } from '../../types'

export type { PublishService, PublishResult, PublishKind } from './types'

export function createPublishService(renderHtml: (project: Project) => string): PublishService {
  const kind = (import.meta.env.VITE_PUBLISH_PROVIDER as PublishKind | undefined) ?? 'local'

  if (kind === 'vercel') {
    const apiUrl = import.meta.env.VITE_PUBLISH_API_URL as string | undefined
    const domainRoot = import.meta.env.VITE_PUBLISH_DOMAIN_ROOT as string | undefined
    if (!apiUrl || !domainRoot) {
      console.warn('[publish] VITE_PUBLISH_PROVIDER=vercel but VITE_PUBLISH_API_URL/VITE_PUBLISH_DOMAIN_ROOT missing — falling back to local download.')
      return new LocalPublishService(renderHtml)
    }
    return new VercelPublishService(apiUrl, domainRoot, renderHtml)
  }

  return new LocalPublishService(renderHtml)
}
