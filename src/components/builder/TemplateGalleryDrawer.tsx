import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandKit, PageSection } from '../../types'

export interface HeroTemplate {
  id: string
  name: string
  category: string
  tags: string[]
  preview: string          // emoji thumbnail
  description: string
  accent: string
  buildSections: (kit: BrandKit) => PageSection[]
}

// ── Hero background CSS generators ────────────────────────────────────────────
const auraBg = (kit: BrandKit) =>
  `radial-gradient(ellipse at 30% 40%,${kit.primary}44 0%,transparent 60%),radial-gradient(ellipse at 75% 60%,${kit.secondary}33 0%,transparent 55%),radial-gradient(ellipse at 60% 10%,${kit.accent}22 0%,transparent 50%),#050810`

const particleBg = (kit: BrandKit) =>
  `radial-gradient(circle at 20% 50%,${kit.primary}30 0%,transparent 50%),radial-gradient(circle at 80% 50%,${kit.accent}25 0%,transparent 50%),linear-gradient(160deg,#060911,#0a0f1a)`

const glassBg = (kit: BrandKit) =>
  `linear-gradient(135deg,${kit.primary}18,${kit.secondary}12),#08090f`

const meshBg = (kit: BrandKit) =>
  `conic-gradient(from 180deg at 50% 50%,${kit.primary}22,${kit.secondary}18,${kit.accent}15,${kit.primary}22),#060911`

const cinematicBg = (kit: BrandKit) =>
  `linear-gradient(180deg,#000 0%,${kit.primary}28 40%,${kit.secondary}20 70%,#000 100%)`

const corporateBg = (_kit: BrandKit) =>
  `linear-gradient(160deg,#f8fafc 0%,#e2e8f0 100%)`

// ── Inline CSS animation injector ──────────────────────────────────────────────
const injectKeyframes = (id: string, css: string) => {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const el = document.createElement('style')
  el.id = id
  el.textContent = css
  document.head.appendChild(el)
}

