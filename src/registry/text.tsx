import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

// ── Demos ──────────────────────────────────────────────────

function BlurTextDemo() {
  return (
    <motion.h2
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
      style={{ fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-0.04em' }}
    >Hello World</motion.h2>
  )
}

function SplitTextDemo() {
  const words = 'Move Digital Africa'.split(' ')
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      {words.map((w, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          style={{ fontSize: 32, fontWeight: 800, color: 'white' }}
        >{w}</motion.span>
      ))}
    </div>
  )
}

function GradientTextDemo() {
  return (
    <h2 style={{
      fontSize: 36, fontWeight: 800,
      background: 'linear-gradient(135deg,#67e8f9,#3b82f6,#8b5cf6,#ec4899)',
      backgroundSize: '300% 300%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      animation: 'gradient-flow 3s ease infinite',
    }}>Move Digital</h2>
  )
}

function TypewriterDemo() {
  return (
    <div style={{ fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'var(--mono)' }}>
      <span style={{ borderRight: '3px solid #67e8f9', paddingRight: 4, animation: 'typewriter 2s steps(20) infinite, blink 0.7s step-end infinite', whiteSpace: 'nowrap', overflow: 'hidden', display: 'inline-block', maxWidth: '100%' }}>
        African Fintech...
      </span>
    </div>
  )
}

function CountUpDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
      style={{ fontSize: 56, fontWeight: 900, color: '#67e8f9', letterSpacing: '-0.05em' }}
    >99.7%</motion.div>
  )
}

function ScrambleDemo() {
  return (
    <motion.h2
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ fontSize: 32, fontWeight: 800, color: 'white', fontFamily: 'var(--mono)' }}
    >X8z#Move!Digital</motion.h2>
  )
}

function WordRevealDemo() {
  const words = ['Powering', 'African', 'Finance']
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      {words.map((w, i) => (
        <motion.span key={w}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ delay: i * 0.25, duration: 0.7, repeat: Infinity, repeatDelay: 2.5 }}
          style={{ fontSize: 30, fontWeight: 800, color: 'white' }}
        >{w}</motion.span>
      ))}
    </div>
  )
}

function ShinyTextDemo() {
  return (
    <h2 style={{
      fontSize: 34, fontWeight: 800, color: 'white', position: 'relative',
      background: 'linear-gradient(90deg, white 0%, #67e8f9 40%, white 50%, white 100%)',
      backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      animation: 'shiny 2.5s linear infinite',
    }}>Premium Fintech</h2>
  )
}

function LetterPullUpDemo() {
  const letters = 'SWIFTER'.split('')
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {letters.map((l, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ fontSize: 36, fontWeight: 900, color: '#67e8f9', letterSpacing: '-0.02em' }}
        >{l}</motion.span>
      ))}
    </div>
  )
}

function CircularTextDemo() {
  const text = 'MOVE · DIGITAL · AFRICA · FINTECH · '
  return (
    <div style={{ position: 'relative', width: 180, height: 180 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {text.split('').map((ch, i) => (
          <span key={i} style={{
            position: 'absolute', left: '50%', top: '50%', transformOrigin: '0 90px',
            transform: `rotate(${i * (360 / text.length)}deg)`,
            fontSize: 11, fontWeight: 700, color: 'rgba(103,232,249,0.8)', letterSpacing: 1,
          }}>{ch}</span>
        ))}
      </motion.div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✦</div>
    </div>
  )
}

function HighlightTextDemo() {
  return (
    <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.4 }}>
      Built for{' '}
      <motion.span
        animate={{ backgroundPosition: ['200% center', '0% center'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(103,232,249,0.35) 50%, transparent 100%)',
          backgroundSize: '200% auto',
          padding: '0 6px', borderRadius: 4,
        }}
      >African markets</motion.span>
    </h2>
  )
}

// ── Code Snippets ─────────────────────────────────────────

const BLUR_TEXT_CODE = `import { motion } from 'framer-motion'

interface BlurTextProps {
  text: string
  duration?: number
  delay?: number
  className?: string
}

export function BlurText({ text, duration = 1.2, delay = 0, className }: BlurTextProps) {
  return (
    <motion.span
      className={className}
      initial={{ filter: 'blur(20px)', opacity: 0 }}
      animate={{ filter: 'blur(0px)', opacity: 1 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
    </motion.span>
  )
}`

