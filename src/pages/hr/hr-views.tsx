import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Employee, LeaveRequest, LeaveStatus, PayrollRun, LEAVE_META, LEAVE_STATUS_META, DEPT_COLORS, EMP_STATUS_META, fmt, fmtDate, monthLabel, calcNetPay, calcPAYE, calcUIF } from './hr-data'
import { EmpAvatar, StatusBadge, DeptBadge, card, lbl } from './hr-components'

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function DashboardView({ employees, leaves, payrolls, onAddEmployee, onLeaveRequest }: { employees:Employee[]; leaves:LeaveRequest[]; payrolls:PayrollRun[]; onAddEmployee:()=>void; onLeaveRequest:()=>void }) {
  const active = employees.filter(e=>e.status==='active'||e.status==='probation')
  const payroll = active.reduce((s,e)=>s+e.grossSalary,0)
  const pending = leaves.filter(l=>l.status==='pending')
  const depts = [...new Set(employees.map(e=>e.department))]
  const latestPayroll = [...payrolls].sort((a,b)=>b.month.localeCompare(a.month))[0]
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:28, maxWidth:1100, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>HR & Payroll</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>People, payroll & leave management</p></div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onLeaveRequest} style={{ padding:'10px 18px', borderRadius:9, border:'1px solid rgba(87,155,252,0.3)', background:'rgba(87,155,252,0.08)', color:'#579bfc', fontSize:13, fontWeight:600, cursor:'pointer' }}>📅 Leave Request</button>
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onAddEmployee} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Add Employee</motion.button>
        </div>
      </div>
      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
        {[{l:'Headcount',v:String(active.length),s:`${employees.filter(e=>e.status==='probation').length} on probation`,c:'#6366f1'},{l:'Monthly Payroll',v:fmt(payroll).replace('.00',''),s:'Gross payroll cost',c:'#34d399'},{l:'Leave Pending',v:String(pending.length),s:'Awaiting approval',c:'#fdab3d'},{l:'Departments',v:String(depts.length),s:'Active teams',c:'#579bfc'}].map(x=>(
          <motion.div key={x.l} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} style={{ flex:1, minWidth:160, ...card, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`${x.c}15`, filter:'blur(24px)' }}/>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{x.l}</div>
            <div style={{ fontSize:26, fontWeight:900, color:x.c, marginBottom:4 }}>{x.v}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{x.s}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Dept breakdown */}
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>By Department</div>
          {depts.map(d=>{ const cnt=employees.filter(e=>e.department===d&&e.status!=='resigned'&&e.status!=='terminated').length; const pct=active.length?(cnt/active.length)*100:0; const c=DEPT_COLORS[d]||'#818cf8'; return (
            <div key={d} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, fontSize:12 }}>
                <span style={{ color:c, fontWeight:700 }}>{d}</span><span style={{ color:'rgba(255,255,255,0.4)' }}>{cnt} people</span>
              </div>
              <div style={{ height:4, borderRadius:99, background:'rgba(255,255,255,0.06)' }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7 }} style={{ height:'100%', borderRadius:99, background:c }}/>
              </div>
            </div>
          )})}
        </div>
        {/* Pending leave */}
        <div style={card}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Pending Leave Requests ({pending.length})</div>
          {pending.length===0&&<div style={{ fontSize:13, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'20px 0' }}>No pending requests</div>}
          {pending.map(l=>{ const emp=employees.find(e=>e.id===l.employeeId); const meta=LEAVE_META[l.type]; return (
            <div key={l.id} style={{ display:'flex', gap:12, alignItems:'center', marginBottom:10, padding:'10px 12px', borderRadius:9, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
              {emp&&<EmpAvatar emp={emp} size={32}/>}
              <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13 }}>{emp?.name}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{meta.icon} {meta.label} · {l.days} day{l.days!==1?'s':''}</div></div>
              <span style={{ fontSize:11, color:'#fdab3d', fontWeight:700 }}>{fmtDate(l.startDate)}</span>
            </div>
          )})}
        </div>
      </div>
      {/* Payroll preview */}
      {latestPayroll&&(
        <div style={card}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>Payroll — {monthLabel(latestPayroll.month)}</div>
            <span style={{ padding:'3px 10px', borderRadius:99, background:latestPayroll.status==='processed'?'rgba(0,200,117,0.15)':'rgba(253,171,61,0.15)', color:latestPayroll.status==='processed'?'#00c875':'#fdab3d', fontSize:11, fontWeight:700 }}>{latestPayroll.status==='processed'?'Processed':'Draft'}</span>
          </div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {[{l:'Gross',v:latestPayroll.entries.reduce((s,e)=>s+e.grossSalary,0),c:'#34d399'},{l:'PAYE',v:latestPayroll.entries.reduce((s,e)=>s+e.paye,0),c:'#f87171'},{l:'UIF',v:latestPayroll.entries.reduce((s,e)=>s+e.uif,0),c:'#fdab3d'},{l:'Net Pay',v:latestPayroll.entries.reduce((s,e)=>s+e.netPay,0),c:'#60a5fa'}].map(x=>(
              <div key={x.l} style={{ flex:1, padding:'14px 16px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', marginBottom:6 }}>{x.l}</div>
                <div style={{ fontSize:16, fontWeight:800, color:x.c }}>{fmt(x.v)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Employees View ───────────────────────────────────────────────────────────
export function EmployeesView({ employees, onAdd, onEdit, onDelete }: { employees:Employee[]; onAdd:()=>void; onEdit:(e:Employee)=>void; onDelete:(id:string)=>void }) {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('all')
  const depts = [...new Set(employees.map(e=>e.department))]
  const filtered = employees.filter(e=>{
    const q=search.toLowerCase()
    return (!q||e.name.toLowerCase().includes(q)||e.position.toLowerCase().includes(q)||e.email.toLowerCase().includes(q))&&(dept==='all'||e.department===dept)
  })
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, width:'100%', maxWidth:1200 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Employees</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{employees.length} people</p></div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onAdd} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Add Employee</motion.button>
      </div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search employees…" style={{ flex:1, minWidth:200, padding:'9px 14px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none' }}/>
        <div style={{ display:'flex', gap:6 }}>
          {['all',...depts].map(d=>{ const c=DEPT_COLORS[d]||'rgba(255,255,255,0.5)'; return (
            <button key={d} onClick={()=>setDept(d)} style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${dept===d?c:'rgba(255,255,255,0.1)'}`, background:dept===d?`${c}20`:'transparent', color:dept===d?c:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer' }}>{d==='all'?'All':d}</button>
          )})}
        </div>
      </div>
      <div style={{ ...card, padding:0, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 70px', padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
          {['Employee','Department & Role','Status','Salary','Start Date',''].map(h=><span key={h}>{h}</span>)}
        </div>
        {filtered.map((e,i)=>(
          <motion.div key={e.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
            style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr 1fr 1fr 70px', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center', cursor:'pointer' }}
            onMouseEnter={ev=>(ev.currentTarget.style.background='rgba(255,255,255,0.02)')} onMouseLeave={ev=>(ev.currentTarget.style.background='transparent')}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <EmpAvatar emp={e} size={36}/>
              <div><div style={{ fontWeight:700, fontSize:14 }}>{e.name}</div><div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{e.email}</div></div>
            </div>
            <div><DeptBadge dept={e.department}/><div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:3 }}>{e.position}</div></div>
            <div><StatusBadge status={e.status}/></div>
            <div style={{ fontWeight:700, fontSize:13 }}>{fmt(e.grossSalary)}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{fmtDate(e.startDate)}</div>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={()=>onEdit(e)} style={{ padding:'3px 8px', borderRadius:5, border:'1px solid rgba(87,155,252,0.3)', background:'rgba(87,155,252,0.08)', color:'#579bfc', fontSize:11, cursor:'pointer' }}>Edit</button>
              <button onClick={()=>onDelete(e.id)} style={{ padding:'3px 8px', borderRadius:5, border:'1px solid rgba(226,68,92,0.3)', background:'rgba(226,68,92,0.08)', color:'#e2445c', fontSize:11, cursor:'pointer' }}>✕</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Leave View ───────────────────────────────────────────────────────────────
export function LeaveView({ employees, leaves, onRequest, onUpdateStatus }: { employees:Employee[]; leaves:LeaveRequest[]; onRequest:()=>void; onUpdateStatus:(id:string,s:LeaveStatus)=>void }) {
  const [filter, setFilter] = useState<LeaveStatus|'all'>('all')
  const sorted = [...leaves].filter(l=>filter==='all'||l.status===filter).sort((a,b)=>b.createdAt-a.createdAt)
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, maxWidth:960, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Leave Management</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>{leaves.length} requests</p></div>
        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={onRequest} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#579bfc,#6366f1)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Leave Request</motion.button>
      </div>
      <div style={{ display:'flex', gap:6 }}>
        {(['all','pending','approved','rejected'] as (LeaveStatus|'all')[]).map(s=>{ const m=s!=='all'?LEAVE_STATUS_META[s]:null; return (
          <button key={s} onClick={()=>setFilter(s)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${filter===s?(m?.color||'rgba(255,255,255,0.5)'):'rgba(255,255,255,0.1)'}`, background:filter===s?`${m?.color||'rgba(255,255,255,0.5)'}20`:'transparent', color:filter===s?(m?.color||'rgba(255,255,255,0.7)'):'rgba(255,255,255,0.4)', fontSize:12, fontWeight:700, cursor:'pointer' }}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
        )})}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {sorted.map(l=>{ const emp=employees.find(e=>e.id===l.employeeId); const meta=LEAVE_META[l.type]; const stsm=LEAVE_STATUS_META[l.status]; return (
          <motion.div key={l.id} initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', borderRadius:13, background:'#080b14', border:'1px solid rgba(255,255,255,0.07)', borderLeft:`4px solid ${meta.color}` }}>
            {emp&&<EmpAvatar emp={emp} size={40}/>}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{emp?.name}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{meta.icon} {meta.label} · {l.days} day{l.days!==1?'s':''} · {fmtDate(l.startDate)}{l.days>1?` – ${fmtDate(l.endDate)}`:''}</div>
              {l.reason&&<div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:4 }}>"{l.reason}"</div>}
            </div>
            <span style={{ padding:'4px 12px', borderRadius:99, background:`${stsm.color}15`, border:`1px solid ${stsm.color}40`, color:stsm.color, fontSize:11, fontWeight:700 }}>{stsm.label}</span>
            {l.status==='pending'&&(
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>onUpdateStatus(l.id,'approved')} style={{ padding:'6px 14px', borderRadius:8, border:'1px solid rgba(0,200,117,0.4)', background:'rgba(0,200,117,0.12)', color:'#00c875', fontSize:12, fontWeight:700, cursor:'pointer' }}>✓ Approve</button>
                <button onClick={()=>onUpdateStatus(l.id,'rejected')} style={{ padding:'6px 14px', borderRadius:8, border:'1px solid rgba(226,68,92,0.4)', background:'rgba(226,68,92,0.08)', color:'#e2445c', fontSize:12, fontWeight:700, cursor:'pointer' }}>✕ Reject</button>
              </div>
            )}
          </motion.div>
        )})}
        {sorted.length===0&&<div style={{ textAlign:'center', padding:'48px', color:'rgba(255,255,255,0.3)', fontSize:14 }}>No leave requests found</div>}
      </div>
    </div>
  )
}