// ── Template definitions ───────────────────────────────────────────────────────
export const HERO_TEMPLATES: HeroTemplate[] = [
  {
    id: 'aurora-dark',
    name: 'Aurora Dark',
    category: 'Cinematic',
    tags: ['SaaS','Tech','Agency','Dark'],
    preview: '🌌',
    description: 'Flowing aurora radials with animated gradient orbs. Inspired by Linear, Vercel, and Stripe.',
    accent: '#6366f1',
    buildSections: (kit) => [
      { id:'nav-1',  type:'navbar',   enabled:true, content:{ logoText:kit.industry||'Brand' } },
      { id:'hero-1', type:'hero',     enabled:true, content:{ heading:'Built for the future.', subheading:'The platform that scales with your ambition. Launch faster, grow smarter.', ctaText:'Get Started Free', ctaLink:'#', heroStyle:'centered' } },
      { id:'log-1',  type:'logobar',  enabled:true, content:{ heading:'Trusted by industry leaders' } },
      { id:'fea-1',  type:'features', enabled:true, content:{ heading:'Everything you need to win', subheading:'One platform. Infinite possibilities.' } },
      { id:'sta-1',  type:'stats',    enabled:true, content:{ heading:'Proven at scale' } },
      { id:'cta-1',  type:'cta',      enabled:true, content:{ heading:'Ready to get started?', subheading:'Join thousands of teams already building with us.', ctaText:'Start for free →' } },
      { id:'foo-1',  type:'footer',   enabled:true, content:{ companyName:kit.industry||'Brand' } },
    ],
  },
  {
    id: 'particle-field',
    name: 'Particle Field',
    category: 'Cinematic',
    tags: ['AI','Tech','Crypto','Dark'],
    preview: '✦',
    description: 'Dense particle constellation background with glowing accent nodes and floating orbs.',
    accent: '#a78bfa',
    buildSections: (kit) => [
      { id:'nav-1',  type:'navbar',       enabled:true, content:{ logoText:kit.industry||'Brand' } },
      { id:'her-1',  type:'hero',         enabled:true, content:{ heading:'Intelligence, redefined.', subheading:'AI-native infrastructure for the teams building what comes next.', ctaText:'Join the waitlist', ctaLink:'#', heroStyle:'centered' } },
      { id:'fea-1',  type:'features',     enabled:true, content:{ heading:'Designed for scale' } },
      { id:'tes-1',  type:'testimonials', enabled:true, content:{ heading:'What builders are saying' } },
      { id:'faq-1',  type:'faq',          enabled:true, content:{ heading:'Common questions' } },
      { id:'cta-1',  type:'cta',          enabled:true, content:{ heading:'Start building today', ctaText:'Request Access →' } },
      { id:'foo-1',  type:'footer',       enabled:true, content:{ companyName:kit.industry||'Brand' } },
    ],
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    category: 'Premium',
    tags: ['Finance','FinTech','SaaS','Dark'],
    preview: '🔮',
    description: 'Layered frosted glass panels over a rich gradient. Premium fintech and enterprise feel.',
    accent: '#67e8f9',
    buildSections: (kit) => [
      { id:'nav-1',  type:'navbar',   enabled:true, content:{ logoText:kit.industry||'Brand' } },
      { id:'her-1',  type:'hero',     enabled:true, content:{ heading:'Secure. Fast. Trusted.', subheading:'The financial infrastructure powering modern businesses across Africa.', ctaText:'Open an Account', ctaLink:'#', heroStyle:'split' } },
      { id:'sta-1',  type:'stats',    enabled:true, content:{ heading:'Numbers that speak' } },
      { id:'fea-1',  type:'features', enabled:true, content:{ heading:'Enterprise-grade by default' } },
      { id:'pri-1',  type:'pricing',  enabled:true, content:{ heading:'Transparent pricing' } },
      { id:'cta-1',  type:'cta',      enabled:true, content:{ heading:'Start your journey', ctaText:'Get Started →' } },
      { id:'foo-1',  type:'footer',   enabled:true, content:{ companyName:kit.industry||'Brand' } },
    ],
  },
  {
    id: 'mesh-gradient',
    name: 'Mesh Gradient',
    category: 'Modern',
    tags: ['Design','Creative','Agency','Startup'],
    preview: '🎨',
    description: 'Flowing conic mesh gradient that shifts between your brand colours. Feels alive and contemporary.',
    accent: '#f59e0b',
    buildSections: (kit) => [
      { id:'nav-1',  type:'navbar',       enabled:true, content:{ logoText:kit.industry||'Brand' } },
      { id:'her-1',  type:'hero',         enabled:true, content:{ heading:'We make brands move.', subheading:'Strategy, design and code for companies that refuse to be ordinary.', ctaText:'See our work', ctaLink:'#', heroStyle:'centered' } },
      { id:'fea-1',  type:'features',     enabled:true, content:{ heading:'What we do best' } },
      { id:'tes-1',  type:'testimonials', enabled:true, content:{ heading:'Client stories' } },
      { id:'sta-1',  type:'stats',        enabled:true, content:{ heading:'By the numbers' } },
      { id:'cta-1',  type:'cta',          enabled:true, content:{ heading:'Start a project', ctaText:'Get in touch →' } },
      { id:'foo-1',  type:'footer',       enabled:true, content:{ companyName:kit.industry||'Brand' } },
    ],
  },
  {
    id: 'cinematic-split',
    name: 'Cinematic Split',
    category: 'Cinematic',
    tags: ['Product','E-Commerce','Lifestyle'],
    preview: '🎬',
    description: 'Full-bleed dramatic split layout. Dark cinematic gradient meets bold product imagery.',
    accent: '#ec4899',
    buildSections: (kit) => [
      { id:'nav-1',  type:'navbar',       enabled:true, content:{ logoText:kit.industry||'Brand' } },
      { id:'her-1',  type:'hero',         enabled:true, content:{ heading:`The new ${kit.industry||'standard'}.`, subheading:'Designed without compromise. Built to last.', ctaText:'Shop Now', ctaLink:'#', heroStyle:'split' } },
      { id:'fea-1',  type:'features',     enabled:true, content:{ heading:"Why we're different" } },
      { id:'tes-1',  type:'testimonials', enabled:true, content:{ heading:'What customers say' } },
      { id:'new-1',  type:'newsletter',   enabled:true, content:{ heading:'Join the inner circle' } },
      { id:'foo-1',  type:'footer',       enabled:true, content:{ companyName:kit.industry||'Brand' } },
    ],
  },
  {
    id: 'corporate-clean',
    name: 'Corporate Clean',
    category: 'Professional',
    tags: ['Corporate','Law','Consulting','Medical','Light'],
    preview: '🏢',
    description: 'Clean white-background layout with sharp typography and professional structure. Credibility-first.',
    accent: '#3b82f6',
    buildSections: (kit) => [
      { id:'nav-1',  type:'navbar',       enabled:true, content:{ logoText:kit.industry||'Brand' } },
      { id:'her-1',  type:'hero',         enabled:true, content:{ heading:'Excellence in every detail.', subheading:'Delivering measurable results for clients across South Africa since 2010.', ctaText:'Book a Consultation', ctaLink:'#', heroStyle:'centered' } },
      { id:'sta-1',  type:'stats',        enabled:true, content:{ heading:'Our track record' } },
      { id:'fea-1',  type:'features',     enabled:true, content:{ heading:'Our services' } },
      { id:'tes-1',  type:'testimonials', enabled:true, content:{ heading:'Client testimonials' } },
      { id:'con-1',  type:'contact',      enabled:true, content:{ heading:'Get in touch' } },
      { id:'foo-1',  type:'footer',       enabled:true, content:{ companyName:kit.industry||'Brand' } },
    ],
  },
  {
    id: 'saas-dark',
    name: 'SaaS Command',
    category: 'Modern',
    tags: ['SaaS','B2B','Software','Dashboard'],
    preview: '⚡',
    description: 'Dense, feature-rich SaaS layout. Grid backgrounds, comparison tables, and social proof.',
    accent: '#10b981',
    buildSections: (kit) => [
      { id:'nav-1',  type:'navbar',   enabled:true, content:{ logoText:kit.industry||'Brand' } },
      { id:'her-1',  type:'hero',     enabled:true, content:{ heading:'The OS for your team.', subheading:'Replace 10 tools with one. Ship faster. Collaborate better. Scale confidently.', ctaText:'Start for free', ctaLink:'#', heroStyle:'centered' } },
      { id:'log-1',  type:'logobar',  enabled:true, content:{ heading:'Used by teams at' } },
      { id:'fea-1',  type:'features', enabled:true, content:{ heading:'Built for modern teams' } },
      { id:'pri-1',  type:'pricing',  enabled:true, content:{ heading:'Simple, honest pricing' } },
      { id:'faq-1',  type:'faq',      enabled:true, content:{ heading:'Frequently asked questions' } },
      { id:'cta-1',  type:'cta',      enabled:true, content:{ heading:'Join 10,000+ teams', ctaText:'Get started free →' } },
      { id:'foo-1',  type:'footer',   enabled:true, content:{ companyName:kit.industry||'Brand' } },
    ],
  },
  {
    id: 'portfolio-motion',
    name: 'Portfolio Motion',
    category: 'Creative',
    tags: ['Portfolio','Freelancer','Designer','Developer'],
    preview: '🎭',
    description: 'Bold typographic hero with animated reveal. Perfect for creatives and personal brands.',
    accent: '#f59e0b',
    buildSections: (kit) => [
      { id:'nav-1',  type:'navbar',       enabled:true, content:{ logoText:kit.industry||'Brand' } },
      { id:'her-1',  type:'hero',         enabled:true, content:{ heading:'I design things that matter.', subheading:'Senior product designer based in Johannesburg. Available for select projects.', ctaText:'View work', ctaLink:'#', heroStyle:'centered' } },
      { id:'fea-1',  type:'features',     enabled:true, content:{ heading:'Services' } },
      { id:'tes-1',  type:'testimonials', enabled:true, content:{ heading:'Kind words' } },
      { id:'con-1',  type:'contact',      enabled:true, content:{ heading:'Work together' } },
      { id:'foo-1',  type:'footer',       enabled:true, content:{ companyName:kit.industry||'Brand' } },
    ],
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(HERO_TEMPLATES.map(t => t.category)))]

