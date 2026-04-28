import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Product, Supplier, StockMovement, MovementType,
  CATEGORIES, CATEGORY_COLORS, MOVEMENT_META, STATUS_META,
  stockStatus, fmt, uid, SEED_SUPPLIERS
} from './inventory-data'

export const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const }
export const lbl: React.CSSProperties = { fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:5, display:'block' }
export const card: React.CSSProperties = { background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:24 }

export function StatCard({ label, value, sub, color }: { label:string; value:string; sub:string; color:string }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      style={{ flex:1, minWidth:160, ...card, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`${color}15`, filter:'blur(24px)' }}/>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:900, color, letterSpacing:'-0.03em', marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{sub}</div>
    </motion.div>
  )
}

export function StockBadge({ product }: { product: Product }) {
  const s = STATUS_META[stockStatus(product)]
  return <span style={{ padding:'3px 10px', borderRadius:99, background:`${s.color}18`, border:`1px solid ${s.color}40`, color:s.color, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>{s.label}</span>
}

export function StockBar({ product }: { product: Product }) {
  const pct = product.minStock > 0 ? Math.min((product.quantity / (product.minStock * 3)) * 100, 100) : 100
  const st = stockStatus(product)
  const color = STATUS_META[st].color
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:4, borderRadius:99, background:'rgba(255,255,255,0.06)' }}>
        <div style={{ width:`${pct}%`, height:'100%', borderRadius:99, background:color, transition:'width 0.5s' }}/>
      </div>
      <span style={{ fontSize:11, fontWeight:700, color, minWidth:28, textAlign:'right' }}>{product.quantity}</span>
    </div>
  )
}

export function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || '#818cf8'
  return <span style={{ padding:'2px 9px', borderRadius:99, background:`${color}18`, border:`1px solid ${color}30`, color, fontSize:11, fontWeight:700 }}>{category}</span>
}

