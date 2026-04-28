import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

// ── Demos ──────────────────────────────────────────────────

function AuroraDemo() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0,
      background: 'linear-gradient(135deg,rgba(59,130,246,0.4),rgba(139,92,246,0.35),rgba(236,72,153,0.3))',
      backgroundSize: '400% 400%', animation: 'aurora 4s ease infinite' }} />
  )
}

function ParticlesDemo() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i}
          animate={{ y: [0, -60, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          style={{
            position: 'absolute', borderRadius: '50%',
            width: 3 + Math.random() * 4, height: 3 + Math.random() * 4,
            background: ['#67e8f9','#3b82f6','#8b5cf6','#ec4899'][Math.floor(Math.random()*4)],
            left: `${Math.random() * 90}%`, bottom: `${Math.random() * 40}%`,
          }} />
      ))}
    </div>
  )
}

function GridDemo() {
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,179,237,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.08) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
  )
}

function GalaxyDemo() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.15) 0%, transparent 70%)' }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%', background: 'white',
          width: 1 + Math.random() * 2, height: 1 + Math.random() * 2,
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          opacity: 0.3 + Math.random() * 0.7,
        }} />
      ))}
    </div>
  )
}

function DotsDemo() {
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(99,179,237,0.25) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
  )
}

function MeshGradientDemo() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(at 20% 20%, rgba(59,130,246,0.4) 0px, transparent 50%),
                   radial-gradient(at 80% 10%, rgba(139,92,246,0.4) 0px, transparent 50%),
                   radial-gradient(at 50% 80%, rgba(236,72,153,0.3) 0px, transparent 50%)`,
    }} />
  )
}

function BeamsDemo() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i}
          animate={{ opacity: [0, 0.4, 0], scaleY: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
          style={{
            position: 'absolute', width: 2, background: 'linear-gradient(to bottom, transparent, #67e8f9, transparent)',
            height: '100%', top: 0, left: `${20 + i * 20}%`, transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  )
}

function NoiseDemo() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(30,40,80,0.9), rgba(20,10,40,0.95))',
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />
    </div>
  )
}

function WavesDemo() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i}
          animate={{ x: ['-50%', '0%', '-50%'] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: `${10 + i * 12}%`, left: 0, width: '200%', height: 60,
            background: `rgba(99,179,237,${0.06 + i * 0.04})`,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  )
}

function ShootingStarsDemo() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i}
          animate={{ x: ['100%', '-100%'], y: ['0%', '60%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: `${10 + i * 12}%`,
            right: 0,
            width: 80 + i * 20, height: 1,
            background: 'linear-gradient(to left, #67e8f9, transparent)',
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  )
}

// ── Code snippets ─────────────────────────────────────────

const AURORA_CODE = `export function AuroraBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.2))',
        backgroundSize: '400% 400%',
        animation: 'aurora 6s ease infinite',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}

// Add to CSS:
// @keyframes aurora {
//   0%, 100% { background-position: 0% 50% }
//   50% { background-position: 100% 50% }
// }`

const PARTICLES_CODE = `import { motion } from 'framer-motion'

export function Particles({ count = 30, colors = ['#67e8f9','#3b82f6','#8b5cf6','#ec4899'] }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -80, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          style={{
            position: 'absolute', borderRadius: '50%',
            width: 2 + Math.random() * 4, height: 2 + Math.random() * 4,
            background: colors[Math.floor(Math.random() * colors.length)],
            left: \`\${Math.random() * 95}%\`,
            bottom: \`\${Math.random() * 50}%\`,
          }}
        />
      ))}
    </div>
  )
}`

const MESH_CODE = `export function MeshGradient({ colors }: { colors?: string[] }) {
  const c = colors ?? ['rgba(59,130,246,0.4)', 'rgba(139,92,246,0.4)', 'rgba(236,72,153,0.3)']
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: \`
        radial-gradient(at 20% 20%, \${c[0]} 0px, transparent 50%),
        radial-gradient(at 80% 10%, \${c[1]} 0px, transparent 50%),
        radial-gradient(at 50% 80%, \${c[2]} 0px, transparent 50%)
      \`,
    }} />
  )
}`

const BEAMS_CODE = `import { motion } from 'framer-motion'

export function AnimatedBeams({ count = 4, color = '#67e8f9' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
          style={{
            position: 'absolute', width: 2,
            background: \`linear-gradient(to bottom, transparent, \${color}, transparent)\`,
            height: '100%', top: 0, left: \`\${20 + i * 20}%\`,
          }}
        />
      ))}
    </div>
  )
}`

const SHOOTING_STARS_CODE = `import { motion } from 'framer-motion'

export function ShootingStars({ count = 6, color = '#67e8f9' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ x: ['100%', '-200%'], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.8, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: \`\${10 + i * 13}%\`,
            right: 0, width: 80, height: 1,
            background: \`linear-gradient(to left, \${color}, transparent)\`,
          }}
        />
      ))}
    </div>
  )
}`

