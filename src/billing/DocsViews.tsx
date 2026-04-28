import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BillingDoc, InvoiceStatus, QuoteStatus, calcDocTotals, fmtMoney, LineItem } from '../billing/types'
import { getDocs, getCustomers, saveDoc, deleteDoc, updateDocStatus, newId, convertQuoteToInvoice, newToken } from '../billing/store'
import { Badge, Modal, Field, inp, lbl, card, Kit } from './BillingShared'
import { generateInvoicePDFBase64 } from './generatePDF'

const today = () => new Date().toISOString().split('T')[0]
const due30  = () => new Date(Date.now() + 30*864e5).toISOString().split('T')[0]

function blankDoc(type: 'invoice'|'quote', cid?: string, company?: string, address?: string, email?: string, phone?: string, currency?: string, kit?: Kit): BillingDoc {
  const prefix = type === 'invoice' ? 'INV' : 'QUO'
  const existing = getDocs().filter(d => d.type === type).length
  return {
    id: newId(), type, status: 'draft' as InvoiceStatus,
    docNumber: `${prefix}-${String(existing + 1).padStart(4,'0')}`,
    customerId: cid || '',
    issueDate: today(), dueDate: due30(),
    items: [{ id: newId(), description: '', qty: 1, unitPrice: 0, taxRate: 15 }],
    notes: 'Payment is due within 30 days.\nThank you for your business!',
    bankName: '', accountNo: '', branchCode: '', paymentRef: '',
    currency: currency || 'R',
    colours: { primary: kit?.primary || '#6366f1', secondary: kit?.secondary || '#0ea5e9', accent: kit?.accent || '#f59e0b' },
    companyName: '', companyAddress: company || '', companyEmail: email || '', companyPhone: phone || '', companyReg: '', companyVat: '',
    createdAt: new Date().toISOString(),
  }
}

// ── Line items mini editor ────────────────────────────────────
function ItemsEditor({ items, onChange, currency, accent }: { items: LineItem[]; onChange: (items: LineItem[]) => void; currency: string; accent: string }) {
  const set = (id: string, k: keyof LineItem, v: any) => onChange(items.map(i => i.id === id ? { ...i, [k]: v } : i))
  const add  = () => onChange([...items, { id: newId(), description: '', qty: 1, unitPrice: 0, taxRate: 15 }])
  const rm   = (id: string) => onChange(items.filter(i => i.id !== id))
  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'10px', marginBottom:8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>ITEM {idx+1}</span>
            {items.length > 1 && <button onClick={() => rm(item.id)} style={{ background:'none', border:'none', color:'rgba(239,68,68,0.6)', cursor:'pointer', fontSize:12 }}>✕</button>}
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
      <button onClick={add} style={{ width:'100%', padding:'7px', borderRadius:7, border:'1px dashed rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.02)', color:'rgba(255,255,255,0.4)', fontSize:12, cursor:'pointer' }}>+ Add Item</button>
    </div>
  )
}

