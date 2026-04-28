import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

function BadgeDemo() {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
      {[['Live','#10b981'],['New','#3b82f6'],['Pro','#8b5cf6'],['Hot','#ec4899'],['Beta','#f59e0b']].map(([t,c]) => (
        <motion.span key={t} whileHover={{ scale: 1.1 }}
          style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: `${c}18`, color: c, border: `1px solid ${c}40` }}>
          {t}
        </motion.span>
      ))}
    </div>
  )
}

function ToastDemo() {
  const [show, setShow] = useState(true)
  useEffect(() => { const t = setInterval(() => setShow(s => !s), 2500); return () => clearInterval(t) }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#6ee7b7', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          ✓ Transaction complete!
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TooltipDemo() {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', fontFamily: 'var(--font)' }}>
        Hover me
      </button>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            style={{ position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, padding: '6px 12px', fontSize: 12, color: 'white', whiteSpace: 'nowrap' }}>
            Premium tooltip ✦
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
        Open Modal
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '32px', minWidth: 300, color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>✦</div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Modal Dialog</div>
              <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 20 }}>Click outside to close</div>
              <button onClick={() => setOpen(false)} style={{ padding: '9px 22px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer' }}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function TabsDemo() {
  const [tab, setTab] = useState(0)
  const tabs = ['Overview', 'Analytics', 'Settings']
  return (
    <div style={{ width: 280 }}>
      <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4, marginBottom: 16 }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', background: tab === i ? 'rgba(59,130,246,0.3)' : 'transparent', color: tab === i ? '#93c5fd' : 'var(--text-muted)' }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '8px 4px' }}>
        Showing: <strong style={{ color: 'white' }}>{tabs[tab]}</strong>
      </div>
    </div>
  )
}

