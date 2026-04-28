import { motion } from 'framer-motion'
import { BrandKit, SectionContent, DEFAULT_CONTENT } from '../../types'

type SectionProps = { kit: BrandKit; content: SectionContent; editable?: boolean; onEdit?: (key: string, value: string) => void }

function c(kit: BrandKit, content: SectionContent) {
  return { ...DEFAULT_CONTENT, ...content }
}

// ── Editable text helper ──────────────────────────────────
function EditableText({ value, field, onEdit, tag = 'span', style }: { value: string; field: string; onEdit?: (k: string, v: string) => void; tag?: string; style?: React.CSSProperties }) {
  if (!onEdit) {
    // Read-only: render as-is, inheriting parent gradient-clip if set
    const Tag = tag as any
    return <Tag style={style}>{value}</Tag>
  }
  // In edit mode: parent may have WebkitTextFillColor:transparent (gradient clip).
  // We must override it back to a visible colour so text doesn't disappear.
  const editStyle: React.CSSProperties = {
    ...style,
    background: 'none',
    WebkitBackgroundClip: 'unset' as any,
    backgroundClip: 'unset' as any,
    WebkitTextFillColor: 'rgba(255,255,255,0.95)',
    color: 'rgba(255,255,255,0.95)',
    outline: 'none',
    borderBottom: '1.5px dashed rgba(103,232,249,0.5)',
    cursor: 'text',
  }
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={e => onEdit(field, e.currentTarget.textContent || '')}
      style={editStyle}
    >
      {value}
    </span>
  )
}



// ── NAVBAR ────────────────────────────────────────────────
export function NavbarSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  const links = d.navLinks ?? [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]
  const cta = d.navCta ?? 'Get Started'
  const name = kit.companyName || 'YourBrand'

  return (
    <nav className="section section-navbar" style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: '0 clamp(16px,5vw,48px)',
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(6,9,17,0.82)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      borderBottom: `1px solid ${kit.primary}18`,
      fontFamily: font,
    }}>
      {/* Brand / Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {kit.logo
          ? <img src={kit.logo} alt={name} style={{ height: 34, width: 'auto', objectFit: 'contain', borderRadius: 6 }} />
          : <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: 'white' }}>
              {name.charAt(0).toUpperCase()}
            </div>
        }
        <span style={{ fontSize: 16, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{name}</span>
      </div>

      {/* Nav links — hidden on mobile */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="navbar-links">
        {links.map(l => (
          <a key={l.label} href={l.href}
            style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'white')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >{l.label}</a>
        ))}
      </div>

      {/* CTA button */}
      <motion.button
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        style={{ padding: '8px 20px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: font, flexShrink: 0, boxShadow: `0 4px 16px ${kit.primary}40` }}
      >{cta}</motion.button>
    </nav>
  )
}

