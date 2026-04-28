import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BrandKit } from '../../types'
import type { AssetType } from '../../pages/BrandAssetsPage'

/* ── Inject keyframes once ───────────────────────────────── */
const CSS = `
@keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-60px) scale(1.08)} 66%{transform:translate(-30px,30px) scale(0.94)} }
@keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,40px) scale(1.05)} 66%{transform:translate(30px,-50px) scale(0.92)} }
@keyframes float3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-40px) scale(1.1)} }
@keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes grid-fade-in { from{opacity:0;transform:perspective(600px) rotateX(28deg) translateY(30px)} to{opacity:1;transform:perspective(600px) rotateX(22deg) translateY(0)} }
@keyframes hero-pulse { 0%,100%{opacity:0.55} 50%{opacity:0.85} }
.ms-search::placeholder { color:rgba(255,255,255,0.28); }
.ms-search:focus { border-color: rgba(129,140,248,0.4) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.18); }
.tool-card:hover { transform: translateY(-6px) scale(1.01); }
.format-card:hover { transform: translateY(-8px) scale(1.03); }
.tool-card, .format-card { transition: transform 0.28s cubic-bezier(.34,1.56,.64,1), box-shadow 0.28s ease, border-color 0.2s; }
.cta-btn:hover { opacity: 0.88; transform: translateY(-1px); }
.cta-btn { transition: opacity 0.18s, transform 0.18s; }
`

// ── Fixed hero gradient palette (always indigo → pink) ───────
const H = {
  a: '#6366f1',   // indigo-500
  b: '#818cf8',   // indigo-400
  c: '#f472b6',   // pink-400
  d: '#ec4899',   // pink-500
  grad: 'linear-gradient(135deg,#6366f1,#818cf8 40%,#f472b6 80%,#ec4899)',
  gradH: 'linear-gradient(90deg,#6366f1,#f472b6)',
}

const TOOLS = [
  { id:'website-builder', icon:'🌐', label:'Website Builder',   desc:'Drag-and-drop pages, live preview & one-click export.',             badge:null,      color:'#818cf8', path:'/website-builder' },
  { id:'brand-kit',       icon:'🎨', label:'Brand Kit Studio',  desc:'Colours, fonts, logos — auto-applied everywhere.',                  badge:'Core',    color:'#f472b6', path:'/brand-studio'    },
  { id:'ad-studio',       icon:'📣', label:'Social Ad Studio',  desc:'Generate paid-ad creatives for every platform in seconds.',         badge:null,      color:'#fb923c', path:'/ad-studio'       },
  { id:'email-studio',    icon:'✉️',  label:'Email Studio',      desc:'Beautiful newsletters and transactional templates.',                badge:null,      color:'#34d399', path:'/email-studio'    },
  { id:'quotes-invoices', icon:'🧾', label:'Quotes & Invoices', desc:'Full billing suite — customers, invoices, quotes, payments & reports.',     badge:'New',     color:'#f59e0b', path:'/billing' },
  { id:'ai-copy',         icon:'✦',  label:'AI Copywriter',     desc:'Industry-tuned headlines, taglines & CTAs — built into every tool.',badge:'Built-in',color:'#a78bfa', path:null               },
  { id:'team',            icon:'👥', label:'Team',              desc:'Manage users, roles and brand access across your org.',             badge:null,      color:'#38bdf8', path:'/team'            },
]

const FORMATS: {id:AssetType;label:string;desc:string;aspect:number;color:string;icon:string}[] = [
  { id:'business-card', label:'Business Card',  desc:'90 × 55 mm',   aspect:1.63, color:'#818cf8', icon:'🪪'  },
  { id:'social-banner', label:'Social Banner',  desc:'1200 × 628',  aspect:1.91, color:'#38bdf8', icon:'📢'  },
  { id:'instagram',     label:'Instagram Post', desc:'1080 × 1080', aspect:1,    color:'#f472b6', icon:'📸'  },
  { id:'email-header',  label:'Email Header',   desc:'600 × 200',   aspect:3,    color:'#fb923c', icon:'✉️'   },
  { id:'flyer',         label:'Flyer',          desc:'A4 Portrait',  aspect:0.71, color:'#34d399', icon:'📄'  },
  { id:'poster',        label:'Poster',         desc:'A3 Portrait',  aspect:0.71, color:'#a78bfa', icon:'🖼'  },
]

interface Props {
  kit: BrandKit
  recentDesigns:{id:string;asset:AssetType;company:string;ts:number}[]
  onSelect:(a:AssetType)=>void
  onOpenRecent:(id:string)=>void
}

