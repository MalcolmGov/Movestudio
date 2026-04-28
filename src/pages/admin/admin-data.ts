export type ClientStatus = 'active'|'suspended'|'churned'|'pending'
export type PlanName = 'starter'|'business'|'enterprise'
export type PaymentStatus = 'paid'|'overdue'|'pending'|'failed'

export interface Client {
  id:string; name:string; contactName:string; email:string; phone:string
  plan:PlanName; status:ClientStatus; mrr:number
  startDate:number; lastLogin:number; website:string; industry:string
  modules:string[]; users:number; avatar:string
}
export interface Invoice {
  id:string; clientId:string; amount:number; status:PaymentStatus
  issueDate:number; dueDate:number; paidDate?:number; ref:string; period:string
}
export interface AnalyticsDay { date:string; visits:number; signups:number; revenue:number }

export const PLANS: Record<PlanName,{ label:string; price:number; color:string; maxUsers:number }> = {
  starter:    { label:'Starter',    price:2499,  color:'#10b981', maxUsers:3  },
  business:   { label:'Business',   price:5999,  color:'#6366f1', maxUsers:15 },
  enterprise: { label:'Enterprise', price:12999, color:'#a78bfa', maxUsers:999 },
}
export const STATUS_META: Record<ClientStatus,{ label:string; color:string }> = {
  active:    { label:'Active',    color:'#10b981' },
  suspended: { label:'Suspended', color:'#fdab3d' },
  churned:   { label:'Churned',   color:'#e2445c' },
  pending:   { label:'Pending',   color:'#94a3b8' },
}
export const PAY_META: Record<PaymentStatus,{ label:string; color:string }> = {
  paid:    { label:'Paid',    color:'#10b981' },
  overdue: { label:'Overdue', color:'#e2445c' },
  pending: { label:'Pending', color:'#fdab3d' },
  failed:  { label:'Failed',  color:'#f87171' },
}
export const ALL_MODULES = ['CRM','Accounting','Inventory','Projects','HR & Payroll','Website Builder','Brand Kit','Ad Studio','Email Studio','Analytics']

export const fmt  = (v:number) => `R ${v.toLocaleString('en-ZA',{minimumFractionDigits:0})}`
export const fmtK = (v:number) => v>=1000?`R ${(v/1000).toFixed(1)}k`:`R ${v}`
export const fmtDate = (ts:number) => new Date(ts).toLocaleDateString('en-ZA',{day:'2-digit',month:'short',year:'numeric'})
export const uid = () => Math.random().toString(36).slice(2,9)
const D = (d:number) => Date.now()-d*86400000

