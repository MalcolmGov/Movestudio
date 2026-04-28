import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { REGISTRY } from '../registry/index'
import { Storage, DEFAULT_SECTIONS } from '../types'
import { generatePalette, generateShades, PaletteSuggestion } from '../utils/colorPalette'
import { loadGoogleFont, GOOGLE_FONTS } from '../utils/fontLoader'
import { exportBrandGuidePdf } from '../utils/exportBrandGuide'

// ── Types ──────────────────────────────────────────────────
interface BrandKit {
  logo: string | null
  primary: string
  secondary: string
  accent: string
  font: string
  industry: string
  tone: string
}

const INDUSTRIES = ['Fintech', 'E-Commerce', 'SaaS', 'Healthcare', 'Real Estate', 'Education', 'Agency', 'Startup']
const TONES = ['Premium', 'Bold', 'Minimal', 'Playful', 'Corporate', 'Creative']

const FONT_CATEGORIES = [
  {
    label: 'Geometric Sans',
    fonts: [
      { name: 'Inter', style: 'Neutral · Versatile' },
      { name: 'Outfit', style: 'Rounded · Modern' },
      { name: 'Poppins', style: 'Friendly · Popular' },
      { name: 'Nunito', style: 'Soft · Rounded' },
      { name: 'Rubik', style: 'Compact · Clean' },
    ],
  },
  {
    label: 'Professional Sans',
    fonts: [
      { name: 'DM Sans', style: 'Low contrast · Sharp' },
      { name: 'Manrope', style: 'Elegant · Technical' },
      { name: 'Plus Jakarta Sans', style: 'Premium · Balanced' },
      { name: 'Figtree', style: 'Geometric · Warm' },
      { name: 'Mulish', style: 'Clean · Minimal' },
    ],
  },
  {
    label: 'Display / Expressive',
    fonts: [
      { name: 'Space Grotesk', style: 'Techy · Distinctive' },
      { name: 'Sora', style: 'Futuristic · Precise' },
      { name: 'Raleway', style: 'Elegant · Thin' },
      { name: 'Josefin Sans', style: 'Geometric · Fashion' },
      { name: 'Barlow', style: 'Condensed · Bold' },
    ],
  },
  {
    label: 'Serif / Editorial',
    fonts: [
      { name: 'Playfair Display', style: 'Luxury · Headline' },
      { name: 'Merriweather', style: 'Readable · Classic' },
      { name: 'Lora', style: 'Editorial · Warm' },
      { name: 'DM Serif Display', style: 'Sharp · High-contrast' },
      { name: 'Libre Baskerville', style: 'Academic · Trusted' },
    ],
  },
  {
    label: 'Monospace / Technical',
    fonts: [
      { name: 'JetBrains Mono', style: 'Dev · Precise' },
      { name: 'Space Mono', style: 'Retro · Technical' },
      { name: 'IBM Plex Mono', style: 'Corporate · Clean' },
      { name: 'Fira Code', style: 'Ligatures · Dev' },
    ],
  },
]

