import { motion } from 'framer-motion'
import { useState } from 'react'

// ── Demos ──────────────────────────────────────────────────

function FadeBlurUpDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      {['Move', 'Digital', 'Africa'].map((t, i) => (
        <motion.div key={t}
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: i * 0.2, duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
          style={{ fontSize: 24, fontWeight: 700, color: 'white' }}
        >{t}</motion.div>
      ))}
    </div>
  )
}

function MagneticDemo() {
  return (
    <motion.button whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
      style={{ padding: '14px 32px', borderRadius: 99, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white',
        fontWeight: 700, fontSize: 15, boxShadow: '0 0 40px rgba(59,130,246,0.4)', fontFamily: 'var(--font)' }}>
      Hover Me ✦
    </motion.button>
  )
}

function ScrollRevealDemo() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {[0,1,2].map(i => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          style={{ width: 60, height: 60, borderRadius: 12, background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.2)' }} />
      ))}
    </div>
  )
}

function StaggerDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
      {['Swifter','PayGuard','eKYC Africa'].map((t, i) => (
        <motion.div key={t}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, repeat: Infinity, repeatDelay: 1.5 }}
          style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 13, color: 'white' }}
        >{t}</motion.div>
      ))}
    </div>
  )
}

function FloatDemo() {
  return (
    <motion.div
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: '0 20px 40px rgba(59,130,246,0.3)' }}
    >✦</motion.div>
  )
}

function RippleDemo() {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute', width: 60, height: 60, borderRadius: '50%',
            border: '1px solid rgba(103,232,249,0.5)',
          }}
        />
      ))}
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#67e8f9,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✦</div>
    </div>
  )
}

function ElasticDemo() {
  return (
    <motion.div
      animate={{ scale: [1, 1.25, 0.9, 1.08, 0.98, 1] }}
      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5, ease: 'easeOut' }}
      style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg,#ec4899,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}
    >⬡</motion.div>
  )
}

function SlideInDemo() {
  return (
    <div style={{ overflow: 'hidden', width: 260 }}>
      {['Dashboard', 'Analytics', 'Payments'].map((t, i) => (
        <motion.div key={t}
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.12, duration: 0.55, repeat: Infinity, repeatDelay: 2 }}
          style={{ padding: '10px 16px', marginBottom: 6, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, color: 'white' }}
        >{t}</motion.div>
      ))}
    </div>
  )
}

function RotateInDemo() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {['⬡', '✦', '◈'].map((icon, i) => (
        <motion.div key={icon}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          style={{ fontSize: 36, color: ['#67e8f9', '#8b5cf6', '#ec4899'][i] }}
        >{icon}</motion.div>
      ))}
    </div>
  )
}

function ZoomInDemo() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 200, repeat: Infinity, repeatDelay: 1.5 }}
      style={{ padding: '14px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white', fontWeight: 700, fontSize: 16 }}
    >Zoom In</motion.div>
  )
}

