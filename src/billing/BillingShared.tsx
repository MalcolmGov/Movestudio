import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Customer, BillingDoc, Payment, Expense, DocType, InvoiceStatus, QuoteStatus,
  calcDocTotals, fmtMoney, STATUS_COLOURS, EXPENSE_CATEGORIES, LineItem,
} from '../billing/types'
import {
  getCustomers, saveCustomer, deleteCustomer,
  getDocs, saveDoc, deleteDoc, updateDocStatus,
  getPayments, savePayment, deletePayment,
  getExpenses, saveExpense, deleteExpense,
  getBillingStats, newId,
} from '../billing/store'

// ── Brand Kit ─────────────────────────────────────────────────
interface Kit { primary: string; secondary: string; accent: string; font: string }
function loadKit(): Kit {
  try {
    const raw = sessionStorage.getItem('wb_project') || sessionStorage.getItem('bs_active_project')
    if (raw) { const p = JSON.parse(raw); if (p?.brandKit) return p.brandKit }
  } catch {}
  return { primary: '#6366f1', secondary: '#0ea5e9', accent: '#f59e0b', font: 'Inter' }
}

// ── Shared styles ─────────────────────────────────────────────
const inp: React.CSSProperties = { width: '100%', padding: '8px 11px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 12.5, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'block' }
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 22px' }

// ── Status Badge ──────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  const c = STATUS_COLOURS[status] || '#94a3b8'
  return <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: c + '22', color: c, border: `1px solid ${c}44`, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{status}</span>
}

// ── Slide-in Modal ────────────────────────────────────────────
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        style={{ position: 'relative', width: wide ? 560 : 420, height: '100%', background: '#0d1117', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', zIndex: 201 }}>
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: 'white' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>{children}</div>
      </motion.div>
    </div>
  )
}

// ── Field row ─────────────────────────────────────────────────
function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return <div style={{ flex: half ? '0 0 calc(50% - 6px)' : '0 0 100%', marginBottom: 14 }}>
    <label style={lbl}>{label}</label>{children}
  </div>
}