// ── HERO ──────────────────────────────────────────────────
export function HeroSection({ kit, content, editable, onEdit }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`

  return (
    <section className="section section-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px clamp(16px,5vw,48px)', background: `radial-gradient(ellipse at 30% 40%, ${kit.primary}25 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, ${kit.secondary}18 0%, transparent 55%), #060911`, fontFamily: font, position: 'relative', overflow: 'hidden' }}>
      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${kit.primary}08 1px,transparent 1px),linear-gradient(90deg,${kit.primary}08 1px,transparent 1px)`, backgroundSize: '40px 40px' }} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: 'relative', maxWidth: 760 }}>
        {/* Badge */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: `${kit.primary}15`, border: `1px solid ${kit.primary}30`, marginBottom: 28, fontSize: 13, color: kit.accent, fontWeight: 600 }}>
          <EditableText value={d.badgeText!} field="badgeText" onEdit={onEdit} />
        </motion.div>
        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 24,
            background: `linear-gradient(135deg, white 30%, ${kit.accent})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'block',
          }}>
          <EditableText value={d.headline!} field="headline" onEdit={onEdit} />
        </motion.h1>
        {/* Subheadline */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
          <EditableText value={d.subheadline!} field="subheadline" onEdit={onEdit} />
        </motion.p>
        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '14px 30px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: font, boxShadow: `0 8px 32px ${kit.primary}50` }}>
            <EditableText value={d.ctaText!} field="ctaText" onEdit={onEdit} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} style={{ padding: '14px 30px', borderRadius: 99, border: `1.5px solid ${kit.accent}50`, color: kit.accent, background: 'transparent', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: font }}>
            <EditableText value={d.ctaSecondary!} field="ctaSecondary" onEdit={onEdit} />
          </motion.button>
        </motion.div>
        {/* Floating orbs */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }}
          style={{ position: 'absolute', top: -80, right: -120, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle,${kit.secondary}30,transparent 70%)`, pointerEvents: 'none' }} />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }}
          style={{ position: 'absolute', bottom: -100, left: -100, width: 250, height: 250, borderRadius: '50%', background: `radial-gradient(circle,${kit.accent}20,transparent 70%)`, pointerEvents: 'none' }} />
      </motion.div>
    </section>
  )
}

// ── FEATURES ─────────────────────────────────────────────
export function FeaturesSection({ kit, content, onEdit }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  return (
    <section className="section section-features" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#080b14', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 14 }}>
            <EditableText value={d.featuresTitle!} field="featuresTitle" onEdit={onEdit} />
          </h2>
          <div style={{ width: 60, height: 4, borderRadius: 99, background: `linear-gradient(to right,${kit.primary},${kit.accent})`, margin: '0 auto' }} />
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {(d.features!).map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, borderColor: kit.primary + '40' }}
              style={{ padding: '28px 28px', borderRadius: 16, background: `${kit.primary}06`, border: `1px solid ${kit.primary}15`, transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── STATS ────────────────────────────────────────────────
export function StatsSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  return (
    <section className="section section-stats" style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,5vw,48px)', background: `linear-gradient(135deg,${kit.primary}12,${kit.secondary}10)`, borderTop: `1px solid ${kit.primary}20`, borderBottom: `1px solid ${kit.primary}20`, fontFamily: font }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 24 }}>
        {d.stats!.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 900, background: `linear-gradient(135deg,${kit.primary},${kit.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: 8, whiteSpace: 'nowrap' }}>{s.value}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── TESTIMONIALS ─────────────────────────────────────────
export function TestimonialsSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  return (
    <section className="section section-testimonials" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#060911', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'white', marginBottom: 56, letterSpacing: '-0.03em' }}>
          Loved by teams worldwide
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 20 }}>
          {d.testimonials!.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: 28, borderRadius: 16, background: `${kit.primary}08`, border: `1px solid ${kit.primary}18` }}>
              <div style={{ fontSize: 13, color: kit.accent, marginBottom: 16 }}>{'★★★★★'}</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── PRICING ──────────────────────────────────────────────
export function PricingSection({ kit, content, onEdit }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  return (
    <section className="section section-pricing" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#080b14', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'white', marginBottom: 56, letterSpacing: '-0.03em' }}>
          <EditableText value={d.pricingTitle!} field="pricingTitle" onEdit={onEdit} />
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
          {d.plans!.map((plan, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: 32, borderRadius: 20, background: plan.highlight ? `linear-gradient(135deg,${kit.primary}18,${kit.secondary}12)` : `${kit.primary}06`, border: `1.5px solid ${plan.highlight ? kit.primary + '50' : kit.primary + '15'}`, position: 'relative' }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 99, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, fontSize: 11, fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>Most Popular</div>
              )}
              <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: plan.highlight ? kit.primary : 'white' }}>{plan.price}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24, lineHeight: 1.5 }}>{plan.desc}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                    <span style={{ color: kit.accent, fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: plan.highlight ? 'none' : `1px solid ${kit.primary}40`, background: plan.highlight ? `linear-gradient(135deg,${kit.primary},${kit.secondary})` : 'transparent', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: font }}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ──────────────────────────────────────────────────
