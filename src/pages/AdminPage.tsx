import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Client, Invoice, loadAdmin, saveAdmin } from './admin/admin-data'
import { ClientModal, InvoiceModal } from './admin/admin-components'
import { OverviewView, ClientsView, SubscriptionsView, InvoicesView, ModulesView, AnalyticsView } from './admin/admin-views'

type View = 'overview'|'clients'|'subscriptions'|'invoices'|'modules'|'analytics'

const NAV: { id:View; icon:string; label:string }[] = [
  { id:'overview',      icon:'⬡',  label:'Overview'       },
  { id:'clients',       icon:'👥', label:'Clients'        },
  { id:'subscriptions', icon:'💳', label:'Subscriptions'  },
  { id:'invoices',      icon:'🧾', label:'Invoices'       },
  { id:'modules',       icon:'⚙️', label:'Module Usage'   },
  { id:'analytics',     icon:'📈', label:'Analytics'      },
]

export default function AdminPage() {
  const [data, setData]       = useState(() => loadAdmin())
  const [view, setView]       = useState<View>('overview')
  const [showClient, setShowClient]   = useState(false)
  const [editClient, setEditClient]   = useState<Client|undefined>()
  const [showInvoice, setShowInvoice] = useState(false)

  const { clients, invoices, analytics } = data

  const save = (c: Client[], i: Invoice[]) => {
    const next = { ...data, clients: c, invoices: i }
    saveAdmin(next); setData(next)
  }

  const saveClient = (c: Client) => {
    const exists = clients.find(x => x.id === c.id)
    save(exists ? clients.map(x => x.id===c.id ? c : x) : [...clients, c], invoices)
    setShowClient(false); setEditClient(undefined)
  }

  const deleteClient = (id: string) =>
    save(clients.filter(c => c.id !== id), invoices.filter(i => i.clientId !== id))

  const saveInvoice = (inv: Invoice) => {
    save(clients, [...invoices, inv]); setShowInvoice(false)
  }

  const markPaid = (id: string) =>
    save(clients, invoices.map(i => i.id===id ? { ...i, status:'paid' as const, paidDate:Date.now() } : i))

  const overdueCount = invoices.filter(i => i.status==='overdue').length

  return (
    <div style={{ display:'flex', height:'100vh', background:'#040608', color:'white', fontFamily:"'Inter',sans-serif", overflow:'hidden' }}>

      {/* Sidebar */}
      <div style={{ width:220, flexShrink:0, background:'#080b14', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column' }}>
        {/* Logo */}
        <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#6366f1,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:900, color:'white' }}>M</div>
            <div>
              <div style={{ fontSize:13, fontWeight:900, color:'white' }}>Move Studio</div>
              <div style={{ fontSize:9, fontWeight:700, color:'#a78bfa', textTransform:'uppercase', letterSpacing:'0.12em' }}>Admin Console</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2 }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 8px', marginBottom:6 }}>Management</div>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:9, border:`1px solid ${view===item.id?'rgba(99,102,241,0.4)':'transparent'}`, background:view===item.id?'rgba(99,102,241,0.12)':'transparent', color:view===item.id?'white':'rgba(255,255,255,0.5)', fontSize:13, fontWeight:view===item.id?700:500, cursor:'pointer', textAlign:'left', width:'100%', position:'relative' }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              {item.label}
              {item.id==='invoices' && overdueCount>0 && (
                <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, color:'#e2445c', background:'rgba(226,68,92,0.15)', padding:'1px 6px', borderRadius:99, border:'1px solid rgba(226,68,92,0.3)' }}>{overdueCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Bottom stats */}
        <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', marginBottom:8, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Platform</div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Active Clients</span>
            <span style={{ fontSize:11, fontWeight:700, color:'#10b981' }}>{clients.filter(c=>c.status==='active').length}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>MRR</span>
            <span style={{ fontSize:11, fontWeight:700, color:'#6366f1' }}>R {(clients.filter(c=>c.status==='active').reduce((s,c)=>s+c.mrr,0)/1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.15 }} style={{ flex:1, display:'flex' }}>
            {view==='overview'      && <OverviewView clients={clients} invoices={invoices} analytics={analytics} onAddClient={()=>{ setEditClient(undefined); setShowClient(true) }}/>}
            {view==='clients'       && <ClientsView clients={clients} onAdd={()=>{ setEditClient(undefined); setShowClient(true) }} onEdit={c=>{ setEditClient(c); setShowClient(true) }} onDelete={deleteClient}/>}
            {view==='subscriptions' && <SubscriptionsView clients={clients}/>}
            {view==='invoices'      && <InvoicesView clients={clients} invoices={invoices} onCreateInvoice={()=>setShowInvoice(true)} onMarkPaid={markPaid}/>}
            {view==='modules'       && <ModulesView clients={clients}/>}
            {view==='analytics'     && <AnalyticsView analytics={analytics} clients={clients}/>}
          </motion.div>
        </AnimatePresence>
      </div>

      {showClient  && <ClientModal existing={editClient} onClose={()=>{ setShowClient(false); setEditClient(undefined) }} onSave={saveClient}/>}
      {showInvoice && <InvoiceModal clients={clients} onClose={()=>setShowInvoice(false)} onSave={saveInvoice}/>}
    </div>
  )
}
