import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Storage, BrandKit, PageSection, SectionContent, Project, DEFAULT_SECTIONS, SectionType } from '../types'
import { createPublishService } from '../lib/publish'
import { buildPageHtml } from '../lib/buildHtml'
import { useAuth } from '../lib/useAuth'
import { storage } from '../lib/storage'
import { SupabaseStorageProvider } from '../lib/storage/supabase'
import LoginModal from '../components/auth/LoginModal'
import { HeroSection, NavbarSection, FeaturesSection, StatsSection, TestimonialsSection, PricingSection, CtaSection, FooterSection, FaqSection, TeamSection, LogoBarSection, NewsletterSection, ContactSection, VideoSection, TimelineSection, CtaBannerSection } from '../components/sections'
import { GallerySection, ServicesSection, ProcessSection, BlogSection, ComparisonSection, MapSection, BookingSection } from '../components/sections/extended'
import BrandSetupModal from '../components/builder/BrandSetupModal'
import SectionLibraryDrawer, { SECTION_LIBRARY } from '../components/builder/SectionLibraryDrawer'
import SettingsPanel from '../components/builder/SettingsPanel'
import ComponentBlocksDrawer from '../components/builder/ComponentBlocksDrawer'
import PublishModal from '../components/builder/PublishModal'
import AiLayoutModal from '../components/builder/AiLayoutModal'
import NyraSidebar from '../components/builder/NyraSidebar'
import TemplateGalleryDrawer from '../components/builder/TemplateGalleryDrawer'
import { SectionRecommendation } from '../lib/ai'
import { REGISTRY } from '../registry'

// ── Render engine ─────────────────────────────────────────
function renderSection(sec: PageSection, kit: BrandKit, onEdit?: (key: string, val: string) => void) {
  const props = { kit, content: sec.content, editable: !!onEdit, onEdit }
  switch (sec.type) {
    case 'navbar':       return <NavbarSection {...props} />
    case 'hero':         return <HeroSection {...props} />
    case 'features':     return <FeaturesSection {...props} />
    case 'stats':        return <StatsSection {...props} />
    case 'video':        return <VideoSection {...props} />
    case 'timeline':     return <TimelineSection {...props} />
    case 'testimonials': return <TestimonialsSection {...props} />
    case 'team':         return <TeamSection {...props} />
    case 'faq':          return <FaqSection {...props} />
    case 'newsletter':   return <NewsletterSection {...props} />
    case 'contact':      return <ContactSection {...props} />
    case 'pricing':      return <PricingSection {...props} />
    case 'ctabanner':    return <CtaBannerSection {...props} />
    case 'cta':          return <CtaSection {...props} />
    case 'logobar':      return <LogoBarSection {...props} />
    case 'footer':       return <FooterSection {...props} />
    case 'gallery':      return <GallerySection {...props} />
    case 'services':     return <ServicesSection {...props} />
    case 'process':      return <ProcessSection {...props} />
    case 'blog':         return <BlogSection {...props} />
    case 'comparison':   return <ComparisonSection {...props} />
    case 'map':          return <MapSection {...props} />
    case 'booking':      return <BookingSection {...props} />
    default:             return null
  }
}

// Compute text colour style from section content (solid or gradient)
function getTextColorStyle(content: SectionContent): { isGradient: boolean; style: React.CSSProperties } | null {
  const mode = content.componentTextColorMode as string | undefined

  if (mode === 'gradient') {
    const from  = (content.componentTextGradientFrom  as string) || '#67e8f9'
    const to    = (content.componentTextGradientTo    as string) || '#8b5cf6'
    const angle = (content.componentTextGradientAngle as string) || '135'
    // ONLY background + backgroundSize inline — the clip comes from .text-gradient-clip CSS class
    return {
      isGradient: true,
      style: {
        background: `linear-gradient(${angle}deg,${from},${to})`,
        backgroundSize: '200% auto',
      },
    }
  }

  const col = content.componentTextColor as string | undefined
  if (col) {
    return { isGradient: false, style: { color: col, WebkitTextFillColor: col } }
  }

  return null
}

// Helper: merge base style + colour override, optionally add gradient CSS class
function applyColor(
  base: React.CSSProperties,
  override: ReturnType<typeof getTextColorStyle>,
  extra?: React.CSSProperties
): { style: React.CSSProperties; className?: string } {
  if (!override) return { style: { ...base, ...extra } }
  if (override.isGradient) {
    return {
      style: { ...base, ...override.style, ...extra },
      className: 'text-gradient-clip',
    }
  }
  return { style: { ...base, ...override.style, ...extra } }
}