function ShakeDemo() {
  return (
    <motion.div
      animate={{ x: [0, -8, 8, -8, 8, -4, 4, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
      style={{ padding: '14px 28px', borderRadius: 10, background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)', color: '#f472b6', fontWeight: 700, fontSize: 15 }}
    >⚠ Error State</motion.div>
  )
}

function ConfettiDemo() {
  const colors = ['#67e8f9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
  return (
    <div style={{ position: 'relative', width: 200, height: 120, overflow: 'hidden' }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, 100], x: [0, (Math.random() - 0.5) * 80], rotate: [0, 360], opacity: [1, 0] }}
          transition={{ duration: 1.2 + Math.random(), repeat: Infinity, delay: Math.random() * 1.5, ease: 'easeIn' }}
          style={{
            position: 'absolute', width: 6, height: 6, borderRadius: 1,
            background: colors[Math.floor(Math.random() * colors.length)],
            top: 0, left: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎉</div>
    </div>
  )
}

// ── Code snippets ─────────────────────────────────────────

const FADE_BLUR_UP_CODE = `import { motion } from 'framer-motion'

interface FadeBlurUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
}

export function FadeBlurUp({ children, delay = 0, duration = 0.8 }: FadeBlurUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ delay, duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}`

const MAGNETIC_CODE = `import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export function Magnetic({ children, strength = 0.4 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setPos({ x, y })
  }

  return (
    <motion.div
      ref={ref}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  )
}`

const STAGGER_CODE = `import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export function StaggerChildren({ children }: { children: React.ReactNode[] }) {
  return (
    <motion.ul variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {children.map((child, i) => (
        <motion.li key={i} variants={item}>{child}</motion.li>
      ))}
    </motion.ul>
  )
}`

const RIPPLE_CODE = `import { motion } from 'framer-motion'

export function Ripple({ color = 'rgba(103,232,249,0.5)', size = 60, count = 3 }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            width: size, height: size, borderRadius: '50%',
            border: \`1px solid \${color}\`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}`

const CONFETTI_CODE = `import { motion } from 'framer-motion'

const COLORS = ['#67e8f9','#8b5cf6','#ec4899','#f59e0b','#10b981']

export function ConfettiBurst({ count = 30, trigger = true }: { count?: number; trigger?: boolean }) {
  if (!trigger) return null
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: 200, x: (Math.random() - 0.5) * 200, rotate: 360, opacity: 0 }}
          transition={{ duration: 1 + Math.random(), ease: 'easeIn', delay: Math.random() * 0.5 }}
          style={{
            position: 'absolute', width: 8, height: 8, borderRadius: 2,
            background: COLORS[Math.floor(Math.random() * COLORS.length)],
            top: '20%', left: \`\${Math.random() * 80 + 10}%\`,
          }}
        />
      ))}
    </div>
  )
}`

export const ANIMATIONS_REGISTRY: Record<string, any> = {
  'animations/fade-blur-up': {
    name: 'Fade Blur Up',
    description: 'Elements fade in from below with a blur dissolve — premium cinematic reveal.',
    preview: <FadeBlurUpDemo />,
    code: FADE_BLUR_UP_CODE,
    props: [
      { name: 'delay', type: 'number', default: '0', desc: 'Animation start delay in seconds' },
      { name: 'duration', type: 'number', default: '0.8', desc: 'Animation duration in seconds' },
    ],
  },
  'animations/magnetic': {
    name: 'Magnetic',
    description: 'Element follows cursor with magnetic spring physics — premium interactive feel.',
    preview: <MagneticDemo />,
    code: MAGNETIC_CODE,
    props: [
      { name: 'strength', type: 'number', default: '0.4', desc: 'Magnetic pull strength (0-1)' },
    ],
  },
  'animations/scroll-reveal': {
    name: 'Reveal On Scroll',
    description: 'Elements animate in as they enter the viewport — works with framer whileInView.',
    preview: <ScrollRevealDemo />,
    code: `import { motion } from 'framer-motion'

export function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}`,
    props: [
      { name: 'delay', type: 'number', default: '0', desc: 'Delay before triggering animation' },
    ],
  },
  'animations/stagger': {
    name: 'Stagger Children',
    description: 'Parent container staggers child animations one-by-one for a cascade effect.',
    preview: <StaggerDemo />,
    code: STAGGER_CODE,
    props: [
      { name: 'children', type: 'ReactNode[]', default: '—', desc: 'List of children to stagger' },
    ],
  },
  'animations/float': {
    name: 'Float',
    description: 'Smooth infinite floating animation — great for cards, icons, and hero elements.',
    preview: <FloatDemo />,
    code: `import { motion } from 'framer-motion'

export function Float({ children, distance = 16, duration = 3 }: { children: React.ReactNode; distance?: number; duration?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}`,
    props: [
      { name: 'distance', type: 'number', default: '16', desc: 'Float travel distance in px' },
      { name: 'duration', type: 'number', default: '3', desc: 'One full cycle duration in seconds' },
    ],
  },
  'animations/ripple': {
    name: 'Ripple',
    description: 'Expanding ring pulses for live indicators, notifications, and focus states.',
    preview: <RippleDemo />,
    code: RIPPLE_CODE,
    props: [
      { name: 'color', type: 'string', default: 'rgba(103,232,249,0.5)', desc: 'Ring border color' },
      { name: 'size', type: 'number', default: '60', desc: 'Base ring size in px' },
      { name: 'count', type: 'number', default: '3', desc: 'Number of concentric rings' },
    ],
  },
  'animations/elastic': {
    name: 'Elastic Scale',
    description: 'Bouncy elastic scale animation with natural spring overshoot.',
    preview: <ElasticDemo />,
    code: `import { motion } from 'framer-motion'

export function ElasticScale({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.div>
  )
}`,
    props: [],
  },
  'animations/slide-in': {
    name: 'Slide In',
    description: 'Elements slide in from a direction — ideal for list items and panels.',
    preview: <SlideInDemo />,
    code: `import { motion } from 'framer-motion'

type Direction = 'left' | 'right' | 'up' | 'down'

export function SlideIn({ children, from = 'left', delay = 0 }: { children: React.ReactNode; from?: Direction; delay?: number }) {
  const dirMap = { left: { x: -60 }, right: { x: 60 }, up: { y: -60 }, down: { y: 60 } }
  return (
    <motion.div
      initial={{ ...dirMap[from], opacity: 0 }}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}`,
    props: [
      { name: 'from', type: "'left'|'right'|'up'|'down'", default: "'left'", desc: 'Slide direction' },
      { name: 'delay', type: 'number', default: '0', desc: 'Animation delay in seconds' },
    ],
  },
  'animations/rotate-in': {
    name: 'Rotate In',
    description: 'Elements rotate into position from 90 degrees — great for icons and badges.',
    preview: <RotateInDemo />,
    code: `import { motion } from 'framer-motion'

export function RotateIn({ children, degrees = -90, delay = 0 }: { children: React.ReactNode; degrees?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ rotate: degrees, opacity: 0, scale: 0.5 }}
      whileInView={{ rotate: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, type: 'spring', stiffness: 200 }}
    >
      {children}
    </motion.div>
  )
}`,
    props: [
      { name: 'degrees', type: 'number', default: '-90', desc: 'Starting rotation offset' },
      { name: 'delay', type: 'number', default: '0', desc: 'Animation delay in seconds' },
    ],
  },
  'animations/zoom-in': {
    name: 'Zoom In',
    description: 'Elements scale up from zero with a spring bounce on enter.',
    preview: <ZoomInDemo />,
    code: `import { motion } from 'framer-motion'

export function ZoomIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}`,
    props: [
      { name: 'delay', type: 'number', default: '0', desc: 'Animation delay in seconds' },
    ],
  },
  'animations/shake': {
    name: 'Shake',
    description: 'Horizontal shake — perfect for error states, invalid inputs, and alerts.',
    preview: <ShakeDemo />,
    code: `import { motion } from 'framer-motion'

export function Shake({ children, trigger = true }: { children: React.ReactNode; trigger?: boolean }) {
  return (
    <motion.div
      animate={trigger ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : {}}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}`,
    props: [
      { name: 'trigger', type: 'boolean', default: 'true', desc: 'Trigger the shake animation' },
    ],
  },
  'animations/confetti': {
    name: 'Confetti Burst',
    description: 'Celebratory confetti particles burst downwards — for success states and wins.',
    preview: <ConfettiDemo />,
    code: CONFETTI_CODE,
    props: [
      { name: 'count', type: 'number', default: '30', desc: 'Number of confetti particles' },
      { name: 'trigger', type: 'boolean', default: 'true', desc: 'Trigger the burst animation' },
    ],
  },
}
