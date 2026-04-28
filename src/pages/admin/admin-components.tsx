import React, { useState } from 'react'
import { Client, Invoice, PlanName, ClientStatus, PLANS, STATUS_META, PAY_META, fmt, fmtDate, ALL_MODULES, uid } from './admin-data'

// ── Shared atoms ────────────────────────────────────────────────────────────
export const Pill = ({ label, color }: { label:string; color:string }) => (
  <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:99, background:`${color}20`, border:`1px solid ${color}40`, color }}>{label}</span>
)
export const Stat = ({ label, value, sub, color='white' }: { label:string; value:string|number; sub?:string; color?:string }) => (
  <div style={{ padding:'22px 24px', borderRadius:14, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}>
    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>{label}</div>
    <div style={{ fontSize:28, fontWeight:900, color, letterSpacing:'-0.03em', marginBottom:sub?4:0 }}>{value}</div>
    {sub&&<div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{sub}</div>}
  </div>
)
export const Avatar = ({ name, color, size=32 }: { name:string; color:string; size?:number }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}25`, border:`2px solid ${color}60`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.38, fontWeight:800, color, flexShrink:0 }}>
    {name.split(' ').map(w=>w[0]).slice(0,2).join('')}
  </div>
)

// ── Client Modal ─────────────────────────────────────────────────────────────
export function ClientModal({ existing, onClose, onSave }: { existing?:Client; onClose:()=>void; onSave:(c:Client)=>void }) {
  const [f, setF] = useState<Client>(existing || {
    id:uid(), name:'', contactName:'', email:'', phone:'', plan:'starter', status:'active',
    mrr:PLANS.starter.price, startDate:Date.now(), lastLogin:Date.now(), website:'', industry:'',
    modules:['CRM','Website Builder'], users:1, avatar:'#6366f1',
  })
  const colors = ['#10b981','#6366f1','#ec4899','#f59e0b','#3b82f6','#a78bfa','#34d399','#f87171','#67e8f9','#fb923c']
  const set = (k:keyof Client, v:any) => setF(p=>({ ...p, [k]:v, ...(k==='plan'?{mrr:PLANS[v as PlanName].price}:{}) }))
  const toggleModule = (m:string) => setF(p=>({ ...p, modules:p.modules.includes(m)?p.modules.filter(x=>x!==m):[...p.modules,m] }))

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:20 }}>
      <div style={{ width:'100%', maxWidth:620, background:'#10141f', borderRadius:20, border:'1px solid rgba(255,255,255,0.1)', overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:16, fontWeight:800, color:'white' }}>{existing?'Edit Client':'Add Client'}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:20 }}>✕</button>
        </div>
        <div style={{ padding:'24px', display:'flex', flexDirection:'column', gap:14, maxHeight:'70vh', overflowY:'auto' }}>
          {([['Company Name','name'],['Contact Name','contactName'],['Email','email'],['Phone','phone'],['Website','website'],['Industry','industry']] as [string,keyof Client][]).map(([label,key])=>(
            <div key={key}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>{label}</div>
              <input value={String(f[key]||'')} onChange={e=>set(key,e.target.value)}
                style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'white', fontSize:13, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}/>
            </div>
          ))}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>Plan</div>
              <select value={f.plan} onChange={e=>set('plan',e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'#10141f', color:'white', fontSize:13, fontFamily:'inherit', outline:'none' }}>
                {Object.entries(PLANS).map(([k,v])=><option key={k} value={k}>{v.label} — R{v.price}/mo</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>Status</div>
              <select value={f.status} onChange={e=>set('status',e.target.value as ClientStatus)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'#10141f', color:'white', fontSize:13, fontFamily:'inherit', outline:'none' }}>
                {Object.entries(STATUS_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Avatar Colour</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {colors.map(c=>(
                <div key={c} onClick={()=>set('avatar',c)} style={{ width:24, height:24, borderRadius:'50%', background:c, cursor:'pointer', border:f.avatar===c?`3px solid white`:'3px solid transparent' }}/>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Active Modules</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {ALL_MODULES.map(m=>(
                <button key={m} onClick={()=>toggleModule(m)} style={{ padding:'5px 12px', borderRadius:99, border:`1px solid ${f.modules.includes(m)?'#6366f1':'rgba(255,255,255,0.1)'}`, background:f.modules.includes(m)?'rgba(99,102,241,0.15)':'transparent', color:f.modules.includes(m)?'white':'rgba(255,255,255,0.4)', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'9px 20px', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>Cancel</button>
          <button onClick={()=>{ if(f.name&&f.email) onSave(f) }} style={{ padding:'9px 24px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>
            {existing?'Save Changes':'Add Client'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Invoice Modal ─────────────────────────────────────────────────────────────
export function InvoiceModal({ clients, onClose, onSave }: { clients:Client[]; onClose:()=>void; onSave:(inv:Invoice)=>void }) {
  const [clientId, setClientId] = useState(clients[0]?.id||'')
  const client = clients.find(c=>c.id===clientId)
  const now = Date.now()
  const inv: Invoice = { id:uid(), clientId, amount:client?.mrr||2499, status:'pending', issueDate:now, dueDate:now+7*86400000, ref:`INV-${Math.floor(Math.random()*90000+10000)}`, period:'Apr 2026' }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
      <div style={{ width:400, background:'#10141f', borderRadius:18, border:'1px solid rgba(255,255,255,0.1)', overflow:'hidden' }}>
        <div style={{ padding:'18px 22px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between' }}>
          <div style={{ fontWeight:800, color:'white' }}>Create Invoice</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>
        <div style={{ padding:22, display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>Client</div>
            <select value={clientId} onChange={e=>setClientId(e.target.value)} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'#10141f', color:'white', fontSize:13, outline:'none', fontFamily:'inherit' }}>
              {clients.filter(c=>c.status!=='churned').map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {client&&<div style={{ padding:'14px', borderRadius:10, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', fontSize:13, color:'rgba(255,255,255,0.7)' }}>
            <div style={{ fontWeight:700, color:'white', marginBottom:4 }}>{client.name}</div>
            <div>Plan: {PLANS[client.plan].label} · Amount: {fmt(client.mrr)}/mo</div>
          </div>}
        </div>
        <div style={{ padding:'14px 22px', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'9px 18px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>Cancel</button>
          <button onClick={()=>onSave(inv)} style={{ padding:'9px 22px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:700, cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>Create Invoice</button>
        </div>
      </div>
    </div>
  )
}
