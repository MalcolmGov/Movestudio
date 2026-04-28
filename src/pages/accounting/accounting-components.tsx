import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Transaction, BudgetItem, TxType, INCOME_CATS, EXPENSE_CATS, ALL_CATS, CAT_ICONS, VAT_RATE, fmt, uid, isIncome } from './accounting-data'

export const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const }
export const lbl: React.CSSProperties = { fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:5, display:'block' }
export const card: React.CSSProperties = { background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:24 }

export function KpiCard({ label, value, sub, color, prefix }: { label:string; value:string; sub:string; color:string; prefix?:string }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      style={{ flex:1, minWidth:160, ...card, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`${color}15`, filter:'blur(24px)' }}/>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:900, color, letterSpacing:'-0.03em', marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{sub}</div>
    </motion.div>
  )
}

export function TypeBadge({ type }: { type: TxType }) {
  const isInc = type==='income'
  return <span style={{ padding:'3px 10px', borderRadius:99, background:isInc?'rgba(52,211,153,0.15)':'rgba(248,113,113,0.15)', border:`1px solid ${isInc?'rgba(52,211,153,0.4)':'rgba(248,113,113,0.4)'}`, color:isInc?'#34d399':'#f87171', fontSize:11, fontWeight:700 }}>{isInc?'↑ Income':'↓ Expense'}</span>
}

// ── Add Transaction Modal ──────────────────────────────────────────────────────
export function AddTxModal({ onClose, onSave, existing, defaultType }: { onClose:()=>void; onSave:(t:Transaction)=>void; existing?:Transaction; defaultType?:TxType }) {
  const [f, setF] = useState({
    type:(existing?.type||defaultType||'income') as TxType,
    amount:existing?.amount||0, category:existing?.category||(defaultType==='expense'?EXPENSE_CATS[0]:INCOME_CATS[0]),
    description:existing?.description||'', reference:existing?.reference||'',
    date:existing?.date?new Date(existing.date).toISOString().slice(0,10):new Date().toISOString().slice(0,10),
    vatIncluded:existing ? existing.vatAmount>0 : false, reconciled:existing?.reconciled||false,
  })
  const u = (k:string, v:string|number|boolean) => setF(p=>({...p,[k]:v}))
  const cats = f.type==='income' ? INCOME_CATS : EXPENSE_CATS
  const vatAmount = f.vatIncluded ? f.amount - (f.amount / (1+VAT_RATE)) : 0
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:480 }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24, letterSpacing:'-0.02em' }}>{existing?'Edit Transaction':'Add Transaction'}</div>
        {/* Type toggle */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {(['income','expense'] as TxType[]).map(tp=>(
            <button key={tp} onClick={()=>{ u('type',tp); u('category',tp==='income'?INCOME_CATS[0]:EXPENSE_CATS[0]) }}
              style={{ flex:1, padding:'10px', borderRadius:9, border:`1px solid ${f.type===tp?(tp==='income'?'#34d399':'#f87171'):'rgba(255,255,255,0.1)'}`, background:f.type===tp?(tp==='income'?'rgba(52,211,153,0.12)':'rgba(248,113,113,0.12)'):'transparent', color:f.type===tp?(tp==='income'?'#34d399':'#f87171'):'rgba(255,255,255,0.4)', fontWeight:800, fontSize:14, cursor:'pointer' }}>
              {tp==='income'?'↑ Income':'↓ Expense'}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Amount (R)</label><input style={inp} type="number" value={f.amount} onChange={e=>u('amount',Number(e.target.value))}/></div>
            <div><label style={lbl}>Date</label><input style={inp} type="date" value={f.date} onChange={e=>u('date',e.target.value)}/></div>
          </div>
          <div><label style={lbl}>Category</label>
            <select style={{ ...inp }} value={f.category} onChange={e=>u('category',e.target.value)}>
              {cats.map(c=><option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Description</label><input style={inp} value={f.description} placeholder="What is this for?" onChange={e=>u('description',e.target.value)}/></div>
          <div><label style={lbl}>Reference</label><input style={inp} value={f.reference} placeholder="INV-0001 / PO-001" onChange={e=>u('reference',e.target.value)}/></div>
          <div style={{ display:'flex', gap:16 }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, color:'rgba(255,255,255,0.6)' }}>
              <input type="checkbox" checked={f.vatIncluded} onChange={e=>u('vatIncluded',e.target.checked)} style={{ width:16, height:16 }}/> VAT Included (15%)
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:13, color:'rgba(255,255,255,0.6)' }}>
              <input type="checkbox" checked={f.reconciled} onChange={e=>u('reconciled',e.target.checked)} style={{ width:16, height:16 }}/> Reconciled
            </label>
          </div>
          {f.vatIncluded && f.amount>0 && (
            <div style={{ padding:'10px 14px', borderRadius:9, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', fontSize:12 }}>
              <span style={{ color:'rgba(255,255,255,0.5)' }}>VAT portion: </span>
              <span style={{ color:'#fbbf24', fontWeight:700 }}>R {vatAmount.toFixed(2)}</span>
              <span style={{ color:'rgba(255,255,255,0.5)' }}> · Ex-VAT amount: </span>
              <span style={{ color:'white', fontWeight:700 }}>R {(f.amount-vatAmount).toFixed(2)}</span>
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>{
            if(!f.description.trim()||f.amount<=0) return
            onSave({ id:existing?.id||uid(), type:f.type, amount:f.amount, vatAmount:f.vatIncluded?parseFloat(vatAmount.toFixed(2)):0, category:f.category, description:f.description, reference:f.reference, date:new Date(f.date).getTime(), reconciled:f.reconciled })
          }} style={{ padding:'10px 24px', borderRadius:9, border:'none', background:f.type==='income'?'linear-gradient(135deg,#059669,#34d399)':'linear-gradient(135deg,#dc2626,#f87171)', color:'white', fontWeight:700, cursor:'pointer' }}>
            {existing?'Save Changes':f.type==='income'?'Add Income':'Add Expense'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
