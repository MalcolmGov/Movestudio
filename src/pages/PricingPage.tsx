import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const PLANS = [
  {
    name: 'Starter',
    badge: null,
    price: { monthly: 'R 2 499', annual: 'R 1 999' },
    period: '/mo',
    desc: 'Core business tools for small teams just getting started.',
    color: '#10b981',
    saving: 'Replaces ~R 8 000/mo in tools',
    users: 'Up to 3 users',
    modules: [
      'CRM — contacts, pipeline & deals',
      'Quotes & Invoices',
      'Brand Kit Studio',
      'Website Builder (1 site, Move Studio subdomain)',
      'Social Ad Studio (10 exports/mo)',
      'Email Studio (500 sends/mo)',
      'Analytics dashboard',
    ],
    notIncluded: [
      'Accounting & VAT reporting',
      'Inventory management',
      'Project management',
      'HR & Payroll',
      'Custom domain',
      'White-label',
    ],
    cta: 'Get Started →',
    ctaAction: '/auth',
    ctaStyle: 'outline',
  },
  {
    name: 'Business',
    badge: '✦ Most Popular',
    price: { monthly: 'R 5 999', annual: 'R 4 799' },
    period: '/mo',
    desc: 'The complete Business OS — every module, fully integrated.',
    color: '#6366f1',
    highlight: true,
    saving: 'Replaces ~R 22 000/mo in tools',
    users: 'Up to 15 users',
    modules: [
      'Everything in Starter, plus:',
      'Accounting — P&L, VAT & transactions',
      'Inventory — stock, suppliers & POs',
      'Project Management — boards & timelines',
      'HR & Payroll (SARS-compliant)',
      'Website Builder — custom domain + unlimited sites',
      'Unlimited ad exports & email sends',
      'Full API access',
      'Priority support (8hr response)',
    ],
    notIncluded: [
      'White-label (your branding)',
      'Dedicated account manager',
    ],
    cta: 'Get Started →',
    ctaAction: '/auth',
    ctaStyle: 'solid',
  },
  {
    name: 'Enterprise',
    badge: null,
    price: { monthly: 'R 12 999', annual: 'R 10 399' },
    period: '/mo',
    desc: 'Unlimited scale, white-label, dedicated support & SLA.',
    color: '#a78bfa',
    saving: 'Replaces R 30 000–R 80 000/mo in tools + dev costs',
    users: 'Unlimited users',
    modules: [
      'Everything in Business, plus:',
      'White-label — your brand, your clients',
      'Dedicated Customer Success Manager',
      'Custom integrations & webhooks',
      'SLA — 99.9% uptime guarantee',
      'SAML SSO & advanced permissions',
      'Quarterly business reviews',
      'On-site or virtual onboarding',
    ],
    notIncluded: [],
    cta: 'Contact Sales →',
    ctaAction: 'mailto:hello@movedigital.co.za',
    ctaStyle: 'outline',
  },
]

const FAQS = [
  { q: 'Why is Move Studio priced higher than basic SaaS tools?', a: 'Because it replaces 8–12 separate tools entirely. The Starter plan alone replaces tools that would otherwise cost R8,000+/mo. The Business plan replaces an entire tool stack worth R22,000+/mo — you\'re not buying one tool, you\'re buying an operating system.' },
  { q: 'What\'s the annual billing discount?', a: 'Annual subscribers save 20% vs monthly billing. This is locked in for 12 months and renews automatically unless cancelled.' },
  { q: 'How many users does each plan support?', a: 'Starter supports up to 3 users, Business up to 15, and Enterprise is unlimited. Additional user seats can be purchased on Starter and Business plans.' },
  { q: 'Is the payroll module SARS-compliant?', a: 'Yes — payroll uses the 2024/25 SARS tax tables with primary rebate, UIF calculations and generates payslip exports. We recommend confirming final submissions with a registered tax practitioner.' },
  { q: 'Can non-technical staff really use this?', a: 'Absolutely — that\'s the core design principle. Your ops manager, marketer or admin can launch a production website, run payroll, manage inventory and send invoices without writing a line of code or raising a developer ticket.' },
  { q: 'Can I migrate my existing data?', a: 'Yes — Business and Enterprise plans include an assisted data migration for CRM contacts, accounting records and inventory. Enterprise includes a full white-glove migration.' },
  { q: 'What does onboarding look like?', a: 'All plans include self-service onboarding with full documentation and video walkthroughs. Business plans include a dedicated onboarding call. Enterprise clients receive full white-glove setup and team training.' },
]