const SPLIT_TEXT_CODE = `import { motion } from 'framer-motion'

interface SplitTextProps {
  text: string
  by?: 'word' | 'char'
  stagger?: number
  duration?: number
}

export function SplitText({ text, by = 'word', stagger = 0.2, duration = 0.6 }: SplitTextProps) {
  const parts = by === 'word' ? text.split(' ') : text.split('')
  return (
    <span>
      {parts.map((part, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * stagger, duration }}
          style={{ display: 'inline-block', marginRight: by === 'word' ? '0.25em' : 0 }}
        >
          {part}
        </motion.span>
      ))}
    </span>
  )
}`

const GRADIENT_TEXT_CODE = `interface GradientTextProps {
  children: React.ReactNode
  from?: string
  via?: string
  to?: string
  animate?: boolean
}

export function GradientText({ children, from = '#67e8f9', via = '#3b82f6', to = '#8b5cf6', animate = true }: GradientTextProps) {
  return (
    <span style={{
      background: \`linear-gradient(135deg, \${from}, \${via}, \${to})\`,
      backgroundSize: animate ? '300% 300%' : '100%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: animate ? 'gradient-flow 3s ease infinite' : 'none',
    }}>
      {children}
    </span>
  )
}`

const WORD_REVEAL_CODE = `import { motion } from 'framer-motion'

export function WordReveal({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}`

const SHINY_TEXT_CODE = `// Add to CSS:
// @keyframes shiny {
//   0% { background-position: 200% center }
//   100% { background-position: -200% center }
// }

export function ShinyText({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: 'linear-gradient(90deg, white 0%, #67e8f9 40%, white 50%, white 100%)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: 'shiny 2.5s linear infinite',
    }}>
      {children}
    </span>
  )
}`

const LETTER_PULL_UP_CODE = `import { motion } from 'framer-motion'

export function LetterPullUp({ text, stagger = 0.07 }: { text: string; stagger?: number }) {
  return (
    <div style={{ display: 'flex' }}>
      {text.split('').map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * stagger, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  )
}`

const CIRCULAR_TEXT_CODE = `import { motion } from 'framer-motion'

export function CircularText({ text, radius = 90, speed = 10 }: { text: string; radius?: number; speed?: number }) {
  return (
    <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {text.split('').map((ch, i) => (
          <span
            key={i}
            style={{
              position: 'absolute', left: '50%', top: '50%',
              transformOrigin: \`0 \${radius}px\`,
              transform: \`rotate(\${i * (360 / text.length)}deg)\`,
              fontSize: 11, fontWeight: 700,
            }}
          >
            {ch}
          </span>
        ))}
      </motion.div>
    </div>
  )
}`

const HIGHLIGHT_TEXT_CODE = `import { motion } from 'framer-motion'

export function HighlightText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ backgroundPosition: '200% center' }}
      whileInView={{ backgroundPosition: '0% center' }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      viewport={{ once: true }}
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(103,232,249,0.35) 50%, transparent 100%)',
        backgroundSize: '200% auto',
        padding: '0 6px',
        borderRadius: 4,
      }}
    >
      {children}
    </motion.span>
  )
}`

