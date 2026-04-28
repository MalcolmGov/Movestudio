import { motion } from 'framer-motion'
import { Zap, Layers, Type, Sparkles, Box, LayoutGrid, ArrowRight, Copy, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  { label: 'Text Animations', icon: Type, count: 6, color: 'var(--cyan)', path: '/text/blur-text', desc: 'Blur, split, gradient, typewriter & more' },
  { label: 'Backgrounds', icon: Sparkles, count: 5, color: 'var(--violet)', path: '/backgrounds/aurora', desc: 'Aurora, particles, galaxy, grid patterns' },
  { label: 'Animations', icon: Zap, count: 5, color: 'var(--blue)', path: '/animations/fade-blur-up', desc: 'Magnetic, scroll reveal, float, stagger' },
  { label: 'UI Components', icon: Box, count: 7, color: '#f59e0b', path: '/ui/glass-card', desc: 'Glass cards, neon buttons, gradient borders' },
  { label: 'Layout', icon: LayoutGrid, count: 3, color: 'var(--pink)', path: '/layout/bento', desc: 'Bento grids, masonry, feature grids' },
]

const FEATURED = [
  { name: 'Blur Text', category: 'text', path: '/text/blur-text', preview: <BlurTextPreview />, tag: 'Popular' },
  { name: 'Aurora Background', category: 'backgrounds', path: '/backgrounds/aurora', preview: <AuroraPreview />, tag: 'New' },
  { name: 'Glass Card', category: 'ui', path: '/ui/glass-card', preview: <GlassCardPreview />, tag: 'Popular' },
  { name: 'Magnetic Button', category: 'animations', path: '/animations/magnetic', preview: <MagneticPreview />, tag: null },
  { name: 'Gradient Text', category: 'text', path: '/text/gradient-text', preview: <GradientTextPreview />, tag: null },
  { name: 'Glow Card', category: 'ui', path: '/ui/glow-card', preview: <GlowCardPreview />, tag: 'New' },
]

function BlurTextPreview() {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.h3
        initial={{ filter: 'blur(20px)', opacity: 0 }}
        animate={{ filter: 'blur(0px)', opacity: 1 }}
        transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
        style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', color: 'white' }}
      >
        Hello World
      </motion.h3>
    </div>
  )
}

function AuroraPreview() {
  return (
    <div style={{
      width: '100%', height: '100%', position: 'absolute', inset: 0,
      background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.2))',
      backgroundSize: '400% 400%',
      animation: 'aurora 4s ease infinite',
    }} />
  )
}

function GlassCardPreview() {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      style={{
        padding: '20px 28px', borderRadius: 16,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        color: 'white', textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>✦</div>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Glass Card</div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>Hover me</div>
    </motion.div>
  )
}

function MagneticPreview() {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '12px 28px', borderRadius: 99, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: 'white', fontWeight: 700, fontSize: 14,
        boxShadow: '0 0 30px rgba(59,130,246,0.4)',
      }}
    >
      Magnetic ✦
    </motion.button>
  )
}

function GradientTextPreview() {
  return (
    <h3 style={{
      fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em',
      background: 'linear-gradient(135deg, #67e8f9, #3b82f6, #8b5cf6, #ec4899)',
      backgroundSize: '300% 300%',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      animation: 'gradient-flow 3s ease infinite',
    }}>
      Move Digital
    </h3>
  )
}

function GlowCardPreview() {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 20px rgba(99,179,237,0.3)', '0 0 50px rgba(99,179,237,0.6)', '0 0 20px rgba(99,179,237,0.3)'] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        padding: '20px 28px', borderRadius: 16,
        background: 'rgba(99,179,237,0.05)',
        border: '1px solid rgba(99,179,237,0.3)',
        color: 'white', textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 24, marginBottom: 8, color: '#67e8f9' }}>⬡</div>
      <div style={{ fontWeight: 700 }}>Glow Card</div>
    </motion.div>
  )
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="hero-badge">
            <Zap size={11} />
            130+ Premium Components · Move Digital
          </div>
          <h1>
            Build stunning UIs<br />
            <span>faster than ever</span>
          </h1>
          <p>
            A comprehensive collection of animated, interactive React components.
            Copy. Paste. Ship. Built for Move Digital clients.
          </p>
          <div className="hero-actions">
            <Link to="/text/blur-text" className="btn btn-primary">
              <Layers size={15} /> Browse Components <ArrowRight size={14} />
            </Link>
            <Link to="/ui/glass-card" className="btn btn-outline">
              <Star size={14} /> Featured
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <div className="stats-row">
        {[
          { value: '130+', label: 'Components' },
          { value: '5', label: 'Categories' },
          { value: 'MIT', label: 'License' },
          { value: 'TS', label: 'TypeScript' },
        ].map((s, i) => (
          <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="value">{s.value}</div>
            <div className="label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Categories */}
      <div className="component-page">
        <div className="component-page-header">
          <h2>Browse by Category</h2>
          <p>Pick a category to explore all components</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 48 }}>
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={cat.path} style={{ textDecoration: 'none' }}>
                <div className="component-card" style={{ padding: 24 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <cat.icon size={18} color={cat.color} />
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 15 }}>{cat.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{cat.desc}</div>
                  <div style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>{cat.count} components →</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Featured Components */}
        <div className="component-page-header">
          <h2>Featured Components</h2>
          <p>Hand-picked, most popular components</p>
        </div>
        <div className="component-grid">
          {FEATURED.map((comp, i) => (
            <motion.div key={comp.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to={comp.path} style={{ textDecoration: 'none' }}>
                <div className="component-card">
                  <div className="component-card-preview">
                    {comp.preview}
                    {comp.tag && (
                      <div style={{
                        position: 'absolute', top: 10, right: 10,
                        padding: '2px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700,
                        background: comp.tag === 'New' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                        color: comp.tag === 'New' ? 'var(--emerald)' : '#93c5fd',
                        border: `1px solid ${comp.tag === 'New' ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}`,
                      }}>
                        {comp.tag}
                      </div>
                    )}
                  </div>
                  <div className="component-card-info">
                    <h3>{comp.name}</h3>
                    <p>{comp.category}</p>
                    <div className="component-card-tags">
                      <span className="tag tag-blue">React</span>
                      <span className="tag tag-violet">Framer Motion</span>
                      <span className="tag">Copy-paste</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