const COMPARE = [
  { feature: 'CRM',                   starter: true,  business: true,  enterprise: true  },
  { feature: 'Quotes & Invoices',     starter: true,  business: true,  enterprise: true  },
  { feature: 'Website Builder',       starter: true,  business: true,  enterprise: true  },
  { feature: 'Brand Kit Studio',      starter: true,  business: true,  enterprise: true  },
  { feature: 'Social Ad Studio',      starter: '10/mo', business: true, enterprise: true  },
  { feature: 'Email Studio',          starter: '500/mo', business: true, enterprise: true },
  { feature: 'Accounting & VAT',      starter: false, business: true,  enterprise: true  },
  { feature: 'Inventory Management',  starter: false, business: true,  enterprise: true  },
  { feature: 'Project Management',    starter: false, business: true,  enterprise: true  },
  { feature: 'HR & Payroll',          starter: false, business: true,  enterprise: true  },
  { feature: 'Custom Domain',         starter: false, business: true,  enterprise: true  },
  { feature: 'API Access',            starter: false, business: true,  enterprise: true  },
  { feature: 'White-label',           starter: false, business: false, enterprise: true  },
  { feature: 'Dedicated CSM',         starter: false, business: false, enterprise: true  },
  { feature: 'SLA 99.9% uptime',      starter: false, business: false, enterprise: true  },
  { feature: 'Users',                 starter: '3',   business: '15',  enterprise: '∞'   },
]

