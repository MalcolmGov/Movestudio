import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Project, Task, TaskStatus, STATUS, PRIORITY, fmtDate, isOverdue, getProjectProgress, getProjectStats, uid } from './pm-data'
import { StatusPill, PriorityPill, ProgressBar, Assignee, lbl } from './pm-components'

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function DashboardView({ projects, tasks, onNewProject, onNewTask, onSelectProject }: { projects:Project[]; tasks:Task[]; onNewProject:()=>void; onNewTask:()=>void; onSelectProject:(id:string)=>void }) {
  const allStats = { total:tasks.length, done:tasks.filter(t=>t.status==='done').length, inProgress:tasks.filter(t=>t.status==='in-progress').length, stuck:tasks.filter(t=>t.status==='stuck').length, overdue:tasks.filter(t=>isOverdue(t.dueDate,t.status)).length }
  const upcoming = tasks.filter(t=>t.status!=='done'&&t.status!=='cancelled').sort((a,b)=>a.dueDate-b.dueDate).slice(0,5)
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:28, maxWidth:1100, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Projects</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{projects.length} active projects · {tasks.length} tasks</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onNewTask} style={{ padding:'10px 18px', borderRadius:9, border:'1px solid rgba(87,155,252,0.3)', background:'rgba(87,155,252,0.08)', color:'#579bfc', fontSize:13, fontWeight:600, cursor:'pointer' }}>+ Add Task</button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onNewProject} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ New Project</motion.button>
        </div>
      </div>
      {/* Stats */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        {[{l:'Total Tasks',v:allStats.total,c:'#c4c4c4'},{l:'In Progress',v:allStats.inProgress,c:'#579bfc'},{l:'Done',v:allStats.done,c:'#00c875'},{l:'Stuck',v:allStats.stuck,c:'#e2445c'},{l:'Overdue',v:allStats.overdue,c:'#fdab3d'}].map(s=>(
          <div key={s.l} style={{ flex:1, minWidth:120, padding:'16px 20px', borderRadius:12, background:'#080b14', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
            <div style={{ fontSize:28, fontWeight:900, color:s.c, marginBottom:4 }}>{s.v}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.l}</div>
          </div>
        ))}
      </div>
      {/* Project cards */}
      <div>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>All Projects</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
          {projects.map((p,i)=>{
            const ptasks = tasks.filter(t=>t.projectId===p.id)
            const stats = getProjectStats(ptasks)
            const progress = getProjectProgress(ptasks)
            const daysLeft = Math.ceil((p.endDate-Date.now())/86400000)
            return (
              <motion.div key={p.id} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
                onClick={()=>onSelectProject(p.id)} style={{ background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', borderLeft:`4px solid ${p.color}`, padding:20, cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e=>(e.currentTarget.style.background='#0d1117')} onMouseLeave={e=>(e.currentTarget.style.background='#080b14')}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:14 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:p.color, marginTop:5, flexShrink:0 }}/>
                  <div><div style={{ fontWeight:800, fontSize:14, lineHeight:1.3 }}>{p.name}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:3 }}>{p.description.slice(0,60)}{p.description.length>60?'…':''}</div></div>
                </div>
                <ProgressBar value={progress} color={p.color}/>
                <div style={{ display:'flex', gap:12, marginTop:14, fontSize:11, color:'rgba(255,255,255,0.4)' }}>
                  <span>📋 {stats.total} tasks</span>
                  <span style={{ color:'#00c875' }}>✓ {stats.done}</span>
                  {stats.stuck>0&&<span style={{ color:'#e2445c' }}>⚠ {stats.stuck} stuck</span>}
                  <span style={{ marginLeft:'auto', color:daysLeft<0?'#e2445c':daysLeft<7?'#fdab3d':'rgba(255,255,255,0.4)' }}>{daysLeft<0?`${Math.abs(daysLeft)}d overdue`:`${daysLeft}d left`}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      {/* Upcoming tasks */}
      <div style={{ background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:24 }}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Upcoming Tasks</div>
        {upcoming.map((t,i)=>{ const proj=projects.find(p=>p.id===t.projectId); return (
          <div key={t.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 4px', borderBottom:i<upcoming.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
            <StatusPill status={t.status} small/>
            <div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:600, fontSize:13 }}>{t.title}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:1 }}>{proj?.name}</div></div>
            <Assignee name={t.assignee}/>
            <PriorityPill priority={t.priority} small/>
            <div style={{ fontSize:11, color:isOverdue(t.dueDate,t.status)?'#e2445c':'rgba(255,255,255,0.4)', minWidth:70, textAlign:'right' }}>{fmtDate(t.dueDate)}</div>
          </div>
        )})}
      </div>
    </div>
  )
}

// ─── Table View (Monday.com style) ────────────────────────────────────────────
export function TableView({ projects, tasks, selectedProjectId, onSelectProject, onAddTask, onEditTask, onDeleteTask, onUpdateStatus }: { projects:Project[]; tasks:Task[]; selectedProjectId:string|null; onSelectProject:(id:string)=>void; onAddTask:(projectId:string,group:string)=>void; onEditTask:(t:Task)=>void; onDeleteTask:(id:string)=>void; onUpdateStatus:(id:string,s:TaskStatus)=>void }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const proj = selectedProjectId ? projects.find(p=>p.id===selectedProjectId) : projects[0]
  if(!proj) return <div style={{ padding:32, color:'rgba(255,255,255,0.4)' }}>No projects found.</div>
  const ptasks = tasks.filter(t=>t.projectId===proj.id)
  const groups = [...new Set(ptasks.map(t=>t.group))]
  const toggle = (g:string) => setCollapsed(prev=>{ const n=new Set(prev); n.has(g)?n.delete(g):n.add(g); return n })
  const COLS = ['Task','Status','Assignee','Priority','Due Date','Progress','']
  const GRID = '2.5fr 1.2fr 100px 1fr 120px 160px 50px'
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:0, width:'100%', maxWidth:1200 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, flexWrap:'wrap' }}>
        <select value={proj.id} onChange={e=>onSelectProject(e.target.value)} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'#080b14', color:'white', fontSize:14, fontWeight:700, cursor:'pointer', outline:'none' }}>
          {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{ display:'flex', gap:6 }}>
          {[{l:'Done',v:ptasks.filter(t=>t.status==='done').length,c:'#00c875'},{l:'In Progress',v:ptasks.filter(t=>t.status==='in-progress').length,c:'#579bfc'},{l:'Stuck',v:ptasks.filter(t=>t.status==='stuck').length,c:'#e2445c'}].map(s=>(
            <span key={s.l} style={{ padding:'4px 10px', borderRadius:99, background:`${s.c}15`, color:s.c, fontSize:11, fontWeight:700 }}>{s.l}: {s.v}</span>
          ))}
        </div>
        <motion.button whileTap={{ scale:0.97 }} onClick={()=>onAddTask(proj.id,groups[0]||'General')} style={{ marginLeft:'auto', padding:'9px 18px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#579bfc,#6366f1)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Add Task</motion.button>
      </div>
      {/* Header row */}
      <div style={{ display:'grid', gridTemplateColumns:GRID, padding:'8px 16px', background:'#080b14', borderRadius:'10px 10px 0 0', border:'1px solid rgba(255,255,255,0.08)', borderBottom:'none', gap:8 }}>
        {COLS.map(c=><div key={c} style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{c}</div>)}
      </div>
      {/* Groups */}
      <div style={{ border:'1px solid rgba(255,255,255,0.08)', borderRadius:'0 0 10px 10px', overflow:'hidden' }}>
        {groups.map((group,gi)=>{
          const gtasks = ptasks.filter(t=>t.group===group)
          const isOpen = !collapsed.has(group)
          return (
            <div key={group}>
              {/* Group header */}
              <div onClick={()=>toggle(group)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)', cursor:'pointer', borderTop:gi>0?'2px solid rgba(255,255,255,0.04)':'none' }}>
                <motion.span animate={{ rotate:isOpen?90:0 }} transition={{ duration:0.15 }} style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>▶</motion.span>
                <div style={{ width:12, height:12, borderRadius:3, background:proj.color, flexShrink:0 }}/>
                <span style={{ fontWeight:800, fontSize:13, color:proj.color }}>{group}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.06)', padding:'1px 7px', borderRadius:99 }}>{gtasks.length}</span>
              </div>
              {/* Task rows */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height:0 }} animate={{ height:'auto' }} exit={{ height:0 }} transition={{ duration:0.2 }} style={{ overflow:'hidden' }}>
                    {gtasks.map((t,ti)=>(
                      <motion.div key={t.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:ti*0.02 }}
                        style={{ display:'grid', gridTemplateColumns:GRID, padding:'10px 16px', gap:8, alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.04)', background:isOverdue(t.dueDate,t.status)?'rgba(226,68,92,0.04)':'transparent' }}
                        onMouseEnter={e=>(e.currentTarget.style.background=isOverdue(t.dueDate,t.status)?'rgba(226,68,92,0.07)':'rgba(255,255,255,0.02)')} onMouseLeave={e=>(e.currentTarget.style.background=isOverdue(t.dueDate,t.status)?'rgba(226,68,92,0.04)':'transparent')}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                          <div style={{ width:3, height:24, borderRadius:99, background:proj.color, flexShrink:0 }}/>
                          <span style={{ fontSize:13, fontWeight:600, cursor:'pointer', color:'white' }} onClick={()=>onEditTask(t)}>{t.title}</span>
                        </div>
                        {/* Status — inline dropdown */}
                        <div>
                          <select value={t.status} onChange={e=>onUpdateStatus(t.id,e.target.value as TaskStatus)}
                            style={{ padding:'4px 8px', borderRadius:4, border:`1px solid ${STATUS[t.status].color}40`, background:STATUS[t.status].bg, color:STATUS[t.status].color, fontSize:11, fontWeight:700, cursor:'pointer', outline:'none', width:'100%' }}>
                            {(Object.entries(STATUS) as [TaskStatus,any][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                          </select>
                        </div>
                        <div><Assignee name={t.assignee}/></div>
                        <div><PriorityPill priority={t.priority} small/></div>
                        <div style={{ fontSize:12, color:isOverdue(t.dueDate,t.status)?'#e2445c':'rgba(255,255,255,0.5)', fontWeight:isOverdue(t.dueDate,t.status)?700:400 }}>{fmtDate(t.dueDate)}{isOverdue(t.dueDate,t.status)&&' ⚠'}</div>
                        <div><ProgressBar value={t.progress} color={proj.color} height={4}/></div>
                        <button onClick={()=>onDeleteTask(t.id)} style={{ padding:'3px 8px', borderRadius:5, border:'1px solid rgba(226,68,92,0.3)', background:'rgba(226,68,92,0.08)', color:'#e2445c', fontSize:11, cursor:'pointer' }}>✕</button>
                      </motion.div>
                    ))}
                    <div onClick={()=>onAddTask(proj.id,group)} style={{ padding:'9px 16px', fontSize:12, color:'rgba(255,255,255,0.3)', cursor:'pointer', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e=>(e.currentTarget.style.color='rgba(255,255,255,0.6)')} onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.3)')}>
                      <span style={{ fontSize:16 }}>+</span> Add task
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Board View — Drag & Drop + Inline Edit ───────────────────────────────────
interface InlineEdit { taskId:string; field:'title'|'notes'; value:string }

export function BoardView({ projects, tasks, onAddTask, onEditTask, onUpdateStatus, onUpdateTask }: { projects:Project[]; tasks:Task[]; onAddTask:()=>void; onEditTask:(t:Task)=>void; onUpdateStatus:(id:string,s:TaskStatus)=>void; onUpdateTask:(t:Task)=>void }) {
  const statuses: TaskStatus[] = ['not-started','in-progress','review','stuck','done']
  const [dragId,   setDragId]   = useState<string|null>(null)
  const [overCol,  setOverCol]  = useState<TaskStatus|null>(null)
  const [editing,  setEditing]  = useState<InlineEdit|null>(null)
  const [hovered,  setHovered]  = useState<string|null>(null)

  const handleDrop = (target: TaskStatus) => {
    if(dragId && target !== tasks.find(t=>t.id===dragId)?.status) {
      onUpdateStatus(dragId, target)
    }
    setDragId(null); setOverCol(null)
  }

  const commitEdit = () => {
    if(!editing) return
    const task = tasks.find(t=>t.id===editing.taskId)
    if(task) onUpdateTask({ ...task, [editing.field]: editing.value })
    setEditing(null)
  }

  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, width:'100%', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Board</h1>
          <p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>Drag cards between columns · Double-click to edit inline</p>
        </div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onAddTask} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#579bfc,#6366f1)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Add Task</motion.button>
      </div>

      <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:16, alignItems:'flex-start', flex:1 }}>
        {statuses.map(col => {
          const meta   = STATUS[col]
          const stasks = tasks.filter(t => t.status === col)
          const isOver = overCol === col

          return (
            <div key={col}
              onDragOver={e => { e.preventDefault(); setOverCol(col) }}
              onDragLeave={() => setOverCol(null)}
              onDrop={() => handleDrop(col)}
              style={{ minWidth:256, flexShrink:0, display:'flex', flexDirection:'column', transition:'transform 0.15s' }}>

              {/* Column header */}
              <div style={{ padding:'10px 14px', borderRadius:'12px 12px 0 0', background:isOver ? meta.bg : 'rgba(255,255,255,0.03)', border:`1px solid ${isOver ? meta.color : meta.color+'30'}`, borderBottom:'none', display:'flex', alignItems:'center', gap:8, transition:'all 0.2s' }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:meta.color, flexShrink:0 }}/>
                <span style={{ fontWeight:800, fontSize:13, color:meta.color }}>{meta.label}</span>
                <span style={{ marginLeft:'auto', fontSize:12, color:meta.color, background:`${meta.color}20`, padding:'1px 7px', borderRadius:99, fontWeight:700 }}>{stasks.length}</span>
              </div>

              {/* Drop zone */}
              <div style={{ border:`${isOver ? 2 : 1}px solid ${isOver ? meta.color : meta.color+'30'}`, borderTop:'none', borderRadius:'0 0 12px 12px', minHeight:120, background:isOver?`${meta.color}06`:'transparent', transition:'all 0.15s', flex:1, paddingBottom:6 }}>
                {isOver && dragId && (
                  <div style={{ margin:8, height:4, borderRadius:99, background:`${meta.color}60` }}/>
                )}

                {stasks.map(t => {
                  const proj = projects.find(p => p.id === t.projectId)
                  const isDragging = dragId === t.id
                  const isHov = hovered === t.id

                  return (
                    <div key={t.id}
                      draggable
                      onDragStart={() => { setDragId(t.id); setHovered(null) }}
                      onDragEnd={() => { setDragId(null); setOverCol(null) }}
                      onMouseEnter={() => setHovered(t.id)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ margin:8, padding:'12px 14px', borderRadius:10, background: isDragging ? 'rgba(255,255,255,0.04)' : '#080b14', border:`1px solid ${isDragging ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`, borderLeft:`3px solid ${proj?.color||'#6366f1'}`, cursor:'grab', opacity:isDragging?0.5:1, transform:isDragging?'rotate(2deg)':'none', transition:'opacity 0.15s, transform 0.15s', position:'relative' }}>

                      {/* Hover action bar */}
                      {isHov && !isDragging && (
                        <div style={{ position:'absolute', top:6, right:8, display:'flex', gap:4, zIndex:2 }}>
                          <button onClick={e=>{ e.stopPropagation(); onEditTask(t) }}
                            style={{ padding:'2px 8px', borderRadius:5, border:'1px solid rgba(87,155,252,0.4)', background:'rgba(87,155,252,0.12)', color:'#579bfc', fontSize:10, fontWeight:700, cursor:'pointer' }}>
                            Edit
                          </button>
                          <select value={t.status} onClick={e=>e.stopPropagation()} onChange={e=>onUpdateStatus(t.id, e.target.value as TaskStatus)}
                            style={{ padding:'2px 6px', borderRadius:5, border:`1px solid ${meta.color}40`, background:meta.bg, color:meta.color, fontSize:10, fontWeight:700, cursor:'pointer', outline:'none' }}>
                            {(Object.entries(STATUS) as [TaskStatus,any][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                          </select>
                        </div>
                      )}

                      {/* Title — double-click to edit inline */}
                      {editing?.taskId === t.id && editing.field === 'title' ? (
                        <input autoFocus value={editing.value}
                          onChange={e => setEditing(prev => prev ? {...prev, value:e.target.value} : null)}
                          onBlur={commitEdit}
                          onKeyDown={e => { if(e.key==='Enter') commitEdit(); if(e.key==='Escape') setEditing(null) }}
                          onClick={e => e.stopPropagation()}
                          style={{ width:'100%', background:'rgba(255,255,255,0.08)', border:'1px solid #579bfc', borderRadius:5, color:'white', fontSize:13, fontWeight:700, padding:'2px 6px', outline:'none', boxSizing:'border-box', marginBottom:6 }}/>
                      ) : (
                        <div onDoubleClick={e => { e.stopPropagation(); setEditing({ taskId:t.id, field:'title', value:t.title }) }}
                          style={{ fontSize:13, fontWeight:700, marginBottom:8, lineHeight:1.4, paddingRight:isHov?80:0 }}
                          title="Double-click to edit">
                          {t.title}
                        </div>
                      )}

                      <div style={{ fontSize:11, color:proj?.color||'rgba(255,255,255,0.4)', marginBottom:8, fontWeight:600 }}>{proj?.name}</div>

                      {/* Notes — double-click to edit inline */}
                      {editing?.taskId === t.id && editing.field === 'notes' ? (
                        <textarea autoFocus value={editing.value}
                          onChange={e => setEditing(prev => prev ? {...prev, value:e.target.value} : null)}
                          onBlur={commitEdit}
                          onKeyDown={e => { if(e.key==='Escape') setEditing(null) }}
                          onClick={e => e.stopPropagation()}
                          style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(87,155,252,0.4)', borderRadius:5, color:'rgba(255,255,255,0.7)', fontSize:11, padding:'4px 6px', outline:'none', resize:'vertical', minHeight:50, boxSizing:'border-box', marginBottom:8 }}/>
                      ) : t.notes ? (
                        <div onDoubleClick={e => { e.stopPropagation(); setEditing({ taskId:t.id, field:'notes', value:t.notes }) }}
                          style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:8, lineHeight:1.4, cursor:'text' }}
                          title="Double-click to edit notes">
                          {t.notes}
                        </div>
                      ) : null}

                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <Assignee name={t.assignee} size={22}/>
                        <PriorityPill priority={t.priority} small/>
                        <span style={{ marginLeft:'auto', fontSize:10, color:isOverdue(t.dueDate,t.status)?'#e2445c':'rgba(255,255,255,0.35)' }}>{fmtDate(t.dueDate)}</span>
                      </div>
                      {t.progress>0 && <div style={{ marginTop:8 }}><ProgressBar value={t.progress} color={proj?.color||'#579bfc'} height={3}/></div>}
                    </div>
                  )
                })}

                {/* Add task to column */}
                <div onClick={onAddTask}
                  style={{ margin:'4px 8px 2px', padding:'7px 10px', borderRadius:8, border:'1px dashed rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.3)', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all 0.15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'; e.currentTarget.style.color='rgba(255,255,255,0.6)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.3)' }}>
                  <span>+</span> Add task
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── My Tasks View ────────────────────────────────────────────────────────────
export function MyTasksView({ projects, tasks, onEditTask, onUpdateStatus }: { projects:Project[]; tasks:Task[]; onEditTask:(t:Task)=>void; onUpdateStatus:(id:string,s:TaskStatus)=>void }) {
  const [member, setMember] = useState('Malcolm G')
  const myTasks = tasks.filter(t=>t.assignee===member&&t.status!=='done'&&t.status!=='cancelled').sort((a,b)=>a.dueDate-b.dueDate)
  const done = tasks.filter(t=>t.assignee===member&&t.status==='done')
  const MEMBERS = [...new Set(tasks.map(t=>t.assignee))]
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, maxWidth:900, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>My Tasks</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{myTasks.length} active · {done.length} completed</p></div>
        <select value={member} onChange={e=>setMember(e.target.value)} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'#080b14', color:'white', fontSize:13, cursor:'pointer', outline:'none' }}>
          {MEMBERS.map(m=><option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {myTasks.length===0&&<div style={{ padding:'32px', textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:13 }}>No active tasks 🎉</div>}
        {myTasks.map((t,i)=>{ const proj=projects.find(p=>p.id===t.projectId); return (
          <motion.div key={t.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
            style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:12, background:'#080b14', border:`1px solid ${isOverdue(t.dueDate,t.status)?'rgba(226,68,92,0.3)':'rgba(255,255,255,0.07)'}`, borderLeft:`4px solid ${proj?.color||'#6366f1'}` }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:4, cursor:'pointer' }} onClick={()=>onEditTask(t)}>{t.title}</div>
              <div style={{ fontSize:12, color:proj?.color||'rgba(255,255,255,0.4)', fontWeight:600 }}>{proj?.name} · {t.group}</div>
            </div>
            <select value={t.status} onChange={e=>onUpdateStatus(t.id,e.target.value as TaskStatus)}
              style={{ padding:'5px 10px', borderRadius:6, border:`1px solid ${STATUS[t.status].color}40`, background:STATUS[t.status].bg, color:STATUS[t.status].color, fontSize:11, fontWeight:700, cursor:'pointer', outline:'none' }}>
              {(Object.entries(STATUS) as [TaskStatus,any][]).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
            <PriorityPill priority={t.priority} small/>
            <div style={{ fontSize:12, color:isOverdue(t.dueDate,t.status)?'#e2445c':'rgba(255,255,255,0.45)', fontWeight:isOverdue(t.dueDate,t.status)?700:400, minWidth:80, textAlign:'right' }}>{fmtDate(t.dueDate)}{isOverdue(t.dueDate,t.status)&&' ⚠'}</div>
            <div style={{ width:100 }}><ProgressBar value={t.progress} color={proj?.color||'#579bfc'} height={4}/></div>
          </motion.div>
        )})}
      </div>
    </div>
  )
}
