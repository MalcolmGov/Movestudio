import { motion } from 'framer-motion'
import { useState } from 'react'

// ── Demos ──────────────────────────────────────────────────

function ShimmerButtonDemo() {
  return (
    <button style={{
      position: 'relative', overflow: 'hidden',
      padding: '13px 32px', borderRadius: 99, border: 'none', cursor: 'pointer',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font)',
    }}>
      <span style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
        backgroundSize: '200% auto',
        animation: 'shimmer 2s linear infinite',
      }} />
      Get Started
    </button>
  )
}

function GradientButtonDemo() {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
      style={{
        padding: '13px 32px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg,#67e8f9,#3b82f6,#8b5cf6)',
        backgroundSize: '200% auto', animation: 'gradient-flow 3s ease infinite',
        color: 'white', fontWeight: 700, fontSize: 15, fontFamily: 'var(--font)',
        boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
      }}>
      Gradient Button
    </motion.button>
  )
}

function NeonButtonDemo() {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
      style={{
        padding: '12px 28px', borderRadius: 8, border: '1px solid rgba(99,179,237,0.5)',
        background: 'rgba(99,179,237,0.08)', color: '#67e8f9', fontWeight: 700, fontSize: 14,
        cursor: 'pointer', fontFamily: 'var(--font)',
        boxShadow: '0 0 20px rgba(99,179,237,0.2), inset 0 0 20px rgba(99,179,237,0.05)',
      }}>
      Neon Button
    </motion.button>
  )
}

function OutlineButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      {['Default', 'Hover Me'].map((label, i) => (
        <motion.button key={label} whileHover={{ background: 'rgba(103,232,249,0.1)' }}
          style={{
            padding: '11px 24px', borderRadius: 8,
            border: '1px solid rgba(103,232,249,0.4)',
            background: 'transparent', color: '#67e8f9',
            fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)',
          }}>
          {label}
        </motion.button>
      ))}
    </div>
  )
}

function IconButtonDemo() {
  const icons = ['✦', '⬡', '◈', '⊕']
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {icons.map((icon, i) => (
        <motion.button key={i} whileHover={{ scale: 1.1, background: 'rgba(103,232,249,0.12)' }} whileTap={{ scale: 0.92 }}
          style={{
            width: 44, height: 44, borderRadius: 10, border: '1px solid rgba(103,232,249,0.25)',
            background: 'rgba(255,255,255,0.04)', color: '#67e8f9', fontSize: 18,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          {icon}
        </motion.button>
      ))}
    </div>
  )
}

function LoadingButtonDemo() {
  const [loading, setLoading] = useState(false)
  const trigger = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }
  return (
    <motion.button onClick={trigger} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
      style={{
        padding: '12px 28px', borderRadius: 99, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
        color: 'white', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font)',
        display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.8 : 1,
      }}>
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}
        />
      )}
      {loading ? 'Processing...' : 'Click to Load'}
    </motion.button>
  )
}

function GlitchButtonDemo() {
  return (
    <motion.button
      animate={{ x: [0, -2, 2, -1, 1, 0] }}
      transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }}
      style={{
        padding: '12px 28px', borderRadius: 6, border: '1px solid rgba(236,72,153,0.5)',
        background: 'rgba(236,72,153,0.08)', color: '#f472b6', fontWeight: 800,
        fontSize: 14, cursor: 'pointer', fontFamily: 'var(--mono)',
        textShadow: '2px 0 #67e8f9, -2px 0 #8b5cf6',
        letterSpacing: '0.08em',
      }}>
      GLITCH
    </motion.button>
  )
}

// ── Code Snippets ─────────────────────────────────────────

const SHIMMER_BUTTON_CODE = `// Add to CSS:
// @keyframes shimmer { 0% { background-position: 200% center } 100% { background-position: -200% center } }

export function ShimmerButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative', overflow: 'hidden',
        padding: '13px 32px', borderRadius: 99, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        color: 'white', fontWeight: 700, fontSize: 15,
      }}
    >
      <span style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
        backgroundSize: '200% auto',
        animation: 'shimmer 2s linear infinite',
      }} />
      {children}
    </button>
  )
}`

const GRADIENT_BUTTON_CODE = `import { motion } from 'framer-motion'

interface GradientButtonProps {
  children: React.ReactNode
  from?: string
  to?: string
  onClick?: () => void
}

export function GradientButton({ children, from = '#3b82f6', to = '#8b5cf6', onClick }: GradientButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        padding: '13px 32px', borderRadius: 10, border: 'none', cursor: 'pointer',
        background: \`linear-gradient(135deg, \${from}, \${to})\`,
        color: 'white', fontWeight: 700, fontSize: 15,
        boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
      }}
    >
      {children}
    </motion.button>
  )
}`

const NEON_BUTTON_CODE = `import { motion } from 'framer-motion'

export function NeonButton({ children, color = '#67e8f9', onClick }: { children: React.ReactNode; color?: string; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        padding: '12px 28px', borderRadius: 8, cursor: 'pointer',
        border: \`1px solid \${color}80\`,
        background: \`\${color}12\`,
        color, fontWeight: 700, fontSize: 14,
        boxShadow: \`0 0 20px \${color}30, inset 0 0 20px \${color}08\`,
      }}
    >
      {children}
    </motion.button>
  )
}`

