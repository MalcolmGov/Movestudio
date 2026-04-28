export type EmpStatus = 'active'|'probation'|'resigned'|'terminated'
export type LeaveType = 'annual'|'sick'|'family'|'unpaid'
export type LeaveStatus = 'pending'|'approved'|'rejected'
export type PayrollStatus = 'draft'|'processed'

export interface Employee {
  id:string; name:string; email:string; phone:string
  department:string; position:string; startDate:number
  grossSalary:number; status:EmpStatus
  idNumber:string; taxNumber:string
  bankName:string; accountNumber:string
  annualLeaveBalance:number; sickLeaveBalance:number
  avatar:string // initials color
}
export interface LeaveRequest {
  id:string; employeeId:string; type:LeaveType
  startDate:number; endDate:number; days:number
  status:LeaveStatus; reason:string; createdAt:number
}
export interface PayrollEntry {
  employeeId:string; grossSalary:number; paye:number
  uif:number; otherDeductions:number; netPay:number
}
export interface PayrollRun {
  id:string; month:string; // YYYY-MM
  entries:PayrollEntry[]; status:PayrollStatus; processedAt?:number
}

export const DEPARTMENTS = ['Engineering','Design','Marketing','Sales','Finance','Operations','HR','Management']
export const LEAVE_META: Record<LeaveType,{label:string;color:string;icon:string;annual:number}> = {
  annual:  { label:'Annual Leave',        color:'#579bfc', icon:'🏖',  annual:15 },
  sick:    { label:'Sick Leave',           color:'#fdab3d', icon:'🤒',  annual:30 },
  family:  { label:'Family Responsibility',color:'#a78bfa', icon:'👨‍👩‍👧', annual:3  },
  unpaid:  { label:'Unpaid Leave',         color:'#c4c4c4', icon:'📋',  annual:0  },
}
export const LEAVE_STATUS_META: Record<LeaveStatus,{label:string;color:string}> = {
  pending:  { label:'Pending',  color:'#fdab3d' },
  approved: { label:'Approved', color:'#00c875' },
  rejected: { label:'Rejected', color:'#e2445c' },
}
export const EMP_STATUS_META: Record<EmpStatus,{label:string;color:string}> = {
  active:     { label:'Active',     color:'#00c875' },
  probation:  { label:'Probation',  color:'#fdab3d' },
  resigned:   { label:'Resigned',   color:'#c4c4c4' },
  terminated: { label:'Terminated', color:'#e2445c' },
}
export const DEPT_COLORS: Record<string,string> = {
  Engineering:'#579bfc', Design:'#ec4899', Marketing:'#f59e0b', Sales:'#10b981',
  Finance:'#34d399', Operations:'#fb923c', HR:'#a78bfa', Management:'#6366f1',
}
export const AVATAR_COLORS = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#06b6d4']
export const uid = () => Math.random().toString(36).slice(2,10)
export const fmt = (v:number) => `R ${v.toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2})}`
export const fmtDate = (ts:number) => new Date(ts).toLocaleDateString('en-ZA',{day:'2-digit',month:'short',year:'numeric'})
export const monthLabel = (k:string) => new Date(k+'-01').toLocaleString('en-ZA',{month:'long',year:'numeric'})

