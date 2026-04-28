import { motion } from 'framer-motion'
import { useState } from 'react'

// ── Demos ──────────────────────────────────────────────────

function GlassCardDemo() {
  return (
    <motion.div whileHover={{ scale: 1.05, y: -6 }}
      style={{ padding: '24px 32px', borderRadius: 16, background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)', textAlign: 'center', color: 'white' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>✦</div>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Glass Card</div>
      <div style={{ fontSize: 12, opacity: 0.5 }}>Hover to interact</div>
    </motion.div>
  )
}

function GlowCardDemo() {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 20px rgba(99,179,237,0.2)','0 0 50px rgba(99,179,237,0.5)','0 0 20px rgba(99,179,237,0.2)'] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ padding: '24px 32px', borderRadius: 16, background: 'rgba(99,179,237,0.05)',
        border: '1px solid rgba(99,179,237,0.3)', textAlign: 'center', color: 'white' }}>
      <div style={{ fontSize: 28, marginBottom: 8, color: '#67e8f9' }}>⬡</div>
      <div style={{ fontWeight: 700 }}>Glow Card</div>
    </motion.div>
  )
}

function TiltCardDemo() {
  return (
    <motion.div
      whileHover={{ rotateX: 8, rotateY: -8, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        padding: '28px 36px', borderRadius: 16, background: 'rgba(139,92,246,0.08)',
        border: '1px solid rgba(139,92,246,0.25)', textAlign: 'center', color: 'white',
        transformStyle: 'preserve-3d', perspective: 800,
      }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>◈</div>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Tilt Card</div>
      <div style={{ fontSize: 12, opacity: 0.5 }}>Hover for 3D tilt</div>
    </motion.div>
  )
}

function FlipCardDemo() {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={{ perspective: 800, cursor: 'pointer' }} onClick={() => setFlipped(f => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 180, height: 120, position: 'relative', transformStyle: 'preserve-3d' }}
      >
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14, backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 15,
        }}>Front ✦</div>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 15,
        }}>Back ⬡</div>
      </motion.div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>Click to flip</div>
    </div>
  )
}

function ExpandCardDemo() {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      animate={{ height: open ? 'auto' : 80 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setOpen(o => !o)}
      style={{
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
        width: 240,
      }}>
      <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>Expand Card</div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ color: '#67e8f9', fontSize: 12 }}>▼</motion.span>
      </div>
      {open && (
        <div style={{ padding: '0 20px 18px', color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6 }}>
          Hidden content reveals when expanded. Great for FAQs and feature details.
        </div>
      )}
    </motion.div>
  )
}

function GradientBorderCardDemo() {
  return (
    <div style={{ padding: 2, borderRadius: 14, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)' }}>
      <div style={{ background: '#0d1120', borderRadius: 12, padding: '20px 28px', textAlign: 'center', color: 'white', fontWeight: 600 }}>
        Gradient Border
      </div>
    </div>
  )
}

function SpotlightCardDemo() {
  return (
    <motion.div
      whileHover={{ background: 'radial-gradient(circle at 50% 40%, rgba(103,232,249,0.12), rgba(15,17,30,0.95) 70%)' }}
      style={{
        padding: '28px 32px', borderRadius: 16, background: 'rgba(15,17,30,0.95)',
        border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', color: 'white',
      }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>✦</div>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>Spotlight Card</div>
      <div style={{ fontSize: 12, opacity: 0.4 }}>Hover for spotlight</div>
    </motion.div>
  )
}

function StatCardDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[['99.7%','KYC Accuracy'],['6+','Platforms'],['10+','Rails'],['5+','Markets']].map(([v, l]) => (
        <div key={l} style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, background: 'linear-gradient(135deg,#67e8f9,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
        </div>
      ))}
    </div>
  )
}

