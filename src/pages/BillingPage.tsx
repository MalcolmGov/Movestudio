import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardView, CustomersView, loadKit } from '../billing/BillingShared'
import { InvoicesView, QuotesView, SendModal } from '../billing/DocsViews'
import { PaymentsView, ExpensesView } from '../billing/FinanceViews'
import { ReportsView } from '../billing/ReportsView'
import StudioSidebar from '../components/StudioSidebar'
import DocEditor from '../billing/DocEditor'
import { BillingDoc } from '../billing/types'

type View = 'dashboard' | 'customers' | 'quotes' | 'invoices' | 'payments' | 'expenses' | 'reports'

const NAV: { id: View; icon: string; label: string; group?: string }[] = [
  { id: 'dashboard',  icon: '🏠', label: 'Dashboard' },
  { id: 'customers',  icon: '👥', label: 'Customers',        group: 'Manage' },
  { id: 'quotes',     icon: '📋', label: 'Quotes',           group: 'Manage' },
  { id: 'invoices',   icon: '🧾', label: 'Invoices',         group: 'Manage' },
  { id: 'payments',   icon: '💳', label: 'Payments Received', group: 'Finance' },
  { id: 'expenses',   icon: '🧾', label: 'Expenses',          group: 'Finance' },
  { id: 'reports',    icon: '📊', label: 'Reports',           group: 'Finance' },
]

const TITLES: Record<View, string> = {
  dashboard: 'Dashboard',
  customers: 'Customers',
  quotes:    'Quotations',
  invoices:  'Invoices',
  payments:  'Payments Received',
  expenses:  'Expenses',
  reports:   'Reports & Analytics',
}

export default function BillingPage() {
  const kit = loadKit()
  const [view, setView] = useState<View>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [editingDoc, setEditingDoc] = useState<BillingDoc | null>(null)
  const [sendingDoc, setSendingDoc] = useState<BillingDoc | null>(null)
  const [tableKey,   setTableKey]   = useState(0) // bump to force DocsTable reload

  const closeEditor = () => { setEditingDoc(null); setTableKey(k => k + 1) }

  const groups = ['', 'Manage', 'Finance']

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'Inter,sans-serif', background:'#040608', color:'white', overflow:'hidden' }}>

      {/* ── Full-screen Doc Editor overlay ── */}
      <AnimatePresence>
        {editingDoc && (
          <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:40 }} transition={{ duration:0.2 }}
            style={{ position:'fixed', inset:0, zIndex:300, display:'flex', flexDirection:'column' }}>
            <DocEditor
              initial={editingDoc}
              kit={kit}
              onBack={closeEditor}
              onSend={doc => { closeEditor(); setSendingDoc(doc) }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Send modal (triggered from editor or table) ── */}
      <AnimatePresence>
        {sendingDoc && (
          <SendModal
            doc={sendingDoc}
            kit={kit}
            onClose={() => setSendingDoc(null)}
            onSent={() => { setSendingDoc(null); setTableKey(k => k + 1) }}
          />
        )}
      </AnimatePresence>

      {/* ── Shared Studio Sidebar ── */}
      <StudioSidebar kit={kit} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />

      {/* ── Billing Sub-Nav ── */}
      <div style={{ width:200, flexShrink:0, background:'rgba(255,255,255,0.02)', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', overflowY:'auto' }}>
        <div style={{ padding:'16px 14px 10px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
          Billing Suite
        </div>
        <div style={{ flex:1, padding:'8px 10px' }}>
          {groups.map(group => {
            const items = NAV.filter(n => (n.group || '') === group)
            return (
              <div key={group}>
                {group && <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'10px 8px 4px' }}>{group}</div>}
                {items.map(n => (
                  <button key={n.id} onClick={() => setView(n.id)}
                    style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 10px', borderRadius:7, border:`1px solid ${view===n.id ? kit.primary+'50' : 'transparent'}`, background: view===n.id ? `${kit.primary}18` : 'transparent', cursor:'pointer', marginBottom:2, transition:'all 0.15s' }}>
                    <span style={{ fontSize:15 }}>{n.icon}</span>
                    <span style={{ fontSize:12, fontWeight: view===n.id ? 700 : 400, color: view===n.id ? 'white' : 'rgba(255,255,255,0.45)' }}>{n.label}</span>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Topbar */}
        <div style={{ padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12, flexShrink:0, background:'rgba(255,255,255,0.02)' }}>
          <div>
            <div style={{ fontWeight:900, fontSize:17, color:'white', letterSpacing:'-0.03em' }}>{TITLES[view]}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:1 }}>Move Studio Billing Suite</div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:6, alignItems:'center' }}>
            {[kit.primary, kit.secondary, kit.accent].map((c,i) => (
              <div key={i} style={{ width:9, height:9, borderRadius:'50%', background:c, boxShadow:`0 0 7px ${c}80` }} />
            ))}
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginLeft:6 }}>Brand kit active</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'22px 24px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}>
              {view === 'dashboard' && <DashboardView kit={kit} onNav={v => setView(v as View)} />}
              {view === 'customers' && <CustomersView kit={kit} />}
              {view === 'quotes'    && <QuotesView    key={tableKey} kit={kit} onEdit={setEditingDoc} onSend={setSendingDoc} />}
              {view === 'invoices'  && <InvoicesView  key={tableKey} kit={kit} onEdit={setEditingDoc} onSend={setSendingDoc} />}
              {view === 'payments'  && <PaymentsView  kit={kit} />}
              {view === 'expenses'  && <ExpensesView  kit={kit} />}
              {view === 'reports'   && <ReportsView   kit={kit} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
