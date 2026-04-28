/**
 * AdSpecialsTab.tsx
 * Top-level tab UI for the Ad Specials feature inside Ad Studio.
 *
 * Three views, swapped by local state:
 *   - 'list'      → grid of saved specials + entry to library / new special
 *   - 'editor'    → edit one special (live preview + form)
 *   - 'library'   → manage the project's product catalog
 */

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandKit, Project } from '../types'
import {
  AdSpecial, Product, AdSpecialsStore, ProductLibraryStore,
  newSpecial, formatPrice, calcDiscount, formatValidity, CURRENCY_META, CurrencyCode,
} from '../utils/adSpecialEngine'
import { exportPosterAsPdf, exportPosterAsPng } from '../utils/exportPoster'
import { addNotification } from '../utils/notifications'
import { emojiToDataUrl } from '../utils/emojiToDataUrl'
import { PRESET_CATEGORIES, PresetProduct } from '../data/presetProducts'
import AdSpecialCanvas from './AdSpecialCanvas'

interface Props {
  kit: BrandKit & { brandName?: string }
  project: Project | null
}

type View = 'list' | 'editor' | 'library'

export default function AdSpecialsTab({ kit, project }: Props) {
  const projectId = project?.id || 'default'
  const [view, setView] = useState<View>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tick, setTick] = useState(0)   // bump to force re-read from storage

  const specials = useMemo(() => AdSpecialsStore.list(projectId), [projectId, tick])
  const products = useMemo(() => ProductLibraryStore.list(projectId), [projectId, tick])

  const startNew = () => {
    const draft = newSpecial()
    AdSpecialsStore.upsert(projectId, draft)
    setEditingId(draft.id)
    setView('editor')
    setTick(t => t + 1)
  }

  const editExisting = (id: string) => { setEditingId(id); setView('editor') }
  const exitEditor = () => { setEditingId(null); setView('list'); setTick(t => t + 1) }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={view}>
      {view === 'list' && (
        <ListView
          kit={kit}
          specials={specials}
          products={products}
          onNew={startNew}
          onEdit={editExisting}
          onDelete={(id) => { AdSpecialsStore.remove(projectId, id); setTick(t => t + 1) }}
          onLibrary={() => setView('library')}
        />
      )}
      {view === 'library' && (
        <LibraryView
          kit={kit}
          projectId={projectId}
          products={products}
          onChange={() => setTick(t => t + 1)}
          onBack={() => setView('list')}
        />
      )}
      {view === 'editor' && editingId && (
        <EditorView
          kit={kit}
          projectId={projectId}
          specialId={editingId}
          onExit={exitEditor}
          onOpenLibrary={() => setView('library')}
        />
      )}
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────
// LIST VIEW
// ──────────────────────────────────────────────────────────