export default function BrandAssetsHome({ kit, recentDesigns, onSelect, onOpenRecent }:Props) {
  const nav = useNavigate()
  const [query, setQuery] = React.useState('')
  const styleRef = useRef<HTMLStyleElement|null>(null)

  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement('style')
      el.textContent = CSS
      document.head.appendChild(el)
      styleRef.current = el
    }
    return () => { styleRef.current?.remove(); styleRef.current = null }
  }, [])

  const fmts  = FORMATS.filter(f => f.label.toLowerCase().includes(query.toLowerCase()))
  const tools = TOOLS.filter(t => t.label.toLowerCase().includes(query.toLowerCase()))

  const fadeUp = (i:number) => ({
    initial:{ opacity:0, y:24 },
    animate:{ opacity:1, y:0 },
    transition:{ duration:0.5, delay:i*0.07, ease:[0.22,1,0.36,1] as any }
  })

  return (
    <div style={{ minHeight:'100%', background:'#04060a', color:'white', fontFamily:'inherit', position:'relative' }}>

      {/* ── Animated background orbs ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
        {/* Fixed indigo glow top-left */}
        <div style={{ position:'absolute', width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.14) 0%,transparent 70%)', top:'-15%', left:'-10%', animation:'float1 18s ease-in-out infinite' }} />
        {/* Fixed pink glow top-right */}
        <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(244,114,182,0.10) 0%,transparent 70%)', top:'10%', right:'-5%', animation:'float2 22s ease-in-out infinite' }} />
        {/* Brand kit accent glow bottom */}
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle,${kit.accent}0e 0%,transparent 70%)`, bottom:'5%', left:'30%', animation:'float3 16s ease-in-out infinite' }} />
        {/* Center hero glow — indigo bloom */}
        <div style={{ position:'absolute', width:900, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(99,102,241,0.08) 0%,transparent 65%)', top:'5%', left:'50%', transform:'translateX(-50%)', animation:'hero-pulse 6s ease-in-out infinite' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#04060a00 0%,#04060a 70%)' }} />
      </div>

      {/* ── Hero ── */}
      <div style={{ position:'relative', zIndex:1, padding:'80px 56px 64px', textAlign:'center', overflow:'hidden', minHeight:420 }}>

        {/* Perspective grid — anchored to BOTTOM half only so heading stays clear */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'55%', overflow:'hidden', pointerEvents:'none' }}>
          {/* Main grid plane — indigo tinted */}
          <div style={{
            position:'absolute', bottom:0, left:'-20%', right:'-20%', height:'200%',
            backgroundImage:[
              'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
              'linear-gradient(rgba(129,140,248,0.45) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(129,140,248,0.45) 1px, transparent 1px)',
            ].join(','),
            backgroundSize:'60px 60px',
            transform:'perspective(500px) rotateX(42deg)',
            transformOrigin:'50% 100%',
            animation:'grid-fade-in 1.2s cubic-bezier(0.22,1,0.36,1) both',
          }} />
          {/* Sub-grid for depth */}
          <div style={{
            position:'absolute', bottom:0, left:'-20%', right:'-20%', height:'200%',
            backgroundImage:[
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            ].join(','),
            backgroundSize:'20px 20px',
            transform:'perspective(500px) rotateX(42deg)',
            transformOrigin:'50% 100%',
          }} />
          {/* Fade top edge of grid into hero */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'40%', background:'linear-gradient(180deg,#04060a 0%,transparent 100%)' }} />
          {/* Fade left/right edges */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,#04060a 0%,transparent 15%,transparent 85%,#04060a 100%)' }} />
          {/* Horizon glow — indigo → pink */}
          <div style={{
            position:'absolute', top:'30%', left:'5%', right:'5%', height:2,
            background:`linear-gradient(90deg,transparent,${H.a}ee 25%,${H.c} 50%,${H.a}ee 75%,transparent)`,
            filter:'blur(2px)', boxShadow:`0 0 24px ${H.a}90`,
          }} />
          <div style={{
            position:'absolute', top:'32%', left:'15%', right:'15%', height:10,
            background:`linear-gradient(90deg,transparent,${H.a}40 30%,${H.c}60 50%,${H.a}40 70%,transparent)`,
            filter:'blur(8px)',
          }} />
        </div>

        {/* Hero text content — sits above grid */}
        <div style={{ position:'relative', zIndex:2 }}>
          <motion.div {...fadeUp(0)}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:99, border:'1px solid rgba(129,140,248,0.22)', background:'rgba(99,102,241,0.1)', backdropFilter:'blur(12px)', marginBottom:28 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:H.grad, boxShadow:`0 0 10px ${H.a}` }} />
              <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Move Studio — All Tools</span>
            </div>
          </motion.div>

          <motion.h1 {...fadeUp(1)} style={{ fontSize:'clamp(38px,6vw,76px)', fontWeight:900, letterSpacing:'-0.04em', lineHeight:1.05, margin:'0 0 20px', color:'white',
            textShadow:`0 0 80px rgba(99,102,241,0.35)` }}>
            Build stunning UIs<br />
            <span style={{ background:H.grad, backgroundSize:'200% 200%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 4s ease infinite' }}>faster than ever</span>
          </motion.h1>

        <motion.p {...fadeUp(2)} style={{ fontSize:17, color:'rgba(255,255,255,0.42)', maxWidth:520, margin:'0 auto 36px', lineHeight:1.7 }}>
          A comprehensive collection of branded design tools. Copy. Paste. Ship. Built for Move Digital clients.
        </motion.p>

        {/* CTA buttons */}
        <motion.div {...fadeUp(3)} style={{ display:'flex', gap:14, justifyContent:'center', alignItems:'center', marginBottom:40, flexWrap:'wrap' }}>
          <button className="cta-btn" onClick={() => nav('/move-studio')}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 28px', borderRadius:99, border:'none', background:H.grad, color:'white', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:`0 4px 24px rgba(99,102,241,0.35)` }}>
            <span style={{ fontSize:16 }}>✦</span> Browse Tools →
          </button>
          <button className="cta-btn" onClick={() => nav('/brand-studio')}
            style={{ padding:'13px 24px', borderRadius:99, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.75)', fontWeight:600, fontSize:14, cursor:'pointer', backdropFilter:'blur(12px)' }}>
            ☆ Brand Kit
          </button>
        </motion.div>

        {/* Search */}
        <motion.div {...fadeUp(4)} style={{ maxWidth:540, margin:'0 auto', position:'relative' }}>
          <div style={{ position:'absolute', left:20, top:'50%', transform:'translateY(-50%)', fontSize:18, opacity:0.3 }}>⌕</div>
          <input className="ms-search" value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Search tools and formats…"
            style={{ width:'100%', padding:'16px 20px 16px 50px', borderRadius:99, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', color:'white', fontSize:15, outline:'none', boxSizing:'border-box', transition:'border-color 0.2s, box-shadow 0.2s' }} />
        </motion.div>

        {/* Stats row */}
        <motion.div {...fadeUp(5)} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:40, marginTop:40, flexWrap:'wrap' }}>
          {[['6', 'Studio Tools'],['6', 'Asset Formats'],['24', 'Templates'],['∞', 'Brand Kits']].map(([n,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:900, background:H.grad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{n}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </motion.div>
        </div>{/* end z-index:2 text wrapper */}
      </div>{/* end hero */}

      {/* ── Content ── */}
      <div style={{ position:'relative', zIndex:1, padding:'0 56px 80px', maxWidth:1260, margin:'0 auto' }}>

        {/* ── Studio Tools ── */}
        {tools.length > 0 && (
          <section style={{ marginBottom:64 }}>
            <motion.div {...fadeUp(5)} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <div style={{ height:2, flex:0, width:32, background:`linear-gradient(90deg,${H.a},${H.c})`, borderRadius:99 }} />
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Studio Tools</div>
              <div style={{ height:1, flex:1, background:'rgba(255,255,255,0.06)' }} />
            </motion.div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
              {tools.map((t,i)=>(
                <motion.div key={t.id} {...fadeUp(6+i)}>
                  <div className="tool-card"
                    onClick={()=>t.path?nav(t.path):undefined}
                    style={{ background:'linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))', border:'1px solid rgba(255,255,255,0.09)', borderRadius:20, padding:'24px 22px', display:'flex', flexDirection:'column', gap:16, cursor:t.path?'pointer':'default', backdropFilter:'blur(16px)', position:'relative', overflow:'hidden', boxShadow:`0 1px 0 rgba(255,255,255,0.07) inset` }}>
                    {/* Top colour line */}
                    <div style={{ position:'absolute', top:0, left:24, right:24, height:2, borderRadius:99, background:`linear-gradient(90deg,${t.color},${t.color}00)` }} />
                    {/* Bg glow */}
                    <div style={{ position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:'50%', background:`${t.color}14`, pointerEvents:'none' }} />
                    {/* Icon */}
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                      <div style={{ width:50, height:50, borderRadius:14, background:`linear-gradient(135deg,${t.color}30,${t.color}18)`, border:`1px solid ${t.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, boxShadow:`0 4px 16px ${t.color}28` }}>
                        {t.icon}
                      </div>
                      {t.badge && <div style={{ fontSize:9, padding:'3px 8px', borderRadius:5, background:`${t.color}25`, color:t.color, fontWeight:800, letterSpacing:'0.06em', border:`1px solid ${t.color}30` }}>{t.badge}</div>}
                    </div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:15, color:'white', marginBottom:6 }}>{t.label}</div>
                      <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.38)', lineHeight:1.6 }}>{t.desc}</div>
                    </div>
                    {t.path
                      ? <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:t.color }}>Open <span style={{ fontSize:14 }}>→</span></div>
                      : <div style={{ fontSize:11, color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>Available in every editor</div>}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Brand Asset Formats ── */}
        {fmts.length > 0 && (
          <section style={{ marginBottom:64 }}>
            <motion.div {...fadeUp(13)} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <div style={{ height:2, flex:0, width:32, background:`linear-gradient(90deg,${H.b},${H.c})`, borderRadius:99 }} />
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Brand Assets</div>
              <div style={{ height:1, flex:1, background:'rgba(255,255,255,0.06)' }} />
            </motion.div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:16 }}>
              {fmts.map((f,i)=>(
                <motion.div key={f.id} {...fadeUp(14+i)}>
                  <div className="format-card" onClick={()=>onSelect(f.id)}
                    style={{ background:'linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'20px 16px 18px', display:'flex', flexDirection:'column', alignItems:'center', gap:14, cursor:'pointer', backdropFilter:'blur(16px)', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${f.color}00,${f.color},${f.color}00)` }} />

                    {/* Format shape preview */}
                    <div style={{ width:'100%', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <div style={{ width: f.aspect >= 1 ? '90%' : `${f.aspect * 90}%`, paddingTop: f.aspect >= 1 ? `${(90/f.aspect)*0.5}%` : '70%', maxHeight:90, borderRadius:10, background:`linear-gradient(135deg,${f.color}e0,${kit.secondary}bb)`, boxShadow:`0 8px 30px ${f.color}40`, position:'relative', overflow:'hidden' }}>
                        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:4 }}>
                          {kit.logo
                            ? <img src={kit.logo} alt="" style={{ height:'38%', maxWidth:'70%', objectFit:'contain' }} />
                            : <div style={{ fontSize:20 }}>{f.icon}</div>}
                        </div>
                        <div style={{ position:'absolute', top:-20, right:-20, width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,0.15)' }} />
                        <div style={{ position:'absolute', bottom:-10, left:-10, width:50, height:50, borderRadius:'50%', background:'rgba(0,0,0,0.2)' }} />
                      </div>
                    </div>

                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontWeight:800, fontSize:13, color:'white', marginBottom:3 }}>{f.label}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{f.desc}</div>
                    </div>

                    <div style={{ fontSize:11, fontWeight:700, color:f.color, display:'flex', alignItems:'center', gap:4 }}>
                      Create <span style={{ fontSize:13 }}>→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Recent Designs ── */}
        {recentDesigns.length > 0 && (
          <section style={{ marginBottom:64 }}>
            <motion.div {...fadeUp(20)} style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <div style={{ height:2, flex:0, width:32, background:`linear-gradient(90deg,${H.c},${H.b})`, borderRadius:99 }} />
              <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Recent Designs</div>
              <div style={{ height:1, flex:1, background:'rgba(255,255,255,0.06)' }} />
            </motion.div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {recentDesigns.map((d,i)=>(
                <motion.div key={d.id} {...fadeUp(21+i)}>
                  <div onClick={()=>onOpenRecent(d.id)} style={{ padding:'14px 18px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer', backdropFilter:'blur(12px)', transition:'background 0.2s, border-color 0.2s', minWidth:150 }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.07)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.16)'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'}}>
                    <div style={{ fontSize:11, fontWeight:700, color:'white', marginBottom:3 }}>{d.company}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', textTransform:'capitalize', marginBottom:4 }}>{d.asset.replace('-',' ')}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)' }}>{new Date(d.ts).toLocaleDateString()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Coming soon ── */}
        <motion.div {...fadeUp(28)} style={{ textAlign:'center', padding:'40px 0', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:16 }}>Coming Soon</div>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            {['Presentations','Pitch Decks','Menus','Certificates','Invoices','QR Codes','Stickers','T-Shirt Designs','Brochures'].map(item=>(
              <div key={item} style={{ padding:'6px 16px', borderRadius:99, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', fontSize:12, color:'rgba(255,255,255,0.25)' }}>{item}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
