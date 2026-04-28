import React, { useState, useRef, useCallback } from 'react'
import { BillingDoc, LineItem, calcDocTotals, fmtMoney, DocTemplate } from './types'
import { saveDoc, getCustomers, newId } from './store'
import DocPreview from './DocPreview'
import { Kit, inp, lbl, Field } from './BillingShared'

interface Props {
  initial: BillingDoc
  kit: Kit
  onBack: () => void
  onSend: (doc: BillingDoc) => void
}

const CURRENCIES = ['R','$','€','£','KES','NGN','GHS']

// ── Section wrapper ───────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12, paddingBottom:6, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{title}</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>{children}</div>
    </div>
  )
}

// ── Colour swatch picker ──────────────────────────────────────
function ColourPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ flex:'0 0 calc(33% - 8px)' }}>
      <label style={lbl}>{label}</label>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width:32, height:32, borderRadius:6, border:'1px solid rgba(255,255,255,0.12)', cursor:'pointer', padding:2, background:'transparent' }} />
        <input style={{ ...inp, flex:1, fontFamily:'monospace', fontSize:11 }} value={value} onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  )
}

// ── Line items editor ─────────────────────────────────────────
function ItemsEditor({ items, currency, accent, onChange }: { items: LineItem[]; currency: string; accent: string; onChange: (i: LineItem[]) => void }) {
  const set = (id: string, k: keyof LineItem, v: any) => onChange(items.map(i => i.id === id ? { ...i, [k]: v } : i))
  const add = () => onChange([...items, { id: newId(), description: '', qty: 1, unitPrice: 0, taxRate: 15 }])
  const rm  = (id: string) => onChange(items.filter(i => i.id !== id))
  return (
    <div style={{ width:'100%' }}>
      {items.map((item, idx) => (
        <div key={item.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'10px', marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700, textTransform:'uppercase' }}>Item {idx+1}</span>
            {items.length > 1 && <button onClick={() => rm(item.id)} style={{ background:'none', border:'none', color:'rgba(239,68,68,0.7)', cursor:'pointer', fontSize:13 }}>✕</button>}
          </div>
          <input style={{ ...inp, marginBottom:6 }} placeholder="Description" value={item.description} onChange={e => set(item.id,'description',e.target.value)} />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
            <div><label style={lbl}>Qty</label><input style={inp} type="number" min={0} value={item.qty} onChange={e => set(item.id,'qty',+e.target.value)} /></div>
            <div><label style={lbl}>Unit Price</label><input style={inp} type="number" min={0} step={0.01} value={item.unitPrice} onChange={e => set(item.id,'unitPrice',+e.target.value)} /></div>
            <div><label style={lbl}>Tax %</label><input style={inp} type="number" min={0} max={100} value={item.taxRate} onChange={e => set(item.id,'taxRate',+e.target.value)} /></div>
          </div>
          <div style={{ textAlign:'right', fontSize:11, fontWeight:700, color:accent, marginTop:4 }}>
            {fmtMoney(item.qty * item.unitPrice * (1 + item.taxRate/100), currency)}
          </div>
        </div>
      ))}
      <button onClick={add} style={{ width:'100%', padding:'7px', borderRadius:7, border:'1px dashed rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.02)', color:'rgba(255,255,255,0.4)', fontSize:12, cursor:'pointer' }}>+ Add Line Item</button>
    </div>
  )
}

