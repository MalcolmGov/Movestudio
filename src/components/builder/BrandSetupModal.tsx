import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Storage, BrandKit, PageSection, DEFAULT_SECTIONS } from '../../types'

const QUICK_TEMPLATES = [
  { id: 'saas',     icon: '⚡', label: 'SaaS Homepage',   color: '#3b82f6', sections: ['hero','features','stats','testimonials','pricing','faq','cta','footer'] },
  { id: 'ecommerce',icon: '🛍', label: 'E-commerce',      color: '#ef4444', sections: ['hero','logobar','features','stats','testimonials','newsletter','cta','footer'] },
  { id: 'personal', icon: '👤', label: 'Personal Brand',  color: '#10b981', sections: ['hero','features','timeline','testimonials','contact','footer'] },
  { id: 'agency',   icon: '🎨', label: 'Agency Portfolio',color: '#8b5cf6', sections: ['hero','logobar','features','team','timeline','testimonials','contact','footer'] },
  { id: 'event',    icon: '🎉', label: 'Event / Launch',  color: '#f59e0b', sections: ['hero','features','timeline','team','faq','newsletter','ctabanner','footer'] },
]

const INDUSTRIES = ['SaaS', 'Fintech', 'Retail', 'Agency', 'Healthcare', 'Education', 'Real Estate', 'Startup']
const TONES      = ['Premium', 'Bold', 'Friendly', 'Professional', 'Playful']
const FONTS      = ['Inter', 'Plus Jakarta Sans', 'Outfit', 'Sora', 'DM Sans', 'Space Grotesk', 'Manrope', 'Raleway']

interface Props {
  onComplete: (kit: BrandKit, sections: PageSection[]) => void
}

type Mode = 'choose' | 'existing' | 'fresh' | 'template'

