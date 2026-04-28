import { useState } from 'react'
import { motion } from 'framer-motion'
import { BrandKit, PageSection, SectionContent, DEFAULT_CONTENT } from '../../types'
import { generateSectionContent } from '../../lib/ai'

interface Props {
  section: PageSection
  kit: BrandKit
  onUpdate: (content: Partial<SectionContent>) => void
}

// ── Shared form atoms ─────────────────────────────────────

const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, display: 'block' }
const inp: React.CSSProperties = { width: '100%', padding: '9px 11px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }
const cardStyle: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px', marginBottom: 8 }
const row: React.CSSProperties = { marginBottom: 12 }
const addBtn: React.CSSProperties = { width: '100%', padding: '8px', borderRadius: 8, border: '1px dashed rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', marginTop: 4 }
const delBtn: React.CSSProperties = { background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', fontSize: 13, padding: '2px 6px', float: 'right' }

function Field({ label: lbl, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div style={row}>
      <span style={label}>{lbl}</span>
      <Tag value={value} onChange={e => onChange(e.target.value)} rows={multiline ? 3 : undefined}
        style={{ ...inp, minHeight: multiline ? 64 : undefined }} />
    </div>
  )
}

// ── Section-specific editors ──────────────────────────────

function HeroEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  return <>
    <Field label="Badge" value={d.badgeText || ''} onChange={v => upd('badgeText', v)} />
    <Field label="Headline" value={d.headline || ''} onChange={v => upd('headline', v)} multiline />
    <Field label="Subheadline" value={d.subheadline || ''} onChange={v => upd('subheadline', v)} multiline />
    <Field label="Primary CTA" value={d.ctaText || ''} onChange={v => upd('ctaText', v)} />
    <Field label="Secondary CTA" value={d.ctaSecondary || ''} onChange={v => upd('ctaSecondary', v)} />
  </>
}

function NavbarEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const links: { label: string; href: string }[] = d.navLinks || DEFAULT_CONTENT.navLinks || []
  return <>
    <Field label="CTA Button" value={d.navCta || 'Get Started'} onChange={v => upd('navCta', v)} />
    <span style={label}>Nav Links</span>
    {links.map((l, i) => (
      <div key={i} style={{ ...cardStyle, display: 'flex', gap: 6, alignItems: 'center' }}>
        <input value={l.label} onChange={e => { const n = [...links]; n[i] = { ...l, label: e.target.value }; upd('navLinks', n) }}
          placeholder="Label" style={{ ...inp, flex: 1 }} />
        <input value={l.href} onChange={e => { const n = [...links]; n[i] = { ...l, href: e.target.value }; upd('navLinks', n) }}
          placeholder="href" style={{ ...inp, flex: 1 }} />
        <button style={delBtn} onClick={() => upd('navLinks', links.filter((_, j) => j !== i))}>✕</button>
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('navLinks', [...links, { label: 'Link', href: '#' }])}>+ Add Link</button>
  </>
}

function FeaturesEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const items = d.features || DEFAULT_CONTENT.features || []
  return <>
    <Field label="Section Title" value={d.featuresTitle || ''} onChange={v => upd('featuresTitle', v)} />
    <span style={label}>Feature Cards</span>
    {items.map((f: any, i: number) => (
      <div key={i} style={cardStyle}>
        <button style={delBtn} onClick={() => upd('features', items.filter((_: any, j: number) => j !== i))}>✕</button>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input value={f.icon} onChange={e => { const n = [...items]; n[i] = { ...f, icon: e.target.value }; upd('features', n) }}
            placeholder="Icon" style={{ ...inp, width: 56, flex: 'none' }} />
          <input value={f.title} onChange={e => { const n = [...items]; n[i] = { ...f, title: e.target.value }; upd('features', n) }}
            placeholder="Title" style={{ ...inp, flex: 1 }} />
        </div>
        <textarea value={f.desc} onChange={e => { const n = [...items]; n[i] = { ...f, desc: e.target.value }; upd('features', n) }}
          placeholder="Description" rows={2} style={{ ...inp, width: '100%', boxSizing: 'border-box' }} />
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('features', [...items, { icon: '⚡', title: 'New Feature', desc: 'Feature description.' }])}>+ Add Card</button>
  </>
}

function StatsEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const items = d.stats || DEFAULT_CONTENT.stats || []
  return <>
    <span style={label}>Stats</span>
    {items.map((s: any, i: number) => (
      <div key={i} style={{ ...cardStyle, display: 'flex', gap: 6, alignItems: 'center' }}>
        <input value={s.value} onChange={e => { const n = [...items]; n[i] = { ...s, value: e.target.value }; upd('stats', n) }}
          placeholder="Value" style={{ ...inp, width: 90, flex: 'none' }} />
        <input value={s.label} onChange={e => { const n = [...items]; n[i] = { ...s, label: e.target.value }; upd('stats', n) }}
          placeholder="Label" style={{ ...inp, flex: 1 }} />
        <button style={delBtn} onClick={() => upd('stats', items.filter((_: any, j: number) => j !== i))}>✕</button>
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('stats', [...items, { value: '100+', label: 'New Stat' }])}>+ Add Stat</button>
  </>
}

function TestimonialsEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const items = d.testimonials || DEFAULT_CONTENT.testimonials || []
  return <>
    <span style={label}>Testimonials</span>
    {items.map((t: any, i: number) => (
      <div key={i} style={cardStyle}>
        <button style={delBtn} onClick={() => upd('testimonials', items.filter((_: any, j: number) => j !== i))}>✕</button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
          <input value={t.name} onChange={e => { const n = [...items]; n[i] = { ...t, name: e.target.value }; upd('testimonials', n) }} placeholder="Name" style={inp} />
          <input value={t.avatar} onChange={e => { const n = [...items]; n[i] = { ...t, avatar: e.target.value }; upd('testimonials', n) }} placeholder="Avatar (initials)" style={inp} />
          <input value={t.role} onChange={e => { const n = [...items]; n[i] = { ...t, role: e.target.value }; upd('testimonials', n) }} placeholder="Role" style={inp} />
          <input value={t.company} onChange={e => { const n = [...items]; n[i] = { ...t, company: e.target.value }; upd('testimonials', n) }} placeholder="Company" style={inp} />
        </div>
        <textarea value={t.quote} onChange={e => { const n = [...items]; n[i] = { ...t, quote: e.target.value }; upd('testimonials', n) }}
          placeholder="Quote" rows={2} style={{ ...inp, width: '100%', boxSizing: 'border-box' }} />
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('testimonials', [...items, { name: 'New Person', role: 'Role', company: 'Company', quote: 'Great product!', avatar: 'NP' }])}>+ Add Testimonial</button>
  </>
}

function PricingEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const plans = d.plans || DEFAULT_CONTENT.plans || []
  return <>
    <Field label="Section Title" value={d.pricingTitle || ''} onChange={v => upd('pricingTitle', v)} />
    <span style={label}>Plans</span>
    {plans.map((p: any, i: number) => (
      <div key={i} style={cardStyle}>
        <button style={delBtn} onClick={() => upd('plans', plans.filter((_: any, j: number) => j !== i))}>✕</button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
          <input value={p.name} onChange={e => { const n = [...plans]; n[i] = { ...p, name: e.target.value }; upd('plans', n) }} placeholder="Plan name" style={inp} />
          <input value={p.price} onChange={e => { const n = [...plans]; n[i] = { ...p, price: e.target.value }; upd('plans', n) }} placeholder="Price" style={inp} />
          <input value={p.period} onChange={e => { const n = [...plans]; n[i] = { ...p, period: e.target.value }; upd('plans', n) }} placeholder="Period (/mo)" style={inp} />
          <input value={p.cta} onChange={e => { const n = [...plans]; n[i] = { ...p, cta: e.target.value }; upd('plans', n) }} placeholder="CTA text" style={inp} />
        </div>
        <textarea value={p.desc} onChange={e => { const n = [...plans]; n[i] = { ...p, desc: e.target.value }; upd('plans', n) }}
          placeholder="Description" rows={2} style={{ ...inp, width: '100%', boxSizing: 'border-box', marginBottom: 6 }} />
        <textarea value={(p.features || []).join('\n')} onChange={e => { const n = [...plans]; n[i] = { ...p, features: e.target.value.split('\n') }; upd('plans', n) }}
          placeholder="Features (one per line)" rows={3} style={{ ...inp, width: '100%', boxSizing: 'border-box', marginBottom: 6 }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!p.highlight} onChange={e => { const n = [...plans]; n[i] = { ...p, highlight: e.target.checked }; upd('plans', n) }} />
          Mark as Popular
        </label>
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('plans', [...plans, { name: 'New Plan', price: 'R0', period: '/mo', desc: 'Description', features: ['Feature 1'], cta: 'Get Started' }])}>+ Add Plan</button>
  </>
}

function FaqEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const items = d.faqs || []
  return <>
    <Field label="Section Title" value={d.faqTitle || 'FAQ'} onChange={v => upd('faqTitle', v)} />
    <span style={label}>Questions</span>
    {items.map((f: any, i: number) => (
      <div key={i} style={cardStyle}>
        <button style={delBtn} onClick={() => upd('faqs', items.filter((_: any, j: number) => j !== i))}>✕</button>
        <input value={f.q} onChange={e => { const n = [...items]; n[i] = { ...f, q: e.target.value }; upd('faqs', n) }}
          placeholder="Question" style={{ ...inp, marginBottom: 6 }} />
        <textarea value={f.a} onChange={e => { const n = [...items]; n[i] = { ...f, a: e.target.value }; upd('faqs', n) }}
          placeholder="Answer" rows={2} style={{ ...inp, width: '100%', boxSizing: 'border-box' }} />
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('faqs', [...items, { q: 'New question?', a: 'Answer here.' }])}>+ Add FAQ</button>
  </>
}

function TeamEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const items = d.teamMembers || []
  return <>
    <Field label="Section Title" value={d.teamTitle || 'Meet the team'} onChange={v => upd('teamTitle', v)} />
    <span style={label}>Members</span>
    {items.map((m: any, i: number) => (
      <div key={i} style={cardStyle}>
        <button style={delBtn} onClick={() => upd('teamMembers', items.filter((_: any, j: number) => j !== i))}>✕</button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
          <input value={m.name} onChange={e => { const n = [...items]; n[i] = { ...m, name: e.target.value }; upd('teamMembers', n) }} placeholder="Name" style={inp} />
          <input value={m.avatar} onChange={e => { const n = [...items]; n[i] = { ...m, avatar: e.target.value }; upd('teamMembers', n) }} placeholder="Initials" style={inp} />
          <input value={m.role} onChange={e => { const n = [...items]; n[i] = { ...m, role: e.target.value }; upd('teamMembers', n) }} placeholder="Role" style={{ ...inp, gridColumn: '1/-1' }} />
        </div>
        <textarea value={m.bio} onChange={e => { const n = [...items]; n[i] = { ...m, bio: e.target.value }; upd('teamMembers', n) }}
          placeholder="Bio" rows={2} style={{ ...inp, width: '100%', boxSizing: 'border-box' }} />
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('teamMembers', [...items, { name: 'New Member', role: 'Role', avatar: 'NM', bio: 'Bio here.' }])}>+ Add Member</button>
  </>
}

function LogoBarEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const items = d.logos || []
  return <>
    <Field label="Label" value={d.logoBarLabel || ''} onChange={v => upd('logoBarLabel', v)} />
    <span style={label}>Logos</span>
    {items.map((l: any, i: number) => (
      <div key={i} style={{ ...cardStyle, display: 'flex', gap: 6, alignItems: 'center' }}>
        <input value={l.icon} onChange={e => { const n = [...items]; n[i] = { ...l, icon: e.target.value }; upd('logos', n) }} placeholder="Icon" style={{ ...inp, width: 48, flex: 'none' }} />
        <input value={l.name} onChange={e => { const n = [...items]; n[i] = { ...l, name: e.target.value }; upd('logos', n) }} placeholder="Name" style={{ ...inp, flex: 1 }} />
        <button style={delBtn} onClick={() => upd('logos', items.filter((_: any, j: number) => j !== i))}>✕</button>
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('logos', [...items, { icon: '🌐', name: 'Brand' }])}>+ Add Logo</button>
  </>
}

function CtaEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  return <>
    <Field label="Heading" value={d.ctaTitle || ''} onChange={v => upd('ctaTitle', v)} />
    <Field label="Body" value={d.ctaBody || ''} onChange={v => upd('ctaBody', v)} multiline />
    <Field label="Button Text" value={d.ctaButton || ''} onChange={v => upd('ctaButton', v)} />
  </>
}

function FooterEditor({ d, upd }: { d: any; upd: (k: string, v: any) => void }) {
  const groups = d.footerLinks || DEFAULT_CONTENT.footerLinks || []
  return <>
    <Field label="Brand Name" value={d.footerBrand || ''} onChange={v => upd('footerBrand', v)} />
    <Field label="Tagline" value={d.footerTagline || ''} onChange={v => upd('footerTagline', v)} />
    <span style={label}>Link Groups</span>
    {groups.map((g: any, gi: number) => (
      <div key={gi} style={cardStyle}>
        <button style={delBtn} onClick={() => upd('footerLinks', groups.filter((_: any, j: number) => j !== gi))}>✕</button>
        <input value={g.group} onChange={e => { const n = [...groups]; n[gi] = { ...g, group: e.target.value }; upd('footerLinks', n) }}
          placeholder="Group name" style={{ ...inp, marginBottom: 6 }} />
        <textarea value={(g.links || []).join('\n')} onChange={e => { const n = [...groups]; n[gi] = { ...g, links: e.target.value.split('\n').filter(Boolean) }; upd('footerLinks', n) }}
          placeholder="Links (one per line)" rows={3} style={{ ...inp, width: '100%', boxSizing: 'border-box' }} />
      </div>
    ))}
    <button style={addBtn} onClick={() => upd('footerLinks', [...groups, { group: 'Group', links: ['Link 1'] }])}>+ Add Group</button>
  </>
}

function SimpleEditor({ fields, d, upd }: { fields: { key: string; label: string; multi?: boolean }[]; d: any; upd: (k: string, v: any) => void }) {
  return <>{fields.map(f => <Field key={f.key} label={f.label} value={d[f.key] || ''} onChange={v => upd(f.key, v)} multiline={f.multi} />)}</>
}

// ── Main export ───────────────────────────────────────────

export default function SectionContentEditor({ section, kit, onUpdate }: Props) {
  const d = { ...DEFAULT_CONTENT, ...section.content }
  const upd = (key: string, val: any) => onUpdate({ [key]: val })
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const handleGenerate = async () => {
    setGenerating(true); setGenError('')
    try {
      const result = await generateSectionContent(section.type, kit, kit.companyName || '')
      onUpdate(result)
    } catch (e: any) {
      setGenError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const renderEditor = () => {
    switch (section.type) {
      case 'navbar':       return <NavbarEditor d={d} upd={upd} />
      case 'hero':         return <HeroEditor d={d} upd={upd} />
      case 'features':     return <FeaturesEditor d={d} upd={upd} />
      case 'stats':        return <StatsEditor d={d} upd={upd} />
      case 'testimonials': return <TestimonialsEditor d={d} upd={upd} />
      case 'pricing':      return <PricingEditor d={d} upd={upd} />
      case 'faq':          return <FaqEditor d={d} upd={upd} />
      case 'team':         return <TeamEditor d={d} upd={upd} />
      case 'logobar':      return <LogoBarEditor d={d} upd={upd} />
      case 'cta':          return <CtaEditor d={d} upd={upd} />
      case 'footer':       return <FooterEditor d={d} upd={upd} />
      case 'newsletter':   return <SimpleEditor d={d} upd={upd} fields={[{ key: 'newsletterTitle', label: 'Title' }, { key: 'newsletterBody', label: 'Body', multi: true }, { key: 'newsletterPlaceholder', label: 'Email placeholder' }, { key: 'newsletterButton', label: 'Button' }]} />
      case 'contact':      return <SimpleEditor d={d} upd={upd} fields={[{ key: 'contactTitle', label: 'Heading' }, { key: 'contactBody', label: 'Body', multi: true }]} />
      case 'video':        return <SimpleEditor d={d} upd={upd} fields={[{ key: 'videoTitle', label: 'Title' }, { key: 'videoBody', label: 'Body', multi: true }, { key: 'videoUrl', label: 'YouTube/Video URL' }]} />
      case 'ctabanner':    return <SimpleEditor d={d} upd={upd} fields={[{ key: 'bannerText', label: 'Banner Text' }, { key: 'bannerSub', label: 'Subtitle' }, { key: 'bannerButton', label: 'Button' }]} />
      default:             return <div style={{ padding: 16, color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' }}>Click text on canvas to edit this section.</div>
    }
  }

  return (
    <div style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: `${kit.accent}20`, border: `1px solid ${kit.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✏️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'white', textTransform: 'capitalize' }}>{section.type} Content</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Changes apply instantly</div>
        </div>
        {/* AI Generate button */}
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGenerate} disabled={generating}
          title="Generate content with AI"
          style={{ padding: '5px 10px', borderRadius: 7, border: `1px solid ${kit.accent}50`, background: generating ? 'rgba(255,255,255,0.05)' : `${kit.accent}18`, color: generating ? 'rgba(255,255,255,0.3)' : kit.accent, fontWeight: 700, fontSize: 11, cursor: generating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
          <span style={{ display: 'inline-block', animation: generating ? 'spin 1s linear infinite' : 'none' }}>✨</span>
          {generating ? 'Writing…' : 'Generate'}
        </motion.button>
      </div>
      {genError && (
        <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 11, marginBottom: 12 }}>
          {genError} — <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setGenError('')}>dismiss</span>
        </div>
      )}
      <div style={{ opacity: generating ? 0.4 : 1, transition: 'opacity 0.2s', pointerEvents: generating ? 'none' : 'auto' }}>
        {renderEditor()}
      </div>
    </div>
  )
}