function FeatureCardDemo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
      {[
        { icon: '🔐', title: 'KYC Verify', color: '#3b82f6' },
        { icon: '💸', title: 'Payments', color: '#8b5cf6' },
        { icon: '📊', title: 'Analytics', color: '#67e8f9' },
        { icon: '🌍', title: 'Global Rails', color: '#ec4899' },
      ].map(({ icon, title, color }) => (
        <motion.div key={title} whileHover={{ scale: 1.04, y: -3 }}
          style={{
            padding: '16px 14px', borderRadius: 12, background: `${color}10`,
            border: `1px solid ${color}30`, textAlign: 'center',
          }}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{title}</div>
        </motion.div>
      ))}
    </div>
  )
}

// ── Code Snippets ─────────────────────────────────────────

const GLASS_CARD_CODE = `import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  hover?: boolean
  blur?: number
  opacity?: number
}

export function GlassCard({ children, hover = true, blur = 20, opacity = 0.05 }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      style={{
        background: \`rgba(255,255,255,\${opacity})\`,
        backdropFilter: \`blur(\${blur}px)\`,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {children}
    </motion.div>
  )
}`

const FLIP_CARD_CODE = `import { useState } from 'react'
import { motion } from 'framer-motion'

export function FlipCard({ front, back }: { front: React.ReactNode; back: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={{ perspective: 800 }} onClick={() => setFlipped(f => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', transformStyle: 'preserve-3d' }}
      >
        <div style={{ backfaceVisibility: 'hidden' }}>{front}</div>
        <div style={{ position: 'absolute', inset: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          {back}
        </div>
      </motion.div>
    </div>
  )
}`

const TILT_CARD_CODE = `import { motion } from 'framer-motion'

export function TiltCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ rotateX: 8, rotateY: -8, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}`

const GLOW_CARD_CODE = `import { motion } from 'framer-motion'

export function GlowCard({ children, color = 'rgba(99,179,237,1)' }: { children: React.ReactNode; color?: string }) {
  const rgb = color
  return (
    <motion.div
      animate={{ boxShadow: [\`0 0 20px \${rgb}33\`, \`0 0 50px \${rgb}80\`, \`0 0 20px \${rgb}33\`] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ border: \`1px solid \${rgb}50\`, borderRadius: 16 }}
    >
      {children}
    </motion.div>
  )
}`

const SPOTLIGHT_CODE = `import { useRef, useState } from 'react'

export function SpotlightCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{
        background: \`radial-gradient(circle at \${pos.x}% \${pos.y}%, rgba(103,232,249,0.12), rgba(15,17,30,0.95) 70%)\`,
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
      }}
    >
      {children}
    </div>
  )
}`

