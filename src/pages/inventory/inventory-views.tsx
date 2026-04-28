import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Product, Supplier, StockMovement, CATEGORIES, CATEGORY_COLORS, MOVEMENT_META, STATUS_META, stockStatus, fmt, fmtDate, totalValue, retailValue } from './inventory-data'
import { StatCard, StockBadge, StockBar, CategoryBadge, card, lbl } from './inventory-components'

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function DashboardView({ products, movements, onAddProduct, onStockMove }: { products:Product[]; movements:StockMovement[]; onAddProduct:()=>void; onStockMove:()=>void }) {
  const lowStock = products.filter(p=>stockStatus(p)==='low-stock')
  const outOfStock = products.filter(p=>stockStatus(p)==='out-of-stock')
  const recentMoves = [...movements].sort((a,b)=>b.date-a.date).slice(0,6)
  const catBreakdown = CATEGORIES.map(c=>({ cat:c, count:products.filter(p=>p.category===c).length, value:products.filter(p=>p.category===c).reduce((s,p)=>s+p.quantity*p.costPrice,0) })).filter(x=>x.count>0)
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:28, maxWidth:1100, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Inventory</h1>
          <p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>Stock levels, valuation & movements</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onStockMove} style={{ padding:'10px 18px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600, cursor:'pointer' }}>📦 Record Movement</button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onAddProduct} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#fb923c,#f59e0b)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Add Product</motion.button>
        </div>
      </div>
      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
        <StatCard label="Total SKUs" value={String(products.length)} sub="Across all categories" color="#fb923c"/>
        <StatCard label="Stock Value (Cost)" value={fmt(totalValue(products))} sub="At purchase cost" color="#60a5fa"/>
        <StatCard label="Retail Value" value={fmt(retailValue(products))} sub="At selling price" color="#34d399"/>
        <StatCard label="Alerts" value={String(lowStock.length + outOfStock.length)} sub={`${outOfStock.length} out of stock`} color={outOfStock.length>0?'#f87171':'#fbbf24'}/>
      </div>
      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div style={{ ...card, borderColor:'rgba(248,113,113,0.2)', background:'rgba(248,113,113,0.05)' }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:14, color:'#f87171' }}>⚠️ Stock Alerts ({lowStock.length + outOfStock.length})</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[...outOfStock, ...lowStock].map(p=>{
              const st=STATUS_META[stockStatus(p)]
              return (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 14px', borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize:20 }}>📦</span>
                  <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13 }}>{p.name}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>SKU: {p.sku} · {p.category}</div></div>
                  <div style={{ textAlign:'right' }}><div style={{ fontWeight:800, color:st.color, fontSize:14 }}>{p.quantity} / {p.minStock} min</div><StockBadge product={p}/></div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Category breakdown */}
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>By Category</div>
          {catBreakdown.map(({cat,count,value})=>{
            const color = CATEGORY_COLORS[cat]||'#818cf8'
            const pct = products.length ? (count/products.length)*100 : 0
            return (
              <div key={cat} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:12 }}>
                  <span style={{ color, fontWeight:700 }}>{cat}</span>
                  <span style={{ color:'rgba(255,255,255,0.4)' }}>{count} SKUs · {fmt(value)}</span>
                </div>
                <div style={{ height:5, borderRadius:99, background:'rgba(255,255,255,0.06)' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8 }} style={{ height:'100%', borderRadius:99, background:color }}/>
                </div>
              </div>
            )
          })}
        </div>
        {/* Recent movements */}
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Recent Movements</div>
          {recentMoves.length===0 && <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'16px 0' }}>No movements recorded</div>}
          {recentMoves.map(m=>{ const meta=MOVEMENT_META[m.type]; const prod=products.find(p=>p.id===m.productId); return (
            <div key={m.id} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10, padding:'9px 12px', borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize:18 }}>{meta.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'white' }}>{prod?.name||'Unknown'}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{m.reason||meta.label} · {fmtDate(m.date)}</div>
              </div>
              <span style={{ fontWeight:800, color:meta.color, fontSize:13 }}>{meta.sign}{m.quantity}</span>
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}

