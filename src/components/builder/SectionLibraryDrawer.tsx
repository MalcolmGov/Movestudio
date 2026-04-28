import { motion } from 'framer-motion'
import { SectionType } from '../../types'

export const SECTION_LIBRARY: { type: SectionType; icon: string; label: string; desc: string; color: string; category: string }[] = [
  // ── Layout & Identity
  { type: 'navbar',      icon: '🧭',  label: 'Navbar',         desc: 'Sticky nav with logo, links & CTA button',     color: '#6366f1', category: 'Layout' },
  { type: 'hero',        icon: '🦸',  label: 'Hero',           desc: 'Full-screen header with headline & CTA',       color: '#3b82f6', category: 'Layout' },
  { type: 'logobar',      icon: '🏢',  label: 'Logo Bar',       desc: 'Client / partner logos strip',                 color: '#64748b', category: 'Layout' },
  { type: 'footer',       icon: '🔗',  label: 'Footer',         desc: 'Multi-column footer with links',               color: '#94a3b8', category: 'Layout' },
  // ── Content
  { type: 'features',     icon: '✨',  label: 'Features',       desc: '6-card feature grid with icons',               color: '#8b5cf6', category: 'Content' },
  { type: 'services',     icon: '🛠',  label: 'Services',       desc: 'Service cards with pricing indicators',        color: '#a855f7', category: 'Content' },
  { type: 'process',      icon: '⚙️',  label: 'Process',        desc: 'Numbered how-it-works steps',                  color: '#6366f1', category: 'Content' },
  { type: 'stats',        icon: '📊',  label: 'Stats',          desc: 'Animated metrics and numbers',                 color: '#06b6d4', category: 'Content' },
  { type: 'gallery',      icon: '🖼',  label: 'Gallery',        desc: 'Image / portfolio grid',                       color: '#ec4899', category: 'Content' },
  { type: 'team',         icon: '👥',  label: 'Team',           desc: 'Team member profile cards',                    color: '#f43f5e', category: 'Content' },
  { type: 'video',        icon: '🎬',  label: 'Video',          desc: 'Video embed / explainer section',              color: '#7c3aed', category: 'Content' },
  { type: 'timeline',     icon: '📅',  label: 'Timeline',       desc: 'Milestone / journey strip',                    color: '#0ea5e9', category: 'Content' },
  { type: 'blog',         icon: '📝',  label: 'Blog',           desc: 'Latest blog post preview cards',               color: '#f97316', category: 'Content' },
  // ── Social Proof
  { type: 'testimonials', icon: '💬',  label: 'Testimonials',   desc: 'Customer quote cards',                         color: '#10b981', category: 'Social Proof' },
  { type: 'faq',          icon: '❓',  label: 'FAQ',            desc: 'Accordion Q&A section',                        color: '#6366f1', category: 'Social Proof' },
  { type: 'comparison',   icon: '⚖️',  label: 'Comparison',     desc: 'Feature comparison table',                     color: '#0ea5e9', category: 'Social Proof' },
  // ── Commerce
  { type: 'pricing',      icon: '💳',  label: 'Pricing',        desc: '3-tier pricing cards',                         color: '#f59e0b', category: 'Commerce' },
  { type: 'booking',      icon: '📆',  label: 'Booking',        desc: 'Appointment / reservation form',               color: '#14b8a6', category: 'Commerce' },
  // ── Conversion
  { type: 'cta',          icon: '🎯',  label: 'CTA',            desc: 'Centred conversion section',                   color: '#22c55e', category: 'Conversion' },
  { type: 'ctabanner',    icon: '📢',  label: 'CTA Banner',     desc: 'Full-width announcement banner',               color: '#ef4444', category: 'Conversion' },
  { type: 'newsletter',   icon: '📬',  label: 'Newsletter',     desc: 'Email signup with GDPR note',                  color: '#f97316', category: 'Conversion' },
  // ── Contact
  { type: 'contact',      icon: '✉️',  label: 'Contact',        desc: 'Contact form with address details',            color: '#14b8a6', category: 'Contact' },
  { type: 'map',          icon: '📍',  label: 'Map & Hours',    desc: 'Location, hours & contact info',               color: '#22d3ee', category: 'Contact' },
]

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (type: SectionType) => void
  primaryColor: string
}

export default function SectionLibraryDrawer({ open, onClose, onAdd, primaryColor }: Props) {
  const categories = [...new Set(SECTION_LIBRARY.map(s => s.category))]

  return (
    <>
      {open && (
        <div onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }} />
      )}

      <motion.div
        animate={{ x: open ? 0 : -340 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        style={{ position: 'fixed', top: 0, left: 0, width: 320, height: '100vh', background: '#080b14', borderRight: '1px solid rgba(255,255,255,0.08)', zIndex: 99, overflowY: 'auto', boxShadow: '8px 0 40px rgba(0,0,0,0.5)' }}>

        <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#080b14', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Add Section</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{SECTION_LIBRARY.length} sections across {categories.length} categories</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: '12px 12px 32px' }}>
          {categories.map(cat => (
            <div key={cat}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '14px 4px 6px' }}>{cat}</div>
              {SECTION_LIBRARY.filter(s => s.category === cat).map((sec, i) => (
                <motion.button key={sec.type}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: open ? 1 : 0, x: open ? 0 : -12 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { onAdd(sec.type); onClose() }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left', marginBottom: 4, transition: 'background 0.15s' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${sec.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{sec.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 1 }}>{sec.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sec.desc}</div>
                  </div>
                  <span style={{ fontSize: 18, color: primaryColor, opacity: 0.7 }}>+</span>
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
}
