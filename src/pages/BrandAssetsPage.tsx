import React, { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BrandKit } from '../types'
import StudioSidebar from '../components/StudioSidebar'
import {
  BusinessCardSingle, BusinessCardFront, BusinessCardBack,
  SocialBannerTemplate, InstagramTemplate,
  EmailHeaderTemplate, FlyerTemplate, PosterTemplate
} from '../components/assets/templates'
import BrandAssetsHome from '../components/assets/BrandAssetsHome'
import { getTemplates } from '../components/assets/templates-data'

export type AssetType = 'business-card'|'social-banner'|'instagram'|'email-header'|'flyer'|'poster'

// ── AI suggestion engine ───────────────────────────────────
const TAGLINES: Record<string, string[]> = {
  SaaS:      ['Scale without limits.', 'Built for modern teams.', 'Software that works as hard as you do.'],
  Fintech:   ['Money, moved smarter.', 'Your finances, reimagined.', 'Secure. Fast. Reliable.'],
  Retail:    ['Quality you can trust.', 'Shop smarter today.', 'Delivering excellence, every time.'],
  Agency:    ['We build what matters.', 'Creative strategy, bold results.', 'Ideas that move people.'],
  Health:    ['Your health, our mission.', 'Care that comes to you.', 'Better health, every day.'],
  Education: ['Learn without limits.', 'Empowering curious minds.', 'Education for the future.'],
  default:   ['Excellence in everything.', 'Driven by purpose.', 'Your success is our focus.'],
}
const HEADLINES: Record<string, string[]> = {
  SaaS:      ['Launch faster.', 'Automate everything.', 'Grow without friction.'],
  Fintech:   ['Send money instantly.', 'Payments, simplified.', 'Banking reimagined.'],
  Retail:    ['Shop the collection.', 'New arrivals are here.', 'Exclusive deals inside.'],
  Agency:    ['Let\'s build something great.', 'Your brand, elevated.', 'Results-driven design.'],
  Health:    ['Feel better, faster.', 'Your wellness journey starts here.', 'Expert care, anywhere.'],
  Education: ['Start learning today.', 'Unlock your potential.', 'Knowledge is power.'],
  default:   ['Welcome to the future.', 'We\'re glad you\'re here.', 'Let\'s get started.'],
}
const CTAS: Record<string, string[]> = {
  Premium:    ['Discover More', 'Get Exclusive Access', 'Elevate Your Brand'],
  Playful:    ['Let\'s Go! 🚀', 'Join the Fun', 'Start for Free'],
  Professional:['Get Started', 'Request a Demo', 'Schedule a Call'],
  Bold:       ['Take Action Now', 'Join Today', 'Claim Your Spot'],
  default:    ['Get Started', 'Learn More', 'Contact Us'],
}

function getSuggestions(kit: BrandKit) {
  const ind = kit.industry || 'default'
  const tone = kit.tone || 'default'
  return {
    taglines: TAGLINES[ind] || TAGLINES.default,
    headlines: HEADLINES[ind] || HEADLINES.default,
    ctas: CTAS[tone] || CTAS.default,
  }
}

// ── Asset types config ─────────────────────────────────────
const ASSETS: { id: AssetType; label: string; icon: string; desc: string }[] = [
  { id: 'business-card', icon: '🪪', label: 'Business Card', desc: 'Single or double-sided' },
  { id: 'social-banner', icon: '📢', label: 'Social Banner', desc: '1200 × 628 · Facebook/LinkedIn' },
  { id: 'instagram',     icon: '📸', label: 'Instagram Post', desc: '1080 × 1080 · Square' },
  { id: 'email-header',  icon: '✉️',  label: 'Email Header', desc: '600 × 200 · Newsletter' },
  { id: 'flyer',         icon: '📄', label: 'Flyer', desc: 'A4 Portrait · Event / Promo' },
  { id: 'poster',        icon: '🖼',  label: 'Poster', desc: 'A3 Portrait · Marketing' },
]

const DEMO_KIT: BrandKit = {
  logo: null, primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9',
  font: 'Inter', industry: 'SaaS', tone: 'Professional',
}

function loadKit(): BrandKit {
  try {
    const raw = sessionStorage.getItem('wb_project') || sessionStorage.getItem('bs_active_project')
    if (raw) return (JSON.parse(raw) as any).kit || DEMO_KIT
  } catch { /* ignore */ }
  return DEMO_KIT
}

// ── Export engine ─────────────────────────────────────────
type ExportFormat = 'png-1x' | 'png-2x' | 'png-3x' | 'webp' | 'jpeg' | 'pdf'

