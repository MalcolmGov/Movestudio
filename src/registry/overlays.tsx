import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

function AlertDialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <motion.button whileHover={{ scale: 1.04 }} onClick={() => setOpen(true)}
        style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>
        Delete Account
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, maxWidth: 380, width: '90%' }}>
              <div style={{ fontSize: 20, marginBottom: 8, color: '#f87171' }}>⚠ Are you sure?</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>This action cannot be undone. All your data will be permanently removed from our servers.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setOpen(false)} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13 }}>Cancel</button>
                <button onClick={() => setOpen(false)} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13 }}>Yes, delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function DrawerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)} style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
        Open Drawer
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 320, background: '#111827', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 999, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>Transaction Details</span>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18 }}>✕</button>
              </div>
              {[['Amount', 'R 4,250.00'], ['Status', '✓ Complete'], ['Reference', 'TXN-8834421'], ['Date', '19 Apr 2026']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{k}</span>
                  <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function PopoverDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer' }}>
        Filter ⚙
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 48 }} onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -6 }}
              style={{ position: 'absolute', top: '110%', left: 0, background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, minWidth: 220, zIndex: 49, boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Filters</div>
              {['Completed', 'Pending', 'Failed'].map(s => (
                <label key={s} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', cursor: 'pointer', fontSize: 13, color: 'white' }}>
                  <input type="checkbox" defaultChecked={s === 'Completed'} style={{ accentColor: '#3b82f6' }} /> {s}
                </label>
              ))}
              <button style={{ marginTop: 12, width: '100%', padding: '8px', borderRadius: 7, border: 'none', background: 'rgba(59,130,246,0.2)', color: '#93c5fd', fontFamily: 'var(--font)', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>Apply</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function HoverCardDemo() {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <span style={{ color: '#67e8f9', fontWeight: 700, fontSize: 15, cursor: 'pointer', borderBottom: '1px dashed rgba(103,232,249,0.4)' }}>@swifter</span>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
            style={{ position: 'absolute', top: '130%', left: '50%', transform: 'translateX(-50%)', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 18px', minWidth: 220, zIndex: 50, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💸</div>
              <div>
                <div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>Swifter Wallet</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@swifter · Move Digital</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>Africa's fastest digital wallet. Instant payments across 5+ rails.</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              {[['12', 'Integrations'], ['5+', 'Markets']].map(([v, l]) => (
                <div key={l}><div style={{ fontWeight: 700, color: 'white', fontSize: 14 }}>{v}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l}</div></div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AlertDemo() {
  const variants = [
    { type: 'info', icon: 'ℹ', label: 'Info', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', msg: 'Your KYC is under review.' },
    { type: 'success', icon: '✓', label: 'Success', color: '#10b981', bg: 'rgba(16,185,129,0.1)', msg: 'Transaction completed.' },
    { type: 'warning', icon: '⚠', label: 'Warning', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', msg: 'Unusual activity detected.' },
    { type: 'error', icon: '✕', label: 'Error', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', msg: 'Payment failed. Retry.' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 280 }}>
      {variants.map(v => (
        <div key={v.type} style={{ padding: '10px 14px', borderRadius: 10, background: v.bg, border: `1px solid ${v.color}30`, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ color: v.color, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{v.icon}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: v.color, marginBottom: 2 }}>{v.label}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{v.msg}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const OVERLAYS_REGISTRY: Record<string, any> = {
  'overlays/alert-dialog': { name: 'Alert Dialog', description: 'Destructive action confirmation dialog with blur backdrop — built on Radix AlertDialog for full a11y.', preview: <AlertDialogDemo />, code: `// Install: npm install radix-ui\nimport * as AlertDialog from '@radix-ui/react-alert-dialog'\n\nexport function ConfirmDialog({ trigger, title, description, onConfirm }: { trigger: React.ReactNode; title: string; description: string; onConfirm: () => void }) {\n  return (\n    <AlertDialog.Root>\n      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>\n      <AlertDialog.Portal>\n        <AlertDialog.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />\n        <AlertDialog.Content style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, maxWidth: 380 }}>\n          <AlertDialog.Title style={{ fontWeight: 700, marginBottom: 8 }}>{title}</AlertDialog.Title>\n          <AlertDialog.Description style={{ color: 'var(--text-muted)', marginBottom: 24 }}>{description}</AlertDialog.Description>\n          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>\n            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>\n            <AlertDialog.Action onClick={onConfirm}>Confirm</AlertDialog.Action>\n          </div>\n        </AlertDialog.Content>\n      </AlertDialog.Portal>\n    </AlertDialog.Root>\n  )\n}`, props: [{ name: 'title', type: 'string', default: '—', desc: 'Dialog heading' }, { name: 'description', type: 'string', default: '—', desc: 'Dialog body text' }, { name: 'onConfirm', type: '() => void', default: '—', desc: 'Confirm action handler' }] },
  'overlays/drawer': { name: 'Drawer', description: 'Side panel that slides in from the right — great for detail views, filters, and carts.', preview: <DrawerDemo />, code: `import { motion, AnimatePresence } from 'framer-motion'\n\nexport function Drawer({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {\n  return (\n    <AnimatePresence>\n      {open && (\n        <>\n          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}\n            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998 }} />\n          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 200 }}\n            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 320, background: '#111827', borderLeft: '1px solid rgba(255,255,255,0.1)', zIndex: 999, padding: 28 }}>\n            {title && <h2 style={{ color: 'white', marginBottom: 20 }}>{title}</h2>}\n            {children}\n          </motion.div>\n        </>\n      )}\n    </AnimatePresence>\n  )\n}`, props: [{ name: 'open', type: 'boolean', default: 'false', desc: 'Controls drawer visibility' }, { name: 'onClose', type: '() => void', default: '—', desc: 'Close handler' }, { name: 'title', type: 'string', default: 'undefined', desc: 'Optional drawer header title' }] },
  'overlays/popover': { name: 'Popover', description: 'Click-triggered floating panel with smart positioning — great for filters and quick actions.', preview: <PopoverDemo />, code: `// Install: npm install radix-ui\nimport * as Popover from '@radix-ui/react-popover'\n\nexport function PopoverPanel({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {\n  return (\n    <Popover.Root>\n      <Popover.Trigger asChild>{trigger}</Popover.Trigger>\n      <Popover.Portal>\n        <Popover.Content sideOffset={8}\n          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>\n          {children}\n          <Popover.Arrow style={{ fill: 'rgba(255,255,255,0.1)' }} />\n        </Popover.Content>\n      </Popover.Portal>\n    </Popover.Root>\n  )\n}`, props: [{ name: 'trigger', type: 'ReactNode', default: '—', desc: 'Element that triggers the popover' }] },
  'overlays/hover-card': { name: 'Hover Card', description: 'Profile/preview card that appears on hover — perfect for user mentions and link previews.', preview: <HoverCardDemo />, code: `// Install: npm install radix-ui\nimport * as HoverCard from '@radix-ui/react-hover-card'\n\nexport function ProfileHoverCard({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {\n  return (\n    <HoverCard.Root openDelay={200}>\n      <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>\n      <HoverCard.Portal>\n        <HoverCard.Content sideOffset={8}\n          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 18px', minWidth: 220, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>\n          {children}\n        </HoverCard.Content>\n      </HoverCard.Portal>\n    </HoverCard.Root>\n  )\n}`, props: [{ name: 'trigger', type: 'ReactNode', default: '—', desc: 'Hoverable trigger element' }] },
  'overlays/alert': { name: 'Alert', description: 'Inline alert banners — info, success, warning, and error variants for contextual feedback.', preview: <AlertDemo />, code: `type AlertVariant = 'info' | 'success' | 'warning' | 'error'\n\nconst STYLES: Record<AlertVariant, { color: string; bg: string; icon: string }> = {\n  info: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: 'ℹ' },\n  success: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✓' },\n  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⚠' },\n  error: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '✕' },\n}\n\nexport function Alert({ variant = 'info', title, message }: { variant?: AlertVariant; title: string; message?: string }) {\n  const s = STYLES[variant]\n  return (\n    <div style={{ padding: '10px 14px', borderRadius: 10, background: s.bg, border: \`1px solid \${s.color}30\`, display: 'flex', gap: 10 }}>\n      <span style={{ color: s.color, fontWeight: 700 }}>{s.icon}</span>\n      <div>\n        <div style={{ fontWeight: 700, color: s.color, fontSize: 13 }}>{title}</div>\n        {message && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{message}</div>}\n      </div>\n    </div>\n  )\n}`, props: [{ name: 'variant', type: "'info'|'success'|'warning'|'error'", default: "'info'", desc: 'Alert severity level' }, { name: 'title', type: 'string', default: '—', desc: 'Alert heading' }, { name: 'message', type: 'string', default: 'undefined', desc: 'Optional body text' }] },
}
