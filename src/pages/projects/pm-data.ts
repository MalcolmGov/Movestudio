export type TaskStatus = 'not-started'|'in-progress'|'review'|'stuck'|'done'|'cancelled'
export type TaskPriority = 'critical'|'high'|'medium'|'low'
export type PMView = 'dashboard'|'board'|'table'|'my-tasks'

export interface Project {
  id: string; name: string; color: string; description: string
  startDate: number; endDate: number; createdAt: number
}
export interface Task {
  id: string; projectId: string; title: string; group: string
  status: TaskStatus; priority: TaskPriority
  assignee: string; dueDate: number; notes: string
  progress: number; createdAt: number
}

// ── Status config (Monday.com palette) ────────────────────────────────────────
export const STATUS: Record<TaskStatus, { label:string; color:string; bg:string }> = {
  'not-started': { label:'Not Started', color:'#c4c4c4', bg:'rgba(196,196,196,0.15)' },
  'in-progress':  { label:'In Progress', color:'#579bfc', bg:'rgba(87,155,252,0.15)' },
  'review':       { label:'In Review',   color:'#a25ddc', bg:'rgba(162,93,220,0.15)' },
  'stuck':        { label:'Stuck',       color:'#e2445c', bg:'rgba(226,68,92,0.15)'  },
  'done':         { label:'Done',        color:'#00c875', bg:'rgba(0,200,117,0.15)'  },
  'cancelled':    { label:'Cancelled',   color:'#808080', bg:'rgba(128,128,128,0.15)'},
}
export const PRIORITY: Record<TaskPriority, { label:string; color:string; bg:string }> = {
  'critical': { label:'Critical', color:'#e2445c', bg:'rgba(226,68,92,0.15)' },
  'high':     { label:'High',     color:'#fdab3d', bg:'rgba(253,171,61,0.15)' },
  'medium':   { label:'Medium',   color:'#579bfc', bg:'rgba(87,155,252,0.15)' },
  'low':      { label:'Low',      color:'#c4c4c4', bg:'rgba(196,196,196,0.1)'  },
}

export const PROJECT_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#06b6d4']
export const TEAM_MEMBERS = ['Malcolm G','Sarah J','Marcus D','Priya N','James B','Ayanda K']
export const uid = () => Math.random().toString(36).slice(2,10)
export const fmtDate = (ts:number) => new Date(ts).toLocaleDateString('en-ZA',{day:'2-digit',month:'short',year:'numeric'})
export const isOverdue = (ts:number, status:TaskStatus) => ts < Date.now() && status !== 'done' && status !== 'cancelled'

const D = (offset:number) => Date.now() + offset * 86400000

export const SEED_PROJECTS: Project[] = [
  { id:'p1', name:'TechCorp SA — Website Redesign',    color:'#6366f1', description:'Full redesign of the TechCorp SA corporate website. 8-week project.', startDate:D(-30), endDate:D(14),  createdAt:D(-30) },
  { id:'p2', name:'RetailPlus Brand Identity',          color:'#ec4899', description:'Complete brand identity package including logo, colours, typography, brand guidelines.', startDate:D(-14), endDate:D(21),  createdAt:D(-14) },
  { id:'p3', name:'HealthFirst Clinics App UI',         color:'#10b981', description:'Mobile app UI design for patient booking and health tracking.', startDate:D(-7),  endDate:D(28),  createdAt:D(-7)  },
  { id:'p4', name:'Q2 Marketing Campaign',              color:'#f59e0b', description:'Internal Q2 digital marketing campaign — social, email & ads.', startDate:D(-21), endDate:D(9),   createdAt:D(-21) },
]