function AccordionDemo() {
  const [open, setOpen] = useState<number | null>(0)
  const items = [['What is Move Digital?','Africa\'s premier fintech platform.'],['Is it open source?','The design library is open source.'],['How do I get started?','Copy any component and paste it into your project.']]
  return (
    <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map(([q, a], i) => (
        <div key={i} style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.03)', border: 'none', color: 'white', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
            {q}
            <motion.span animate={{ rotate: open === i ? 180 : 0 }} style={{ color: '#67e8f9' }}>▼</motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function ToggleDemo() {
  const [on, setOn] = useState(true)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
      {['Dark Mode', 'Notifications', 'Auto-save'].map((label, i) => {
        const [active, setActive] = useState(i === 0)
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div onClick={() => setActive(a => !a)}
              style={{ width: 44, height: 24, borderRadius: 99, cursor: 'pointer', position: 'relative', background: active ? '#3b82f6' : 'rgba(255,255,255,0.1)', transition: 'background 0.25s' }}>
              <motion.div animate={{ x: active ? 22 : 2 }}
                style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' }} />
            </div>
            <span style={{ fontSize: 13, color: 'white' }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

function ProgressDemo() {
  return (
    <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[['KYC Completion', 78, '#3b82f6'],['Payment Rail', 92, '#10b981'],['API Uptime', 99.7, '#8b5cf6']].map(([label, val, color]) => (
        <div key={label as string}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label as string}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: color as string }}>{val}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 99, background: color as string }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function SkeletonDemo() {
  return (
    <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}
        style={{ height: 140, borderRadius: 12, background: 'rgba(255,255,255,0.07)' }} />
      <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
        style={{ height: 14, borderRadius: 99, width: '70%', background: 'rgba(255,255,255,0.07)' }} />
      <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        style={{ height: 12, borderRadius: 99, width: '50%', background: 'rgba(255,255,255,0.05)' }} />
    </div>
  )
}

function MarqueeDemo() {
  const items = ['Swifter', 'PayGuard', 'eKYC Africa', 'SmartSendr', 'SwifterCRM', 'Move Digital']
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div animate={{ x: [0, -800] }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{item}</span>
        ))}
      </motion.div>
    </div>
  )
}

function DockDemo() {
  const icons = ['🏠', '📊', '💸', '🔐', '⚙️']
  return (
    <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.09)' }}>
      {icons.map((icon, i) => (
        <motion.div key={i} whileHover={{ scale: 1.4, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer' }}>
          {icon}
        </motion.div>
      ))}
    </div>
  )
}

function CommandMenuDemo() {
  return (
    <div style={{ width: 300, background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>⌘</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Search commands…</span>
      </div>
      {['New Transaction', 'View Analytics', 'KYC Verify', 'Settings'].map((item, i) => (
        <div key={item} style={{ padding: '10px 16px', fontSize: 13, color: i === 0 ? 'white' : 'var(--text-muted)', background: i === 0 ? 'rgba(59,130,246,0.15)' : 'transparent', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <span style={{ fontSize: 11, opacity: 0.4 }}>{'→'}</span>
          {item}
        </div>
      ))}
    </div>
  )
}

function AvatarStackDemo() {
  const avatars = ['M', 'A', 'J', 'K', '+4']
  const colors = ['#3b82f6','#8b5cf6','#ec4899','#10b981','rgba(255,255,255,0.1)']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex' }}>
        {avatars.map((a, i) => (
          <motion.div key={i} whileHover={{ y: -4, zIndex: 10 }}
            style={{ width: 38, height: 38, borderRadius: '50%', background: colors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', border: '2px solid #0d1120', marginLeft: i > 0 ? -10 : 0, position: 'relative', cursor: 'pointer' }}>
            {a}
          </motion.div>
        ))}
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Team active</span>
    </div>
  )
}

function TimelineDemo() {
  const events = [['KYC Submitted','2m ago','#10b981'],['Payment Sent','14m ago','#3b82f6'],['Account Created','1h ago','#8b5cf6']]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 20 }}>
      <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 1, background: 'rgba(255,255,255,0.08)' }} />
      {events.map(([label, time, color], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 0', position: 'relative' }}>
          <div style={{ position: 'absolute', left: -13, width: 10, height: 10, borderRadius: '50%', background: color, top: 12, border: '2px solid #0d1120' }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{time}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function InfiniteScrollDemo() {
  const items = ['Card A', 'Card B', 'Card C', 'Card D', 'Card E']
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        animate={{ x: [0, -600] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: 12 }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} style={{ minWidth: 100, height: 60, borderRadius: 10, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#93c5fd', flexShrink: 0 }}>
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export const UI_REGISTRY: Record<string, any> = {
  'ui/badge': { name: 'Premium Badge', description: 'Color-coded status badges — Live, New, Pro, Hot, Beta variants.', preview: <BadgeDemo />, code: `export function Badge({ label, color = '#3b82f6' }: { label: string; color?: string }) {\n  return (\n    <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: \`\${color}18\`, color, border: \`1px solid \${color}40\` }}>\n      {label}\n    </span>\n  )\n}`, props: [{ name: 'label', type: 'string', default: '—', desc: 'Badge text' }, { name: 'color', type: 'string', default: '#3b82f6', desc: 'Badge accent color' }] },
  'ui/toast': { name: 'Toast', description: 'Animated notification toasts that slide in and out from the bottom.', preview: <ToastDemo />, code: `import { motion, AnimatePresence } from 'framer-motion'\n\nexport function Toast({ message, type = 'success', visible }: { message: string; type?: string; visible: boolean }) {\n  return (\n    <AnimatePresence>\n      {visible && (\n        <motion.div\n          initial={{ opacity: 0, y: 20 }}\n          animate={{ opacity: 1, y: 0 }}\n          exit={{ opacity: 0, y: 20 }}\n          style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#6ee7b7', fontWeight: 600 }}\n        >\n          {message}\n        </motion.div>\n      )}\n    </AnimatePresence>\n  )\n}`, props: [{ name: 'message', type: 'string', default: '—', desc: 'Toast message text' }, { name: 'visible', type: 'boolean', default: 'false', desc: 'Controls visibility' }] },
  'ui/tooltip': { name: 'Tooltip', description: 'Hover tooltip with smooth fade-in animation and auto-positioning.', preview: <TooltipDemo />, code: `// Wrap target element, tooltip appears above on hover`, props: [] },
  'ui/modal': { name: 'Modal', description: 'Accessible modal dialog with backdrop blur and spring scale entry.', preview: <ModalDemo />, code: `// AnimatePresence + motion.div backdrop + motion.div panel`, props: [] },
  'ui/tabs': { name: 'Tabs', description: 'Pill-style tab switcher with active highlight — no library needed.', preview: <TabsDemo />, code: `// Map tab labels, track active index with useState, apply active styles`, props: [] },
  'ui/accordion': { name: 'Accordion', description: 'Animated accordion with height transition — perfect for FAQs.', preview: <AccordionDemo />, code: `// AnimatePresence + motion.div height 0 → auto for smooth expand`, props: [] },
  'ui/toggle': { name: 'Toggle', description: 'Smooth iOS-style toggle switch with spring-animated thumb.', preview: <ToggleDemo />, code: `// useState bool + motion.div x: 2/22 for thumb position`, props: [] },
  'ui/progress': { name: 'Progress Bar', description: 'Animated progress bars — great for metrics, onboarding, and KPIs.', preview: <ProgressDemo />, code: `import { motion } from 'framer-motion'\n\nexport function ProgressBar({ value, color = '#3b82f6' }: { value: number; color?: string }) {\n  return (\n    <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>\n      <motion.div\n        initial={{ width: 0 }}\n        animate={{ width: \`\${value}%\` }}\n        transition={{ duration: 1.2, ease: 'easeOut' }}\n        style={{ height: '100%', borderRadius: 99, background: color }}\n      />\n    </div>\n  )\n}`, props: [{ name: 'value', type: 'number', default: '0', desc: 'Progress percentage 0–100' }, { name: 'color', type: 'string', default: '#3b82f6', desc: 'Bar fill color' }] },
  'ui/skeleton': { name: 'Skeleton', description: 'Pulsing skeleton loaders for content placeholders while data loads.', preview: <SkeletonDemo />, code: `import { motion } from 'framer-motion'\n\nexport function Skeleton({ width = '100%', height = 16, radius = 8 }: { width?: string | number; height?: number; radius?: number }) {\n  return (\n    <motion.div\n      animate={{ opacity: [0.4, 0.8, 0.4] }}\n      transition={{ duration: 1.5, repeat: Infinity }}\n      style={{ width, height, borderRadius: radius, background: 'rgba(255,255,255,0.07)' }}\n    />\n  )\n}`, props: [{ name: 'width', type: 'string|number', default: "'100%'", desc: 'Skeleton width' }, { name: 'height', type: 'number', default: '16', desc: 'Skeleton height in px' }] },
  'ui/marquee': { name: 'Marquee', description: 'Infinite horizontally scrolling ticker — perfect for logo rows and announcements.', preview: <MarqueeDemo />, code: `import { motion } from 'framer-motion'\n\nexport function Marquee({ items, speed = 12 }: { items: string[]; speed?: number }) {\n  return (\n    <div style={{ overflow: 'hidden' }}>\n      <motion.div\n        animate={{ x: [0, '-50%'] }}\n        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}\n        style={{ display: 'flex', gap: 32, whiteSpace: 'nowrap' }}\n      >\n        {[...items, ...items].map((item, i) => <span key={i}>{item}</span>)}\n      </motion.div>\n    </div>\n  )\n}`, props: [{ name: 'items', type: 'string[]', default: '—', desc: 'Items to scroll' }, { name: 'speed', type: 'number', default: '12', desc: 'Scroll cycle duration in seconds' }] },
  'ui/dock': { name: 'Dock', description: 'macOS-style magnifying dock — icons scale up on hover with spring physics.', preview: <DockDemo />, code: `import { motion } from 'framer-motion'\n\nexport function Dock({ items }: { items: { icon: React.ReactNode; label: string }[] }) {\n  return (\n    <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '10px 14px' }}>\n      {items.map((item, i) => (\n        <motion.div key={i} whileHover={{ scale: 1.4, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}\n          style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n          {item.icon}\n        </motion.div>\n      ))}\n    </div>\n  )\n}`, props: [{ name: 'items', type: '{ icon: ReactNode; label: string }[]', default: '—', desc: 'Dock items array' }] },
  'ui/command-menu': { name: 'Command Menu', description: 'Spotlight-style command palette — triggered by ⌘K for power users.', preview: <CommandMenuDemo />, code: `// Listen for Cmd+K, show modal overlay with search input + filtered results`, props: [] },
  'ui/avatar-stack': { name: 'Avatar Stack', description: 'Overlapping avatar stack with hover lift — shows team members or collaborators.', preview: <AvatarStackDemo />, code: `// Map users, each avatar has marginLeft: -10 and a hover y: -4 lift`, props: [] },
  'ui/timeline': { name: 'Timeline', description: 'Vertical event timeline with color-coded dots and timestamps.', preview: <TimelineDemo />, code: `// Absolutely-positioned vertical line + dots per event entry`, props: [] },
  'ui/infinite-scroll': { name: 'Infinite Scroll', description: 'Horizontally looping content strip — logo walls, stats, feature pills.', preview: <InfiniteScrollDemo />, code: `// Duplicate items array, animate x from 0 to -50% on infinite loop`, props: [] },
}
