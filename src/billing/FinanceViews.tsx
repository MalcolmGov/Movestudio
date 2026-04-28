import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Payment, Expense, calcDocTotals, fmtMoney, EXPENSE_CATEGORIES } from '../billing/types'
import { getPayments, savePayment, deletePayment, getExpenses, saveExpense, deleteExpense, getDocs, getCustomers, newId } from '../billing/store'
import { Modal, Field, inp, lbl, card, Kit } from './BillingShared'

// ── Payments View ─────────────────────────────────────────────
function blankPayment(): Payment {
  return { id: newId(), invoiceId: '', customerId: '', amount: 0, currency: 'R', date: new Date().toISOString().split('T')[0], method: 'bank-transfer', reference: '', notes: '' }
}

function PaymentForm({ initial, onSave, onClose, kit }: { initial: Payment; onSave: (p: Payment) => void; onClose: () => void; kit: Kit }) {
  const [p, setP] = useState(initial)
  const invoices  = getDocs().filter(d => d.type === 'invoice')
  const customers = getCustomers()
  const set = (k: keyof Payment, v: any) => setP(x => ({ ...x, [k]: v }))

  const onSelInv = (invId: string) => {
    const inv = invoices.find(i => i.id === invId)
    const t   = inv ? calcDocTotals(inv.items) : null
    setP(x => ({ ...x, invoiceId: invId, customerId: inv?.customerId || '', amount: t ? t.total : 0, currency: inv?.currency || 'R' }))
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      <Field label="Invoice">
        <select style={{ ...inp, appearance:'none' }} value={p.invoiceId} onChange={e => onSelInv(e.target.value)}>
          <option value="" style={{ background:'#0d1117' }}>— Select Invoice —</option>
          {invoices.map(inv => {
            const c = customers.find(x => x.id === inv.customerId)
            return <option key={inv.id} value={inv.id} style={{ background:'#0d1117' }}>{inv.docNumber} — {c?.name || 'Unknown'} ({fmtMoney(calcDocTotals(inv.items).total, inv.currency)})</option>
          })}
        </select>
      </Field>
      <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
        <Field label="Amount" half><input style={inp} type="number" min={0} step={0.01} value={p.amount} onChange={e => set('amount',+e.target.value)} /></Field>
        <Field label="Currency" half>
          <select style={{ ...inp, appearance:'none' }} value={p.currency} onChange={e => set('currency',e.target.value)}>
            {['R','$','€','£','KES'].map(c => <option key={c} value={c} style={{ background:'#0d1117' }}>{c}</option>)}
          </select>
        </Field>
        <Field label="Date" half><input style={inp} type="date" value={p.date} onChange={e => set('date',e.target.value)} /></Field>
        <Field label="Method" half>
          <select style={{ ...inp, appearance:'none' }} value={p.method} onChange={e => set('method', e.target.value as Payment['method'])}>
            {['bank-transfer','eft','card','cash','other'].map(m => <option key={m} value={m} style={{ background:'#0d1117' }}>{m.replace('-',' ')}</option>)}
          </select>
        </Field>
        <Field label="Reference"><input style={inp} value={p.reference} onChange={e => set('reference',e.target.value)} placeholder="Proof of payment ref" /></Field>
        <Field label="Notes"><textarea style={{ ...inp, minHeight:48, resize:'vertical' }} value={p.notes} onChange={e => set('notes',e.target.value)} /></Field>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:4 }}>
        <button onClick={() => { if (!p.amount) return alert('Amount required'); onSave(p); onClose() }}
          style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${kit.primary},${kit.secondary})`, color:'white', fontWeight:700, fontSize:13, cursor:'pointer' }}>Save Payment</button>
        <button onClick={onClose} style={{ padding:'10px 18px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}

export function PaymentsView({ kit }: { kit: Kit }) {
  const [payments, setPayments] = useState<Payment[]>(getPayments)
  const [modal, setModal]       = useState<Payment | null>(null)
  const invoices  = getDocs().filter(d => d.type === 'invoice')
  const customers = getCustomers()
  const reload = () => setPayments(getPayments())

  const invLabel = (id: string) => { const inv = invoices.find(i => i.id === id); return inv?.docNumber || id }
  const custName = (cid: string) => { const c = customers.find(x => x.id === cid); return c ? (c.company || c.name) : '—' }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
        <button onClick={() => setModal(blankPayment())}
          style={{ padding:'8px 20px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${kit.primary},${kit.secondary})`, color:'white', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          + Log Payment
        </button>
      </div>
      <div style={{ ...card, padding:0, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead><tr style={{ background:'rgba(255,255,255,0.03)' }}>
            {['Invoice','Customer','Amount','Date','Method','Reference',''].map(h => (
              <th key={h} style={{ padding:'12px 14px', textAlign:'left', color:'rgba(255,255,255,0.3)', fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {payments.length === 0 && <tr><td colSpan={7} style={{ padding:'40px', textAlign:'center', color:'rgba(255,255,255,0.25)' }}>No payments logged yet</td></tr>}
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding:'12px 14px', color:'white', fontWeight:600 }}>{invLabel(p.invoiceId)}</td>
                <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.6)' }}>{custName(p.customerId)}</td>
                <td style={{ padding:'12px 14px', color:'#34d399', fontWeight:700 }}>{fmtMoney(p.amount, p.currency)}</td>
                <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.5)' }}>{p.date}</td>
                <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.5)', textTransform:'capitalize' }}>{p.method.replace('-',' ')}</td>
                <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.4)' }}>{p.reference || '—'}</td>
                <td style={{ padding:'12px 14px' }}>
                  <button onClick={() => { if (confirm('Delete payment?')) { deletePayment(p.id); reload() } }} style={{ fontSize:11, padding:'3px 8px', borderRadius:5, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.07)', color:'rgba(239,68,68,0.7)', cursor:'pointer' }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {modal && <Modal title="Log Payment" onClose={() => setModal(null)}>
          <PaymentForm initial={modal} kit={kit} onSave={p => { savePayment(p); reload() }} onClose={() => setModal(null)} />
        </Modal>}
      </AnimatePresence>
    </div>
  )
}

