import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import StudioSidebar from '../components/StudioSidebar'
import { Product, Supplier, StockMovement, MovementType, loadInv, saveInv, uid } from './inventory/inventory-data'
import { AddProductModal, StockMovementModal, ProductPanel } from './inventory/inventory-components'
import { DashboardView, ProductsView, MovementsView, SuppliersView } from './inventory/inventory-views'

type View = 'dashboard'|'products'|'movements'|'suppliers'

const NAV_ITEMS: { id:View; icon:string; label:string }[] = [
  { id:'dashboard',  icon:'📊', label:'Dashboard'  },
  { id:'products',   icon:'📦', label:'Products'   },
  { id:'movements',  icon:'🔄', label:'Movements'  },
  { id:'suppliers',  icon:'🏭', label:'Suppliers'  },
]

export default function InventoryPage() {
  const [data, setData] = useState(() => loadInv())
  const [view, setView] = useState<View>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product|undefined>()
  const [showMovement, setShowMovement] = useState(false)
  const [movementProductId, setMovementProductId] = useState<string|undefined>()
  const [movementType, setMovementType] = useState<MovementType|undefined>()
  const [selectedProduct, setSelectedProduct] = useState<Product|undefined>()

  const { products, suppliers, movements } = data

  const save = (p:Product[], s:Supplier[], m:StockMovement[]) => {
    saveInv(p,s,m); setData({ products:p, suppliers:s, movements:m })
  }

  const addProduct = (p: Product) => {
    const exists = products.find(x=>x.id===p.id)
    const next = exists ? products.map(x=>x.id===p.id?p:x) : [...products, p]
    save(next, suppliers, movements)
    setShowAddProduct(false); setEditingProduct(undefined)
    if(selectedProduct?.id===p.id) setSelectedProduct(p)
  }

  const deleteProduct = (id:string) => {
    save(products.filter(p=>p.id!==id), suppliers, movements.filter(m=>m.productId!==id))
    if(selectedProduct?.id===id) setSelectedProduct(undefined)
  }

  const recordMovement = (m:StockMovement, newQty:number) => {
    const updatedProducts = products.map(p=>p.id===m.productId?{...p, quantity:Math.max(0,newQty), updatedAt:Date.now()}:p)
    save(updatedProducts, suppliers, [...movements, m])
    setShowMovement(false); setMovementProductId(undefined); setMovementType(undefined)
    if(selectedProduct?.id===m.productId) setSelectedProduct(updatedProducts.find(p=>p.id===m.productId))
  }

  const openStockIn = (productId?:string) => {
    setMovementProductId(productId); setMovementType('in'); setShowMovement(true)
  }
  const openStockOut = (productId?:string) => {
    setMovementProductId(productId); setMovementType('out'); setShowMovement(true)
  }

  const totalStockValue = products.reduce((s,p)=>s+p.quantity*p.costPrice,0)
  const alertCount = products.filter(p=>p.quantity<=p.minStock).length

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'var(--font, Inter, sans-serif)', background:'#040608', color:'white', overflow:'hidden' }}>
      <StudioSidebar collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(p=>!p)}/>

      {/* Sub-nav */}
      <div style={{ width:180, flexShrink:0, background:'#080b14', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', padding:'20px 10px', gap:4 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 6px', marginBottom:10 }}>Inventory</div>
        {NAV_ITEMS.map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:`1px solid ${view===item.id?'rgba(251,146,60,0.4)':'transparent'}`, background:view===item.id?'rgba(251,146,60,0.12)':'transparent', color:view===item.id?'white':'rgba(255,255,255,0.5)', fontSize:13, fontWeight:view===item.id?700:500, cursor:'pointer', textAlign:'left', width:'100%' }}>
            <span style={{ fontSize:16 }}>{item.icon}</span> {item.label}
            {item.id==='products' && alertCount>0 && (
              <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, color:'#f87171', background:'rgba(248,113,113,0.15)', padding:'1px 6px', borderRadius:99 }}>{alertCount}</span>
            )}
          </button>
        ))}
        <div style={{ marginTop:'auto', padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginBottom:6 }}>Stock value</div>
          <div style={{ fontSize:13, fontWeight:800, color:'#fb923c' }}>
            R {totalStockValue.toLocaleString('en-ZA')}
          </div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginTop:2 }}>{products.length} SKUs</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflowY:'auto', display:'flex' }}>
        {view==='dashboard' && <DashboardView products={products} movements={movements} onAddProduct={()=>setShowAddProduct(true)} onStockMove={()=>setShowMovement(true)}/>}
        {view==='products'  && <ProductsView  products={products} onAddProduct={()=>setShowAddProduct(true)} onSelect={setSelectedProduct} onDelete={deleteProduct}/>}
        {view==='movements' && <MovementsView products={products} movements={movements} onRecord={()=>setShowMovement(true)}/>}
        {view==='suppliers' && <SuppliersView suppliers={suppliers} products={products}/>}
      </div>

      {/* Product detail panel */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductPanel
            product={selectedProduct}
            movements={movements}
            suppliers={suppliers}
            onClose={()=>setSelectedProduct(undefined)}
            onEdit={()=>{ setEditingProduct(selectedProduct); setShowAddProduct(true) }}
            onStockIn={()=>openStockIn(selectedProduct.id)}
            onStockOut={()=>openStockOut(selectedProduct.id)}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      {showAddProduct && (
        <AddProductModal
          suppliers={suppliers}
          existing={editingProduct}
          onClose={()=>{ setShowAddProduct(false); setEditingProduct(undefined) }}
          onSave={addProduct}
        />
      )}
      {showMovement && (
        <StockMovementModal
          products={products}
          defaultProductId={movementProductId}
          defaultType={movementType}
          onClose={()=>{ setShowMovement(false); setMovementProductId(undefined); setMovementType(undefined) }}
          onSave={recordMovement}
        />
      )}
    </div>
  )
}