export default function BrandSetupModal({ onComplete }: Props) {
  const [mode, setMode] = useState<Mode>('choose')
  const [kit, setKit] = useState<BrandKit>({
    logo: null, companyName: '', primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9',
    font: 'Inter', industry: 'SaaS', tone: 'Premium',
  })
  const [selectedTpl, setSelectedTpl] = useState<string | null>(null)
  const projects = Storage.getProjects()

  const applyTemplate = (tplId: string, baseKit: BrandKit): PageSection[] => {
    const tpl = QUICK_TEMPLATES.find(t => t.id === tplId)!
    return DEFAULT_SECTIONS.map(s => ({ ...s, enabled: tpl.sections.includes(s.type) }))
  }

  const inputStyle = (accent: string): React.CSSProperties => ({
    width: '100%', padding: '9px 13px', borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
    color: 'white', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font)',
  })
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6, marginTop: 14,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#040608', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font)' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, #3b82f618 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, #8b5cf612 0%, transparent 55%)' }} />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        style={{ position: 'relative', width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', background: '#080b14', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', padding: '40px', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}>

        <AnimatePresence mode="wait">

          {/* ── CHOOSE ── */}
          {mode === 'choose' && (
            <motion.div key="choose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🌐</div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 8 }}>Create Your Website</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>How would you like to start?</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {projects.length > 0 && (
                  <motion.button whileHover={{ scale: 1.02, borderColor: '#3b82f650' }} whileTap={{ scale: 0.98 }}
                    onClick={() => setMode('existing')}
                    style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${projects[0].kit.primary},${projects[0].kit.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✦</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 3 }}>Use Existing Brand Kit</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Continue with one of your {projects.length} saved brand{projects.length > 1 ? 's' : ''}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>›</div>
                    </div>
                  </motion.button>
                )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setMode('fresh')}
                  style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎨</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 3 }}>Set Up a New Brand</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Choose colours, fonts, and industry — takes 30 seconds</div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>›</div>
                  </div>
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setMode('template')}
                  style={{ padding: '20px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📐</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 3 }}>Browse Templates</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Start from a professionally designed layout</div>
                    </div>
                    <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>›</div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── EXISTING BRAND ── */}
          {mode === 'existing' && (
            <motion.div key="existing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <button onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0 }}>← Back</button>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Choose a Brand Kit</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Your saved brand kits will apply colours, fonts and logo automatically.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {projects.map(p => (
                  <motion.button key={p.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onComplete(p.kit, p.sections || DEFAULT_SECTIONS)}
                    style={{ padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ height: 36, width: 4, borderRadius: 2, background: `linear-gradient(to bottom,${p.kit.primary},${p.kit.secondary})`, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{p.kit.font} · {p.kit.industry} · {p.kit.tone}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {[p.kit.primary, p.kit.secondary, p.kit.accent].map((c, i) => (
                          <div key={i} style={{ width: 16, height: 16, borderRadius: 5, background: c, border: '1px solid rgba(255,255,255,0.15)' }} />
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── FRESH BRAND SETUP ── */}
          {mode === 'fresh' && (
            <motion.div key="fresh" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <button onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0 }}>← Back</button>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>Quick Brand Setup</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>You can fine-tune everything in the builder — this just gets you started.</p>

              {/* Company name + Logo row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 4 }}>
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input value={kit.companyName} onChange={e => setKit(p => ({ ...p, companyName: e.target.value }))}
                    placeholder="e.g. Acme Corp" style={inputStyle(kit.primary)} />
                </div>
                <div>
                  <label style={labelStyle}>Logo</label>
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 64, height: 40, borderRadius: 8, border: `1.5px dashed ${kit.logo ? kit.primary + '60' : 'rgba(255,255,255,0.15)'}`, background: 'rgba(255,255,255,0.02)', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                    {kit.logo
                      ? <img src={kit.logo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <span style={{ fontSize: 20 }}>📁</span>
                    }
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = ev => setKit(p => ({ ...p, logo: ev.target?.result as string }))
                        reader.readAsDataURL(file)
                      }} />
                  </label>
                </div>
              </div>

              <label style={labelStyle}>Brand Colours</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[['primary', 'Primary'], ['secondary', 'Secondary'], ['accent', 'Accent']] .map(([k, lbl]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{lbl}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
                      <input type="color" value={(kit as any)[k]}
                        onChange={e => setKit(prev => ({ ...prev, [k]: e.target.value }))}
                        style={{ width: 24, height: 24, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{(kit as any)[k].toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Font */}
              <label style={labelStyle}>Typeface</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {FONTS.map(f => (
                  <button key={f} onClick={() => setKit(p => ({ ...p, font: f }))}
                    style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${kit.font === f ? kit.primary + '60' : 'rgba(255,255,255,0.08)'}`, background: kit.font === f ? kit.primary + '18' : 'transparent', color: kit.font === f ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', fontFamily: `'${f}', sans-serif` }}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Industry + Tone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Industry</label>
                  <select value={kit.industry} onChange={e => setKit(p => ({ ...p, industry: e.target.value }))}
                    style={{ ...inputStyle(kit.primary), appearance: 'none' }}>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Brand Tone</label>
                  <select value={kit.tone} onChange={e => setKit(p => ({ ...p, tone: e.target.value }))}
                    style={{ ...inputStyle(kit.primary), appearance: 'none' }}>
                    {TONES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Preview swatch */}
              <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 12, background: `linear-gradient(135deg,${kit.primary}20,${kit.secondary}12)`, border: `1px solid ${kit.primary}30`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 900, background: `linear-gradient(135deg,${kit.primary},${kit.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: `'${kit.font}', sans-serif` }}>Aa</div>
                <div style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: `'${kit.font}', sans-serif` }}>{kit.font} · {kit.industry} · {kit.tone}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[kit.primary, kit.secondary, kit.accent].map((c, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 6, background: c }} />)}
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => onComplete(kit, DEFAULT_SECTIONS)}
                style={{ marginTop: 22, width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: `0 8px 28px ${kit.primary}40` }}>
                Build My Website →
              </motion.button>
            </motion.div>
          )}

          {/* ── TEMPLATE ── */}
          {mode === 'template' && (
            <motion.div key="template" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <button onClick={() => setMode('choose')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13, marginBottom: 20, padding: 0 }}>← Back</button>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>Choose a Template</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>All templates are fully customisable once loaded.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {QUICK_TEMPLATES.map(tpl => (
                  <motion.button key={tpl.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedTpl(tpl.id)}
                    style={{ padding: '18px 16px', borderRadius: 14, border: `2px solid ${selectedTpl === tpl.id ? tpl.color : 'rgba(255,255,255,0.08)'}`, background: selectedTpl === tpl.id ? `${tpl.color}12` : 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{tpl.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{tpl.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{tpl.sections.length} sections</div>
                  </motion.button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { if (selectedTpl) onComplete(kit, applyTemplate(selectedTpl, kit)) }}
                disabled={!selectedTpl}
                style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: selectedTpl ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)' : 'rgba(255,255,255,0.06)', color: selectedTpl ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 800, fontSize: 15, cursor: selectedTpl ? 'pointer' : 'not-allowed' }}>
                {selectedTpl ? `Use ${QUICK_TEMPLATES.find(t => t.id === selectedTpl)?.label} Template →` : 'Select a template first'}
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  )
}
