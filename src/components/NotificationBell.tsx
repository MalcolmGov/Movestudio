import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  getNotifications, markAllRead, clearNotifications,
  unreadCount, AppNotification,
} from '../utils/notifications'

const TYPE_META = {
  success: { color: '#10b981', icon: '✅' },
  info:    { color: '#818cf8', icon: '💡' },
  warning: { color: '#f59e0b', icon: '⚠️' },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const refresh = () => {
    setNotifications(getNotifications())
    setCount(unreadCount())
  }

  useEffect(() => {
    refresh()
    window.addEventListener('ms_notification', refresh)
    return () => window.removeEventListener('ms_notification', refresh)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    setOpen(v => !v)
    if (!open) { markAllRead(); refresh() }
  }

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      {/* Bell button */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        onClick={handleOpen}
        style={{ position: 'relative', width: 36, height: 36, borderRadius: 9, border: '1px solid rgba(255,255,255,0.08)', background: open ? 'rgba(129,140,248,0.1)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}
      >
        🔔
        {count > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: 'var(--gradient-sig)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'white', border: '2px solid var(--bg)' }}>
            {count > 9 ? '9+' : count}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, boxShadow: '0 24px 64px rgba(0,0,0,0.6)', zIndex: 999, overflow: 'hidden' }}
          >
            {/* Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>Notifications</div>
              {notifications.length > 0 && (
                <button onClick={() => { clearNotifications(); refresh() }}
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>
                  Clear all
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 340, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
                  No notifications yet
                </div>
              ) : (
                notifications.map((n, i) => {
                  const meta = TYPE_META[n.type]
                  return (
                    <motion.div key={n.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 10, alignItems: 'flex-start', background: n.read ? 'transparent' : 'rgba(129,140,248,0.04)' }}>
                      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{meta.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: 'white', marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{n.body}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{timeAgo(n.createdAt)}</div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
