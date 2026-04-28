import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'

function DropdownDemo() {
  const [open, setOpen] = useState(false)
  const items = [{ icon: '👤', label: 'Profile', shortcut: '⌘P' }, { icon: '⚙️', label: 'Settings', shortcut: '⌘S' }, { icon: '💳', label: 'Billing' }, null, { icon: '🚪', label: 'Sign Out', danger: true }]
  return (
    <div style={{ position: 'relative' }}>
      <motion.button onClick={() => setOpen(o => !o)} whileHover={{ scale: 1.03 }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>M</div>
        Malcolm <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>▼</span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0 }} onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
              style={{ position: 'absolute', top: '110%', right: 0, minWidth: 200, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', zIndex: 50, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
              {items.map((item, i) => item === null ? (
                <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
              ) : (
                <div key={item.label} onClick={() => setOpen(false)}
                  style={{ padding: '9px 14px', fontSize: 13, color: (item as any).danger ? '#f87171' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span>{item.icon} {item.label}</span>
                  {(item as any).shortcut && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(item as any).shortcut}</span>}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ContextMenuDemo() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const items = ['Copy', 'Cut', 'Paste', null, 'Select All', 'Delete']
  return (
    <div>
      <div ref={ref} onContextMenu={e => { e.preventDefault(); setPos({ x: e.clientX, y: e.clientY }) }}
        style={{ width: 240, height: 100, borderRadius: 10, border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13, cursor: 'context-menu', position: 'relative' }}>
        Right-click here
      </div>
      <AnimatePresence>
        {pos && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setPos(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'fixed', top: pos.y, left: pos.x, minWidth: 160, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 50, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
              {items.map((item, i) => item === null ? (
                <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '4px 0' }} />
              ) : (
                <div key={item} onClick={() => setPos(null)} style={{ padding: '8px 12px', fontSize: 12, color: item === 'Delete' ? '#f87171' : 'white', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {item}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavMenuDemo() {
  const [active, setActive] = useState<string | null>(null)
  const items = [
    { label: 'Products', children: ['Swifter Wallet', 'PayGuard', 'eKYC Africa'] },
    { label: 'Solutions', children: ['For Banks', 'For Fintechs', 'For Merchants'] },
    { label: 'Pricing', children: [] },
  ]
  return (
    <div style={{ display: 'flex', gap: 2, position: 'relative' }}>
      {items.map(item => (
        <div key={item.label} style={{ position: 'relative' }}
          onMouseEnter={() => item.children.length && setActive(item.label)}
          onMouseLeave={() => setActive(null)}>
          <button style={{ padding: '8px 14px', background: active === item.label ? 'rgba(255,255,255,0.06)' : 'transparent', border: 'none', color: 'white', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 7 }}>
            {item.label} {item.children.length > 0 && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>▼</span>}
          </button>
          <AnimatePresence>
            {active === item.label && item.children.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                style={{ position: 'absolute', top: '100%', left: 0, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 0', minWidth: 160, zIndex: 50 }}>
                {item.children.map(child => (
                  <div key={child} style={{ padding: '8px 14px', fontSize: 13, color: 'white', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {child}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function BreadcrumbDemo() {
  const crumbs = ['Home', 'Components', 'Navigation', 'Breadcrumb']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {crumbs.map((crumb, i) => (
        <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: i === crumbs.length - 1 ? 'white' : 'var(--text-muted)', fontWeight: i === crumbs.length - 1 ? 600 : 400, cursor: i < crumbs.length - 1 ? 'pointer' : 'default' }}
            onMouseEnter={e => { if (i < crumbs.length - 1) e.currentTarget.style.color = '#67e8f9' }}
            onMouseLeave={e => { if (i < crumbs.length - 1) e.currentTarget.style.color = 'var(--text-muted)' }}>
            {crumb}
          </span>
          {i < crumbs.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>/</span>}
        </span>
      ))}
    </div>
  )
}

function PaginationDemo() {
  const [page, setPage] = useState(3)
  const total = 8
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button onClick={() => setPage(p => Math.max(1, p - 1))} style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: 14 }}>‹</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button key={n} onClick={() => setPage(n)}
          style={{ width: 34, height: 34, borderRadius: 7, border: `1px solid ${page === n ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`, background: page === n ? 'rgba(59,130,246,0.2)' : 'transparent', color: page === n ? '#93c5fd' : 'var(--text-muted)', cursor: 'pointer', fontSize: 13, fontWeight: page === n ? 700 : 400, fontFamily: 'var(--font)' }}>
          {n}
        </button>
      ))}
      <button onClick={() => setPage(p => Math.min(total, p + 1))} style={{ width: 34, height: 34, borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer', fontSize: 14 }}>›</button>
    </div>
  )
}

export const NAVIGATION_REGISTRY: Record<string, any> = {
  'navigation/dropdown': { name: 'Dropdown Menu', description: 'Animated dropdown with icons, keyboard shortcuts, separators, and destructive actions.', preview: <DropdownDemo />, code: `// Install: npm install radix-ui\nimport * as DropdownMenu from '@radix-ui/react-dropdown-menu'\n\nexport function Dropdown({ trigger, items }: { trigger: React.ReactNode; items: MenuItem[] }) {\n  return (\n    <DropdownMenu.Root>\n      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>\n      <DropdownMenu.Portal>\n        <DropdownMenu.Content style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, minWidth: 200 }}>\n          {items.map((item) => (\n            item === null\n              ? <DropdownMenu.Separator key="sep" style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />\n              : <DropdownMenu.Item key={item.label} style={{ padding: '9px 14px', cursor: 'pointer' }}>{item.label}</DropdownMenu.Item>\n          ))}\n        </DropdownMenu.Content>\n      </DropdownMenu.Portal>\n    </DropdownMenu.Root>\n  )\n}`, props: [{ name: 'trigger', type: 'ReactNode', default: '—', desc: 'Element that opens the menu' }, { name: 'items', type: 'MenuItem[]', default: '—', desc: 'Menu items array (null = separator)' }] },
  'navigation/context-menu': { name: 'Context Menu', description: 'Right-click context menu — powered by Radix ContextMenu for keyboard and focus accessibility.', preview: <ContextMenuDemo />, code: `// Install: npm install radix-ui\nimport * as ContextMenu from '@radix-ui/react-context-menu'\n\nexport function ContextMenuWrapper({ children, items }: { children: React.ReactNode; items: string[] }) {\n  return (\n    <ContextMenu.Root>\n      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>\n      <ContextMenu.Portal>\n        <ContextMenu.Content style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, minWidth: 160 }}>\n          {items.map(item => (\n            <ContextMenu.Item key={item} style={{ padding: '8px 12px', cursor: 'pointer' }}>{item}</ContextMenu.Item>\n          ))}\n        </ContextMenu.Content>\n      </ContextMenu.Portal>\n    </ContextMenu.Root>\n  )\n}`, props: [{ name: 'children', type: 'ReactNode', default: '—', desc: 'Right-clickable target element' }, { name: 'items', type: 'string[]', default: '—', desc: 'Context menu actions' }] },
  'navigation/nav-menu': { name: 'Navigation Menu', description: 'Hover-triggered mega-nav with animated sub-menus — perfect for marketing headers.', preview: <NavMenuDemo />, code: `// Install: npm install radix-ui\nimport * as NavigationMenu from '@radix-ui/react-navigation-menu'\n\n// Use NavigationMenu.Root, .List, .Item, .Trigger, .Content, .Link\n// Full accessible keyboard nav + screen reader support built in.`, props: [] },
  'navigation/breadcrumb': { name: 'Breadcrumb', description: 'Page hierarchy trail with hover highlight — semantic and accessible.', preview: <BreadcrumbDemo />, code: `export function Breadcrumb({ items }: { items: string[] }) {\n  return (\n    <nav aria-label="Breadcrumb">\n      <ol style={{ display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none' }}>\n        {items.map((item, i) => (\n          <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>\n            <span style={{ fontSize: 13, color: i === items.length - 1 ? 'white' : 'var(--text-muted)', fontWeight: i === items.length - 1 ? 600 : 400 }}>\n              {item}\n            </span>\n            {i < items.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>}\n          </li>\n        ))}\n      </ol>\n    </nav>\n  )\n}`, props: [{ name: 'items', type: 'string[]', default: '—', desc: 'Ordered list of page names' }] },
  'navigation/pagination': { name: 'Pagination', description: 'Page number navigator with prev/next controls — tracks current page state.', preview: <PaginationDemo />, code: `import { useState } from 'react'\n\nexport function Pagination({ total, page, onPageChange }: { total: number; page: number; onPageChange: (p: number) => void }) {\n  return (\n    <div style={{ display: 'flex', gap: 4 }}>\n      <button onClick={() => onPageChange(Math.max(1, page - 1))}>‹</button>\n      {Array.from({ length: total }, (_, i) => i + 1).map(n => (\n        <button key={n} onClick={() => onPageChange(n)}\n          style={{ fontWeight: page === n ? 700 : 400, color: page === n ? '#93c5fd' : 'var(--text-muted)' }}>\n          {n}\n        </button>\n      ))}\n      <button onClick={() => onPageChange(Math.min(total, page + 1))}>›</button>\n    </div>\n  )\n}`, props: [{ name: 'total', type: 'number', default: '—', desc: 'Total number of pages' }, { name: 'page', type: 'number', default: '—', desc: 'Current active page (1-indexed)' }, { name: 'onPageChange', type: '(p: number) => void', default: '—', desc: 'Page change handler' }] },
}