// ── Doc quick-form (in modal) ─────────────────────────────────
function DocForm({ initial, kit, onSave, onClose }: { initial: BillingDoc; kit: Kit; onSave: (d: BillingDoc) => void; onClose: () => void }) {
  const [d, setD] = useState(initial)
  const [customers] = useState(getCustomers())
  const set = (k: keyof BillingDoc, v: any) => setD(p => ({ ...p, [k]: v }))

  const selCust = customers.find(c => c.id === d.customerId)
  const totals  = calcDocTotals(d.items)

  const onSelectCust = (cid: string) => {
    const c = customers.find(x => x.id === cid)
    setD(p => ({ ...p, customerId: cid,
      companyName: c?.company || c?.name || '',
      companyEmail: c?.email || '',
      companyPhone: c?.phone || '',
      companyAddress: c?.address || '',
      currency: c?.currency || 'R',
    }))
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {/* Doc details */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
        <Field label="Document Number" half><input style={inp} value={d.docNumber} onChange={e => set('docNumber', e.target.value)} /></Field>
        <Field label="Customer" half>
          <select style={{ ...inp, appearance:'none' }} value={d.customerId} onChange={e => onSelectCust(e.target.value)}>
            <option value="" style={{ background:'#0d1117' }}>— Select Customer —</option>
            {customers.map(c => <option key={c.id} value={c.id} style={{ background:'#0d1117' }}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
          </select>
        </Field>
        <Field label="Issue Date" half><input style={inp} type="date" value={d.issueDate} onChange={e => set('issueDate', e.target.value)} /></Field>
        {d.type !== 'receipt' && <Field label="Due Date" half><input style={inp} type="date" value={d.dueDate} onChange={e => set('dueDate', e.target.value)} /></Field>}
        <Field label="Your Company Name" half><input style={inp} value={d.companyName} onChange={e => set('companyName', e.target.value)} /></Field>
        <Field label="Your Email" half><input style={inp} value={d.companyEmail} onChange={e => set('companyEmail', e.target.value)} /></Field>
      </div>

      {/* Line items */}
      <div style={{ marginBottom:14 }}>
        <label style={lbl}>Line Items</label>
        <ItemsEditor items={d.items} onChange={items => set('items', items)} currency={d.currency} accent={kit.accent} />
      </div>

      {/* Totals */}
      <div style={{ background:`${kit.primary}14`, border:`1px solid ${kit.primary}30`, borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:4 }}><span>Subtotal</span><span>{fmtMoney(totals.sub, d.currency)}</span></div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.45)', marginBottom:8 }}><span>VAT</span><span>{fmtMoney(totals.tax, d.currency)}</span></div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, fontWeight:800, color:'white' }}><span>TOTAL</span><span style={{ color:kit.accent }}>{fmtMoney(totals.total, d.currency)}</span></div>
      </div>

      {/* Payment + notes */}
      <Field label="Payment Reference"><input style={inp} placeholder="Invoice number / order ref" value={d.paymentRef} onChange={e => set('paymentRef', e.target.value)} /></Field>
      <Field label="Notes"><textarea style={{ ...inp, minHeight:60, resize:'vertical' }} value={d.notes} onChange={e => set('notes', e.target.value)} /></Field>

      <div style={{ display:'flex', gap:8, marginTop:4 }}>
        <button onClick={() => { onSave(d); onClose() }}
          style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${kit.primary},${kit.secondary})`, color:'white', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          Save
        </button>
        <button onClick={onClose} style={{ padding:'10px 18px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}

// ── Send modal ────────────────────────────────────────────────
function SendModal({ doc, kit, onClose, onSent }: { doc: BillingDoc; kit: Kit; onClose: () => void; onSent: () => void }) {
  const [step,      setStep]      = useState<'compose'|'sending'|'done'|'err'>('compose')
  const [phase,     setPhase]     = useState(0)
  const [errMsg,    setErrMsg]    = useState('')
  const [copied,    setCopied]    = useState(false)
  const [acceptUrl, setAcceptUrl] = useState('')
  const customers = getCustomers()
  const cust      = customers.find(c => c.id === doc.customerId)
  const [toEmail, setToEmail] = useState(cust?.email || '')
  const [toName,  setToName]  = useState(cust?.name  || '')
  const totals  = calcDocTotals(doc.items)
  const isQuote = doc.type === 'quote'
  const label   = isQuote ? 'Quotation' : doc.type === 'invoice' ? 'Invoice' : 'Document'

  const handleSend = async () => {
    if (!toEmail) { alert('Recipient email is required'); return }
    setStep('sending'); setPhase(1)
    try {
      const pdfBase64 = await generateInvoicePDFBase64(doc)
      setPhase(2)

      let url = ''
      let updatedDoc = doc
      if (isQuote) {
        const token = doc.acceptanceToken || newToken()
        updatedDoc  = { ...doc, acceptanceToken: token }
        saveDoc(updatedDoc)
        url = `${window.location.origin}/accept-quote/${token}`
        setAcceptUrl(url)

        // Persist quote to server so client can load it on any device
        fetch('/api/billing/store-quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, doc: updatedDoc }),
        }).catch(() => {/* non-blocking */})
      }

      const res = await fetch('/api/billing/send-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          docType:         doc.type,
          docNumber:       doc.docNumber,
          toEmail,         toName,
          fromCompany:     doc.companyName || 'Move Studio',
          fromEmail:       'malcolm@swifter.digital',
          amount:          fmtMoney(totals.total, doc.currency),
          dueDate:         doc.dueDate,
          primaryColour:   doc.colours.primary,
          secondaryColour: doc.colours.secondary,
          accentColour:    doc.colours.accent,
          currency:        doc.currency,
          notes:           doc.notes,
          acceptanceUrl:   url,
        }),
      })
      setPhase(3)
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Server error')
      updateDocStatus(updatedDoc.id, 'sent', { sentAt: new Date().toISOString() })
      setStep('done'); onSent()
    } catch (e: any) {
      setErrMsg(e.message || 'Failed to send. Check server logs.')
      setStep('err')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(acceptUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const STEPS = [
    { label: 'Generate PDF', icon: '📄' },
    { label: 'Send Email',   icon: '📧' },
    { label: 'Confirm',      icon: '✅' },
  ]

  const renderBody = () => {
    if (step === 'sending') return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 20px', gap:32 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
          Sending to {toEmail}
        </div>
        {STEPS.map((s, i) => {
          const done = phase > i + 1, active = phase === i + 1, pending = phase < i + 1
          return (
            <div key={s.label} style={{ display:'flex', alignItems:'center', gap:16, width:'100%', opacity: pending ? 0.3 : 1, transition:'opacity 0.3s' }}>
              <div style={{ width:44, height:44, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                background: done ? '#34d399' : active ? `linear-gradient(135deg,${kit.primary},${kit.secondary})` : 'rgba(255,255,255,0.06)',
                border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: active ? `0 0 20px ${kit.primary}60` : 'none', fontSize: 20, transition:'all 0.4s' }}>
                {done ? '✓' : active ? <span style={{ animation:'spin 1s linear infinite', display:'block' }}>⟳</span> : s.icon}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color: done ? '#34d399' : active ? 'white' : 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:2 }}>{done ? 'Complete' : active ? 'In progress…' : 'Waiting'}</div>
              </div>
            </div>
          )
        })}
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )

    if (step === 'err') return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 20px', gap:16, textAlign:'center' }}>
        <div style={{ fontSize:56 }}>❌</div>
        <div style={{ fontSize:18, fontWeight:800, color:'#f87171' }}>Send Failed</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', maxWidth:300, lineHeight:1.6 }}>{errMsg}</div>
        <button onClick={() => setStep('compose')}
          style={{ marginTop:8, padding:'10px 24px', borderRadius:8, border:`1px solid ${kit.primary}40`, background:`${kit.primary}15`, color:kit.primary, fontSize:13, fontWeight:700, cursor:'pointer' }}>
          ← Try Again
        </button>
      </div>
    )

    if (step === 'done') return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 20px', gap:16, textAlign:'center' }}>
        <div style={{ fontSize:56 }}>🎉</div>
        <div style={{ fontSize:20, fontWeight:900, color:'white' }}>{label} Sent!</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
          Sent to <strong style={{ color:'white' }}>{toEmail}</strong> with PDF attached.
        </div>
        {isQuote && acceptUrl && (
          <div style={{ width:'100%', background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.25)', borderRadius:12, padding:'14px 16px', marginTop:4 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#a78bfa', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Quote Acceptance Link</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', wordBreak:'break-all', marginBottom:10, lineHeight:1.5 }}>{acceptUrl}</div>
            <button onClick={copyLink}
              style={{ width:'100%', padding:'8px', borderRadius:7, border:'1px solid rgba(167,139,250,0.3)', background:'rgba(167,139,250,0.12)', color:'#a78bfa', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              {copied ? '✓ Copied!' : '📋 Copy Link'}
            </button>
          </div>
        )}
        <button onClick={onClose}
          style={{ marginTop:4, padding:'10px 28px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${kit.primary},${kit.secondary})`, color:'white', fontSize:14, fontWeight:700, cursor:'pointer' }}>
          Done
        </button>
      </div>
    )

    // ── Compose (default) ────────────────────────────────────────
    return (
      <div>
        <div style={{ background:`linear-gradient(135deg,${kit.primary}22,${kit.secondary}18)`,
          border:`1px solid ${kit.primary}30`, borderRadius:12, padding:'16px 18px', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
                {label} · {doc.docNumber}
              </div>
              <div style={{ fontSize:22, fontWeight:900, color:'white' }}>{fmtMoney(totals.total, doc.currency)}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              {doc.dueDate && <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Due {doc.dueDate}</div>}
              {isQuote && <div style={{ fontSize:10, marginTop:4, color:'#a78bfa', fontWeight:700 }}>📎 Acceptance link included</div>}
            </div>
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:5 }}>From</label>
          <div style={{ padding:'9px 12px', borderRadius:8, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', fontSize:13, color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', gap:8 }}>
            <span>📧</span> malcolm@swifter.digital
          </div>
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:5 }}>To — Name</label>
          <input style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const }}
            placeholder="Client name…" value={toName} onChange={e => setToName(e.target.value)} />
        </div>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:5 }}>To — Email *</label>
          <input style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:`1px solid ${toEmail ? 'rgba(255,255,255,0.1)' : 'rgba(248,113,113,0.5)'}`, background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const }}
            type="email" placeholder="client@company.com" value={toEmail} onChange={e => setToEmail(e.target.value)} />
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block', marginBottom:5 }}>Subject</label>
          <div style={{ padding:'9px 12px', borderRadius:8, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', fontSize:13, color:'rgba(255,255,255,0.55)' }}>
            {label} {doc.docNumber} from {doc.companyName || 'Move Studio'}
          </div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', marginBottom:20 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Email Preview</div>
          <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.5)', lineHeight:1.7 }}>
            Hi <strong style={{ color:'rgba(255,255,255,0.7)' }}>{toName || 'there'}</strong>,<br/>
            {isQuote
              ? <>Please find your quotation attached. This quote is valid for 30 days.<br/><br/>
                  <span style={{ color:'#a78bfa' }}>✅ Includes a link to accept &amp; digitally sign.</span></>
              : <>Please find your {label.toLowerCase()} attached. Payment of <strong style={{ color: kit.primary }}>{fmtMoney(totals.total, doc.currency)}</strong> due by <strong>{doc.dueDate || '—'}</strong>.</>
            }
            <br/><br/><span style={{ color:'rgba(255,255,255,0.3)' }}>— {doc.companyName || 'Move Studio'}</span>
          </div>
          <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.25)' }}>
            <span>📎</span> {doc.type}-{doc.docNumber}.pdf
          </div>
        </div>

        <button onClick={handleSend}
          style={{ width:'100%', padding:'13px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${kit.primary},${kit.secondary})`,
            color:'white', fontWeight:800, fontSize:15, cursor:'pointer', boxShadow:`0 4px 18px ${kit.primary}50`, marginBottom:10 }}>
          📧 Send {label}
        </button>
        <button onClick={onClose}
          style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'rgba(255,255,255,0.35)', fontSize:13, cursor:'pointer' }}>
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:400, display:'flex', justifyContent:'flex-end' }}>
      <div onClick={step !== 'sending' ? onClose : undefined}
        style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} />
      <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }}
        transition={{ type:'spring', damping:28, stiffness:260 }}
        style={{ position:'relative', width:440, height:'100%', background:'#0d1117',
          borderLeft:'1px solid rgba(255,255,255,0.08)', display:'flex', flexDirection:'column', zIndex:401 }}>
        <div style={{ padding:'18px 24px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)',
          display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ fontWeight:800, fontSize:15, color:'white' }}>
            Send {doc.type === 'invoice' ? 'Invoice' : 'Quotation'}
          </div>
          {step !== 'sending' && (
            <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:20, cursor:'pointer', lineHeight:1 }}>✕</button>
          )}
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
          {renderBody()}
        </div>
      </motion.div>
    </div>
  )
}