// ── Main Editor ───────────────────────────────────────────────
export default function DocEditor({ initial, kit, onBack, onSend }: Props) {
  const [doc, setDoc] = useState<BillingDoc>(initial)
  const [saved, setSaved] = useState(false)
  const [zoom, setZoom] = useState(0.7)
  const customers = getCustomers()
  const previewRef = useRef<HTMLDivElement>(null)

  const set = useCallback(<K extends keyof BillingDoc>(k: K, v: BillingDoc[K]) => {
    setSaved(false)
    setDoc(p => ({ ...p, [k]: v }))
  }, [])

  const setColour = (k: keyof BillingDoc['colours'], v: string) => {
    setSaved(false)
    setDoc(p => ({ ...p, colours: { ...p.colours, [k]: v } }))
  }

  const onSelectCust = (cid: string) => {
    const c = customers.find(x => x.id === cid)
    setSaved(false)
    setDoc(p => ({ ...p, customerId: cid,
      companyName:    p.companyName    || c?.company || c?.name || '',
      companyEmail:   p.companyEmail   || c?.email   || '',
      companyPhone:   p.companyPhone   || c?.phone   || '',
      companyAddress: p.companyAddress || c?.address || '',
      currency: c?.currency || p.currency,
    }))
  }

  const handleSave = () => {
    saveDoc(doc)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!previewRef.current) return
    setDownloading(true)
    try {
      const el = previewRef.current
      // Temporarily zero out the zoom transform so html2canvas
      // captures at the native 794px DocPreview width
      const zoomWrapper = el.parentElement as HTMLElement
      const prevTransform = zoomWrapper.style.transform
      zoomWrapper.style.transform = 'none'

      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(el, {
        scale: 3,                    // 3× = ~225 DPI crisp output
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: el.offsetWidth,
        windowWidth: el.offsetWidth,
      })

      // Restore zoom
      zoomWrapper.style.transform = prevTransform

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pw = pdf.internal.pageSize.getWidth()   // 210mm
      const ph = pdf.internal.pageSize.getHeight()  // 297mm
      const imgH = (canvas.height / canvas.width) * pw
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pw, Math.min(imgH, ph))
      pdf.save(`${doc.docNumber}.pdf`)
    } finally {
      setDownloading(false)
    }
  }

  const totals = calcDocTotals(doc.items)
  const isInv  = doc.type === 'invoice'

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#040608', fontFamily:'Inter,sans-serif', overflow:'hidden' }}>

      {/* ── Topbar ── */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', flexShrink:0, background:'rgba(255,255,255,0.02)' }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.6)', fontSize:12, cursor:'pointer', fontWeight:600 }}>
          ← Back
        </button>
        <div style={{ width:1, height:20, background:'rgba(255,255,255,0.08)', margin:'0 4px' }} />
        <div>
          <span style={{ fontSize:13, fontWeight:800, color:'white' }}>{doc.docNumber}</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginLeft:8, textTransform:'capitalize' }}>{doc.type}</span>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
          {/* Zoom slider */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 8px' }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>Zoom</span>
            <input type="range" min={0.4} max={1.1} step={0.05} value={zoom} onChange={e => setZoom(+e.target.value)}
              style={{ width:80, accentColor: doc.colours.primary }} />
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', minWidth:32 }}>{Math.round(zoom*100)}%</span>
          </div>
          <div style={{ width:1, height:20, background:'rgba(255,255,255,0.08)' }} />
          <button onClick={handleDownload} disabled={downloading}
            style={{ padding:'7px 14px', borderRadius:7, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.7)', fontSize:12, cursor:'pointer', fontWeight:600, opacity: downloading ? 0.6 : 1 }}>
            {downloading ? '⏳ Generating…' : '⬇ PDF'}
          </button>
          <button onClick={handleSave}
            style={{ padding:'7px 16px', borderRadius:7, border:`1px solid ${doc.colours.primary}50`, background:`${doc.colours.primary}18`, color:'white', fontSize:12, cursor:'pointer', fontWeight:700 }}>
            {saved ? '✓ Saved' : 'Save'}
          </button>
          <button onClick={() => { handleSave(); onSend(doc) }}
            style={{ padding:'7px 18px', borderRadius:7, border:'none', background:`linear-gradient(135deg,${doc.colours.primary},${doc.colours.secondary})`, color:'white', fontSize:12, cursor:'pointer', fontWeight:700, boxShadow:`0 2px 12px ${doc.colours.primary}40` }}>
            📧 Send
          </button>
        </div>
      </div>

      {/* ── Body: form left + preview right ── */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

        {/* LEFT: edit panel */}
        <div style={{ width:320, flexShrink:0, background:'#080b14', borderRight:'1px solid rgba(255,255,255,0.07)', overflowY:'auto', padding:'18px 16px' }}>

          <Section title="Document">
            <Field label="Doc Number" half><input style={inp} value={doc.docNumber} onChange={e => set('docNumber', e.target.value)} /></Field>
            <Field label="Currency" half>
              <select style={{ ...inp, appearance:'none' }} value={doc.currency} onChange={e => set('currency', e.target.value)}>
                {CURRENCIES.map(c => <option key={c} style={{ background:'#0d1117' }}>{c}</option>)}
              </select>
            </Field>
            <Field label="Issue Date" half><input style={inp} type="date" value={doc.issueDate} onChange={e => set('issueDate', e.target.value)} /></Field>
            <Field label={isInv ? 'Due Date' : 'Valid Until'} half><input style={inp} type="date" value={doc.dueDate} onChange={e => set('dueDate', e.target.value)} /></Field>
          </Section>

          <Section title="Your Company">
            <Field label="Company Name"><input style={inp} value={doc.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Move Digital Ltd" /></Field>
            <Field label="Email" half><input style={inp} value={doc.companyEmail} onChange={e => set('companyEmail', e.target.value)} placeholder="hello@company.com" /></Field>
            <Field label="Phone" half><input style={inp} value={doc.companyPhone} onChange={e => set('companyPhone', e.target.value)} /></Field>
            <Field label="Address"><textarea style={{ ...inp, minHeight:52, resize:'vertical' }} value={doc.companyAddress} onChange={e => set('companyAddress', e.target.value)} placeholder="123 Main St, Cape Town" /></Field>
            <Field label="Reg No" half><input style={inp} value={doc.companyReg} onChange={e => set('companyReg', e.target.value)} /></Field>
            <Field label="VAT No" half><input style={inp} value={doc.companyVat} onChange={e => set('companyVat', e.target.value)} /></Field>
          </Section>

          <Section title="Bill To">
            <Field label="Customer">
              <select style={{ ...inp, appearance:'none' }} value={doc.customerId} onChange={e => onSelectCust(e.target.value)}>
                <option value="" style={{ background:'#0d1117' }}>— Select Customer —</option>
                {customers.map(c => <option key={c.id} value={c.id} style={{ background:'#0d1117' }}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
              </select>
            </Field>
          </Section>

          <Section title="Line Items">
            <ItemsEditor items={doc.items} currency={doc.currency} accent={doc.colours.accent} onChange={items => set('items', items)} />
          </Section>

          <Section title="Payment Details">
            <Field label="Bank Name" half><input style={inp} value={doc.bankName} onChange={e => set('bankName', e.target.value)} placeholder="FNB / Standard Bank" /></Field>
            <Field label="Account No" half><input style={inp} value={doc.accountNo} onChange={e => set('accountNo', e.target.value)} /></Field>
            <Field label="Branch Code" half><input style={inp} value={doc.branchCode} onChange={e => set('branchCode', e.target.value)} /></Field>
            <Field label="Payment Ref" half><input style={inp} value={doc.paymentRef} onChange={e => set('paymentRef', e.target.value)} /></Field>
          </Section>

          <Section title="Notes">
            <Field label="Notes / Terms">
              <textarea style={{ ...inp, minHeight:72, resize:'vertical' }} value={doc.notes} onChange={e => set('notes', e.target.value)} placeholder="Payment due within 30 days…" />
            </Field>
          </Section>

          <Section title="Brand Colours">
            <ColourPicker label="Primary" value={doc.colours.primary} onChange={v => setColour('primary', v)} />
            <ColourPicker label="Secondary" value={doc.colours.secondary} onChange={v => setColour('secondary', v)} />
            <ColourPicker label="Accent" value={doc.colours.accent} onChange={v => setColour('accent', v)} />
            <div style={{ flex:'0 0 100%', marginTop:4 }}>
              <div style={{ height:6, borderRadius:99, background:`linear-gradient(90deg,${doc.colours.primary},${doc.colours.secondary},${doc.colours.accent})` }} />
            </div>
            <button onClick={() => setDoc(p => ({ ...p, colours: { primary: kit.primary, secondary: kit.secondary, accent: kit.accent } }))}
              style={{ fontSize:11, padding:'5px 12px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.5)', cursor:'pointer', marginTop:4 }}>
              Reset to Brand Kit
            </button>
          </Section>

          <Section title="Template">
            {(['modern','minimal','classic','bold'] as DocTemplate[]).map(t => {
              const active = (doc.template||'modern') === t
              const ICONS: Record<DocTemplate,string> = { modern:'✦', minimal:'◻', classic:'▧', bold:'◼' }
              const DESCS: Record<DocTemplate,string> = { modern:'Gradient header', minimal:'Clean & white', classic:'Sidebar layout', bold:'Dark & striking' }
              return (
                <button key={t} onClick={() => set('template', t)}
                  style={{ flex:'0 0 calc(50% - 6px)', padding:'10px 12px', borderRadius:8,
                    border:`1px solid ${active ? doc.colours.primary+'80' : 'rgba(255,255,255,0.08)'}`,
                    background: active ? `${doc.colours.primary}18` : 'rgba(255,255,255,0.03)',
                    cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
                  <div style={{ fontSize:16, marginBottom:3 }}>{ICONS[t]}</div>
                  <div style={{ fontSize:11, fontWeight:700, color: active ? 'white' : 'rgba(255,255,255,0.6)', textTransform:'capitalize' }}>{t}</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{DESCS[t]}</div>
                </button>
              )
            })}
          </Section>

          {/* Totals summary */}
          <div style={{ background:`${doc.colours.primary}12`, border:`1px solid ${doc.colours.primary}25`, borderRadius:10, padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:6 }}>
              <span>Subtotal</span><span>{fmtMoney(totals.sub, doc.currency)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:8 }}>
              <span>VAT</span><span>{fmtMoney(totals.tax, doc.currency)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:900, color:'white' }}>
              <span>TOTAL</span><span style={{ color:doc.colours.accent }}>{fmtMoney(totals.total, doc.currency)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: live preview */}
        <div style={{ flex:1, overflowY:'auto', background:'#111318', display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 24px' }}>
          <div style={{ transform:`scale(${zoom})`, transformOrigin:'top center', transition:'transform 0.15s' }}>
            <div ref={previewRef}>
              <DocPreview doc={doc} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
