export type MovementType = 'in' | 'out' | 'adjustment' | 'return'
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export interface Product {
  id: string; sku: string; name: string; description: string
  category: string; unit: string
  price: number; costPrice: number
  quantity: number; minStock: number
  supplierId: string
  createdAt: number; updatedAt: number
}
export interface Supplier {
  id: string; name: string; contact: string
  email: string; phone: string; notes: string
}
export interface StockMovement {
  id: string; productId: string; type: MovementType
  quantity: number; reason: string; notes: string
  unitCost: number; date: number
}

export const CATEGORIES = ['Electronics','Clothing','Food & Beverage','Office Supplies','Beauty & Health','Tools & Hardware']
export const CATEGORY_COLORS: Record<string, string> = {
  'Electronics':      '#60a5fa',
  'Clothing':         '#f472b6',
  'Food & Beverage':  '#34d399',
  'Office Supplies':  '#fbbf24',
  'Beauty & Health':  '#a78bfa',
  'Tools & Hardware': '#fb923c',
}
export const MOVEMENT_META: Record<MovementType, { label:string; icon:string; color:string; sign:string }> = {
  in:         { label:'Stock In',    icon:'📦', color:'#34d399', sign:'+' },
  out:        { label:'Stock Out',   icon:'📤', color:'#f87171', sign:'-' },
  adjustment: { label:'Adjustment',  icon:'🔧', color:'#fbbf24', sign:'±' },
  return:     { label:'Return',      icon:'↩️', color:'#a78bfa', sign:'+' },
}

export const stockStatus = (p: Product): StockStatus => {
  if (p.quantity === 0) return 'out-of-stock'
  if (p.quantity <= p.minStock) return 'low-stock'
  return 'in-stock'
}
export const STATUS_META: Record<StockStatus, { label:string; color:string }> = {
  'in-stock':     { label:'In Stock',     color:'#34d399' },
  'low-stock':    { label:'Low Stock',    color:'#fbbf24' },
  'out-of-stock': { label:'Out of Stock', color:'#f87171' },
}

const N = Date.now()
export const SEED_SUPPLIERS: Supplier[] = [
  { id:'s1', name:'TechSource SA', contact:'Bongani Moyo', email:'bongani@techsource.co.za', phone:'+27 11 234 5678', notes:'Main electronics supplier. Net 30.' },
  { id:'s2', name:'FashionHub Wholesale', contact:'Linda Pietersen', email:'linda@fashionhub.co.za', phone:'+27 21 345 6789', notes:'Clothing supplier. MOQ 50 units.' },
  { id:'s3', name:'OfficeWorld Distribution', contact:'Sipho Ndlovu', email:'sipho@officeworld.co.za', phone:'+27 31 456 7890', notes:'Stationery & furniture. Free delivery over R5k.' },
  { id:'s4', name:'Cape Organics', contact:'Riana van der Berg', email:'riana@capeorganics.co.za', phone:'+27 82 567 8901', notes:'Organic food & health products.' },
]

export const SEED_PRODUCTS: Product[] = [
  { id:'p1', sku:'ELEC-001', name:'Wireless Earbuds Pro', description:'Bluetooth 5.3, ANC, 30hr battery', category:'Electronics', unit:'unit', price:1299, costPrice:680, quantity:45, minStock:10, supplierId:'s1', createdAt:N-86400000*30, updatedAt:N-86400000*2 },
  { id:'p2', sku:'ELEC-002', name:'USB-C Hub 7-Port', description:'4K HDMI, USB 3.0, PD charging', category:'Electronics', unit:'unit', price:649, costPrice:320, quantity:8, minStock:10, supplierId:'s1', createdAt:N-86400000*25, updatedAt:N-86400000 },
  { id:'p3', sku:'ELEC-003', name:'Laptop Stand Aluminium', description:'Adjustable, foldable, 10–17"', category:'Electronics', unit:'unit', price:799, costPrice:390, quantity:0, minStock:5, supplierId:'s1', createdAt:N-86400000*20, updatedAt:N-86400000*3 },
  { id:'p4', sku:'CLTH-001', name:'Classic White T-Shirt', description:'100% cotton, unisex, sizes S–XL', category:'Clothing', unit:'unit', price:299, costPrice:95, quantity:120, minStock:20, supplierId:'s2', createdAt:N-86400000*45, updatedAt:N-86400000*5 },
  { id:'p5', sku:'CLTH-002', name:'Slim Fit Chinos', description:'Stretch cotton, navy, sizes 30–38', category:'Clothing', unit:'unit', price:599, costPrice:210, quantity:34, minStock:15, supplierId:'s2', createdAt:N-86400000*40, updatedAt:N-86400000*4 },
  { id:'p6', sku:'FOOD-001', name:'Premium Coffee Beans 1kg', description:'Single origin Ethiopian, medium roast', category:'Food & Beverage', unit:'kg', price:349, costPrice:180, quantity:6, minStock:10, supplierId:'s4', createdAt:N-86400000*15, updatedAt:N-86400000 },
  { id:'p7', sku:'OFFC-001', name:'A4 Paper Ream 500 Sheets', description:'80gsm, white, multipurpose', category:'Office Supplies', unit:'ream', price:89, costPrice:42, quantity:200, minStock:50, supplierId:'s3', createdAt:N-86400000*60, updatedAt:N-86400000*7 },
  { id:'p8', sku:'OFFC-002', name:'Ergonomic Office Chair', description:'Lumbar support, mesh back, adjustable', category:'Office Supplies', unit:'unit', price:4999, costPrice:2800, quantity:3, minStock:2, supplierId:'s3', createdAt:N-86400000*35, updatedAt:N-86400000*10 },
  { id:'p9', sku:'BEAU-001', name:'SPF50 Face Moisturiser', description:'50ml, hydrating, all skin types', category:'Beauty & Health', unit:'unit', price:249, costPrice:98, quantity:0, minStock:15, supplierId:'s4', createdAt:N-86400000*20, updatedAt:N-86400000*1 },
  { id:'p10', sku:'BEAU-002', name:'Hand Sanitiser 500ml', description:'70% alcohol, moisturising gel', category:'Beauty & Health', unit:'unit', price:79, costPrice:28, quantity:88, minStock:30, supplierId:'s4', createdAt:N-86400000*50, updatedAt:N-86400000*6 },
  { id:'p11', sku:'TOOL-001', name:'Cordless Drill Set', description:'18V, 2 batteries, 40-piece bit set', category:'Tools & Hardware', unit:'unit', price:2199, costPrice:1350, quantity:12, minStock:5, supplierId:'s3', createdAt:N-86400000*28, updatedAt:N-86400000*8 },
  { id:'p12', sku:'TOOL-002', name:'Cable Ties 100-Pack', description:'UV resistant, 200mm, mixed sizes', category:'Tools & Hardware', unit:'pack', price:49, costPrice:18, quantity:4, minStock:10, supplierId:'s3', createdAt:N-86400000*18, updatedAt:N-86400000*2 },
]

