import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Employee, LeaveRequest, LeaveType, EmpStatus, DEPARTMENTS, LEAVE_META, EMP_STATUS_META, DEPT_COLORS, AVATAR_COLORS, fmt, uid } from './hr-data'

export const inp: React.CSSProperties = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'white', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const }
export const lbl: React.CSSProperties = { fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:5, display:'block' }
export const card: React.CSSProperties = { background:'#080b14', borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', padding:24 }

export function EmpAvatar({ emp, size=38 }: { emp:Employee; size?:number }) {
  const initials = emp.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return <div style={{ width:size, height:size, borderRadius:'50%', background:`${emp.avatar}25`, border:`2px solid ${emp.avatar}60`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.37, fontWeight:800, color:emp.avatar, flexShrink:0 }}>{initials}</div>
}

export function StatusBadge({ status }: { status:EmpStatus }) {
  const m = EMP_STATUS_META[status]
  return <span style={{ padding:'3px 10px', borderRadius:99, background:`${m.color}18`, border:`1px solid ${m.color}40`, color:m.color, fontSize:11, fontWeight:700 }}>{m.label}</span>
}

export function DeptBadge({ dept }: { dept:string }) {
  const c = DEPT_COLORS[dept]||'#818cf8'
  return <span style={{ padding:'2px 9px', borderRadius:99, background:`${c}18`, border:`1px solid ${c}30`, color:c, fontSize:11, fontWeight:700 }}>{dept}</span>
}

// ── Add/Edit Employee Modal ───────────────────────────────────────────────────
export function AddEmployeeModal({ onClose, onSave, existing }: { onClose:()=>void; onSave:(e:Employee)=>void; existing?:Employee }) {
  const [f, setF] = useState({
    name:existing?.name||'', email:existing?.email||'', phone:existing?.phone||'',
    department:existing?.department||DEPARTMENTS[0], position:existing?.position||'',
    startDate:existing?.startDate?new Date(existing.startDate).toISOString().slice(0,10):new Date().toISOString().slice(0,10),
    grossSalary:existing?.grossSalary||0, status:(existing?.status||'active') as EmpStatus,
    idNumber:existing?.idNumber||'', taxNumber:existing?.taxNumber||'',
    bankName:existing?.bankName||'', accountNumber:existing?.accountNumber||'',
  })
  const u = (k:string, v:string|number) => setF(p=>({...p,[k]:v}))
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:540, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24 }}>{existing?'Edit Employee':'Add Employee'}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div style={{ gridColumn:'span 2' }}><label style={lbl}>Full Name</label><input style={inp} value={f.name} onChange={e=>u('name',e.target.value)}/></div>
          <div><label style={lbl}>Email</label><input style={inp} type="email" value={f.email} onChange={e=>u('email',e.target.value)}/></div>
          <div><label style={lbl}>Phone</label><input style={inp} value={f.phone} onChange={e=>u('phone',e.target.value)}/></div>
          <div><label style={lbl}>Department</label>
            <select style={{ ...inp }} value={f.department} onChange={e=>u('department',e.target.value)}>
              {DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Position / Role</label><input style={inp} value={f.position} onChange={e=>u('position',e.target.value)}/></div>
          <div><label style={lbl}>Start Date</label><input style={inp} type="date" value={f.startDate} onChange={e=>u('startDate',e.target.value)}/></div>
          <div><label style={lbl}>Gross Monthly Salary (R)</label><input style={inp} type="number" value={f.grossSalary} onChange={e=>u('grossSalary',Number(e.target.value))}/></div>
          <div><label style={lbl}>Employment Status</label>
            <select style={{ ...inp }} value={f.status} onChange={e=>u('status',e.target.value)}>
              {(['active','probation','resigned','terminated'] as EmpStatus[]).map(s=><option key={s} value={s}>{EMP_STATUS_META[s].label}</option>)}
            </select>
          </div>
          <div><label style={lbl}>ID Number</label><input style={inp} value={f.idNumber} onChange={e=>u('idNumber',e.target.value)}/></div>
          <div><label style={lbl}>Tax Number (SARS)</label><input style={inp} value={f.taxNumber} onChange={e=>u('taxNumber',e.target.value)}/></div>
          <div><label style={lbl}>Bank Name</label><input style={inp} value={f.bankName} onChange={e=>u('bankName',e.target.value)}/></div>
          <div><label style={lbl}>Account Number</label><input style={inp} value={f.accountNumber} onChange={e=>u('accountNumber',e.target.value)}/></div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>{
            if(!f.name.trim()) return
            const color = AVATAR_COLORS[Math.floor(Math.random()*AVATAR_COLORS.length)]
            onSave({ id:existing?.id||uid(), ...f, startDate:new Date(f.startDate).getTime(), annualLeaveBalance:existing?.annualLeaveBalance??15, sickLeaveBalance:existing?.sickLeaveBalance??30, avatar:existing?.avatar||color })
          }} style={{ padding:'10px 24px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, cursor:'pointer' }}>
            {existing?'Save Changes':'Add Employee'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Leave Request Modal ───────────────────────────────────────────────────────
export function LeaveModal({ employees, onClose, onSave, existing }: { employees:Employee[]; onClose:()=>void; onSave:(l:LeaveRequest)=>void; existing?:LeaveRequest }) {
  const [f, setF] = useState({
    employeeId:existing?.employeeId||employees[0]?.id||'',
    type:(existing?.type||'annual') as LeaveType,
    startDate:existing?.startDate?new Date(existing.startDate).toISOString().slice(0,10):new Date().toISOString().slice(0,10),
    endDate:existing?.endDate?new Date(existing.endDate).toISOString().slice(0,10):new Date().toISOString().slice(0,10),
    reason:existing?.reason||'',
  })
  const u = (k:string, v:string) => setF(p=>({...p,[k]:v}))
  const days = Math.max(1, Math.round((new Date(f.endDate).getTime()-new Date(f.startDate).getTime())/86400000)+1)
  const meta = LEAVE_META[f.type]
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ position:'relative', zIndex:1, background:'#0d1117', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:32, width:440 }}>
        <div style={{ fontWeight:800, fontSize:18, marginBottom:24 }}>Leave Request</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div><label style={lbl}>Employee</label>
            <select style={{ ...inp }} value={f.employeeId} onChange={e=>u('employeeId',e.target.value)}>
              {employees.filter(e=>e.status==='active'||e.status==='probation').map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Leave Type</label>
            <div style={{ display:'flex', gap:8 }}>
              {(Object.entries(LEAVE_META) as [LeaveType,any][]).map(([k,m])=>(
                <button key={k} onClick={()=>u('type',k)} style={{ flex:1, padding:'8px 4px', borderRadius:8, border:`1px solid ${f.type===k?m.color:'rgba(255,255,255,0.1)'}`, background:f.type===k?`${m.color}18`:'transparent', color:f.type===k?m.color:'rgba(255,255,255,0.4)', fontSize:10, fontWeight:700, cursor:'pointer' }}>{m.icon} {m.label.split(' ')[0]}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div><label style={lbl}>Start Date</label><input style={inp} type="date" value={f.startDate} onChange={e=>u('startDate',e.target.value)}/></div>
            <div><label style={lbl}>End Date</label><input style={inp} type="date" value={f.endDate} onChange={e=>u('endDate',e.target.value)}/></div>
          </div>
          <div style={{ padding:'10px 14px', borderRadius:9, background:`${meta.color}10`, border:`1px solid ${meta.color}30`, fontSize:13, color:meta.color, fontWeight:700 }}>
            {meta.icon} {days} day{days!==1?'s':''} of {meta.label}
          </div>
          <div><label style={lbl}>Reason</label><textarea style={{ ...inp, minHeight:60, resize:'vertical' }} value={f.reason} onChange={e=>u('reason',e.target.value)}/></div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 20px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.5)', cursor:'pointer' }}>Cancel</button>
          <motion.button whileTap={{ scale:0.97 }} onClick={()=>onSave({ id:existing?.id||uid(), employeeId:f.employeeId, type:f.type, startDate:new Date(f.startDate).getTime(), endDate:new Date(f.endDate).getTime(), days, status:'pending', reason:f.reason, createdAt:Date.now() })}
            style={{ padding:'10px 24px', borderRadius:9, border:'none', background:`linear-gradient(135deg,${meta.color},${meta.color}aa)`, color:'white', fontWeight:700, cursor:'pointer' }}>
            Submit Request
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
