import { BrandKit, SectionContent, SectionType } from '../types'

// ── Shared fetch helper ───────────────────────────────────

async function callAI(messages: { role: string; content: string }[]): Promise<any> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'AI request failed')
  return JSON.parse(data.result)
}

// ── Feature 1: Generate section content ──────────────────

const SECTION_SCHEMAS: Partial<Record<SectionType, string>> = {
  hero: `{ "badgeText": string, "headline": string, "subheadline": string, "ctaText": string, "ctaSecondary": string }`,
  features: `{ "featuresTitle": string, "features": [{ "icon": string (emoji), "title": string, "desc": string }] } — include 6 features`,
  stats: `{ "stats": [{ "value": string, "label": string }] } — include 4 stats with real-looking numbers`,
  testimonials: `{ "testimonials": [{ "name": string, "role": string, "company": string, "quote": string, "avatar": string (2-letter initials) }] } — include 3 testimonials`,
  pricing: `{ "pricingTitle": string, "plans": [{ "name": string, "price": string, "period": string, "desc": string, "features": string[], "cta": string, "highlight": boolean }] } — 3 plans, middle one highlighted`,
  faq: `{ "faqTitle": string, "faqs": [{ "q": string, "a": string }] } — 5 questions`,
  team: `{ "teamTitle": string, "teamMembers": [{ "name": string, "role": string, "bio": string, "avatar": string (2 initials) }] } — 4 members`,
  cta: `{ "ctaTitle": string, "ctaBody": string, "ctaButton": string }`,
  footer: `{ "footerBrand": string, "footerTagline": string, "footerLinks": [{ "group": string, "links": string[] }] } — 3 groups`,
  newsletter: `{ "newsletterTitle": string, "newsletterBody": string, "newsletterButton": string, "newsletterPlaceholder": string }`,
  contact: `{ "contactTitle": string, "contactBody": string }`,
  navbar: `{ "navCta": string, "navLinks": [{ "label": string, "href": string }] } — 4 nav links`,
  ctabanner: `{ "bannerText": string, "bannerSub": string, "bannerButton": string }`,
  logobar: `{ "logoBarLabel": string, "logos": [{ "icon": string (emoji), "name": string }] } — 6 recognisable brand names`,
  video: `{ "videoTitle": string, "videoBody": string }`,
  timeline: `{ "timelineTitle": string, "milestones": [{ "year": string, "title": string, "desc": string }] } — 4 milestones`,
}

export async function generateSectionContent(
  type: SectionType,
  kit: BrandKit,
  companyName: string
): Promise<Partial<SectionContent>> {
  const schema = SECTION_SCHEMAS[type]
  if (!schema) throw new Error(`No AI generator for section type: ${type}`)

  const system = `You are a world-class conversion copywriter. Write compelling, specific, professional copy for a ${kit.industry} company. Tone: ${kit.tone}. Return ONLY valid JSON matching the exact schema provided — no markdown, no extra keys.`
  const user = `Company: "${companyName || kit.companyName || 'the company'}". Industry: ${kit.industry}. Write the ${type} section. Return JSON: ${schema}`

  return callAI([{ role: 'system', content: system }, { role: 'user', content: user }])
}

// ── Feature 2: Generate brand kit ────────────────────────

export interface BrandKitSuggestion {
  primary: string
  secondary: string
  accent: string
  font: string
  industry: string
  tone: string
  companyName: string
  rationale: string
}

export async function generateBrandKit(description: string): Promise<BrandKitSuggestion> {
  const system = `You are a senior brand strategist and visual designer. Based on the business description, generate a cohesive brand identity. Return ONLY valid JSON with these exact keys: primary (hex), secondary (hex), accent (hex), font (one of: Inter, Plus Jakarta Sans, Outfit, Sora, DM Sans, Space Grotesk, Manrope, Raleway), industry (one of: SaaS, Fintech, Retail, Agency, Healthcare, Education, Real Estate, Startup), tone (one of: Premium, Bold, Friendly, Professional, Playful), companyName (string), rationale (1 sentence why these choices fit).`
  const user = `Business description: "${description}"`
  return callAI([{ role: 'system', content: system }, { role: 'user', content: user }])
}