// ── Generic Docs Table ────────────────────────────────────────
function DocsTable({ type, kit, onEdit, onSend }: {
  type: 'invoice'|'quote'
  kit: Kit
  onEdit: (doc: BillingDoc) => void
  onSend: (doc: BillingDoc) => void
}) {
  const [docs, setDocs]     = useState<BillingDoc[]>(() => getDocs().filter(d => d.type === type))
  const [filter, setFilter] = useState('all')
  const customers = getCustomers()

  const reload = () => setDocs(getDocs().filter(d => d.type === type))
  const custName = (cid: string) => { const c = customers.find(x => x.id === cid); return c ? (c.company || c.name) : '—' }

  const statuses = type === 'invoice'
    ? ['all','draft','sent','paid','overdue','cancelled']
    : ['all','draft','sent','accepted','declined','expired']

  const filtered = filter === 'all' ? docs : docs.filter(d => d.status === filter)

  const markPaid = (id: string) => { updateDocStatus(id, 'paid', { paidAt: new Date().toISOString() }); reload() }

  return (
    <div>
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:20 }}>
        <div style={{ display:'flex', gap:6 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding:'5px 12px', borderRadius:99, border:`1px solid ${filter===s ? kit.primary : 'rgba(255,255,255,0.1)'}`, background: filter===s ? `${kit.primary}22` : 'transparent', color: filter===s ? 'white' : 'rgba(255,255,255,0.4)', fontSize:11, fontWeight:700, cursor:'pointer', textTransform:'capitalize' }}>
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => onEdit(blankDoc(type, '', '', '', '', '', 'R', kit))}
          style={{ marginLeft:'auto', padding:'8px 20px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${kit.primary},${kit.secondary})`, color:'white', fontWeight:700, fontSize:13, cursor:'pointer', whiteSpace:'nowrap' }}>
          + New {type === 'invoice' ? 'Invoice' : 'Quote'}
        </button>
      </div>

      <div style={{ ...card, padding:0, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead><tr style={{ background:'rgba(255,255,255,0.03)' }}>
            {['Number','Customer','Amount','Status','Date',type==='invoice'?'Due':'Expires','Actions'].map(h => (
              <th key={h} style={{ padding:'12px 14px', textAlign:'left', color:'rgba(255,255,255,0.3)',
                fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em',
                borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} style={{ padding:'40px', textAlign:'center', color:'rgba(255,255,255,0.25)' }}>No {type}s yet</td></tr>}
            {filtered.map(d => {
              const t = calcDocTotals(d.items)
              const alreadyConverted = type==='quote' && !!d.convertedToInvoiceId
              return (
                <tr key={d.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding:'12px 14px', color:'white', fontWeight:600 }}>
                    {d.docNumber}
                    {d.convertedFromQuoteId && <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', marginTop:2 }}>from quote</div>}
                    {alreadyConverted && <div style={{ fontSize:9, color:'#a78bfa', marginTop:2 }}>→ invoiced</div>}
                  </td>
                  <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.7)' }}>{custName(d.customerId)}</td>
                  <td style={{ padding:'12px 14px', color:'white', fontWeight:700 }}>{fmtMoney(t.total, d.currency)}</td>
                  <td style={{ padding:'12px 14px' }}><Badge status={d.status} /></td>
                  <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.4)' }}>{d.issueDate}</td>
                  <td style={{ padding:'12px 14px', color: d.status==='overdue'||d.status==='expired' ? '#f87171' : 'rgba(255,255,255,0.4)' }}>{d.dueDate}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      <button onClick={() => onEdit(d)} style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:`1px solid ${kit.accent}40`, background:`${kit.accent}12`, color:kit.accent, cursor:'pointer', fontWeight:600 }}>👁 Preview</button>
                      <button onClick={() => onSend(d)} style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:`1px solid ${kit.primary}40`, background:`${kit.primary}15`, color:kit.primary, cursor:'pointer' }}>📧 Send</button>
                      {type==='invoice' && d.status!=='paid' && <button onClick={() => markPaid(d.id)} style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid #34d39940', background:'#34d39915', color:'#34d399', cursor:'pointer' }}>✅ Paid</button>}
                      {type==='quote' && !alreadyConverted && (
                        <button onClick={() => { const inv = convertQuoteToInvoice(d.id); reload(); onEdit(inv) }}
                          style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid #a78bfa40', background:'#a78bfa15', color:'#a78bfa', cursor:'pointer', fontWeight:700 }}>
                          → Invoice
                        </button>
                      )}
                      <button onClick={() => onEdit(d)} style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Edit</button>
                      <button onClick={() => { if (confirm('Delete?')) { deleteDoc(d.id); reload() } }} style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.07)', color:'rgba(239,68,68,0.7)', cursor:'pointer' }}>✕</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function InvoicesView({ kit, onEdit, onSend }: { kit: Kit; onEdit: (doc: BillingDoc) => void; onSend: (doc: BillingDoc) => void }) {
  return <DocsTable type="invoice" kit={kit} onEdit={onEdit} onSend={onSend} />
}
export function QuotesView({ kit, onEdit, onSend }: { kit: Kit; onEdit: (doc: BillingDoc) => void; onSend: (doc: BillingDoc) => void }) {
  return <DocsTable type="quote" kit={kit} onEdit={onEdit} onSend={onSend} />
}
export { SendModal }