const BRAND_PALETTES = [
  { name: 'Ocean Blue', primary: '#2563eb', secondary: '#7c3aed', accent: '#06b6d4' },
  { name: 'Emerald', primary: '#059669', secondary: '#0d9488', accent: '#34d399' },
  { name: 'Sunset', primary: '#ea580c', secondary: '#dc2626', accent: '#fbbf24' },
  { name: 'Violet Night', primary: '#7c3aed', secondary: '#db2777', accent: '#a78bfa' },
  { name: 'Rose Gold', primary: '#e11d48', secondary: '#9f1239', accent: '#fb7185' },
  { name: 'Slate Pro', primary: '#475569', secondary: '#334155', accent: '#94a3b8' },
  { name: 'Mint Fresh', primary: '#0d9488', secondary: '#0891b2', accent: '#2dd4bf' },
  { name: 'Gold Elite', primary: '#b45309', secondary: '#92400e', accent: '#f59e0b' },
  { name: 'Nordic', primary: '#1e3a5f', secondary: '#1e40af', accent: '#60a5fa' },
  { name: 'Coral Tech', primary: '#f43f5e', secondary: '#7c3aed', accent: '#fb923c' },
  { name: 'Monochrome', primary: '#1f2937', secondary: '#374151', accent: '#6b7280' },
  { name: 'Move Brand', primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9' },
]

// ── Recommendation Engine ─────────────────────────────────
function getRecommendations(kit: BrandKit): string[] {
  const recs: string[] = []

  // Always recommend based on tone
  if (kit.tone === 'Premium' || kit.tone === 'Corporate') {
    recs.push('cards/glass', 'cards/glow', 'cards/spotlight', 'text/blur-text', 'text/gradient-text', 'backgrounds/aurora', 'animations/fade-blur-up', 'buttons/shimmer', 'buttons/neon', 'ui/command-menu')
  }
  if (kit.tone === 'Bold' || kit.tone === 'Creative') {
    recs.push('buttons/gradient', 'buttons/glitch', 'text/letter-pull-up', 'text/scramble', 'backgrounds/particles', 'animations/confetti', 'cards/tilt', 'cards/flip')
  }
  if (kit.tone === 'Minimal' || kit.tone === 'Startup') {
    recs.push('buttons/outline', 'cards/feature', 'layout/bento', 'layout/feature-grid', 'text/word-reveal', 'ui/skeleton', 'ui/progress', 'forms/input')
  }
  if (kit.tone === 'Playful') {
    recs.push('animations/confetti', 'animations/elastic', 'animations/ripple', 'cards/flip', 'buttons/icon', 'ui/avatar-stack', 'ui/dock')
  }

  // Industry-specific
  if (kit.industry === 'Fintech') {
    recs.push('cards/stat', 'text/count-up', 'ui/progress', 'forms/otp-input', 'overlays/alert-dialog', 'ui/timeline', 'backgrounds/grid')
  }
  if (kit.industry === 'E-Commerce') {
    recs.push('cards/expand', 'ui/marquee', 'navigation/pagination', 'forms/checkbox', 'forms/slider', 'overlays/drawer')
  }
  if (kit.industry === 'SaaS') {
    recs.push('ui/command-menu', 'ui/tabs', 'navigation/dropdown', 'forms/switch', 'ui/toast', 'layout/sidebar', 'overlays/popover')
  }
  if (kit.industry === 'Healthcare') {
    recs.push('forms/radio', 'forms/slider', 'ui/progress', 'overlays/alert', 'cards/stat', 'ui/timeline')
  }

  return [...new Set(recs)].slice(0, 12)
}

// ── Live Theme Preview ────────────────────────────────────
function applyBrandTheme(kit: BrandKit) {
  const root = document.documentElement
  root.style.setProperty('--brand-primary', kit.primary)
  root.style.setProperty('--brand-secondary', kit.secondary)
  root.style.setProperty('--brand-accent', kit.accent)
  if (kit.font) {
    const link = document.getElementById('brand-font-link') as HTMLLinkElement || document.createElement('link')
    link.id = 'brand-font-link'
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${kit.font.replace(/ /g, '+')}:wght@400;600;700;800;900&display=swap`
    document.head.appendChild(link)
  }
}

// ── Step Components ───────────────────────────────────────
function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <motion.div animate={{ background: done ? '#10b981' : active ? '#3b82f6' : 'rgba(255,255,255,0.08)', scale: active ? 1.1 : 1 }}
      style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', border: `1.5px solid ${done ? '#10b981' : active ? '#3b82f6' : 'rgba(255,255,255,0.12)'}` }}>
      {done ? '✓' : n}
    </motion.div>
  )
}

// ── Advanced Color Picker ─────────────────────────────────
function AdvancedColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [hex, setHex] = useState(value)
  const [err, setErr] = useState(false)

  const handleHex = (raw: string) => {
    setHex(raw)
    const clean = raw.startsWith('#') ? raw : '#' + raw
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) { setErr(false); onChange(clean) }
    else setErr(true)
  }

  // Harmony: tint + shade
  const makeShades = (hex: string) => {
    try {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return [
        `rgb(${Math.min(255, r + 80)},${Math.min(255, g + 80)},${Math.min(255, b + 80)})`,
        `rgb(${Math.min(255, r + 40)},${Math.min(255, g + 40)},${Math.min(255, b + 40)})`,
        hex,
        `rgb(${Math.max(0, r - 40)},${Math.max(0, g - 40)},${Math.max(0, b - 40)})`,
        `rgb(${Math.max(0, r - 80)},${Math.max(0, g - 80)},${Math.max(0, b - 80)})`,
      ]
    } catch { return [] }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {/* Picker + hex row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: value, border: '2px solid rgba(255,255,255,0.15)', cursor: 'pointer', overflow: 'hidden' }}>
            <input type="color" value={value} onChange={e => { onChange(e.target.value); setHex(e.target.value) }}
              style={{ width: '200%', height: '200%', transform: 'translate(-25%,-25%)', cursor: 'pointer', opacity: 0, position: 'absolute', inset: 0 }} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: `1px solid ${err ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.04)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--mono)' }}>#</span>
            <input value={hex.replace('#', '')} onChange={e => handleHex('#' + e.target.value)}
              maxLength={6} placeholder="3b82f6"
              style={{ background: 'none', border: 'none', outline: 'none', color: 'white', fontFamily: 'var(--mono)', fontSize: 13, width: '100%', letterSpacing: '0.05em' }} />
          </div>
          {err && <div style={{ fontSize: 10, color: '#f87171', marginTop: 2 }}>Invalid hex code</div>}
        </div>
      </div>
      {/* Shade strip */}
      <div style={{ display: 'flex', gap: 4 }}>
        {makeShades(value).map((shade, i) => (
          <div key={i} title={shade} onClick={() => onChange(value)}
            style={{ flex: 1, height: 12, borderRadius: 4, background: shade, cursor: 'pointer', opacity: i === 2 ? 1 : 0.7 }} />
        ))}
      </div>
    </div>
  )
}

