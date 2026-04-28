import React, { useState } from 'react'
import StudioSidebar from '../components/StudioSidebar'
import { Employee, LeaveRequest, LeaveStatus, PayrollRun, loadHR, saveHR, calcNetPay } from './hr/hr-data'
import { AddEmployeeModal, LeaveModal } from './hr/hr-components'
import { DashboardView, EmployeesView, LeaveView, PayrollView } from './hr/hr-views'

type HRView = 'dashboard'|'employees'|'leave'|'payroll'

const NAV: { id:HRView; icon:string; label:string }[] = [
  { id:'dashboard', icon:'🏠', label:'Overview'   },
  { id:'employees', icon:'👥', label:'Employees'  },
  { id:'leave',     icon:'📅', label:'Leave'      },
  { id:'payroll',   icon:'💰', label:'Payroll'    },
]

export default function HRPage() {
  const [data, setData] = useState(() => loadHR())
  const [view, setView] = useState<HRView>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee|undefined>()
  const [showLeaveModal, setShowLeaveModal] = useState(false)

  const { employees, leaves, payrolls } = data
  const save = (e:Employee[], l:LeaveRequest[], p:PayrollRun[]) => { saveHR(e,l,p); setData({ employees:e, leaves:l, payrolls:p }) }

  const saveEmployee = (emp:Employee) => {
    const exists = employees.find(x=>x.id===emp.id)
    // When adding a new employee, also create a payroll entry for them in the draft payroll
    const newPayrolls = payrolls.map(pr => {
      if(pr.status==='draft' && !exists) {
        const {paye,uif,net} = calcNetPay(emp.grossSalary)
        return { ...pr, entries:[...pr.entries, { employeeId:emp.id, grossSalary:emp.grossSalary, paye, uif, otherDeductions:0, netPay:net }] }
      }
      if(pr.status==='draft' && exists) {
        const {paye,uif,net} = calcNetPay(emp.grossSalary)
        return { ...pr, entries:pr.entries.map(e=>e.employeeId===emp.id?{ ...e, grossSalary:emp.grossSalary, paye, uif, netPay:net }:e) }
      }
      return pr
    })
    save(exists?employees.map(x=>x.id===emp.id?emp:x):[...employees,emp], leaves, newPayrolls)
    setShowAddEmployee(false); setEditingEmployee(undefined)
  }

  const deleteEmployee = (id:string) => {
    const newPayrolls = payrolls.map(pr=>({ ...pr, entries:pr.entries.filter(e=>e.employeeId!==id) }))
    save(employees.filter(e=>e.id!==id), leaves.filter(l=>l.employeeId!==id), newPayrolls)
  }

  const saveLeave = (l:LeaveRequest) => {
    const exists = leaves.find(x=>x.id===l.id)
    save(employees, exists?leaves.map(x=>x.id===l.id?l:x):[...leaves,l], payrolls)
    setShowLeaveModal(false)
  }

  const updateLeaveStatus = (id:string, status:LeaveStatus) =>
    save(employees, leaves.map(l=>l.id===id?{...l,status}:l), payrolls)

  const processPayroll = (month:string) => {
    const newPayrolls = payrolls.map(p=>p.month===month?{...p,status:'processed' as const, processedAt:Date.now()}:p)
    save(employees, leaves, newPayrolls)
  }

  const pendingLeave = leaves.filter(l=>l.status==='pending').length

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'var(--font, Inter, sans-serif)', background:'#040608', color:'white', overflow:'hidden' }}>
      <StudioSidebar collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(p=>!p)}/>

      {/* Sub-nav */}
      <div style={{ width:180, flexShrink:0, background:'#080b14', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', padding:'20px 10px', gap:4 }}>
        <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.12em', padding:'0 6px', marginBottom:10 }}>HR & Payroll</div>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:`1px solid ${view===item.id?'rgba(139,92,246,0.5)':'transparent'}`, background:view===item.id?'rgba(139,92,246,0.12)':'transparent', color:view===item.id?'white':'rgba(255,255,255,0.5)', fontSize:13, fontWeight:view===item.id?700:500, cursor:'pointer', textAlign:'left', width:'100%' }}>
            <span style={{ fontSize:16 }}>{item.icon}</span> {item.label}
            {item.id==='leave' && pendingLeave>0 && <span style={{ marginLeft:'auto', fontSize:10, fontWeight:800, color:'#fdab3d', background:'rgba(253,171,61,0.15)', padding:'1px 6px', borderRadius:99 }}>{pendingLeave}</span>}
          </button>
        ))}
        <div style={{ marginTop:'auto', padding:'12px 8px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', gap:8 }}>
          <div><div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginBottom:3 }}>Active Staff</div><div style={{ fontSize:18, fontWeight:900, color:'#8b5cf6' }}>{employees.filter(e=>e.status==='active'||e.status==='probation').length}</div></div>
          <div><div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginBottom:3 }}>Monthly Payroll</div><div style={{ fontSize:12, fontWeight:700, color:'#34d399' }}>R {(employees.filter(e=>e.status==='active'||e.status==='probation').reduce((s,e)=>s+e.grossSalary,0)/1000).toFixed(0)}k</div></div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto', display:'flex' }}>
        {view==='dashboard' && <DashboardView employees={employees} leaves={leaves} payrolls={payrolls} onAddEmployee={()=>setShowAddEmployee(true)} onLeaveRequest={()=>setShowLeaveModal(true)}/>}
        {view==='employees' && <EmployeesView employees={employees} onAdd={()=>{ setEditingEmployee(undefined); setShowAddEmployee(true) }} onEdit={e=>{ setEditingEmployee(e); setShowAddEmployee(true) }} onDelete={deleteEmployee}/>}
        {view==='leave'     && <LeaveView employees={employees} leaves={leaves} onRequest={()=>setShowLeaveModal(true)} onUpdateStatus={updateLeaveStatus}/>}
        {view==='payroll'   && <PayrollView employees={employees} payrolls={payrolls} onProcess={processPayroll}/>}
      </div>

      {showAddEmployee && <AddEmployeeModal existing={editingEmployee} onClose={()=>{ setShowAddEmployee(false); setEditingEmployee(undefined) }} onSave={saveEmployee}/>}
      {showLeaveModal  && <LeaveModal employees={employees} onClose={()=>setShowLeaveModal(false)} onSave={saveLeave}/>}
    </div>
  )
}
