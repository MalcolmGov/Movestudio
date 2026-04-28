import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Storage } from '../types'

// ── Email Block Types ──────────────────────────────────────
type BlockType = 'header' | 'text' | 'button' | 'divider' | 'image' | 'spacer' | 'columns'

interface EmailBlock {
  id: string
  type: BlockType
  content: Record<string, string>
}

const BLOCK_PALETTE: { type: BlockType; icon: string; label: string }[] = [
  { type: 'header',  icon: '🅗', label: 'Header' },
  { type: 'text',    icon: '📝', label: 'Text' },
  { type: 'button',  icon: '🔘', label: 'Button' },
  { type: 'columns', icon: '⬛', label: 'Two Columns' },
  { type: 'image',   icon: '🖼', label: 'Image' },
  { type: 'divider', icon: '➖', label: 'Divider' },
  { type: 'spacer',  icon: '↕', label: 'Spacer' },
]

const DEFAULT_CONTENT: Record<BlockType, Record<string, string>> = {
  header:  { title: 'Welcome to Our Newsletter', subtitle: 'Your weekly dose of updates and insights', logo: '' },
  text:    { body: 'Write your message here. Share updates, stories, or announcements with your subscribers.' },
  button:  { label: 'Read More', url: 'https://', align: 'center' },
  divider: { color: '#1e2535', height: '1' },
  image:   { url: '', alt: 'Image description', width: '100%' },
  spacer:  { height: '24' },
  columns: { leftTitle: 'Left Column', leftBody: 'Content for the left side', rightTitle: 'Right Column', rightBody: 'Content for the right side' },
}

const TEMPLATES = [
  { id: 'newsletter', label: 'Newsletter', icon: '📰', blocks: ['header', 'text', 'divider', 'columns', 'divider', 'button'] },
  { id: 'promo',      label: 'Promo / Offer', icon: '🔥', blocks: ['header', 'image', 'text', 'button', 'spacer', 'divider', 'text'] },
  { id: 'announce',   label: 'Announcement', icon: '📢', blocks: ['header', 'text', 'image', 'text', 'button'] },
]

function uid() { return `b-${Math.random().toString(36).slice(2, 9)}` }

function makeBlock(type: BlockType): EmailBlock {
  return { id: uid(), type, content: { ...DEFAULT_CONTENT[type] } }
}

