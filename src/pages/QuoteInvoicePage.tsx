import React, { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BrandKit } from '../types'
import { renderDocument, DocData, DocType, DocStyle, LineItem } from '../components/documents/DocumentTemplate'

// ── Load brand kit ───────────────────────────────────────────
const DEMO_KIT: BrandKit = { primary: '#6366f1', secondary: '#0ea5e9', accent: '#f59e0b', font: 'Inter', logo: '', industry: 'Company', tone: 'professional' }
function loadKit(): BrandKit {
  try {
    const raw = sessionStorage.getItem('wb_project') || sessionStorage.getItem('bs_active_project')
    if (raw) { const p = JSON.parse(raw); if (p?.brandKit) return p.brandKit }
  } catch {}
  return DEMO_KIT
}

// ── Export ───────────────────────────────────────────────────
async function exportDoc(el: HTMLElement, filename: string, format: 'png' | 'pdf') {
  if (format === 'pdf') {
    const win = window.open('', '_blank')!
    win.document.write(`<!DOCTYPE html><html><head>
      <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#fff}@media print{@page{margin:0}}</style>
      </head><body>${el.outerHTML}<script>window.onload=()=>{window.print();window.close()}<\/script></body></html>`)
    win.document.close()
    return
  }
  const { width, height } = el.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * 2); canvas.height = Math.round(height * 2)
  const ctx = canvas.getContext('2d')!; ctx.scale(2, 2)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${el.outerHTML}</div></foreignObject></svg>`
  const img = new Image()
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  await new Promise(r => { img.onload = r })
  ctx.drawImage(img, 0, 0)
  const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = filename; a.click()
}

// ── Default data ─────────────────────────────────────────────
const newItem = (): LineItem => ({ id: Math.random().toString(36).slice(2), description: '', qty: 1, unitPrice: 0, taxRate: 15 })
const today = new Date().toISOString().split('T')[0]
const due = new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0]

const DOC_TYPES: { id: DocType; label: string; icon: string }[] = [
  { id: 'invoice',     label: 'Invoice',     icon: '🧾' },
  { id: 'quote',       label: 'Quotation',   icon: '📋' },
  { id: 'receipt',     label: 'Receipt',     icon: '🗒' },
  { id: 'credit-note', label: 'Credit Note', icon: '↩️' },
]
const DOC_STYLES: { id: DocStyle; label: string }[] = [
  { id: 'modern',  label: 'Modern'  },
  { id: 'minimal', label: 'Minimal' },
]

// ── Styles ───────────────────────────────────────────────────
const inp: React.CSSProperties = { width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'block' }
const sec: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.07)' }

export default function QuoteInvoicePage() {
  const kit = loadKit()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const [exportFmt, setExportFmt] = useState<'png' | 'pdf'>('pdf')
  const [colours, setColours] = useState({ primary: kit.primary, secondary: kit.secondary, accent: kit.accent })
  const effectiveKit = { ...kit, ...colours }

  const [data, setData] = useState<DocData>({
    type: 'invoice', style: 'modern',
    docNumber: 'INV-0001', issueDate: today, dueDate: due,
    companyName: kit.industry || 'Your Company',
    companyAddress: '123 Business Street\nCity, Province, 0001\nSouth Africa',
    companyEmail: 'hello@company.co.za', companyPhone: '+27 11 000 0000',
    companyReg: '', companyVat: '',
    clientName: 'Client Name', clientAddress: 'Client Address\nCity, Province', clientEmail: 'client@email.com',
    items: [newItem()],
    notes: 'Payment is due within 30 days of invoice date.\nThank you for your business!',
    bankName: '', accountNo: '', branchCode: '', paymentRef: '',
    currency: 'R',
  })

  const set = (k: keyof DocData, v: any) => setData(p => ({ ...p, [k]: v }))
  const setItem = (id: string, k: keyof LineItem, v: any) =>
    setData(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [k]: v } : i) }))
  const addItem = () => setData(p => ({ ...p, items: [...p.items, newItem()] }))
  const removeItem = (id: string) => setData(p => ({ ...p, items: p.items.filter(i => i.id !== id) }))

  const handleExport = useCallback(async () => {
    if (!canvasRef.current) return
    setExporting(true)
    const slug = `${data.type}-${data.docNumber}`
    try { await exportDoc(canvasRef.current, `${slug}.png`, exportFmt) }
    catch { alert('Export failed — try a different browser.') }
    finally { setExporting(false) }
  }, [data, exportFmt])

  const totals = (() => {
    let sub = 0, tax = 0
    data.items.forEach(i => { const s = i.qty * i.unitPrice; sub += s; tax += s * i.taxRate / 100 })
    return { sub, tax, total: sub + tax }
  })()

  const fmt = (n: number) => `${data.currency} ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'var(--font)', background: '#040608', color: 'white', overflow: 'hidden' }}>

      {/* ── LEFT: Doc type + style ── */}
      <div style={{ width: 200, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: '#080b14', overflowY: 'auto', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>Document Type</div>
        {DOC_TYPES.map(dt => (
          <button key={dt.id} onClick={() => set('type', dt.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: `1px solid ${data.type === dt.id ? kit.primary + '60' : 'transparent'}`, background: data.type === dt.id ? kit.primary + '18' : 'transparent', cursor: 'pointer', width: '100%' }}>
            <span style={{ fontSize: 18 }}>{dt.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: data.type === dt.id ? 'white' : 'rgba(255,255,255,0.55)' }}>{dt.label}</span>
          </button>
        ))}

        <div style={{ marginTop: 16, ...sec }}>Style</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 4px' }}>
          {DOC_STYLES.map(s => (
            <button key={s.id} onClick={() => set('style', s.id)}
              style={{ padding: '8px 12px', borderRadius: 7, border: `1px solid ${data.style === s.id ? kit.accent : 'rgba(255,255,255,0.1)'}`, background: data.style === s.id ? `${kit.accent}22` : 'rgba(255,255,255,0.04)', color: data.style === s.id ? kit.accent : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Currency */}
        <div style={{ marginTop: 16, padding: '0 4px' }}>
          <label style={lbl}>Currency</label>
          <select value={data.currency} onChange={e => set('currency', e.target.value)}
            style={{ ...inp, appearance: 'none' }}>
            {['R', '$', '€', '£', 'KES', 'NGN', 'GHS'].map(c => <option key={c} value={c} style={{ background: '#0a0d18' }}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── CENTER: Preview ── */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '32px 24px', background: '#0a0d18' }}>
        {/* Live preview */}
        <motion.div ref={canvasRef} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: 'top center', boxShadow: '0 24px 80px rgba(0,0,0,0.7)', borderRadius: 4 }}>
          {renderDocument(data, effectiveKit)}
        </motion.div>

        {/* Export controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['pdf', 'png'] as const).map(f => (
              <button key={f} onClick={() => setExportFmt(f)}
                style={{ padding: '6px 16px', borderRadius: 7, border: `1px solid ${exportFmt === f ? kit.accent : 'rgba(255,255,255,0.1)'}`, background: exportFmt === f ? `${kit.accent}22` : 'rgba(255,255,255,0.04)', color: exportFmt === f ? kit.accent : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
                {f === 'pdf' ? '🖨 PDF' : '🖼 PNG'}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleExport} disabled={exporting}
            style={{ padding: '12px 40px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: `0 4px 20px ${kit.primary}50`, opacity: exporting ? 0.7 : 1 }}>
            {exporting ? '⏳ Exporting…' : `⬇️ Download ${exportFmt.toUpperCase()}`}
          </motion.button>
        </div>
      </div>

      {/* ── RIGHT: Editor ── */}
      <div style={{ width: 320, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#080b14', overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Doc details */}
        <div>
          <div style={sec}>📄 Document</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div><label style={lbl}>Doc Number</label><input style={inp} value={data.docNumber} onChange={e => set('docNumber', e.target.value)} /></div>
            <div><label style={lbl}>Issue Date</label><input style={inp} type="date" value={data.issueDate} onChange={e => set('issueDate', e.target.value)} /></div>
            {data.type !== 'receipt' && <div><label style={lbl}>Due Date</label><input style={inp} type="date" value={data.dueDate} onChange={e => set('dueDate', e.target.value)} /></div>}
          </div>
        </div>

        {/* Company */}
        <div>
          <div style={sec}>🏢 Your Company</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><label style={lbl}>Company Name</label><input style={inp} value={data.companyName} onChange={e => set('companyName', e.target.value)} /></div>
            <div><label style={lbl}>Address</label><textarea style={{ ...inp, resize: 'vertical', minHeight: 54 }} value={data.companyAddress} onChange={e => set('companyAddress', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><label style={lbl}>Email</label><input style={inp} value={data.companyEmail} onChange={e => set('companyEmail', e.target.value)} /></div>
              <div><label style={lbl}>Phone</label><input style={inp} value={data.companyPhone} onChange={e => set('companyPhone', e.target.value)} /></div>
              <div><label style={lbl}>Reg No.</label><input style={inp} placeholder="2025/000000/07" value={data.companyReg} onChange={e => set('companyReg', e.target.value)} /></div>
              <div><label style={lbl}>VAT No.</label><input style={inp} placeholder="4XXXXXXXXXX" value={data.companyVat} onChange={e => set('companyVat', e.target.value)} /></div>
            </div>
          </div>
        </div>

        {/* Client */}
        <div>
          <div style={sec}>👤 Bill To</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><label style={lbl}>Client Name</label><input style={inp} value={data.clientName} onChange={e => set('clientName', e.target.value)} /></div>
            <div><label style={lbl}>Address</label><textarea style={{ ...inp, resize: 'vertical', minHeight: 48 }} value={data.clientAddress} onChange={e => set('clientAddress', e.target.value)} /></div>
            <div><label style={lbl}>Email</label><input style={inp} value={data.clientEmail} onChange={e => set('clientEmail', e.target.value)} /></div>
          </div>
        </div>

        {/* Line items */}
        <div>
          <div style={sec}>🛒 Line Items</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.items.map((item, i) => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 10px 8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>ITEM {i + 1}</div>
                  {data.items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} style={{ fontSize: 11, color: 'rgba(239,68,68,0.7)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input style={inp} placeholder="Description" value={item.description} onChange={e => setItem(item.id, 'description', e.target.value)} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    <div><label style={{ ...lbl, marginBottom: 2 }}>Qty</label><input style={inp} type="number" min={1} value={item.qty} onChange={e => setItem(item.id, 'qty', +e.target.value)} /></div>
                    <div><label style={{ ...lbl, marginBottom: 2 }}>Unit Price</label><input style={inp} type="number" min={0} step={0.01} value={item.unitPrice} onChange={e => setItem(item.id, 'unitPrice', +e.target.value)} /></div>
                    <div><label style={{ ...lbl, marginBottom: 2 }}>Tax %</label><input style={inp} type="number" min={0} max={100} value={item.taxRate} onChange={e => setItem(item.id, 'taxRate', +e.target.value)} /></div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 700, color: kit.accent }}>
                    {fmt(item.qty * item.unitPrice * (1 + item.taxRate / 100))}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addItem}
              style={{ padding: '8px', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
              + Add Item
            </button>
          </div>

          {/* Summary */}
          <div style={{ marginTop: 12, padding: '12px', borderRadius: 10, background: `${effectiveKit.primary}14`, border: `1px solid ${effectiveKit.primary}30` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
              <span>Subtotal</span><span>{fmt(totals.sub)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
              <span>VAT</span><span>{fmt(totals.tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 800, color: 'white' }}>
              <span>TOTAL</span><span style={{ color: effectiveKit.accent }}>{fmt(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment details */}
        <div>
          <div style={sec}>🏦 Payment Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><label style={lbl}>Bank Name</label><input style={inp} placeholder="FNB / Standard Bank…" value={data.bankName} onChange={e => set('bankName', e.target.value)} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><label style={lbl}>Account No.</label><input style={inp} value={data.accountNo} onChange={e => set('accountNo', e.target.value)} /></div>
              <div><label style={lbl}>Branch Code</label><input style={inp} value={data.branchCode} onChange={e => set('branchCode', e.target.value)} /></div>
            </div>
            <div><label style={lbl}>Payment Reference</label><input style={inp} value={data.paymentRef} onChange={e => set('paymentRef', e.target.value)} /></div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <div style={sec}>📝 Notes & Terms</div>
          <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }} value={data.notes} onChange={e => set('notes', e.target.value)} placeholder="Payment terms, late fees, thank you message…" />
        </div>

        {/* Colours */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...sec }}>
            <span>🎨 Brand Colours</span>
            {(colours.primary !== kit.primary || colours.secondary !== kit.secondary || colours.accent !== kit.accent) && (
              <button onClick={() => setColours({ primary: kit.primary, secondary: kit.secondary, accent: kit.accent })}
                style={{ fontSize: 10, color: effectiveKit.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>↩ Reset</button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {([
              ['Primary', 'primary'],
              ['Secondary', 'secondary'],
              ['Accent', 'accent'],
            ] as const).map(([label, key]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: colours[key], border: '2px solid rgba(255,255,255,0.15)', boxShadow: `0 0 10px ${colours[key]}60` }} />
                  <input type="color" value={colours[key]}
                    onChange={e => setColours(p => ({ ...p, [key]: e.target.value }))}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{label}</div>
                  <input value={colours[key]}
                    onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setColours(p => ({ ...p, [key]: e.target.value }))}
                    style={{ ...inp, fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.04em' }} />
                </div>
              </div>
            ))}
            {/* Live preview swatch */}
            <div style={{ height: 8, borderRadius: 99, background: `linear-gradient(90deg,${colours.primary},${colours.secondary},${colours.accent})`, marginTop: 4 }} />
          </div>
        </div>

      </div>
    </div>
  )
}