export const SEED_TASKS: Task[] = [
  // TechCorp SA
  { id:'t1',  projectId:'p1', title:'Discovery & requirements workshop',   group:'Phase 1 — Discovery',  status:'done',        priority:'high',     assignee:'Malcolm G',  dueDate:D(-20), notes:'Client workshop completed. 12 pages documented.', progress:100, createdAt:D(-30) },
  { id:'t2',  projectId:'p1', title:'Competitor analysis',                 group:'Phase 1 — Discovery',  status:'done',        priority:'medium',   assignee:'Sarah J',    dueDate:D(-18), notes:'Analysed 5 competitors.', progress:100, createdAt:D(-30) },
  { id:'t3',  projectId:'p1', title:'Sitemap & information architecture',  group:'Phase 1 — Discovery',  status:'done',        priority:'high',     assignee:'Malcolm G',  dueDate:D(-15), notes:'', progress:100, createdAt:D(-28) },
  { id:'t4',  projectId:'p1', title:'Wireframes — Homepage',               group:'Phase 2 — Design',     status:'done',        priority:'critical', assignee:'Malcolm G',  dueDate:D(-10), notes:'Approved by client.', progress:100, createdAt:D(-25) },
  { id:'t5',  projectId:'p1', title:'Wireframes — Inner pages (8 pages)',  group:'Phase 2 — Design',     status:'done',        priority:'high',     assignee:'Sarah J',    dueDate:D(-8),  notes:'', progress:100, createdAt:D(-25) },
  { id:'t6',  projectId:'p1', title:'High-fidelity mockups',               group:'Phase 2 — Design',     status:'in-progress', priority:'critical', assignee:'Malcolm G',  dueDate:D(2),   notes:'Homepage done. 7 pages remaining.', progress:35, createdAt:D(-20) },
  { id:'t7',  projectId:'p1', title:'Prototype & interactive demo',        group:'Phase 2 — Design',     status:'not-started', priority:'high',     assignee:'Malcolm G',  dueDate:D(7),   notes:'', progress:0, createdAt:D(-20) },
  { id:'t8',  projectId:'p1', title:'Client review & feedback round 1',    group:'Phase 3 — Review',     status:'not-started', priority:'critical', assignee:'James B',    dueDate:D(9),   notes:'', progress:0, createdAt:D(-15) },
  { id:'t9',  projectId:'p1', title:'Revision & amends',                   group:'Phase 3 — Review',     status:'not-started', priority:'high',     assignee:'Malcolm G',  dueDate:D(12),  notes:'', progress:0, createdAt:D(-15) },
  { id:'t10', projectId:'p1', title:'Final handover & assets',             group:'Phase 4 — Delivery',   status:'not-started', priority:'critical', assignee:'Malcolm G',  dueDate:D(14),  notes:'', progress:0, createdAt:D(-15) },
  // RetailPlus
  { id:'t11', projectId:'p2', title:'Brand discovery session',             group:'Brand Strategy',       status:'done',        priority:'high',     assignee:'Sarah J',    dueDate:D(-10), notes:'Values: Bold, Modern, Trustworthy.', progress:100, createdAt:D(-14) },
  { id:'t12', projectId:'p2', title:'Logo concepts (3 directions)',        group:'Brand Identity',       status:'in-progress', priority:'critical', assignee:'Malcolm G',  dueDate:D(3),   notes:'2 of 3 concepts ready.', progress:65, createdAt:D(-12) },
  { id:'t13', projectId:'p2', title:'Colour palette & typography',         group:'Brand Identity',       status:'in-progress', priority:'high',     assignee:'Sarah J',    dueDate:D(4),   notes:'', progress:40, createdAt:D(-12) },
  { id:'t14', projectId:'p2', title:'Brand guidelines document',           group:'Brand Identity',       status:'not-started', priority:'high',     assignee:'Malcolm G',  dueDate:D(14),  notes:'', progress:0, createdAt:D(-10) },
  { id:'t15', projectId:'p2', title:'Business card & letterhead design',   group:'Collateral',           status:'not-started', priority:'medium',   assignee:'Sarah J',    dueDate:D(17),  notes:'', progress:0, createdAt:D(-10) },
  { id:'t16', projectId:'p2', title:'Social media templates (6 formats)',  group:'Collateral',           status:'not-started', priority:'medium',   assignee:'Ayanda K',   dueDate:D(19),  notes:'', progress:0, createdAt:D(-10) },
  { id:'t17', projectId:'p2', title:'Brand presentation to client',        group:'Delivery',             status:'not-started', priority:'critical', assignee:'James B',    dueDate:D(21),  notes:'', progress:0, createdAt:D(-8)  },
  // HealthFirst
  { id:'t18', projectId:'p3', title:'User research & persona development', group:'UX Research',          status:'done',        priority:'high',     assignee:'Priya N',    dueDate:D(-4),  notes:'3 personas created.', progress:100, createdAt:D(-7) },
  { id:'t19', projectId:'p3', title:'User journey mapping',                group:'UX Research',          status:'in-progress', priority:'high',     assignee:'Priya N',    dueDate:D(2),   notes:'', progress:60, createdAt:D(-7) },
  { id:'t20', projectId:'p3', title:'App wireframes — Booking flow',       group:'UI Design',            status:'in-progress', priority:'critical', assignee:'Malcolm G',  dueDate:D(5),   notes:'', progress:45, createdAt:D(-5) },
  { id:'t21', projectId:'p3', title:'App wireframes — Dashboard',          group:'UI Design',            status:'not-started', priority:'high',     assignee:'Sarah J',    dueDate:D(8),   notes:'', progress:0, createdAt:D(-5) },
  { id:'t22', projectId:'p3', title:'High-fidelity UI — Booking',          group:'UI Design',            status:'not-started', priority:'critical', assignee:'Malcolm G',  dueDate:D(15),  notes:'', progress:0, createdAt:D(-3) },
  { id:'t23', projectId:'p3', title:'Usability testing session',           group:'Testing',              status:'not-started', priority:'high',     assignee:'Priya N',    dueDate:D(22),  notes:'', progress:0, createdAt:D(-3) },
  { id:'t24', projectId:'p3', title:'Design handover to dev team',         group:'Delivery',             status:'not-started', priority:'critical', assignee:'Malcolm G',  dueDate:D(28),  notes:'', progress:0, createdAt:D(-2) },
  // Q2 Marketing
  { id:'t25', projectId:'p4', title:'Q2 campaign strategy document',       group:'Strategy',             status:'done',        priority:'critical', assignee:'Ayanda K',   dueDate:D(-15), notes:'Strategy approved by stakeholders.', progress:100, createdAt:D(-21) },
  { id:'t26', projectId:'p4', title:'Content calendar — April to June',   group:'Content',              status:'done',        priority:'high',     assignee:'Sarah J',    dueDate:D(-12), notes:'', progress:100, createdAt:D(-21) },
  { id:'t27', projectId:'p4', title:'Write & design 12 social posts',      group:'Content',              status:'in-progress', priority:'high',     assignee:'Sarah J',    dueDate:D(1),   notes:'8 of 12 completed.', progress:67, createdAt:D(-18) },
  { id:'t28', projectId:'p4', title:'Email newsletter design — April',     group:'Email',                status:'done',        priority:'high',     assignee:'Marcus D',   dueDate:D(-8),  notes:'Sent. 42% open rate.', progress:100, createdAt:D(-18) },
  { id:'t29', projectId:'p4', title:'Email newsletter design — May',       group:'Email',                status:'in-progress', priority:'high',     assignee:'Marcus D',   dueDate:D(4),   notes:'', progress:30, createdAt:D(-10) },
  { id:'t30', projectId:'p4', title:'Google Ads campaign setup',           group:'Paid Ads',             status:'stuck',       priority:'critical', assignee:'Ayanda K',   dueDate:D(-2),  notes:'Waiting on budget approval from client.', progress:20, createdAt:D(-14) },
  { id:'t31', projectId:'p4', title:'LinkedIn ads — B2B targeting',        group:'Paid Ads',             status:'not-started', priority:'high',     assignee:'Ayanda K',   dueDate:D(6),   notes:'', progress:0, createdAt:D(-10) },
  { id:'t32', projectId:'p4', title:'Campaign performance review',         group:'Reporting',            status:'not-started', priority:'medium',   assignee:'James B',    dueDate:D(9),   notes:'', progress:0, createdAt:D(-5) },
]

const KEY = 'pm_v1'
export const loadPM = (): { projects:Project[]; tasks:Task[] } => {
  try { const r=localStorage.getItem(KEY); if(r) return JSON.parse(r) } catch {}
  return { projects:SEED_PROJECTS, tasks:SEED_TASKS }
}
export const savePM = (projects:Project[], tasks:Task[]) =>
  localStorage.setItem(KEY, JSON.stringify({ projects, tasks }))

export const getProjectProgress = (tasks:Task[]) => {
  if(!tasks.length) return 0
  return Math.round(tasks.reduce((s,t)=>s+t.progress,0)/tasks.length)
}
export const getProjectStats = (tasks:Task[]) => ({
  total:tasks.length,
  done:tasks.filter(t=>t.status==='done').length,
  inProgress:tasks.filter(t=>t.status==='in-progress').length,
  stuck:tasks.filter(t=>t.status==='stuck').length,
  overdue:tasks.filter(t=>isOverdue(t.dueDate,t.status)).length,
})
