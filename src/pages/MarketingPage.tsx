import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const COSTS = [
  { tool:'CRM Software', cost:'R 2 400/mo' },
  { tool:'Accounting & Invoicing', cost:'R 1 800/mo' },
  { tool:'Project Management', cost:'R 1 200/mo' },
  { tool:'HR & Payroll System', cost:'R 2 000/mo' },
  { tool:'Inventory Management', cost:'R 1 500/mo' },
  { tool:'Website + Hosting', cost:'R 3 000/mo' },
  { tool:'Email Marketing Tool', cost:'R 800/mo' },
  { tool:'Ad Creative Tools', cost:'R 600/mo' },
  { tool:'Developer Support', cost:'R 8 000/mo' },
  { tool:'IT Maintenance', cost:'R 3 500/mo' },
]

const STATS = [
  { value:'R 25 000+', label:'Saved per month vs. separate tools', color:'#10b981' },
  { value:'10+', label:'Fragmented systems replaced', color:'#6366f1' },
  { value:'< 60s', label:'To deploy a production website', color:'#f59e0b' },
  { value:'0', label:'Developers needed', color:'#ec4899' },
]

const PAINS = [
  { pain:'Paying R15k–R30k/mo across 10+ SaaS subscriptions', fix:'One flat monthly subscription — everything included' },
  { pain:'Spending R50k–R200k/year on developers to maintain systems', fix:'No-code, non-technical team can manage everything' },
  { pain:'Data stuck in silos — CRM doesn\'t talk to accounting', fix:'Fully integrated — one source of truth across all modules' },
  { pain:'3-week wait every time you need a new page or feature', fix:'Launch a branded website or campaign page in under 60 seconds' },
  { pain:'Dedicated IT support costs eating your margin', fix:'Zero maintenance — we host, update and support everything' },
  { pain:'New staff take weeks to learn multiple disconnected tools', fix:'One platform, one login — onboard your team in an afternoon' },
]

const MODULES = [
  { icon:'👥', name:'CRM',              color:'#10b981', desc:'Pipeline, contacts & deals' },
  { icon:'📊', name:'Accounting',       color:'#10b981', desc:'P&L, VAT & transactions' },
  { icon:'🧾', name:'Quotes & Invoices',color:'#10b981', desc:'Branded docs & payments' },
  { icon:'📦', name:'Inventory',        color:'#f59e0b', desc:'Stock & supplier management' },
  { icon:'📋', name:'Projects',         color:'#f59e0b', desc:'Tasks, boards & timelines' },
  { icon:'🧑‍💼', name:'HR & Payroll',    color:'#f59e0b', desc:'SARS-compliant payroll & leave' },
  { icon:'🌐', name:'Website Builder',  color:'#6366f1', desc:'No-code, deploy in 60 seconds' },
  { icon:'❖',  name:'Brand Kit Studio', color:'#ec4899', desc:'Colours, fonts & logos' },
  { icon:'📣', name:'Social Ad Studio', color:'#ec4899', desc:'AI ad creatives, every platform' },
  { icon:'🤖', name:'Agent Skills',     color:'#a78bfa', desc:'AI agents for ops & support' },
  { icon:'📈', name:'Analytics',        color:'#a78bfa', desc:'KPIs & performance insights' },
  { icon:'✉️', name:'Email Studio',     color:'#ec4899', desc:'Drag-drop campaigns & sends' },
]

const TESTIMONIALS = [
  { name:'Thandi Mokoena', role:'CEO', company:'Nexus Retail Group', avatar:'TM', color:'#10b981', quote:'We replaced 9 different tools with Move Studio. Our monthly software bill dropped from R28,000 to R1,200. And our team actually uses it.' },
  { name:'Riyaad Cassiem', role:'Founder', company:'SwiftPay Africa', avatar:'RC', color:'#6366f1', quote:'Our non-technical ops manager launched three product pages last week — no developer, no agency. We used to wait 6 weeks for that.' },
  { name:'Ayesha Dlamini', role:'COO', company:'Luminary Health', avatar:'AD', color:'#ec4899', quote:'The integration is the game-changer. When a quote becomes an invoice, it hits accounting automatically. We lost 4 hours a day to manual admin. That\'s gone.' },
]