// ── Block Renderer (preview) ────────────────────────────────
function BlockPreview({ block, kit, selected, onSelect }: { block: EmailBlock; kit: any; selected: boolean; onSelect: () => void }) {
  const s = block.content
  return (
    <div onClick={onSelect}
      style={{ position: 'relative', cursor: 'pointer', outline: selected ? `2px solid ${kit.primary}` : '2px solid transparent', outlineOffset: 2, borderRadius: 6, transition: 'outline 0.15s' }}>
      {selected && <div style={{ position: 'absolute', top: -10, right: 0, fontSize: 10, background: kit.primary, color: 'white', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>Editing</div>}

      {block.type === 'header' && (
        <div style={{ padding: '28px 32px', textAlign: 'center', background: `linear-gradient(135deg,${kit.primary}18,${kit.secondary}10)`, borderRadius: 6 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 6 }}>{s.title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s.subtitle}</div>
        </div>
      )}
      {block.type === 'text' && (
        <div style={{ padding: '16px 32px', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>{s.body}</div>
      )}
      {block.type === 'button' && (
        <div style={{ padding: '16px', textAlign: s.align as any }}>
          <span style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 99, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 14 }}>{s.label}</span>
        </div>
      )}
      {block.type === 'divider' && <div style={{ margin: '8px 32px', height: 1, background: 'rgba(255,255,255,0.08)' }} />}
      {block.type === 'spacer' && <div style={{ height: parseInt(s.height) }} />}
      {block.type === 'image' && (
        <div style={{ padding: '12px 32px' }}>
          <div style={{ height: 120, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            🖼 {s.alt || 'Image placeholder'}
          </div>
        </div>
      )}
      {block.type === 'columns' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '16px 32px' }}>
          <div style={{ padding: '14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 6 }}>{s.leftTitle}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{s.leftBody}</div>
          </div>
          <div style={{ padding: '14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 6 }}>{s.rightTitle}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{s.rightBody}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Block Editor Panel ──────────────────────────────────────
function BlockEditor({ block, kit, onChange }: { block: EmailBlock; kit: any; onChange: (content: Record<string, string>) => void }) {
  const s = block.content
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font)', marginTop: 6 }
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginTop: 14 }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 14, textTransform: 'capitalize' }}>{block.type} Block</div>

      {block.type === 'header' && <>
        <label style={labelStyle}>Title</label>
        <input style={inputStyle} value={s.title} onChange={e => onChange({ ...s, title: e.target.value })} />
        <label style={labelStyle}>Subtitle</label>
        <input style={inputStyle} value={s.subtitle} onChange={e => onChange({ ...s, subtitle: e.target.value })} />
      </>}

      {block.type === 'text' && <>
        <label style={labelStyle}>Body Text</label>
        <textarea rows={5} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} value={s.body} onChange={e => onChange({ ...s, body: e.target.value })} />
      </>}

      {block.type === 'button' && <>
        <label style={labelStyle}>Button Label</label>
        <input style={inputStyle} value={s.label} onChange={e => onChange({ ...s, label: e.target.value })} />
        <label style={labelStyle}>URL</label>
        <input style={inputStyle} value={s.url} onChange={e => onChange({ ...s, url: e.target.value })} placeholder="https://" />
        <label style={labelStyle}>Alignment</label>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          {['left', 'center', 'right'].map(a => (
            <button key={a} onClick={() => onChange({ ...s, align: a })}
              style={{ flex: 1, padding: '6px', borderRadius: 6, border: `1px solid ${s.align === a ? kit.primary + '60' : 'rgba(255,255,255,0.08)'}`, background: s.align === a ? kit.primary + '15' : 'transparent', color: s.align === a ? 'white' : 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer', textTransform: 'capitalize' }}>
              {a}
            </button>
          ))}
        </div>
      </>}

      {block.type === 'columns' && <>
        <label style={labelStyle}>Left Title</label>
        <input style={inputStyle} value={s.leftTitle} onChange={e => onChange({ ...s, leftTitle: e.target.value })} />
        <label style={labelStyle}>Left Body</label>
        <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={s.leftBody} onChange={e => onChange({ ...s, leftBody: e.target.value })} />
        <label style={labelStyle}>Right Title</label>
        <input style={inputStyle} value={s.rightTitle} onChange={e => onChange({ ...s, rightTitle: e.target.value })} />
        <label style={labelStyle}>Right Body</label>
        <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={s.rightBody} onChange={e => onChange({ ...s, rightBody: e.target.value })} />
      </>}

      {block.type === 'spacer' && <>
        <label style={labelStyle}>Height (px)</label>
        <input type="number" style={inputStyle} value={s.height} onChange={e => onChange({ ...s, height: e.target.value })} min="8" max="120" />
      </>}

      {block.type === 'image' && <>
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.url} onChange={e => onChange({ ...s, url: e.target.value })} placeholder="https://..." />
        <label style={labelStyle}>Alt Text</label>
        <input style={inputStyle} value={s.alt} onChange={e => onChange({ ...s, alt: e.target.value })} />
      </>}
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────
export default function EmailStudioPage() {
  const projects = Storage.getProjects()
  const kit = projects[0]?.kit || { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9', font: 'Inter' }

  const [blocks, setBlocks] = useState<EmailBlock[]>([makeBlock('header'), makeBlock('text'), makeBlock('button')])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [subject, setSubject] = useState('Your Weekly Update from Move Studio')
  const [sent, setSent] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null)

  const selectedBlock = blocks.find(b => b.id === selectedId) || null

  const addBlock = (type: BlockType) => {
    const b = makeBlock(type)
    setBlocks(prev => [...prev, b])
    setSelectedId(b.id)
  }

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id)
      if (idx + dir < 0 || idx + dir >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[idx + dir]] = [next[idx + dir], next[idx]]
      return next
    })
  }

  const updateBlock = (id: string, content: Record<string, string>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b))
  }

  const loadTemplate = (tpl: typeof TEMPLATES[0]) => {
    setBlocks(tpl.blocks.map(t => makeBlock(t as BlockType)))
    setSelectedId(null)
    setActiveTemplate(tpl.id)
  }

  const handleSend = () => {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden', fontFamily: 'var(--font)' }}>

      {/* ── Left: Block palette + templates ── */}
      <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: '#080b14', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '14px 14px 8px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Templates</div>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => loadTemplate(t)}
            style={{ display: 'block', width: '100%', padding: '9px 14px', border: 'none', background: activeTemplate === t.id ? 'rgba(255,255,255,0.07)' : 'transparent', color: activeTemplate === t.id ? 'white' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: activeTemplate === t.id ? 700 : 400, cursor: 'pointer', textAlign: 'left', borderLeft: `3px solid ${activeTemplate === t.id ? kit.primary : 'transparent'}` }}>
            {t.icon} {t.label}
          </button>
        ))}

        <div style={{ margin: '8px 14px', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Add Block</div>
        {BLOCK_PALETTE.map(b => (
          <button key={b.type} onClick={() => addBlock(b.type)}
            style={{ display: 'block', width: '100%', padding: '8px 14px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>
            {b.icon} {b.label}
          </button>
        ))}
      </div>

      {/* ── Centre: Email canvas ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#040608' }}>
        {/* Toolbar */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#080b14', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'white', marginRight: 4 }}>✉️ Email Studio</div>
          <input value={subject} onChange={e => setSubject(e.target.value)}
            style={{ flex: 1, padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 13, outline: 'none', fontFamily: 'var(--font)' }}
            placeholder="Email subject line..." />
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleSend}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: sent ? '#10b981' : `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0, transition: 'background 0.3s' }}>
            {sent ? '✓ Sent!' : '📤 Send Test'}
          </motion.button>
        </div>

        {/* Canvas */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 600, background: '#0a0d18', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {/* Email chrome */}
            <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Subject:</strong> {subject}
            </div>

            {blocks.map((block, i) => (
              <div key={block.id} style={{ position: 'relative' }}>
                <BlockPreview block={block} kit={kit} selected={selectedId === block.id} onSelect={() => setSelectedId(block.id)} />
                {/* Block controls */}
                {selectedId === block.id && (
                  <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 3, zIndex: 10 }}>
                    <button onClick={() => moveBlock(block.id, -1)} style={{ padding: '3px 7px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.15)', background: '#111827', color: 'white', fontSize: 11, cursor: 'pointer' }}>↑</button>
                    <button onClick={() => moveBlock(block.id, 1)} style={{ padding: '3px 7px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.15)', background: '#111827', color: 'white', fontSize: 11, cursor: 'pointer' }}>↓</button>
                    <button onClick={() => removeBlock(block.id)} style={{ padding: '3px 7px', borderRadius: 5, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 11, cursor: 'pointer' }}>✕</button>
                  </div>
                )}
              </div>
            ))}

            {/* Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.7 }}>
              You received this email because you subscribed.<br />
              <span style={{ color: kit.accent, cursor: 'pointer' }}>Unsubscribe</span> · <span style={{ color: kit.accent, cursor: 'pointer' }}>Manage preferences</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Block editor ── */}
      <div style={{ width: 240, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#080b14', overflowY: 'auto' }}>
        <div style={{ padding: '14px 16px 8px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {selectedBlock ? 'Edit Block' : 'Select a block'}
        </div>
        <AnimatePresence mode="wait">
          {selectedBlock ? (
            <motion.div key={selectedBlock.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <BlockEditor block={selectedBlock} kit={kit} onChange={c => updateBlock(selectedBlock.id, c)} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '20px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
              Click any block in the canvas to edit its content
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