export const CARDS_REGISTRY: Record<string, any> = {
  'cards/glass': {
    name: 'Glass Card',
    description: 'Glassmorphism card with backdrop blur, subtle border, and hover lift.',
    preview: <GlassCardDemo />,
    code: GLASS_CARD_CODE,
    props: [
      { name: 'hover', type: 'boolean', default: 'true', desc: 'Enable hover lift animation' },
      { name: 'blur', type: 'number', default: '20', desc: 'Backdrop blur amount in px' },
      { name: 'opacity', type: 'number', default: '0.05', desc: 'Background white opacity' },
    ],
  },
  'cards/glow': {
    name: 'Glow Card',
    description: 'Card with pulsing ambient glow — great for feature highlights.',
    preview: <GlowCardDemo />,
    code: GLOW_CARD_CODE,
    props: [
      { name: 'color', type: 'string', default: 'rgba(99,179,237,1)', desc: 'Glow color as rgba' },
    ],
  },
  'cards/tilt': {
    name: 'Tilt Card',
    description: '3D perspective tilt on hover — adds depth and premium feel.',
    preview: <TiltCardDemo />,
    code: TILT_CARD_CODE,
    props: [],
  },
  'cards/flip': {
    name: 'Flip Card',
    description: 'Click to flip between a front and back face with a 3D rotation.',
    preview: <FlipCardDemo />,
    code: FLIP_CARD_CODE,
    props: [
      { name: 'front', type: 'ReactNode', default: '—', desc: 'Front face content' },
      { name: 'back', type: 'ReactNode', default: '—', desc: 'Back face content' },
    ],
  },
  'cards/expand': {
    name: 'Expand Card',
    description: 'Click to expand and reveal hidden content — great for FAQs and previews.',
    preview: <ExpandCardDemo />,
    code: `import { useState } from 'react'
import { motion } from 'framer-motion'

export function ExpandCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      animate={{ height: open ? 'auto' : 72 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setOpen(o => !o)}
      style={{ overflow: 'hidden', cursor: 'pointer', borderRadius: 14 }}
    >
      <div style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700 }}>{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }}>▼</motion.span>
      </div>
      <div style={{ padding: '0 20px 18px' }}>{children}</div>
    </motion.div>
  )
}`,
    props: [
      { name: 'title', type: 'string', default: '—', desc: 'Card header text' },
      { name: 'children', type: 'ReactNode', default: '—', desc: 'Expandable content' },
    ],
  },
  'cards/gradient-border': {
    name: 'Gradient Border',
    description: 'Card with an animated gradient border using the CSS padding trick.',
    preview: <GradientBorderCardDemo />,
    code: `export function GradientBorderCard({ children, colors = '#3b82f6,#8b5cf6,#ec4899' }: { children: React.ReactNode; colors?: string }) {
  return (
    <div style={{ padding: 2, borderRadius: 14, background: \`linear-gradient(135deg, \${colors})\` }}>
      <div style={{ background: '#0d1120', borderRadius: 12, padding: 24 }}>
        {children}
      </div>
    </div>
  )
}`,
    props: [
      { name: 'colors', type: 'string', default: "'#3b82f6,#8b5cf6,#ec4899'", desc: 'Comma-separated gradient stops' },
    ],
  },
  'cards/spotlight': {
    name: 'Spotlight Card',
    description: 'Card background follows mouse cursor with a radial glow spotlight effect.',
    preview: <SpotlightCardDemo />,
    code: SPOTLIGHT_CODE,
    props: [],
  },
  'cards/stat': {
    name: 'Stat Card',
    description: 'Metric display card with gradient number — combine with CountUp for live data.',
    preview: <StatCardDemo />,
    code: `export function StatCard({ value, label, color = '#67e8f9' }: { value: string; label: string; color?: string }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
      <div style={{ fontSize: 28, fontWeight: 800, background: \`linear-gradient(135deg, \${color}, #8b5cf6)\`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  )
}`,
    props: [
      { name: 'value', type: 'string', default: '—', desc: 'Metric value to display' },
      { name: 'label', type: 'string', default: '—', desc: 'Metric label / description' },
      { name: 'color', type: 'string', default: '#67e8f9', desc: 'Gradient start color for value' },
    ],
  },
  'cards/feature': {
    name: 'Feature Card',
    description: 'Icon + title feature card with color-coded accent — great for services grids.',
    preview: <FeatureCardDemo />,
    code: `import { motion } from 'framer-motion'

export function FeatureCard({ icon, title, description, color = '#3b82f6' }: { icon: React.ReactNode; title: string; description?: string; color?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      style={{
        padding: '20px', borderRadius: 14,
        background: \`\${color}10\`, border: \`1px solid \${color}30\`,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4 }}>{title}</div>
      {description && <div style={{ fontSize: 12, opacity: 0.5 }}>{description}</div>}
    </motion.div>
  )
}`,
    props: [
      { name: 'icon', type: 'ReactNode', default: '—', desc: 'Icon element or emoji' },
      { name: 'title', type: 'string', default: '—', desc: 'Feature name' },
      { name: 'description', type: 'string', default: 'undefined', desc: 'Short description text' },
      { name: 'color', type: 'string', default: '#3b82f6', desc: 'Card accent color' },
    ],
  },
}