export function CtaSection({ kit, content, onEdit }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  return (
    <section className="section section-cta" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: `linear-gradient(135deg,${kit.primary}20,${kit.secondary}15,${kit.accent}08)`, fontFamily: font, textAlign: 'center', borderTop: `1px solid ${kit.primary}25` }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.03em', color: 'white', marginBottom: 16 }}>
          <EditableText value={d.ctaTitle!} field="ctaTitle" onEdit={onEdit} />
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 36, lineHeight: 1.7 }}>
          <EditableText value={d.ctaBody!} field="ctaBody" onEdit={onEdit} />
        </motion.p>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          style={{ padding: '15px 36px', borderRadius: 99, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: font, boxShadow: `0 12px 40px ${kit.primary}50` }}>
          <EditableText value={d.ctaButton!} field="ctaButton" onEdit={onEdit} />
        </motion.button>
      </div>
    </section>
  )
}

// ── FOOTER ───────────────────────────────────────────────
export function FooterSection({ kit, content, onEdit }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  const name = kit.companyName || d.footerBrand!
  return (
    <footer className="section section-footer" style={{ padding: 'clamp(40px,6vw,64px) clamp(16px,5vw,48px) 40px', background: '#040608', borderTop: `1px solid ${kit.primary}15`, fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'clamp(24px,4vw,48px)', marginBottom: 48 }}>
          {/* Brand block */}
          <div>
            {/* Logo */}
            {kit.logo
              ? <img src={kit.logo} alt={name} style={{ height: 36, width: 'auto', objectFit: 'contain', borderRadius: 6, marginBottom: 10 }} />
              : <div style={{ fontSize: 22, fontWeight: 900, background: `linear-gradient(135deg,${kit.primary},${kit.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10 }}>
                  <EditableText value={name} field="footerBrand" onEdit={onEdit} />
                </div>
            }
            {/* Company name below logo */}
            {kit.logo && (
              <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 6 }}>{name}</div>
            )}
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              <EditableText value={d.footerTagline!} field="footerTagline" onEdit={onEdit} />
            </div>
          </div>
          {d.footerLinks!.map(group => (
            <div key={group.group}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{group.group}</div>
              {group.links.map(link => (
                <div key={link} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 8, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = kit.accent}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {kit.logo && <img src={kit.logo} alt={name} style={{ height: 20, width: 'auto', objectFit: 'contain', opacity: 0.5 }} />}
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2026 {name}. All rights reserved.</div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Powered by <span style={{ color: kit.accent }}>Move Design Library</span></div>
        </div>
      </div>
    </footer>
  )
}


// ── FAQ ──────────────────────────────────────────────────
export function FaqSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  const faqs = d.faqs ?? [
    { q: 'How do I get started?', a: 'Sign up free, connect your brand kit, and start building in minutes. No credit card required.' },
    { q: 'Can I use my own domain?', a: 'Yes. Pro and Agency plans support custom domains with automatic SSL provisioning.' },
    { q: 'Is there a free plan?', a: 'The Starter plan is free forever with generous limits for individuals and small teams.' },
    { q: 'How does billing work?', a: 'Monthly or annual billing. Cancel or downgrade at any time — no lock-in.' },
    { q: 'Do you offer white-labelling?', a: 'Agency plan includes full white-labelling so you can resell under your own brand.' },
  ]
  return (
    <section className="section section-faq" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#080b14', fontFamily: font }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 12 }}>{d.faqTitle ?? 'Frequently Asked Questions'}</h2>
          <div style={{ width: 48, height: 4, borderRadius: 99, background: `linear-gradient(to right,${kit.primary},${kit.accent})`, margin: '0 auto' }} />
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <motion.details key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              style={{ borderRadius: 14, border: `1px solid ${kit.primary}20`, background: `${kit.primary}06`, overflow: 'hidden' }}>
              <summary style={{ padding: '18px 22px', fontSize: 15, fontWeight: 700, color: 'white', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.q}<span style={{ color: kit.accent, fontSize: 20, flexShrink: 0, marginLeft: 12 }}>+</span>
              </summary>
              <div style={{ padding: '0 22px 18px', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>{faq.a}</div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── TEAM ─────────────────────────────────────────────────
export function TeamSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  const members = d.teamMembers ?? [
    { name: 'Alex Rivera', role: 'CEO & Co-founder', avatar: 'AR', bio: 'Former Goldman Sachs. Building the future of financial infrastructure.' },
    { name: 'Priya Nair', role: 'CTO', avatar: 'PN', bio: '15 years in distributed systems. Ex-Google, ex-Stripe.' },
    { name: 'Jordan Lee', role: 'Head of Design', avatar: 'JL', bio: 'Crafting premium digital experiences that convert.' },
    { name: 'Sam Okonkwo', role: 'VP Growth', avatar: 'SO', bio: 'Scaled 3 SaaS companies from 0 to $10M ARR.' },
  ]
  return (
    <section className="section section-team" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#060911', fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 12 }}>{d.teamTitle ?? 'Meet the team'}</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 24 }}>
          {members.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
              style={{ padding: '28px', borderRadius: 20, background: `${kit.primary}07`, border: `1px solid ${kit.primary}18`, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', margin: '0 auto 16px' }}>{m.avatar}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: kit.accent, fontWeight: 600, marginBottom: 12 }}>{m.role}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{m.bio}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── LOGO BAR ─────────────────────────────────────────────
export function LogoBarSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  const logos = d.logos ?? [
    { name: 'Stripe', icon: '💳' }, { name: 'Shopify', icon: '🛍' }, { name: 'Slack', icon: '💬' },
    { name: 'Figma', icon: '🎨' }, { name: 'Notion', icon: '📋' }, { name: 'Vercel', icon: '▲' }, { name: 'GitHub', icon: '🐙' },
  ]
  return (
    <section className="section section-logobar" style={{ padding: 'clamp(32px,4vw,48px) clamp(16px,5vw,48px)', background: `${kit.primary}06`, borderTop: `1px solid ${kit.primary}12`, borderBottom: `1px solid ${kit.primary}12`, fontFamily: font }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 28 }}>
          {d.logoBarLabel ?? "Trusted by teams at world-class companies"}
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {logos.map((logo, i) => (
            <motion.div key={i} whileHover={{ opacity: 1, scale: 1.08 }} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.45 }}>
              <span style={{ fontSize: 22 }}>{logo.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── NEWSLETTER ───────────────────────────────────────────
export function NewsletterSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  return (
    <section className="section section-newsletter" style={{ padding: 'clamp(48px,6vw,80px) clamp(16px,5vw,48px)', background: '#080b14', fontFamily: font }}>
      <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>📬</div>
          <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 12 }}>{d.newsletterTitle ?? 'Stay in the loop'}</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.7 }}>{d.newsletterBody ?? 'Get the latest updates. No spam, ever.'}</p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap' }}>
            <input placeholder={d.newsletterPlaceholder ?? 'Enter your email'} style={{ flex: 1, minWidth: 200, padding: '13px 18px', borderRadius: 10, border: `1px solid ${kit.primary}30`, background: `${kit.primary}08`, color: 'white', fontSize: 14, fontFamily: font, outline: 'none' }} />
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ padding: '13px 24px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: font, whiteSpace: 'nowrap' }}>
              {d.newsletterButton ?? 'Subscribe'}
            </motion.button>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>Unsubscribe any time · GDPR compliant</div>
        </motion.div>
      </div>
    </section>
  )
}

// ── CONTACT ──────────────────────────────────────────────
export function ContactSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  const inp: React.CSSProperties = { padding: '12px 16px', borderRadius: 10, border: `1px solid ${kit.primary}25`, background: `${kit.primary}06`, color: 'white', fontSize: 14, fontFamily: font, outline: 'none', width: '100%', boxSizing: 'border-box' }
  return (
    <section className="section section-contact" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#060911', fontFamily: font }}>
      <div className="contact-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'clamp(32px,5vw,60px)', alignItems: 'start' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 16 }}>{d.contactTitle ?? "Let's talk"}</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 32 }}>{d.contactBody ?? "Have a project in mind? We'd love to hear from you."}</p>
          {[{ icon: '📧', label: 'Email', val: 'hello@yourbrand.com' }, { icon: '📍', label: 'Location', val: 'Cape Town, South Africa' }, { icon: '⏰', label: 'Hours', val: 'Mon–Fri, 9am–6pm SAST' }].map(item => (
            <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${kit.primary}15`, border: `1px solid ${kit.primary}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 14, color: 'white', fontWeight: 600 }}>{item.val}</div>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          style={{ padding: '32px', borderRadius: 20, background: `${kit.primary}07`, border: `1px solid ${kit.primary}18` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <input placeholder="First name" style={inp} /><input placeholder="Last name" style={inp} />
          </div>
          <div style={{ marginBottom: 14 }}><input placeholder="Email address" style={inp} /></div>
          <div style={{ marginBottom: 14 }}><input placeholder="Subject" style={inp} /></div>
          <div style={{ marginBottom: 20 }}><textarea placeholder="Your message..." rows={5} style={{ ...inp, resize: 'vertical', display: 'block' }} /></div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: font, boxShadow: `0 8px 28px ${kit.primary}40` }}>
            Send Message →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// ── VIDEO ────────────────────────────────────────────────
export function VideoSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  return (
    <section className="section section-video" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#080b14', fontFamily: font }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 12 }}>{d.videoTitle ?? 'See it in action'}</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>{d.videoBody ?? 'Watch how teams build and ship faster than ever before.'}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${kit.primary}25`, position: 'relative', aspectRatio: '16/9', background: `linear-gradient(135deg,${kit.primary}15,${kit.secondary}10,#060911)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 40px 80px ${kit.primary}25` }}>
          <motion.div whileHover={{ scale: 1.1 }} style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 0 48px ${kit.primary}60` }}>
            <span style={{ fontSize: 28, marginLeft: 4 }}>▶</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ── TIMELINE ─────────────────────────────────────────────
export function TimelineSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  const milestones = d.milestones ?? [
    { year: '2021', title: 'Founded', desc: 'Started in a Cape Town garage with a vision to democratise design.' },
    { year: '2022', title: 'Seed Round', desc: 'Raised R8M seed. Launched brand kit beta to 200 teams.' },
    { year: '2023', title: 'Public Launch', desc: '5,000 sign-ups in the first week.' },
    { year: '2024', title: 'Scale', desc: 'Crossed 50,000 active users across 40 countries.' },
    { year: '2025', title: 'Today', desc: 'Building the next generation of AI-powered brand tooling.' },
  ]
  return (
    <section className="section section-timeline" style={{ padding: 'clamp(56px,8vw,100px) clamp(16px,5vw,48px)', background: '#060911', fontFamily: font }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>{d.timelineTitle ?? 'Our journey'}</h2>
        </motion.div>
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom,${kit.primary},${kit.accent})`, borderRadius: 99 }} />
          {milestones.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ position: 'relative', marginBottom: 40 }}>
              <div style={{ position: 'absolute', left: -28, top: 4, width: 14, height: 14, borderRadius: '50%', background: `linear-gradient(135deg,${kit.primary},${kit.accent})`, border: '3px solid #060911' }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: kit.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{m.year}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 6 }}>{m.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA BANNER ───────────────────────────────────────────
export function CtaBannerSection({ kit, content }: SectionProps) {
  const d = c(kit, content)
  const font = `'${kit.font}', sans-serif`
  return (
    <section className="section section-ctabanner" style={{ padding: 'clamp(20px,3vw,32px) clamp(16px,5vw,48px)', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, fontFamily: font, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', position: 'relative' }}>
        <div>
          <div style={{ fontSize: 'clamp(18px,3vw,26px)', fontWeight: 900, color: 'white', marginBottom: 4 }}>{d.bannerText ?? '🚀 Ready to scale your brand?'}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{d.bannerSub ?? 'Join thousands of teams building faster with Move Studio.'}</div>
        </div>
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
          style={{ padding: '13px 28px', borderRadius: 99, border: '2px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: font, backdropFilter: 'blur(10px)', whiteSpace: 'nowrap' }}>
          {d.bannerButton ?? 'Get Started Free →'}
        </motion.button>
      </div>
    </section>
  )
}