export default function MarketingPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const totalCost = COSTS.reduce((s,c)=>s+parseInt(c.cost.replace(/[^0-9]/g,'')),0)

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault(); if(!email) return
    setSubmitted(true); setTimeout(()=>navigate('/auth'),1200)
  }

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", color:'white', overflowX:'hidden', background:'#060911' }}>

      {/* NAV */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'14px clamp(16px,4vw,48px)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(6,9,17,0.9)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <span style={{ fontSize:18, fontWeight:900, background:'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Move Studio</span>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontWeight:600, marginLeft:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>Business OS</span>
        </div>
        <div className="mkt-nav-links" style={{ display:'flex', gap:8 }}>
          <button onClick={()=>navigate('/pricing')} style={{ padding:'8px 18px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontFamily:'inherit', fontSize:13 }}>Pricing</button>
          <button onClick={()=>navigate('/auth')} style={{ padding:'8px 20px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:700 }}>Get Started →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'clamp(100px,14vw,140px) clamp(16px,5vw,24px) 80px', background:'radial-gradient(ellipse at 30% 40%,rgba(99,102,241,0.2) 0%,transparent 60%),radial-gradient(ellipse at 75% 50%,rgba(167,139,250,0.15) 0%,transparent 55%),#060911', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)', backgroundSize:'48px 48px' }}/>
        <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} style={{ maxWidth:900, position:'relative', zIndex:1 }}>
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 20px', borderRadius:99, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.3)', marginBottom:32, fontSize:13, color:'#a78bfa', fontWeight:700 }}>
            ⬡ The Business Operating System for modern companies
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ fontSize:'clamp(44px,7vw,92px)', fontWeight:900, letterSpacing:'-0.05em', lineHeight:0.95, marginBottom:32 }}>
            Stop running your business<br/>
            <span style={{ background:'linear-gradient(135deg,#6366f1,#a78bfa,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>on 12 broken tools.</span>
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            style={{ fontSize:20, color:'rgba(255,255,255,0.55)', lineHeight:1.75, marginBottom:20, maxWidth:680, margin:'0 auto 20px' }}>
            Move Studio is the all-in-one Business OS — CRM, accounting, inventory, HR, payroll, project management, website builder and marketing tools. One platform. One subscription. Zero fragmentation.
          </motion.p>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            style={{ fontSize:15, color:'rgba(255,255,255,0.35)', marginBottom:48 }}>
            Non-technical teams launch production websites in under 60 seconds. No developers. No agencies. No waiting.
          </motion.p>
          <motion.form onSubmit={handleSubmit} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:14 }}>
            <input type="email" placeholder="your@company.com" value={email} onChange={e=>setEmail(e.target.value)}
              style={{ padding:'15px 22px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'white', fontSize:15, fontFamily:'inherit', outline:'none', width:'min(300px,100%)' }}/>
            <motion.button type="submit" whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
              style={{ padding:'15px 32px', borderRadius:10, border:'none', background:submitted?'#10b981':'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 8px 32px rgba(99,102,241,0.45)' }}>
              {submitted?'✓ See you inside!':'Start Free — No Card Needed →'}
            </motion.button>
          </motion.form>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>No contracts · Cancel anytime · Annual discount available</div>
        </motion.div>
        <motion.div animate={{ y:[0,-28,0] }} transition={{ duration:7, repeat:Infinity }}
          style={{ position:'absolute', top:'12%', left:'5%', width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)', pointerEvents:'none' }}/>
        <motion.div animate={{ y:[0,22,0] }} transition={{ duration:9, repeat:Infinity }}
          style={{ position:'absolute', bottom:'8%', right:'4%', width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.15),transparent 70%)', pointerEvents:'none' }}/>
      </section>

      {/* STATS */}
      <section style={{ padding:'clamp(48px,8vw,80px) clamp(16px,5vw,48px)', background:'#080b14', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:24 }}>
          {STATS.map((s,i)=>(
            <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
              style={{ textAlign:'center', padding:'32px 20px', borderRadius:18, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:s.color, marginBottom:10 }}>{s.value}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COST CALCULATOR */}
      <section style={{ padding:'clamp(60px,10vw,100px) clamp(16px,5vw,48px)', background:'#060911' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:60 }}>
            <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:900, letterSpacing:'-0.04em', marginBottom:14 }}>
              What you're <span style={{ background:'linear-gradient(135deg,#f87171,#ec4899)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>actually paying</span> right now
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', maxWidth:520, margin:'0 auto' }}>Add up every tool subscription, developer invoice and IT support contract. The number is shocking.</p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10, marginBottom:24 }}>
            {COSTS.map((c,i)=>(
              <motion.div key={i} initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.05 }}
                style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 18px', borderRadius:10, background:'rgba(248,113,113,0.05)', border:'1px solid rgba(248,113,113,0.12)' }}>
                <span style={{ fontSize:14, color:'rgba(255,255,255,0.6)' }}>{c.tool}</span>
                <span style={{ fontSize:14, fontWeight:700, color:'#f87171' }}>{c.cost}</span>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            style={{ padding:'clamp(18px,3vw,28px) clamp(16px,3vw,32px)', borderRadius:16, background:'rgba(248,113,113,0.08)', border:'2px solid rgba(248,113,113,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, marginBottom:20 }}>
            <div style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.8)' }}>💸 Estimated total monthly cost</div>
            <div style={{ fontSize:32, fontWeight:900, color:'#f87171' }}>R {totalCost.toLocaleString('en-ZA')}/mo</div>
          </motion.div>
          <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:0.2 }}
            style={{ padding:'28px 32px', borderRadius:16, background:'rgba(16,185,129,0.08)', border:'2px solid rgba(16,185,129,0.25)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:'#10b981' }}>✦ Move Studio Business OS</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4 }}>Everything included. One login. No surprises.</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:32, fontWeight:900, color:'#10b981' }}>From R 2 499/mo</div>
              <div style={{ fontSize:12, color:'rgba(16,185,129,0.7)', marginTop:2 }}>Save R {(totalCost-2499).toLocaleString('en-ZA')}+ every month</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PAIN / SOLUTION */}
      <section style={{ padding:'clamp(60px,10vw,100px) clamp(16px,5vw,48px)', background:'#080b14' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:64 }}>
            <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:900, letterSpacing:'-0.04em', marginBottom:14 }}>Built for the way business <span style={{ background:'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>actually works</span></h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', maxWidth:500, margin:'0 auto' }}>Every pain point on the left is a reason your business isn't moving as fast as it should be.</p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'#f87171', marginBottom:12 }}>❌ Without Move Studio</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {PAINS.map((p,i)=>(
                  <motion.div key={i} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                    style={{ padding:'15px 18px', borderRadius:12, background:'rgba(248,113,113,0.05)', border:'1px solid rgba(248,113,113,0.13)', fontSize:14, color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'flex-start', gap:10 }}>
                    <span style={{ color:'#f87171', flexShrink:0, marginTop:1 }}>✕</span>{p.pain}
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em', color:'#10b981', marginBottom:12 }}>✓ With Move Studio</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {PAINS.map((p,i)=>(
                  <motion.div key={i} initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                    style={{ padding:'15px 18px', borderRadius:12, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.18)', fontSize:14, color:'rgba(255,255,255,0.85)', display:'flex', alignItems:'flex-start', gap:10 }}>
                    <span style={{ color:'#10b981', flexShrink:0, marginTop:1 }}>✓</span>{p.fix}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULE GRID */}
      <section style={{ padding:'clamp(60px,10vw,100px) clamp(16px,5vw,48px)', background:'#060911' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:64 }}>
            <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:900, letterSpacing:'-0.04em', marginBottom:14 }}>
              12 tools. <span style={{ background:'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>One subscription.</span>
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', maxWidth:500, margin:'0 auto' }}>Every module works independently or as part of a fully integrated operating system. Your choice.</p>
          </motion.div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
            {MODULES.map((m,i)=>(
              <motion.div key={m.name} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.05 }}
                whileHover={{ y:-4, borderColor:`${m.color}50` }}
                style={{ padding:'22px', borderRadius:14, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', cursor:'pointer', transition:'all 0.2s', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-20, right:-20, width:70, height:70, borderRadius:'50%', background:`${m.color}12`, filter:'blur(18px)' }}/>
                <div style={{ fontSize:24, marginBottom:10 }}>{m.icon}</div>
                <div style={{ fontSize:14, fontWeight:800, color:'white', marginBottom:4 }}>{m.name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>{m.desc}</div>
                <div style={{ position:'absolute', bottom:10, right:12, width:6, height:6, borderRadius:'50%', background:m.color }}/>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:'clamp(60px,10vw,100px) clamp(16px,5vw,48px)', background:'#080b14' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <motion.h2 initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            style={{ textAlign:'center', fontSize:'clamp(28px,4vw,48px)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:60 }}>
            Real businesses. Real results.
          </motion.h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {TESTIMONIALS.map((t,i)=>(
              <motion.div key={i} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.12 }}
                style={{ padding:'32px', borderRadius:20, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)', borderTop:`3px solid ${t.color}` }}>
                <div style={{ color:'#f59e0b', fontSize:14, marginBottom:18, letterSpacing:2 }}>★★★★★</div>
                <p style={{ fontSize:15, color:'rgba(255,255,255,0.72)', lineHeight:1.8, marginBottom:24, fontStyle:'italic' }}>"{t.quote}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:'50%', background:`${t.color}25`, border:`2px solid ${t.color}60`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:t.color }}>{t.avatar}</div>
                  <div><div style={{ fontWeight:700, color:'white', fontSize:14 }}>{t.name}</div><div style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{t.role} · {t.company}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'clamp(60px,10vw,100px) clamp(16px,5vw,48px)', background:'radial-gradient(ellipse at 50% 50%,rgba(99,102,241,0.18) 0%,transparent 70%),#060911', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth:720, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:99, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', fontSize:12, color:'#34d399', fontWeight:700, marginBottom:20 }}>
            From R 2 499/mo · Replaces R 22 000/mo in fragmented tools
          </div>
          <h2 style={{ fontSize:'clamp(30px,5vw,58px)', fontWeight:900, letterSpacing:'-0.04em', marginBottom:20 }}>
            Your entire business.<br/>
            <span style={{ background:'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>One operating system.</span>
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.45)', marginBottom:44, lineHeight:1.7 }}>
            Join hundreds of South African businesses that replaced their fragmented tool stack with Move Studio. Start free — upgrade when you're ready.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} onClick={()=>navigate('/auth')}
              style={{ padding:'17px 40px', borderRadius:99, border:'none', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'white', fontWeight:800, fontSize:17, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 12px 40px rgba(99,102,241,0.45)' }}>
              Start Free Today →
            </motion.button>
            <motion.button whileHover={{ scale:1.03 }} onClick={()=>navigate('/pricing')}
              style={{ padding:'17px 32px', borderRadius:99, border:'1.5px solid rgba(255,255,255,0.15)', background:'transparent', color:'rgba(255,255,255,0.8)', fontWeight:700, fontSize:16, cursor:'pointer', fontFamily:'inherit' }}>
              See Pricing
            </motion.button>
          </div>
          <div style={{ marginTop:20, fontSize:13, color:'rgba(255,255,255,0.25)' }}>Annual discount available · Onboarding support included</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding:'48px', background:'#040608', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, background:'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:4 }}>Move Studio</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>Business Operating System · by Move Digital</div>
          </div>
          <div style={{ display:'flex', gap:24 }}>
            {['Pricing','Dashboard','Brand Studio'].map(l=>(
              <button key={l} onClick={()=>navigate(`/${l.toLowerCase().replace(' ','-')}`)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>{l}</button>
            ))}
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.18)' }}>© 2026 Move Digital (Pty) Ltd. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
