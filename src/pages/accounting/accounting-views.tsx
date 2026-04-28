import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Transaction, BudgetItem, TxType, INCOME_CATS, EXPENSE_CATS, CAT_ICONS, fmt, fmtShort, isIncome, getTotals, getMonthlyData, getCategoryTotals, monthKey, monthLabel, VAT_RATE } from './accounting-data'
import { KpiCard, TypeBadge, card, lbl } from './accounting-components'

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function DashboardView({ transactions, onAdd }: { transactions:Transaction[]; onAdd:(type?:TxType)=>void }) {
  const all = getTotals(transactions)
  const monthly = getMonthlyData(transactions)
  const thisMonth = monthly[monthly.length-1] || { income:0, expense:0, profit:0 }
  const maxVal = Math.max(...monthly.map(m=>m.income), 1)
  const recent = [...transactions].sort((a,b)=>b.date-a.date).slice(0,6)
  const incomeByCat = getCategoryTotals(transactions,'income')
  const topCat = Object.entries(incomeByCat).sort(([,a],[,b])=>b-a)[0]
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:28, maxWidth:1100, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Finance Overview</h1>
          <p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>P&L, cash position & VAT summary</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>onAdd('expense')} style={{ padding:'10px 18px', borderRadius:9, border:'1px solid rgba(248,113,113,0.3)', background:'rgba(248,113,113,0.08)', color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer' }}>↓ Add Expense</button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={()=>onAdd('income')} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#059669,#34d399)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>↑ Add Income</motion.button>
        </div>
      </div>
      {/* KPIs */}
      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
        <KpiCard label="Total Revenue (YTD)" value={fmtShort(all.income)} sub="All income transactions" color="#34d399"/>
        <KpiCard label="Total Expenses (YTD)" value={fmtShort(all.expense)} sub="All expense transactions" color="#f87171"/>
        <KpiCard label="Net Profit (YTD)" value={fmtShort(all.profit)} sub={`${all.income>0?Math.round((all.profit/all.income)*100):0}% margin`} color={all.profit>=0?'#60a5fa':'#f87171'}/>
        <KpiCard label="VAT Due" value={fmtShort(all.vatDue)} sub="Output - Input VAT" color="#fbbf24"/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Monthly trend — SVG bar chart */}
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Monthly Trend</div>
          <svg width="100%" height="120" viewBox={`0 0 ${Math.max(monthly.length,1)*52} 110`} preserveAspectRatio="none" style={{ overflow:'visible' }}>
            {monthly.map((m, i) => {
              const x = i * 52
              const incH = maxVal > 0 ? Math.max((m.income / maxVal) * 90, 2) : 2
              const expH = maxVal > 0 ? Math.max((m.expense / maxVal) * 90, 2) : 2
              return (
                <g key={m.key}>
                  <title>{m.month}: Income {fmt(m.income)} | Expenses {fmt(m.expense)}</title>
                  <rect x={x+2}  y={90-incH} width={21} height={incH} rx={3} fill="#34d399" opacity={0.75}/>
                  <rect x={x+26} y={90-expH} width={21} height={expH} rx={3} fill="#f87171" opacity={0.75}/>
                  <text x={x+26} y={108} fontSize={9} fill="rgba(255,255,255,0.35)" textAnchor="middle">{m.month.split(' ')[0]}</text>
                </g>
              )
            })}
          </svg>
          <div style={{ display:'flex', gap:16, marginTop:4 }}>
            {[['#34d399','Income'],['#f87171','Expenses']].map(([c,l])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(255,255,255,0.5)' }}><div style={{ width:10, height:10, borderRadius:2, background:c }}/>{l}</div>
            ))}
          </div>
        </div>
        {/* This month summary */}
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>This Month</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[{label:'Revenue',val:thisMonth.income,color:'#34d399'},{label:'Expenses',val:thisMonth.expense,color:'#f87171'},{label:'Net Profit',val:thisMonth.profit,color:thisMonth.profit>=0?'#60a5fa':'#f87171'}].map(({label,val,color})=>(
              <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>{label}</span>
                <span style={{ fontSize:17, fontWeight:800, color }}>{fmt(val)}</span>
              </div>
            ))}
            {topCat && (
              <div style={{ padding:'12px 14px', borderRadius:9, background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.15)' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>Top Revenue Source (YTD)</div>
                <div style={{ fontSize:13, fontWeight:700, color:'#fbbf24' }}>{CAT_ICONS[topCat[0]]} {topCat[0]}</div>
                <div style={{ fontSize:13, color:'white', marginTop:2 }}>{fmt(topCat[1])}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Recent transactions */}
      <div style={card}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Recent Transactions</div>
        {recent.map((t,i)=>(
          <div key={t.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 4px', borderBottom:i<recent.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
            <div style={{ width:36, height:36, borderRadius:9, background:t.type==='income'?'rgba(52,211,153,0.12)':'rgba(248,113,113,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, flexShrink:0 }}>{CAT_ICONS[t.category]||'💰'}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:13 }}>{t.description}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:1 }}>{t.category} · {new Date(t.date).toLocaleDateString('en-ZA')}</div>
            </div>
            <TypeBadge type={t.type}/>
            <div style={{ fontWeight:800, fontSize:14, color:t.type==='income'?'#34d399':'#f87171', minWidth:80, textAlign:'right' }}>{t.type==='expense'?'-':''}{fmt(t.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Transactions View ────────────────────────────────────────────────────────
export function TransactionsView({ transactions, onAdd, onEdit, onDelete }: { transactions:Transaction[]; onAdd:(type?:TxType)=>void; onEdit:(t:Transaction)=>void; onDelete:(id:string)=>void }) {
  const [typeFilter, setTypeFilter] = useState<TxType|'all'>('all')
  const [search, setSearch] = useState('')
  const [monthFilter, setMonthFilter] = useState('all')
  const months = [...new Set(transactions.map(t=>monthKey(t.date)))].sort().reverse()
  const filtered = transactions.filter(t=>{
    const q=search.toLowerCase()
    return (typeFilter==='all'||t.type===typeFilter) && (!q||t.description.toLowerCase().includes(q)||t.category.toLowerCase().includes(q)||t.reference.toLowerCase().includes(q)) && (monthFilter==='all'||monthKey(t.date)===monthFilter)
  }).sort((a,b)=>b.date-a.date)
  const totals = getTotals(filtered)
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, width:'100%', maxWidth:1100 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Transactions</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{transactions.length} records</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>onAdd('expense')} style={{ padding:'10px 16px', borderRadius:9, border:'1px solid rgba(248,113,113,0.3)', background:'rgba(248,113,113,0.08)', color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer' }}>↓ Expense</button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={()=>onAdd('income')} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#059669,#34d399)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>↑ Income</motion.button>
        </div>
      </div>
      {/* Summary strip */}
      <div style={{ display:'flex', gap:12 }}>
        {[{label:'Income',val:totals.income,color:'#34d399'},{label:'Expenses',val:totals.expense,color:'#f87171'},{label:'Net',val:totals.profit,color:totals.profit>=0?'#60a5fa':'#f87171'}].map(x=>(
          <div key={x.label} style={{ flex:1, padding:'14px 16px', borderRadius:11, background:'#080b14', border:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{x.label}</span>
            <span style={{ fontWeight:800, fontSize:15, color:x.color }}>{fmt(x.val)}</span>
          </div>
        ))}
      </div>
      {/* Filters */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions…" style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none' }}/>
        <div style={{ display:'flex', gap:6 }}>
          {([['all','All'],['income','Income'],['expense','Expenses']] as [string,string][]).map(([k,l])=>(
            <button key={k} onClick={()=>setTypeFilter(k as any)} style={{ padding:'8px 14px', borderRadius:8, border:`1px solid ${typeFilter===k?k==='income'?'#34d399':k==='expense'?'#f87171':'rgba(255,255,255,0.3)':'rgba(255,255,255,0.1)'}`, background:typeFilter===k?k==='income'?'rgba(52,211,153,0.12)':k==='expense'?'rgba(248,113,113,0.12)':'rgba(255,255,255,0.07)':'transparent', color:typeFilter===k?k==='income'?'#34d399':k==='expense'?'#f87171':'white':'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, cursor:'pointer' }}>{l}</button>
          ))}
        </div>
        <select value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} style={{ ...{ padding:'8px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:12, cursor:'pointer', outline:'none' } }}>
          <option value="all">All months</option>
          {months.map(m=><option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
      </div>
      {/* Table */}
      <div style={{ ...card, padding:0, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1.5fr 1fr 1fr 80px 80px', padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {['Description','Category','Date','Amount','Type',''].map(h=><span key={h}>{h}</span>)}
        </div>
        {filtered.length===0 && <div style={{ padding:'32px 20px', textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.3)' }}>No transactions found</div>}
        {filtered.map((t,i)=>(
          <motion.div key={t.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.02 }}
            style={{ display:'grid', gridTemplateColumns:'2.5fr 1.5fr 1fr 1fr 80px 80px', padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center', cursor:'pointer' }}
            onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.02)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
            <div>
              <div style={{ fontWeight:600, fontSize:13 }}>{t.description}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:1 }}>{t.reference} {t.reconciled&&<span style={{ color:'#34d399', marginLeft:6 }}>✓ Reconciled</span>}</div>
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{CAT_ICONS[t.category]} {t.category}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{new Date(t.date).toLocaleDateString('en-ZA')}</div>
            <div style={{ fontWeight:800, fontSize:14, color:t.type==='income'?'#34d399':'#f87171' }}>{t.type==='expense'?'-':''}{fmt(t.amount)}</div>
            <div><TypeBadge type={t.type}/></div>
            <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
              <button onClick={()=>onEdit(t)} style={{ padding:'3px 8px', borderRadius:5, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', fontSize:11, cursor:'pointer' }}>Edit</button>
              <button onClick={()=>onDelete(t.id)} style={{ padding:'3px 8px', borderRadius:5, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#f87171', fontSize:11, cursor:'pointer' }}>✕</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── P&L Report ───────────────────────────────────────────────────────────────
export function ReportsView({ transactions }: { transactions:Transaction[] }) {
  const [period, setPeriod] = useState('all')
  const months = [...new Set(transactions.map(t=>monthKey(t.date)))].sort().reverse()
  const filtered = period==='all' ? transactions : transactions.filter(t=>monthKey(t.date)===period)
  const incomeCats = getCategoryTotals(filtered,'income')
  const expenseCats = getCategoryTotals(filtered,'expense')
  const totals = getTotals(filtered)
  const margin = totals.income>0 ? Math.round((totals.profit/totals.income)*100) : 0
  const renderSection = (title:string, cats:Record<string,number>, color:string, total:number) => (
    <div>
      <div style={{ fontWeight:800, fontSize:13, color, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>{title}</div>
      {Object.entries(cats).sort(([,a],[,b])=>b-a).map(([cat,val])=>{
        const pct = total>0?(val/total)*100:0
        return (
          <div key={cat} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:13 }}>
              <span style={{ color:'rgba(255,255,255,0.7)' }}>{CAT_ICONS[cat]} {cat}</span>
              <span style={{ fontWeight:700 }}>{fmt(val)}</span>
            </div>
            <div style={{ height:4, borderRadius:99, background:'rgba(255,255,255,0.06)' }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7 }} style={{ height:'100%', borderRadius:99, background:color }}/>
            </div>
          </div>
        )
      })}
      <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 14px', borderRadius:9, background:`${color}12`, border:`1px solid ${color}30`, marginTop:8 }}>
        <span style={{ fontWeight:800, fontSize:13, color }}>Total {title}</span>
        <span style={{ fontWeight:900, fontSize:15, color }}>{fmt(total)}</span>
      </div>
    </div>
  )
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:24, maxWidth:860, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>P&L Report</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>Profit & Loss Statement</p></div>
        <select value={period} onChange={e=>setPeriod(e.target.value)} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'#080b14', color:'white', fontSize:13, cursor:'pointer', outline:'none' }}>
          <option value="all">All time</option>
          {months.map(m=><option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
      </div>
      {/* Summary */}
      <div style={{ display:'flex', gap:12 }}>
        {[{l:'Revenue',v:totals.income,c:'#34d399'},{l:'Expenses',v:totals.expense,c:'#f87171'},{l:'Net Profit',v:totals.profit,c:totals.profit>=0?'#60a5fa':'#f87171'},{l:'Margin',v:margin,c:'#fbbf24',pct:true}].map(x=>(
          <div key={x.l} style={{ flex:1, padding:'16px', borderRadius:11, background:'#080b14', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{x.l}</div>
            <div style={{ fontSize:18, fontWeight:900, color:x.c }}>{x.pct?`${x.v}%`:fmt(x.v)}</div>
          </div>
        ))}
      </div>
      {/* Breakdown */}
      <div style={{ ...card, display:'flex', flexDirection:'column', gap:24 }}>
        {renderSection('Revenue', incomeCats, '#34d399', totals.income)}
        <div style={{ height:1, background:'rgba(255,255,255,0.07)' }}/>
        {renderSection('Expenses', expenseCats, '#f87171', totals.expense)}
        <div style={{ height:1, background:'rgba(255,255,255,0.07)' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderRadius:11, background:totals.profit>=0?'rgba(96,165,250,0.08)':'rgba(248,113,113,0.08)', border:`1px solid ${totals.profit>=0?'rgba(96,165,250,0.2)':'rgba(248,113,113,0.2)'}` }}>
          <span style={{ fontWeight:900, fontSize:16 }}>NET PROFIT / (LOSS)</span>
          <span style={{ fontWeight:900, fontSize:22, color:totals.profit>=0?'#60a5fa':'#f87171' }}>{fmt(totals.profit)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── VAT Report ───────────────────────────────────────────────────────────────
export function VATView({ transactions }: { transactions:Transaction[] }) {
  const [period, setPeriod] = useState('all')
  const months = [...new Set(transactions.map(t=>monthKey(t.date)))].sort().reverse()
  const filtered = period==='all' ? transactions : transactions.filter(t=>monthKey(t.date)===period)
  const totals = getTotals(filtered)
  const vatTx = filtered.filter(t=>t.vatAmount>0)
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:24, maxWidth:860, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>VAT Report</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>SARS VAT 201 summary — 15% standard rate</p></div>
        <select value={period} onChange={e=>setPeriod(e.target.value)} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'#080b14', color:'white', fontSize:13, cursor:'pointer', outline:'none' }}>
          <option value="all">All time</option>
          {months.map(m=><option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
      </div>
      {/* VAT summary */}
      <div style={{ display:'flex', gap:12 }}>
        {[{l:'Output VAT (on sales)',v:totals.outputVat,c:'#34d399',desc:'VAT you charged customers'},{l:'Input VAT (on expenses)',v:totals.inputVat,c:'#f87171',desc:'VAT you paid to suppliers'},{l:'VAT Payable to SARS',v:totals.vatDue,c:totals.vatDue>=0?'#fbbf24':'#a78bfa',desc:totals.vatDue>=0?'Amount owed to SARS':'VAT refund due to you'}].map(x=>(
          <div key={x.l} style={{ flex:1, padding:'20px', borderRadius:12, background:'#080b14', border:`1px solid ${x.c}30` }}>
            <div style={{ fontSize:11, color:x.c, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{x.l}</div>
            <div style={{ fontSize:22, fontWeight:900, color:x.c, marginBottom:6 }}>{fmt(x.v)}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{x.desc}</div>
          </div>
        ))}
      </div>
      {/* VAT transactions */}
      <div style={card}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>VAT Transactions ({vatTx.length})</div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {['Description','Type','Gross Amount','VAT Amount'].map(h=><span key={h}>{h}</span>)}
        </div>
        {vatTx.length===0 && <div style={{ padding:'24px', textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.3)' }}>No VAT transactions in this period</div>}
        {vatTx.map((t,i)=>(
          <div key={t.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'11px 12px', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center' }}>
            <div><div style={{ fontSize:13, fontWeight:600 }}>{t.description}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{new Date(t.date).toLocaleDateString('en-ZA')}</div></div>
            <div><span style={{ fontSize:11, padding:'2px 8px', borderRadius:99, background:t.type==='income'?'rgba(52,211,153,0.12)':'rgba(248,113,113,0.12)', color:t.type==='income'?'#34d399':'#f87171', fontWeight:700 }}>{t.type==='income'?'Output':'Input'}</span></div>
            <div style={{ fontWeight:700, fontSize:13 }}>{fmt(t.amount)}</div>
            <div style={{ fontWeight:700, fontSize:13, color:t.type==='income'?'#34d399':'#f87171' }}>{fmt(t.vatAmount)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
