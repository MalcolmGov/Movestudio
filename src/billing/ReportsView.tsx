import React, { useState } from 'react'
import { getDocs, getPayments, getExpenses, getCustomers } from '../billing/store'
import { calcDocTotals, fmtMoney, EXPENSE_CATEGORIES } from '../billing/types'
import { card, Kit } from './BillingShared'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function ReportsView({ kit }: { kit: Kit }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())

  const docs      = getDocs()
  const payments  = getPayments()
  const expenses  = getExpenses()
  const customers = getCustomers()

  // Monthly income (payments received)
  const monthlyIncome = Array.from({ length: 12 }, (_, m) => {
    const iso = `${year}-${String(m+1).padStart(2,'0')}`
    return payments.filter(p => p.date.startsWith(iso)).reduce((s,p) => s + p.amount, 0)
  })

  // Monthly expenses
  const monthlyExpenses = Array.from({ length: 12 }, (_, m) => {
    const iso = `${year}-${String(m+1).padStart(2,'0')}`
    return expenses.filter(e => e.date.startsWith(iso)).reduce((s,e) => s + e.amount * (1 + e.taxRate/100), 0)
  })

  const maxBar = Math.max(...monthlyIncome, ...monthlyExpenses, 1)
  const totalIncome   = monthlyIncome.reduce((s,v) => s+v, 0)
  const totalExpenses = monthlyExpenses.reduce((s,v) => s+v, 0)

  // Outstanding invoices
  const outstanding = docs.filter(d => d.type==='invoice' && d.status==='sent')
  const overdue     = docs.filter(d => d.type==='invoice' && (d.status==='overdue' || (d.status==='sent' && d.dueDate < now.toISOString().split('T')[0])))

  // Receivables by customer
  const byCustomer = customers.map(c => {
    const total = docs.filter(d => d.customerId===c.id && d.type==='invoice' && d.status!=='paid' && d.status!=='cancelled')
      .reduce((s,d) => s + calcDocTotals(d.items).total, 0)
    return { ...c, receivable: total }
  }).filter(c => c.receivable > 0).sort((a,b) => b.receivable - a.receivable)

  // Expenses by category
  const byCat = EXPENSE_CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s,e) => s + e.amount, 0),
  })).filter(x => x.total > 0).sort((a,b) => b.total - a.total)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header controls */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ fontWeight:800, fontSize:15, color:'white' }}>Financial Overview</div>
        <select style={{ marginLeft:'auto', padding:'6px 10px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:12, outline:'none' }}
          value={year} onChange={e => setYear(+e.target.value)}>
          {[now.getFullYear()-1, now.getFullYear(), now.getFullYear()+1].map(y => <option key={y} value={y} style={{ background:'#0d1117' }}>{y}</option>)}
        </select>
      </div>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:'Total Income', value: fmtMoney(totalIncome), color: '#34d399', icon:'📈' },
          { label:'Total Expenses', value: fmtMoney(totalExpenses), color: '#f87171', icon:'📉' },
          { label:'Net Profit', value: fmtMoney(totalIncome - totalExpenses), color: totalIncome-totalExpenses >= 0 ? '#34d399' : '#f87171', icon:'💰' },
        ].map(k => (
          <div key={k.label} style={{ ...card, borderTop:`2px solid ${k.color}` }}>
            <div style={{ fontSize:18, marginBottom:6 }}>{k.icon}</div>
            <div style={{ fontSize:20, fontWeight:900, color:k.color, letterSpacing:'-0.03em' }}>{k.value}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{k.label} — {year}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ ...card }}>
        <div style={{ fontWeight:800, fontSize:12, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>Income vs Expenses — {year}</div>
        <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:120 }}>
          {MONTHS.map((m, i) => (
            <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', gap:2, alignItems:'center' }}>
              <div style={{ width:'100%', display:'flex', gap:1, alignItems:'flex-end', height:100 }}>
                <div style={{ flex:1, height:Math.round((monthlyIncome[i]/maxBar)*100), background:`${kit.primary}cc`, borderRadius:'3px 3px 0 0', minHeight: monthlyIncome[i]>0?4:0 }} title={fmtMoney(monthlyIncome[i])} />
                <div style={{ flex:1, height:Math.round((monthlyExpenses[i]/maxBar)*100), background:'rgba(248,113,113,0.7)', borderRadius:'3px 3px 0 0', minHeight: monthlyExpenses[i]>0?4:0 }} title={fmtMoney(monthlyExpenses[i])} />
              </div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', marginTop:4 }}>{m}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, marginTop:12 }}>
          <div style={{ display:'flex', gap:6, alignItems:'center', fontSize:11, color:'rgba(255,255,255,0.5)' }}>
            <div style={{ width:10, height:10, borderRadius:2, background:kit.primary }} /> Income
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center', fontSize:11, color:'rgba(255,255,255,0.5)' }}>
            <div style={{ width:10, height:10, borderRadius:2, background:'rgba(248,113,113,0.7)' }} /> Expenses
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Receivables by customer */}
        <div style={{ ...card }}>
          <div style={{ fontWeight:800, fontSize:12, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Receivables by Customer</div>
          {byCustomer.length === 0
            ? <div style={{ color:'rgba(255,255,255,0.2)', fontSize:12 }}>No outstanding receivables</div>
            : byCustomer.map(c => (
              <div key={c.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:12 }}>
                <span style={{ color:'rgba(255,255,255,0.7)' }}>{c.company || c.name}</span>
                <span style={{ color:'#f87171', fontWeight:700 }}>{fmtMoney(c.receivable, c.currency)}</span>
              </div>
            ))
          }
        </div>

        {/* Expenses by category */}
        <div style={{ ...card }}>
          <div style={{ fontWeight:800, fontSize:12, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>Expenses by Category</div>
          {byCat.length === 0
            ? <div style={{ color:'rgba(255,255,255,0.2)', fontSize:12 }}>No expenses recorded</div>
            : byCat.map(x => (
              <div key={x.cat} style={{ padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                  <span style={{ color:'rgba(255,255,255,0.6)' }}>{x.cat}</span>
                  <span style={{ color:'rgba(255,255,255,0.8)', fontWeight:600 }}>{fmtMoney(x.total)}</span>
                </div>
                <div style={{ height:3, borderRadius:99, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.round((x.total/totalExpenses)*100)||0}%`, background:`${kit.accent}cc`, borderRadius:99 }} />
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Overdue invoices */}
      {overdue.length > 0 && (
        <div style={{ ...card, border:'1px solid rgba(248,113,113,0.2)', background:'rgba(248,113,113,0.05)' }}>
          <div style={{ fontWeight:800, fontSize:12, color:'#f87171', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:12 }}>⚠️ Overdue Invoices ({overdue.length})</div>
          {overdue.map(d => {
            const cust = customers.find(c => c.id === d.customerId)
            return (
              <div key={d.id} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(248,113,113,0.1)', fontSize:12 }}>
                <span style={{ color:'rgba(255,255,255,0.7)' }}>{d.docNumber} — {cust?.company || cust?.name || 'Unknown'}</span>
                <span style={{ color:'#f87171', fontWeight:700 }}>{fmtMoney(calcDocTotals(d.items).total, d.currency)} <span style={{ color:'rgba(255,255,255,0.3)', fontWeight:400 }}>due {d.dueDate}</span></span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
