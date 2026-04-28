import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { REGISTRY } from '../../registry'

// Group registry keys by their prefix (e.g. 'text', 'animations', 'buttons')
function groupRegistry() {
  const groups: Record<string, { key: string; name: string; description: string; preview: React.ReactNode }[]> = {}
  Object.entries(REGISTRY).forEach(([key, val]) => {
    const cat = key.split('/')[0]
    const label = cat.charAt(0).toUpperCase() + cat.slice(1)
    if (!groups[label]) groups[label] = []
    groups[label].push({ key, name: val.name, description: val.description, preview: val.preview })
  })
  return groups
}

const CAT_ICONS: Record<string, string> = {
  Text: '✏️', Animations: '🎬', Backgrounds: '🌌', Buttons: '🔘',
  Cards: '🃏', Ui: '🧩', Layout: '📐', Forms: '📋', Navigation: '🗺', Overlays: '🪟',
}

interface Props {
  open: boolean
  onClose: () => void
  onAddComponent: (key: string, name: string, preview: React.ReactNode) => void
  primaryColor: string
}

export default function ComponentBlocksDrawer({ open, onClose, onAddComponent, primaryColor }: Props) {
  const [activecat, setActiveCat] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const groups = groupRegistry()
  const categories = Object.keys(groups)

  const filtered = search.trim()
    ? Object.entries(REGISTRY).filter(([, v]) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.description.toLowerCase().includes(search.toLowerCase())
      )
    : null

  return (
    <>
      {open && (
        <div onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }} />
      )}

      <motion.div
        animate={{ x: open ? 0 : -420 }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        style={{ position: 'fixed', top: 0, left: 0, width: 400, height: '100vh', background: '#080b14', borderRight: '1px solid rgba(255,255,255,0.08)', zIndex: 99, display: 'flex', flexDirection: 'column', boxShadow: '8px 0 40px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Component Blocks</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                {Object.values(REGISTRY).length} premium components · click to add
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search components…"
            style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font)' }}
          />
        </div>

        {/* Category tabs */}
        {!search && (
          <div style={{ display: 'flex', gap: 6, padding: '10px 16px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button
              onClick={() => setActiveCat(null)}
              style={{ padding: '5px 12px', borderRadius: 99, border: 'none', background: !activecat ? `${primaryColor}25` : 'rgba(255,255,255,0.05)', color: !activecat ? primaryColor : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat === activecat ? null : cat)}
                style={{ padding: '5px 12px', borderRadius: 99, border: 'none', background: activecat === cat ? `${primaryColor}25` : 'rgba(255,255,255,0.05)', color: activecat === cat ? primaryColor : 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {CAT_ICONS[cat] || '◆'} {cat}
              </button>
            ))}
          </div>
        )}

        {/* Component list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 32px' }}>
          {filtered ? (
            // Search results
            filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No components match "{search}"</div>
            ) : filtered.map(([key, val]) => (
              <ComponentCard key={key} compKey={key} name={val.name} desc={val.description} preview={val.preview} primaryColor={primaryColor}
                onAdd={() => { onAddComponent(key, val.name, val.preview); onClose() }} />
            ))
          ) : (
            (activecat ? [[activecat, groups[activecat]]] : Object.entries(groups)).map(([cat, items]) => (
              <div key={cat as string}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 2px 8px' }}>
                  <span style={{ fontSize: 14 }}>{CAT_ICONS[cat as string] || '◆'}</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat as string}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', marginLeft: 'auto' }}>{(items as any[]).length}</span>
                </div>
                {(items as any[]).map((item: any) => (
                  <ComponentCard key={item.key} compKey={item.key} name={item.name} desc={item.description} preview={item.preview}
                    primaryColor={primaryColor} onAdd={() => { onAddComponent(item.key, item.name, item.preview); onClose() }} />
                ))}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  )
}

function ComponentCard({ compKey, name, desc, preview, primaryColor, onAdd }: {
  compKey: string; name: string; desc: string; preview: React.ReactNode;
  primaryColor: string; onAdd: () => void;
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      style={{ marginBottom: 8, borderRadius: 12, border: `1px solid rgba(255,255,255,0.07)`, background: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
      {/* Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{expanded ? '▲' : '▼'}</span>
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            onClick={e => { e.stopPropagation(); onAdd() }}
            style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: `${primaryColor}22`, color: primaryColor, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>
            + Add
          </motion.button>
        </div>
      </div>
      {/* Preview panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: '#060911', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 100, maxHeight: 180, overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'center', pointerEvents: 'none' }}>
                {preview}
              </div>
            </div>
            <div style={{ padding: '8px 12px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--mono)' }}>{compKey}</span>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={onAdd}
                style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg,${primaryColor},${primaryColor}cc)`, color: 'white', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                Add to Page →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
