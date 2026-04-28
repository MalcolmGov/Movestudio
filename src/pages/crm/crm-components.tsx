import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Stage, ActType, Contact, Activity, STAGES, ACT_TYPES, uid, fmt, fmtDate, initials, stg, actType } from './crm-data'

export const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const }
export const lbl: React.CSSProperties = { fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:5, display:'block' }

export function Avatar({ name, size=34, color }: { name:string; size?:number; color:string }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}22`, border:`1.5px solid ${color}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.33, fontWeight:800, color, flexShrink:0 }}>{initials(name)}</div>
}

export function StageBadge({ stage }: { stage: Stage }) {
  const s = stg(stage)
  return <span style={{ padding:'3px 10px', borderRadius:99, background:`${s.color}18`, border:`1px solid ${s.color}40`, color:s.color, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>{s.label}</span>
}

export function StatCard({ label, value, sub, color }: { label:string; value:string; sub:string; color:string }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      style={{ flex:1, minWidth:160, padding:'20px 24px', borderRadius:14, background:'#080b14', border:'1px solid rgba(255,255,255,0.07)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`${color}15`, filter:'blur(24px)' }}/>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:900, color, letterSpacing:'-0.03em', marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{sub}</div>
    </motion.div>
  )
}

export function AddContactModal({ onClose, onSave, existing }: { onClose:()=>void; onSave:(c:Contact)=>void; existing?:Contact }) {
  const [f, setF] = useState({ name:existing?.name||'', email:existing?.email||'', phone:existing?.phone||'', company:existing?.company||'', role:existing?.role||'', dealValue:existing?.dealValue||0, stage:(existing?.stage||'lead') as Stage, tags:(existing?.tags||[]).join(', '), notes:existing?.notes||'' })
  const u = (k:string, v:string|number) => setF(p=>({...p,[k]:v}))
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:480, maxHeight:'88vh', overflowY:'auto' }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24, letterSpacing:'-0.02em' }}>{existing?'Edit Contact':'New Contact'}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {([['name','Full Name','Jane Smith'],['email','Email','jane@company.com'],['phone','Phone','+27 82 000 0000'],['company','Company','Acme Corp'],['role','Job Title','CEO']] as [string,string,string][]).map(([k,label,ph])=>(
            <div key={k}><label style={lbl}>{label}</label><input style={inp} value={(f as any)[k]} placeholder={ph} onChange={e=>u(k,e.target.value)}/></div>
          ))}
          <div><label style={lbl}>Deal Value (R)</label><input style={inp} type="number" value={f.dealValue} onChange={e=>u('dealValue',Number(e.target.value))}/></div>
          <div><label style={lbl}>Stage</label>
            <select style={{ ...inp }} value={f.stage} onChange={e=>u('stage',e.target.value)}>
              {STAGES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div style={{ gridColumn:'span 2' }}><label style={lbl}>Tags (comma separated)</label><input style={inp} value={f.tags} placeholder="SaaS, Enterprise" onChange={e=>u('tags',e.target.value)}/></div>
          <div style={{ gridColumn:'span 2' }}><label style={lbl}>Notes</label><textarea style={{ ...inp, resize:'vertical', minHeight:70 }} value={f.notes} onChange={e=>u('notes',e.target.value)}/></div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>{
            if(!f.name.trim()) return
            const now=Date.now()
            onSave({ id:existing?.id||uid(), name:f.name, email:f.email, phone:f.phone, company:f.company, role:f.role, dealValue:f.dealValue, stage:f.stage, tags:f.tags.split(',').map(t=>t.trim()).filter(Boolean), notes:f.notes, createdAt:existing?.createdAt||now, lastActivityAt:now })
          }} style={{ padding:'10px 24px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, cursor:'pointer' }}>
            {existing?'Save Changes':'Add Contact'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export function AddActivityModal({ contacts, onClose, onSave, defaultContactId }: { contacts:Contact[]; onClose:()=>void; onSave:(a:Activity)=>void; defaultContactId?:string }) {
  const [f, setF] = useState({ contactId:defaultContactId||contacts[0]?.id||'', type:'call' as ActType, title:'', notes:'', date:new Date().toISOString().slice(0,16) })
  const u = (k:string, v:string) => setF(p=>({...p,[k]:v}))
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:440 }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24, letterSpacing:'-0.02em' }}>Log Activity</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={lbl}>Contact</label>
            <select style={{ ...inp }} value={f.contactId} onChange={e=>u('contactId',e.target.value)}>
              {contacts.map(c=><option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Type</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {ACT_TYPES.map(a=>(
                <button key={a.id} onClick={()=>u('type',a.id)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${f.type===a.id?a.color:'rgba(255,255,255,0.1)'}`, background:f.type===a.id?`${a.color}22`:'transparent', color:f.type===a.id?a.color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:12, fontWeight:700 }}>{a.icon} {a.label}</button>
              ))}
            </div>
          </div>
          <div><label style={lbl}>Title</label><input style={inp} value={f.title} placeholder="e.g. Follow-up call" onChange={e=>u('title',e.target.value)}/></div>
          <div><label style={lbl}>Date & Time</label><input style={inp} type="datetime-local" value={f.date} onChange={e=>u('date',e.target.value)}/></div>
          <div><label style={lbl}>Notes</label><textarea style={{ ...inp, resize:'vertical', minHeight:60 }} value={f.notes} onChange={e=>u('notes',e.target.value)}/></div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>{ if(!f.title.trim()) return; onSave({ id:uid(), contactId:f.contactId, type:f.type, title:f.title, date:new Date(f.date).getTime(), done:false, notes:f.notes }) }} style={{ padding:'10px 24px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, cursor:'pointer' }}>Save Activity</motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export function ContactPanel({ contact, activities, contacts, onClose, onEdit, onAddAct, onMarkDone, onMoveStage }: { contact:Contact; activities:Activity[]; contacts:Contact[]; onClose:()=>void; onEdit:()=>void; onAddAct:(id:string)=>void; onMarkDone:(id:string)=>void; onMoveStage:(s:Stage)=>void }) {
  const s = stg(contact.stage)
  const myActs = activities.filter(a=>a.contactId===contact.id).sort((a,b)=>b.date-a.date)
  return (
    <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', damping:28, stiffness:260 }}
      style={{ position:'fixed', top:0, right:0, height:'100vh', width:400, background:'#080b14', borderLeft:'1px solid rgba(255,255,255,0.08)', zIndex:80, overflowY:'auto', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <Avatar name={contact.name} size={44} color={s.color}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:800, fontSize:16 }}>{contact.name}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{contact.role} · {contact.company}</div>
        </div>
        <button onClick={onEdit} style={{ padding:'6px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.6)', fontSize:12, cursor:'pointer' }}>Edit</button>
        <button onClick={onClose} style={{ width:28, height:28, borderRadius:7, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.4)', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
      </div>
      <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:20, flex:1 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[['📧',contact.email],['📞',contact.phone],['💰',fmt(contact.dealValue)],['🏢',`${contact.role}, ${contact.company}`]].map(([icon,val])=>(
            <div key={icon as string} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,0.6)' }}><span style={{ width:20, textAlign:'center' }}>{icon}</span>{val}</div>
          ))}
          {contact.tags.length>0 && <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:4 }}>
            {contact.tags.map(t=><span key={t} style={{ padding:'2px 9px', borderRadius:99, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', fontSize:11, color:'rgba(255,255,255,0.5)' }}>{t}</span>)}
          </div>}
        </div>
        <div>
          <div style={{ ...lbl, marginBottom:10 }}>Move Stage</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {STAGES.map(st=>(
              <button key={st.id} onClick={()=>onMoveStage(st.id as Stage)} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${contact.stage===st.id?st.color:'rgba(255,255,255,0.08)'}`, background:contact.stage===st.id?`${st.color}20`:'transparent', color:contact.stage===st.id?st.color:'rgba(255,255,255,0.35)', fontSize:11, fontWeight:700, cursor:'pointer' }}>{st.label}</button>
            ))}
          </div>
        </div>
        {contact.notes && <div><div style={lbl}>Notes</div><div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.6, background:'rgba(255,255,255,0.03)', borderRadius:9, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.06)' }}>{contact.notes}</div></div>}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div style={lbl}>Activities ({myActs.length})</div>
            <button onClick={()=>onAddAct(contact.id)} style={{ fontSize:11, padding:'4px 10px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>+ Log</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {myActs.length===0 && <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'20px 0' }}>No activities yet</div>}
            {myActs.map(a=>{ const at=actType(a.type); return (
              <div key={a.id} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'10px 12px', borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', opacity:a.done?0.6:1 }}>
                <span style={{ fontSize:16 }}>{at.icon}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, textDecoration:a.done?'line-through':'none' }}>{a.title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{fmtDate(a.date)}</div>
                  {a.notes && <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{a.notes}</div>}
                </div>
                {!a.done && <button onClick={()=>onMarkDone(a.id)} style={{ padding:'3px 8px', borderRadius:5, border:'1px solid #34d39940', background:'#34d39912', color:'#34d399', fontSize:10, fontWeight:700, cursor:'pointer', flexShrink:0 }}>✓ Done</button>}
              </div>
            )})}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
