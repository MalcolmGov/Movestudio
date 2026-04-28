// Deterministic ad copy engine — no API key needed.
// Swap generateAdCopy() body for a GPT-4 call when ready.

export type AdFormat = 'instagram-post' | 'instagram-story' | 'instagram-reel' | 'facebook-ad' | 'facebook-reel' | 'linkedin-post' | 'twitter-x'
export type AdType = 'product-launch' | 'sale-offer' | 'event-promo' | 'testimonial' | 'brand-awareness'
export type AdTone = 'professional' | 'bold' | 'playful' | 'minimal' | 'urgent'

export interface AdBrief {
  prompt: string
  industry: string
  tone: AdTone
  adType: AdType
  format: AdFormat
  brandName: string
  primaryColor: string
}

export interface GeneratedAd {
  headline: string
  subheadline: string
  body: string
  cta: string
  hashtags: string[]
  caption: string
  emojiSet: string[]
}

const INDUSTRY_HASHTAGS: Record<string, string[]> = {
  Fintech: ['#fintech', '#digitalbanking', '#payments', '#moneymatters', '#financialfreedom', '#startup', '#innovation'],
  'E-Commerce': ['#shopnow', '#ecommerce', '#onlineshopping', '#deals', '#sale', '#retail', '#shoppingonline'],
  SaaS: ['#saas', '#tech', '#productivity', '#softwaretools', '#remotework', '#startup', '#growthhacking'],
  Healthcare: ['#health', '#wellness', '#healthcare', '#medtech', '#wellbeing', '#digitalhealth', '#caregivers'],
  'Real Estate': ['#realestate', '#property', '#homeforsale', '#investment', '#luxuryliving', '#housing', '#propertyinvestment'],
  Education: ['#education', '#learning', '#edtech', '#skills', '#onlinelearning', '#growth', '#knowledge'],
  Agency: ['#digitalmarketing', '#branding', '#creative', '#designagency', '#marketing', '#socialmedia', '#agency'],
  Startup: ['#startup', '#entrepreneurship', '#innovation', '#founders', '#buildinpublic', '#venturecapital', '#disrupt'],
}

const TONE_PREFIXES: Record<AdTone, string[]> = {
  professional: ['Introducing', 'Announcing', 'Discover', 'Experience', 'Elevate your'],
  bold: ['This changes everything.', 'No more excuses.', 'Game over for the old way.', 'Disrupt or be disrupted.', 'Built different.'],
  playful: ['Plot twist! 🎉', 'Okay but hear us out —', 'Your brand called. It wants this.', 'Spoiler: it\'s incredible.', 'We just dropped something big 👀'],
  minimal: ['Simple.', 'Less noise.', 'One tool.', 'Just works.', 'Clear.'],
  urgent: ['Limited time only.', 'Offer ends soon.', 'Act now —', 'Don\'t miss this.', 'Last chance:'],
}

const AD_TYPE_TEMPLATES: Record<AdType, (brief: AdBrief) => Partial<GeneratedAd>> = {
  'product-launch': (b) => ({
    headline: `${TONE_PREFIXES[b.tone][Math.floor(Math.random() * 5)]} ${b.prompt || b.brandName}`,
    subheadline: `The ${b.industry} platform your team has been waiting for.`,
    body: `We've spent months building something that changes how ${b.industry} teams work. Today, it's yours. ${b.prompt ? b.prompt + '.' : ''} No setup fees. No vendor lock-in. Just results.`,
    cta: 'Get Early Access',
  }),
  'sale-offer': (b) => ({
    headline: b.tone === 'urgent' ? `⏰ ${b.prompt || 'Limited Offer'}` : `${b.prompt || 'Exclusive Offer'} — Today Only`,
    subheadline: `Save big on the tools your ${b.industry} team relies on.`,
    body: `For a limited time, unlock premium features at a fraction of the cost. ${b.prompt || 'This deal'} won't last long.`,
    cta: 'Claim Your Discount',
  }),
  'event-promo': (b) => ({
    headline: `You're invited. ${b.prompt || 'Join us.'}`,
    subheadline: `An exclusive event for ${b.industry} leaders.`,
    body: `Connect with the top minds in ${b.industry}. Learn. Network. Grow. ${b.prompt ? b.prompt + '.' : ''} Limited seats available.`,
    cta: 'Reserve Your Spot',
  }),
  'testimonial': (b) => ({
    headline: `"${b.prompt || `${b.brandName} transformed how we work.`}"`,
    subheadline: `Real results from real ${b.industry} teams.`,
    body: `Join hundreds of ${b.industry} companies who've already made the switch. See why they haven't looked back.`,
    cta: 'Read More Stories',
  }),
  'brand-awareness': (b) => ({
    headline: `${b.brandName} — Built for ${b.industry}.`,
    subheadline: b.prompt || `The platform that moves with you.`,
    body: `In a world of generic tools, ${b.brandName} is designed specifically for ${b.industry} teams who demand more. ${b.prompt || 'Modern. Fast. Yours.'}`,
    cta: 'Learn More',
  }),
}