// ─── Payroll View ─────────────────────────────────────────────────────────────
export function PayrollView({ employees, payrolls, onProcess }: { employees:Employee[]; payrolls:PayrollRun[]; onProcess:(month:string)=>void }) {
  const [selectedMonth, setSelectedMonth] = useState(payrolls[0]?.month||new Date().toISOString().slice(0,7))
  const run = payrolls.find(p=>p.month===selectedMonth)
  const totalGross=run?.entries.reduce((s,e)=>s+e.grossSalary,0)||0
  const totalPAYE=run?.entries.reduce((s,e)=>s+e.paye,0)||0
  const totalUIF=run?.entries.reduce((s,e)=>s+e.uif,0)||0
  const totalNet=run?.entries.reduce((s,e)=>s+e.netPay,0)||0
  const months = [...new Set(payrolls.map(p=>p.month))].sort().reverse()
  return (
    <div style={{ padding:32, display:'flex', flexDirection:'column', gap:20, maxWidth:1100, width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div><h1 style={{ fontSize:26, fontWeight:900, margin:0, letterSpacing:'-0.03em' }}>Payroll</h1><p style={{ margin:'6px 0 0', color:'rgba(255,255,255,0.4)', fontSize:14 }}>SARS-compliant PAYE & UIF calculations</p></div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} style={{ padding:'8px 14px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'#080b14', color:'white', fontSize:13, cursor:'pointer', outline:'none' }}>
            {months.map(m=><option key={m} value={m}>{monthLabel(m)}</option>)}
          </select>
          {run?.status==='draft'&&<motion.button whileTap={{ scale:0.97 }} onClick={()=>onProcess(selectedMonth)} style={{ padding:'10px 20px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#059669,#34d399)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer' }}>▶ Process Payroll</motion.button>}
        </div>
      </div>
      {/* Summary */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        {[{l:'Gross Payroll',v:totalGross,c:'#34d399'},{l:'Total PAYE',v:totalPAYE,c:'#f87171'},{l:'Total UIF',v:totalUIF,c:'#fdab3d'},{l:'Net Payable',v:totalNet,c:'#60a5fa'}].map(x=>(
          <div key={x.l} style={{ flex:1, padding:'16px 18px', borderRadius:12, background:'#080b14', border:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>{x.l}</div>
            <div style={{ fontSize:20, fontWeight:900, color:x.c }}>{fmt(x.v)}</div>
          </div>
        ))}
      </div>
      {/* Payslip table */}
      <div style={{ ...card, padding:0, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontWeight:700, fontSize:14 }}>Employee Payslips — {run?monthLabel(run.month):'No run selected'}</div>
          {run&&<span style={{ padding:'3px 10px', borderRadius:99, background:run.status==='processed'?'rgba(0,200,117,0.15)':'rgba(253,171,61,0.15)', color:run.status==='processed'?'#00c875':'#fdab3d', fontSize:11, fontWeight:700 }}>{run.status==='processed'?'✓ Processed':'Draft'}</span>}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'8px 20px', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          {['Employee','Gross','PAYE','UIF','Net Pay'].map(h=><span key={h}>{h}</span>)}
        </div>
        {run?.entries.map((entry,i)=>{ const emp=employees.find(e=>e.id===entry.employeeId); if(!emp) return null; return (
          <motion.div key={entry.employeeId} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}
            style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <EmpAvatar emp={emp} size={32}/>
              <div><div style={{ fontWeight:700, fontSize:14 }}>{emp.name}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{emp.position}</div></div>
            </div>
            <div style={{ fontWeight:700, fontSize:13, color:'#34d399' }}>{fmt(entry.grossSalary)}</div>
            <div style={{ fontSize:13, color:'#f87171' }}>{fmt(entry.paye)}</div>
            <div style={{ fontSize:13, color:'#fdab3d' }}>{fmt(entry.uif)}</div>
            <div style={{ fontWeight:800, fontSize:14, color:'#60a5fa' }}>{fmt(entry.netPay)}</div>
          </motion.div>
        )})||<div style={{ padding:'32px 20px', textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.3)' }}>No payroll run for this month</div>}
      </div>
      {/* SARS note */}
      <div style={{ padding:'14px 18px', borderRadius:10, background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.15)', fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
        ⚠️ <strong style={{ color:'#fbbf24' }}>SARS Compliance:</strong> PAYE calculated using 2024/25 tax tables with primary rebate of R17,235. UIF at 1% of gross (max R177.12/month). This is a guide — consult your tax practitioner for final submissions.
      </div>
    </div>
  )
}