function ListView({ kit, specials, products, onNew, onEdit, onDelete, onLibrary }: {
  kit: BrandKit
  specials: AdSpecial[]
  products: Product[]
  onNew: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onLibrary: () => void
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 6 }}>🏷️ Ad Specials</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.6 }}>
            Branded in-store posters for shop owners. Pick 4 products, set old → new prices, print A4 or share to WhatsApp.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onLibrary}
            style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            📦 Product Library ({products.length})
          </button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onNew}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            + New Ad Special
          </motion.button>
        </div>
      </div>

      {specials.length === 0 ? (
        <div style={{ padding: '56px 24px', borderRadius: 14, border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🪧</div>
          <div style={{ fontSize: 15, color: 'white', fontWeight: 700, marginBottom: 4 }}>No specials yet</div>
          <div style={{ fontSize: 13, marginBottom: 18 }}>Create your first poster — it takes about a minute.</div>
          <button onClick={onNew}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            + Create your first Ad Special
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {specials.map(s => {
            const productCount = s.productIds.length
            return (
              <motion.div key={s.id} whileHover={{ y: -3 }} onClick={() => onEdit(s.id)}
                style={{ padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', position: 'relative' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'white', marginBottom: 4, lineHeight: 1.3 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>{formatValidity(s.validFrom, s.validTo)}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11, color: kit.accent, fontWeight: 700 }}>{productCount}/4 products</div>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${s.title}"?`)) onDelete(s.id) }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13, padding: 4 }}>🗑</button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// LIBRARY VIEW
// ──────────────────────────────────────────────────────────

function LibraryView({ kit, projectId, products, onChange, onBack }: {
  kit: BrandKit
  projectId: string
  products: Product[]
  onChange: () => void
  onBack: () => void
}) {
  const [editing, setEditing] = useState<Product | null>(null)
  const [catalogOpen, setCatalogOpen] = useState(false)

  const blank = (): Product => ({
    id: `prod-${Date.now()}`,
    name: '',
    image: null,
    oldPrice: 0,
    newPrice: 0,
    unit: '',
    createdAt: new Date().toISOString(),
  })

  const fromPreset = (preset: PresetProduct): Product => ({
    id: `prod-${Date.now()}`,
    name: preset.name,
    image: emojiToDataUrl(preset.emoji),
    oldPrice: 0,
    newPrice: 0,
    unit: preset.unit,
    createdAt: new Date().toISOString(),
  })

  const save = (p: Product) => {
    if (!p.name.trim()) { addNotification('Missing name', 'Give the product a name first.', 'warning'); return }
    if (p.newPrice >= p.oldPrice) { addNotification('Check pricing', 'Special price should be less than the old price.', 'warning'); return }
    ProductLibraryStore.upsert(projectId, p)
    onChange()
    setEditing(null)
  }

  const remove = (id: string) => {
    if (!confirm('Delete this product?')) return
    ProductLibraryStore.remove(projectId, id)
    onChange()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, marginBottom: 6 }}>← Back to Specials</button>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>📦 Product Library</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 540 }}>Add products once, reuse them across every weekly special.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setCatalogOpen(true)}
            style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)' }}>
            📚 Quick Add from Catalog
          </button>
          <button onClick={() => setEditing(blank())}
            style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
            + Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{ padding: 40, borderRadius: 12, border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          No products yet. Add your first one to start building specials.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {products.map(p => (
            <div key={p.id} style={{ padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ height: 100, background: '#0b1220', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, overflow: 'hidden' }}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <div style={{ fontSize: 28, opacity: 0.3 }}>📦</div>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                <span style={{ textDecoration: 'line-through' }}>{formatPrice(p.oldPrice, 'ZAR')}</span>
                {'  '}<span style={{ color: kit.accent, fontWeight: 700 }}>{formatPrice(p.newPrice, 'ZAR')}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setEditing(p)} style={{ flex: 1, padding: '6px 8px', fontSize: 11, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => remove(p.id)} style={{ padding: '6px 8px', fontSize: 11, borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', cursor: 'pointer' }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {editing && <ProductEditModal product={editing} onCancel={() => setEditing(null)} onSave={save} kit={kit} />}
        {catalogOpen && (
          <CatalogPickerModal
            kit={kit}
            onCancel={() => setCatalogOpen(false)}
            onPick={(preset) => {
              setCatalogOpen(false)
              setEditing(fromPreset(preset))
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// CATALOG PICKER MODAL
// ──────────────────────────────────────────────────────────

function CatalogPickerModal({ kit, onPick, onCancel }: {
  kit: BrandKit
  onPick: (p: PresetProduct) => void
  onCancel: () => void
}) {
  const [activeCat, setActiveCat] = useState(PRESET_CATEGORIES[0].id)
  const [search, setSearch] = useState('')

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) {
      const cat = PRESET_CATEGORIES.find(c => c.id === activeCat)
      return cat ? cat.items.map(item => ({ item, catLabel: cat.label })) : []
    }
    // Search across all categories
    return PRESET_CATEGORIES.flatMap(cat =>
      cat.items
        .filter(i => i.name.toLowerCase().includes(q) || i.unit.toLowerCase().includes(q))
        .map(item => ({ item, catLabel: cat.label }))
    )
  }, [activeCat, search])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
      onClick={onCancel}>
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        style={{ width: 720, maxWidth: '100%', height: '80vh', maxHeight: 720, background: '#0f1424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>📚 Product Catalog</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Quick-add common items. You'll set prices on the next screen.</div>
            </div>
            <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 4 }}>×</button>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search across all categories…"
            style={{ ...inputStyle, marginBottom: 0 }}
          />
        </div>

        {/* Category tabs (hidden when searching) */}
        {!search && (
          <div style={{ display: 'flex', gap: 4, padding: '12px 16px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            {PRESET_CATEGORIES.map(cat => {
              const active = cat.id === activeCat
              return (
                <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                  style={{ padding: '7px 12px', borderRadius: 8, border: 'none', background: active ? `${kit.primary}25` : 'transparent', color: active ? 'white' : 'var(--text-muted)', fontWeight: active ? 700 : 500, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font)', flexShrink: 0 }}>
                  <span style={{ marginRight: 4 }}>{cat.icon}</span>{cat.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Items grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>
              No matches. Try a different search term, or add it as a custom product.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {visible.map(({ item, catLabel }, idx) => (
                <motion.button key={`${item.name}-${item.unit}-${idx}`} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => onPick(item)}
                  style={{ padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 4 }}>{item.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {item.unit}{search ? ` · ${catLabel}` : ''}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProductEditModal({ product, onSave, onCancel, kit }: {
  product: Product
  onSave: (p: Product) => void
  onCancel: () => void
  kit: BrandKit
}) {
  const [draft, setDraft] = useState<Product>(product)

  const onImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setDraft(d => ({ ...d, image: reader.result as string }))
    reader.readAsDataURL(file)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
      onClick={onCancel}>
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()}
        style={{ width: 460, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#0f1424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 16 }}>{product.name ? 'Edit' : 'New'} Product</div>

        <Field label="Name">
          <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Whole Chicken" style={inputStyle} />
        </Field>
        <Field label="Unit (optional)">
          <input value={draft.unit || ''} onChange={e => setDraft({ ...draft, unit: e.target.value })} placeholder="e.g. per kg, 500ml, each" style={inputStyle} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Field label="Old price">
            <input type="number" min={0} step={0.01} value={draft.oldPrice} onChange={e => setDraft({ ...draft, oldPrice: parseFloat(e.target.value) || 0 })} style={inputStyle} />
          </Field>
          <Field label="Special price">
            <input type="number" min={0} step={0.01} value={draft.newPrice} onChange={e => setDraft({ ...draft, newPrice: parseFloat(e.target.value) || 0 })} style={inputStyle} />
          </Field>
        </div>
        {draft.oldPrice > 0 && draft.newPrice > 0 && draft.newPrice < draft.oldPrice && (
          <div style={{ fontSize: 12, color: kit.accent, marginTop: -4, marginBottom: 10 }}>
            Saving {calcDiscount(draft.oldPrice, draft.newPrice).percentOff}% — that's a strong special.
          </div>
        )}
        <Field label="Product image">
          <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && onImage(e.target.files[0])} style={{ ...inputStyle, padding: 8 }} />
          {draft.image && <img src={draft.image} alt="preview" style={{ marginTop: 8, maxWidth: 120, maxHeight: 120, borderRadius: 6, background: '#0b1220', objectFit: 'contain' }} />}
        </Field>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onSave(draft)} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})`, color: 'white', fontWeight: 800, cursor: 'pointer' }}>Save</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────
// EDITOR VIEW
// ──────────────────────────────────────────────────────────

function EditorView({ kit, projectId, specialId, onExit, onOpenLibrary }: {
  kit: BrandKit & { brandName?: string }
  projectId: string
  specialId: string
  onExit: () => void
  onOpenLibrary: () => void
}) {
  const initial = AdSpecialsStore.list(projectId).find(s => s.id === specialId)!
  const [draft, setDraft] = useState<AdSpecial>(initial)
  const [exporting, setExporting] = useState<'pdf' | 'png' | null>(null)

  const products = useMemo(() => ProductLibraryStore.list(projectId), [projectId])
  const selected = draft.productIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[]

  const update = <K extends keyof AdSpecial>(k: K, v: AdSpecial[K]) => setDraft(d => ({ ...d, [k]: v }))
  const updateStore = (k: keyof AdSpecial['store'], v: string) => setDraft(d => ({ ...d, store: { ...d.store, [k]: v } }))

  const toggleProduct = (id: string) => {
    setDraft(d => {
      const has = d.productIds.includes(id)
      if (has) return { ...d, productIds: d.productIds.filter(x => x !== id) }
      if (d.productIds.length >= 4) {
        addNotification('Limit reached', 'A 4-grid poster fits 4 products. Remove one to add another.', 'warning')
        return d
      }
      return { ...d, productIds: [...d.productIds, id] }
    })
  }

  const persist = () => { AdSpecialsStore.upsert(projectId, draft); addNotification('Saved ✨', 'Your ad special is saved.', 'success') }

  const safeName = (draft.title || 'ad-special').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const exportPdf = async () => {
    if (selected.length === 0) { addNotification('Add a product first', 'Pick at least one product before exporting.', 'warning'); return }
    setExporting('pdf')
    persist()
    try { await exportPosterAsPdf('ad-special-canvas-root', `movestudio-${safeName}`); addNotification('PDF exported 🎉', 'A4 print-ready PDF saved to your downloads.', 'success') }
    catch (err) { console.error(err); addNotification('Export failed', 'Check the console for details.', 'warning') }
    finally { setExporting(null) }
  }

  const exportPng = async () => {
    if (selected.length === 0) { addNotification('Add a product first', 'Pick at least one product before exporting.', 'warning'); return }
    setExporting('png')
    persist()
    try { await exportPosterAsPng('ad-special-canvas-root', `movestudio-${safeName}`); addNotification('PNG exported 🎉', 'High-res PNG saved — share it on WhatsApp or socials.', 'success') }
    catch (err) { console.error(err); addNotification('Export failed', 'Check the console for details.', 'warning') }
    finally { setExporting(null) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <button onClick={onExit} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, marginBottom: 4 }}>← Back to Specials</button>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Editing: {draft.title || 'Untitled Special'}</h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={persist} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Save</button>
          <button onClick={exportPng} disabled={!!exporting} style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', opacity: exporting === 'png' ? 0.6 : 1 }}>
            {exporting === 'png' ? '⏳ PNG…' : '🖼 Export PNG'}
          </button>
          <button onClick={exportPdf} disabled={!!exporting} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', opacity: exporting === 'pdf' ? 0.6 : 1 }}>
            {exporting === 'pdf' ? '⏳ PDF…' : '🖨 Export A4 PDF'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 28, alignItems: 'flex-start' }}>
        {/* ── Form ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title="Headline">
            <Field label="Title"><input value={draft.title} onChange={e => update('title', e.target.value)} style={inputStyle} placeholder="WEEKEND SPECIALS" /></Field>
            <Field label="Subtitle (optional)"><input value={draft.subtitle || ''} onChange={e => update('subtitle', e.target.value)} style={inputStyle} placeholder="This week only" /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Valid from"><input type="date" value={draft.validFrom} onChange={e => update('validFrom', e.target.value)} style={inputStyle} /></Field>
              <Field label="Valid to"><input type="date" value={draft.validTo} onChange={e => update('validTo', e.target.value)} style={inputStyle} /></Field>
            </div>
            <Field label="Currency">
              <select value={draft.currency} onChange={e => update('currency', e.target.value as CurrencyCode)} style={inputStyle}>
                {(Object.keys(CURRENCY_META) as CurrencyCode[]).map(c => <option key={c} value={c}>{c} ({CURRENCY_META[c].symbol})</option>)}
              </select>
            </Field>
          </Card>

          <Card title={`Products  ·  ${selected.length} / 4 selected`} action={<button onClick={onOpenLibrary} style={linkBtn(kit)}>+ Manage Library</button>}>
            {products.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: 12 }}>No products in your library. <button onClick={onOpenLibrary} style={linkBtn(kit)}>Add some first →</button></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                {products.map(p => {
                  const picked = draft.productIds.includes(p.id)
                  return (
                    <div key={p.id} onClick={() => toggleProduct(p.id)}
                      style={{ padding: 8, borderRadius: 8, border: `1.5px solid ${picked ? kit.primary : 'rgba(255,255,255,0.08)'}`, background: picked ? `${kit.primary}12` : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                      <div style={{ height: 60, background: '#0b1220', borderRadius: 4, marginBottom: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ opacity: 0.3 }}>📦</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'white', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{formatPrice(p.newPrice, draft.currency)}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card title="Store info (shown at the bottom of the poster)">
            <Field label="Store name (overrides brand name on header)"><input value={draft.store.storeName || ''} onChange={e => updateStore('storeName', e.target.value)} style={inputStyle} placeholder={kit.companyName || kit.brandName || ''} /></Field>
            <Field label="Address"><input value={draft.store.address || ''} onChange={e => updateStore('address', e.target.value)} style={inputStyle} placeholder="123 Main Rd, Cape Town" /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field label="Phone"><input value={draft.store.phone || ''} onChange={e => updateStore('phone', e.target.value)} style={inputStyle} placeholder="+27 21 555 0123" /></Field>
              <Field label="WhatsApp number"><input value={draft.store.whatsapp || ''} onChange={e => updateStore('whatsapp', e.target.value)} style={inputStyle} placeholder="+27 82 555 0123" /></Field>
            </div>
            <Field label="Opening hours"><input value={draft.store.hours || ''} onChange={e => updateStore('hours', e.target.value)} style={inputStyle} placeholder="Mon–Sat 8:00 – 18:00" /></Field>
            <Field label="QR code URL (optional)"><input value={draft.store.qrUrl || ''} onChange={e => updateStore('qrUrl', e.target.value)} style={inputStyle} placeholder="https://wa.me/27825550123" /></Field>
            <Field label="Disclaimer"><input value={draft.disclaimer} onChange={e => update('disclaimer', e.target.value)} style={inputStyle} /></Field>
          </Card>
        </div>

        {/* ── Live preview ─── */}
        <div style={{ position: 'sticky', top: 12, alignSelf: 'flex-start' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Live preview · A4</div>
          <AdSpecialCanvas kit={kit} special={draft} products={selected} displayWidth={420} />
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// Shared bits
// ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
  color: 'white', fontSize: 13, fontFamily: 'var(--font)', boxSizing: 'border-box',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      {children}
    </label>
  )
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'white', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</div>
        {action}
      </div>
      {children}
    </div>
  )
}

const linkBtn = (kit: BrandKit): React.CSSProperties => ({
  background: 'none', border: 'none', color: kit.accent, cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: 0,
})
