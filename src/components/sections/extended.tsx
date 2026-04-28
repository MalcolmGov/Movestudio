import { motion } from 'framer-motion'
import { BrandKit, SectionContent, DEFAULT_CONTENT } from '../../types'

type SP = { kit: BrandKit; content: SectionContent; onEdit?: (k: string, v: string) => void }
const f = (kit: BrandKit, content: SectionContent) => ({ ...DEFAULT_CONTENT, ...content })
const sec = (className: string, padding: string, bg: string, font: string, children: React.ReactNode) => (
  <section className={`section ${className}`} style={{ padding, background: bg, fontFamily: font }}>{children}</section>
)

const SectionHeader = ({ title, subtitle, accent }: { title: string; subtitle?: string; accent: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
    style={{ textAlign: 'center', marginBottom: 56 }}>
    <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 12 }}>{title}</h2>
    {subtitle && <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 560, margin: '0 auto' }}>{subtitle}</p>}
    <div style={{ width: 48, height: 4, borderRadius: 99, background: `linear-gradient(to right,${accent},${accent}88)`, margin: '16px auto 0' }} />
  </motion.div>
)

// ── GALLERY ───────────────────────────────────────────────
export function GallerySection({ kit, content }: SP) {
  const d = f(kit, content)
  const font = `'${kit.font}', sans-serif`
  const items = d.galleryItems ?? [
    { label: 'Brand Identity', category: 'Branding' },
    { label: 'Web Design', category: 'Digital' },
    { label: 'Mobile App', category: 'Product' },
    { label: 'Campaign', category: 'Marketing' },
    { label: 'Motion Design', category: 'Animation' },
    { label: 'Photography', category: 'Visual' },
  ]
  return (
    <section className="section section-gallery" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#060911', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title={d.galleryTitle ?? 'Our Work'} subtitle={d.gallerySubtitle ?? "A selection of projects we're proud of"} accent={kit.accent} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
          {items.map((item, i) => {
            const uploadedImg = (content as any)[`galleryImage${i}`] as string | undefined
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.03 }}
                style={{
                  borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '4/3', cursor: 'pointer',
                  background: uploadedImg
                    ? `url(${uploadedImg}) center/cover no-repeat`
                    : `linear-gradient(135deg,${kit.primary}${15 + i * 5},${kit.secondary}${10 + i * 4})`,
                  border: `1px solid ${kit.primary}20`,
                }}>
                {/* Dark overlay so text is always readable */}
                <div style={{ position: 'absolute', inset: 0, background: uploadedImg ? 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' : 'transparent' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: uploadedImg ? 'flex-end' : 'center', gap: 6, padding: uploadedImg ? '0 16px 18px' : 0 }}>
                  {!uploadedImg && <div style={{ fontSize: 36 }}>{'🎨🖼🎬📸✦⬡'.split('').filter((_,j) => j % 2 === 0)[i % 3]}</div>}
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white', textShadow: uploadedImg ? '0 1px 8px rgba(0,0,0,0.8)' : 'none' }}>{item.label}</div>
                  {item.category && <div style={{ fontSize: 10, fontWeight: 600, color: kit.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.category}</div>}
                </div>
                <motion.div whileHover={{ opacity: 1 }} initial={{ opacity: 0 }}
                  style={{ position: 'absolute', inset: 0, background: `${kit.primary}90`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white' }}>
                  View Project →
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


// ── SERVICES ──────────────────────────────────────────────
export function ServicesSection({ kit, content }: SP) {
  const d = f(kit, content)
  const font = `'${kit.font}', sans-serif`
  const items = d.serviceItems ?? [
    { icon: '🎨', title: 'Brand Design', desc: 'Visual identity systems that make you instantly recognisable.', price: 'From R5,000' },
    { icon: '💻', title: 'Web Development', desc: 'Fast, SEO-optimised websites built for conversion.', price: 'From R12,000' },
    { icon: '📱', title: 'Mobile Apps', desc: 'iOS and Android apps your users will love.', price: 'From R35,000' },
    { icon: '📣', title: 'Digital Marketing', desc: 'Data-driven campaigns that grow your revenue.', price: 'From R8,000/mo' },
    { icon: '📊', title: 'Analytics & SEO', desc: 'Turn traffic into leads with precision tracking.', price: 'From R3,500/mo' },
    { icon: '🤖', title: 'AI Integration', desc: 'Automate operations with custom AI workflows.', price: 'From R20,000' },
  ]
  return (
    <section className="section section-services" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#080b14', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title={d.servicesTitle ?? 'What We Do'} subtitle={d.servicesSubtitle ?? 'End-to-end services tailored to your goals'} accent={kit.accent} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, borderColor: kit.primary + '50' }}
              style={{ padding: '28px', borderRadius: 18, background: `${kit.primary}06`, border: `1px solid ${kit.primary}15`, transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: 34, marginBottom: 14 }}>{item.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'white', marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: item.price ? 16 : 0 }}>{item.desc}</div>
              {item.price && <div style={{ fontSize: 12, fontWeight: 700, color: kit.accent }}>{item.price}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PROCESS / HOW IT WORKS ────────────────────────────────
export function ProcessSection({ kit, content }: SP) {
  const d = f(kit, content)
  const font = `'${kit.font}', sans-serif`
  const steps = d.processSteps ?? [
    { number: '01', icon: '💬', title: 'Discovery Call', desc: 'We learn about your goals, audience, and vision in a free 30-min session.' },
    { number: '02', icon: '🎨', title: 'Strategy & Design', desc: 'Our team crafts a bespoke plan and delivers initial concepts within 5 days.' },
    { number: '03', icon: '🔨', title: 'Build & Refine', desc: 'We build iteratively, gathering your feedback at every stage.' },
    { number: '04', icon: '🚀', title: 'Launch & Scale', desc: 'Go live with full handover, training, and ongoing support.' },
  ]
  return (
    <section className="section section-process" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#060911', fontFamily: font }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <SectionHeader title={d.processTitle ?? 'How It Works'} subtitle={d.processSubtitle ?? 'A simple, proven process that delivers results every time'} accent={kit.accent} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 24 }}>
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ position: 'relative', padding: '28px 24px', borderRadius: 18, background: `${kit.primary}08`, border: `1px solid ${kit.primary}18` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: kit.primary, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>{step.number}</div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{step.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 8 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{step.desc}</div>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', top: '50%', right: -12, transform: 'translateY(-50%)', color: kit.accent, fontSize: 18, display: 'none' }}>→</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── BLOG ─────────────────────────────────────────────────
export function BlogSection({ kit, content }: SP) {
  const d = f(kit, content)
  const font = `'${kit.font}', sans-serif`
  const posts = d.blogPosts ?? [
    { title: '10 Brand Trends Shaping 2026', excerpt: 'From AI-generated identities to hyper-personalised experiences — the trends you can\'t ignore.', date: 'Apr 12, 2026', category: 'Branding', readTime: '5 min', author: 'Alex R.' },
    { title: 'Why Your Website Loads Too Slowly', excerpt: 'Speed is a conversion metric. Here\'s how to audit and fix performance bottlenecks.', date: 'Apr 5, 2026', category: 'Dev', readTime: '7 min', author: 'Priya N.' },
    { title: 'The ROI of Good Design', excerpt: 'Data from 500 companies shows premium design pays back 3-5x in the first year.', date: 'Mar 28, 2026', category: 'Strategy', readTime: '4 min', author: 'Jordan L.' },
  ]
  return (
    <section className="section section-blog" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#080b14', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title={d.blogTitle ?? 'From the Blog'} subtitle={d.blogSubtitle ?? 'Insights, strategies, and guides from our team'} accent={kit.accent} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
          {posts.map((post, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{ borderRadius: 18, overflow: 'hidden', background: `${kit.primary}07`, border: `1px solid ${kit.primary}15`, cursor: 'pointer' }}>
              <div style={{ height: 140, background: `linear-gradient(135deg,${kit.primary}${20 + i * 8},${kit.secondary}${15 + i * 6})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                {'📝📊🎯'[i] || '📝'}
              </div>
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${kit.primary}20`, color: kit.primary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{post.category}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>{post.readTime} read</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'white', lineHeight: 1.4, marginBottom: 10 }}>{post.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 16 }}>{post.excerpt}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                  <span>{post.author}</span><span>{post.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <motion.button whileHover={{ scale: 1.04 }} style={{ padding: '12px 28px', borderRadius: 99, border: `1.5px solid ${kit.primary}40`, background: 'transparent', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: font }}>
            View All Posts →
          </motion.button>
        </div>
      </div>
    </section>
  )
}

// ── COMPARISON TABLE ──────────────────────────────────────
export function ComparisonSection({ kit, content }: SP) {
  const d = f(kit, content)
  const font = `'${kit.font}', sans-serif`
  const features = d.comparisonFeatures ?? ['Custom domain','Remove branding','Priority support','API access','Team members','Analytics','Export HTML','White-label']
  const plans = d.comparisonPlans ?? [
    { name: 'Starter', values: [false, false, false, false, '1', 'Basic', false, false] },
    { name: 'Pro', highlight: true, values: [true, true, true, false, '5', 'Advanced', true, false] },
    { name: 'Agency', values: [true, true, true, true, 'Unlimited', 'Full', true, true] },
  ]
  return (
    <section className="section section-comparison" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#060911', fontFamily: font }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SectionHeader title={d.comparisonTitle ?? 'Compare Plans'} subtitle={d.comparisonSubtitle ?? 'Everything you need, nothing you don\'t'} accent={kit.accent} />
        <div style={{ overflowX: 'auto', borderRadius: 16, border: `1px solid ${kit.primary}15` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${kit.primary}15` }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 11 }}>FEATURE</th>
                {plans.map(p => (
                  <th key={p.name} style={{ padding: '16px 20px', textAlign: 'center', color: p.highlight ? kit.primary : 'white', fontWeight: 800, fontSize: 14, background: p.highlight ? `${kit.primary}10` : 'transparent' }}>
                    {p.name}
                    {p.highlight && <div style={{ fontSize: 9, color: kit.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>Popular</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, fi) => (
                <tr key={fi} style={{ borderBottom: `1px solid ${kit.primary}08`, background: fi % 2 === 0 ? 'transparent' : `${kit.primary}04` }}>
                  <td style={{ padding: '13px 20px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{feature}</td>
                  {plans.map(p => {
                    const val = p.values[fi]
                    return (
                      <td key={p.name} style={{ padding: '13px 20px', textAlign: 'center', background: p.highlight ? `${kit.primary}06` : 'transparent' }}>
                        {typeof val === 'boolean'
                          ? <span style={{ color: val ? kit.accent : 'rgba(255,255,255,0.15)', fontSize: 16 }}>{val ? '✓' : '✕'}</span>
                          : <span style={{ color: 'white', fontWeight: 600 }}>{val}</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ── MAP / LOCATION ────────────────────────────────────────
export function MapSection({ kit, content }: SP) {
  const d = f(kit, content)
  const font = `'${kit.font}', sans-serif`
  const hours = d.mapHours ?? [
    { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
    { day: 'Saturday', time: '9:00 AM – 2:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ]
  return (
    <section className="section section-map" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#080b14', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title={d.mapTitle ?? 'Find Us'} subtitle={d.mapSubtitle ?? 'Visit us or get in touch any time'} accent={kit.accent} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 32, alignItems: 'start' }}>
          {/* Map placeholder */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3', background: `linear-gradient(135deg,${kit.primary}15,${kit.secondary}10)`, border: `1px solid ${kit.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 56 }}>📍</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>{d.mapCity ?? 'Cape Town, South Africa'}</div>
            <motion.button whileHover={{ scale: 1.04 }}
              style={{ padding: '10px 20px', borderRadius: 99, border: `1px solid ${kit.primary}50`, background: `${kit.primary}20`, color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: font }}>
              Open in Maps →
            </motion.button>
          </motion.div>
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {[
              { icon: '📍', label: 'Address', val: d.mapAddress ?? '15 Buitenkant Street, Gardens, Cape Town, 8001' },
              { icon: '📞', label: 'Phone', val: d.mapPhone ?? '+27 21 000 0000' },
              { icon: '✉️', label: 'Email', val: d.mapEmail ?? 'hello@yourbrand.com' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: `${kit.primary}15`, border: `1px solid ${kit.primary}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 14, color: 'white' }}>{item.val}</div>
                </div>
              </div>
            ))}
            <div style={{ padding: '20px', borderRadius: 14, background: `${kit.primary}08`, border: `1px solid ${kit.primary}15`, marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>HOURS</div>
              {hours.map(h => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: h.time === 'Closed' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.7)' }}>
                  <span>{h.day}</span><span style={{ color: h.time === 'Closed' ? '#ef4444' : kit.accent, fontWeight: 600 }}>{h.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── BOOKING / APPOINTMENT ─────────────────────────────────
export function BookingSection({ kit, content }: SP) {
  const d = f(kit, content)
  const font = `'${kit.font}', sans-serif`
  const services = d.bookingServices ?? ['Brand Consultation (Free, 30 min)', 'Design Sprint (2 hrs)', 'Full Project Kickoff (1 hr)', 'Technical Review (45 min)']
  const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 9, border: `1px solid ${kit.primary}25`, background: `${kit.primary}06`, color: 'white', fontSize: 13, fontFamily: font, outline: 'none', boxSizing: 'border-box' }
  return (
    <section className="section section-booking" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#060911', fontFamily: font }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <SectionHeader title={d.bookingTitle ?? 'Book a Session'} subtitle={d.bookingSubtitle ?? 'Reserve time with our team — no strings attached'} accent={kit.accent} />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ padding: '36px', borderRadius: 22, background: `${kit.primary}07`, border: `1px solid ${kit.primary}18` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14, marginBottom: 14 }}>
            <input placeholder="First name" style={inp} />
            <input placeholder="Last name" style={inp} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14, marginBottom: 14 }}>
            <input placeholder="Email address" style={inp} />
            <input placeholder="Phone number" style={inp} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <select style={{ ...inp, appearance: 'none' as any }}>
              <option value="">Select a service...</option>
              {services.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14, marginBottom: 20 }}>
            <input type="date" style={inp} />
            <select style={{ ...inp, appearance: 'none' as any }}>
              <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
              <option>12:00 PM</option><option>02:00 PM</option><option>03:00 PM</option>
            </select>
          </div>
          <textarea placeholder="Anything you'd like us to know beforehand?" rows={3} style={{ ...inp, resize: 'vertical', display: 'block', marginBottom: 20 }} />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ width: '100%', padding: '14px', borderRadius: 11, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: font, boxShadow: `0 8px 28px ${kit.primary}40` }}>
            {d.bookingButton ?? 'Confirm Booking →'}
          </motion.button>
          <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>
            You'll receive a confirmation email instantly. Cancel or reschedule any time.
          </div>
        </motion.div>
      </div>
    </section>
  )
}
