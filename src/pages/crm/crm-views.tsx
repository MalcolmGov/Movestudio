import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Contact, Activity, Stage, STAGES, ACT_TYPES, fmt, fmtDate, stg, actType } from './crm-data'
import { Avatar, StageBadge, StatCard, lbl } from './crm-components'

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function DashboardView({ contacts, activities, onAddContact, onAddActivity }: { contacts:Contact[]; activities:Activity[]; onAddContact:()=>void; onAddActivity:()=>void }) {
  const pipeline = contacts.filter(c=>!['won','lost'].includes(c.stage)).reduce((s,c)=>s+c.dealValue,0)
  const wonVal = contacts.filter(c=>c.stage==='won').reduce((s,c)=>s+c.dealValue,0)
  const wonCount = contacts.filter(c=>c.stage==='won').length
  const conv = contacts.length ? Math.round((wonCount/contacts.length)*100) : 0
  const upcoming = activities.filter(a=>!a.done&&a.date>Date.now()).sort((a,b)=>a.date-b.date).slice(0,5)
  const recent = [...contacts].sort((a,b)=>b.lastActivityAt-a.lastActivityAt).slice(0,5)
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:28, maxWidth:1100, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>CRM Dashboard</h1>
          <p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>Contacts, pipeline & activities at a glance</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onAddActivity} style={{ padding:'10px 18px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600, cursor:'pointer' }}>+ Log Activity</button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onAddContact} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ New Contact</motion.button>
        </div>
      </div>
      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
        <StatCard label="Total Contacts" value={String(contacts.length)} sub="All stages" color="#818cf8"/>
        <StatCard label="Pipeline Value" value={fmt(pipeline)} sub="Active deals" color="#60a5fa"/>
        <StatCard label="Won — Value" value={fmt(wonVal)} sub={`${wonCount} deals closed`} color="#34d399"/>
        <StatCard label="Conversion Rate" value={`${conv}%`} sub="Lead to Won" color="#fbbf24"/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Pipeline breakdown */}
        <div style={{ background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:24 }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Pipeline Breakdown</div>
          {STAGES.map(s=>{
            const cnt = contacts.filter(c=>c.stage===s.id).length
            const val = contacts.filter(c=>c.stage===s.id).reduce((t,c)=>t+c.dealValue,0)
            const pct = contacts.length ? (cnt/contacts.length)*100 : 0
            return (
              <div key={s.id} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:12 }}>
                  <span style={{ color:s.color, fontWeight:700 }}>{s.icon} {s.label}</span>
                  <span style={{ color:'rgba(255,255,255,0.4)' }}>{cnt} · {fmt(val)}</span>
                </div>
                <div style={{ height:5, borderRadius:99, background:'rgba(255,255,255,0.06)' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, delay:0.1 }} style={{ height:'100%', borderRadius:99, background:s.color }}/>
                </div>
              </div>
            )
          })}
        </div>
        {/* Upcoming activities */}
        <div style={{ background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:24 }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Upcoming Activities</div>
          {upcoming.length===0 && <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'20px 0' }}>No upcoming activities</div>}
          {upcoming.map(a=>{ const at=actType(a.type); const c=contacts.find(x=>x.id===a.contactId); return (
            <div key={a.id} style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12, padding:'10px 12px', borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize:18 }}>{at.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'white' }}>{a.title}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{c?.name} · {fmtDate(a.date)}</div>
              </div>
              <span style={{ fontSize:11, color:at.color, fontWeight:700, background:`${at.color}15`, padding:'2px 8px', borderRadius:99 }}>{at.label}</span>
            </div>
          )})}
        </div>
      </div>
      {/* Recent contacts */}
      <div style={{ background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:24 }}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Recently Active Contacts</div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {recent.map((c,i)=>{ const s=stg(c.stage); return (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 4px', borderBottom:i<recent.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
              <Avatar name={c.name} size={36} color={s.color}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{c.name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{c.role} · {c.company}</div>
              </div>
              <StageBadge stage={c.stage}/>
              <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.7)', minWidth:80, textAlign:'right' }}>{fmt(c.dealValue)}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', minWidth:60, textAlign:'right' }}>{fmtDate(c.lastActivityAt)}</div>
            </div>
          )})}
        </div>
      </div>
    </div>
  )
}

