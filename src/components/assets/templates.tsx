import React from 'react'
import { BrandKit } from '../../types'

interface TemplateProps { kit: BrandKit; text: Record<string, string> }

// ── Single-sided: all info on one card ─────────────────────
export function BusinessCardSingle({ kit, text }: TemplateProps) {
  const font = kit.font || 'Inter'
  const logo = text.logo || kit.logo
  return (
    <div style={{ width: 340, height: 200, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, borderRadius: 12, padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: `'${font}',sans-serif`, color: 'white', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ position: 'absolute', bottom: -30, left: 100, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

      {/* Top row: logo/company + tagline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1, gap: 8, overflow: 'hidden' }}>
        <div style={{ flexShrink: 0 }}>
          {logo
            ? <img src={logo} alt="logo" style={{ height: 26, maxWidth: 110, objectFit: 'contain', display: 'block' }} />
            : <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>{text.company || 'Company'}</div>}
        </div>
        <div style={{ fontSize: 9, opacity: 0.7, textAlign: 'right', maxWidth: 110, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{text.tagline || ''}</div>
      </div>

      {/* Middle: name + title */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text.name || 'Your Name'}</div>
        <div style={{ fontSize: 12, opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text.title || 'Job Title'}</div>
      </div>

      {/* Bottom row: contact details — truncated */}
      <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        {([['📧', text.email], ['📞', text.phone], ['🌐', text.website]] as [string,string][]).filter(([,v]) => v).map(([icon, val]) => (
          <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, opacity: 0.85, minWidth: 0, flex: 1, overflow: 'hidden' }}>
            <span style={{ fontSize: 10, flexShrink: 0 }}>{icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Double-sided Front: identity only ──────────────────────
export function BusinessCardFront({ kit, text }: TemplateProps) {
  const font = kit.font || 'Inter'
  const logo = text.logo || kit.logo
  return (
    <div style={{ width: 340, height: 200, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: `'${font}',sans-serif`, color: 'white', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      {logo
        ? <img src={logo} alt="logo" style={{ height: 34, maxWidth: 140, objectFit: 'contain', display: 'block' }} />
        : <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.03em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{text.company || 'Company'}</div>}
      <div style={{ overflow: 'hidden' }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text.name || 'Your Name'}</div>
        <div style={{ fontSize: 13, opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text.title || 'Job Title'}</div>
      </div>
    </div>
  )
}

// ── Double-sided Back: contact details ─────────────────────
export function BusinessCardBack({ kit, text }: TemplateProps) {
  const font = kit.font || 'Inter'
  return (
    <div style={{ width: 340, height: 200, background: '#0d1120', border: `1px solid ${kit.primary}40`, borderRadius: 12, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: `'${font}',sans-serif`, color: 'white', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div>
        <div style={{ fontWeight: 900, fontSize: 16, color: kit.accent, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text.company || 'Company'}</div>
        {text.tagline && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text.tagline}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {([['📧', text.email || 'email@company.com'], ['📞', text.phone || '+27 000 000 0000'], ['🌐', text.website || 'www.company.com']] as [string,string][]).map(([icon, val]) => (
          <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.75)', overflow: 'hidden' }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}


export function SocialBannerTemplate({ kit, text }: TemplateProps) {
  const font = kit.font || 'Inter'
  return (
    <div style={{ width: 600, height: 314, background: `linear-gradient(135deg,${kit.primary}22,${kit.secondary}22)`, border: `1px solid ${kit.primary}30`, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: `'${font}',sans-serif`, padding: 40, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#060911' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${kit.primary},${kit.secondary},${kit.accent})` }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {kit.logo && <img src={kit.logo} alt="logo" style={{ height: 40, objectFit: 'contain', marginBottom: 20 }} />}
        <h2 style={{ fontSize: 32, fontWeight: 900, color: 'white', margin: '0 0 12px', letterSpacing: '-0.03em' }}>{text.headline || 'Your Headline Here'}</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', margin: '0 0 24px' }}>{text.subheadline || 'Your tagline or description'}</p>
        <div style={{ display: 'inline-block', padding: '10px 28px', borderRadius: 99, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 14 }}>{text.cta || 'Learn More'}</div>
      </div>
    </div>
  )
}

export function InstagramTemplate({ kit, text }: TemplateProps) {
  const font = kit.font || 'Inter'
  return (
    <div style={{ width: 320, height: 320, background: `linear-gradient(145deg,${kit.primary},${kit.secondary},${kit.accent})`, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: `'${font}',sans-serif`, padding: 32, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(0,0,0,0.15)' }} />
      <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
        <div style={{ fontSize: 42, marginBottom: 16 }}>{text.emoji || '✨'}</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.03em' }}>{text.headline || 'Your Message'}</h2>
        <p style={{ fontSize: 13, opacity: 0.85, margin: '0 0 20px' }}>{text.subheadline || 'Tagline goes here'}</p>
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.9 }}>{text.company || 'Company'}</div>
      </div>
    </div>
  )
}

export function EmailHeaderTemplate({ kit, text }: TemplateProps) {
  const font = kit.font || 'Inter'
  return (
    <div style={{ width: 600, height: 160, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', fontFamily: `'${font}',sans-serif`, color: 'white' }}>
      {kit.logo ? <img src={kit.logo} alt="logo" style={{ height: 44, objectFit: 'contain' }} /> : <div style={{ fontWeight: 900, fontSize: 22 }}>{text.company || 'Company'}</div>}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>{text.headline || 'Newsletter'}</div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>{text.subheadline || 'Monthly update'}</div>
      </div>
    </div>
  )
}

export function FlyerTemplate({ kit, text }: TemplateProps) {
  const font = kit.font || 'Inter'
  return (
    <div style={{ width: 298, height: 420, background: '#060911', borderRadius: 10, fontFamily: `'${font}',sans-serif`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 180, background: `linear-gradient(135deg,${kit.primary},${kit.secondary},${kit.accent})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {kit.logo ? <img src={kit.logo} alt="logo" style={{ height: 60, objectFit: 'contain', maxWidth: 140 }} /> : <div style={{ fontSize: 28, fontWeight: 900, color: 'white' }}>{text.company || 'Company'}</div>}
      </div>
      <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.2 }}>{text.headline || 'Event Title'}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.6 }}>{text.body || 'Add your event details, description or promotional copy here.'}</p>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {text.date && <div style={{ fontSize: 13, color: kit.accent, fontWeight: 600 }}>📅 {text.date}</div>}
          {text.location && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>📍 {text.location}</div>}
          <div style={{ padding: '10px 0', textAlign: 'center', borderRadius: 8, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 14, marginTop: 8 }}>{text.cta || 'RSVP Now'}</div>
        </div>
      </div>
    </div>
  )
}

export function PosterTemplate({ kit, text }: TemplateProps) {
  const font = kit.font || 'Inter'
  return (
    <div style={{ width: 320, height: 452, background: '#060911', borderRadius: 10, fontFamily: `'${font}',sans-serif`, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${kit.primary},${kit.secondary},${kit.accent})` }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, fontSize: 32 }}>
          {kit.logo ? <img src={kit.logo} alt="" style={{ width: 50, height: 50, objectFit: 'contain' }} /> : '✨'}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '0 0 16px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>{text.headline || 'Bold Statement'}</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '0 0 32px', lineHeight: 1.7 }}>{text.body || 'Supporting copy that gives context and drives action.'}</p>
        <div style={{ width: '100%', padding: '12px 0', textAlign: 'center', borderRadius: 99, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 15 }}>{text.cta || 'Get Started'}</div>
      </div>
      <div style={{ padding: '14px 24px', borderTop: `1px solid rgba(255,255,255,0.07)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: kit.accent }}>{text.company || 'Company'}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{text.website || 'www.company.com'}</div>
      </div>
    </div>
  )
}