// ── Branded Mini Previews (use kit colors directly) ───────
function BrandedMiniPreview({ componentKey, kit }: { componentKey: string; kit: BrandKit }) {
  const p = kit.primary, s = kit.secondary, a = kit.accent
  const font = `'${kit.font}', sans-serif`
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(0)

  const type = componentKey.split('/')[0]
  const name = componentKey.split('/')[1]

  // Button previews
  if (type === 'buttons') {
    if (name === 'shimmer') return (
      <div style={{ position: 'relative', overflow: 'hidden', padding: '11px 28px', borderRadius: 99, background: `linear-gradient(135deg,${p},${s})`, color: 'white', fontWeight: 700, fontFamily: font, fontSize: 14, cursor: 'pointer' }}>
        Get Started
        <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', width: '50%' }} />
      </div>
    )
    if (name === 'neon') return (
      <div style={{ padding: '11px 28px', borderRadius: 8, border: `1.5px solid ${a}`, color: a, fontWeight: 700, fontFamily: font, fontSize: 14, boxShadow: `0 0 16px ${a}60, inset 0 0 16px ${a}10` }}>
        Neon Button
      </div>
    )
    if (name === 'gradient') return (
      <motion.div whileHover={{ scale: 1.04 }} style={{ padding: '11px 28px', borderRadius: 10, background: `linear-gradient(135deg,${p},${s},${a})`, backgroundSize: '200%', color: 'white', fontWeight: 700, fontFamily: font, fontSize: 14, cursor: 'pointer' }}>
        Gradient Button
      </motion.div>
    )
    if (name === 'glitch') return (
      <div style={{ position: 'relative', padding: '11px 28px', fontSize: 14, fontWeight: 900, fontFamily: font, color: 'white', textShadow: `2px 0 ${p}, -2px 0 ${a}`, letterSpacing: '0.05em' }}>
        GLITCH_BTN
      </div>
    )
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ padding: '10px 20px', borderRadius: 8, background: p, color: 'white', fontWeight: 700, fontFamily: font, fontSize: 13 }}>Primary</div>
        <div style={{ padding: '10px 20px', borderRadius: 8, border: `1px solid ${a}`, color: a, fontWeight: 600, fontFamily: font, fontSize: 13 }}>Outline</div>
      </div>
    )
  }

  // Card previews
  if (type === 'cards') {
    if (name === 'glass') return (
      <motion.div whileHover={{ y: -4 }} style={{ padding: '20px 24px', borderRadius: 16, background: `${p}15`, backdropFilter: 'blur(12px)', border: `1px solid ${p}30`, minWidth: 180, textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>✦</div>
        <div style={{ fontWeight: 700, color: 'white', fontFamily: font, fontSize: 14 }}>Glass Card</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Hover to interact</div>
      </motion.div>
    )
    if (name === 'glow') return (
      <motion.div animate={{ boxShadow: [`0 0 20px ${p}40`, `0 0 40px ${p}70`, `0 0 20px ${p}40`] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ padding: '20px 24px', borderRadius: 16, background: '#111827', border: `1px solid ${p}40`, minWidth: 180, textAlign: 'center' }}>
        <div style={{ fontSize: 24, color: p, marginBottom: 8 }}>◈</div>
        <div style={{ fontWeight: 700, color: 'white', fontFamily: font, fontSize: 14 }}>Glow Card</div>
      </motion.div>
    )
    if (name === 'stat') return (
      <div style={{ display: 'flex', gap: 10 }}>
        {[['R 4.2M', 'Revenue'], ['98%', 'Uptime'], ['+24%', 'Growth']].map(([v, l]) => (
          <div key={l} style={{ padding: '12px 14px', borderRadius: 12, background: `${p}12`, border: `1px solid ${p}25`, textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: p, fontFamily: font }}>{v}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
    )
    if (name === 'tilt') return (
      <motion.div whileHover={{ rotateX: 8, rotateY: -8, scale: 1.04 }} style={{ padding: '20px 24px', borderRadius: 16, background: `linear-gradient(135deg,${p}20,${s}20)`, border: `1px solid ${p}30`, minWidth: 180, textAlign: 'center', transformStyle: 'preserve-3d' }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>⬡</div>
        <div style={{ fontWeight: 700, color: 'white', fontFamily: font }}>Tilt Card</div>
      </motion.div>
    )
    return (
      <motion.div whileHover={{ y: -4 }} style={{ padding: '20px 24px', borderRadius: 14, background: `${p}12`, border: `1px solid ${p}25`, minWidth: 200 }}>
        <div style={{ fontWeight: 700, color: 'white', fontFamily: font, marginBottom: 6 }}>{REGISTRY[componentKey]?.name}</div>
        <div style={{ height: 3, borderRadius: 99, background: `linear-gradient(to right,${p},${a})`, marginBottom: 8 }} />
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Themed component preview</div>
      </motion.div>
    )
  }

  // Text previews
  if (type === 'text') {
    if (name === 'gradient-text') return (
      <div style={{ fontSize: 28, fontWeight: 900, background: `linear-gradient(135deg,${p},${s},${a})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: font, letterSpacing: '-0.03em' }}>
        Move Digital
      </div>
    )
    if (name === 'count-up') return (
      <div style={{ textAlign: 'center' }}>
        <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 1 }}
          style={{ fontSize: 40, fontWeight: 900, color: p, fontFamily: font }}>
          R 4.2M
        </motion.div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Total Revenue</div>
      </div>
    )
    if (name === 'shiny-text') return (
      <div style={{ fontSize: 22, fontWeight: 800, fontFamily: font, background: `linear-gradient(90deg,${p},${a},${p})`, backgroundSize: '200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shiny 2s linear infinite' }}>
        Shiny Text Effect
      </div>
    )
    return (
      <motion.div initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.8 }}
        style={{ fontSize: 24, fontWeight: 800, color: 'white', fontFamily: font }}>
        {REGISTRY[componentKey]?.name}
      </motion.div>
    )
  }

  // Background previews
  if (type === 'backgrounds') {
    if (name === 'aurora') return (
      <div style={{ width: '100%', height: 140, borderRadius: 12, background: `radial-gradient(ellipse at 30% 50%, ${p}60 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, ${s}50 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, ${a}40 0%, transparent 60%), #080b14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: font, textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>Aurora Background</div>
      </div>
    )
    if (name === 'grid') return (
      <div style={{ width: '100%', height: 140, borderRadius: 12, backgroundImage: `linear-gradient(${p}20 1px,transparent 1px),linear-gradient(90deg,${p}20 1px,transparent 1px)`, backgroundSize: '24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080b14' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: a, fontFamily: font }}>Grid Background</div>
      </div>
    )
    return (
      <div style={{ width: '100%', height: 140, borderRadius: 12, background: `radial-gradient(circle at 50% 50%, ${p}40 0%, ${s}30 50%, transparent 80%), #080b14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: font }}>{REGISTRY[componentKey]?.name}</div>
      </div>
    )
  }

  // Forms
  if (type === 'forms') {
    if (name === 'otp-input') return (
      <div style={{ display: 'flex', gap: 8 }}>
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{ width: 36, height: 44, borderRadius: 8, border: `1.5px solid ${i <= 3 ? p : 'rgba(255,255,255,0.15)'}`, background: i <= 3 ? `${p}12` : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: p, fontFamily: 'monospace' }}>
            {i <= 3 ? '•' : ''}
          </div>
        ))}
      </div>
    )
    if (name === 'switch') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {['Two-Factor Auth', 'Notifications'].map((label, i) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 220 }}>
            <span style={{ fontSize: 12, color: 'white', fontFamily: font }}>{label}</span>
            <div style={{ width: 40, height: 22, borderRadius: 99, background: i === 0 ? p : 'rgba(255,255,255,0.1)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 3, left: i === 0 ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
            </div>
          </div>
        ))}
      </div>
    )
    if (name === 'slider') return (
      <div style={{ width: 240 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: font }}>Transaction Limit</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: p }}>R65k</span>
        </div>
        <div style={{ position: 'relative', height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{ position: 'absolute', left: 0, width: '65%', height: '100%', borderRadius: 99, background: `linear-gradient(to right,${p},${a})` }} />
          <div style={{ position: 'absolute', top: '50%', left: '65%', transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: `0 0 0 3px ${p}` }} />
        </div>
      </div>
    )
    return (
      <div style={{ width: 260 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontFamily: font }}>Email Address</div>
        <div style={{ padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${p}60`, background: `${p}08`, color: 'white', fontSize: 13, fontFamily: font }}>
          hello@yourbrand.com
        </div>
      </div>
    )
  }

  // Navigation
  if (type === 'navigation') {
    if (name === 'pagination') return (
      <div style={{ display: 'flex', gap: 4 }}>
        {['‹', '1', '2', '3', '4', '›'].map((n, i) => (
          <div key={i} style={{ width: 32, height: 32, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: i === 2 ? 700 : 400, background: i === 2 ? `${p}25` : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 2 ? p + '50' : 'rgba(255,255,255,0.08)'}`, color: i === 2 ? p : 'rgba(255,255,255,0.5)', fontFamily: font }}>
            {n}
          </div>
        ))}
      </div>
    )
    if (name === 'breadcrumb') return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {['Home', 'Components', 'Navigation'].map((c, i) => (
          <span key={c} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: i === 2 ? 'white' : p, fontFamily: font, fontWeight: i === 2 ? 600 : 400 }}>{c}</span>
            {i < 2 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>}
          </span>
        ))}
      </div>
    )
    return (
      <div style={{ display: 'flex', gap: 6 }}>
        {['Products', 'Solutions', 'Pricing'].map((item, i) => (
          <div key={item} style={{ padding: '7px 14px', borderRadius: 7, background: i === 0 ? `${p}20` : 'transparent', border: `1px solid ${i === 0 ? p + '40' : 'transparent'}`, color: i === 0 ? p : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, fontFamily: font }}>
            {item}
          </div>
        ))}
      </div>
    )
  }

  // Overlays
  if (type === 'overlays') {
    if (name === 'alert') return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 260 }}>
        {[['✓', 'Success', 'Transaction complete!', p], ['⚠', 'Warning', 'Verify your identity', s]].map(([icon, label, msg, color]) => (
          <div key={label as string} style={{ padding: '8px 12px', borderRadius: 8, background: `${color}12`, border: `1px solid ${color}30`, display: 'flex', gap: 8 }}>
            <span style={{ color: color as string, fontWeight: 700 }}>{icon}</span>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: color as string }}>{label}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{msg}</div></div>
          </div>
        ))}
      </div>
    )
    return (
      <div style={{ padding: '16px 20px', borderRadius: 12, background: '#111827', border: `1px solid ${p}30`, minWidth: 220 }}>
        <div style={{ fontWeight: 700, color: 'white', fontSize: 13, marginBottom: 6, fontFamily: font }}>{REGISTRY[componentKey]?.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Interactive overlay component</div>
        <div style={{ padding: '7px 14px', borderRadius: 7, background: p, color: 'white', fontSize: 12, fontWeight: 700, textAlign: 'center', fontFamily: font }}>Action</div>
      </div>
    )
  }

  // Animations / Layout / UI fallback
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg,${p},${s})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        ✦
      </motion.div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: font }}>{REGISTRY[componentKey]?.name}</div>
      <div style={{ height: 3, width: 80, borderRadius: 99, background: `linear-gradient(to right,${p},${a})` }} />
    </div>
  )
}

// ── Branded Preview Card ──────────────────────────────────
function BrandedPreviewCard({ componentKey, kit }: { componentKey: string; kit: BrandKit }) {
  const entry = REGISTRY[componentKey]
  if (!entry) return null
  const [tab, setTab] = useState<'preview' | 'code'>('preview')

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ borderRadius: 14, border: `1px solid ${kit.primary}20`, background: 'rgba(255,255,255,0.025)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: `'${kit.font}', sans-serif` }}>{entry.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{entry.description}</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['preview', 'code'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', border: `1px solid ${tab === t ? kit.primary + '60' : 'rgba(255,255,255,0.08)'}`, background: tab === t ? kit.primary + '20' : 'transparent', color: tab === t ? 'white' : 'var(--text-muted)' }}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {tab === 'preview' ? (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', overflow: 'hidden', padding: 16 }}>
          <BrandedMiniPreview componentKey={componentKey} kit={kit} />
        </div>
      ) : (
        <div style={{ background: '#0a0d1a', padding: 16, maxHeight: 180, overflow: 'auto' }}>
          <pre style={{ fontSize: 11, color: '#e2e8f0', fontFamily: 'var(--mono)', lineHeight: 1.6, margin: 0 }}>{entry.code}</pre>
        </div>
      )}
      <div style={{ padding: '8px 16px', display: 'flex', gap: 6, alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {[kit.primary, kit.secondary, kit.accent].map((c, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>Themed · {kit.font}</span>
      </div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────
export default function BrandStudioPage() {
  const [step, setStep] = useState(1)
  const [kit, setKit] = useState<BrandKit>({
    logo: null, primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9',
    font: 'Inter', industry: '', tone: '',
  })
  const [recommendations, setRecommendations] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const update = (k: keyof BrandKit, v: string) => setKit(prev => ({ ...prev, [k]: v }))

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => update('logo', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const navigate = useNavigate()

  const analyse = () => {
    applyBrandTheme(kit)
    setRecommendations(getRecommendations(kit))
    setStep(3)
  }

  const handleBuildPage = () => {
    const project = {
      id: crypto.randomUUID(),
      name: `${kit.industry} Brand — ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      kit,
      sections: DEFAULT_SECTIONS,
      activityLog: [],
    }
    Storage.saveProject(project)
    sessionStorage.setItem('bs_preview_project', JSON.stringify(project))
    navigate('/preview')
  }

  const steps = [
    { n: 1, label: 'Brand Identity' },
    { n: 2, label: 'Style Preferences' },
    { n: 3, label: 'Your Components' },
  ]

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 99, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', marginBottom: 16 }}>
          <span style={{ fontSize: 14 }}>✦</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#c4b5fd' }}>Brand Kit Studio</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: 10 }}>
          Your brand,{' '}
          <span style={{ background: 'linear-gradient(135deg,#67e8f9,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            instantly themed
          </span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 560, lineHeight: 1.7 }}>
          Upload your brand kit and we'll recommend the right components — then preview them in your exact colors and typography.
        </p>
      </motion.div>

      {/* Step Tracker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: step >= s.n ? 'pointer' : 'default' }} onClick={() => step > s.n && setStep(s.n)}>
              <StepDot n={s.n} active={step === s.n} done={step > s.n} />
              <span style={{ fontSize: 13, fontWeight: 600, color: step === s.n ? 'white' : 'var(--text-muted)' }}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 16px' }} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 1: Brand Identity ── */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {/* ── COLORS ── */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>Brand Colors</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Pick from a curated palette or enter your exact hex codes.</p>

              {/* Palette presets */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Quick Palettes</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                  {BRAND_PALETTES.map(p => (
                    <motion.button key={p.name} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { update('primary', p.primary); update('secondary', p.secondary); update('accent', p.accent) }}
                      style={{ padding: '8px 10px', borderRadius: 10, border: `1px solid ${kit.primary === p.primary && kit.secondary === p.secondary ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)'}`, background: kit.primary === p.primary && kit.secondary === p.secondary ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                        {[p.primary, p.secondary, p.accent].map((c, i) => (
                          <div key={i} style={{ flex: 1, height: 8, borderRadius: 99, background: c }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>{p.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Manual pickers */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <AdvancedColorPicker label="Primary" value={kit.primary} onChange={v => update('primary', v)} />
                <AdvancedColorPicker label="Secondary" value={kit.secondary} onChange={v => update('secondary', v)} />
                <AdvancedColorPicker label="Accent" value={kit.accent} onChange={v => update('accent', v)} />
              </div>

              {/* Gradient preview strip */}
              <div style={{ marginTop: 14, height: 10, borderRadius: 99, background: `linear-gradient(to right, ${kit.primary}, ${kit.secondary}, ${kit.accent})`, boxShadow: `0 0 20px ${kit.primary}60` }} />

              {/* ── AI PALETTE GENERATOR ── */}
              {(() => {
                const palettes = generatePalette(kit.primary)
                const shades = generateShades(kit.primary)
                return (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20, padding: '16px', borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 4 }}>🎨 Palette Generator</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14 }}>Based on your primary colour — click any scheme to apply it.</div>

                    {/* Shades row */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Shades of Primary</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {shades.map((shade, i) => (
                          <motion.div key={i} whileHover={{ scale: 1.15, y: -2 }} onClick={() => update('primary', shade)}
                            title={shade} style={{ flex: 1, height: 28, borderRadius: 6, background: shade, cursor: 'pointer' }} />
                        ))}
                      </div>
                    </div>

                    {/* Harmony schemes */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 8 }}>
                      {palettes.map(p => (
                        <motion.button key={p.name} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => { update('primary', p.colors[0]); update('secondary', p.colors[1]); update('accent', p.colors[2]) }}
                          style={{ padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left' }}>
                          <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                            {p.colors.map((c, i) => <div key={i} style={{ flex: 1, height: 10, borderRadius: 99, background: c }} />)}
                          </div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 2 }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{p.description}</div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )
              })()}

            </div>

            {/* ── FONTS ── */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>Brand Typography</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Choose a typeface that reflects your brand personality.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {FONT_CATEGORIES.map(cat => (
                  <div key={cat.label}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7 }}>{cat.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6 }}>
                      {cat.fonts.map(({ name, style }) => (
                        <motion.button key={name} whileHover={{ scale: 1.02 }} onClick={() => update('font', name)}
                          style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${kit.font === name ? kit.primary + '70' : 'rgba(255,255,255,0.07)'}`, background: kit.font === name ? kit.primary + '15' : 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left' }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: kit.font === name ? 'white' : 'rgba(255,255,255,0.8)', fontFamily: `'${name}', sans-serif`, lineHeight: 1.2, marginBottom: 3 }}>
                            {name}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{style}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── LIVE FONT PREVIEW ── */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 16, marginBottom: 28, padding: '18px', borderRadius: 14, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 12 }}>👁 Font Preview — <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{kit.font}</span></div>
              {(() => { loadGoogleFont(kit.font); return null })()}
              <div style={{ fontFamily: `'${kit.font}', sans-serif` }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 6, letterSpacing: '-0.03em' }}>Brand Headline H1</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>Subheading — H2 Level Text</div>
                <div style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 12 }}>Body copy — The quick brown fox jumps over the lazy dog. 0123456789 !@#$%</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ padding: '8px 16px', borderRadius: 8, background: kit.primary, color: 'white', fontWeight: 700, fontSize: 13 }}>Primary Button</div>
                  <div style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${kit.accent}`, color: kit.accent, fontSize: 13, fontWeight: 600 }}>Outline</div>
                  <div style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Ghost</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--mono)', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 6 }}>caption / label text</div>
                </div>
              </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              {/* Logo upload */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Logo</label>
                <div onClick={() => fileRef.current?.click()}
                  style={{ height: 100, borderRadius: 12, border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'border 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = kit.primary + '80'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}>
                  {kit.logo ? (
                    <img src={kit.logo} alt="Logo" style={{ maxHeight: 70, maxWidth: '80%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>⬆</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload logo (PNG, SVG, JPG)</div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </div>

              {/* Live preview */}
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Live Preview</div>
                <div style={{ fontFamily: `'${kit.font}', sans-serif` }}>
                  <div style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>Your Brand Name</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, fontFamily: `'${kit.font}', sans-serif` }}>The quick brown fox jumps over the lazy dog</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ padding: '8px 14px', borderRadius: 7, background: kit.primary, color: 'white', fontWeight: 700, fontSize: 12, textAlign: 'center' }}>Primary Button</div>
                    <div style={{ padding: '8px 14px', borderRadius: 7, border: `1px solid ${kit.accent}`, color: kit.accent, fontSize: 12, fontWeight: 600, textAlign: 'center', background: kit.accent + '12' }}>Accent Outline</div>
                    <div style={{ padding: '8px 14px', borderRadius: 7, border: `1px solid ${kit.secondary}`, color: 'var(--text-muted)', fontSize: 12, background: 'transparent', textAlign: 'center' }}>Ghost Button</div>
                  </div>
                </div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(2)}
              style={{ padding: '12px 28px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)', boxShadow: `0 8px 24px ${kit.primary}40` }}>
              Next: Style Preferences →
            </motion.button>
          </motion.div>
        )}

        {/* ── Step 2: Style ── */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 14 }}>Industry</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {INDUSTRIES.map(ind => (
                    <button key={ind} onClick={() => update('industry', ind)}
                      style={{ padding: '11px 14px', borderRadius: 10, border: `1px solid ${kit.industry === ind ? kit.primary + '60' : 'rgba(255,255,255,0.08)'}`, background: kit.industry === ind ? kit.primary + '18' : 'rgba(255,255,255,0.03)', color: kit.industry === ind ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: kit.industry === ind ? 700 : 400, textAlign: 'left' }}>
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 14 }}>Brand Tone</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {TONES.map(t => (
                    <button key={t} onClick={() => update('tone', t)}
                      style={{ padding: '11px 14px', borderRadius: 10, border: `1px solid ${kit.tone === t ? kit.accent + '60' : 'rgba(255,255,255,0.08)'}`, background: kit.tone === t ? kit.accent + '15' : 'rgba(255,255,255,0.03)', color: kit.tone === t ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: kit.tone === t ? 700 : 400, textAlign: 'left' }}>
                      {t}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  {kit.industry && kit.tone
                    ? `✦ A ${kit.tone.toLowerCase()} ${kit.industry} brand — we'll recommend components that convert and impress.`
                    : 'Select your industry and tone to continue.'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => setStep(1)} style={{ padding: '12px 22px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14 }}>← Back</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={analyse} disabled={!kit.industry || !kit.tone}
                style={{ padding: '12px 28px', borderRadius: 99, border: 'none', background: kit.industry && kit.tone ? `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})` : 'rgba(255,255,255,0.08)', color: kit.industry && kit.tone ? 'white' : 'var(--text-muted)', fontWeight: 700, fontSize: 14, cursor: kit.industry && kit.tone ? 'pointer' : 'not-allowed', fontFamily: 'var(--font)' }}>
                ✦ Generate My Components
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Branded Results ── */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Brand summary bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', marginBottom: 28, flexWrap: 'wrap' }}>
              {kit.logo && <img src={kit.logo} alt="Brand Logo" style={{ height: 32, objectFit: 'contain' }} />}
              <div style={{ display: 'flex', gap: 6 }}>
                {[kit.primary, kit.secondary, kit.accent].map((c, i) => (
                  <div key={i} title={c} style={{ width: 22, height: 22, borderRadius: 6, background: c, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }} />
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{kit.font}</span>
              <span style={{ padding: '3px 10px', borderRadius: 99, background: kit.primary + '20', color: kit.primary, fontSize: 11, fontWeight: 700, border: `1px solid ${kit.primary}40` }}>{kit.industry}</span>
              <span style={{ padding: '3px 10px', borderRadius: 99, background: kit.accent + '15', color: kit.accent, fontSize: 11, fontWeight: 700, border: `1px solid ${kit.accent}40` }}>{kit.tone}</span>
              <button onClick={() => setStep(1)} style={{ marginLeft: 'auto', padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font)' }}>Edit Brand</button>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 6 }}>
              {recommendations.length} components curated for your brand
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
              Previewed live in <strong style={{ color: 'white' }}>{kit.primary}</strong> · <strong style={{ color: 'white' }}>{kit.secondary}</strong> · <strong style={{ color: 'white' }}>{kit.accent}</strong> · {kit.font}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {recommendations.map((key, i) => (
                <motion.div key={key} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <BrandedPreviewCard componentKey={key} kit={kit} />
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: '24px 28px', borderRadius: 16, background: `linear-gradient(135deg,${kit.primary}12,${kit.secondary}08)`, border: `1px solid ${kit.primary}30`, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'white', fontSize: 17, marginBottom: 6 }}>Ready to build your landing page?</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>Take your brand kit into the full page composer — select sections, edit content, then preview and deploy your live page.</div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
                <button onClick={() => setStep(1)}
                  style={{ padding: '11px 20px', borderRadius: 99, border: `1px solid ${kit.primary}40`, background: 'transparent', color: 'white', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600 }}>
                  ← Refine Brand
                </button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => exportBrandGuidePdf(kit, `${kit.industry} Brand`)}
                  style={{ padding: '11px 22px', borderRadius: 99, border: `1.5px solid ${kit.accent}50`, background: 'transparent', color: kit.accent, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
                  📄 Export Brand Guide
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleBuildPage}
                  style={{ padding: '11px 24px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 800, boxShadow: `0 8px 28px ${kit.primary}50`, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Build My Page ↗
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