// ── Expenses View ─────────────────────────────────────────────
function blankExpense(): Expense {
  return { id: newId(), date: new Date().toISOString().split('T')[0], vendor: '', category: 'Other', amount: 0, taxRate: 15, notes: '', createdAt: new Date().toISOString() }
}

export function ExpensesView({ kit }: { kit: Kit }) {
  const [expenses, setExpenses] = useState<Expense[]>(getExpenses)
  const [modal, setModal]       = useState<Expense | null>(null)
  const [catFilter, setCatFilter] = useState('All')
  const reload = () => setExpenses(getExpenses())

  const filtered = catFilter === 'All' ? expenses : expenses.filter(e => e.category === catFilter)
  const totalVat = (e: Expense) => e.amount * e.taxRate / 100

  return (
    <div>
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:20 }}>
        <select style={{ ...inp, maxWidth:200, appearance:'none' }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option style={{ background:'#0d1117' }}>All</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} style={{ background:'#0d1117' }}>{c}</option>)}
        </select>
        <button onClick={() => setModal(blankExpense())}
          style={{ marginLeft:'auto', padding:'8px 20px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${kit.primary},${kit.secondary})`, color:'white', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          + New Expense
        </button>
      </div>
      <div style={{ ...card, padding:0, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
          <thead><tr style={{ background:'rgba(255,255,255,0.03)' }}>
            {['Date','Vendor','Category','Amount','VAT','Total',''].map(h => (
              <th key={h} style={{ padding:'12px 14px', textAlign:'left', color:'rgba(255,255,255,0.3)', fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} style={{ padding:'40px', textAlign:'center', color:'rgba(255,255,255,0.25)' }}>No expenses yet</td></tr>}
            {filtered.map(e => (
              <tr key={e.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.6)' }}>{e.date}</td>
                <td style={{ padding:'12px 14px', color:'white', fontWeight:600 }}>{e.vendor}</td>
                <td style={{ padding:'12px 14px' }}><span style={{ fontSize:10, padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.08)' }}>{e.category}</span></td>
                <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.7)' }}>{fmtMoney(e.amount)}</td>
                <td style={{ padding:'12px 14px', color:'rgba(255,255,255,0.4)' }}>{fmtMoney(totalVat(e))}</td>
                <td style={{ padding:'12px 14px', color:'#f87171', fontWeight:700 }}>{fmtMoney(e.amount + totalVat(e))}</td>
                <td style={{ padding:'12px 14px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => setModal(e)} style={{ fontSize:11, padding:'3px 8px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Edit</button>
                    <button onClick={() => { if (confirm('Delete expense?')) { deleteExpense(e.id); reload() } }} style={{ fontSize:11, padding:'3px 8px', borderRadius:5, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.07)', color:'rgba(239,68,68,0.7)', cursor:'pointer' }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {modal && <Modal title={modal.vendor ? `Edit — ${modal.vendor}` : 'New Expense'} onClose={() => setModal(null)}>
          <ExpenseForm initial={modal} kit={kit} onSave={e => { saveExpense(e); reload() }} onClose={() => setModal(null)} />
        </Modal>}
      </AnimatePresence>
    </div>
  )
}

function ExpenseForm({ initial, kit, onSave, onClose }: { initial: Expense; kit: Kit; onSave: (e: Expense) => void; onClose: () => void }) {
  const [e, setE] = useState(initial)
  const set = (k: keyof Expense, v: any) => setE(p => ({ ...p, [k]: v }))
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
      <Field label="Vendor"><input style={inp} value={e.vendor} onChange={x => set('vendor', x.target.value)} placeholder="Supplier / vendor name" /></Field>
      <Field label="Category" half>
        <select style={{ ...inp, appearance:'none' }} value={e.category} onChange={x => set('category', x.target.value)}>
          {EXPENSE_CATEGORIES.map(c => <option key={c} style={{ background:'#0d1117' }}>{c}</option>)}
        </select>
      </Field>
      <Field label="Date" half><input style={inp} type="date" value={e.date} onChange={x => set('date', x.target.value)} /></Field>
      <Field label="Amount (excl. VAT)" half><input style={inp} type="number" min={0} step={0.01} value={e.amount} onChange={x => set('amount', +x.target.value)} /></Field>
      <Field label="VAT %" half><input style={inp} type="number" min={0} max={100} value={e.taxRate} onChange={x => set('taxRate', +x.target.value)} /></Field>
      <Field label="Notes"><textarea style={{ ...inp, minHeight:48, resize:'vertical' }} value={e.notes} onChange={x => set('notes', x.target.value)} /></Field>
      <div style={{ flex:'0 0 100%', display:'flex', gap:8 }}>
        <button onClick={() => { if (!e.vendor || !e.amount) return alert('Vendor and amount required'); onSave(e); onClose() }}
          style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${kit.primary},${kit.secondary})`, color:'white', fontWeight:700, fontSize:13, cursor:'pointer' }}>Save Expense</button>
        <button onClick={onClose} style={{ padding:'10px 18px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}
