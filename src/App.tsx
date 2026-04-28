import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Search, Github } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import ComponentPage from './pages/ComponentPage'
import BrandStudioPage from './pages/BrandStudioPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import PreviewPage from './pages/PreviewPage'
import PricingPage from './pages/PricingPage'
import MarketingPage from './pages/MarketingPage'
import AdStudioPage from './pages/AdStudioPage'
import AgentSkillsPage from './pages/AgentSkillsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import TemplateGalleryPage from './pages/TemplateGalleryPage'
import TeamPage from './pages/TeamPage'
import EmailStudioPage from './pages/EmailStudioPage'
import WebsiteBuilderPage from './pages/WebsiteBuilderPage'
import BrandAssetsPage from './pages/BrandAssetsPage'
import QuoteInvoicePage from './pages/QuoteInvoicePage'
import BillingPage from './pages/BillingPage'
import AcceptQuotePage from './pages/AcceptQuotePage'
import NotificationBell from './components/NotificationBell'
import CRMPage from './pages/CRMPage'
import InventoryPage from './pages/InventoryPage'
import AccountingPage from './pages/AccountingPage'
import ProjectsPage from './pages/ProjectsPage'
import HRPage from './pages/HRPage'
import AdminPage from './pages/AdminPage'
import WhiteLabelPage from './pages/WhiteLabelPage'
import IntegrationsPage, { OAuthCallback } from './pages/IntegrationsPage'

