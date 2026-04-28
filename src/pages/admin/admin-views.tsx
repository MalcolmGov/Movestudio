import React,{useState} from 'react'
import {motion} from 'framer-motion'
import {Client,Invoice,AnalyticsDay,PLANS,STATUS_META,PAY_META,fmt,fmtDate,fmtK,ALL_MODULES} from './admin-data'
import {Stat,Avatar,Pill} from './admin-components'

const S=(s:any):React.CSSProperties=>s
const card=S({padding:'24px',borderRadius:16,background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)'})
const th=S({fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'0.08em',padding:'10px 14px',textAlign:'left'})
const td=S({fontSize:13,color:'rgba(255,255,255,0.75)',padding:'12px 14px',borderTop:'1px solid rgba(255,255,255,0.05)'})

// ── OVERVIEW ─────────────────────────────────────────────────────────────────
export function OverviewView({clients,invoices,analytics,onAddClient}:{clients:Client[];invoices:Invoice[];analytics:AnalyticsDay[];onAddClient:()=>void}) {
  const active=clients.filter(c=>c.status==='active')
  const mrr=active.reduce((s,c)=>s+c.mrr,0)
  const overdue=invoices.filter(i=>i.status==='overdue')
  const recent=[...clients].sort((a,b)=>b.startDate-a.startDate).slice(0,5)
  const byPlan=Object.entries(PLANS).map(([k,v])=>({...v,key:k,count:active.filter(c=>c.plan===k).length}))
  return (
    <div style={{flex:1,padding:32,overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:28}}>
        <div><h1 style={{fontSize:26,fontWeight:900,color:'white',marginBottom:4}}>Admin Overview</h1><p style={{fontSize:13,color:'rgba(255,255,255,0.4)'}}>Platform health at a glance</p></div>
        <button onClick={onAddClient} style={{padding:'10px 20px',borderRadius:9,border:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>+ Add Client</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
        <Stat label="Monthly Recurring Revenue" value={fmtK(mrr)} sub={`ARR ${fmtK(mrr*12)}`} color="#10b981"/>
        <Stat label="Active Clients" value={active.length} sub={`${clients.length} total`} color="#6366f1"/>
        <Stat label="Overdue Invoices" value={overdue.length} sub={overdue.length?`${fmt(overdue.reduce((s,i)=>s+i.amount,0))} outstanding`:''} color={overdue.length?'#e2445c':'white'}/>
        <Stat label="Avg Revenue / Client" value={active.length?fmtK(Math.round(mrr/active.length)):'-'} sub="ARPU" color="#f59e0b"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20,marginBottom:20}}>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:800,color:'white',marginBottom:16}}>Recent Signups</div>
          {recent.map(c=>(
            <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <Avatar name={c.name} color={c.avatar}/>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:'white'}}>{c.name}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{c.industry} · {fmtDate(c.startDate)}</div></div>
              <Pill label={PLANS[c.plan].label} color={PLANS[c.plan].color}/>
              <div style={{fontSize:13,fontWeight:700,color:'#10b981'}}>{fmt(c.mrr)}/mo</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={card}>
            <div style={{fontSize:14,fontWeight:800,color:'white',marginBottom:14}}>Revenue by Plan</div>
            {byPlan.map(p=>(
              <div key={p.key} style={{marginBottom:12}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}><span style={{color:'rgba(255,255,255,0.6)'}}>{p.label}</span><span style={{color:p.color,fontWeight:700}}>{p.count} clients</span></div>
                <div style={{height:6,borderRadius:99,background:'rgba(255,255,255,0.06)'}}><div style={{height:'100%',borderRadius:99,background:p.color,width:`${Math.max((p.count/(active.length||1))*100,4)}%`,transition:'width 0.5s'}}/></div>
              </div>
            ))}
          </div>
          <div style={card}>
            <div style={{fontSize:14,fontWeight:800,color:'white',marginBottom:12}}>30-Day Traffic</div>
            <div style={{fontSize:26,fontWeight:900,color:'#6366f1'}}>{analytics.reduce((s,d)=>s+d.visits,0).toLocaleString()}</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:10}}>total visits · {analytics.reduce((s,d)=>s+d.signups,0)} signups</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:2,height:40}}>
              {analytics.slice(-14).map((d,i)=><div key={i} style={{flex:1,background:'#6366f1',borderRadius:2,height:`${(d.visits/400)*100}%`,opacity:0.5+i/28}}/>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── CLIENTS ──────────────────────────────────────────────────────────────────
export function ClientsView({clients,onAdd,onEdit,onDelete}:{clients:Client[];onAdd:()=>void;onEdit:(c:Client)=>void;onDelete:(id:string)=>void}) {
  const [q,setQ]=useState('');const [pf,setPf]=useState<string>('all');const [sf,setSf]=useState<string>('all')
  const filtered=clients.filter(c=>{
    const mq=c.name.toLowerCase().includes(q.toLowerCase())||c.contactName.toLowerCase().includes(q.toLowerCase())||c.email.toLowerCase().includes(q.toLowerCase())
    const mp=pf==='all'||c.plan===pf; const ms=sf==='all'||c.status===sf
    return mq&&mp&&ms
  })
  const totalMRR=filtered.filter(c=>c.status==='active').reduce((s,c)=>s+c.mrr,0)
  return (
    <div style={{flex:1,padding:32,overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div><h1 style={{fontSize:22,fontWeight:900,color:'white',marginBottom:2}}>Clients</h1><p style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>{filtered.length} clients · {fmt(totalMRR)}/mo MRR</p></div>
        <button onClick={onAdd} style={{padding:'9px 18px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>+ Add Client</button>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search clients..." style={{flex:1,minWidth:200,padding:'9px 14px',borderRadius:9,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:'white',fontSize:13,fontFamily:'inherit',outline:'none'}}/>
        <select value={pf} onChange={e=>setPf(e.target.value)} style={{padding:'9px 12px',borderRadius:9,border:'1px solid rgba(255,255,255,0.1)',background:'#10141f',color:'white',fontSize:13,fontFamily:'inherit',outline:'none'}}>
          <option value="all">All Plans</option>{Object.entries(PLANS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={sf} onChange={e=>setSf(e.target.value)} style={{padding:'9px 12px',borderRadius:9,border:'1px solid rgba(255,255,255,0.1)',background:'#10141f',color:'white',fontSize:13,fontFamily:'inherit',outline:'none'}}>
          <option value="all">All Statuses</option>{Object.keys(STATUS_META).map(k=><option key={k} value={k}>{STATUS_META[k as keyof typeof STATUS_META].label}</option>)}
        </select>
      </div>
      <div style={{borderRadius:14,overflow:'hidden',border:'1px solid rgba(255,255,255,0.07)'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead style={{background:'rgba(255,255,255,0.03)'}}><tr>
            {['Client','Plan','Status','MRR','Modules','Users','Last Login',''].map(h=><th key={h} style={th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id} style={{transition:'background 0.1s'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.02)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <td style={td}><div style={{display:'flex',alignItems:'center',gap:10}}><Avatar name={c.name} color={c.avatar} size={32}/><div><div style={{fontWeight:700,color:'white',fontSize:13}}>{c.name}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>{c.email}</div></div></div></td>
                <td style={td}><Pill label={PLANS[c.plan].label} color={PLANS[c.plan].color}/></td>
                <td style={td}><Pill label={STATUS_META[c.status].label} color={STATUS_META[c.status].color}/></td>
                <td style={{...td,fontWeight:700,color:c.status==='active'?'#10b981':'rgba(255,255,255,0.3)'}}>{c.status==='active'?`${fmt(c.mrr)}/mo`:'—'}</td>
                <td style={td}><span style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{c.modules.length} / {ALL_MODULES.length}</span></td>
                <td style={td}>{c.users}</td>
                <td style={td}><span style={{fontSize:12,color:'rgba(255,255,255,0.45)'}}>{fmtDate(c.lastLogin)}</span></td>
                <td style={td}>
                  <div style={{display:'flex',gap:6}}>
                    <button onClick={()=>onEdit(c)} style={{padding:'5px 12px',borderRadius:6,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'rgba(255,255,255,0.6)',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                    <button onClick={()=>{if(window.confirm(`Remove ${c.name}?`))onDelete(c.id)}} style={{padding:'5px 10px',borderRadius:6,border:'1px solid rgba(239,68,68,0.3)',background:'transparent',color:'#f87171',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── SUBSCRIPTIONS ─────────────────────────────────────────────────────────────
export function SubscriptionsView({clients}:{clients:Client[]}) {
  const byPlan=Object.entries(PLANS).map(([k,v])=>{const cs=clients.filter(c=>c.plan===k&&c.status==='active');return{...v,key:k,count:cs.length,mrr:cs.reduce((s,c)=>s+c.mrr,0)}})
  const churnedLast30=clients.filter(c=>c.status==='churned')
  const renewals=[...clients].filter(c=>c.status==='active').sort((a,b)=>a.startDate-b.startDate).slice(0,6)
  return (
    <div style={{flex:1,padding:32,overflowY:'auto'}}>
      <h1 style={{fontSize:22,fontWeight:900,color:'white',marginBottom:6}}>Subscriptions</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:24}}>Plan distribution, renewals & churn</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:28}}>
        {byPlan.map(p=>(
          <div key={p.key} style={{...card,borderTop:`3px solid ${p.color}`}}>
            <div style={{fontSize:13,fontWeight:800,color:p.color,marginBottom:4}}>{p.label}</div>
            <div style={{fontSize:28,fontWeight:900,color:'white',marginBottom:2}}>{p.count}<span style={{fontSize:14,color:'rgba(255,255,255,0.4)',fontWeight:400}}> clients</span></div>
            <div style={{fontSize:14,fontWeight:700,color:'#10b981',marginBottom:6}}>{fmt(p.mrr)}<span style={{fontSize:11,color:'rgba(255,255,255,0.3)',fontWeight:400}}>/mo MRR</span></div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>Up to {p.maxUsers===999?'Unlimited':p.maxUsers} users · R{p.price}/mo/client</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:800,color:'white',marginBottom:14}}>Upcoming Renewals</div>
          {renewals.map(c=>(
            <div key={c.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
              <Avatar name={c.name} color={c.avatar} size={28}/>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'white'}}>{c.name}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.35)'}}>Since {fmtDate(c.startDate)}</div></div>
              <div style={{fontSize:13,fontWeight:700,color:'#10b981'}}>{fmt(c.mrr)}/mo</div>
            </div>
          ))}
        </div>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:800,color:'white',marginBottom:14}}>Churned Clients <span style={{fontSize:12,fontWeight:400,color:'rgba(255,255,255,0.35)'}}>({churnedLast30.length})</span></div>
          {churnedLast30.length===0?<div style={{fontSize:13,color:'rgba(255,255,255,0.3)',textAlign:'center',padding:24}}>No churned clients 🎉</div>:
            churnedLast30.map(c=>(
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                <Avatar name={c.name} color="#94a3b8" size={28}/>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.5)'}}>{c.name}</div><div style={{fontSize:11,color:'rgba(255,255,255,0.25)'}}>{c.industry}</div></div>
                <Pill label="Churned" color="#e2445c"/>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

// ── INVOICES ──────────────────────────────────────────────────────────────────
export function InvoicesView({clients,invoices,onCreateInvoice,onMarkPaid}:{clients:Client[];invoices:Invoice[];onCreateInvoice:()=>void;onMarkPaid:(id:string)=>void}) {
  const [sf,setSf]=useState('all')
  const getClient=(id:string)=>clients.find(c=>c.id===id)
  const filtered=sf==='all'?invoices:invoices.filter(i=>i.status===sf)
  const totalPaid=invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0)
  const totalOverdue=invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0)
  return (
    <div style={{flex:1,padding:32,overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div><h1 style={{fontSize:22,fontWeight:900,color:'white',marginBottom:2}}>Invoices & Payments</h1><p style={{fontSize:12,color:'rgba(255,255,255,0.35)'}}>{invoices.length} invoices total</p></div>
        <button onClick={onCreateInvoice} style={{padding:'9px 18px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'white',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'inherit'}}>+ Create Invoice</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:22}}>
        <Stat label="Total Collected" value={fmtK(totalPaid)} color="#10b981"/>
        <Stat label="Outstanding" value={fmtK(totalOverdue)} color={totalOverdue?'#e2445c':'white'}/>
        <Stat label="Total Invoices" value={invoices.length} sub={`${invoices.filter(i=>i.status==='overdue').length} overdue`}/>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        {['all','paid','pending','overdue','failed'].map(s=>(
          <button key={s} onClick={()=>setSf(s)} style={{padding:'6px 14px',borderRadius:99,border:`1px solid ${sf===s?'#6366f1':'rgba(255,255,255,0.1)'}`,background:sf===s?'rgba(99,102,241,0.15)':'transparent',color:sf===s?'white':'rgba(255,255,255,0.45)',fontSize:12,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>{s}</button>
        ))}
      </div>
      <div style={{borderRadius:14,overflow:'hidden',border:'1px solid rgba(255,255,255,0.07)'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead style={{background:'rgba(255,255,255,0.03)'}}><tr>
            {['Ref','Client','Period','Amount','Status','Due Date',''].map(h=><th key={h} style={th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(inv=>{const c=getClient(inv.clientId);return(
              <tr key={inv.id}>
                <td style={{...td,fontWeight:700,color:'rgba(255,255,255,0.9)',fontFamily:'monospace'}}>{inv.ref}</td>
                <td style={td}>{c?<div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={c.name} color={c.avatar} size={24}/><span style={{fontSize:13}}>{c.name}</span></div>:'—'}</td>
                <td style={td}><span style={{fontSize:12,color:'rgba(255,255,255,0.45)'}}>{inv.period}</span></td>
                <td style={{...td,fontWeight:700}}>{fmt(inv.amount)}</td>
                <td style={td}><Pill label={PAY_META[inv.status].label} color={PAY_META[inv.status].color}/></td>
                <td style={td}><span style={{fontSize:12,color:inv.status==='overdue'?'#e2445c':'rgba(255,255,255,0.45)'}}>{fmtDate(inv.dueDate)}</span></td>
                <td style={td}>{inv.status!=='paid'&&<button onClick={()=>onMarkPaid(inv.id)} style={{padding:'4px 11px',borderRadius:6,border:'1px solid rgba(16,185,129,0.35)',background:'transparent',color:'#10b981',fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Mark Paid</button>}</td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── MODULE USAGE ──────────────────────────────────────────────────────────────
export function ModulesView({clients}:{clients:Client[]}) {
  const active=clients.filter(c=>c.status==='active')
  const mods=ALL_MODULES.map(m=>{const users=active.filter(c=>c.modules.includes(m));return{m,count:users.length,pct:Math.round((users.length/Math.max(active.length,1))*100),mrr:users.reduce((s,c)=>s+c.mrr,0)}}).sort((a,b)=>b.count-a.count)
  return (
    <div style={{flex:1,padding:32,overflowY:'auto'}}>
      <h1 style={{fontSize:22,fontWeight:900,color:'white',marginBottom:6}}>Module Usage</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:24}}>Adoption across {active.length} active clients</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
        {mods.map((mod,i)=>(
          <motion.div key={mod.m} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} style={card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:800,color:'white'}}>{mod.m}</div>
              <div style={{fontSize:20,fontWeight:900,color:'#6366f1'}}>{mod.pct}%</div>
            </div>
            <div style={{height:6,borderRadius:99,background:'rgba(255,255,255,0.06)',marginBottom:8}}>
              <motion.div initial={{width:0}} animate={{width:`${mod.pct}%`}} transition={{delay:i*0.04+0.2,duration:0.6}} style={{height:'100%',borderRadius:99,background:'linear-gradient(90deg,#6366f1,#a78bfa)'}}/>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,0.4)'}}>
              <span>{mod.count} / {active.length} clients</span>
              <span style={{color:'#10b981',fontWeight:600}}>{fmtK(mod.mrr)} MRR</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
export function AnalyticsView({analytics,clients}:{analytics:AnalyticsDay[];clients:Client[]}) {
  const totalVisits=analytics.reduce((s,d)=>s+d.visits,0)
  const totalSignups=analytics.reduce((s,d)=>s+d.signups,0)
  const convRate=((totalSignups/totalVisits)*100).toFixed(2)
  const maxVisits=Math.max(...analytics.map(d=>d.visits))
  const industries=[...new Set(clients.map(c=>c.industry))].map(ind=>({ind,count:clients.filter(c=>c.industry===ind&&c.status==='active').length})).sort((a,b)=>b.count-a.count)
  return (
    <div style={{flex:1,padding:32,overflowY:'auto'}}>
      <h1 style={{fontSize:22,fontWeight:900,color:'white',marginBottom:6}}>Website Analytics</h1>
      <p style={{fontSize:12,color:'rgba(255,255,255,0.35)',marginBottom:24}}>Last 30 days platform performance</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
        <Stat label="Total Visits" value={totalVisits.toLocaleString()} color="#6366f1"/>
        <Stat label="Signups" value={totalSignups} color="#10b981"/>
        <Stat label="Conversion Rate" value={`${convRate}%`} color="#f59e0b"/>
        <Stat label="Avg Daily Visits" value={Math.round(totalVisits/30)} color="#a78bfa"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:800,color:'white',marginBottom:16}}>Daily Traffic — 30 Days</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:3,height:120}}>
            {analytics.map((d,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                <div title={`${d.date}: ${d.visits} visits, ${d.signups} signups`}
                  style={{width:'100%',background:'linear-gradient(180deg,#6366f1,#4f46e5)',borderRadius:'3px 3px 0 0',height:`${(d.visits/maxVisits)*100}%`,opacity:0.7+i/60,cursor:'pointer',transition:'opacity 0.15s'}}/>
                {d.signups>0&&<div style={{width:4,height:4,borderRadius:'50%',background:'#10b981',flexShrink:0}}/>}
              </div>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16,marginTop:10,fontSize:11,color:'rgba(255,255,255,0.3)'}}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:10,height:10,borderRadius:2,background:'#6366f1',display:'inline-block'}}/> Visits</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:6,height:6,borderRadius:'50%',background:'#10b981',display:'inline-block'}}/> Signups</span>
          </div>
        </div>
        <div style={card}>
          <div style={{fontSize:14,fontWeight:800,color:'white',marginBottom:14}}>Clients by Industry</div>
          {industries.map((ind,i)=>(
            <div key={ind.ind} style={{marginBottom:10}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}><span style={{color:'rgba(255,255,255,0.6)'}}>{ind.ind}</span><span style={{color:'white',fontWeight:700}}>{ind.count}</span></div>
              <div style={{height:5,borderRadius:99,background:'rgba(255,255,255,0.05)'}}><div style={{height:'100%',borderRadius:99,background:`hsl(${220+i*25},80%,65%)`,width:`${(ind.count/Math.max(...industries.map(x=>x.count)))*100}%`}}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
