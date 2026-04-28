import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Project, BrandKit, PageSection, DEFAULT_SECTIONS, DEFAULT_CONTENT, SectionContent, Storage } from '../types'
import { buildPageHtml } from '../lib/buildHtml'
import PublishModal from '../components/builder/PublishModal'
import { NavbarSection, HeroSection, FeaturesSection, StatsSection, TestimonialsSection, PricingSection, CtaSection, FooterSection, FaqSection, TeamSection, LogoBarSection, NewsletterSection, ContactSection, VideoSection, TimelineSection, CtaBannerSection } from '../components/sections'

const SECTION_META: Record<string, { icon: string; label: string; desc: string }> = {
  navbar:       { icon: '🧭', label: 'Navbar',         desc: 'Top navigation bar with logo & links' },
  hero:         { icon: '🚀', label: 'Hero',            desc: 'First impression — headline, CTA, visual' },
  logobar:      { icon: '🏢', label: 'Logo Bar',        desc: 'Client/partner logo strip' },
  features:     { icon: '⚡', label: 'Features',        desc: '3-column feature grid with icons' },
  stats:        { icon: '📊', label: 'Stats',           desc: 'Animated metric counters' },
  video:        { icon: '▶️', label: 'Video',           desc: 'Product demo or explainer video embed' },
  timeline:     { icon: '📅', label: 'Timeline',        desc: 'Company journey / milestone steps' },
  testimonials: { icon: '💬', label: 'Testimonials',    desc: 'Social proof quote cards' },
  team:         { icon: '👥', label: 'Team',            desc: 'Team member photo cards' },
  faq:          { icon: '❓', label: 'FAQ',             desc: 'Expandable question & answer pairs' },
  newsletter:   { icon: '📬', label: 'Newsletter',      desc: 'Email capture with CTA' },
  contact:      { icon: '✉️', label: 'Contact',         desc: 'Contact form with map / details' },
  pricing:      { icon: '💳', label: 'Pricing',         desc: '3-tier pricing table' },
  ctabanner:    { icon: '📢', label: 'CTA Banner',      desc: 'Full-width inline conversion strip' },
  cta:          { icon: '🎯', label: 'Call to Action',  desc: 'Full-width conversion section' },
  footer:       { icon: '🔗', label: 'Footer',          desc: 'Links, logo, copyright' },
  process:      { icon: '🔄', label: 'Process',         desc: 'Step-by-step how it works' },
  services:     { icon: '🛠', label: 'Services',        desc: 'Services / offerings grid' },
  gallery:      { icon: '🖼', label: 'Gallery',         desc: 'Image gallery grid' },
  blog:         { icon: '📝', label: 'Blog',            desc: 'Latest articles / posts' },
  comparison:   { icon: '⚖️', label: 'Comparison',      desc: 'Feature comparison table' },
  booking:      { icon: '📅', label: 'Booking',         desc: 'Appointment booking widget' },
}

function renderSection(section: PageSection, kit: BrandKit, onEdit?: (sectionId: string, key: string, value: string) => void) {
  const merged = { ...DEFAULT_CONTENT, ...section.content }
  const edit = onEdit ? (k: string, v: string) => onEdit(section.id, k, v) : undefined
  const props = { kit, content: merged, editable: !!onEdit, onEdit: edit }
  switch (section.type) {
    case 'navbar':       return <NavbarSection {...props} />
    case 'hero':         return <HeroSection {...props} />
    case 'logobar':      return <LogoBarSection {...props} />
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
    case 'footer':       return <FooterSection {...props} />
    default:             return null
  }
}

