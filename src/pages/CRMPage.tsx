import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import StudioSidebar from '../components/StudioSidebar'
import { Contact, Activity, Stage, loadCRM, saveCRM, uid } from './crm/crm-data'
import { AddContactModal, AddActivityModal, ContactPanel } from './crm/crm-components'
import { DashboardView, ContactsView, PipelineView, ActivitiesView } from './crm/crm-views'

type View = 'dashboard'|'contacts'|'pipeline'|'activities'

const NAV_ITEMS: { id: View; icon: string; label: string }[] = [
  { id:'dashboard',  icon:'⬡',  label:'Dashboard'  },
  { id:'contacts',   icon:'👤', label:'Contacts'   },
  { id:'pipeline',   icon:'📊', label:'Pipeline'   },
  { id:'activities', icon:'📅', label:'Activities' },
]

export default function CRMPage() {
  const [data, setData] = useState(() => loadCRM())
  const [view, setView] = useState<View>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact|undefined>()
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [activityContactId, setActivityContactId] = useState<string|undefined>()
  const [selectedContact, setSelectedContact] = useState<Contact|undefined>()

  const { contacts, activities } = data

  const save = (c: Contact[], a: Activity[]) => {
    saveCRM(c, a)
    setData({ contacts: c, activities: a })
  }

  const addContact = (c: Contact) => {
    const existing = contacts.find(x => x.id === c.id)
    const next = existing ? contacts.map(x=>x.id===c.id?c:x) : [...contacts, c]
    save(next, activities)
    setShowAddContact(false)
    setEditingContact(undefined)
    if (selectedContact?.id === c.id) setSelectedContact(c)
  }

  const deleteContact = (id: string) => {
    save(contacts.filter(c=>c.id!==id), activities.filter(a=>a.contactId!==id))
    if (selectedContact?.id === id) setSelectedContact(undefined)
  }

  const addActivity = (a: Activity) => {
    const updatedContacts = contacts.map(c => c.id===a.contactId ? {...c, lastActivityAt: Date.now()} : c)
    save(updatedContacts, [...activities, a])
    setShowAddActivity(false)
    setActivityContactId(undefined)
    if (selectedContact?.id === a.contactId) setSelectedContact(updatedContacts.find(c=>c.id===a.contactId))
  }

  const markDone = (id: string) => {
    save(contacts, activities.map(a=>a.id===id?{...a,done:true}:a))
  }

  const deleteActivity = (id: string) => {
    save(contacts, activities.filter(a=>a.id!==id))
  }

  const moveStage = (contactId: string, stage: Stage) => {
    const next = contacts.map(c=>c.id===contactId?{...c,stage,lastActivityAt:Date.now()}:c)
    save(next, activities)
    if (selectedContact?.id === contactId) setSelectedContact(next.find(c=>c.id===contactId))
  }

  const openAddActivity = (contactId?: string) => {
    setActivityContactId(contactId)
    setShowAddActivity(true)
  }

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'var(--font, Inter, sans-serif)', background:'#040608', color:'white', overflow:'hidden' }}>
      <StudioSidebar collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(p=>!p)}/>

      {/* CRM sub-nav */}
      <div style={{ width:180, flexShrink:0, background:'#080b14', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', padding:'20px 10px', gap:4 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 6px', marginBottom:10 }}>CRM</div>
        {NAV_ITEMS.map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:`1px solid ${view===item.id?'rgba(99,102,241,0.4)':'transparent'}`, background:view===item.id?'rgba(99,102,241,0.12)':'transparent', color:view===item.id?'white':'rgba(255,255,255,0.5)', fontSize:13, fontWeight:view===item.id?700:500, cursor:'pointer', textAlign:'left', width:'100%' }}>
            <span style={{ fontSize:16 }}>{item.icon}</span> {item.label}
          </button>
        ))}
        <div style={{ marginTop:'auto', padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginBottom:6 }}>Pipeline total</div>
          <div style={{ fontSize:14, fontWeight:800, color:'#818cf8' }}>
            R {contacts.filter(c=>!['won','lost'].includes(c.stage)).reduce((s,c)=>s+c.dealValue,0).toLocaleString('en-ZA')}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, overflowY:'auto', display:'flex' }}>
        {view==='dashboard' && <DashboardView contacts={contacts} activities={activities} onAddContact={()=>setShowAddContact(true)} onAddActivity={()=>openAddActivity()}/>}
        {view==='contacts' && <ContactsView contacts={contacts} onAddContact={()=>setShowAddContact(true)} onSelect={setSelectedContact} onDelete={deleteContact}/>}
        {view==='pipeline' && <PipelineView contacts={contacts} onSelect={setSelectedContact} onMoveStage={moveStage}/>}
        {view==='activities' && <ActivitiesView contacts={contacts} activities={activities} onAddActivity={()=>openAddActivity()} onMarkDone={markDone} onDelete={deleteActivity}/>}
      </div>

      {/* Contact detail panel */}
      <AnimatePresence>
        {selectedContact && (
          <ContactPanel
            contact={selectedContact}
            activities={activities}
            contacts={contacts}
            onClose={()=>setSelectedContact(undefined)}
            onEdit={()=>{ setEditingContact(selectedContact); setShowAddContact(true) }}
            onAddAct={(id)=>openAddActivity(id)}
            onMarkDone={markDone}
            onMoveStage={(s)=>moveStage(selectedContact.id, s)}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      {showAddContact && (
        <AddContactModal
          existing={editingContact}
          onClose={()=>{ setShowAddContact(false); setEditingContact(undefined) }}
          onSave={addContact}
        />
      )}
      {showAddActivity && (
        <AddActivityModal
          contacts={contacts}
          defaultContactId={activityContactId}
          onClose={()=>{ setShowAddActivity(false); setActivityContactId(undefined) }}
          onSave={addActivity}
        />
      )}
    </div>
  )
}