// ── Registry ──────────────────────────────────────────────
export const TEXT_REGISTRY: Record<string, any> = {
  'text/blur-text': {
    name: 'Blur Text',
    description: 'Text that animates in with a cinematic blur effect. Perfect for hero headings.',
    preview: <BlurTextDemo />,
    code: BLUR_TEXT_CODE,
    props: [
      { name: 'text', type: 'string', default: '—', desc: 'The text to display' },
      { name: 'duration', type: 'number', default: '1.2', desc: 'Animation duration in seconds' },
      { name: 'delay', type: 'number', default: '0', desc: 'Animation delay in seconds' },
      { name: 'className', type: 'string', default: 'undefined', desc: 'Additional CSS classes' },
    ],
  },
  'text/split-text': {
    name: 'Split Text',
    description: 'Words or characters animate in individually with stagger timing.',
    preview: <SplitTextDemo />,
    code: SPLIT_TEXT_CODE,
    props: [
      { name: 'text', type: 'string', default: '—', desc: 'Text to split and animate' },
      { name: 'by', type: "'word' | 'char'", default: "'word'", desc: 'Split unit' },
      { name: 'stagger', type: 'number', default: '0.2', desc: 'Delay between each part' },
      { name: 'duration', type: 'number', default: '0.6', desc: 'Animation duration per part' },
    ],
  },
  'text/gradient-text': {
    name: 'Gradient Text',
    description: 'Animated flowing gradient applied to text — great for brand names.',
    preview: <GradientTextDemo />,
    code: GRADIENT_TEXT_CODE,
    props: [
      { name: 'from', type: 'string', default: '#67e8f9', desc: 'Start color' },
      { name: 'via', type: 'string', default: '#3b82f6', desc: 'Mid color' },
      { name: 'to', type: 'string', default: '#8b5cf6', desc: 'End color' },
      { name: 'animate', type: 'boolean', default: 'true', desc: 'Enable flowing animation' },
    ],
  },
  'text/typewriter': {
    name: 'Typewriter',
    description: 'Classic typewriter effect with a blinking cursor. CSS-only, zero dependencies.',
    preview: <TypewriterDemo />,
    code: `// CSS-only Typewriter
// @keyframes typewriter { from { max-width: 0 } to { max-width: 100% } }
// @keyframes blink { 50% { border-color: transparent } }

export function Typewriter({ text }: { text: string }) {
  return (
    <span style={{
      borderRight: '3px solid #67e8f9',
      paddingRight: 4,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'inline-block',
      animation: 'typewriter 2s steps(20) forwards, blink 0.7s step-end infinite',
    }}>
      {text}
    </span>
  )
}`,
    props: [
      { name: 'text', type: 'string', default: '—', desc: 'Text to type out' },
    ],
  },
  'text/count-up': {
    name: 'Count Up',
    description: 'Numbers animate up from 0 to target when entering the viewport.',
    preview: <CountUpDemo />,
    code: `import { useState, useEffect, useRef } from 'react'

export function CountUp({ to, duration = 2, suffix = '' }: { to: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const start = Date.now()
      const tick = () => {
        const progress = Math.min((Date.now() - start) / (duration * 1000), 1)
        setCount(Math.floor(progress * to))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}`,
    props: [
      { name: 'to', type: 'number', default: '—', desc: 'Target number to count up to' },
      { name: 'duration', type: 'number', default: '2', desc: 'Animation duration in seconds' },
      { name: 'suffix', type: 'string', default: "''", desc: 'Text appended after number (e.g. %)' },
    ],
  },
  'text/scramble': {
    name: 'Scramble Text',
    description: 'Text scrambles with random characters before resolving to final string.',
    preview: <ScrambleDemo />,
    code: `import { useState, useEffect } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#@!$'

export function ScrambleText({ text, trigger = true }: { text: string; trigger?: boolean }) {
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (!trigger) return
    let iteration = 0
    const interval = setInterval(() => {
      setDisplay(text.split('').map((ch, i) =>
        i < iteration ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join(''))
      iteration += 0.5
      if (iteration >= text.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [text, trigger])

  return <span>{display}</span>
}`,
    props: [
      { name: 'text', type: 'string', default: '—', desc: 'Final resolved text' },
      { name: 'trigger', type: 'boolean', default: 'true', desc: 'Trigger scramble animation' },
    ],
  },
  'text/word-reveal': {
    name: 'Word Reveal',
    description: 'Words fade and blur in sequentially — perfect for sub-headings on scroll.',
    preview: <WordRevealDemo />,
    code: WORD_REVEAL_CODE,
    props: [
      { name: 'text', type: 'string', default: '—', desc: 'Space-separated text to reveal' },
    ],
  },
  'text/shiny-text': {
    name: 'Shiny Text',
    description: 'A light shimmer sweeps across text on loop — metallic premium feel.',
    preview: <ShinyTextDemo />,
    code: SHINY_TEXT_CODE,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', desc: 'Text content' },
    ],
  },
  'text/letter-pull-up': {
    name: 'Letter Pull Up',
    description: 'Each letter rises into place independently for dramatic heading reveals.',
    preview: <LetterPullUpDemo />,
    code: LETTER_PULL_UP_CODE,
    props: [
      { name: 'text', type: 'string', default: '—', desc: 'Text to animate letter by letter' },
      { name: 'stagger', type: 'number', default: '0.07', desc: 'Delay between letters (seconds)' },
    ],
  },
  'text/circular-text': {
    name: 'Circular Text',
    description: 'Text arranged in a circle that rotates continuously — great for badges and logos.',
    preview: <CircularTextDemo />,
    code: CIRCULAR_TEXT_CODE,
    props: [
      { name: 'text', type: 'string', default: '—', desc: 'Text to display in circle' },
      { name: 'radius', type: 'number', default: '90', desc: 'Circle radius in px' },
      { name: 'speed', type: 'number', default: '10', desc: 'Rotation duration in seconds' },
    ],
  },
  'text/highlight-text': {
    name: 'Highlight Text',
    description: 'A marker-style highlight sweeps across text as it enters the viewport.',
    preview: <HighlightTextDemo />,
    code: HIGHLIGHT_TEXT_CODE,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', desc: 'Text content to highlight' },
    ],
  },
}
