export type Stage = 'lead'|'qualified'|'proposal'|'negotiation'|'won'|'lost'
export type ActType = 'call'|'email'|'meeting'|'task'|'note'

export interface Contact {
  id: string; name: string; email: string; phone: string
  company: string; role: string; tags: string[]
  stage: Stage; dealValue: number; notes: string
  createdAt: number; lastActivityAt: number
}
export interface Activity {
  id: string; contactId: string; type: ActType
  title: string; date: number; done: boolean; notes: string
}

export const STAGES: { id: Stage; label: string; color: string; icon: string }[] = [
  { id: 'lead',        label: 'Lead',        color: '#818cf8', icon: '🎯' },
  { id: 'qualified',   label: 'Qualified',   color: '#60a5fa', icon: '⚡' },
  { id: 'proposal',    label: 'Proposal',    color: '#fbbf24', icon: '📄' },
  { id: 'negotiation', label: 'Negotiation', color: '#f472b6', icon: '🤝' },
  { id: 'won',         label: 'Won',         color: '#34d399', icon: '🏆' },
  { id: 'lost',        label: 'Lost',        color: '#f87171', icon: '✕'  },
]

export const ACT_TYPES: { id: ActType; label: string; icon: string; color: string }[] = [
  { id: 'call',    label: 'Call',    icon: '📞', color: '#60a5fa' },
  { id: 'email',   label: 'Email',   icon: '✉️', color: '#a78bfa' },
  { id: 'meeting', label: 'Meeting', icon: '📅', color: '#fbbf24' },
  { id: 'task',    label: 'Task',    icon: '✅', color: '#34d399' },
  { id: 'note',    label: 'Note',    icon: '📝', color: '#67e8f9' },
]

const N = Date.now()
export const SEED_CONTACTS: Contact[] = [
  { id:'1', name:'Sarah Johnson', email:'sarah@techcorp.co.za', phone:'+27 82 123 4567', company:'TechCorp SA', role:'CEO', tags:['SaaS','Enterprise'], stage:'negotiation', dealValue:85000, notes:'Demo went well. Decision by end of week.', createdAt:N-86400000*15, lastActivityAt:N-3600000*2 },
  { id:'2', name:'Marcus Dlamini', email:'marcus@retailplus.co.za', phone:'+27 71 987 6543', company:'RetailPlus', role:'Ops Manager', tags:['Retail'], stage:'proposal', dealValue:42000, notes:'Budget approved for Q2.', createdAt:N-86400000*8, lastActivityAt:N-86400000 },
  { id:'3', name:'Priya Naidoo', email:'priya@healthfirst.co.za', phone:'+27 83 456 7890', company:'HealthFirst', role:'Director', tags:['Health'], stage:'qualified', dealValue:28000, notes:'Needs bookings + invoicing.', createdAt:N-86400000*3, lastActivityAt:N-3600000*5 },
  { id:'4', name:'James Botha', email:'james@creativeagency.co.za', phone:'+27 79 321 6547', company:'Creative Agency', role:'Founder', tags:['Agency'], stage:'won', dealValue:18500, notes:'Signed off. Onboarding this week.', createdAt:N-86400000*30, lastActivityAt:N-86400000*2 },
  { id:'5', name:'Nomsa Sithole', email:'nomsa@freshmart.co.za', phone:'+27 82 654 3210', company:'FreshMart', role:'Owner', tags:['Retail','SME'], stage:'lead', dealValue:12000, notes:'Referral from James Botha.', createdAt:N-86400000, lastActivityAt:N-1800000 },
  { id:'6', name:'Ayanda Khumalo', email:'ayanda@solarsa.co.za', phone:'+27 84 777 8899', company:'Solar SA', role:'MD', tags:['Energy','B2B'], stage:'qualified', dealValue:55000, notes:'Interested in full bundle.', createdAt:N-86400000*5, lastActivityAt:N-3600000*12 },
  { id:'7', name:'Thabo Mokoena', email:'thabo@finsolve.co.za', phone:'+27 76 111 2233', company:'FinSolve', role:'CFO', tags:['Fintech'], stage:'lost', dealValue:65000, notes:'Went with competitor. Follow up in 6 months.', createdAt:N-86400000*45, lastActivityAt:N-86400000*7 },
]

export const SEED_ACTIVITIES: Activity[] = [
  { id:'a1', contactId:'1', type:'meeting', title:'Platform demo call', date:N-3600000*2, done:true, notes:'Sarah loved the brand studio.' },
  { id:'a2', contactId:'2', type:'email', title:'Sent proposal deck', date:N-86400000, done:true, notes:'Full pricing breakdown included.' },
  { id:'a3', contactId:'3', type:'call', title:'Discovery call', date:N-3600000*5, done:true, notes:'They need bookings + invoicing.' },
  { id:'a4', contactId:'6', type:'call', title:'Initial consultation', date:N-3600000*12, done:true, notes:'Sending bundle proposal.' },
  { id:'a5', contactId:'5', type:'task', title:'Send welcome email to Nomsa', date:N+86400000, done:false, notes:'' },
  { id:'a6', contactId:'1', type:'call', title:'Contract review call', date:N+3600000*4, done:false, notes:'' },
  { id:'a7', contactId:'2', type:'meeting', title:'Stakeholder presentation', date:N+86400000*2, done:false, notes:'' },
  { id:'a8', contactId:'6', type:'email', title:'Follow up on bundle proposal', date:N+86400000*2, done:false, notes:'' },
]

export const uid = () => Math.random().toString(36).slice(2,10)
export const fmt = (v: number) => `R ${v.toLocaleString('en-ZA')}`
export const fmtDate = (ts: number) => {
  const d = Date.now() - ts
  if (d < 0) { const a=Math.abs(d); if(a<3600000)return `In ${Math.round(a/60000)}m`; if(a<86400000)return `In ${Math.round(a/3600000)}h`; return `In ${Math.round(a/86400000)}d` }
  if (d < 60000) return 'Just now'
  if (d < 3600000) return `${Math.round(d/60000)}m ago`
  if (d < 86400000) return `${Math.round(d/3600000)}h ago`
  return `${Math.round(d/86400000)}d ago`
}
export const initials = (n: string) => n.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
export const stg = (id: Stage) => STAGES.find(s=>s.id===id)!
export const actType = (id: ActType) => ACT_TYPES.find(a=>a.id===id)!

const KEY = 'crm_v1'
export const loadCRM = (): { contacts: Contact[]; activities: Activity[] } => {
  try { const r = localStorage.getItem(KEY); if(r) return JSON.parse(r) } catch {}
  return { contacts: SEED_CONTACTS, activities: SEED_ACTIVITIES }
}
export const saveCRM = (contacts: Contact[], activities: Activity[]) =>
  localStorage.setItem(KEY, JSON.stringify({ contacts, activities }))