export default function PreviewPage() {
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [sections, setSections] = useState<PageSection[]>(DEFAULT_SECTIONS)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [composerOpen, setComposerOpen] = useState(true)
  const [exportOpen, setExportOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [deployError, setDeployError] = useState<string | null>(null)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // ── Device preview ──────────────────────────────────────
  type Device = 'desktop' | 'tablet' | 'mobile'
  const [device, setDevice] = useState<Device>('desktop')
  const DEVICE_WIDTHS: Record<Device, string> = {
    desktop: '100%',
    tablet:  '768px',
    mobile:  '375px',
  }

  // ── Undo / Redo history stack ────────────────────────────
  const [history, setHistory] = useState<PageSection[][]>([DEFAULT_SECTIONS])
  const [historyIndex, setHistoryIndex] = useState(0)

  const pushHistory = (next: PageSection[]) => {
    setHistory(h => [...h.slice(0, historyIndex + 1), next])
    setHistoryIndex(i => i + 1)
    setSections(next)
  }

  const undo = () => {
    if (historyIndex <= 0) return
    const idx = historyIndex - 1
    setHistoryIndex(idx)
    setSections(history[idx])
  }

  const redo = () => {
    if (historyIndex >= history.length - 1) return
    const idx = historyIndex + 1
    setHistoryIndex(idx)
    setSections(history[idx])
  }

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [historyIndex, history])

  useEffect(() => {
    const raw = sessionStorage.getItem('bs_preview_project') || sessionStorage.getItem('bs_active_project')
    if (raw) {
      const p: Project = JSON.parse(raw)
      setProject(p)
      setSections(p.sections || DEFAULT_SECTIONS)
    }
  }, [])

  const kit: BrandKit = project?.kit || { logo: null, primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9', font: 'Inter', industry: 'SaaS', tone: 'Premium' }

  const toggleSection = (id: string) => {
    const next = sections.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec)
    pushHistory(next)
  }

  const handleEdit = (sectionId: string, key: string, value: string) => {
    const next = sections.map(sec => sec.id === sectionId ? { ...sec, content: { ...sec.content, [key]: value } } : sec)
    pushHistory(next)
  }

  const handleSave = () => {
    if (!project) return
    const updated = { ...project, sections, updatedAt: new Date().toISOString() }
    Storage.saveProject(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportHtml = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project?.name || 'My Landing Page'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=${kit.font.replace(/ /g, '+')}:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    :root {
      --primary: ${kit.primary};
      --secondary: ${kit.secondary};
      --accent: ${kit.accent};
      --font: '${kit.font}', sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font); background: #060911; color: white; }
  </style>
</head>
<body>
  <!-- Generated by Move Studio -->
  <!-- Sections: ${sections.filter(s => s.enabled).map(s => s.type).join(', ')} -->
  <script type="module" src="./main.jsx"></script>
</body>
</html>`
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${(project?.name || 'landing-page').toLowerCase().replace(/ /g, '-')}.html`
    a.click()
  }

  const handleDeploy = async (slug: string) => {
    setPublishModalOpen(false)
    setPublishing(true)
    setDeployError(null)
    try {
      const html = buildPageHtml(project?.name || 'My Site', sections, kit)
      const res = await fetch(`${window.location.origin}/api/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, html, projectName: project?.name || 'My Site' }),
      })
      const data = await res.json()
      if (data.ok && data.url) {
        setPublishedUrl(data.url)
      } else {
        setDeployError(data.error || 'Deployment failed.')
        setTimeout(() => setDeployError(null), 6000)
      }
    } catch (err: any) {
      setDeployError(err.message)
      setTimeout(() => setDeployError(null), 6000)
    } finally {
      setPublishing(false)
    }
  }

  const handleShareLink = () => {
    const encoded = btoa(JSON.stringify({ kit, sections: sections.filter(s => s.enabled).map(s => s.type) }))
    const url = `${window.location.origin}/preview?share=${encoded}`
    navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard!')
  }

  const enabledSections = sections.filter(s => s.enabled)

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font)', overflow: 'hidden', background: '#040608' }}>

      {/* ── Publish slug modal ── */}
      <PublishModal
        open={publishModalOpen}
        defaultName={project?.name || 'my-site'}
        primaryColor={kit.primary}
        accentColor={kit.accent}
        onConfirm={handleDeploy}
        onCancel={() => setPublishModalOpen(false)}
      />

      {/* ── Publishing overlay ── */}
      {publishing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Deploying to Vercel…</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>This takes about 10 seconds</div>
          </div>
        </div>
      )}

      {/* ── Success modal ── */}
      {publishedUrl && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '40px 36px', maxWidth: 480, width: '90%', textAlign: 'center', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>🚀</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 6 }}>Your site is live!</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>Deployed to Vercel in seconds.</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, wordBreak: 'break-all', fontSize: 13, color: kit.accent, fontWeight: 600 }}>
              {publishedUrl}
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <a href={publishedUrl} target="_blank" rel="noreferrer"
                style={{ flex: 1, padding: '11px', borderRadius: 10, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 13, textDecoration: 'none', textAlign: 'center' }}>
                🌐 Open Site
              </a>
              <button onClick={() => navigator.clipboard.writeText(publishedUrl)}
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${kit.accent}50`, background: `${kit.accent}12`, color: kit.accent, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                📋 Copy URL
              </button>
            </div>
            <button onClick={() => setPublishedUrl(null)}
              style={{ width: '100%', padding: '10px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13 }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Error toast ── */}
      {deployError && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: 'white', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 1001, maxWidth: 480, textAlign: 'center' }}>
          ❌ {deployError}
        </div>
      )}
      {/* ── Composer Sidebar ── */}
      <motion.div animate={{ width: composerOpen ? 300 : 0, opacity: composerOpen ? 1 : 0 }} transition={{ type: 'spring', damping: 26, stiffness: 200 }}
        style={{ flexShrink: 0, background: '#080b14', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>Page Sections</div>
          <button onClick={() => setComposerOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>

        {/* Brand strip */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
          {kit.logo && <img src={kit.logo} style={{ height: 22, objectFit: 'contain' }} alt="logo" />}
          <div style={{ display: 'flex', gap: 4 }}>
            {[kit.primary, kit.secondary, kit.accent].map((c, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: c }} />)}
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{kit.font}</span>
        </div>

        {/* Section toggles */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {sections.map(sec => {
            const meta = SECTION_META[sec.type]
            if (!meta) return null  // guard against unknown section types
            return (
              <div key={sec.id}
                onClick={() => setSelectedSection(sec.id === selectedSection ? null : sec.id)}
                style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: selectedSection === sec.id ? 'rgba(255,255,255,0.04)' : 'transparent', borderLeft: `3px solid ${selectedSection === sec.id ? kit.primary : 'transparent'}` }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{meta.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: sec.enabled ? 'white' : 'rgba(255,255,255,0.35)' }}>{meta.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{meta.desc}</div>
                </div>
                <div onClick={e => { e.stopPropagation(); toggleSection(sec.id) }}
                  style={{ width: 36, height: 20, borderRadius: 99, background: sec.enabled ? kit.primary : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
                  <motion.div animate={{ x: sec.enabled ? 18 : 2 }} style={{ position: 'absolute', top: 2, width: 16, height: 16, borderRadius: '50%', background: 'white' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom actions */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleSave}
            style={{ padding: '10px', borderRadius: 8, border: 'none', background: saved ? '#10b981' : `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)', transition: 'background 0.3s' }}>
            {saved ? '✓ Saved!' : 'Save Project'}
          </button>
          <button onClick={() => setExportOpen(true)}
            style={{ padding: '10px', borderRadius: 8, border: `1px solid ${kit.accent}40`, background: 'transparent', color: kit.accent, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            Export / Deploy ↗
          </button>
        </div>
      </motion.div>

      {/* ── Preview Area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Preview toolbar */}
        <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, background: '#080b14', flexShrink: 0 }}>
          {!composerOpen && (
            <button onClick={() => setComposerOpen(true)} style={{ padding: '6px 11px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
              ☰
            </button>
          )}
          <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>← Back</button>

          {/* Undo / Redo */}
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onClick={undo} disabled={historyIndex <= 0} title="Undo (⌘Z)"
              style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: historyIndex <= 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer', fontSize: 13 }}>↩</button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo (⌘⇧Z)"
              style={{ padding: '5px 9px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: historyIndex >= history.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: historyIndex >= history.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>↪</button>
          </div>

          {/* Device toggle */}
          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3, flexShrink: 0 }}>
            {([['desktop','🖥','Desktop'],['tablet','⬜','Tablet'],['mobile','📱','Mobile']] as const).map(([d, icon, label]) => (
              <button key={d} onClick={() => setDevice(d as Device)} title={label}
                style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: device === d ? 'rgba(255,255,255,0.12)' : 'transparent', color: device === d ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, fontWeight: device === d ? 700 : 400, transition: 'all 0.15s' }}>
                {icon}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
            {project?.name || 'Preview'} · {enabledSections.length} sections
            {device !== 'desktop' && <span style={{ marginLeft: 6, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>@ {DEVICE_WIDTHS[device]}</span>}
          </div>

          <button onClick={handleShareLink} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer', flexShrink: 0 }}>🔗 Share</button>
          <button onClick={() => setExportOpen(true)}
            style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
            Deploy ↗
          </button>
        </div>

        {/* Page preview — device frame */}
        <div ref={previewRef} style={{ flex: 1, overflowY: 'auto', background: device === 'desktop' ? '#060911' : '#02040a', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: device === 'desktop' ? 0 : '24px' }}>
          <div style={{ width: DEVICE_WIDTHS[device], flexShrink: 0, minWidth: 0, background: '#060911', borderRadius: device === 'desktop' ? 0 : 16, overflow: device === 'desktop' ? 'visible' : 'hidden', boxShadow: device === 'desktop' ? 'none' : '0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.6)', transition: 'width 0.3s ease' }}>
            {enabledSections.length === 0 ? (
              <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <div style={{ fontSize: 48 }}>🎨</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>No sections enabled</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Toggle sections in the left panel</div>
              </div>
            ) : (
              enabledSections.map(sec => (
                <div key={sec.id}
                  onClick={() => setSelectedSection(sec.id === selectedSection ? null : sec.id)}
                  style={{ outline: selectedSection === sec.id ? `2px solid ${kit.primary}` : 'none', outlineOffset: -2, position: 'relative', cursor: 'pointer' }}>
                  {selectedSection === sec.id && (
                    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, padding: '4px 10px', borderRadius: 6, background: kit.primary, color: 'white', fontSize: 11, fontWeight: 700 }}>
                      ✎ Click text to edit
                    </div>
                  )}
                  {renderSection(sec, kit, selectedSection === sec.id ? handleEdit : undefined)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Export / Deploy Modal ── */}
      {exportOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }}
            style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '36px', maxWidth: 480, width: '90%' }}>
            <div style={{ fontWeight: 800, fontSize: 22, color: 'white', marginBottom: 6 }}>Deploy Your Page</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 28 }}>Choose how to launch your brand page</div>

            {[
              { icon: '⬇', title: 'Export HTML', desc: 'Download a complete static HTML file with your brand theme and content baked in.', action: () => { handleExportHtml(); setExportOpen(false) }, color: '#3b82f6', label: 'Download' },
              { icon: '▲', title: 'Deploy to Vercel', desc: 'Push to a live *.vercel.app URL in seconds — no GitHub or git repo needed.', action: () => { setExportOpen(false); setPublishModalOpen(true) }, color: '#ffffff', label: 'Deploy Now' },
              { icon: '🔗', title: 'Copy Share Link', desc: 'Generate a shareable preview link — no deployment needed.', action: () => { handleShareLink(); setExportOpen(false) }, color: kit.accent, label: 'Copy Link' },
            ].map(opt => (
              <div key={opt.title} onClick={opt.action}
                style={{ display: 'flex', gap: 16, padding: '16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', marginBottom: 10 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${opt.color}15`, border: `1px solid ${opt.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{opt.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: 14, marginBottom: 3 }}>{opt.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{opt.desc}</div>
                </div>
                <div style={{ padding: '6px 12px', borderRadius: 7, background: `${opt.color}18`, color: opt.color, fontSize: 11, fontWeight: 700, alignSelf: 'center', whiteSpace: 'nowrap' }}>{opt.label}</div>
              </div>
            ))}

            <button onClick={() => setExportOpen(false)} style={{ width: '100%', marginTop: 8, padding: '10px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13 }}>Cancel</button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
