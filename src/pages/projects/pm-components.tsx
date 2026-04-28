import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Project, Task, TaskStatus, TaskPriority, STATUS, PRIORITY, PROJECT_COLORS, TEAM_MEMBERS, fmtDate, isOverdue, uid } from './pm-data'

export const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const }
export const lbl: React.CSSProperties = { fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:5, display:'block' }

// ── Status pill (Monday.com style) ────────────────────────────────────────────
export function StatusPill({ status, onClick, small }: { status:TaskStatus; onClick?:()=>void; small?:boolean }) {
  const s = STATUS[status]
  return (
    <span onClick={onClick} style={{ padding:small?'2px 8px':'4px 12px', borderRadius:4, background:s.bg, color:s.color, fontSize:small?10:11, fontWeight:700, cursor:onClick?'pointer':'default', border:`1px solid ${s.color}30`, whiteSpace:'nowrap', display:'inline-block' }}>
      {s.label}
    </span>
  )
}

// ── Priority pill ─────────────────────────────────────────────────────────────
export function PriorityPill({ priority, small }: { priority:TaskPriority; small?:boolean }) {
  const p = PRIORITY[priority]
  return (
    <span style={{ padding:small?'2px 8px':'4px 10px', borderRadius:4, background:p.bg, color:p.color, fontSize:small?10:11, fontWeight:700, border:`1px solid ${p.color}30`, whiteSpace:'nowrap', display:'inline-block' }}>
      {p.label}
    </span>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, color='#579bfc', height=6 }: { value:number; color?:string; height?:number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height, borderRadius:99, background:'rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${value}%` }} transition={{ duration:0.6 }} style={{ height:'100%', borderRadius:99, background:color }}/>
      </div>
      <span style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:700, minWidth:28 }}>{value}%</span>
    </div>
  )
}

// ── Assignee avatar ───────────────────────────────────────────────────────────
export function Assignee({ name, size=26 }: { name:string; size?:number }) {
  const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase()
  const colors = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6']
  const color = colors[name.charCodeAt(0)%colors.length]
  return (
    <div title={name} style={{ width:size, height:size, borderRadius:'50%', background:`${color}30`, border:`1.5px solid ${color}60`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.35, fontWeight:800, color, flexShrink:0, cursor:'default' }}>
      {initials}
    </div>
  )
}