// ── Preview card background renderer ──────────────────────────────────────────
function TemplatePreviewCard({ tpl, kit, selected, onClick }: { tpl: HeroTemplate; kit: BrandKit; selected: boolean; onClick: () => void }) {
  const bgMap: Record<string, (k: BrandKit) => string> = {
    'aurora-dark': auraBg,
    'particle-field': particleBg,
    'glassmorphism': glassBg,
    'mesh-gradient': meshBg,
    'cinematic-split': cinematicBg,
    'corporate-clean': corporateBg,
    'saas-dark': particleBg,
    'portfolio-motion': meshBg,
  }
  const bg = bgMap[tpl.id]?.(kit) || auraBg(kit)
  const isLight = tpl.id === 'corporate-clean'

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${selected ? kit.primary : 'rgba(255,255,255,0.07)'}`, position: 'relative', background: '#060911', boxShadow: selected ? `0 0 0 2px ${kit.primary}60, 0 16px 40px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)', transition: 'border-color 0.2s, box-shadow 0.2s' }}>

      {/* Mini preview */}
      <div style={{ height: 160, background: bg, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${isLight ? 'rgba(0,0,0,0.04)' : 'rgba(99,102,241,0.05)'} 1px,transparent 1px),linear-gradient(90deg,${isLight ? 'rgba(0,0,0,0.04)' : 'rgba(99,102,241,0.05)'} 1px,transparent 1px)`, backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        {/* Mock navbar */}
        <div style={{ position: 'absolute', top: 10, left: 0, right: 0, padding: '0 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)' }} />
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ width: 22, height: 4, borderRadius: 2, background: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)' }} />)}
          </div>
        </div>

        {/* Mock hero text */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ width: 120, height: 8, borderRadius: 4, background: `linear-gradient(90deg,${kit.primary},${kit.secondary})`, marginBottom: 8, margin: '0 auto 8px' }} />
          <div style={{ width: 80, height: 4, borderRadius: 3, background: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)', margin: '0 auto 12px' }} />
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, background: kit.primary, fontSize: 8, color: 'white', fontWeight: 700 }}>CTA →</div>
        </div>

        {/* Glow orb */}
        {!isLight && <div style={{ position: 'absolute', top: '30%', left: '20%', width: 80, height: 80, borderRadius: '50%', background: `${kit.primary}30`, filter: 'blur(20px)', pointerEvents: 'none' }} />}
        {!isLight && <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 60, height: 60, borderRadius: '50%', background: `${kit.secondary}25`, filter: 'blur(16px)', pointerEvents: 'none' }} />}

        {/* Selected badge */}
        {selected && (
          <div style={{ position: 'absolute', top: 8, right: 8, background: kit.primary, borderRadius: 99, padding: '2px 8px', fontSize: 9, fontWeight: 800, color: 'white' }}>✓ Selected</div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px', background: '#0a0d18' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{tpl.preview} {tpl.name}</div>
          <span style={{ fontSize: 10, fontWeight: 700, color: tpl.accent, background: `${tpl.accent}18`, padding: '2px 7px', borderRadius: 99, border: `1px solid ${tpl.accent}30`, whiteSpace: 'nowrap', marginLeft: 6 }}>{tpl.category}</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginBottom: 8 }}>{tpl.description}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tpl.tags.slice(0, 3).map(tag => (
            <span key={tag} style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 99 }}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Drawer ───────────────────────────────────────────────────────────────
interface Props {
  open: boolean
  kit: BrandKit
  onClose: () => void
  onApply: (sections: PageSection[]) => void
}

export default function TemplateGalleryDrawer({ open, kit, onClose, onApply }: Props) {
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = HERO_TEMPLATES.filter(t => {
    const matchCat = category === 'All' || t.category === category
    const matchQ = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchQ
  })

  const selectedTpl = HERO_TEMPLATES.find(t => t.id === selected)

  const handleApply = () => {
    if (!selectedTpl) return
    onApply(selectedTpl.buildSections(kit))
    onClose()
  }

  // Use CSS transitions — no AnimatePresence to avoid stuck backdrop bug
  return (
    <>
      {/* Backdrop — CSS opacity transition, pointer-events toggled */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(0,0,0,0.75)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Drawer — CSS transform slide */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 780, zIndex: 401,
        background: '#080c18', borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: open ? 'all' : 'none',
      }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 2 }}>✦ Template Gallery</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{HERO_TEMPLATES.length} cinematic templates · Powered by your brand kit</div>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
            style={{ padding: '8px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 13, fontFamily: 'inherit', outline: 'none', width: 200 }} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        {/* Category tabs */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6, flexShrink: 0, overflowX: 'auto' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: '6px 16px', borderRadius: 99, border: `1px solid ${category === cat ? kit.primary : 'rgba(255,255,255,0.1)'}`, background: category === cat ? `${kit.primary}20` : 'transparent', color: category === cat ? 'white' : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: category === cat ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No templates match your search.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {filtered.map(tpl => (
                <TemplatePreviewCard key={tpl.id} tpl={tpl} kit={kit} selected={selected === tpl.id} onClick={() => setSelected(tpl.id === selected ? null : tpl.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Footer apply bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 14, background: '#060911', flexShrink: 0 }}>
          {selectedTpl ? (
            <>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{selectedTpl.preview} {selectedTpl.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{selectedTpl.buildSections(kit).length} sections · Brand kit applied automatically</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ padding: '9px 16px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Clear</button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleApply}
                style={{ padding: '10px 28px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 8px 24px ${kit.primary}40` }}>
                Apply Template →
              </motion.button>
            </>
          ) : (
            <div style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>← Select a template to apply it to your canvas</div>
          )}
        </div>
      </div>
    </>
  )
}