// ─────────────────────────────────────────────────────────────
// ── DASHBOARD VIEW ────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
function DashboardView({ kit, onNav }: { kit: Kit; onNav: (v: string) => void }) {
  const stats = getBillingStats()
  const docs  = getDocs().slice(0, 6)
  const kpis = [
    { label: 'Outstanding', value: fmtMoney(stats.outstanding), icon: '💳', color: kit.primary, sub: 'Unpaid invoices' },
    { label: 'Overdue',     value: stats.overdue.toString(),    icon: '⚠️', color: '#f87171', sub: 'Require attention' },
    { label: 'Paid This Month', value: fmtMoney(stats.paidThisMonth), icon: '✅', color: '#34d399', sub: 'Payments received' },
    { label: 'Customers',   value: stats.totalCustomers.toString(), icon: '👥', color: kit.accent, sub: 'Total active' },
  ]
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {kpis.map(k => (
          <motion.div key={k.label} whileHover={{ y: -2 }} style={{ ...card, borderTop: `2px solid ${k.color}` }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>{k.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{k.label}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{k.sub}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ ...card }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Documents</div>
        {docs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
            No documents yet — <span style={{ color: kit.accent, cursor: 'pointer' }} onClick={() => onNav('invoices')}>create your first invoice</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr>{['Number','Type','Customer','Amount','Status','Date'].map(h => <th key={h} style={{ textAlign:'left', padding:'6px 10px', color:'rgba(255,255,255,0.3)', fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>)}</tr></thead>
            <tbody>{docs.map(d => {
              const t = calcDocTotals(d.items)
              return <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding:'10px', color:'white', fontWeight:600 }}>{d.docNumber}</td>
                <td style={{ padding:'10px', color:'rgba(255,255,255,0.5)', textTransform:'capitalize' }}>{d.type}</td>
                <td style={{ padding:'10px', color:'rgba(255,255,255,0.7)' }}>{d.companyName || '—'}</td>
                <td style={{ padding:'10px', color:'white', fontWeight:700 }}>{fmtMoney(t.total, d.currency)}</td>
                <td style={{ padding:'10px' }}><Badge status={d.status} /></td>
                <td style={{ padding:'10px', color:'rgba(255,255,255,0.4)' }}>{d.issueDate}</td>
              </tr>
            })}</tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ── CUSTOMERS VIEW ────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
function blankCustomer(): Customer {
  return { id: newId(), name: '', company: '', email: '', phone: '', address: '', currency: 'R', notes: '', createdAt: new Date().toISOString() }
}

function CustomerForm({ initial, onSave, onClose }: { initial: Customer; onSave: (c: Customer) => void; onClose: () => void }) {
  const [c, setC] = useState(initial)
  const set = (k: keyof Customer, v: string) => setC(p => ({ ...p, [k]: v }))
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <Field label="Full Name" half><input style={inp} value={c.name} onChange={e => set('name', e.target.value)} /></Field>
        <Field label="Company Name" half><input style={inp} value={c.company} onChange={e => set('company', e.target.value)} /></Field>
        <Field label="Email" half><input style={inp} type="email" value={c.email} onChange={e => set('email', e.target.value)} /></Field>
        <Field label="Phone" half><input style={inp} value={c.phone} onChange={e => set('phone', e.target.value)} /></Field>
        <Field label="Address"><textarea style={{ ...inp, minHeight: 64, resize: 'vertical' }} value={c.address} onChange={e => set('address', e.target.value)} /></Field>
        <Field label="Currency" half>
          <select style={{ ...inp, appearance: 'none' }} value={c.currency} onChange={e => set('currency', e.target.value)}>
            {['R','$','€','£','KES','NGN','GHS'].map(x => <option key={x} value={x} style={{ background:'#0d1117' }}>{x}</option>)}
          </select>
        </Field>
        <Field label="Notes"><textarea style={{ ...inp, minHeight: 48, resize: 'vertical' }} value={c.notes} onChange={e => set('notes', e.target.value)} placeholder="Internal notes…" /></Field>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => { if (!c.name || !c.email) return alert('Name and email required'); onSave(c); onClose() }}
          style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg,#6366f1,#0ea5e9)`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          Save Customer
        </button>
        <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}

function CustomersView({ kit }: { kit: Kit }) {
  const [customers, setCustomers] = useState<Customer[]>(getCustomers)
  const [modal, setModal] = useState<Customer | null>(null)
  const [search, setSearch] = useState('')
  const reload = () => setCustomers(getCustomers())

  const filtered = customers.filter(c =>
    `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(search.toLowerCase()))

  // Compute receivables per customer
  const receivables = (cid: string) => {
    const docs = getDocs().filter(d => d.customerId === cid && d.type === 'invoice' && d.status !== 'paid' && d.status !== 'cancelled')
    return docs.reduce((s, d) => s + calcDocTotals(d.items).total, 0)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <input style={{ ...inp, maxWidth: 280 }} placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={() => setModal(blankCustomer())}
          style={{ marginLeft: 'auto', padding: '8px 20px', borderRadius: 8, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + New Customer
        </button>
      </div>
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead><tr style={{ background: 'rgba(255,255,255,0.03)' }}>
            {['Name','Company','Email','Phone','Receivables','Actions'].map(h => (
              <th key={h} style={{ padding:'12px 16px', textAlign:'left', color:'rgba(255,255,255,0.35)', fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.07em', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding:'40px', textAlign:'center', color:'rgba(255,255,255,0.25)' }}>No customers found</td></tr>
            )}
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding:'13px 16px', fontWeight:600, color:'white' }}>{c.name}</td>
                <td style={{ padding:'13px 16px', color:'rgba(255,255,255,0.6)' }}>{c.company || '—'}</td>
                <td style={{ padding:'13px 16px', color: kit.primary }}>{c.email}</td>
                <td style={{ padding:'13px 16px', color:'rgba(255,255,255,0.5)' }}>{c.phone || '—'}</td>
                <td style={{ padding:'13px 16px', color: receivables(c.id) > 0 ? '#f87171' : 'rgba(255,255,255,0.4)', fontWeight:600 }}>{fmtMoney(receivables(c.id), c.currency)}</td>
                <td style={{ padding:'13px 16px' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => setModal(c)} style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', cursor:'pointer' }}>Edit</button>
                    <button onClick={() => { if (confirm('Delete customer?')) { deleteCustomer(c.id); reload() } }}
                      style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid rgba(239,68,68,0.2)', background:'rgba(239,68,68,0.07)', color:'rgba(239,68,68,0.7)', cursor:'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {modal && (
          <Modal title={modal.name ? `Edit — ${modal.name}` : 'New Customer'} onClose={() => setModal(null)}>
            <CustomerForm initial={modal} onSave={c => { saveCustomer(c); reload() }} onClose={() => setModal(null)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export { DashboardView, CustomersView, Badge, Modal, Field, inp, lbl, card, loadKit }
export type { Kit }