// ── Add Project Modal ─────────────────────────────────────────────────────────
export function AddProjectModal({ onClose, onSave, existing }: { onClose:()=>void; onSave:(p:Project)=>void; existing?:Project }) {
  const [f, setF] = useState({ name:existing?.name||'', description:existing?.description||'', color:existing?.color||PROJECT_COLORS[0], startDate:existing?.startDate?new Date(existing.startDate).toISOString().slice(0,10):new Date().toISOString().slice(0,10), endDate:existing?.endDate?new Date(existing.endDate).toISOString().slice(0,10):'' })
  const u = (k:string, v:string) => setF(p=>({...p,[k]:v}))
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:460 }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24, letterSpacing:'-0.02em' }}>{existing?'Edit Project':'New Project'}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={lbl}>Project Name</label><input style={inp} value={f.name} placeholder="e.g. Brand Identity — Acme Corp" onChange={e=>u('name',e.target.value)}/></div>
          <div><label style={lbl}>Description</label><textarea style={{ ...inp, resize:'vertical', minHeight:70 }} value={f.description} placeholder="Brief project overview…" onChange={e=>u('description',e.target.value)}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Start Date</label><input style={inp} type="date" value={f.startDate} onChange={e=>u('startDate',e.target.value)}/></div>
            <div><label style={lbl}>End Date</label><input style={inp} type="date" value={f.endDate} onChange={e=>u('endDate',e.target.value)}/></div>
          </div>
          <div>
            <label style={lbl}>Project Colour</label>
            <div style={{ display:'flex', gap:8 }}>
              {PROJECT_COLORS.map(c=>(
                <button key={c} onClick={()=>u('color',c)} style={{ width:28, height:28, borderRadius:'50%', background:c, border:f.color===c?'2px solid white':'2px solid transparent', cursor:'pointer', flexShrink:0 }}/>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>{
            if(!f.name.trim()) return
            const now=Date.now()
            onSave({ id:existing?.id||uid(), name:f.name, description:f.description, color:f.color, startDate:f.startDate?new Date(f.startDate).getTime():now, endDate:f.endDate?new Date(f.endDate).getTime():now+86400000*30, createdAt:existing?.createdAt||now })
          }} style={{ padding:'10px 24px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, cursor:'pointer' }}>
            {existing?'Save Changes':'Create Project'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Add Task Modal ────────────────────────────────────────────────────────────
export function AddTaskModal({ projects, onClose, onSave, existing, defaultProjectId }: { projects:Project[]; onClose:()=>void; onSave:(t:Task)=>void; existing?:Task; defaultProjectId?:string }) {
  const [f, setF] = useState({
    projectId:existing?.projectId||defaultProjectId||projects[0]?.id||'',
    title:existing?.title||'', group:existing?.group||'',
    status:(existing?.status||'not-started') as TaskStatus,
    priority:(existing?.priority||'medium') as TaskPriority,
    assignee:existing?.assignee||TEAM_MEMBERS[0],
    dueDate:existing?.dueDate?new Date(existing.dueDate).toISOString().slice(0,10):'',
    notes:existing?.notes||'', progress:existing?.progress||0,
  })
  const u = (k:string, v:string|number) => setF(p=>({...p,[k]:v}))
  // Get existing groups for selected project
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:480, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24, letterSpacing:'-0.02em' }}>{existing?'Edit Task':'New Task'}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={lbl}>Task Title</label><input style={inp} value={f.title} placeholder="e.g. Design homepage wireframes" onChange={e=>u('title',e.target.value)}/></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Project</label>
              <select style={{ ...inp }} value={f.projectId} onChange={e=>u('projectId',e.target.value)}>
                {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Group / Phase</label><input style={inp} value={f.group} placeholder="e.g. Phase 1 — Design" onChange={e=>u('group',e.target.value)}/></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Status</label>
              <select style={{ ...inp }} value={f.status} onChange={e=>u('status',e.target.value)}>
                {(Object.entries(STATUS) as [TaskStatus,any][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Priority</label>
              <select style={{ ...inp }} value={f.priority} onChange={e=>u('priority',e.target.value)}>
                {(Object.entries(PRIORITY) as [TaskPriority,any][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Assignee</label>
              <select style={{ ...inp }} value={f.assignee} onChange={e=>u('assignee',e.target.value)}>
                {TEAM_MEMBERS.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Due Date</label><input style={inp} type="date" value={f.dueDate} onChange={e=>u('dueDate',e.target.value)}/></div>
          </div>
          <div>
            <label style={lbl}>Progress ({f.progress}%)</label>
            <input type="range" min={0} max={100} value={f.progress} onChange={e=>u('progress',Number(e.target.value))} style={{ width:'100%', accentColor:'#579bfc' }}/>
          </div>
          <div><label style={lbl}>Notes</label><textarea style={{ ...inp, resize:'vertical', minHeight:60 }} value={f.notes} placeholder="Additional context…" onChange={e=>u('notes',e.target.value)}/></div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>{
            if(!f.title.trim()) return
            const now=Date.now()
            onSave({ id:existing?.id||uid(), projectId:f.projectId, title:f.title, group:f.group||'General', status:f.status, priority:f.priority, assignee:f.assignee, dueDate:f.dueDate?new Date(f.dueDate).getTime():now+86400000*7, notes:f.notes, progress:f.progress, createdAt:existing?.createdAt||now })
          }} style={{ padding:'10px 24px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#579bfc,#6366f1)', color:'white', fontWeight:700, cursor:'pointer' }}>
            {existing?'Save Changes':'Add Task'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