const NAV = [
  {
    label: '🚀 Move Studio',
    isSaas: true,
    items: [
      { name: '🏠 Home',             path: '/home',          desc: 'Marketing & landing page' },
      { name: '🌐 Website Builder',   path: '/website-builder', desc: 'No-code drag & drop builder' },
      { name: '✦ Move Studio',        path: '/move-studio',     desc: 'Studio landing & brand assets' },
      { name: '👥 CRM',               path: '/crm',             desc: 'Contacts, pipeline & activities' },
      { name: '📦 Inventory',          path: '/inventory',       desc: 'Stock, products & suppliers' },
      { name: '📊 Accounting',         path: '/accounting',      desc: 'P&L, transactions & VAT' },
      { name: '📋 Projects',            path: '/projects',        desc: 'Tasks, board & timelines' },
      { name: '🧑‍💼 HR & Payroll',        path: '/hr',              desc: 'People, payroll & leave' },
      { name: '🧾 Quotes & Invoices',  path: '/quotes-invoices', desc: 'Professional branded documents' },
      { name: '💼 Billing Suite',       path: '/billing',         desc: 'Customers, invoices, quotes & reports' },
      { name: '❖ Brand Kit Studio',  path: '/brand-studio',    desc: 'Colours, fonts, logos' },
      { name: '📣 Social Ad Studio', path: '/ad-studio',      desc: 'Generate & export ads' },
      { name: '⬡ Dashboard',         path: '/dashboard',      desc: 'Projects & saved work' },
      { name: '🤖 Agent Skills',      path: '/agent-skills',   desc: 'AI agent integrations' },
      { name: '📈 Analytics',         path: '/analytics',      desc: 'Performance & insights' },
      { name: '🗂 Templates',          path: '/templates',      desc: 'Ad packs & page templates' },
      { name: '✉️ Email Studio',       path: '/email-studio',   desc: 'Drag-drop email builder' },
      { name: '👥 Team',               path: '/team',           desc: 'Invite & manage members' },
      { name: '💳 Pricing',           path: '/pricing',        desc: 'Plans & billing' },
      { name: '🔌 Integrations',       path: '/integrations',   desc: 'Xero, Sage & more' },
      { name: '📦 Component Library', path: '/',               desc: 'UI components & animations' },
    ],
  },
  {
    label: 'Text Animations',
    items: [
      { name: 'Blur Text',       path: '/text/blur-text' },
      { name: 'Split Text',      path: '/text/split-text' },
      { name: 'Gradient Text',   path: '/text/gradient-text' },
      { name: 'Typewriter',      path: '/text/typewriter' },
      { name: 'Count Up',        path: '/text/count-up' },
      { name: 'Scramble Text',   path: '/text/scramble' },
      { name: 'Word Reveal',     path: '/text/word-reveal' },
      { name: 'Shiny Text',      path: '/text/shiny-text' },
      { name: 'Letter Pull Up',  path: '/text/letter-pull-up' },
      { name: 'Circular Text',   path: '/text/circular-text' },
      { name: 'Highlight Text',  path: '/text/highlight-text' },
    ],
  },
  {
    label: 'Backgrounds',
    items: [
      { name: 'Aurora',          path: '/backgrounds/aurora' },
      { name: 'Particles',       path: '/backgrounds/particles' },
      { name: 'Grid Pattern',    path: '/backgrounds/grid' },
      { name: 'Galaxy',          path: '/backgrounds/galaxy' },
      { name: 'Dot Matrix',      path: '/backgrounds/dots' },
      { name: 'Mesh Gradient',   path: '/backgrounds/mesh' },
      { name: 'Animated Beams',  path: '/backgrounds/beams' },
      { name: 'Noise Texture',   path: '/backgrounds/noise' },
      { name: 'Wave Lines',      path: '/backgrounds/waves' },
      { name: 'Shooting Stars',  path: '/backgrounds/shooting-stars' },
    ],
  },
  {
    label: 'Animations',
    items: [
      { name: 'Fade Blur Up',    path: '/animations/fade-blur-up' },
      { name: 'Magnetic',        path: '/animations/magnetic' },
      { name: 'Reveal On Scroll',path: '/animations/scroll-reveal' },
      { name: 'Stagger Children',path: '/animations/stagger' },
      { name: 'Float',           path: '/animations/float' },
      { name: 'Ripple',          path: '/animations/ripple' },
      { name: 'Elastic Scale',   path: '/animations/elastic' },
      { name: 'Slide In',        path: '/animations/slide-in' },
      { name: 'Rotate In',       path: '/animations/rotate-in' },
      { name: 'Zoom In',         path: '/animations/zoom-in' },
      { name: 'Shake',           path: '/animations/shake' },
      { name: 'Confetti Burst',  path: '/animations/confetti' },
    ],
  },
  {
    label: 'Buttons',
    items: [
      { name: 'Shimmer Button',  path: '/buttons/shimmer' },
      { name: 'Gradient Button', path: '/buttons/gradient' },
      { name: 'Neon Button',     path: '/buttons/neon' },
      { name: 'Outline Button',  path: '/buttons/outline' },
      { name: 'Icon Button',     path: '/buttons/icon' },
      { name: 'Loading Button',  path: '/buttons/loading' },
      { name: 'Glitch Button',   path: '/buttons/glitch' },
    ],
  },
  {
    label: 'Cards',
    items: [
      { name: 'Glass Card',      path: '/cards/glass' },
      { name: 'Glow Card',       path: '/cards/glow' },
      { name: 'Tilt Card',       path: '/cards/tilt' },
      { name: 'Flip Card',       path: '/cards/flip' },
      { name: 'Expand Card',     path: '/cards/expand' },
      { name: 'Gradient Border', path: '/cards/gradient-border' },
      { name: 'Spotlight Card',  path: '/cards/spotlight' },
      { name: 'Stat Card',       path: '/cards/stat' },
      { name: 'Feature Card',    path: '/cards/feature' },
    ],
  },
  {
    label: 'UI Components',
    items: [
      { name: 'Premium Badge',   path: '/ui/badge' },
      { name: 'Toast',           path: '/ui/toast' },
      { name: 'Tooltip',         path: '/ui/tooltip' },
      { name: 'Modal',           path: '/ui/modal' },
      { name: 'Tabs',            path: '/ui/tabs' },
      { name: 'Accordion',       path: '/ui/accordion' },
      { name: 'Toggle',          path: '/ui/toggle' },
      { name: 'Progress Bar',    path: '/ui/progress' },
      { name: 'Skeleton',        path: '/ui/skeleton' },
      { name: 'Marquee',         path: '/ui/marquee' },
      { name: 'Dock',            path: '/ui/dock' },
      { name: 'Command Menu',    path: '/ui/command-menu' },
      { name: 'Avatar Stack',    path: '/ui/avatar-stack' },
      { name: 'Timeline',        path: '/ui/timeline' },
      { name: 'Infinite Scroll', path: '/ui/infinite-scroll' },
    ],
  },
  {
    label: 'Layout',
    items: [
      { name: 'Bento Grid',      path: '/layout/bento' },
      { name: 'Masonry Grid',    path: '/layout/masonry' },
      { name: 'Feature Grid',    path: '/layout/feature-grid' },
      { name: 'Hero Section',    path: '/layout/hero' },
      { name: 'Split Layout',    path: '/layout/split' },
      { name: 'Card Grid',       path: '/layout/card-grid' },
      { name: 'Sidebar Layout',  path: '/layout/sidebar' },
    ],
  },
  {
    label: 'Forms',
    items: [
      { name: 'Input',           path: '/forms/input' },
      { name: 'Textarea',        path: '/forms/textarea' },
      { name: 'Select',          path: '/forms/select' },
      { name: 'Checkbox',        path: '/forms/checkbox' },
      { name: 'Radio Group',     path: '/forms/radio' },
      { name: 'Slider',          path: '/forms/slider' },
      { name: 'OTP Input',       path: '/forms/otp-input' },
      { name: 'Switch',          path: '/forms/switch' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { name: 'Dropdown Menu',   path: '/navigation/dropdown' },
      { name: 'Context Menu',    path: '/navigation/context-menu' },
      { name: 'Nav Menu',        path: '/navigation/nav-menu' },
      { name: 'Breadcrumb',      path: '/navigation/breadcrumb' },
      { name: 'Pagination',      path: '/navigation/pagination' },
    ],
  },
  {
    label: 'Overlays',
    items: [
      { name: 'Alert Dialog',    path: '/overlays/alert-dialog' },
      { name: 'Drawer',          path: '/overlays/drawer' },
      { name: 'Popover',         path: '/overlays/popover' },
      { name: 'Hover Card',      path: '/overlays/hover-card' },
      { name: 'Alert',           path: '/overlays/alert' },
    ],
  },
]


function Sidebar({ search, setSearch }: { search: string; setSearch: (v: string) => void }) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const toggle = (label: string) =>
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })

  const filtered = NAV.map(section => ({
    ...section,
    items: section.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())),
  })).filter(s => s.items.length > 0)

  // When searching, auto-expand all matching sections
  const isSearching = search.trim().length > 0

  return (
    <aside className="sidebar">
      {filtered.map((section, si) => {
        const isSaas = (section as any).isSaas
        const isFirstLib = si > 0 && !isSaas && (filtered[si - 1] as any).isSaas
        const isOpen = isSaas || isSearching || openSections.has(section.label)

        return (
          <div className="sidebar-section" key={section.label}>

            {/* Divider between Move Studio and component library */}
            {isFirstLib && (
              <div style={{ margin: '6px 12px 12px', height: 1, background: 'linear-gradient(to right, rgba(255,255,255,0.1), transparent)' }} />
            )}

            {/* Section label — clickable for library sections */}
            <div
              className="sidebar-label"
              onClick={isSaas ? undefined : () => toggle(section.label)}
              style={{
                cursor: isSaas ? 'default' : 'pointer',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                ...(isSaas ? {
                  background: 'var(--gradient-sig-text)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                } : {}),
              }}
            >
              <span style={{ flex: 1 }}>{section.label}</span>
              {!isSaas && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: 4, color: 'var(--text-muted)' }}>
                    {section.items.length}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'inline-block', fontSize: 9, color: 'rgba(255,255,255,0.25)', lineHeight: 1 }}
                  >
                    ▶
                  </motion.span>
                </span>
              )}
            </div>

            {/* Items — always visible for SaaS, collapsible for library */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key={section.label + '-items'}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  {section.items.map(item => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                      style={isSaas ? { display: 'flex', flexDirection: 'column', gap: 1, padding: '9px 14px', borderRadius: 8, margin: '2px 8px' } : {}}
                    >
                      <span style={isSaas ? { fontWeight: 600, fontSize: 13 } : {}}>{item.name}</span>
                      {isSaas && (item as any).desc && (
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontWeight: 400 }}>{(item as any).desc}</span>
                      )}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </aside>
  )
}

function Header({ search, setSearch, onMenuToggle }: { search: string; setSearch: (v: string) => void; onMenuToggle: () => void }) {
  const total = NAV.reduce((acc, s) => acc + s.items.length, 0)
  return (
    <header className="header">
      {/* Mobile hamburger */}
      <button onClick={onMenuToggle}
        style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', padding: '4px 6px' }}
        className="mobile-menu-btn">
        ☰
      </button>
      <div className="header-logo">
        <motion.div
          className="header-logo-mark"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'none', width: 32, height: 32, padding: 0, overflow: 'visible', filter: 'drop-shadow(0 0 8px rgba(103,232,249,0.6))' }}
        >
          <img src="/logo-3d.png" alt="Move Digital" style={{ width: 32, height: 32, objectFit: 'contain', display: 'block' }} />
        </motion.div>
        <span style={{ background: 'var(--gradient-sig-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700 }}>Move AI Studio</span>
      </div>
      <div className="header-search">
        <Search size={13} color="var(--text-muted)" />
        <input
          placeholder="Search components..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: 4, border: '1px solid var(--border)', whiteSpace: 'nowrap' }}>⌘K</span>
      </div>
      <div className="header-badge">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block', marginRight: 6 }} />
        {total} Components
      </div>
      <a href="https://github.com/MalcolmGov" target="_blank" rel="noreferrer" style={{ marginLeft: 8, color: 'var(--text-muted)', display: 'flex' }}>
        <Github size={18} />
      </a>
      <NotificationBell />
    </header>
  )
}

export default function App() {
  const [search, setSearch] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen routes — no layout chrome */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/home" element={<MarketingPage />} />
        <Route path="/website-builder" element={<WebsiteBuilderPage />} />
        <Route path="/move-studio"     element={<BrandAssetsPage />} />
        <Route path="/brand-assets"    element={<BrandAssetsPage />} />
        <Route path="/crm"            element={<CRMPage />} />
        <Route path="/inventory"      element={<InventoryPage />} />
        <Route path="/accounting"     element={<AccountingPage />} />
        <Route path="/projects"       element={<ProjectsPage />} />
        <Route path="/hr"             element={<HRPage />} />
        <Route path="/admin"           element={<AdminPage />} />
        <Route path="/quotes-invoices" element={<QuoteInvoicePage />} />
        <Route path="/billing"         element={<BillingPage />} />
        <Route path="/accept-quote/:token" element={<AcceptQuotePage />} />
        <Route path="/white-label" element={<WhiteLabelPage />} />
        <Route path="/white-label/:slug" element={<WhiteLabelPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/integrations/callback/:provider" element={<OAuthCallback />} />
        {/* Standard layout routes */}
        <Route path="/*" element={
          <div className="layout">
            <Header search={search} setSearch={setSearch} onMenuToggle={() => setMobileNavOpen(o => !o)} />
            {/* Mobile nav overlay */}
            <AnimatePresence>
              {mobileNavOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setMobileNavOpen(false)}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 49, backdropFilter: 'blur(4px)' }} />
              )}
            </AnimatePresence>
            <motion.div
              className="sidebar-wrapper"
              animate={{ x: mobileNavOpen ? 0 : undefined }}
              style={{ display: 'flex' }}>
              <Sidebar search={search} setSearch={s => { setSearch(s); setMobileNavOpen(false) }} />
            </motion.div>
            <main className="main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/brand-studio" element={<BrandStudioPage />} />
                <Route path="/ad-studio" element={<AdStudioPage />} />
                <Route path="/agent-skills" element={<AgentSkillsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/templates" element={<TemplateGalleryPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/email-studio" element={<EmailStudioPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/:category/:component" element={<ComponentPage />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
