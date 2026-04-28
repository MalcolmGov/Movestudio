import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Storage } from '../types'
import {
  generateAdCopy, GeneratedAd, AdFormat, AdTone, AdType,
  FORMAT_META, AD_TYPES, TONES,
} from '../utils/adCopyEngine'
import { scoreAd, AdScore, GRADE_META } from '../utils/adScoreEngine'
import { exportAdAsPng } from '../utils/exportCanvas'
import { addNotification } from '../utils/notifications'
import { generateWeeklyBrief, WeeklyBrief } from '../utils/contentBriefEngine'
import AdCanvas from '../components/AdCanvas'
import AdSpecialsTab from '../components/AdSpecialsTab'

const FORMATS: AdFormat[] = ['instagram-post', 'instagram-story', 'instagram-reel', 'facebook-ad', 'facebook-reel', 'linkedin-post', 'twitter-x']

const PROMPT_IDEAS = [
  'Launching our new contactless payment card',
  'Flash sale — 30% off all plans this weekend',
  'Join our exclusive fintech summit next Friday',
  'Our platform saved clients 10 hours per week',
  'Meet the team behind the fastest payments API',
  'New feature: real-time transaction alerts',
]

const CALENDAR_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ── Calendar Tab with Generate My Week ────────────────────
function CalendarTab({ kit, setAdType, setFormat, setPrompt, setTab }: {
  kit: any; setAdType: any; setFormat: any; setPrompt: any; setTab: any
}) {
  const [brief, setBrief] = useState<WeeklyBrief | null>(null)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setBrief(generateWeeklyBrief(kit.industry || 'SaaS', kit.tone || 'Premium'))
      setGenerating(false)
    }, 700)
  }

  const loadSlot = (slot: { format: string; typeLabel: string; caption: string }) => {
    setFormat(slot.format as AdFormat)
    setPrompt(slot.caption)
    setTab('studio')
  }

  if (!brief) {
    return (
      <motion.div key="calendar-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>7-Day Content Calendar</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Generate a personalised weekly plan based on your brand, industry and tone.</p>
        </div>

        {/* Static grid (legacy) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 10, marginBottom: 28 }}>
          {CALENDAR_DAYS.map((day, i) => {
            const type = AD_TYPES[i % AD_TYPES.length]
            const fmt = FORMATS[i % FORMATS.length]
            const isToday = i === 0
            return (
              <motion.div key={day} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }} onClick={() => { setAdType(type.value); setFormat(fmt); setTab('studio') }}
                style={{ padding: '14px 12px', borderRadius: 12, border: `1px solid ${isToday ? kit.primary + '50' : 'rgba(255,255,255,0.07)'}`, background: isToday ? kit.primary + '10' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: isToday ? kit.primary : 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{day}{isToday ? ' · Today' : ''}</div>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{type.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 3 }}>{type.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{FORMAT_META[fmt].icon} {FORMAT_META[fmt].label}</div>
                <div style={{ marginTop: 10, padding: '4px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', fontSize: 10, color: 'var(--text-muted)', textAlign: 'center' }}>Click to generate</div>
              </motion.div>
            )
          })}
        </div>

        {/* Generate My Week CTA */}
        <div style={{ padding: '24px 28px', borderRadius: 16, background: `linear-gradient(135deg,${kit.primary}12,${kit.secondary}08)`, border: `1px solid ${kit.primary}30`, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 4 }}>✨ Generate My Week</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              Get a personalised 7-day content brief tailored to your <strong style={{ color: 'white' }}>{kit.industry}</strong> brand with a <strong style={{ color: 'white' }}>{kit.tone}</strong> tone — including headlines, captions, hashtags and best times.
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={generating}
            style={{ padding: '12px 24px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', flexShrink: 0, opacity: generating ? 0.7 : 1 }}>
            {generating ? '⏳ Generating…' : '🗓 Generate My Week →'}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // ── Brief view ──
  return (
    <motion.div key="calendar-brief" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>Your Week — {brief.weekStart}</h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Based on {brief.industry} · {brief.tone} tone. Click any slot to load it into the Ad Generator.</p>
        </div>
        <button onClick={() => setBrief(null)} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>← Back to calendar</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {brief.slots.map((slot, i) => (
          <motion.div key={slot.day} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 16, alignItems: 'center' }}>
            {/* Day + date */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{slot.day}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{slot.date}</div>
              <div style={{ fontSize: 11, color: kit.accent, marginTop: 4 }}>{slot.formatIcon} {slot.formatLabel.split(' ')[0]}</div>
            </div>
            {/* Content */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 3 }}>{slot.typeIcon} {slot.typeLabel}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, lineHeight: 1.5 }}>{slot.caption}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {slot.hashtags.map(h => <span key={h} style={{ fontSize: 10, color: kit.primary, background: kit.primary + '15', padding: '2px 6px', borderRadius: 4 }}>{h}</span>)}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>⏰ Best time: {slot.bestTime} · 💡 {slot.tip}</div>
            </div>
            {/* CTA */}
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
              onClick={() => loadSlot(slot)}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Generate →
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function AdStudioPage() {
  const project = (() => { try { return JSON.parse(sessionStorage.getItem('bs_preview_project') || 'null') } catch { return null } })()
  const kit = project?.kit || { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9', font: 'Inter', logo: null, industry: 'Fintech', tone: 'Premium' }

  const [prompt, setPrompt] = useState('')
  const [adType, setAdType] = useState<AdType>('brand-awareness')
  const [tone, setTone] = useState<AdTone>('professional')
  const [format, setFormat] = useState<AdFormat>('instagram-post')
  const [ad, setAd] = useState<GeneratedAd | null>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<'studio' | 'batch' | 'calendar' | 'tips' | 'specials'>('studio')
  const [copied, setCopied] = useState(false)
  const [generated, setGenerated] = useState<{ format: AdFormat; ad: GeneratedAd }[]>([])
  const [adColors, setAdColors] = useState({ primary: kit.primary, secondary: kit.secondary, accent: kit.accent })
  const [adLogo, setAdLogo] = useState<string | null>(kit.logo || null)
  const [ctaUrl, setCtaUrl] = useState('https://')
  const [socialAccounts, setSocialAccounts] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('ms_social_accounts') || '{}') } catch { return {} }
  })
  const [scheduleModal, setScheduleModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduled, setScheduled] = useState(false)
  const [adScore, setAdScore] = useState<AdScore | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const [batchVariants, setBatchVariants] = useState<{ format: AdFormat; tone: AdTone; ad: GeneratedAd; score: AdScore }[]>([])
  const [batchLoading, setBatchLoading] = useState(false)
  const logoFileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Live-update a single field in the ad — canvas re-renders immediately
  const updateAd = (field: keyof GeneratedAd, value: string | string[]) =>
    setAd(prev => prev ? { ...prev, [field]: value } : prev)

  const updateColor = (field: keyof typeof adColors, value: string) =>
    setAdColors(prev => ({ ...prev, [field]: value }))

  const effectiveKit = { ...kit, ...adColors, logo: adLogo }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setAdLogo(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const connectSocial = (platform: string) => {
    const updated = { ...socialAccounts, [platform]: !socialAccounts[platform] }
    setSocialAccounts(updated)
    localStorage.setItem('ms_social_accounts', JSON.stringify(updated))
  }

  const handleSchedule = () => {
    setScheduled(true)
    setScheduleModal(false)
    setTimeout(() => setScheduled(false), 3000)
  }

  const generate = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const result = generateAdCopy({
      prompt, adType, tone, format,
      industry: kit.industry || 'Startup',
      brandName: project?.name?.split('—')[0]?.trim() || 'YourBrand',
      primaryColor: kit.primary,
    })
    setAd(result)
    setAdScore(scoreAd(result, { primaryColor: kit.primary, font: kit.font, industry: kit.industry || 'Startup' }))
    setGenerated(prev => [{ format, ad: result }, ...prev.filter(g => g.format !== format)].slice(0, 7))
    setLoading(false)
  }

  const generateAll = async () => {
    setLoading(true)
    const all: { format: AdFormat; ad: GeneratedAd }[] = []
    for (const f of FORMATS) {
      await new Promise(r => setTimeout(r, 120))
      const result = generateAdCopy({ prompt, adType, tone, format: f, industry: kit.industry || 'Startup', brandName: project?.name?.split('—')[0]?.trim() || 'YourBrand', primaryColor: kit.primary })
      all.push({ format: f, ad: result })
    }
    setGenerated(all)
    setAd(all[0].ad)
    setAdScore(scoreAd(all[0].ad, { primaryColor: kit.primary, font: kit.font, industry: kit.industry || 'Startup' }))
    setFormat(all[0].format)
    setLoading(false)
  }

  const generateBatch = async () => {
    setBatchLoading(true)
    const variants: typeof batchVariants = []
    const brandName = project?.name?.split('—')[0]?.trim() || 'YourBrand'
    const industry = kit.industry || 'Startup'
    for (const f of FORMATS) {
      for (const t of TONES.map(x => x.value) as AdTone[]) {
        await new Promise(r => setTimeout(r, 40))
        const result = generateAdCopy({ prompt, adType, tone: t, format: f, industry, brandName, primaryColor: kit.primary })
        const score = scoreAd(result, { primaryColor: kit.primary, font: kit.font, industry })
        variants.push({ format: f, tone: t, ad: result, score })
      }
    }
    // Sort by overall score desc
    variants.sort((a, b) => b.score.overall - a.score.overall)
    setBatchVariants(variants)
    setBatchLoading(false)
  }

  const handleUrlBrief = async () => {
    if (!urlInput.trim()) return
    setUrlLoading(true)
    await new Promise(r => setTimeout(r, 700))
    // Extract hostname as brand name hint; use URL path for copy hint
    try {
      const url = new URL(urlInput.startsWith('http') ? urlInput : 'https://' + urlInput)
      const brand = url.hostname.replace('www.', '').split('.')[0]
      const pathHint = url.pathname.replace(/[-_/]/g, ' ').trim()
      const autoPrompt = pathHint.length > 3
        ? `${brand} — ${pathHint}`
        : `Promote ${brand}'s products and services`
      setPrompt(autoPrompt.slice(0, 120))
      setCtaUrl(url.href)
    } catch {
      setPrompt(`Visit ${urlInput} to learn more`)
    }
    setUrlLoading(false)
  }

  const [exporting, setExporting] = useState(false)
  const [saved, setSaved] = useState(false)

  const exportAd = async () => {
    if (!ad) return
    setExporting(true)
    const brandName = project?.name?.split('—')[0]?.trim() || 'ad'
    await exportAdAsPng('ad-canvas-root', `move-studio-${brandName}-${format}`)
    setExporting(false)
    addNotification('Ad Exported! 🎉', `Your ${FORMAT_META[format].label} has been saved as a PNG.`, 'success')
  }

  const saveAd = () => {
    if (!ad) return
    // Store in localStorage under the current project
    const projectId = project?.id || 'default'
    const key = `ms_saved_ads_${projectId}`
    const existing = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } })()
    const entry = { id: Date.now().toString(), format, ad, score: adScore, colors: adColors, ctaUrl, savedAt: new Date().toISOString() }
    localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 50)))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    addNotification('Ad Saved! ✨', `Your ${FORMAT_META[format].label} has been saved to this project.`, 'success')
  }

  const copyCaptions = () => {
    if (!ad) return
    navigator.clipboard.writeText(ad.caption)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 99, background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.3)', marginBottom: 14 }}>
          <span style={{ fontSize: 14 }}>📣</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fb923c' }}>Social Ad Studio</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: 8 }}>
          Create ads that{' '}
          <span style={{ background: 'var(--gradient-sig-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>convert.</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 520, lineHeight: 1.7 }}>
          No copywriter. No designer. No agency. Describe your campaign, pick your tone, and generate on-brand ads for every platform in seconds.
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.03)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[['studio', '⚡ Ad Generator'], ['specials', '🏷️ Ad Specials'], ['batch', '📦 Batch Mode'], ['calendar', '📅 Content Calendar'], ['tips', '💡 Prompt Ideas']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as any)}
            style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: tab === key ? 'rgba(255,255,255,0.08)' : 'transparent', color: tab === key ? 'white' : 'var(--text-muted)', fontWeight: tab === key ? 700 : 400, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── AD GENERATOR TAB ── */}
        {tab === 'studio' && (
          <motion.div key="studio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 28 }}>

            {/* Left: Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* URL → Brief */}
              <div style={{ marginBottom: 4 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🔗 URL → Auto Brief</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleUrlBrief()}
                    placeholder="yoursite.com/product-page"
                    style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--mono)', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleUrlBrief} disabled={urlLoading}
                    style={{ padding: '9px 14px', borderRadius: 8, border: 'none', background: `${kit.primary}30`, color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', flexShrink: 0 }}>
                    {urlLoading ? '⏳' : '→ Fill'}
                  </motion.button>
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>What's this ad about?</label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g. Launching our new contactless payment card for small businesses"
                  rows={3}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--font)', fontSize: 14, outline: 'none', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = kit.primary + '60'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                {/* Quick prompts */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                  {PROMPT_IDEAS.slice(0, 3).map(p => (
                    <button key={p} onClick={() => setPrompt(p)}
                      style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                      {p.slice(0, 28)}…
                    </button>
                  ))}
                </div>
              </div>

              {/* Ad Type */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ad Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {AD_TYPES.map(t => (
                    <button key={t.value} onClick={() => setAdType(t.value)}
                      style={{ padding: '9px 10px', borderRadius: 8, border: `1px solid ${adType === t.value ? kit.primary + '60' : 'rgba(255,255,255,0.08)'}`, background: adType === t.value ? kit.primary + '18' : 'rgba(255,255,255,0.02)', color: adType === t.value ? 'white' : 'var(--text-muted)', fontSize: 12, fontWeight: adType === t.value ? 700 : 400, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tone of Voice</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {TONES.map(t => (
                    <button key={t.value} onClick={() => setTone(t.value)}
                      style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${tone === t.value ? kit.accent + '60' : 'rgba(255,255,255,0.07)'}`, background: tone === t.value ? kit.accent + '12' : 'transparent', color: 'white', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: tone === t.value ? 700 : 400 }}>{t.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {FORMATS.map(f => {
                    const m = FORMAT_META[f]
                    return (
                      <button key={f} onClick={() => setFormat(f)}
                        style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${format === f ? kit.primary + '60' : 'rgba(255,255,255,0.08)'}`, background: format === f ? kit.primary + '18' : 'transparent', color: format === f ? 'white' : 'var(--text-muted)', fontSize: 12, fontWeight: format === f ? 700 : 400, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        {m.icon} {m.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Brand strip */}
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'center' }}>
                {[kit.primary, kit.secondary, kit.accent].map((c, i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 5, background: c }} />)}
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: `'${kit.font}', sans-serif` }}>Locked to your brand kit · {kit.font}</span>
              </div>

              {/* Generate buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={generate} disabled={loading}
                  style={{ flex: 2, padding: '13px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 14, cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font)', boxShadow: `0 8px 24px ${kit.primary}40` }}>
                  {loading ? '⏳ Generating…' : '⚡ Generate Ad'}
                </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} onClick={generateAll} disabled={loading}
                  style={{ flex: 1, padding: '13px', borderRadius: 10, border: `1px solid ${kit.accent}40`, background: 'transparent', color: kit.accent, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                  All Formats
                </motion.button>
              </div>
            </div>

            {/* Right: Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Canvas */}
              <div ref={canvasRef} style={{ display: 'flex', justifyContent: 'center', padding: '32px', borderRadius: 16, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', minHeight: 300, alignItems: 'center' }}>
                {ad ? (
                  <AdCanvas format={format} ad={ad} kit={{ ...effectiveKit, brandName: project?.name?.split('—')[0]?.trim() }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📣</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>Your ad preview will appear here</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>Fill in the brief on the left and hit Generate</div>
                  </div>
                )}
              </div>

              {/* ── AD SCORE PANEL ── */}
              {adScore && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ borderRadius: 14, border: `1px solid ${GRADE_META[adScore.grade].border}`, background: GRADE_META[adScore.grade].bg, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{GRADE_META[adScore.grade].emoji}</span>
                      <div>
                        <div style={{ fontWeight: 800, color: 'white', fontSize: 14 }}>Ad Score: {adScore.overall}/100</div>
                        <div style={{ fontSize: 11, color: GRADE_META[adScore.grade].color, fontWeight: 700 }}>{GRADE_META[adScore.grade].label}</div>
                      </div>
                    </div>
                    {/* Overall ring */}
                    <svg width={52} height={52} style={{ flexShrink: 0 }}>
                      <circle cx={26} cy={26} r={22} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
                      <circle cx={26} cy={26} r={22} fill="none" stroke={GRADE_META[adScore.grade].color} strokeWidth={4}
                        strokeDasharray={`${(adScore.overall / 100) * 138} 138`} strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '26px 26px', transition: 'stroke-dasharray 0.8s ease' }} />
                      <text x={26} y={31} textAnchor="middle" fill="white" fontSize={13} fontWeight={800}>{adScore.overall}</text>
                    </svg>
                  </div>
                  {/* Metric bars */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: adScore.tips.length > 0 ? 12 : 0 }}>
                    {[['Hook', adScore.hook], ['CTA', adScore.cta], ['Brand', adScore.brandConsistency], ['Hashtags', adScore.hashtagStrength]].map(([label, val]) => (
                      <div key={label as string}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'white' }}>{val}</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.7, ease: 'easeOut' }}
                            style={{ height: '100%', borderRadius: 99, background: (val as number) >= 75 ? '#10b981' : (val as number) >= 50 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Tips */}
                  {adScore.tips.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {adScore.tips.map((tip, i) => (
                        <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', display: 'flex', gap: 6, alignItems: 'flex-start', lineHeight: 1.5 }}>
                          <span style={{ flexShrink: 0, color: '#f59e0b' }}>▶</span> {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── LIVE EDIT PANEL ── */}
              {ad && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>

                  {/* Panel header */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>✏️ Live Edit — changes update instantly</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={exportAd} disabled={exporting}
                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(129,140,248,0.35)', background: 'rgba(129,140,248,0.08)', color: '#a5b4fc', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        {exporting ? '⏳' : '⬇ Export PNG'}
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={saveAd}
                        style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${saved ? '#10b98140' : 'rgba(255,255,255,0.1)'}`, background: saved ? '#10b98115' : 'transparent', color: saved ? '#10b981' : 'var(--text-muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        {saved ? '✓ Saved!' : '💾 Save Ad'}
                      </motion.button>
                      <button onClick={copyCaptions}
                        style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${copied ? '#10b981' : 'rgba(255,255,255,0.1)'}`, background: copied ? '#10b98120' : 'transparent', color: copied ? '#10b981' : 'var(--text-muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        {copied ? '✓ Copied!' : '📋 Copy'}
                      </button>
                      <button onClick={generate}
                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        🔄 Regenerate
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* Text fields — all live */}
                    {([
                      { label: 'Headline', field: 'headline' as keyof GeneratedAd, multiline: false },
                      { label: 'Subheadline', field: 'subheadline' as keyof GeneratedAd, multiline: false },
                      { label: 'CTA Button Text', field: 'cta' as keyof GeneratedAd, multiline: false },
                      { label: 'Body Copy', field: 'body' as keyof GeneratedAd, multiline: true },
                    ]).map(({ label, field, multiline }) => (
                      <div key={field}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                        {multiline ? (
                          <textarea
                            value={ad[field] as string}
                            onChange={e => updateAd(field, e.target.value)}
                            rows={2}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `1px solid ${effectiveKit.primary}30`, background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--font)', fontSize: 13, outline: 'none', resize: 'none', lineHeight: 1.6, boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = effectiveKit.primary + '60'}
                            onBlur={e => e.target.style.borderColor = effectiveKit.primary + '30'}
                          />
                        ) : (
                          <input
                            value={ad[field] as string}
                            onChange={e => updateAd(field, e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `1px solid ${effectiveKit.primary}30`, background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--font)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = effectiveKit.primary + '60'}
                            onBlur={e => e.target.style.borderColor = effectiveKit.primary + '30'}
                          />
                        )}
                      </div>
                    ))}

                    {/* Emoji row */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Main Emoji (updates canvas icon)</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {['🚀', '⚡', '🎯', '💡', '🔥', '✨', '💎', '🏆', '📱', '💰', '🌍', '🎉', '🤝', '📈', '🔒', '⭐'].map(emoji => (
                          <button key={emoji} onClick={() => updateAd('emojiSet', [emoji, ...ad.emojiSet.slice(1)])}
                            style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${ad.emojiSet[0] === emoji ? effectiveKit.primary + '60' : 'rgba(255,255,255,0.08)'}`, background: ad.emojiSet[0] === emoji ? effectiveKit.primary + '20' : 'rgba(255,255,255,0.02)', fontSize: 18, cursor: 'pointer' }}>
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color overrides */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Ad Colors (override brand kit for this ad)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        {(['primary', 'secondary', 'accent'] as const).map(c => (
                          <div key={c}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'capitalize' }}>{c}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                              <div style={{ position: 'relative', width: 24, height: 24, borderRadius: 6, background: adColors[c], flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <input type="color" value={adColors[c]} onChange={e => updateColor(c, e.target.value)}
                                  style={{ position: 'absolute', inset: 0, opacity: 0, width: '200%', height: '200%', cursor: 'pointer', transform: 'translate(-25%,-25%)' }} />
                              </div>
                              <input value={adColors[c]} onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && updateColor(c, e.target.value)}
                                maxLength={7}
                                style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontFamily: 'var(--mono)', fontSize: 11, width: '100%' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setAdColors({ primary: kit.primary, secondary: kit.secondary, accent: kit.accent })}
                        style={{ marginTop: 6, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                        ↩ Reset to brand kit
                      </button>
                    </div>

                    {/* ── Logo picker ── */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Logo on Ad</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {adLogo && (
                          <div style={{ padding: 6, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={adLogo} style={{ height: 28, objectFit: 'contain', display: 'block' }} alt="logo" />
                          </div>
                        )}
                        {kit.logo && kit.logo !== adLogo && (
                          <button onClick={() => setAdLogo(kit.logo)}
                            style={{ padding: '6px 12px', borderRadius: 7, border: `1px solid ${effectiveKit.primary}40`, background: effectiveKit.primary + '12', color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                            Use Brand Logo
                          </button>
                        )}
                        <button onClick={() => logoFileRef.current?.click()}
                          style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                          ⬆ Upload New
                        </button>
                        {adLogo && (
                          <button onClick={() => setAdLogo(null)}
                            style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: 'transparent', color: '#f87171', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                            Remove
                          </button>
                        )}
                        <input ref={logoFileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                      </div>
                    </div>

                    {/* ── CTA URL ── */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>CTA Destination URL</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input value={ctaUrl} onChange={e => setCtaUrl(e.target.value)}
                          placeholder="https://yoursite.com/landing"
                          style={{ flex: 1, padding: '8px 10px', borderRadius: 7, border: `1px solid ${effectiveKit.primary}30`, background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--mono)', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                          onFocus={e => e.target.style.borderColor = effectiveKit.primary + '60'}
                          onBlur={e => e.target.style.borderColor = effectiveKit.primary + '30'} />
                        {ctaUrl.startsWith('http') && (
                          <a href={ctaUrl} target="_blank" rel="noreferrer"
                            style={{ padding: '8px 10px', borderRadius: 7, background: effectiveKit.primary + '18', color: effectiveKit.accent, fontSize: 12, textDecoration: 'none', border: `1px solid ${effectiveKit.primary}30`, whiteSpace: 'nowrap' }}>
                            Test ↗
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>This URL is embedded in exported ads and used when scheduling posts.</div>
                    </div>

                    {/* Hashtags — editable chips */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Hashtags</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 6 }}>
                        {ad.hashtags.map((h, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 5, background: effectiveKit.primary + '18', border: `1px solid ${effectiveKit.primary}30` }}>
                            <span style={{ color: effectiveKit.accent, fontSize: 11, fontWeight: 600 }}>{h}</span>
                            <button onClick={() => updateAd('hashtags', ad.hashtags.filter((_, j) => j !== i))}
                              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1 }}>✕</button>
                          </div>
                        ))}
                      </div>
                      <input placeholder="Add hashtag (press Enter)" onKeyDown={e => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.trim()
                          if (val) { updateAd('hashtags', [...ad.hashtags, val.startsWith('#') ? val : '#' + val]);(e.target as HTMLInputElement).value = '' }
                        }
                      }}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'white', fontFamily: 'var(--font)', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    {/* Full caption preview */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Full Caption Preview</div>
                      <pre style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontFamily: 'var(--mono)', margin: 0, maxHeight: 120, overflowY: 'auto' }}>
                        {`${ad.emojiSet[0]} ${ad.headline}\n\n${ad.body}\n\n${ad.cta} ${ad.emojiSet[1]}\n${ctaUrl}\n\n${ad.hashtags.join(' ')}`}
                      </pre>
                    </div>

                    {/* ── Social Connect + Schedule ── */}
                    <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 4 }}>📲 Connected Social Accounts</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>Connect accounts to schedule and auto-post directly from Move Studio.</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                        {([
                          { id: 'instagram', label: 'Instagram', icon: '📸', color: '#e1306c' },
                          { id: 'facebook', label: 'Facebook', icon: '📘', color: '#1877f2' },
                          { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0a66c2' },
                          { id: 'twitter', label: 'Twitter / X', icon: '🐦', color: '#1da1f2' },
                        ]).map(p => (
                          <button key={p.id} onClick={() => connectSocial(p.id)}
                            style={{ padding: '9px 12px', borderRadius: 9, border: `1px solid ${socialAccounts[p.id] ? p.color + '60' : 'rgba(255,255,255,0.08)'}`, background: socialAccounts[p.id] ? p.color + '15' : 'rgba(255,255,255,0.02)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                            <span>{p.icon}</span>
                            <span style={{ flex: 1, textAlign: 'left', fontWeight: socialAccounts[p.id] ? 700 : 400 }}>{p.label}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: socialAccounts[p.id] ? '#10b981' : 'rgba(255,255,255,0.25)' }}>
                              {socialAccounts[p.id] ? '● Connected' : 'Connect'}
                            </span>
                          </button>
                        ))}
                      </div>
                      {Object.values(socialAccounts).some(Boolean) ? (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setScheduleModal(true)}
                          style={{ width: '100%', padding: '10px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg,${effectiveKit.primary},${effectiveKit.secondary})`, color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)', boxShadow: `0 6px 20px ${effectiveKit.primary}40` }}>
                          {scheduled ? '✓ Scheduled!' : '📅 Schedule Post'}
                        </motion.button>
                      ) : (
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '8px 0' }}>Connect at least one account to schedule posts</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Multi-format strip */}
              {generated.length > 1 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>All Generated Formats</div>
                  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
                    {generated.map(g => (
                      <motion.div key={g.format} whileHover={{ scale: 1.04 }} onClick={() => { setFormat(g.format); setAd(g.ad) }}
                        style={{ flexShrink: 0, cursor: 'pointer', padding: '8px 12px', borderRadius: 10, border: `1px solid ${format === g.format ? kit.primary + '60' : 'rgba(255,255,255,0.08)'}`, background: format === g.format ? kit.primary + '15' : 'transparent', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{FORMAT_META[g.format].icon}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: 'white' }}>{FORMAT_META[g.format].label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── BATCH MODE TAB ── */}
        {tab === 'batch' && (
          <motion.div key="batch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Batch Mode — {FORMATS.length * TONES.length} Variations</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Generates every format × every tone from your brief. Sorted by Ad Score — strongest first.</p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, color: prompt ? 'white' : 'rgba(255,255,255,0.3)' }}>
                  {prompt || 'No brief yet — write one in Ad Generator first'}
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={generateBatch} disabled={batchLoading || !prompt}
                  style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: prompt ? `linear-gradient(135deg,${kit.primary},${kit.secondary})` : 'rgba(255,255,255,0.06)', color: prompt ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 800, fontSize: 14, cursor: prompt ? 'pointer' : 'not-allowed', fontFamily: 'var(--font)', flexShrink: 0, boxShadow: prompt ? `0 8px 24px ${kit.primary}40` : 'none' }}>
                  {batchLoading ? `⏳ Generating…` : `⚡ Generate All ${FORMATS.length * TONES.length} Variations`}
                </motion.button>
              </div>
            </div>

            {batchVariants.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                {batchVariants.map((v, i) => {
                  const gm = GRADE_META[v.score.grade]
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.025, 0.5) }}
                      whileHover={{ y: -4 }}
                      onClick={() => { setAd(v.ad); setFormat(v.format); setTone(v.tone); setAdScore(v.score); setTab('studio') }}
                      style={{ borderRadius: 12, border: `1px solid ${gm.border}`, background: gm.bg, padding: '14px', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span>{FORMAT_META[v.format].icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{FORMAT_META[v.format].label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 9 }}>{gm.emoji}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: gm.color }}>{v.score.overall}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 5, textTransform: 'capitalize' }}>{v.tone} tone</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: 5 }}>{v.ad.headline}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>{v.ad.cta}</div>
                      <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                        <div style={{ height: '100%', width: `${v.score.overall}%`, borderRadius: 99, background: gm.color, transition: 'width 0.6s' }} />
                      </div>
                      <div style={{ marginTop: 8, fontSize: 10, color: gm.color, fontWeight: 600 }}>Open in editor →</div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {!batchLoading && batchVariants.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                <div style={{ fontSize: 14 }}>Write your brief in Ad Generator, then hit Generate All Variations</div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── AD SPECIALS TAB ── */}
        {tab === 'specials' && (
          <AdSpecialsTab kit={{ ...kit, brandName: project?.name?.split('—')[0]?.trim() }} project={project} />
        )}

        {/* ── CALENDAR TAB ── */}
        {tab === 'calendar' && (
          <CalendarTab kit={kit} setAdType={setAdType} setFormat={setFormat} setPrompt={setPrompt} setTab={setTab} />
        )}

        {/* ── TIPS TAB ── */}
        {tab === 'tips' && (
          <motion.div key="tips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Prompt Ideas for {kit.industry}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click any prompt to load it into the generator.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
              {PROMPT_IDEAS.map((p, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02, borderColor: kit.primary + '40' }} onClick={() => { setPrompt(p); setTab('studio') }}
                  style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <div style={{ fontSize: 12, color: kit.accent, fontWeight: 700, marginBottom: 6 }}>💡 Prompt {i + 1}</div>
                  <div style={{ fontSize: 14, color: 'white', lineHeight: 1.5 }}>{p}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Click to use →</div>
                </motion.div>
              ))}
              {/* Best practices */}
              {[
                { icon: '⏰', tip: 'Post Instagram at 6–9pm on weekdays for maximum engagement.', label: 'Best Time to Post' },
                { icon: '🏷', tip: 'Use 5–8 hashtags. Mix popular (#fintech) with niche (#paymentsafrica).', label: 'Hashtag Strategy' },
                { icon: '🎯', tip: 'Your first line is your hook. Make it a question or a bold claim.', label: 'Caption Hook' },
                { icon: '📐', tip: 'Always include a clear CTA. "Learn more", "Book now", "Swipe up" — every post.', label: 'Call to Action' },
                { icon: '🔁', tip: 'Repurpose one core idea across all 5 formats. Work smarter, not harder.', label: 'Content Efficiency' },
                { icon: '📊', tip: 'LinkedIn posts with images get 2x more comments. Always attach your ad canvas.', label: 'LinkedIn Tip' },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }}
                  style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 5 }}>{item.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.tip}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Schedule Modal ── */}
      <AnimatePresence>
        {scheduleModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '32px', maxWidth: 420, width: '90%' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>📅 Schedule Post</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
                Choose when to publish. We'll post to all connected accounts simultaneously.
              </div>

              {/* Ad summary */}
              {ad && (
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 3 }}>{ad.headline}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{FORMAT_META[format].icon} {FORMAT_META[format].label} · {ad.hashtags.slice(0, 3).join(' ')}</div>
                  {ctaUrl !== 'https://' && <div style={{ fontSize: 11, color: effectiveKit.accent, marginTop: 4 }}>🔗 {ctaUrl}</div>}
                </div>
              )}

              {/* Date/time picker */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Date & Time</label>
                <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: `1px solid ${effectiveKit.primary}40`, background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--mono)', fontSize: 13, outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
              </div>

              {/* Connected platforms */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Post to</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { id: 'instagram', label: 'Instagram', icon: '📸', color: '#e1306c' },
                    { id: 'facebook', label: 'Facebook', icon: '📘', color: '#1877f2' },
                    { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0a66c2' },
                    { id: 'twitter', label: 'Twitter / X', icon: '🐦', color: '#1da1f2' },
                  ].filter(p => socialAccounts[p.id]).map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, background: p.color + '15', border: `1px solid ${p.color}40`, fontSize: 12, color: 'white' }}>
                      {p.icon} {p.label} <span style={{ color: '#10b981', fontSize: 10 }}>●</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setScheduleModal(false)}
                  style={{ flex: 1, padding: '11px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13 }}>
                  Cancel
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSchedule}
                  disabled={!scheduleDate}
                  style={{ flex: 2, padding: '11px', borderRadius: 9, border: 'none', background: scheduleDate ? `linear-gradient(135deg,${effectiveKit.primary},${effectiveKit.secondary})` : 'rgba(255,255,255,0.05)', color: scheduleDate ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 800, fontSize: 14, cursor: scheduleDate ? 'pointer' : 'not-allowed', fontFamily: 'var(--font)', boxShadow: scheduleDate ? `0 8px 24px ${effectiveKit.primary}40` : 'none' }}>
                  Confirm Schedule ✓
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
