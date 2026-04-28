import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem  { name: string; path: string; desc: string; icon: string }
interface NavGroup { label: string; icon: string; color: string; items: NavItem[] }

// ── Categorised navigation ────────────────────────────────────────────────────
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Sales & Revenue', icon: '💰', color: '#10b981',
    items: [
      { icon: '👥', name: 'CRM',              path: '/crm',             desc: 'Contacts, pipeline & deals' },
      { icon: '🧾', name: 'Quotes & Invoices', path: '/quotes-invoices', desc: 'Professional branded quotes' },
      { icon: '💼', name: 'Billing Suite',     path: '/billing',         desc: 'Invoices, payments & reports' },
    ],
  },
  {
    label: 'Operations', icon: '⚙️', color: '#f59e0b',
    items: [
      { icon: '📦', name: 'Inventory',         path: '/inventory',       desc: 'Stock, products & suppliers' },
      { icon: '📋', name: 'Projects',           path: '/projects',        desc: 'Tasks, board & timelines' },
      { icon: '📊', name: 'Accounting',         path: '/accounting',      desc: 'P&L, transactions & VAT' },
      { icon: '🧑‍💼', name: 'HR & Payroll',      path: '/hr',              desc: 'People, payroll & leave' },
    ],
  },
  {
    label: 'Marketing & Brand', icon: '📣', color: '#ec4899',
    items: [
      { icon: '❖',  name: 'Brand Kit Studio',  path: '/brand-studio',    desc: 'Colours, fonts, logos' },
      { icon: '📣', name: 'Social Ad Studio',  path: '/ad-studio',       desc: 'Generate & export ads' },
      { icon: '✉️', name: 'Email Studio',      path: '/email-studio',    desc: 'Drag-drop email builder' },
      { icon: '🗂', name: 'Templates',          path: '/templates',       desc: 'Ad packs & page templates' },
    ],
  },
  {
    label: 'Build & Publish', icon: '🌐', color: '#6366f1',
    items: [
      { icon: '🌐', name: 'Website Builder',   path: '/website-builder', desc: 'No-code drag & drop builder' },
      { icon: '✦',  name: 'Move Studio',        path: '/move-studio',     desc: 'Studio landing & brand assets' },
    ],
  },
  {
    label: 'AI & Insights', icon: '🤖', color: '#a78bfa',
    items: [
      { icon: '🤖', name: 'Agent Skills',      path: '/agent-skills',    desc: 'AI agent integrations' },
      { icon: '📈', name: 'Analytics',          path: '/analytics',       desc: 'Performance & insights' },
      { icon: '⬡',  name: 'Dashboard',          path: '/dashboard',       desc: 'Projects & saved work' },
    ],
  },
  {
    label: 'Account', icon: '👤', color: '#94a3b8',
    items: [
      { icon: '👥', name: 'Team',              path: '/team',            desc: 'Invite & manage members' },
      { icon: '💳', name: 'Pricing',           path: '/pricing',         desc: 'Plans & billing' },
    ],
  },
]

// ── Pinned / quick-access items at the very top ───────────────────────────────
const PINNED: NavItem = { icon: '🏠', name: 'Home', path: '/home', desc: 'Marketing & landing page' }

interface Props {
  kit?: { primary: string; secondary: string; accent: string }
  collapsed?: boolean
  onToggle?: () => void
}

export default function StudioSidebar({ kit, collapsed = false, onToggle }: Props) {
  const nav = useNavigate()
  const loc = useLocation()
  const primary   = kit?.primary   || '#6366f1'
  const secondary = kit?.secondary || '#0ea5e9'
  const accent    = kit?.accent    || '#f59e0b'

  // Which groups are open (default: all open except Account)
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(NAV_GROUPS.filter(g=>g.label!=='Account').map(g=>g.label))
  )

  const toggleGroup = (label: string) =>
    setOpenGroups(prev => { const n = new Set(prev); n.has(label) ? n.delete(label) : n.add(label); return n })

  const activeGroup = NAV_GROUPS.find(g => g.items.some(i => i.path === loc.pathname))

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 64 : 230 }}
      transition={{ type: 'spring', damping: 26, stiffness: 260 }}
      style={{ height: '100%', flexShrink: 0, background: '#080b14', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 10 }}
    >
      {/* Logo row */}
      <div style={{ padding: collapsed ? '18px 16px' : '18px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: `linear-gradient(135deg,${primary},${secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: 'white', boxShadow: `0 0 14px ${primary}60` }}>M</div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>
              <div style={{ fontWeight: 900, fontSize: 13.5, color: 'white', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Move Studio</div>
              <div style={{ fontSize: 9, color: accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 1 }}>AI Suite</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={onToggle} style={{ marginLeft: 'auto', flexShrink: 0, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Scrollable nav */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: collapsed ? '8px 8px' : '8px 10px 16px' }}>

        {/* Pinned: Home */}
        <NavBtn item={PINNED} active={loc.pathname === PINNED.path} collapsed={collapsed} primary={primary} onClick={() => nav(PINNED.path)}/>

        {collapsed ? (
          // Collapsed: show only icons, no groups
          <>
            {NAV_GROUPS.flatMap(g => g.items).map(item => (
              <NavBtn key={item.path} item={item} active={loc.pathname === item.path} collapsed={collapsed} primary={primary} onClick={() => nav(item.path)}/>
            ))}
          </>
        ) : (
          // Expanded: grouped sections
          <>
            {NAV_GROUPS.map(group => {
              const isOpen = openGroups.has(group.label)
              const isActiveGroup = activeGroup?.label === group.label
              return (
                <div key={group.label} style={{ marginTop: 6 }}>
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(group.label)}
                    style={{ display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '6px 8px', borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: 2 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 13 }}>{group.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: isActiveGroup ? group.color : 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1, textAlign: 'left' }}>{group.label}</span>
                    <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.15 }} style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>▶</motion.span>
                  </button>
                  {/* Group items */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden', paddingLeft: 6 }}>
                        {group.items.map(item => (
                          <NavBtn key={item.path} item={item} active={loc.pathname === item.path} collapsed={false} primary={group.color} onClick={() => nav(item.path)} accent={group.color}/>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Bottom brand dots */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {[primary, secondary, accent].map((c, i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}80` }} />
            ))}
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginLeft: 6 }}>Brand kit active</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Reusable nav button ────────────────────────────────────────────────────────
function NavBtn({ item, active, collapsed, primary, onClick, accent }: { item: NavItem; active: boolean; collapsed: boolean; primary: string; onClick: () => void; accent?: string }) {
  const activeColor = accent || primary
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.name : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: collapsed ? '10px 0' : '7px 10px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 8, marginBottom: 1, border: `1px solid ${active ? activeColor + '40' : 'transparent'}`, background: active ? `${activeColor}15` : 'transparent', cursor: 'pointer', transition: 'all 0.12s' }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
    >
      <span style={{ fontSize: 16, flexShrink: 0, lineHeight: 1 }}>{item.icon}</span>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} style={{ textAlign: 'left', overflow: 'hidden', minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? 'white' : 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.desc}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