// ── Add Product Modal ─────────────────────────────────────────────────────────
export function AddProductModal({ suppliers, onClose, onSave, existing }: { suppliers:Supplier[]; onClose:()=>void; onSave:(p:Product)=>void; existing?:Product }) {
  const blank = { sku:'', name:'', description:'', category:CATEGORIES[0], unit:'unit', price:0, costPrice:0, quantity:0, minStock:5, supplierId:suppliers[0]?.id||'' }
  const [f, setF] = useState(existing ? { sku:existing.sku, name:existing.name, description:existing.description, category:existing.category, unit:existing.unit, price:existing.price, costPrice:existing.costPrice, quantity:existing.quantity, minStock:existing.minStock, supplierId:existing.supplierId } : blank)
  const u = (k:string, v:string|number) => setF(p=>({...p,[k]:v}))
  const numFields: [string,string,string][] = [['price','Retail Price (R)','299'],['costPrice','Cost Price (R)','120'],['quantity','Opening Stock','0'],['minStock','Min Stock Alert','5']]
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:520, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24, letterSpacing:'-0.02em' }}>{existing?'Edit Product':'New Product'}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div style={{ gridColumn:'span 2' }}><label style={lbl}>Product Name</label><input style={inp} value={f.name} placeholder="e.g. Wireless Earbuds Pro" onChange={e=>u('name',e.target.value)}/></div>
          <div><label style={lbl}>SKU</label><input style={inp} value={f.sku} placeholder="ELEC-001" onChange={e=>u('sku',e.target.value)}/></div>
          <div><label style={lbl}>Unit</label>
            <select style={{ ...inp }} value={f.unit} onChange={e=>u('unit',e.target.value)}>
              {['unit','kg','g','litre','ml','pack','box','roll','ream','pair','set'].map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Category</label>
            <select style={{ ...inp }} value={f.category} onChange={e=>u('category',e.target.value)}>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Supplier</label>
            <select style={{ ...inp }} value={f.supplierId} onChange={e=>u('supplierId',e.target.value)}>
              <option value="">— No supplier —</option>
              {suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          {numFields.map(([k,label,ph])=>(
            <div key={k}><label style={lbl}>{label}</label><input style={inp} type="number" value={(f as any)[k]} placeholder={ph} onChange={e=>u(k,Number(e.target.value))}/></div>
          ))}
          <div style={{ gridColumn:'span 2' }}><label style={lbl}>Description</label><textarea style={{ ...inp, resize:'vertical', minHeight:60 }} value={f.description} placeholder="Brief product description…" onChange={e=>u('description',e.target.value)}/></div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>{
            if(!f.name.trim()||!f.sku.trim()) return
            const now=Date.now()
            onSave({ ...f, id:existing?.id||uid(), createdAt:existing?.createdAt||now, updatedAt:now })
          }} style={{ padding:'10px 24px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#fb923c,#f59e0b)', color:'white', fontWeight:700, cursor:'pointer' }}>
            {existing?'Save Changes':'Add Product'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Stock Movement Modal ───────────────────────────────────────────────────────
export function StockMovementModal({ products, onClose, onSave, defaultProductId, defaultType }: { products:Product[]; onClose:()=>void; onSave:(m:StockMovement,newQty:number)=>void; defaultProductId?:string; defaultType?:MovementType }) {
  const [f, setF] = useState({ productId:defaultProductId||products[0]?.id||'', type:(defaultType||'in') as MovementType, quantity:1, reason:'', notes:'', unitCost:0 })
  const u = (k:string, v:string|number) => setF(p=>({...p,[k]:v}))
  const prod = products.find(p=>p.id===f.productId)
  const meta = MOVEMENT_META[f.type]
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:440 }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24, letterSpacing:'-0.02em' }}>Record Stock Movement</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={lbl}>Product</label>
            <select style={{ ...inp }} value={f.productId} onChange={e=>{ u('productId',e.target.value); const p=products.find(x=>x.id===e.target.value); if(p) u('unitCost',p.costPrice) }}>
              {products.map(p=><option key={p.id} value={p.id}>{p.name} (Qty: {p.quantity})</option>)}
            </select>
          </div>
          <div><label style={lbl}>Type</label>
            <div style={{ display:'flex', gap:8 }}>
              {(Object.entries(MOVEMENT_META) as [MovementType,typeof MOVEMENT_META[MovementType]][]).map(([k,m])=>(
                <button key={k} onClick={()=>u('type',k)} style={{ flex:1, padding:'8px 6px', borderRadius:8, border:`1px solid ${f.type===k?m.color:'rgba(255,255,255,0.1)'}`, background:f.type===k?`${m.color}22`:'transparent', color:f.type===k?m.color:'rgba(255,255,255,0.4)', fontSize:11, fontWeight:700, cursor:'pointer' }}>{m.icon} {m.label}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Quantity</label><input style={inp} type="number" min={1} value={f.quantity} onChange={e=>u('quantity',Number(e.target.value))}/></div>
            <div><label style={lbl}>Unit Cost (R)</label><input style={inp} type="number" value={f.unitCost} onChange={e=>u('unitCost',Number(e.target.value))}/></div>
          </div>
          <div><label style={lbl}>Reason</label><input style={inp} value={f.reason} placeholder="e.g. Purchase Order #PO-010" onChange={e=>u('reason',e.target.value)}/></div>
          <div><label style={lbl}>Notes</label><textarea style={{ ...inp, resize:'vertical', minHeight:50 }} value={f.notes} onChange={e=>u('notes',e.target.value)}/></div>
          {prod && (
            <div style={{ padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', fontSize:12 }}>
              <div style={{ color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Preview after movement:</div>
              <div style={{ fontWeight:700, color: meta.color, fontSize:16 }}>
                {prod.quantity} {meta.sign} {f.quantity} = <span style={{ color:'white' }}>{f.type==='out' ? prod.quantity-f.quantity : prod.quantity+f.quantity} {prod.unit}s</span>
              </div>
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>{
            if(!f.productId||f.quantity<1) return
            const newQty = f.type==='out' ? (prod?.quantity||0)-f.quantity : (prod?.quantity||0)+f.quantity
            onSave({ id:uid(), productId:f.productId, type:f.type, quantity:f.quantity, reason:f.reason, notes:f.notes, unitCost:f.unitCost, date:Date.now() }, newQty)
          }} style={{ padding:'10px 24px', borderRadius:9, border:'none', background:`linear-gradient(135deg,${meta.color},${meta.color}aa)`, color:'white', fontWeight:700, cursor:'pointer' }}>
            {meta.icon} Record {meta.label}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Product Detail Panel ───────────────────────────────────────────────────────
export function ProductPanel({ product, movements, suppliers, onClose, onEdit, onStockIn, onStockOut }: { product:Product; movements:StockMovement[]; suppliers:Supplier[]; onClose:()=>void; onEdit:()=>void; onStockIn:()=>void; onStockOut:()=>void }) {
  const myMoves = movements.filter(m=>m.productId===product.id).sort((a,b)=>b.date-a.date)
  const supplier = suppliers.find(s=>s.id===product.supplierId)
  const st = stockStatus(product)
  const statusMeta = STATUS_META[st]
  const margin = product.price > 0 ? Math.round(((product.price-product.costPrice)/product.price)*100) : 0
  return (
    <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', damping:28, stiffness:260 }}
      style={{ position:'fixed', top:0, right:0, height:'100vh', width:420, background:'#080b14', borderLeft:'1px solid rgba(255,255,255,0.08)', zIndex:80, overflowY:'auto', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'flex-start', gap:12, flexShrink:0 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:`${CATEGORY_COLORS[product.category]||'#818cf8'}18`, border:`1px solid ${CATEGORY_COLORS[product.category]||'#818cf8'}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
          {product.category==='Electronics'?'💻':product.category==='Clothing'?'👕':product.category==='Food & Beverage'?'☕':product.category==='Office Supplies'?'📄':product.category==='Beauty & Health'?'✨':'🔧'}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:15 }}>{product.name}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>SKU: {product.sku} · {product.category}</div>
        </div>
        <button onClick={onEdit} style={{ padding:'6px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', fontSize:12, cursor:'pointer' }}>Edit</button>
        <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.4)', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
      </div>
      <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:20, flex:1 }}>
        {/* Stock status */}
        <div style={{ padding:'16px 18px', borderRadius:12, background:`${statusMeta.color}12`, border:`1px solid ${statusMeta.color}30`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:11, color:statusMeta.color, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{statusMeta.label}</div>
            <div style={{ fontSize:28, fontWeight:900, color:'white' }}>{product.quantity} <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:400 }}>{product.unit}s</span></div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Min alert: {product.minStock} {product.unit}s</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={onStockIn} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #34d39940', background:'#34d39918', color:'#34d399', fontSize:12, fontWeight:700, cursor:'pointer' }}>📦 Stock In</button>
            <button onClick={onStockOut} style={{ padding:'8px 16px', borderRadius:8, border:'1px solid #f8717140', background:'#f8717118', color:'#f87171', fontSize:12, fontWeight:700, cursor:'pointer' }}>📤 Stock Out</button>
          </div>
        </div>
        {/* Pricing */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          {[['Cost',fmt(product.costPrice),'#fbbf24'],['Retail',fmt(product.price),'#60a5fa'],['Margin',`${margin}%`,'#34d399']].map(([l,v,c])=>(
            <div key={l} style={{ padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', marginBottom:6 }}>{l}</div>
              <div style={{ fontSize:16, fontWeight:800, color:c as string }}>{v}</div>
            </div>
          ))}
        </div>
        {/* Stock value */}
        <div style={{ padding:'14px 16px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>Stock Value (at cost)</div>
          <div style={{ fontSize:16, fontWeight:800, color:'white' }}>{fmt(product.quantity * product.costPrice)}</div>
        </div>
        {product.description && <div><div style={lbl}>Description</div><div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>{product.description}</div></div>}
        {supplier && <div><div style={lbl}>Supplier</div><div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>{supplier.name}</div><div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{supplier.contact} · {supplier.phone}</div></div>}
        {/* Movement history */}
        <div>
          <div style={{ ...lbl, marginBottom:12 }}>Movement History ({myMoves.length})</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {myMoves.length===0 && <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'16px 0' }}>No movements yet</div>}
            {myMoves.slice(0,10).map(m=>{ const meta=MOVEMENT_META[m.type]; return (
              <div key={m.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 12px', borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize:16 }}>{meta.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600 }}>{m.reason||meta.label}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{new Date(m.date).toLocaleDateString('en-ZA')}</div>
                </div>
                <span style={{ fontWeight:800, color:meta.color, fontSize:13 }}>{meta.sign}{m.quantity} {product.unit}s</span>
              </div>
            )})}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
