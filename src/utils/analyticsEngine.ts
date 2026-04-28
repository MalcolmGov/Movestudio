// Analytics Engine — generates plausible simulated metrics from saved ad history

export interface PostMetric {
  id: string
  date: string
  platform: string
  format: string
  type: string
  impressions: number
  clicks: number
  engagement: number  // likes + comments + shares
  reach: number
  ctr: number         // clicks / impressions
  engagementRate: number // engagement / reach
}

export interface PlatformSummary {
  platform: string
  icon: string
  impressions: number
  clicks: number
  engagement: number
  ctr: number
  color: string
}

export interface AnalyticsSummary {
  totalImpressions: number
  totalClicks: number
  totalEngagement: number
  avgCtr: number
  avgEngagementRate: number
  posts: PostMetric[]
  platforms: PlatformSummary[]
  weeklyTrend: { week: string; impressions: number; clicks: number; engagement: number }[]
  bestPost: PostMetric | null
  growth: { impressions: number; clicks: number; engagement: number } // % vs prior period
}

const PLATFORM_META: Record<string, { icon: string; color: string; baseImpressions: number; baseCtr: number }> = {
  'instagram-post':  { icon: '📷', color: '#E1306C', baseImpressions: 2800, baseCtr: 0.025 },
  'instagram-reel':  { icon: '🎬', color: '#833AB4', baseImpressions: 5200, baseCtr: 0.038 },
  'instagram-story': { icon: '⭕', color: '#E1306C', baseImpressions: 1900, baseCtr: 0.018 },
  'facebook-ad':     { icon: '📘', color: '#1877F2', baseImpressions: 3400, baseCtr: 0.022 },
  'facebook-reel':   { icon: '🎥', color: '#1877F2', baseImpressions: 4100, baseCtr: 0.031 },
  'linkedin-post':   { icon: '💼', color: '#0A66C2', baseImpressions: 1600, baseCtr: 0.045 },
  'twitter-x':       { icon: '𝕏',  color: '#1DA1F2', baseImpressions: 2100, baseCtr: 0.028 },
}

function jitter(base: number, variance = 0.3): number {
  return Math.round(base * (1 + (Math.random() - 0.5) * variance))
}

function seededRandom(seed: string): () => number {
  // Simple deterministic hash so same inputs = same metrics
  let h = 0
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5
    return ((h >>> 0) / 0xFFFFFFFF)
  }
}

export function generateAnalytics(
  savedAdCount: number,
  industry: string,
  formats: string[]
): AnalyticsSummary {
  // Generate synthetic posts for the last 28 days
  const posts: PostMetric[] = []
  const count = Math.max(savedAdCount, 8) // always show at least 8 data points

  for (let i = 0; i < count; i++) {
    const format = formats[i % formats.length] || 'instagram-post'
    const meta = PLATFORM_META[format] || PLATFORM_META['instagram-post']
    const rand = seededRandom(`${industry}-${format}-${i}`)
    const dayOffset = Math.floor(rand() * 28)
    const date = new Date()
    date.setDate(date.getDate() - dayOffset)

    const impressions = jitter(meta.baseImpressions * (1 + savedAdCount * 0.05))
    const clicks = Math.round(impressions * (meta.baseCtr + (rand() - 0.5) * 0.01))
    const reach = Math.round(impressions * 0.72)
    const engagement = Math.round(reach * (0.04 + rand() * 0.06))

    posts.push({
      id: `post-${i}`,
      date: date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }),
      platform: format,
      format: PLATFORM_META[format]?.icon || '📣',
      type: format.split('-')[0],
      impressions,
      clicks,
      engagement,
      reach,
      ctr: Math.round((clicks / impressions) * 1000) / 10,
      engagementRate: Math.round((engagement / reach) * 1000) / 10,
    })
  }

  // Platform breakdown
  const platformMap: Record<string, PlatformSummary> = {}
  posts.forEach(p => {
    const meta = PLATFORM_META[p.platform]
    if (!platformMap[p.platform]) {
      platformMap[p.platform] = { platform: p.platform, icon: meta?.icon || '📣', color: meta?.color || '#888', impressions: 0, clicks: 0, engagement: 0, ctr: 0 }
    }
    platformMap[p.platform].impressions += p.impressions
    platformMap[p.platform].clicks += p.clicks
    platformMap[p.platform].engagement += p.engagement
  })
  const platforms = Object.values(platformMap).map(p => ({
    ...p,
    ctr: Math.round((p.clicks / p.impressions) * 1000) / 10,
  })).sort((a, b) => b.impressions - a.impressions)

  // Weekly trend (last 4 weeks)
  const weeklyTrend = [0, 1, 2, 3].map(w => {
    const weekPosts = posts.filter(p => {
      const dayAgo = new Date(); dayAgo.setDate(dayAgo.getDate() - w * 7)
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - (w + 1) * 7)
      const d = new Date(p.date)
      return d >= weekAgo && d <= dayAgo
    })
    const label = w === 0 ? 'This week' : w === 1 ? 'Last week' : `${w + 1} weeks ago`
    return {
      week: label,
      impressions: weekPosts.reduce((a, p) => a + p.impressions, 0) || jitter(8000),
      clicks: weekPosts.reduce((a, p) => a + p.clicks, 0) || jitter(220),
      engagement: weekPosts.reduce((a, p) => a + p.engagement, 0) || jitter(640),
    }
  }).reverse()

  const totalImpressions = posts.reduce((a, p) => a + p.impressions, 0)
  const totalClicks = posts.reduce((a, p) => a + p.clicks, 0)
  const totalEngagement = posts.reduce((a, p) => a + p.engagement, 0)
  const bestPost = posts.reduce((best, p) => (!best || p.engagementRate > best.engagementRate ? p : best), null as PostMetric | null)

  return {
    totalImpressions,
    totalClicks,
    totalEngagement,
    avgCtr: Math.round((totalClicks / totalImpressions) * 1000) / 10,
    avgEngagementRate: Math.round(posts.reduce((a, p) => a + p.engagementRate, 0) / posts.length * 10) / 10,
    posts,
    platforms,
    weeklyTrend,
    bestPost,
    growth: {
      impressions: Math.round((Math.random() * 40) - 5),
      clicks: Math.round((Math.random() * 35) - 3),
      engagement: Math.round((Math.random() * 50) - 8),
    },
  }
}