// ── Feature 3: Recommend sections ────────────────────────

export interface SectionRecommendation {
  type: SectionType
  reason: string
}

export async function recommendSections(
  industry: string,
  goal: string
): Promise<SectionRecommendation[]> {
  const available: SectionType[] = ['navbar','hero','logobar','features','stats','testimonials','pricing','faq','team','cta','footer','newsletter','contact','services','process','blog','gallery','video','timeline','ctabanner','comparison']
  const system = `You are a UX strategist specialising in landing pages. Recommend the ideal set and order of page sections for the given goal. Return ONLY valid JSON: { "sections": [{ "type": string, "reason": string }] }. Use only these types: ${available.join(', ')}.`
  const user = `Industry: ${industry}. Goal: ${goal}. Recommend 7-10 sections in the ideal order.`
  const result = await callAI([{ role: 'system', content: system }, { role: 'user', content: user }])
  return result.sections || []
}

// ── Feature 4: Generate image ─────────────────────────────

export async function generateImage(prompt: string): Promise<string> {
  const res = await fetch('/api/ai-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: `${prompt}. Professional, high-quality, dark background, cinematic lighting, 4K.` }),
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Image generation failed')
  return data.dataUrl
}

// ── Feature 5: Nyra streaming chat ───────────────────────

export interface NyraAction {
  type: 'UPDATE_SECTION' | 'ENABLE_SECTION' | 'REORDER_SECTIONS'
  sectionId?: string
  content?: Partial<SectionContent>
  enabled?: boolean
  order?: string[]
}

export interface NyraChunk {
  text?: string
  actions?: NyraAction[]
  done?: boolean
}

export async function* streamNyra(
  messages: { role: string; content: string }[],
  sectionsJson: string,
  kit: BrandKit
): AsyncGenerator<NyraChunk> {
  const system = `You are Nyra, an expert AI web copywriter embedded in Move Digital Studio — a premium website builder.

Current page sections (JSON):
${sectionsJson}

Brand: ${kit.companyName || 'the company'}, Industry: ${kit.industry}, Tone: ${kit.tone}

You can BOTH chat AND execute actions. After your conversational response, if you modified anything, output a JSON block on its own line like:
ACTIONS: {"actions": [...]}

Action types:
- UPDATE_SECTION: {"type":"UPDATE_SECTION","sectionId":"hero","content":{"headline":"New headline"}}  
- ENABLE_SECTION: {"type":"ENABLE_SECTION","sectionId":"faq","enabled":true}
- REORDER_SECTIONS: {"type":"REORDER_SECTIONS","order":["navbar","hero","features",...]}

Be concise, confident, and brand-aware. Only include ACTIONS if you actually changed something.`

  const res = await fetch('/api/ai/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'system', content: system }, ...messages] }),
  })

  if (!res.ok || !res.body) {
    yield { text: 'Connection failed. Please check your OpenAI API key.', done: true }
    return
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const payload = line.slice(6).trim()
      if (payload === '[DONE]') {
        // Parse ACTIONS block from full text
        const actionsMatch = fullText.match(/ACTIONS:\s*(\{[\s\S]*?\})\s*$/)
        if (actionsMatch) {
          try {
            const parsed = JSON.parse(actionsMatch[1])
            yield { actions: parsed.actions, done: true }
          } catch { yield { done: true } }
        } else {
          yield { done: true }
        }
        return
      }
      try {
        const chunk = JSON.parse(payload)
        const delta = chunk.choices?.[0]?.delta?.content || ''
        if (delta) {
          fullText += delta
          // Don't stream the ACTIONS block — just the chat text
          if (!fullText.includes('ACTIONS:')) {
            yield { text: delta }
          }
        }
      } catch { /* skip malformed */ }
    }
  }
  yield { done: true }
}