// ── SARS 2024/25 PAYE calculation ─────────────────────────────────────────────
export function calcPAYE(grossMonthly:number): number {
  const annual = grossMonthly * 12
  const brackets = [
    [237100,  0,       0.18],
    [370500,  42678,   0.26],
    [512800,  77362,   0.31],
    [673000,  121475,  0.36],
    [857900,  179147,  0.39],
    [1817000, 251258,  0.41],
    [Infinity,644489,  0.45],
  ]
  const thresholds = [0,237100,370500,512800,673000,857900,1817000]
  let taxAnnual = 0
  for(let i=0;i<brackets.length;i++){
    if(annual<=brackets[i][0]){
      taxAnnual = (brackets[i][1] as number) + (annual - thresholds[i]) * (brackets[i][2] as number)
      break
    }
  }
  taxAnnual = Math.max(0, taxAnnual - 17235) // primary rebate
  return Math.max(0, Math.round(taxAnnual/12))
}
export function calcUIF(grossMonthly:number): number {
  return Math.min(177.12, grossMonthly * 0.01)
}
export function calcNetPay(gross:number, otherDed=0): { paye:number; uif:number; net:number } {
  const paye = calcPAYE(gross)
  const uif  = calcUIF(gross)
  return { paye, uif, net: gross - paye - uif - otherDed }
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const D = (days:number) => Date.now() - days*86400000
export const SEED_EMPLOYEES: Employee[] = [
  { id:'e1',name:'Malcolm Govender',  email:'malcolm@movestudio.co.za',  phone:'+27 82 111 2222',department:'Management',  position:'Chief Executive Officer',     startDate:D(730), grossSalary:65000,status:'active',    idNumber:'8501015111088',taxNumber:'9876543210',bankName:'FNB',         accountNumber:'62xxxxxx01',annualLeaveBalance:12,sickLeaveBalance:28,avatar:'#6366f1' },
  { id:'e2',name:'Sarah Johnson',     email:'sarah@movestudio.co.za',     phone:'+27 83 222 3333',department:'Design',       position:'Head of Design',              startDate:D(545), grossSalary:45000,status:'active',    idNumber:'9203025222099',taxNumber:'8765432109',bankName:'Standard Bank',accountNumber:'00xxxxxx02',annualLeaveBalance:8, sickLeaveBalance:30,avatar:'#ec4899' },
  { id:'e3',name:'Marcus Dlamini',    email:'marcus@movestudio.co.za',    phone:'+27 84 333 4444',department:'Engineering',  position:'Senior Full-Stack Developer', startDate:D(420), grossSalary:52000,status:'active',    idNumber:'9507085333000',taxNumber:'7654321098',bankName:'Absa',        accountNumber:'40xxxxxx03',annualLeaveBalance:10,sickLeaveBalance:25,avatar:'#f59e0b' },
  { id:'e4',name:'Priya Naidoo',      email:'priya@movestudio.co.za',     phone:'+27 81 444 5555',department:'Marketing',    position:'Marketing Manager',           startDate:D(365), grossSalary:38000,status:'active',    idNumber:'9801014444011',taxNumber:'6543210987',bankName:'Nedbank',     accountNumber:'19xxxxxx04',annualLeaveBalance:15,sickLeaveBalance:30,avatar:'#10b981' },
  { id:'e5',name:'James Botha',       email:'james@movestudio.co.za',     phone:'+27 72 555 6666',department:'Sales',        position:'Sales Lead',                  startDate:D(290), grossSalary:35000,status:'active',    idNumber:'9412025555022',taxNumber:'5432109876',bankName:'FNB',         accountNumber:'62xxxxxx05',annualLeaveBalance:15,sickLeaveBalance:30,avatar:'#3b82f6' },
  { id:'e6',name:'Ayanda Khumalo',    email:'ayanda@movestudio.co.za',    phone:'+27 79 666 7777',department:'Marketing',    position:'Social Media Specialist',     startDate:D(180), grossSalary:28000,status:'probation', idNumber:'0102016666033',taxNumber:'4321098765',bankName:'Capitec',    accountNumber:'10xxxxxx06',annualLeaveBalance:15,sickLeaveBalance:30,avatar:'#8b5cf6' },
  { id:'e7',name:'Thabo Mokoena',     email:'thabo@movestudio.co.za',     phone:'+27 73 777 8888',department:'Finance',      position:'Finance Manager',             startDate:D(610), grossSalary:42000,status:'active',    idNumber:'8808077777044',taxNumber:'3210987654',bankName:'Standard Bank',accountNumber:'00xxxxxx07',annualLeaveBalance:6, sickLeaveBalance:22,avatar:'#ef4444' },
  { id:'e8',name:'Nomsa Sithole',     email:'nomsa@movestudio.co.za',     phone:'+27 60 888 9999',department:'HR',           position:'HR Coordinator',              startDate:D(240), grossSalary:30000,status:'active',    idNumber:'9606018888055',taxNumber:'2109876543',bankName:'Absa',        accountNumber:'40xxxxxx08',annualLeaveBalance:14,sickLeaveBalance:29,avatar:'#06b6d4' },
]

export const SEED_LEAVE: LeaveRequest[] = [
  { id:'l1',employeeId:'e2',type:'annual', startDate:D(-7), endDate:D(-4), days:3, status:'approved', reason:'Family holiday',      createdAt:D(10) },
  { id:'l2',employeeId:'e4',type:'sick',   startDate:D(2),  endDate:D(2),  days:1, status:'approved', reason:'Medical appointment', createdAt:D(3) },
  { id:'l3',employeeId:'e6',type:'annual', startDate:D(-14),endDate:D(-8), days:5, status:'pending',  reason:'Vacation',            createdAt:D(20) },
  { id:'l4',employeeId:'e5',type:'family', startDate:D(1),  endDate:D(1),  days:1, status:'pending',  reason:'Child school event',  createdAt:D(2) },
  { id:'l5',employeeId:'e3',type:'sick',   startDate:D(5),  endDate:D(5),  days:1, status:'approved', reason:'Flu',                 createdAt:D(6) },
  { id:'l6',employeeId:'e7',type:'annual', startDate:D(-3), endDate:D(-1), days:2, status:'rejected', reason:'School holidays',     createdAt:D(8) },
]

// Generate a payroll run for current month
const thisMonth = new Date().toISOString().slice(0,7)
export const SEED_PAYROLL: PayrollRun[] = [{
  id:'pr1', month:thisMonth, status:'draft', entries: SEED_EMPLOYEES.filter(e=>e.status==='active'||e.status==='probation').map(e=>{
    const {paye,uif,net} = calcNetPay(e.grossSalary)
    return { employeeId:e.id, grossSalary:e.grossSalary, paye, uif, otherDeductions:0, netPay:net }
  })
}]

const KEY = 'hr_v1'
export const loadHR = (): { employees:Employee[]; leaves:LeaveRequest[]; payrolls:PayrollRun[] } => {
  try { const r=localStorage.getItem(KEY); if(r) return JSON.parse(r) } catch {}
  return { employees:SEED_EMPLOYEES, leaves:SEED_LEAVE, payrolls:SEED_PAYROLL }
}
export const saveHR = (employees:Employee[], leaves:LeaveRequest[], payrolls:PayrollRun[]) =>
  localStorage.setItem(KEY, JSON.stringify({ employees, leaves, payrolls }))
