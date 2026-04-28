import { GeneratedAd, AdFormat, AdTone } from './adCopyEngine'

export interface AdScore {
  hook: number
  cta: number
  brandConsistency: number
  hashtagStrength: number
  overall: number
  grade: 'weak' | 'good' | 'strong'
  tips: string[]
}

const POWER_WORDS = ['new', 'free', 'now', 'limited', 'exclusive', 'proven', 'instant', 'secret', 'guaranteed', 'biggest', 'fastest', 'easiest', 'save', 'win', 'launch', 'introducing', 'announcing', 'disrupt', 'game-changing', 'transform', 'unlock', 'boost', 'skyrocket', 'revolutionary']
const WEAK_WORDS = ['good', 'nice', 'great', 'stuff', 'things', 'maybe', 'perhaps', 'try', 'some']
const STRONG_CTAS = ['get', 'start', 'join', 'discover', 'unlock', 'claim', 'book', 'sign up', 'download', 'try', 'buy', 'shop', 'reserve', 'watch', 'learn']

function scoreHook(headline: string): { score: number; tip: string | null } {
  const lower = headline.toLowerCase()
  const wordCount = headline.split(' ').length
  let score = 50

  // Power words boost
  const powerCount = POWER_WORDS.filter(w => lower.includes(w)).length
  score += Math.min(powerCount * 12, 30)

  // Weak words penalty
  const weakCount = WEAK_WORDS.filter(w => lower.includes(w)).length
  score -= weakCount * 10

  // Optimal length 5–12 words
  if (wordCount >= 5 && wordCount <= 12) score += 10
  else if (wordCount < 4 || wordCount > 18) score -= 15

  // Question mark or exclamation boosts engagement
  if (headline.includes('?') || headline.includes('!')) score += 8

  // Numbers are proven to increase CTR
  if (/\d/.test(headline)) score += 8

  // All-caps words (urgency signal)
  if (/[A-Z]{2,}/.test(headline)) score += 5

  score = Math.max(10, Math.min(100, score))

  const tip = score < 60
    ? 'Add a power word (Free, Now, Exclusive) or a number to your headline to boost CTR.'
    : score < 80
    ? 'Try starting with an action verb or a bold claim to make the hook punchier.'
    : null

  return { score, tip }
}

function scoreCta(cta: string): { score: number; tip: string | null } {
  const lower = cta.toLowerCase()
  let score = 40

  // Starts with action verb
  const hasActionVerb = STRONG_CTAS.some(v => lower.startsWith(v))
  if (hasActionVerb) score += 35

  // Short CTAs convert better (2–5 words)
  const wordCount = cta.split(' ').length
  if (wordCount >= 2 && wordCount <= 5) score += 15
  else if (wordCount > 7) score -= 20

  // Urgency words
  if (/now|today|limited|last chance|hurry|soon/i.test(cta)) score += 10

  score = Math.max(10, Math.min(100, score))

  const tip = score < 60
    ? `Start your CTA with a strong verb: "Get", "Claim", "Start", "Join", "Unlock"`
    : score < 80
    ? `Add urgency: "Get Started Now" or "Claim Your Free Trial Today" converts better.`
    : null

  return { score, tip }
}

function scoreBrandConsistency(ad: GeneratedAd, primaryColor: string, font: string): { score: number; tip: string | null } {
  let score = 70 // Base — brand kit is always applied

  // Has emoji (visual consistency)
  if (ad.emojiSet[0]) score += 10

  // Has brand hashtag
  if (ad.hashtags.some(h => h.length > 1)) score += 10

  // Headline and body tonally consistent (rough check: both non-empty)
  if (ad.headline && ad.body && ad.subheadline) score += 10

  score = Math.max(10, Math.min(100, score))

  const tip = score < 80
    ? 'Make sure your logo is uploaded and your brand colors are applied to the ad canvas.'
    : null

  return { score, tip }
}

function scoreHashtags(hashtags: string[], industry: string): { score: number; tip: string | null } {
  let score = 40
  const count = hashtags.length

  // Optimal 5–8 hashtags
  if (count >= 5 && count <= 8) score += 30
  else if (count >= 3 && count < 5) score += 15
  else if (count > 10) score -= 10

  // Has a brand hashtag (short, unique)
  const brandTag = hashtags.find(h => h.length <= 12)
  if (brandTag) score += 15

  // Mix of lengths (popular + niche)
  const short = hashtags.filter(h => h.length <= 10).length
  const long = hashtags.filter(h => h.length > 10).length
  if (short > 0 && long > 0) score += 15

  score = Math.max(10, Math.min(100, score))

  const tip = score < 60
    ? `Use 5–8 hashtags. Mix broad (#${industry.toLowerCase()}) with niche (#${industry.toLowerCase()}tips).`
    : score < 80
    ? 'Add 1–2 niche hashtags specific to your audience to improve discovery.'
    : null

  return { score, tip }
}

export function scoreAd(ad: GeneratedAd, opts: { primaryColor: string; font: string; industry: string }): AdScore {
  const hook = scoreHook(ad.headline)
  const cta = scoreCta(ad.cta)
  const brand = scoreBrandConsistency(ad, opts.primaryColor, opts.font)
  const hashtags = scoreHashtags(ad.hashtags, opts.industry)

  const overall = Math.round((hook.score * 0.35) + (cta.score * 0.30) + (brand.score * 0.20) + (hashtags.score * 0.15))

  const tips = [hook.tip, cta.tip, brand.tip, hashtags.tip].filter((t): t is string => !!t)

  const grade: AdScore['grade'] = overall >= 75 ? 'strong' : overall >= 50 ? 'good' : 'weak'

  return { hook: hook.score, cta: cta.score, brandConsistency: brand.score, hashtagStrength: hashtags.score, overall, grade, tips }
}

export const GRADE_META = {
  weak:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   label: 'Needs Work',  emoji: '🔴' },
  good:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  label: 'Good',        emoji: '🟡' },
  strong: { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)', label: 'Strong',      emoji: '🟢' },
}