export const SEED_CLIENTS: Client[] = [
  { id:'c1',  name:'Nexus Retail Group',    contactName:'Thandi Mokoena',   email:'thandi@nexusretail.co.za',  phone:'+27 82 111 0001', plan:'business',   status:'active',    mrr:5999,  startDate:D(420), lastLogin:D(0),  website:'nexusretail.co.za',    industry:'Retail',           modules:['CRM','Accounting','Inventory','Projects','Website Builder','Brand Kit'],            users:12, avatar:'#10b981' },
  { id:'c2',  name:'SwiftPay Africa',       contactName:'Riyaad Cassiem',   email:'riyaad@swiftpay.co.za',     phone:'+27 83 222 0002', plan:'enterprise', status:'active',    mrr:12999, startDate:D(610), lastLogin:D(1),  website:'swiftpay.co.za',       industry:'Fintech',          modules:ALL_MODULES,                                                                         users:34, avatar:'#6366f1' },
  { id:'c3',  name:'Luminary Health',       contactName:'Ayesha Dlamini',   email:'ayesha@luminaryhealth.co.za',phone:'+27 84 333 0003', plan:'business',   status:'active',    mrr:5999,  startDate:D(380), lastLogin:D(2),  website:'luminaryhealth.co.za', industry:'Healthcare',       modules:['CRM','Accounting','HR & Payroll','Website Builder','Email Studio'],               users:8,  avatar:'#ec4899' },
  { id:'c4',  name:'TechVault Solutions',   contactName:'Brendan Nkosi',    email:'brendan@techvault.co.za',   phone:'+27 81 444 0004', plan:'starter',    status:'active',    mrr:2499,  startDate:D(90),  lastLogin:D(3),  website:'techvault.co.za',      industry:'Technology',       modules:['CRM','Website Builder','Brand Kit'],                                               users:2,  avatar:'#f59e0b' },
  { id:'c5',  name:'Apex Trading',          contactName:'Sipho Zulu',       email:'sipho@apextrading.co.za',   phone:'+27 72 555 0005', plan:'business',   status:'active',    mrr:5999,  startDate:D(290), lastLogin:D(0),  website:'apextrading.co.za',    industry:'Trading',          modules:['CRM','Accounting','Inventory','Projects','Brand Kit','Ad Studio'],                 users:9,  avatar:'#3b82f6' },
  { id:'c6',  name:'Green Leaf Organics',   contactName:'Priya Pillay',     email:'priya@greenleaf.co.za',     phone:'+27 79 666 0006', plan:'starter',    status:'active',    mrr:2499,  startDate:D(60),  lastLogin:D(1),  website:'greenleaf.co.za',      industry:'Agriculture',      modules:['CRM','Website Builder','Ad Studio'],                                               users:3,  avatar:'#34d399' },
  { id:'c7',  name:'Horizon Digital',       contactName:'James Botha',      email:'james@horizondigital.co.za',phone:'+27 73 777 0007', plan:'enterprise', status:'active',    mrr:12999, startDate:D(730), lastLogin:D(0),  website:'horizondigital.co.za', industry:'Digital Agency',   modules:ALL_MODULES,                                                                         users:28, avatar:'#a78bfa' },
  { id:'c8',  name:'Sakura Beauty',         contactName:'Nomsa Sithole',    email:'nomsa@sakuraspa.co.za',     phone:'+27 60 888 0008', plan:'starter',    status:'churned',   mrr:0,     startDate:D(180), lastLogin:D(45), website:'sakuraspa.co.za',      industry:'Beauty & Wellness',modules:['Website Builder','Brand Kit'],                                                     users:1,  avatar:'#f472b6' },
  { id:'c9',  name:'Metro Logistics',       contactName:'David van der Berg',email:'david@metrologistics.co.za',phone:'+27 82 999 0009', plan:'business',   status:'active',    mrr:5999,  startDate:D(200), lastLogin:D(4),  website:'metrologistics.co.za', industry:'Logistics',        modules:['CRM','Inventory','Projects','Accounting','HR & Payroll'],                         users:11, avatar:'#fb923c' },
  { id:'c10', name:'Summit Advisory',       contactName:'Lerato Khumalo',   email:'lerato@summitadvisory.co.za',phone:'+27 83 100 0010',plan:'business',   status:'active',    mrr:5999,  startDate:D(150), lastLogin:D(2),  website:'summitadvisory.co.za', industry:'Professional Svcs',modules:['CRM','Accounting','Quotes & Invoices','Website Builder','Email Studio'],         users:6,  avatar:'#67e8f9' },
  { id:'c11', name:'Coastal Properties',    contactName:'Marcus du Plessis',email:'marcus@coastalprop.co.za',  phone:'+27 72 110 0011', plan:'starter',    status:'suspended', mrr:2499,  startDate:D(120), lastLogin:D(20), website:'coastalprop.co.za',    industry:'Real Estate',      modules:['CRM','Website Builder'],                                                          users:2,  avatar:'#94a3b8' },
  { id:'c12', name:'Vanguard Capital',      contactName:'Ayanda Khumalo',   email:'ayanda@vanguardcap.co.za',  phone:'+27 84 120 0012', plan:'enterprise', status:'active',    mrr:12999, startDate:D(500), lastLogin:D(0),  website:'vanguardcap.co.za',    industry:'Finance',          modules:ALL_MODULES,                                                                         users:22, avatar:'#818cf8' },
]

// Generate 30 days of analytics
export const SEED_ANALYTICS: AnalyticsDay[] = Array.from({length:30},(_,i)=>{
  const d = new Date(Date.now()-(29-i)*86400000)
  const visits = 180+Math.floor(Math.random()*220)
  const signups = Math.floor(visits*0.018+Math.random()*3)
  return { date:d.toISOString().slice(0,10), visits, signups, revenue: signups*2499+Math.floor(Math.random()*8000) }
})

// Generate invoices
export const SEED_INVOICES: Invoice[] = SEED_CLIENTS.flatMap(c=>
  [0,1].map(i=>({
    id:uid(), clientId:c.id, amount:c.mrr||2499,
    status:(c.status==='churned'?'paid':c.status==='suspended'&&i===0?'overdue':'paid') as PaymentStatus,
    issueDate:D(i===0?30:60), dueDate:D(i===0?23:53), paidDate:c.status==='active'?D(i===0?28:58):undefined,
    ref:`INV-${String(2026000+SEED_CLIENTS.indexOf(c)*2+i+1).slice(0,7)}`, period:i===0?'Apr 2026':'Mar 2026',
  }))
).concat([
  { id:uid(), clientId:'c11', amount:2499, status:'overdue', issueDate:D(35), dueDate:D(28), ref:'INV-2026031', period:'Mar 2026' },
])

const KEY='admin_v1'
export const loadAdmin = () => {
  try { const r=localStorage.getItem(KEY); if(r) return JSON.parse(r) } catch {}
  return { clients:SEED_CLIENTS, invoices:SEED_INVOICES, analytics:SEED_ANALYTICS }
}
export const saveAdmin = (data:any) => localStorage.setItem(KEY, JSON.stringify(data))