// ─── Products View ────────────────────────────────────────────────────────────
export function ProductsView({ products, onAddProduct, onSelect, onDelete }: { products:Product[]; onAddProduct:()=>void; onSelect:(p:Product)=>void; onDelete:(id:string)=>void }) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const filtered = products.filter(p=>{
    const q=search.toLowerCase()
    const matchQ = !q||p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)
    const matchC = catFilter==='all'||p.category===catFilter
    const matchS = statusFilter==='all'||stockStatus(p)===statusFilter
    return matchQ&&matchC&&matchS
  })
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, width:'100%', maxWidth:1200 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Products</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{products.length} products in inventory</p></div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onAddProduct} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#fb923c,#f59e0b)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Add Product</motion.button>
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, SKU…" style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none' }}/>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {[{id:'all',label:'All'},...CATEGORIES.map(c=>({id:c,label:c}))].map(c=>{
            const color=CATEGORY_COLORS[c.id]||'rgba(255,255,255,0.5)'
            return <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${catFilter===c.id?color:'rgba(255,255,255,0.1)'}`, background:catFilter===c.id?`${color}20`:'transparent', color:catFilter===c.id?color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer' }}>{c.label}</button>
          })}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {(['all','in-stock','low-stock','out-of-stock'] as const).map(s=>{
            const meta=s!=='all'?STATUS_META[s]:null
            return <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${statusFilter===s?(meta?.color||'rgba(255,255,255,0.5)'):'rgba(255,255,255,0.1)'}`, background:statusFilter===s?`${meta?.color||'rgba(255,255,255,0.5)'}20`:'transparent', color:statusFilter===s?(meta?.color||'rgba(255,255,255,0.6)'):'rgba(255,255,255,0.4)', fontSize:11, fontWeight:700, cursor:'pointer' }}>{meta?.label||'All Status'}</button>
          })}
        </div>
      </div>
      <div style={{ ...card, padding:0, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1.5fr 80px', padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {['Product','Category','Stock Level','Price','Value',''].map(h=><span key={h}>{h}</span>)}
        </div>
        {filtered.length===0 && <div style={{ padding:'32px 20px', textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.3)' }}>No products found</div>}
        {filtered.map((p,i)=>(
          <motion.div key={p.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.02 }}
            onClick={()=>onSelect(p)} style={{ display:'grid', gridTemplateColumns:'2.5fr 1fr 1fr 1fr 1.5fr 80px', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', cursor:'pointer', alignItems:'center' }}
            onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.03)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
            <div><div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>SKU: {p.sku}</div></div>
            <div><CategoryBadge category={p.category}/></div>
            <div style={{ paddingRight:12 }}><StockBar product={p}/><div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:3 }}>Min: {p.minStock}</div></div>
            <div><div style={{ fontWeight:700, fontSize:13 }}>{fmt(p.price)}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Cost: {fmt(p.costPrice)}</div></div>
            <div><div style={{ fontWeight:700, fontSize:13 }}>{fmt(p.quantity*p.costPrice)}</div><StockBadge product={p}/></div>
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <button onClick={e=>{e.stopPropagation();if(confirm('Delete product?'))onDelete(p.id)}} style={{ padding:'4px 10px', borderRadius:6, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#f87171', fontSize:11, cursor:'pointer' }}>✕</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Movements View ───────────────────────────────────────────────────────────
export function MovementsView({ products, movements, onRecord }: { products:Product[]; movements:StockMovement[]; onRecord:()=>void }) {
  const [typeFilter, setTypeFilter] = useState('all')
  const sorted = [...movements].filter(m=>typeFilter==='all'||m.type===typeFilter).sort((a,b)=>b.date-a.date)
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, maxWidth:900, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Stock Movements</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{movements.length} records</p></div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onRecord} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#fb923c,#f59e0b)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>📦 Record Movement</motion.button>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <button onClick={()=>setTypeFilter('all')} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${typeFilter==='all'?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.1)'}`, background:typeFilter==='all'?'rgba(255,255,255,0.1)':'transparent', color:typeFilter==='all'?'white':'rgba(255,255,255,0.4)', fontSize:12, fontWeight:700, cursor:'pointer' }}>All</button>
        {(Object.entries(MOVEMENT_META) as any[]).map(([k,m]:any)=>(
          <button key={k} onClick={()=>setTypeFilter(k)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${typeFilter===k?m.color:'rgba(255,255,255,0.1)'}`, background:typeFilter===k?`${m.color}20`:'transparent', color:typeFilter===k?m.color:'rgba(255,255,255,0.4)', fontSize:12, fontWeight:700, cursor:'pointer' }}>{m.icon} {m.label}</button>
        ))}
      </div>
      <div style={{ ...card, padding:0, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {['Product','Type','Qty','Unit Cost','Date'].map(h=><span key={h}>{h}</span>)}
        </div>
        {sorted.length===0 && <div style={{ padding:'32px 20px', textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.3)' }}>No movements found</div>}
        {sorted.map((m,i)=>{ const meta=MOVEMENT_META[m.type]; const prod=products.find(p=>p.id===m.productId); return (
          <motion.div key={m.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.02 }}
            style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center' }}>
            <div><div style={{ fontWeight:700, fontSize:13 }}>{prod?.name||'Unknown'}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{m.reason}</div></div>
            <div><span style={{ padding:'3px 10px', borderRadius:99, background:`${meta.color}18`, border:`1px solid ${meta.color}40`, color:meta.color, fontSize:11, fontWeight:700 }}>{meta.icon} {meta.label}</span></div>
            <div style={{ fontWeight:800, color:meta.color, fontSize:14 }}>{meta.sign}{m.quantity}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)' }}>{m.unitCost>0?fmt(m.unitCost):'—'}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{fmtDate(m.date)}</div>
          </motion.div>
        )})}
      </div>
    </div>
  )
}

// ─── Suppliers View ───────────────────────────────────────────────────────────
export function SuppliersView({ suppliers, products }: { suppliers:Supplier[]; products:Product[] }) {
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, maxWidth:900, width:'100%' }}>
      <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Suppliers</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{suppliers.length} suppliers</p></div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
        {suppliers.map((s,i)=>{
          const count=products.filter(p=>p.supplierId===s.id).length
          const val=products.filter(p=>p.supplierId===s.id).reduce((t,p)=>t+p.quantity*p.costPrice,0)
          return (
            <motion.div key={s.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
              style={{ ...card, display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#fb923c,#f59e0b)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'white', flexShrink:0 }}>{s.name.charAt(0)}</div>
                <div><div style={{ fontWeight:800, fontSize:15 }}>{s.name}</div><div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:1 }}>{s.contact}</div></div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[['✉️',s.email],['📞',s.phone]].map(([icon,val])=>(
                  <div key={icon as string} style={{ display:'flex', gap:10, fontSize:12, color:'rgba(255,255,255,0.6)' }}><span>{icon}</span>{val}</div>
                ))}
              </div>
              {s.notes && <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', lineHeight:1.5, padding:'10px 12px', borderRadius:8, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>{s.notes}</div>}
              <div style={{ display:'flex', gap:12, paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ flex:1, textAlign:'center' }}><div style={{ fontSize:20, fontWeight:900, color:'#fb923c' }}>{count}</div><div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Products</div></div>
                <div style={{ flex:2, textAlign:'center' }}><div style={{ fontSize:16, fontWeight:900, color:'#60a5fa' }}>{fmt(val)}</div><div style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>Stock Value</div></div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
