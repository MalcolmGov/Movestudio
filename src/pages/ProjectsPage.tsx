import React, { useState } from 'react'
import StudioSidebar from '../components/StudioSidebar'
import { Project, Task, TaskStatus, PMView, loadPM, savePM, uid } from './projects/pm-data'
import { AddProjectModal, AddTaskModal } from './projects/pm-components'
import { DashboardView, TableView, BoardView, MyTasksView } from './projects/pm-views'

const NAV: { id:PMView; icon:string; label:string }[] = [
  { id:'dashboard', icon:'🏠', label:'Dashboard'  },
  { id:'table',     icon:'▦',  label:'Table View' },
  { id:'board',     icon:'⬡',  label:'Board'      },
  { id:'my-tasks',  icon:'👤', label:'My Tasks'   },
]

export default function ProjectsPage() {
  const [data, setData] = useState(() => loadPM())
  const [view, setView] = useState<PMView>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState<Project|undefined>()
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState<Task|undefined>()
  const [addTaskProjectId, setAddTaskProjectId] = useState<string|undefined>()
  const [addTaskGroup, setAddTaskGroup] = useState<string|undefined>()
  const [selectedProjectId, setSelectedProjectId] = useState<string|null>(null)

  const { projects, tasks } = data
  const save = (p: Project[], t: Task[]) => { savePM(p,t); setData({ projects:p, tasks:t }) }

  const saveProject = (p: Project) => {
    const exists = projects.find(x=>x.id===p.id)
    save(exists ? projects.map(x=>x.id===p.id?p:x) : [...projects, p], tasks)
    setShowAddProject(false); setEditingProject(undefined)
  }
  const deleteProject = (id:string) => save(projects.filter(p=>p.id!==id), tasks.filter(t=>t.projectId!==id))

  const saveTask = (t: Task) => {
    const exists = tasks.find(x=>x.id===t.id)
    save(projects, exists ? tasks.map(x=>x.id===t.id?t:x) : [...tasks, t])
    setShowAddTask(false); setEditingTask(undefined); setAddTaskProjectId(undefined); setAddTaskGroup(undefined)
  }
  const deleteTask = (id:string) => save(projects, tasks.filter(t=>t.id!==id))
  const updateStatus = (id:string, status:TaskStatus) => save(projects, tasks.map(t=>t.id===id?{...t,status,progress:status==='done'?100:t.progress}:t))
  const updateTask   = (t:Task) => save(projects, tasks.map(x=>x.id===t.id?t:x))

  const openAddTask = (projectId?:string, group?:string) => {
    setEditingTask(undefined); setAddTaskProjectId(projectId); setAddTaskGroup(group); setShowAddTask(true)
  }

  const openEditTask = (t:Task) => { setEditingTask(t); setShowAddTask(true) }

  const activeTasks = tasks.filter(t=>t.status!=='done'&&t.status!=='cancelled').length
  const stuckTasks  = tasks.filter(t=>t.status==='stuck').length

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'var(--font, Inter, sans-serif)', background:'#040608', color:'white', overflow:'hidden' }}>
      <StudioSidebar collapsed={collapsed} onToggle={()=>setCollapsed(p=>!p)}/>

      {/* Sub-nav */}
      <div style={{ width:180, flexShrink:0, background:'#080b14', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', padding:'20px 10px', gap:4 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 6px', marginBottom:10 }}>Projects</div>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:`1px solid ${view===item.id?'rgba(99,102,241,0.5)':'transparent'}`, background:view===item.id?'rgba(99,102,241,0.12)':'transparent', color:view===item.id?'white':'rgba(255,255,255,0.5)', fontSize:13, fontWeight:view===item.id?700:500, cursor:'pointer', textAlign:'left', width:'100%' }}>
            <span style={{ fontSize:16 }}>{item.icon}</span> {item.label}
            {item.id==='board' && stuckTasks>0 && <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, color:'#e2445c', background:'rgba(226,68,92,0.15)', padding:'1px 6px', borderRadius:99 }}>{stuckTasks}</span>}
          </button>
        ))}
        {/* Project list */}
        <div style={{ marginTop:16, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:14, display:'flex', flexDirection:'column', gap:4 }}>
          <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 6px', marginBottom:6 }}>Projects</div>
          {projects.map(p=>(
            <button key={p.id} onClick={()=>{ setSelectedProjectId(p.id); setView('table') }}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:7, border:'none', background:selectedProjectId===p.id&&view==='table'?'rgba(255,255,255,0.06)':'transparent', color:'rgba(255,255,255,0.55)', fontSize:12, cursor:'pointer', textAlign:'left', width:'100%' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:p.color, flexShrink:0 }}/>
              <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
            </button>
          ))}
          <button onClick={()=>setShowAddProject(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:7, border:'1px dashed rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.3)', fontSize:12, cursor:'pointer', marginTop:4 }}>
            <span>+</span> New project
          </button>
        </div>
        <div style={{ marginTop:'auto', padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginBottom:3 }}>Active tasks</div>
          <div style={{ fontSize:18, fontWeight:900, color:'#579bfc' }}>{activeTasks}</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto', display:'flex' }}>
        {view==='dashboard' && <DashboardView projects={projects} tasks={tasks} onNewProject={()=>setShowAddProject(true)} onNewTask={()=>openAddTask()} onSelectProject={id=>{ setSelectedProjectId(id); setView('table') }}/>}
        {view==='table'     && <TableView projects={projects} tasks={tasks} selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId} onAddTask={openAddTask} onEditTask={openEditTask} onDeleteTask={deleteTask} onUpdateStatus={updateStatus}/>}
        {view==='board'     && <BoardView projects={projects} tasks={tasks} onAddTask={()=>openAddTask()} onEditTask={openEditTask} onUpdateStatus={updateStatus} onUpdateTask={updateTask}/>}
        {view==='my-tasks'  && <MyTasksView projects={projects} tasks={tasks} onEditTask={openEditTask} onUpdateStatus={updateStatus}/>}
      </div>

      {showAddProject && <AddProjectModal existing={editingProject} onClose={()=>{ setShowAddProject(false); setEditingProject(undefined) }} onSave={saveProject}/>}
      {showAddTask    && <AddTaskModal projects={projects} existing={editingTask} defaultProjectId={addTaskProjectId} onClose={()=>{ setShowAddTask(false); setEditingTask(undefined) }} onSave={saveTask}/>}
    </div>
  )
}