const c = (v: boolean | string) => {
  if(v === true)  return { icon: '✓', color: '#10b981' }
  if(v === false) return { icon: '—', color: 'rgba(255,255,255,0.2)' }
  return { icon: v as string, color: '#f59e0b' }
}

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly')
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [showCompare, setShowCompare] = useState(false)
  const navigate = useNavigate()

  return (
    <div style={{ padding:'clamp(40px,8vw,60px) clamp(16px,5vw,48px)', maxWidth:1200, fontFamily:'inherit' }}>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', marginBottom:56 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 16px', borderRadius:99, background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.25)', marginBottom:18, fontSize:12, fontWeight:700, color:'#a78bfa' }}>
          💡 Value-Based Pricing
        </div>
        <h1 style={{ fontSize:'clamp(32px,5vw,56px)', fontWeight:900, letterSpacing:'-0.04em', color:'white', marginBottom:14 }}>
          One OS. <span style={{ background:'linear-gradient(135deg,#6366f1,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Fraction of the cost.</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:16, maxWidth:560, margin:'0 auto 28px', lineHeight:1.7 }}>
          The average Move Studio client was spending R22,000–R30,000/mo across fragmented tools before switching. Our pricing reflects the value delivered — not a race to the bottom.
        </p>
        {/* Billing toggle */}
        <div style={{ display:'inline-flex', background:'rgba(255,255,255,0.05)', borderRadius:10, padding:4, gap:4 }}>
          {(['monthly','annual'] as const).map(b=>(
            <button key={b} onClick={()=>setBilling(b)}
              style={{ padding:'8px 22px', borderRadius:8, border:'none', background:billing===b?'rgba(255,255,255,0.1)':'transparent', color:billing===b?'white':'rgba(255,255,255,0.4)', fontWeight:billing===b?700:400, fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
              {b==='annual'?'Annual — Save 20%':'Monthly'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Plans */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20, marginBottom:40 }}>
        {PLANS.map((plan,i)=>(
          <motion.div key={plan.name} initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
            style={{ borderRadius:22, padding:'34px 30px', border:`1.5px solid ${plan.highlight?plan.color+'60':'rgba(255,255,255,0.09)'}`, background:plan.highlight?`linear-gradient(160deg,${plan.color}12,rgba(139,92,246,0.07))`:'rgba(255,255,255,0.025)', position:'relative', display:'flex', flexDirection:'column' }}>
            {plan.badge&&(
              <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', padding:'4px 16px', borderRadius:99, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', fontSize:11, fontWeight:700, color:'white', whiteSpace:'nowrap' }}>
                {plan.badge}
              </div>
            )}

            {/* Plan name & price */}
            <div style={{ fontSize:13, fontWeight:800, color:plan.color, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>{plan.name}</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:4 }}>
              <span style={{ fontSize:38, fontWeight:900, color:'white', letterSpacing:'-0.04em' }}>{plan.price[billing]}</span>
              <span style={{ fontSize:14, color:'rgba(255,255,255,0.4)' }}>{plan.period}</span>
            </div>
            {billing==='annual'&&(
              <div style={{ fontSize:11, color:'#10b981', marginBottom:4, fontWeight:600 }}>Billed annually — 20% off</div>
            )}
            <div style={{ fontSize:11, fontWeight:700, color:plan.color, background:`${plan.color}15`, border:`1px solid ${plan.color}30`, padding:'3px 10px', borderRadius:99, display:'inline-block', marginBottom:10 }}>{plan.saving}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:6 }}>👥 {plan.users}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:24, lineHeight:1.6 }}>{plan.desc}</div>

            {/* Features */}
            <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px', display:'flex', flexDirection:'column', gap:8, flex:1 }}>
              {plan.modules.map(f=>(
                <li key={f} style={{ display:'flex', gap:8, fontSize:13, color:f.startsWith('Everything')?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.82)', alignItems:'flex-start', fontStyle:f.startsWith('Everything')?'italic':'normal' }}>
                  {!f.startsWith('Everything')&&<span style={{ color:plan.color, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</span>}
                  {f}
                </li>
              ))}
              {plan.notIncluded.map(f=>(
                <li key={f} style={{ display:'flex', gap:8, fontSize:13, color:'rgba(255,255,255,0.22)', alignItems:'flex-start' }}>
                  <span style={{ flexShrink:0, marginTop:1 }}>—</span>{f}
                </li>
              ))}
            </ul>

            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={()=>plan.ctaAction.startsWith('mailto')?window.location.href=plan.ctaAction:navigate(plan.ctaAction)}
              style={{ width:'100%', padding:'14px', borderRadius:11, border:plan.ctaStyle==='solid'?'none':`1.5px solid ${plan.color}50`, background:plan.ctaStyle==='solid'?`linear-gradient(135deg,#6366f1,#8b5cf6)`:'transparent', color:'white', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'inherit', boxShadow:plan.ctaStyle==='solid'?'0 8px 28px rgba(99,102,241,0.4)':'none', marginTop:'auto' }}>
              {plan.cta}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Trust banner */}
      <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
        style={{ padding:'20px 32px', borderRadius:14, background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.18)', display:'flex', alignItems:'center', justifyContent:'center', gap:24, marginBottom:64, flexWrap:'wrap' }}>
        {[{icon:'🔒',label:'Secure payments via Stripe'},{icon:'📞',label:'Dedicated onboarding support'},{icon:'🇿🇦',label:'South Africa-first platform'},{icon:'⚡',label:'Activate in under 5 minutes'}].map(t=>(
          <div key={t.label} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'rgba(255,255,255,0.5)' }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>{t.label}
          </div>
        ))}
      </motion.div>

      {/* Feature comparison table */}
      <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:72 }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <button onClick={()=>setShowCompare(p=>!p)}
            style={{ padding:'10px 24px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            {showCompare?'Hide':'Show'} Full Feature Comparison ↓
          </button>
        </div>
        <AnimatePresence>
          {showCompare&&(
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} style={{ overflow:'hidden' }}>
              <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                {/* Table header */}
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', background:'rgba(255,255,255,0.04)', padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  {['Feature','Starter','Business','Enterprise'].map((h,i)=>(
                    <div key={h} style={{ fontSize:12, fontWeight:800, color:i===0?'rgba(255,255,255,0.5)':i===1?'#10b981':i===2?'#6366f1':'#a78bfa', textTransform:'uppercase', letterSpacing:'0.08em', textAlign:i>0?'center':'left' }}>{h}</div>
                  ))}
                </div>
                {COMPARE.map((row,i)=>{
                  const s=c(row.starter), b=c(row.business), e=c(row.enterprise)
                  return (
                    <div key={row.feature} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                      <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)' }}>{row.feature}</div>
                      {[s,b,e].map((v,j)=>(
                        <div key={j} style={{ textAlign:'center', fontSize:13, fontWeight:v.icon==='—'?400:700, color:v.color }}>{v.icon}</div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FAQs */}
      <div style={{ maxWidth:720, margin:'0 auto 0' }}>
        <h2 style={{ fontSize:28, fontWeight:900, color:'white', letterSpacing:'-0.03em', marginBottom:32, textAlign:'center' }}>Common Questions</h2>
        {FAQS.map((faq,i)=>(
          <div key={i} onClick={()=>setOpenFaq(openFaq===i?null:i)}
            style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'18px 0', cursor:'pointer' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'white' }}>{faq.q}</div>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:20, transform:openFaq===i?'rotate(45deg)':'none', transition:'transform 0.2s', flexShrink:0 }}>+</span>
            </div>
            <AnimatePresence>
              {openFaq===i&&(
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                  style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:12, lineHeight:1.8, overflow:'hidden' }}>
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