const FORMAT_EMOJIS: Record<AdFormat, string[]> = {
  'instagram-post': ['✨', '🚀', '🎯', '💡', '🔥'],
  'instagram-story': ['👆', '⬆️', '💥', '🎉', '⚡'],
  'instagram-reel': ['🎬', '🔥', '⚡', '🎯', '💫'],
  'facebook-ad': ['👍', '📣', '💼', '🌍', '✅'],
  'facebook-reel': ['🎥', '🔥', '💡', '🎉', '🌟'],
  'linkedin-post': ['📈', '💼', '🤝', '🏆', '🎯'],
  'twitter-x': ['🧵', '👀', '🔥', '⚡', '💡'],
}

export function generateAdCopy(brief: AdBrief): GeneratedAd {
  const template = AD_TYPE_TEMPLATES[brief.adType](brief)
  const industryTags = INDUSTRY_HASHTAGS[brief.industry] || INDUSTRY_HASHTAGS['Startup']
  const emojis = FORMAT_EMOJIS[brief.format]

  const brandTag = `#${brief.brandName.replace(/\s+/g, '').toLowerCase()}`
  const toneTag = `#${brief.tone}`
  const hashtags = [brandTag, ...industryTags.slice(0, 5), toneTag]

  const headline = template.headline || `${brief.brandName} — ${brief.prompt}`
  const body = template.body || brief.prompt
  const cta = template.cta || 'Learn More'
  const subheadline = template.subheadline || ''

  // Format-specific caption assembly
  let caption = ''
  // Reel formats get short punchy captions
  if (brief.format === 'instagram-reel' || brief.format === 'facebook-reel') {
    caption = `${emojis[0]} ${headline}\n\n${body.slice(0, 120)}${body.length > 120 ? '…' : ''}\n\n👉 ${cta}\n\n${hashtags.join(' ')}`
  } else if (brief.format === 'linkedin-post') {
    caption = `${emojis[0]} ${headline}\n\n${body}\n\n${subheadline}\n\n👉 ${cta}\n\n${hashtags.join(' ')}`
  } else if (brief.format === 'twitter-x') {
    const short = body.slice(0, 180) + (body.length > 180 ? '…' : '')
    caption = `${headline} ${emojis[0]}\n\n${short}\n\n${cta} ${emojis[1]}\n\n${hashtags.slice(0, 4).join(' ')}`
  } else if (brief.format === 'instagram-story') {
    caption = `${emojis[0]} ${headline}\n\n${cta.toUpperCase()} ${emojis[1]}`
  } else {
    caption = `${emojis[0]} ${headline}\n\n${body}\n\n${cta} ${emojis[1]}\n\n.\n.\n.\n${hashtags.join(' ')}`
  }

  return { headline, subheadline, body, cta, hashtags, caption, emojiSet: emojis }
}

export const FORMAT_META: Record<AdFormat, { label: string; icon: string; size: string; dims: [number, number] }> = {
  'instagram-post': { label: 'Instagram Post', icon: '📸', size: '1:1', dims: [380, 380] },
  'instagram-story': { label: 'Instagram Story', icon: '📱', size: '9:16', dims: [220, 390] },
  'instagram-reel': { label: 'Instagram Reel', icon: '🎬', size: '9:16', dims: [220, 390] },
  'facebook-ad': { label: 'Facebook Ad', icon: '📘', size: '16:9', dims: [420, 236] },
  'facebook-reel': { label: 'Facebook Reel', icon: '🎥', size: '9:16', dims: [220, 390] },
  'linkedin-post': { label: 'LinkedIn Post', icon: '💼', size: '1.91:1', dims: [420, 220] },
  'twitter-x': { label: 'Twitter / X', icon: '🐦', size: '16:9', dims: [420, 236] },
}

export const AD_TYPES: { value: AdType; label: string; icon: string }[] = [
  { value: 'product-launch', label: 'Product Launch', icon: '🚀' },
  { value: 'sale-offer', label: 'Sale / Offer', icon: '🏷' },
  { value: 'event-promo', label: 'Event Promo', icon: '🎟' },
  { value: 'testimonial', label: 'Testimonial', icon: '💬' },
  { value: 'brand-awareness', label: 'Brand Awareness', icon: '🌍' },
]

export const TONES: { value: AdTone; label: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', desc: 'Clean, credible, authoritative' },
  { value: 'bold', label: 'Bold', desc: 'Confident, disruptive, punchy' },
  { value: 'playful', label: 'Playful', desc: 'Fun, relatable, emoji-forward' },
  { value: 'minimal', label: 'Minimal', desc: 'Simple, direct, no fluff' },
  { value: 'urgent', label: 'Urgent', desc: 'FOMO-driven, time-sensitive' },
]