export const SEED_MOVEMENTS: StockMovement[] = [
  { id:'m1', productId:'p1', type:'in',   quantity:50, reason:'Purchase Order #PO-001', notes:'TechSource delivery', unitCost:680, date:N-86400000*30 },
  { id:'m2', productId:'p1', type:'out',  quantity:5,  reason:'Sale #INV-0042', notes:'', unitCost:680, date:N-86400000*2 },
  { id:'m3', productId:'p2', type:'in',   quantity:20, reason:'Purchase Order #PO-002', notes:'', unitCost:320, date:N-86400000*25 },
  { id:'m4', productId:'p2', type:'out',  quantity:12, reason:'Sale #INV-0038', notes:'', unitCost:320, date:N-86400000 },
  { id:'m5', productId:'p3', type:'in',   quantity:10, reason:'Purchase Order #PO-002', notes:'', unitCost:390, date:N-86400000*20 },
  { id:'m6', productId:'p3', type:'out',  quantity:10, reason:'Sale — out of stock', notes:'All sold', unitCost:390, date:N-86400000*3 },
  { id:'m7', productId:'p4', type:'in',   quantity:150, reason:'Purchase Order #PO-003', notes:'FashionHub bulk order', unitCost:95, date:N-86400000*45 },
  { id:'m8', productId:'p4', type:'out',  quantity:30, reason:'Sales — week 1', notes:'', unitCost:95, date:N-86400000*5 },
  { id:'m9', productId:'p6', type:'in',   quantity:20, reason:'Purchase Order #PO-004', notes:'Cape Organics', unitCost:180, date:N-86400000*15 },
  { id:'m10',productId:'p6', type:'out',  quantity:14, reason:'Sales & café use', notes:'', unitCost:180, date:N-86400000 },
  { id:'m11',productId:'p9', type:'in',   quantity:30, reason:'Purchase Order #PO-005', notes:'', unitCost:98, date:N-86400000*20 },
  { id:'m12',productId:'p9', type:'out',  quantity:30, reason:'All sold', notes:'Reorder needed', unitCost:98, date:N-86400000 },
  { id:'m13',productId:'p12',type:'in',   quantity:10, reason:'Purchase Order #PO-006', notes:'', unitCost:18, date:N-86400000*18 },
  { id:'m14',productId:'p12',type:'out',  quantity:6,  reason:'Workshop usage', notes:'', unitCost:18, date:N-86400000*2 },
]

// Helpers
export const fmt  = (v: number) => `R ${v.toLocaleString('en-ZA')}`
export const fmtDate = (ts: number) => {
  const d = Date.now()-ts
  if(d<60000) return 'Just now'
  if(d<3600000) return `${Math.round(d/60000)}m ago`
  if(d<86400000) return `${Math.round(d/3600000)}h ago`
  return `${Math.round(d/86400000)}d ago`
}
export const uid = () => Math.random().toString(36).slice(2,10)
export const totalValue  = (products: Product[]) => products.reduce((s,p)=>s+p.quantity*p.costPrice,0)
export const retailValue = (products: Product[]) => products.reduce((s,p)=>s+p.quantity*p.price,0)

const KEY = 'inv_v1'
export const loadInv = (): { products:Product[]; suppliers:Supplier[]; movements:StockMovement[] } => {
  try { const r=localStorage.getItem(KEY); if(r) return JSON.parse(r) } catch {}
  return { products:SEED_PRODUCTS, suppliers:SEED_SUPPLIERS, movements:SEED_MOVEMENTS }
}
export const saveInv = (products:Product[], suppliers:Supplier[], movements:StockMovement[]) =>
  localStorage.setItem(KEY, JSON.stringify({ products, suppliers, movements }))
