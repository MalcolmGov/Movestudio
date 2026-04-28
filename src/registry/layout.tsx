import { motion } from 'framer-motion'

function BentoDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 8, width: '100%', height: '100%', padding: 16 }}>
      <div style={{ gridRow: '1/3', borderRadius: 12, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd', fontWeight: 700 }}>Main</div>
      <div style={{ borderRadius: 12, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c4b5fd', fontSize: 12, fontWeight: 700 }}>Side A</div>
      <div style={{ borderRadius: 12, background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f9a8d4', fontSize: 12, fontWeight: 700 }}>Side B</div>
    </div>
  )
}

function MasonryDemo() {
  const heights = [100, 140, 80, 120, 160, 90]
  const colors = ['#3b82f6','#8b5cf6','#ec4899','#10b981','#f59e0b','#67e8f9']
  return (
    <div style={{ columns: 2, gap: 8, padding: 8 }}>
      {heights.map((h, i) => (
        <motion.div key={i} whileHover={{ scale: 1.02 }}
          style={{ height: h, borderRadius: 10, background: `${colors[i]}18`, border: `1px solid ${colors[i]}30`, marginBottom: 8, breakInside: 'avoid' }} />
      ))}
    </div>
  )
}

function FeatureGridDemo() {
  const features = [
    { icon: '🔐', title: 'KYC Engine', desc: '99.7% accuracy' },
    { icon: '💸', title: 'Payments', desc: 'Multi-rail' },
    { icon: '📊', title: 'Analytics', desc: 'Real-time' },
    { icon: '🌍', title: 'Global', desc: '5+ markets' },
    { icon: '⚡', title: 'Fast API', desc: '<120ms' },
    { icon: '🛡️', title: 'Secure', desc: 'SOC2 ready' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
      {features.map(({ icon, title, desc }) => (
        <motion.div key={title} whileHover={{ y: -3 }}
          style={{ padding: '14px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{title}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{desc}</div>
        </motion.div>
      ))}
    </div>
  )
}

function HeroDemo() {
  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '20px 0' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ padding: '4px 14px', borderRadius: 99, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', fontSize: 11, fontWeight: 700, color: '#93c5fd' }}>
        ✦ Africa's #1 Fintech Stack
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#67e8f9,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-0.04em' }}>
        Move Digital
      </motion.h2>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, maxWidth: 260 }}>
        Premium fintech components for Africa's builders.
      </motion.p>
      <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
        style={{ padding: '11px 26px', borderRadius: 99, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
        Get Started
      </motion.button>
    </div>
  )
}

function SplitLayoutDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', padding: 8 }}>
      <div style={{ borderRadius: 12, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#93c5fd' }}>Content</div>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.06)', width: `${70 + i * 8}%` }} />
        ))}
      </div>
      <div style={{ borderRadius: 12, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 32 }}>◈</div>
      </div>
    </div>
  )
}

function CardGridDemo() {
  const colors = ['#3b82f6','#8b5cf6','#ec4899','#10b981','#f59e0b','#67e8f9']
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: 8 }}>
      {colors.map((c, i) => (
        <motion.div key={i} whileHover={{ scale: 1.05, y: -4 }}
          style={{ height: 70, borderRadius: 10, background: `${c}12`, border: `1px solid ${c}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
          ✦
        </motion.div>
      ))}
    </div>
  )
}

function SidebarLayoutDemo() {
  return (
    <div style={{ display: 'flex', gap: 8, width: '100%', padding: 8, height: 160 }}>
      <div style={{ width: 70, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 6, padding: 8 }}>
        {['🏠','📊','💸','⚙️'].map((icon, i) => (
          <div key={i} style={{ height: 28, borderRadius: 7, background: i === 0 ? 'rgba(59,130,246,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{icon}</div>
        ))}
      </div>
      <div style={{ flex: 1, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[80, 60, 90].map((w, i) => (
          <div key={i} style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.06)', width: `${w}%` }} />
        ))}
      </div>
    </div>
  )
}

export const LAYOUT_REGISTRY: Record<string, any> = {
  'layout/bento': {
    name: 'Bento Grid',
    description: 'Asymmetric bento-style grid layout — popular in modern landing pages.',
    preview: <BentoDemo />,
    code: `// CSS Grid bento layout
export function BentoGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: 16,
    }}>
      {children}
    </div>
  )
}
// First child should have: gridRow: '1 / 3' to span full height`,
    props: [],
  },
  'layout/masonry': {
    name: 'Masonry Grid',
    description: 'Pinterest-style masonry layout using CSS columns — no JS grid calculations.',
    preview: <MasonryDemo />,
    code: `export function MasonryGrid({ children, columns = 3, gap = 16 }: { children: React.ReactNode; columns?: number; gap?: number }) {
  return (
    <div style={{ columns, gap, columnGap: gap }}>
      {React.Children.map(children, child => (
        <div style={{ breakInside: 'avoid', marginBottom: gap }}>
          {child}
        </div>
      ))}
    </div>
  )
}`,
    props: [
      { name: 'columns', type: 'number', default: '3', desc: 'Number of masonry columns' },
      { name: 'gap', type: 'number', default: '16', desc: 'Gap between items in px' },
    ],
  },
  'layout/feature-grid': {
    name: 'Feature Grid',
    description: 'Uniform grid of feature cards — the standard layout for marketing sections.',
    preview: <FeatureGridDemo />,
    code: `export function FeatureGrid({ children, columns = 3 }: { children: React.ReactNode; columns?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: \`repeat(\${columns}, 1fr)\`,
      gap: 16,
    }}>
      {children}
    </div>
  )
}`,
    props: [
      { name: 'columns', type: 'number', default: '3', desc: 'Number of columns (responsive)' },
    ],
  },
  'layout/hero': {
    name: 'Hero Section',
    description: 'Centered hero with badge, heading, description, and CTA — animated on mount.',
    preview: <HeroDemo />,
    code: `import { motion } from 'framer-motion'

export function HeroSection({ badge, heading, description, cta }: { badge?: string; heading: string; description: string; cta: string }) {
  return (
    <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '80px 24px' }}>
      {badge && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '4px 14px', borderRadius: 99, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', fontSize: 12, fontWeight: 700, color: '#93c5fd' }}>
          {badge}
        </motion.div>
      )}
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 900, letterSpacing: '-0.04em' }}>
        {heading}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        style={{ maxWidth: 600, fontSize: 18, opacity: 0.6 }}>
        {description}
      </motion.p>
      <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}
        style={{ padding: '14px 32px', borderRadius: 99, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
        {cta}
      </motion.button>
    </section>
  )
}`,
    props: [
      { name: 'badge', type: 'string', default: 'undefined', desc: 'Optional eyebrow badge text' },
      { name: 'heading', type: 'string', default: '—', desc: 'Main h1 heading' },
      { name: 'description', type: 'string', default: '—', desc: 'Supporting paragraph text' },
      { name: 'cta', type: 'string', default: '—', desc: 'Call-to-action button label' },
    ],
  },
  'layout/split': {
    name: 'Split Layout',
    description: '50/50 two-column layout — text left, visual right. Great for feature sections.',
    preview: <SplitLayoutDemo />,
    code: `export function SplitLayout({ left, right, reverse = false }: { left: React.ReactNode; right: React.ReactNode; reverse?: boolean }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center',
      flexDirection: reverse ? 'row-reverse' : 'row',
    }}>
      <div>{reverse ? right : left}</div>
      <div>{reverse ? left : right}</div>
    </div>
  )
}`,
    props: [
      { name: 'left', type: 'ReactNode', default: '—', desc: 'Left column content' },
      { name: 'right', type: 'ReactNode', default: '—', desc: 'Right column content' },
      { name: 'reverse', type: 'boolean', default: 'false', desc: 'Swap column order' },
    ],
  },
  'layout/card-grid': {
    name: 'Card Grid',
    description: 'Responsive auto-fill card grid that reflows at any screen width.',
    preview: <CardGridDemo />,
    code: `export function CardGrid({ children, minWidth = 280 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: \`repeat(auto-fill, minmax(\${minWidth}px, 1fr))\`,
      gap: 16,
    }}>
      {children}
    </div>
  )
}`,
    props: [
      { name: 'minWidth', type: 'number', default: '280', desc: 'Minimum card width before wrapping' },
    ],
  },
  'layout/sidebar': {
    name: 'Sidebar Layout',
    description: 'Fixed sidebar + scrollable main content — the standard app shell pattern.',
    preview: <SidebarLayoutDemo />,
    code: `export function SidebarLayout({ sidebar, children, sidebarWidth = 240 }: { sidebar: React.ReactNode; children: React.ReactNode; sidebarWidth?: number }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: sidebarWidth, flexShrink: 0, borderRight: '1px solid var(--border)' }}>
        {sidebar}
      </aside>
      <main style={{ flex: 1, overflow: 'auto', padding: 32 }}>
        {children}
      </main>
    </div>
  )
}`,
    props: [
      { name: 'sidebar', type: 'ReactNode', default: '—', desc: 'Sidebar navigation content' },
      { name: 'sidebarWidth', type: 'number', default: '240', desc: 'Sidebar width in px' },
    ],
  },
}