const LOADING_BUTTON_CODE = `import { useState } from 'react'
import { motion } from 'framer-motion'

export function LoadingButton({ children, onLoad }: { children: React.ReactNode; onLoad: () => Promise<void> }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try { await onLoad() } finally { setLoading(false) }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      whileHover={!loading ? { scale: 1.04 } : undefined}
      style={{ padding: '12px 28px', borderRadius: 99, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
        background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white', fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: 8, opacity: loading ? 0.8 : 1 }}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          style={{ width: 14, height: 14, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}
        />
      )}
      {loading ? 'Loading...' : children}
    </motion.button>
  )
}`

const GLITCH_BUTTON_CODE = `import { motion } from 'framer-motion'

export function GlitchButton({ children }: { children: React.ReactNode }) {
  return (
    <motion.button
      animate={{ x: [0, -2, 2, -1, 1, 0] }}
      transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
      style={{
        padding: '12px 28px', borderRadius: 6,
        border: '1px solid rgba(236,72,153,0.5)',
        background: 'rgba(236,72,153,0.08)',
        color: '#f472b6', fontWeight: 800, fontSize: 14,
        cursor: 'pointer', fontFamily: 'monospace',
        textShadow: '2px 0 #67e8f9, -2px 0 #8b5cf6',
        letterSpacing: '0.08em',
      }}
    >
      {children}
    </motion.button>
  )
}`

export const BUTTONS_REGISTRY: Record<string, any> = {
  'buttons/shimmer': {
    name: 'Shimmer Button',
    description: 'A CTA button with a light shimmer sweep animation — the go-to premium CTA.',
    preview: <ShimmerButtonDemo />,
    code: SHIMMER_BUTTON_CODE,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', desc: 'Button label content' },
      { name: 'onClick', type: '() => void', default: 'undefined', desc: 'Click handler' },
    ],
  },
  'buttons/gradient': {
    name: 'Gradient Button',
    description: 'Animated gradient fill with hover scale — bold and eye-catching.',
    preview: <GradientButtonDemo />,
    code: GRADIENT_BUTTON_CODE,
    props: [
      { name: 'from', type: 'string', default: '#3b82f6', desc: 'Gradient start color' },
      { name: 'to', type: 'string', default: '#8b5cf6', desc: 'Gradient end color' },
      { name: 'onClick', type: '() => void', default: 'undefined', desc: 'Click handler' },
    ],
  },
  'buttons/neon': {
    name: 'Neon Button',
    description: 'Glowing neon border with inner glow — perfect for dark UIs.',
    preview: <NeonButtonDemo />,
    code: NEON_BUTTON_CODE,
    props: [
      { name: 'color', type: 'string', default: '#67e8f9', desc: 'Neon glow color' },
      { name: 'onClick', type: '() => void', default: 'undefined', desc: 'Click handler' },
    ],
  },
  'buttons/outline': {
    name: 'Outline Button',
    description: 'Clean bordered button with hover fill — versatile secondary action style.',
    preview: <OutlineButtonDemo />,
    code: `import { motion } from 'framer-motion'

export function OutlineButton({ children, color = '#67e8f9', onClick }: { children: React.ReactNode; color?: string; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ background: \`\${color}18\` }}
      onClick={onClick}
      style={{
        padding: '11px 24px', borderRadius: 8, cursor: 'pointer',
        border: \`1px solid \${color}66\`,
        background: 'transparent', color,
        fontWeight: 600, fontSize: 14,
      }}
    >
      {children}
    </motion.button>
  )
}`,
    props: [
      { name: 'color', type: 'string', default: '#67e8f9', desc: 'Border and text color' },
      { name: 'onClick', type: '() => void', default: 'undefined', desc: 'Click handler' },
    ],
  },
  'buttons/icon': {
    name: 'Icon Button',
    description: 'Square icon-only button with hover highlight — for toolbars and action bars.',
    preview: <IconButtonDemo />,
    code: `import { motion } from 'framer-motion'

export function IconButton({ icon, onClick, label, color = '#67e8f9' }: { icon: React.ReactNode; onClick?: () => void; label?: string; color?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, background: \`\${color}18\` }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={label}
      style={{
        width: 44, height: 44, borderRadius: 10, border: \`1px solid \${color}40\`,
        background: 'rgba(255,255,255,0.04)', color,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {icon}
    </motion.button>
  )
}`,
    props: [
      { name: 'icon', type: 'ReactNode', default: '—', desc: 'Icon element to display' },
      { name: 'label', type: 'string', default: 'undefined', desc: 'Accessible aria-label' },
      { name: 'color', type: 'string', default: '#67e8f9', desc: 'Icon and border color' },
    ],
  },
  'buttons/loading': {
    name: 'Loading Button',
    description: 'Button with inline spinner for async actions — handles loading state elegantly.',
    preview: <LoadingButtonDemo />,
    code: LOADING_BUTTON_CODE,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', desc: 'Button label' },
      { name: 'onLoad', type: '() => Promise<void>', default: '—', desc: 'Async action to perform' },
    ],
  },
  'buttons/glitch': {
    name: 'Glitch Button',
    description: 'RGB-split glitch animation with a chromatic aberration text shadow.',
    preview: <GlitchButtonDemo />,
    code: GLITCH_BUTTON_CODE,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', desc: 'Button text content' },
    ],
  },
}
