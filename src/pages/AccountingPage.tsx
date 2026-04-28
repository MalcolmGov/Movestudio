import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import StudioSidebar from '../components/StudioSidebar'
import { Transaction, TxType, loadAcc, saveAcc, getTotals, fmt } from './accounting/accounting-data'
import { AddTxModal } from './accounting/accounting-components'
import { DashboardView, TransactionsView, ReportsView, VATView } from './accounting/accounting-views'

type View = 'dashboard'|'transactions'|'reports'|'vat'

const NAV: { id:View; icon:string; label:string }[] = [
  { id:'dashboard',    icon:'📊', label:'Overview'     },
  { id:'transactions', icon:'📋', label:'Transactions' },
  { id:'reports',      icon:'📈', label:'P&L Report'   },
  { id:'vat',          icon:'🧾', label:'VAT Report'   },
]

export default function AccountingPage() {
  const [data, setData] = useState(() => loadAcc())
  const [view, setView] = useState<View>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction|undefined>()
  const [defaultType, setDefaultType] = useState<TxType|undefined>()

  const { transactions, budgets } = data

  const save = (txs: Transaction[]) => {
    saveAcc(txs, budgets)
    setData({ transactions:txs, budgets })
  }

  const openAdd = (type?: TxType) => {
    setEditingTx(undefined); setDefaultType(type); setShowModal(true)
  }

  const saveTx = (t: Transaction) => {
    const exists = transactions.find(x=>x.id===t.id)
    save(exists ? transactions.map(x=>x.id===t.id?t:x) : [...transactions, t])
    setShowModal(false); setEditingTx(undefined)
  }

  const deleteTx = (id: string) => save(transactions.filter(t=>t.id!==id))

  const totals = getTotals(transactions)
  const unreconciled = transactions.filter(t=>!t.reconciled).length

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'var(--font, Inter, sans-serif)', background:'#040608', color:'white', overflow:'hidden' }}>
      <StudioSidebar collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(p=>!p)}/>

      {/* Sub-nav */}
      <div style={{ width:180, flexShrink:0, background:'#080b14', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', padding:'20px 10px', gap:4 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 6px', marginBottom:10 }}>Finance</div>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:`1px solid ${view===item.id?'rgba(52,211,153,0.4)':'transparent'}`, background:view===item.id?'rgba(52,211,153,0.08)':'transparent', color:view===item.id?'white':'rgba(255,255,255,0.5)', fontSize:13, fontWeight:view===item.id?700:500, cursor:'pointer', textAlign:'left', width:'100%' }}>
            <span style={{ fontSize:16 }}>{item.icon}</span> {item.label}
            {item.id==='transactions' && unreconciled>0 && (
              <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, color:'#fbbf24', background:'rgba(251,191,36,0.15)', padding:'1px 6px', borderRadius:99 }}>{unreconciled}</span>
            )}
          </button>
        ))}
        {/* Financial summary */}
        <div style={{ marginTop:'auto', padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', gap:8 }}>
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginBottom:3 }}>Net Profit (YTD)</div>
            <div style={{ fontSize:14, fontWeight:800, color:totals.profit>=0?'#34d399':'#f87171' }}>{fmt(totals.profit)}</div>
          </div>
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginBottom:3 }}>VAT Due</div>
            <div style={{ fontSize:13, fontWeight:700, color:'#fbbf24' }}>{fmt(totals.vatDue)}</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto', display:'flex' }}>
        {view==='dashboard'    && <DashboardView    transactions={transactions} onAdd={openAdd}/>}
        {view==='transactions' && <TransactionsView transactions={transactions} onAdd={openAdd} onEdit={t=>{setEditingTx(t);setShowModal(true)}} onDelete={deleteTx}/>}
        {view==='reports'      && <ReportsView      transactions={transactions}/>}
        {view==='vat'          && <VATView          transactions={transactions}/>}
      </div>

      {showModal && (
        <AddTxModal
          existing={editingTx}
          defaultType={defaultType}
          onClose={()=>{ setShowModal(false); setEditingTx(undefined) }}
          onSave={saveTx}
        />
      )}
    </div>
  )
}