// Render animated text component with optional colour override
function renderTextComponent(registryKey: string, text: string, content: SectionContent): React.ReactNode | null {
  const base: React.CSSProperties = { fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em' }
  const colOverride = getTextColorStyle(content)
  const hasOverride = !!colOverride
  const isGrad = colOverride?.isGradient ?? false

  // Build final props for a text element
  const textProps = (extra?: React.CSSProperties) => {
    const { style, className } = applyColor(base, colOverride, extra)
    return { style, className }
  }

  switch (registryKey) {
    case 'text/blur-text':
      return (
        <motion.div initial={{ filter:'blur(20px)',opacity:0 }} animate={{ filter:'blur(0px)',opacity:1 }} transition={{ duration:1.2 }}>
          <h2 {...textProps()}>{text}</h2>
        </motion.div>
      )
    case 'text/split-text':
      return (
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          {text.split(' ').map((w,i) => (
            <motion.div key={i} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:i*0.18,duration:0.6}}>
              <span {...textProps({ display:'inline-block' })}>{w}</span>
            </motion.div>
          ))}
        </div>
      )
    case 'text/gradient-text':
      return hasOverride
        ? <h2 {...textProps()}>{text}</h2>
        : <h2 style={{ ...base, background:'linear-gradient(135deg,#67e8f9,#3b82f6,#8b5cf6,#ec4899)', backgroundSize:'300% 300%', WebkitBackgroundClip:'text' as any, WebkitTextFillColor:'transparent', animation:'gradient-sweep 4s ease infinite' }}>{text}</h2>
    case 'text/shiny-text':
      return hasOverride
        ? <h2 {...textProps()}>{text}</h2>
        : <h2 style={{ ...base, background:'linear-gradient(90deg,white 0%,#67e8f9 40%,white 50%,white 100%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text' as any, WebkitTextFillColor:'transparent', animation:'shiny 2.5s linear infinite' }}>{text}</h2>
    case 'text/typewriter':
      return (
        <div style={{ ...base, ...(colOverride && !isGrad ? colOverride.style : {}), fontFamily:'monospace', borderRight:'3px solid #67e8f9', paddingRight:6, whiteSpace:'nowrap', overflow:'hidden', display:'inline-block' }}>
          {isGrad ? <span {...textProps()}>{text}</span> : text}
        </div>
      )
    case 'text/word-reveal':
      return (
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
          {text.split(' ').map((w,i) => (
            <motion.div key={w+i} initial={{opacity:0,filter:'blur(8px)',y:20}} animate={{opacity:1,filter:'blur(0px)',y:0}} transition={{delay:i*0.2,duration:0.7}}>
              <span {...textProps({ display:'inline-block' })}>{w}</span>
            </motion.div>
          ))}
        </div>
      )
    case 'text/letter-pull-up':
      return (
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:3 }}>
          {text.split('').map((l,i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:i*0.05,duration:0.5}}>
              <span {...textProps({ display:'inline-block' })}>{l === ' ' ? '\u00a0' : l}</span>
            </motion.div>
          ))}
        </div>
      )
    case 'text/highlight-text':
      return (
        <motion.div animate={{ backgroundPosition:['200% center','0% center'] }} transition={{ duration:2, repeat:Infinity, ease:'linear' }}
          style={hasOverride ? { display:'inline-block' } : { background:'linear-gradient(90deg,transparent 0%,rgba(103,232,249,0.35) 50%,transparent 100%)', backgroundSize:'200% auto', padding:'0 10px', borderRadius:6, display:'inline-block' }}>
          <span {...textProps({ fontSize:'clamp(24px,4vw,44px)', padding:'0 10px', borderRadius:'6px' })}>{text}</span>
        </motion.div>
      )
    case 'text/scramble':
      return (
        <motion.div animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:2, repeat:Infinity }}>
          <h2 style={{ ...base, fontFamily:'monospace', ...(colOverride && !isGrad ? colOverride.style : {}) }}>
            {isGrad ? <span {...textProps()}>{text}</span> : text}
          </h2>
        </motion.div>
      )
    default:
      return null
  }
}