async function renderToCanvas(el: HTMLElement, scale: number): Promise<HTMLCanvasElement> {
  const { width, height } = el.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width  = Math.round(width  * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml">${el.outerHTML}</div>
    </foreignObject>
  </svg>`
  const img = new Image()
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  await new Promise(r => { img.onload = r })
  ctx.drawImage(img, 0, 0)
  return canvas
}

function downloadDataUrl(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
}

async function exportAsset(el: HTMLElement, slug: string, format: ExportFormat) {
  if (format === 'pdf') {
    const win = window.open('', '_blank')!
    win.document.write(`<!DOCTYPE html><html><head>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{display:flex;justify-content:center;align-items:flex-start;padding:32px;background:#fff}
      @media print{body{padding:0}@page{margin:0}}</style></head>
      <body>${el.outerHTML}<script>window.onload=()=>{window.print();window.close()}<\/script></body></html>`)
    win.document.close()
    return
  }
  const scaleMap: Record<ExportFormat, number> = {
    'png-1x': 1, 'png-2x': 2, 'png-3x': 3, 'webp': 2, 'jpeg': 2, pdf: 1,
  }
  const canvas = await renderToCanvas(el, scaleMap[format])
  const extMap: Record<ExportFormat, string>  = {
    'png-1x': 'png', 'png-2x': 'png', 'png-3x': 'png', webp: 'webp', jpeg: 'jpg', pdf: 'pdf',
  }
  const mimeMap: Record<ExportFormat, string> = {
    'png-1x': 'image/png', 'png-2x': 'image/png', 'png-3x': 'image/png',
    webp: 'image/webp', jpeg: 'image/jpeg', pdf: 'image/png',
  }
  const quality = format === 'jpeg' ? 0.92 : undefined
  downloadDataUrl(canvas.toDataURL(mimeMap[format], quality), `${slug}.${extMap[format]}`)
}

// ── Field editor ───────────────────────────────────────────
const fieldConfig: Record<AssetType, { key: string; label: string; placeholder: string }[]> = {
  'business-card': [
    { key: 'name',    label: 'Full Name',    placeholder: 'Jane Smith' },
    { key: 'title',   label: 'Job Title',    placeholder: 'Chief Executive Officer' },
    { key: 'company', label: 'Company Name', placeholder: 'Acme Corp' },
    { key: 'email',   label: 'Email',        placeholder: 'jane@acme.com' },
    { key: 'phone',   label: 'Phone',        placeholder: '+27 82 000 0000' },
    { key: 'website', label: 'Website',      placeholder: 'www.acme.com' },
    { key: 'tagline', label: 'Tagline',      placeholder: 'Building the future' },
  ],
  'social-banner': [
    { key: 'headline',    label: 'Headline',    placeholder: 'Your Bold Headline' },
    { key: 'subheadline', label: 'Subheadline', placeholder: 'Supporting description' },
    { key: 'cta',         label: 'CTA Button',  placeholder: 'Learn More' },
  ],
  instagram: [
    { key: 'headline',    label: 'Headline',  placeholder: 'Your Message' },
    { key: 'subheadline', label: 'Subtext',   placeholder: 'Tagline or handle' },
    { key: 'emoji',       label: 'Emoji',     placeholder: '✨' },
    { key: 'company',     label: 'Brand Name',placeholder: 'Company' },
  ],
  'email-header': [
    { key: 'headline',    label: 'Title',     placeholder: 'Monthly Newsletter' },
    { key: 'subheadline', label: 'Subtitle',  placeholder: 'April 2025 Edition' },
    { key: 'company',     label: 'Company',   placeholder: 'Company Name' },
  ],
  flyer: [
    { key: 'headline', label: 'Event/Title', placeholder: 'Grand Opening' },
    { key: 'body',     label: 'Description', placeholder: 'Join us for...' },
    { key: 'date',     label: 'Date',        placeholder: '20 April 2025' },
    { key: 'location', label: 'Location',    placeholder: 'Cape Town, SA' },
    { key: 'cta',      label: 'CTA',         placeholder: 'RSVP Now' },
    { key: 'company',  label: 'Company',     placeholder: 'Company' },
  ],
  poster: [
    { key: 'headline', label: 'Headline',    placeholder: 'Bold Statement' },
    { key: 'body',     label: 'Body Copy',   placeholder: 'Supporting description...' },
    { key: 'cta',      label: 'CTA',         placeholder: 'Get Started' },
    { key: 'company',  label: 'Company',     placeholder: 'Company' },
    { key: 'website',  label: 'Website',     placeholder: 'www.company.com' },
  ],
}

// ── Recent designs (localStorage) ────────────────────────
const RECENT_KEY = 'ba_recent_designs'
type RecentDesign = { id: string; asset: AssetType; company: string; ts: number; state: Record<string, string> }
function loadRecent(): RecentDesign[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}
function saveRecent(d: RecentDesign) {
  const list = loadRecent().filter(r => r.id !== d.id).slice(0, 11)
  localStorage.setItem(RECENT_KEY, JSON.stringify([d, ...list]))
}

// ── Main page ──────────────────────────────────────────────
export default function BrandAssetsPage() {
  const kit = loadKit()
  const [view, setView] = useState<'home'|'editor'>('home')
  const [asset, setAsset] = useState<AssetType>('business-card')
  const [cardSide, setCardSide] = useState<'single'|'double'>('double')
  const [activeSide, setActiveSide] = useState<'front'|'back'>('front')
  const [recentDesigns, setRecentDesigns] = useState<RecentDesign[]>(loadRecent)
  const [text, setText] = useState<Record<string, string>>({
    company: kit.industry || 'Company', name: 'Your Name', title: 'CEO & Founder',
    headline: HEADLINES[kit.industry || 'default']?.[0] || 'Your Headline',
    subheadline: TAGLINES[kit.industry || 'default']?.[0] || 'Your tagline',
    cta: CTAS[kit.tone || 'default']?.[0] || 'Get Started',
    emoji: '✨',
    // colour overrides — default to brand kit
    colorPrimary:   kit.primary,
    colorSecondary: kit.secondary,
    colorAccent:    kit.accent,
  })
  const [exporting, setExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png-2x')
  const [activeTemplate, setActiveTemplate] = useState<string|null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const sugg = getSuggestions(kit)
  const templates = getTemplates(asset)

  // Effective kit: merge brand kit with any per-asset colour overrides
  const effectiveKit: BrandKit = {
    ...kit,
    primary:   text.colorPrimary   || kit.primary,
    secondary: text.colorSecondary || kit.secondary,
    accent:    text.colorAccent    || kit.accent,
  }

  const update = (k: string, v: string) => setText(p => ({ ...p, [k]: v }))

  const applyTemplate = (tplId: string) => {
    const tpl = templates.find(t => t.id === tplId)
    if (!tpl) return
    setText(p => ({ ...p, ...tpl.text }))
    setActiveTemplate(tplId)
  }

  const goToEditor = (a: AssetType) => { setAsset(a); setView('editor') }

  const openRecent = (id: string) => {
    const d = recentDesigns.find(r => r.id === id)
    if (!d) return
    setAsset(d.asset)
    setText(p => ({ ...p, ...d.state }))
    setView('editor')
  }

  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return
    setExporting(true)
    const slug = `${asset}-${(text.company || 'brand').toLowerCase().replace(/\s+/g, '-')}`
    const id = `${asset}-${Date.now()}`
    try {
      await exportAsset(canvasRef.current, slug, exportFormat)
      const recent: RecentDesign = { id, asset, company: text.company || 'Design', ts: Date.now(), state: text }
      saveRecent(recent)
      setRecentDesigns(loadRecent())
    }
    catch { alert('Export failed — try a different browser.') }
    finally { setExporting(false) }
  }, [asset, text, exportFormat])

  const inputSt: React.CSSProperties = {
    width: '100%', padding: '8px 11px', borderRadius: 7,
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
    color: 'white', fontSize: 13, outline: 'none', fontFamily: 'inherit',
  }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5, display: 'block' }
  const chip = (val: string, key: string): React.ReactNode => (
    <button key={val} onClick={() => update(key, val)}
      style={{ padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', fontSize: 11, cursor: 'pointer', textAlign: 'left' }}>
      {val}
    </button>
  )

  // ── HOME view ──
  if (view === 'home') {
    return (
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font)', background: '#040608', color: 'white', overflow: 'hidden' }}>
        <StudioSidebar kit={effectiveKit} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <BrandAssetsHome kit={effectiveKit} recentDesigns={recentDesigns} onSelect={goToEditor} onOpenRecent={openRecent} />
        </div>
      </div>
    )
  }

  // ── EDITOR view ──
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font)', background: '#040608', color: 'white', overflow: 'hidden' }}>
      <StudioSidebar kit={effectiveKit} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />

      {/* ── LEFT: Asset type selector ── */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: '#080b14', overflowY: 'auto', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Back to home */}
        <button onClick={() => setView('home')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 7, border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', marginBottom: 6 }}>
          ← All Formats
        </button>
        {ASSETS.map(a => (
          <button key={a.id} onClick={() => setAsset(a.id)}
            style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 8, border: `1px solid ${asset === a.id ? kit.primary + '60' : 'transparent'}`, background: asset === a.id ? kit.primary + '18' : 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: asset === a.id ? 'white' : 'rgba(255,255,255,0.6)' }}>{a.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{a.desc}</div>
            </div>
          </button>
        ))}

        {/* Kit preview */}
        <div style={{ marginTop: 'auto', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Brand Kit</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {[kit.primary, kit.secondary, kit.accent].map(c => (
              <div key={c} style={{ width: 24, height: 24, borderRadius: 6, background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{kit.font} · {kit.industry}</div>
        </div>
      </div>

      {/* ── CENTRE: Canvas ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.01) 0px,rgba(255,255,255,0.01) 1px,transparent 1px,transparent 24px)', overflow: 'auto', padding: 40 }}>

        {/* Business card options */}
        {asset === 'business-card' && (
          <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4 }}>
            {(['single','double'] as const).map(s => (
              <button key={s} onClick={() => setCardSide(s)}
                style={{ padding: '6px 18px', borderRadius: 7, border: 'none', background: cardSide === s ? 'rgba(255,255,255,0.12)' : 'transparent', color: cardSide === s ? 'white' : 'rgba(255,255,255,0.45)', fontWeight: 700, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}>
                {s}-sided
              </button>
            ))}
            {cardSide === 'double' && (
              <>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 2px' }} />
                {(['front','back'] as const).map(s => (
                  <button key={s} onClick={() => setActiveSide(s)}
                    style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: activeSide === s ? kit.primary + '30' : 'transparent', color: activeSide === s ? kit.accent : 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}>
                    {s}
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        {/* Canvas */}
        <motion.div ref={canvasRef} key={asset + cardSide + activeSide}
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}
          style={{ filter: 'drop-shadow(0 24px 64px rgba(0,0,0,0.7))' }}>
          {asset === 'business-card' && cardSide === 'single'
            ? <BusinessCardSingle kit={effectiveKit} text={text} />
            : asset === 'business-card' && activeSide === 'front'
            ? <BusinessCardFront kit={effectiveKit} text={text} />
            : asset === 'business-card'
            ? <BusinessCardBack kit={effectiveKit} text={text} />
            : asset === 'social-banner' ? <SocialBannerTemplate kit={effectiveKit} text={text} />
            : asset === 'instagram'     ? <InstagramTemplate kit={effectiveKit} text={text} />
            : asset === 'email-header'  ? <EmailHeaderTemplate kit={effectiveKit} text={text} />
            : asset === 'flyer'         ? <FlyerTemplate kit={effectiveKit} text={text} />
            : <PosterTemplate kit={effectiveKit} text={text} />
          }
        </motion.div>

        {/* ── Format selector + Export ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {/* Digital */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>💻 Digital</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {([
                ['png-1x', 'PNG 1×', 'Screen'],
                ['png-2x', 'PNG 2×', 'Retina'],
                ['webp',   'WebP',   'Web'],
                ['jpeg',   'JPEG',   'Social'],
              ] as [ExportFormat, string, string][]).map(([fmt, label, hint]) => (
                <button key={fmt} onClick={() => setExportFormat(fmt)}
                  style={{ padding: '6px 12px', borderRadius: 7, border: `1px solid ${exportFormat === fmt ? effectiveKit.accent : 'rgba(255,255,255,0.1)'}`, background: exportFormat === fmt ? `${effectiveKit.accent}22` : 'rgba(255,255,255,0.04)', color: exportFormat === fmt ? effectiveKit.accent : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {label} <span style={{ opacity: 0.55, fontWeight: 400 }}>{hint}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Print */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🖨️ Print</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {([
                ['png-3x', 'PNG 3×', '300dpi'],
                ['pdf',    'PDF',    'Print dialog'],
              ] as [ExportFormat, string, string][]).map(([fmt, label, hint]) => (
                <button key={fmt} onClick={() => setExportFormat(fmt)}
                  style={{ padding: '6px 12px', borderRadius: 7, border: `1px solid ${exportFormat === fmt ? effectiveKit.accent : 'rgba(255,255,255,0.1)'}`, background: exportFormat === fmt ? `${effectiveKit.accent}22` : 'rgba(255,255,255,0.04)', color: exportFormat === fmt ? effectiveKit.accent : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {label} <span style={{ opacity: 0.55, fontWeight: 400 }}>{hint}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Export button */}
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={handleExport} disabled={exporting}
            style={{ padding: '11px 36px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${effectiveKit.primary},${effectiveKit.secondary})`, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: `0 4px 20px ${effectiveKit.primary}50`, opacity: exporting ? 0.7 : 1 }}>
            {exporting ? '⏳ Exporting…' : `⬇️ Export ${exportFormat.toUpperCase().replace('-', ' ')}`}
          </motion.button>
        </div>

        {asset === 'business-card' && cardSide === 'double' && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: -12 }}>
            Switch between Front / Back to export each side separately
          </div>
        )}
      </div>

      {/* ── RIGHT: Controls + AI suggestions ── */}
      <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#080b14', overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Templates */}
        {templates.length > 0 && (
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>🎨 Templates</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {templates.map(t => (
                <button key={t.id} onClick={() => applyTemplate(t.id)}
                  style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${activeTemplate === t.id ? effectiveKit.accent : 'rgba(255,255,255,0.1)'}`, background: activeTemplate === t.id ? `${effectiveKit.accent}22` : 'rgba(255,255,255,0.04)', color: activeTemplate === t.id ? effectiveKit.accent : 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Logo upload — business card only */}
        {asset === 'business-card' && (
          <div style={{ marginBottom: 4 }}>
            <label style={lbl}>Logo</label>
            {text.logo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={text.logo} alt="logo" style={{ height: 36, maxWidth: 120, objectFit: 'contain', borderRadius: 6, background: 'rgba(255,255,255,0.06)', padding: 4 }} />
                <button onClick={() => update('logo', '')}
                  style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 11, cursor: 'pointer' }}>✕ Remove</button>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: 20 }}>🖼</span>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Upload Logo</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>PNG, SVG, WebP (transparent recommended)</div>
                </div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                  const file = e.target.files?.[0]; if (!file) return
                  const reader = new FileReader()
                  reader.onload = ev => update('logo', ev.target?.result as string)
                  reader.readAsDataURL(file)
                }} />
              </label>
            )}
          </div>
        )}

        {/* Text fields */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>✏️ Edit Content</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {fieldConfig[asset].map(f => (
              <div key={f.key}>
                <label style={lbl}>{f.label}</label>
                <input value={text[f.key] || ''} onChange={e => update(f.key, e.target.value)}
                  placeholder={f.placeholder} style={inputSt} />
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>🤖 AI Suggestions</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Based on: <span style={{ color: kit.accent }}>{kit.industry} · {kit.tone}</span></div>

          <label style={{ ...lbl, color: 'rgba(255,255,255,0.5)' }}>Headlines</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {sugg.headlines.map(h => chip(h, 'headline'))}
          </div>

          <label style={{ ...lbl, color: 'rgba(255,255,255,0.5)' }}>Taglines</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {sugg.taglines.map(t => chip(t, 'subheadline'))}
            {sugg.taglines.map(t => chip(t, 'tagline'))}
          </div>

          <label style={{ ...lbl, color: 'rgba(255,255,255,0.5)' }}>CTAs</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {sugg.ctas.map(c => chip(c, 'cta'))}
          </div>
        </div>

        {/* Colour overrides */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎨 Colours</div>
            <button onClick={() => setText(p => ({ ...p, colorPrimary: kit.primary, colorSecondary: kit.secondary, colorAccent: kit.accent }))}
              style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>↺ Reset</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {([
              ['colorPrimary',   'Primary',   effectiveKit.primary],
              ['colorSecondary', 'Secondary', effectiveKit.secondary],
              ['colorAccent',    'Accent',    effectiveKit.accent],
            ] as [string, string, string][]).map(([key, label, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="color" value={val} onChange={e => update(key, e.target.value)}
                  style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', background: 'none', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{val}</div>
                </div>
                {val !== [kit.primary, kit.secondary, kit.accent][['colorPrimary','colorSecondary','colorAccent'].indexOf(key)] && (
                  <span style={{ fontSize: 9, padding: '2px 5px', borderRadius: 4, background: `${effectiveKit.accent}22`, color: effectiveKit.accent }}>custom</span>
                )}
              </div>
            ))}
          </div>
          {/* Live gradient preview */}
          <div style={{ height: 6, borderRadius: 99, background: `linear-gradient(90deg,${effectiveKit.primary},${effectiveKit.secondary},${effectiveKit.accent})`, marginTop: 14 }} />
        </div>
      </div>
    </div>
  )
}