// ─── Contacts View ────────────────────────────────────────────────────────────
export function ContactsView({ contacts, onAddContact, onSelect, onDelete }: { contacts:Contact[]; onAddContact:()=>void; onSelect:(c:Contact)=>void; onDelete:(id:string)=>void }) {
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<Stage|'all'>('all')
  const filtered = contacts.filter(c=>{
    const q=search.toLowerCase()
    const match = !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    return match && (stageFilter==='all'||c.stage===stageFilter)
  })
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, width:'100%', maxWidth:1100 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Contacts</h1>
          <p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{contacts.length} contacts in your CRM</p>
        </div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onAddContact} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ New Contact</motion.button>
      </div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contacts…" style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none' }}/>
        <div style={{ display:'flex', gap:6 }}>
          {([{id:'all',label:'All',color:'rgba(255,255,255,0.5)'},...STAGES] as any[]).map((s:any)=>(
            <button key={s.id} onClick={()=>setStageFilter(s.id)} style={{ padding:'8px 14px', borderRadius:8, border:`1px solid ${stageFilter===s.id?(s.color||'#818cf8'):'rgba(255,255,255,0.1)'}`, background:stageFilter===s.id?`${s.color||'#818cf8'}20`:'transparent', color:stageFilter===s.id?(s.color||'#818cf8'):'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, cursor:'pointer' }}>{s.label}</button>
          ))}
        </div>
      </div>
      <div style={{ background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 80px', padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {['Contact','Company','Stage','Deal Value','Last Active',''].map(h=><span key={h}>{h}</span>)}
        </div>
        {filtered.length===0 && <div style={{ padding:'32px 20px', textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.3)' }}>No contacts found</div>}
        {filtered.map((c,i)=>{ const s=stg(c.stage); return (
          <motion.div key={c.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
            onClick={()=>onSelect(c)} style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 80px', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.03)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Avatar name={c.name} size={34} color={s.color}/>
              <div><div style={{ fontWeight:700, fontSize:14 }}>{c.name}</div><div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{c.email}</div></div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'center' }}><div style={{ fontSize:13, fontWeight:600 }}>{c.company}</div><div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{c.role}</div></div>
            <div style={{ display:'flex', alignItems:'center' }}><StageBadge stage={c.stage}/></div>
            <div style={{ display:'flex', alignItems:'center', fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.8)' }}>{fmt(c.dealValue)}</div>
            <div style={{ display:'flex', alignItems:'center', fontSize:12, color:'rgba(255,255,255,0.4)' }}>{fmtDate(c.lastActivityAt)}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end' }}>
              <button onClick={e=>{e.stopPropagation();if(confirm('Delete contact?'))onDelete(c.id)}} style={{ padding:'4px 10px', borderRadius:6, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#f87171', fontSize:11, cursor:'pointer' }}>✕</button>
            </div>
          </motion.div>
        )})}
      </div>
    </div>
  )
}

// ─── Pipeline View ────────────────────────────────────────────────────────────
export function PipelineView({ contacts, onSelect, onMoveStage }: { contacts:Contact[]; onSelect:(c:Contact)=>void; onMoveStage:(id:string,s:Stage)=>void }) {
  const total = contacts.reduce((s,c)=>s+c.dealValue,0)
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, width:'100%', overflow:'hidden' }}>
      <div>
        <h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Pipeline</h1>
        <p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>Total pipeline: {fmt(total)}</p>
      </div>
      <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:16 }}>
        {STAGES.map(s=>{
          const cols = contacts.filter(c=>c.stage===s.id)
          const colVal = cols.reduce((t,c)=>t+c.dealValue,0)
          return (
            <div key={s.id} style={{ minWidth:220, flexShrink:0, display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ padding:'10px 14px', borderRadius:10, background:`${s.color}12`, border:`1px solid ${s.color}30` }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:16 }}>{s.icon}</span>
                  <span style={{ fontWeight:800, fontSize:13, color:s.color }}>{s.label}</span>
                  <span style={{ marginLeft:'auto', fontSize:12, color:s.color, fontWeight:700, background:`${s.color}20`, padding:'1px 7px', borderRadius:99 }}>{cols.length}</span>
                </div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{fmt(colVal)}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {cols.map(c=>(
                  <motion.div key={c.id} whileHover={{ y:-2, scale:1.01 }} onClick={()=>onSelect(c)}
                    style={{ padding:'14px 16px', borderRadius:12, background:'#080b14', border:`1px solid rgba(255,255,255,0.08)`, cursor:'pointer', borderLeft:`3px solid ${s.color}` }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>{c.name}</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>{c.company}</div>
                    <div style={{ fontWeight:800, fontSize:14, color:s.color }}>{fmt(c.dealValue)}</div>
                    {c.tags.length>0 && <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginTop:8 }}>
                      {c.tags.map(t=><span key={t} style={{ fontSize:10, padding:'1px 7px', borderRadius:99, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)', border:'1px solid rgba(255,255,255,0.08)' }}>{t}</span>)}
                    </div>}
                    <div style={{ display:'flex', gap:4, marginTop:10, flexWrap:'wrap' }}>
                      {STAGES.filter(st=>st.id!==s.id).map(st=>(
                        <button key={st.id} onClick={e=>{e.stopPropagation();onMoveStage(c.id,st.id as Stage)}} style={{ fontSize:9, padding:'2px 6px', borderRadius:5, border:`1px solid ${st.color}40`, background:`${st.color}12`, color:st.color, cursor:'pointer', fontWeight:700 }}>→ {st.label}</button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Activities View ──────────────────────────────────────────────────────────
export function ActivitiesView({ contacts, activities, onAddActivity, onMarkDone, onDelete }: { contacts:Contact[]; activities:Activity[]; onAddActivity:()=>void; onMarkDone:(id:string)=>void; onDelete:(id:string)=>void }) {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showDone, setShowDone] = useState(false)
  const sorted = [...activities]
    .filter(a=>(typeFilter==='all'||a.type===typeFilter)&&(showDone||!a.done))
    .sort((a,b)=>a.date-b.date)
  const past = sorted.filter(a=>a.date<Date.now()||a.done)
  const upcoming = sorted.filter(a=>a.date>=Date.now()&&!a.done)
  const renderGroup = (items:Activity[], title:string) => items.length>0 && (
    <div>
      <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12 }}>{title}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map(a=>{ const at=actType(a.type); const c=contacts.find(x=>x.id===a.contactId); return (
          <motion.div key={a.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'14px 18px', borderRadius:12, background:'#080b14', border:'1px solid rgba(255,255,255,0.07)', borderLeft:`3px solid ${a.done?'rgba(255,255,255,0.1)':at.color}`, opacity:a.done?0.6:1 }}>
            <span style={{ fontSize:20, marginTop:1 }}>{at.icon}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                <span style={{ fontWeight:700, fontSize:14, textDecoration:a.done?'line-through':'none' }}>{a.title}</span>
                <span style={{ fontSize:11, color:at.color, fontWeight:700, background:`${at.color}15`, padding:'2px 8px', borderRadius:99 }}>{at.label}</span>
                {a.done && <span style={{ fontSize:11, color:'#34d399', background:'#34d39915', padding:'2px 8px', borderRadius:99 }}>Done</span>}
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>
                {c?.name&&<><strong style={{ color:'rgba(255,255,255,0.6)' }}>{c.name}</strong> · {c.company} · </>}{fmtDate(a.date)}
              </div>
              {a.notes && <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6, lineHeight:1.5 }}>{a.notes}</div>}
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              {!a.done && <button onClick={()=>onMarkDone(a.id)} style={{ padding:'5px 12px', borderRadius:7, border:'1px solid #34d39940', background:'#34d39912', color:'#34d399', fontSize:11, fontWeight:700, cursor:'pointer' }}>✓ Done</button>}
              <button onClick={()=>onDelete(a.id)} style={{ padding:'5px 10px', borderRadius:7, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#f87171', fontSize:11, cursor:'pointer' }}>✕</button>
            </div>
          </motion.div>
        )})}
      </div>
    </div>
  )
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, maxWidth:820, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Activities</h1>
          <p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{activities.length} total activities</p>
        </div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onAddActivity} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Log Activity</motion.button>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        {[{id:'all',label:'All',icon:'',color:'rgba(255,255,255,0.5)'},...ACT_TYPES].map(a=>(
          <button key={a.id} onClick={()=>setTypeFilter(a.id)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${typeFilter===a.id?a.color:'rgba(255,255,255,0.1)'}`, background:typeFilter===a.id?`${a.color}20`:'transparent', color:typeFilter===a.id?a.color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            {(a as any).icon} {a.label}
          </button>
        ))}
        <button onClick={()=>setShowDone(p=>!p)} style={{ marginLeft:'auto', padding:'7px 14px', borderRadius:8, border:`1px solid ${showDone?'#34d399':'rgba(255,255,255,0.1)'}`, background:showDone?'#34d39920':'transparent', color:showDone?'#34d399':'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          {showDone?'Hide':'Show'} Completed
        </button>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        {renderGroup(upcoming,'Upcoming')}
        {renderGroup(past,'Past & Completed')}
        {sorted.length===0 && <div style={{ textAlign:'center', padding:'48px 0', color:'rgba(255,255,255,0.3)', fontSize:14 }}>No activities yet — log your first one</div>}
      </div>
    </div>
  )
}