// Render a component-block section — applies colour overrides to the text
function renderComponentBlock(sec: PageSection) {
  const key = sec.content?.componentKey as string
  const customText = (sec.content?.componentText as string) || ''
  if (!key || !REGISTRY[key]) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>⚡ {key}</div>
  )

  // Colour wrapper — applies even if no custom text (wraps the static preview)
  const colStyle = getTextColorStyle(sec.content)

  const liveNode = customText ? renderTextComponent(key, customText, sec.content) : null

  return (
    <div style={{ padding: 'clamp(40px,6vw,80px) clamp(16px,5vw,48px)', background: '#070a12', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
      <div style={{ textAlign: 'center' }}>
        {liveNode
          ? liveNode
          // Static preview — wrap in a span with the colour override so it shows on canvas
          : colStyle
            ? <span style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, letterSpacing: '-0.04em', ...colStyle }}>{REGISTRY[key].preview}</span>
            : REGISTRY[key].preview
        }
      </div>
    </div>
  )
}



const SECTION_ICON: Partial<Record<SectionType, string>> = Object.fromEntries(SECTION_LIBRARY.map(s => [s.type, s.icon]))
type Device = 'desktop' | 'tablet' | 'mobile'
const DEVICE_W: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '375px' }


// Export button — downloads a standalone HTML file
function exportHtml(pageTitle: string, sections: PageSection[], kit: BrandKit) {
  const html = buildPageHtml(pageTitle, sections, kit)
  const blob = new Blob([html], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${pageTitle.replace(/\s+/g, '-').toLowerCase()}.html`
  a.click()
  URL.revokeObjectURL(a.href)
}


export default function WebsiteBuilderPage() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [kit, setKit] = useState<BrandKit>({ logo: null, primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9', font: 'Inter', industry: 'SaaS', tone: 'Premium' })
  const [sections, setSections] = useState<PageSection[]>(DEFAULT_SECTIONS)
  const [selected, setSelected] = useState<string | null>(null)
  const [history, setHistory] = useState<PageSection[][]>([DEFAULT_SECTIONS])
  const [histIdx, setHistIdx] = useState(0)
  const [device, setDevice] = useState<Device>('desktop')
  const [activePanel, setActivePanel] = useState<'brand' | 'section' | 'page'>('section')
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [componentsOpen, setComponentsOpen] = useState(false)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)
  const [panelFlash, setPanelFlash] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [published, setPublished] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishMsg, setPublishMsg] = useState<string | null>(null)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { user, signedIn } = useAuth()
  const needsAuth = storage instanceof SupabaseStorageProvider
  const [pageTitle, setPageTitle] = useState('My Website')
  const [pageMeta, setPageMeta] = useState('')
  const [nyraOpen, setNyraOpen] = useState(false)
  const [aiLayoutOpen, setAiLayoutOpen] = useState(false)
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false)

  // Publish service — swaps between local download and hosted publish via env.
  const publishService = useMemo(
    () => createPublishService((p: Project) => buildPageHtml(p.name, p.sections, p.kit)),
    [],
  )

  async function handlePublish(slug: string) {
    setPublishModalOpen(false)
    const project: Project = {
      id: `tmp-${Date.now()}`,
      name: pageTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      kit,
      sections,
      activityLog: [],
    }
    setPublishing(true)
    setPublishMsg('Deploying to Vercel...')
    try {
      const html = buildPageHtml(pageTitle, sections, kit)
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, html, projectName: pageTitle }),
      })
      const data = await res.json()
      if (data.ok && data.url) {
        setPublishedUrl(data.url)
        setPublished(true)
        setPublishMsg(null)
      } else {
        setPublishMsg(data.error || 'Deployment failed.')
        setTimeout(() => setPublishMsg(null), 6000)
      }
    } catch (err: any) {
      setPublishMsg(`Error: ${err.message}`)
      setTimeout(() => setPublishMsg(null), 6000)
    } finally {
      setPublishing(false)
    }
  }
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const projectRef = useRef<Project | null>(null)

  // Load from session on mount
  useEffect(() => {
    const raw = sessionStorage.getItem('wb_project') || sessionStorage.getItem('bs_preview_project') || sessionStorage.getItem('bs_active_project')
    if (raw) {
      const p: Project = JSON.parse(raw)
      projectRef.current = p
      setKit(p.kit)
      setSections(p.sections?.length ? p.sections : DEFAULT_SECTIONS)
      setHistory([p.sections?.length ? p.sections : DEFAULT_SECTIONS])
      setPageTitle(p.name)
      setReady(true)
    }
  }, [])

  // Keyboard undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [histIdx, history])

  const pushHistory = (next: PageSection[]) => {
    const trimmed = history.slice(0, histIdx + 1)
    setHistory([...trimmed, next])
    setHistIdx(trimmed.length)
    setSections(next)
  }
  const undo = () => { if (histIdx > 0) { setHistIdx(i => i - 1); setSections(history[histIdx - 1]) } }
  const redo = () => { if (histIdx < history.length - 1) { setHistIdx(i => i + 1); setSections(history[histIdx + 1]) } }

  const enabledSections = sections.filter(s => s.enabled)
  const selectedSec = sections.find(s => s.id === selected) || null

  const handleEdit = (sectionId: string, updates: Record<string, string>) => {
    pushHistory(sections.map(s => s.id === sectionId ? { ...s, content: { ...s.content, ...updates } } : s))
  }

  const handleContentChange = (key: string, val: string) => {
    if (!selected) return
    handleEdit(selected, { [key]: val })
  }

  // Used by SettingsPanel for atomic multi-key updates (e.g. mode + colour together)
  const handleContentBatch = (updates: Record<string, string>) => {
    if (!selected) return
    handleEdit(selected, updates)
  }

  const handleAddSection = (type: SectionType) => {
    const id = `${type}-${Date.now()}`
    pushHistory([...sections, { id, type, enabled: true, content: {} }])
    setSelected(id)
    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }

  const handleAddComponent = (registryKey: string, name: string) => {
    const id = `component-${Date.now()}`
    pushHistory([...sections, { id, type: 'cta' as SectionType, enabled: true, content: { componentKey: registryKey, componentName: name } }])
    setSelected(id)
    setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }

  const handleDelete = (id: string) => {
    pushHistory(sections.filter(s => s.id !== id))
    if (selected === id) setSelected(null)
  }

  const handleMove = (id: string, dir: -1 | 1) => {
    const enabled = sections.filter(s => s.enabled)
    const idx = enabled.findIndex(s => s.id === id)
    if (idx + dir < 0 || idx + dir >= enabled.length) return
    const allIds = sections.map(s => s.id)
    const fromIdx = allIds.indexOf(id)
    const toIdx = allIds.indexOf(enabled[idx + dir].id)
    const next = [...sections]
    ;[next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]]
    pushHistory(next)
  }

  const handleToggle = (id: string) => {
    pushHistory(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const handleKitChange = (k: BrandKit) => setKit(k)

  const handleSave = () => {
    const p: Project = projectRef.current
      ? { ...projectRef.current, kit, sections, updatedAt: new Date().toISOString(), name: pageTitle }
      : { id: crypto.randomUUID(), name: pageTitle, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), kit, sections, activityLog: [] }
    Storage.saveProject(p)
    projectRef.current = p
    sessionStorage.setItem('wb_project', JSON.stringify(p))
    sessionStorage.setItem('bs_preview_project', JSON.stringify(p))
    sessionStorage.setItem('bs_active_project', JSON.stringify(p))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // ── Drag handlers ─────────────────────────────────────────
  const handleDragStart = (id: string) => setDragId(id)
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOverId(id) }
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return }
    const fromIdx = sections.findIndex(s => s.id === dragId)
    const toIdx = sections.findIndex(s => s.id === targetId)
    const next = [...sections]
    next.splice(toIdx, 0, next.splice(fromIdx, 1)[0])
    pushHistory(next)
    setDragId(null); setDragOverId(null)
  }

  if (!ready) return <BrandSetupModal onComplete={(k, s) => { setKit(k); setSections(s); setHistory([s]); setReady(true) }} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'var(--font)', background: '#040608', overflow: 'hidden' }}>

      {/* ── PUBLISH SLUG MODAL ── */}
      <PublishModal
        open={publishModalOpen}
        defaultName={pageTitle}
        primaryColor={kit.primary}
        accentColor={kit.accent}
        onConfirm={handlePublish}
        onCancel={() => setPublishModalOpen(false)}
      />

      {/* ── PUBLISH SUCCESS MODAL ── */}
      {publishedUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '40px 36px', maxWidth: 480, width: '90%', textAlign: 'center', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}>
            {/* Pulse success icon */}
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>🚀</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 6 }}>Your site is live!</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>Deployed to Vercel in seconds. Share it with the world.</div>

            {/* URL display */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, wordBreak: 'break-all', fontSize: 13, color: kit.accent, fontWeight: 600 }}>
              {publishedUrl}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <a href={publishedUrl} target="_blank" rel="noreferrer"
                style={{ flex: 1, padding: '11px', borderRadius: 10, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none', textAlign: 'center' }}>
                🌐 Open Site
              </a>
              <button onClick={() => { navigator.clipboard.writeText(publishedUrl); }}
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${kit.accent}50`, background: `${kit.accent}12`, color: kit.accent, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                📋 Copy URL
              </button>
            </div>

            {/* Custom domain info */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', textAlign: 'left', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Add a custom domain</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
                1. Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" style={{ color: kit.accent }}>vercel.com/dashboard</a><br/>
                2. Open your <strong style={{ color: 'rgba(255,255,255,0.6)' }}>move-studio-{pageTitle.toLowerCase().replace(/\s+/g,'-')}</strong> project<br/>
                3. Settings → Domains → Add your domain
              </div>
            </div>

            <button onClick={() => setPublishedUrl(null)}
              style={{ width: '100%', padding: '10px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font)' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── PUBLISH STATUS TOAST (errors only) ── */}
      {publishMsg && (
        <div style={{ position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(16,185,129,0.95)', color: 'white', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 1000, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', maxWidth: 520, textAlign: 'center' }}>
          {publishMsg}
        </div>
      )}

      {/* ── AUTH MODAL ── */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onAuthed={() => setLoginOpen(false)} />

      {/* ── TOP TOOLBAR ── */}
      <div style={{ height: 52, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', background: '#080b14', flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }}>← Dashboard</button>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: 16 }}>🌐</span>
        {/* Editable page name */}
        <input value={pageTitle} onChange={e => setPageTitle(e.target.value)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, outline: 'none', width: 180, fontFamily: 'var(--font)' }} />
        <div style={{ flex: 1 }} />
        {/* Section count badge */}
        <div style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          {sections.filter(s => s.enabled).length} sections
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => setTemplateGalleryOpen(true)}
          style={{ padding: '7px 13px', borderRadius: 8, border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.1)', color: '#a78bfa', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          ✦ Templates
        </motion.button>
        {/* Nyra AI button */}
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => setNyraOpen(o => !o)}
          style={{ padding: '7px 13px', borderRadius: 8, border: `1px solid ${nyraOpen ? '#67e8f9' : 'rgba(103,232,249,0.3)'}`, background: nyraOpen ? 'rgba(103,232,249,0.15)' : 'rgba(103,232,249,0.06)', color: '#67e8f9', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: nyraOpen ? '0 0 16px rgba(103,232,249,0.2)' : 'none' }}>
          ✨ Nyra
        </motion.button>
        {/* Undo / Redo */}
        <button onClick={undo} disabled={histIdx <= 0} title="Undo (⌘Z)"
          style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: histIdx <= 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: histIdx <= 0 ? 'not-allowed' : 'pointer', fontSize: 14 }}>↩</button>
        <button onClick={redo} disabled={histIdx >= history.length - 1} title="Redo (⌘⇧Z)"
          style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: histIdx >= history.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: histIdx >= history.length - 1 ? 'not-allowed' : 'pointer', fontSize: 14 }}>↪</button>
        {/* Device toggle */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3 }}>
          {(['desktop','tablet','mobile'] as Device[]).map((d, i) => (
            <button key={d} onClick={() => setDevice(d)} title={d}
              style={{ padding: '4px 9px', borderRadius: 6, border: 'none', background: device === d ? 'rgba(255,255,255,0.12)' : 'transparent', color: device === d ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13 }}>
              {['🖥','⬜','📱'][i]}
            </button>
          ))}
        </div>
        {/* Preview mode toggle */}
        <button onClick={() => setPreviewMode(p => !p)} title={previewMode ? 'Exit preview' : 'Preview page'}
          style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${previewMode ? kit.accent : 'rgba(255,255,255,0.1)'}`, background: previewMode ? `${kit.accent}22` : 'transparent', color: previewMode ? kit.accent : 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
          {previewMode ? '✕ Exit Preview' : '👁 Preview'}
        </button>
        <button onClick={() => exportHtml(pageTitle, sections, kit)} title="Export HTML"
          style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>📤 Export</button>
        <button onClick={() => setPublishModalOpen(true)} disabled={publishing} title="Publish site"
          style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${kit.accent}40`, background: publishing ? `${kit.accent}08` : published ? '#10b981' : `${kit.accent}12`, color: publishing ? 'rgba(255,255,255,0.4)' : published ? 'white' : kit.accent, fontWeight: 700, fontSize: 12, cursor: publishing ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
          {publishing ? '⏳ Deploying…' : published ? '✓ Published' : '🌐 Publish'}
        </button>
        {needsAuth && (
          signedIn ? (
            <button onClick={() => storage.clearUser()} title={`Signed in as ${user?.email}`}
              style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 12, cursor: 'pointer', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              👤 {user?.email?.split('@')[0]}
            </button>
          ) : (
            <button onClick={() => setLoginOpen(true)} title="Sign in to save projects to the cloud"
              style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${kit.primary}60`, background: `${kit.primary}18`, color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              Sign in
            </button>
          )
        )}
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => setComponentsOpen(true)}
          style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${kit.accent}40`, background: `${kit.accent}12`, color: kit.accent, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
          ⚡ Components
        </motion.button>
        <button onClick={handleSave}
          style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: saved ? '#10b981' : 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'background 0.3s' }}>
          {saved ? '✓ Saved' : '💾 Save'}
        </button>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => { handleSave(); navigate('/preview') }}
          style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: `0 4px 14px ${kit.primary}40` }}>
          🚀 Preview
        </motion.button>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ width: previewMode ? 0 : 220, flexShrink: 0, borderRight: previewMode ? 'none' : '1px solid rgba(255,255,255,0.07)', background: '#080b14', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.3s ease' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Page Layers</div>
            <div style={{ display: 'flex', gap: 5 }}>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                onClick={() => setAiLayoutOpen(true)}
                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(103,232,249,0.3)', background: 'rgba(103,232,249,0.08)', color: '#67e8f9', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                ✨ AI
              </motion.button>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                onClick={() => setLibraryOpen(true)}
                style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${kit.primary}50`, background: kit.primary + '18', color: kit.primary, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                + Add
              </motion.button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {sections.map(sec => (
              <div key={sec.id}
                draggable
                onDragStart={() => handleDragStart(sec.id)}
                onDragOver={e => handleDragOver(e, sec.id)}
                onDrop={() => handleDrop(sec.id)}
                onDragEnd={() => { setDragId(null); setDragOverId(null) }}
                onClick={() => { setSelected(sec.id); setActivePanel('section') }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', background: selected === sec.id ? `${kit.primary}15` : dragOverId === sec.id ? 'rgba(255,255,255,0.05)' : 'transparent', borderLeft: `3px solid ${selected === sec.id ? kit.primary : 'transparent'}`, opacity: sec.enabled ? 1 : 0.4, transition: 'all 0.15s', borderBottom: dragOverId === sec.id ? `2px solid ${kit.primary}` : '2px solid transparent' }}>
                {/* Drag handle */}
                <span style={{ cursor: 'grab', color: 'rgba(255,255,255,0.2)', fontSize: 14, flexShrink: 0 }}>⠿</span>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{SECTION_ICON[sec.type] || '▪'}</span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: selected === sec.id ? 700 : 400, color: selected === sec.id ? 'white' : 'rgba(255,255,255,0.6)', textTransform: 'capitalize', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(sec.content as any)?.componentName || sec.type}
                </span>
                <button onClick={e => { e.stopPropagation(); handleToggle(sec.id) }}
                  title={sec.enabled ? 'Hide section' : 'Show section'}
                  style={{ background: 'none', border: 'none', color: sec.enabled ? kit.accent : 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 13, padding: 0, flexShrink: 0, lineHeight: 1 }}>
                  {sec.enabled ? '◉' : '◎'}
                </button>
                <button onClick={e => { e.stopPropagation(); handleDelete(sec.id) }}
                  style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.5)', cursor: 'pointer', fontSize: 12, padding: 0, flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── CANVAS ── */}
        <div data-canvas style={{ flex: 1, overflowY: 'auto', background: device === 'desktop' ? '#040608' : '#02040a', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: device === 'desktop' ? 0 : '24px' }}
          onClick={() => { if (!previewMode) setSelected(null) }}>
          <div style={{ width: DEVICE_W[device], flexShrink: 0, background: '#060911', borderRadius: device === 'desktop' ? 0 : 14, overflow: 'hidden', boxShadow: device === 'desktop' ? 'none' : '0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.6)', transition: 'width 0.3s ease' }}>
            {enabledSections.length === 0 ? (
              <div style={{ height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ fontSize: 48 }}>🌐</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>Your page is empty</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Add sections from the left panel to build your page</div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={e => { e.stopPropagation(); setLibraryOpen(true) }}
                  style={{ padding: '11px 24px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  + Add Your First Section
                </motion.button>
              </div>
            ) : enabledSections.map(sec => {
              // Compute background override
              const bgType = sec.content.sectionBgType
              const bgStyle: React.CSSProperties = bgType === 'solid'
                ? { background: sec.content.sectionBgColor || '#060911' }
                : bgType === 'gradient'
                  ? { background: `linear-gradient(${sec.content.sectionBgGradientAngle || '135'}deg,${sec.content.sectionBgGradientFrom || '#060911'},${sec.content.sectionBgGradientTo || '#111827'})` }
                  : bgType === 'image' && sec.content.sectionBgImage
                    ? { backgroundImage: `url(${sec.content.sectionBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : {}
              const fontOverride: React.CSSProperties = sec.content.sectionFont
                ? { fontFamily: `'${sec.content.sectionFont}', sans-serif` }
                : {}
              return (
              <div key={sec.id} id={`sec-${sec.id}`}
                onClick={e => { if (!previewMode) { e.stopPropagation(); setSelected(sec.id); setActivePanel('section') } }}
                style={{ position: 'relative', outline: !previewMode && selected === sec.id ? `2px solid ${kit.primary}` : '2px solid transparent', outlineOffset: -2, cursor: previewMode ? 'default' : 'pointer', transition: 'outline 0.15s', ...bgStyle, ...fontOverride }}>

                {/* Floating toolbar — hidden in preview mode */}
                <AnimatePresence>
                  {!previewMode && selected === sec.id && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      onClick={e => e.stopPropagation()}
                      style={{ position: 'absolute', top: 10, right: 10, zIndex: 20, display: 'flex', gap: 4, background: '#111827', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', padding: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                      <button onClick={() => handleMove(sec.id, -1)} title="Move up" style={{ padding: '5px 9px', borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.07)', color: 'white', cursor: 'pointer', fontSize: 13 }}>↑</button>
                      <button onClick={() => handleMove(sec.id, 1)} title="Move down" style={{ padding: '5px 9px', borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.07)', color: 'white', cursor: 'pointer', fontSize: 13 }}>↓</button>
                      <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '4px 2px' }} />
                      <button onClick={() => { const copy = { ...sec, id: `${sec.type}-${Date.now()}` }; pushHistory([...sections, copy]) }} title="Duplicate" style={{ padding: '5px 9px', borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12 }}>⎘</button>
                      <button onClick={() => { setActivePanel('section'); setEditDrawerOpen(true); setPanelFlash(true); setTimeout(() => setPanelFlash(false), 800) }} title="Edit section content" style={{ padding: '5px 9px', borderRadius: 5, border: 'none', background: `${kit.accent}22`, color: kit.accent, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(sec.id)} title="Delete" style={{ padding: '5px 9px', borderRadius: 5, border: 'none', background: 'rgba(239,68,68,0.12)', color: '#f87171', cursor: 'pointer', fontSize: 12 }}>🗑</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section label — hidden in preview mode */}
                {!previewMode && selected === sec.id && (
                  <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 20, padding: '4px 12px', borderRadius: 6, background: (sec.content as any)?.componentKey ? kit.accent : kit.primary, color: 'white', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {(sec.content as any)?.componentKey
                      ? `⚡ ${(sec.content as any).componentName || 'Component'}`
                      : SECTION_ICON[sec.type]}
                    <span>
                      {(sec.content as any)?.componentKey
                        ? 'Type text in the right panel →'
                        : ['gallery','services','process','blog','map','booking','comparison','pricing','faq','team','testimonials','stats','logobar','newsletter','contact','video','timeline','navbar','footer'].includes(sec.type)
                          ? 'Click ✏️ Edit to customise content'
                          : 'Click any text on canvas to edit'}
                    </span>
                  </div>
                )}

                {(sec.content as any)?.componentKey
                  ? renderComponentBlock(sec)
                  : renderSection(sec, kit, !previewMode && selected === sec.id ? (key, val) => handleEdit(sec.id, { [key]: val }) : undefined)
                }
              </div>
              )
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ position: 'relative', display: previewMode ? 'none' : undefined }}>
          {/* Flash ring on pencil click */}
          {panelFlash && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, border: `2px solid ${kit.accent}`, borderRadius: 0, pointerEvents: 'none', animation: 'panel-flash 0.7s ease forwards' }} />
          )}
        <SettingsPanel
          kit={kit}
          sectionType={selectedSec?.type || null}
          componentKey={(selectedSec?.content as any)?.componentKey || null}
          componentName={(selectedSec?.content as any)?.componentName || null}
          componentText={(selectedSec?.content as any)?.componentText || ''}
          componentTextColorMode={selectedSec?.content?.componentTextColorMode}
          componentTextColor={selectedSec?.content?.componentTextColor}
          componentTextGradientFrom={selectedSec?.content?.componentTextGradientFrom}
          componentTextGradientTo={selectedSec?.content?.componentTextGradientTo}
          componentTextGradientAngle={selectedSec?.content?.componentTextGradientAngle}
          headingColorMode={selectedSec?.content?.headingColorMode}
          headingColor={selectedSec?.content?.headingColor}
          headingGradientFrom={selectedSec?.content?.headingGradientFrom}
          headingGradientTo={selectedSec?.content?.headingGradientTo}
          headingGradientAngle={selectedSec?.content?.headingGradientAngle}
          sectionBgType={selectedSec?.content?.sectionBgType}
          sectionBgColor={selectedSec?.content?.sectionBgColor}
          sectionBgGradientFrom={selectedSec?.content?.sectionBgGradientFrom}
          sectionBgGradientTo={selectedSec?.content?.sectionBgGradientTo}
          sectionBgGradientAngle={selectedSec?.content?.sectionBgGradientAngle}
          sectionBgImage={selectedSec?.content?.sectionBgImage}
          sectionFont={selectedSec?.content?.sectionFont}
          content={selectedSec?.content || {}}
          selectedSection={selectedSec}
          activePanel={activePanel}
          pageTitle={pageTitle}
          pageMeta={pageMeta}
          onKitChange={handleKitChange}
          onContentChange={handleContentChange}
          onContentBatch={handleContentBatch}
          onSectionContentUpdate={update => { if (selected) handleEdit(selected, update as any) }}
          onPageChange={(t, m) => { setPageTitle(t); setPageMeta(m) }}
          onPanelChange={setActivePanel}
        />
        </div>
      </div>

      {/* Section Library Drawer */}
      <SectionLibraryDrawer open={libraryOpen} onClose={() => setLibraryOpen(false)} onAdd={handleAddSection} primaryColor={kit.primary} />

      {/* Component Blocks Drawer */}
      <ComponentBlocksDrawer open={componentsOpen} onClose={() => setComponentsOpen(false)}
        onAddComponent={(key, name) => handleAddComponent(key, name)}
        primaryColor={kit.accent} />

      {/* AI Layout Modal */}
      <AiLayoutModal open={aiLayoutOpen} onClose={() => setAiLayoutOpen(false)} kit={kit}
        onApply={(recs: SectionRecommendation[]) => {
          // Reorder + enable sections based on AI recommendations
          const recTypes = recs.map(r => r.type)
          const reordered: PageSection[] = []
          // Add recommended sections in AI order (enable them)
          recTypes.forEach(type => {
            const existing = sections.find(s => s.type === type)
            if (existing) reordered.push({ ...existing, enabled: true })
            else {
              // Add from DEFAULT_SECTIONS if not present
              const def = DEFAULT_SECTIONS.find(s => s.type === type)
              if (def) reordered.push({ ...def, enabled: true })
            }
          })
          // Append remaining sections (disabled)
          sections.forEach(s => {
            if (!recTypes.includes(s.type)) reordered.push({ ...s, enabled: false })
          })
          pushHistory(reordered)
        }} />

      {/* Template Gallery Drawer */}
      <TemplateGalleryDrawer
        open={templateGalleryOpen}
        kit={kit}
        onClose={() => setTemplateGalleryOpen(false)}
        onApply={(newSections) => {
          pushHistory(newSections)
          setSelected(null)
          setTimeout(() => {
            const canvas = document.querySelector('[data-canvas]') as HTMLElement
            if (canvas) canvas.scrollTop = 0
          }, 50)
        }}
      />

      {/* Nyra AI Sidebar */}
      <NyraSidebar
        open={nyraOpen}
        onClose={() => setNyraOpen(false)}
        sections={sections}
        kit={kit}
        onUpdateSection={(sectionId, content) => handleEdit(sectionId, content as any)}
        onEnableSection={(sectionId, enabled) => pushHistory(sections.map(s => s.id === sectionId ? { ...s, enabled } : s))}
        onReorderSections={(order) => {
          const reordered = order.map(id => sections.find(s => s.id === id)).filter(Boolean) as PageSection[]
          const remaining = sections.filter(s => !order.includes(s.id))
          pushHistory([...reordered, ...remaining])
        }}
      />
    </div>
  )
}