export const BACKGROUNDS_REGISTRY: Record<string, any> = {
  'backgrounds/aurora': {
    name: 'Aurora',
    description: 'Animated gradient aurora effect for full-bleed backgrounds — soft and cinematic.',
    preview: <AuroraDemo />,
    code: AURORA_CODE,
    props: [],
  },
  'backgrounds/particles': {
    name: 'Particles',
    description: 'Floating particles that rise and fade — perfect for dark UI hero sections.',
    preview: <ParticlesDemo />,
    code: PARTICLES_CODE,
    props: [
      { name: 'count', type: 'number', default: '30', desc: 'Number of particles' },
      { name: 'colors', type: 'string[]', default: "['#67e8f9',...]", desc: 'Particle color palette' },
    ],
  },
  'backgrounds/grid': {
    name: 'Grid Pattern',
    description: 'Subtle CSS grid lines — technical and fintech-appropriate aesthetic.',
    preview: <GridDemo />,
    code: `// Pure CSS grid pattern
export function GridBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'linear-gradient(rgba(99,179,237,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.08) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }} />
  )
}`,
    props: [],
  },
  'backgrounds/galaxy': {
    name: 'Galaxy',
    description: 'Star-field background with radial glow — cinematic depth for hero sections.',
    preview: <GalaxyDemo />,
    code: `export function GalaxyBackground({ starCount = 80 }: { starCount?: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)' }}>
      {Array.from({ length: starCount }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%', background: 'white',
          width: 1 + Math.random() * 2, height: 1 + Math.random() * 2,
          left: \`\${Math.random() * 100}%\`,
          top: \`\${Math.random() * 100}%\`,
          opacity: 0.3 + Math.random() * 0.7,
        }} />
      ))}
    </div>
  )
}`,
    props: [
      { name: 'starCount', type: 'number', default: '80', desc: 'Number of star dots to render' },
    ],
  },
  'backgrounds/dots': {
    name: 'Dot Matrix',
    description: 'Radial dot pattern background using CSS background-image — zero JS.',
    preview: <DotsDemo />,
    code: `export function DotMatrix({ size = 24, opacity = 0.25, color = 'rgba(99,179,237,1)' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: \`radial-gradient(\${color} 1px, transparent 1px)\`,
      backgroundSize: \`\${size}px \${size}px\`,
      opacity,
    }} />
  )
}`,
    props: [
      { name: 'size', type: 'number', default: '24', desc: 'Grid cell size in px' },
      { name: 'opacity', type: 'number', default: '0.25', desc: 'Overall opacity' },
      { name: 'color', type: 'string', default: 'rgba(99,179,237,1)', desc: 'Dot color' },
    ],
  },
  'backgrounds/mesh': {
    name: 'Mesh Gradient',
    description: 'Soft multi-point radial gradients layered to create a blurred mesh effect.',
    preview: <MeshGradientDemo />,
    code: MESH_CODE,
    props: [
      { name: 'colors', type: 'string[]', default: 'blue/violet/pink', desc: 'Array of 3 rgba gradient colors' },
    ],
  },
  'backgrounds/beams': {
    name: 'Animated Beams',
    description: 'Vertical light beams that pulse in and out — subtle energy effect.',
    preview: <BeamsDemo />,
    code: BEAMS_CODE,
    props: [
      { name: 'count', type: 'number', default: '4', desc: 'Number of beams' },
      { name: 'color', type: 'string', default: '#67e8f9', desc: 'Beam color' },
    ],
  },
  'backgrounds/noise': {
    name: 'Noise Texture',
    description: 'SVG fractal noise overlay adds film grain depth to flat gradient backgrounds.',
    preview: <NoiseDemo />,
    code: `// SVG noise filter as background overlay
export function NoiseTexture({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, opacity,
      backgroundImage: \`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")\`,
      backgroundSize: '200px 200px',
      pointerEvents: 'none',
    }} />
  )
}`,
    props: [
      { name: 'opacity', type: 'number', default: '0.08', desc: 'Noise overlay opacity' },
    ],
  },
  'backgrounds/waves': {
    name: 'Wave Lines',
    description: 'Animated wave bands that sway horizontally — fluid and organic.',
    preview: <WavesDemo />,
    code: `import { motion } from 'framer-motion'

export function Waves({ count = 3, color = 'rgba(99,179,237,0.08)' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ x: ['-50%', '0%', '-50%'] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: '200%', height: 60,
            bottom: \`\${10 + i * 12}%\`, left: 0,
            background: color, borderRadius: '50%',
          }}
        />
      ))}
    </div>
  )
}`,
    props: [
      { name: 'count', type: 'number', default: '3', desc: 'Number of wave bands' },
      { name: 'color', type: 'string', default: 'rgba(99,179,237,0.08)', desc: 'Wave color' },
    ],
  },
  'backgrounds/shooting-stars': {
    name: 'Shooting Stars',
    description: 'Light trails streak across the background diagonally on a loop.',
    preview: <ShootingStarsDemo />,
    code: SHOOTING_STARS_CODE,
    props: [
      { name: 'count', type: 'number', default: '6', desc: 'Number of shooting stars' },
      { name: 'color', type: 'string', default: '#67e8f9', desc: 'Star trail color' },
    ],
  },
}
