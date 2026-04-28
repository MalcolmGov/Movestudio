import { useRef } from 'react'
import { BrandKit, SectionType, SectionContent, PageSection } from '../../types'
import { REGISTRY } from '../../registry'
import SectionContentEditor from './SectionContentEditor'

type FieldDef = { key: string; label: string; type: 'text' | 'textarea' | 'url' | 'color' }

const FIELDS: Partial<Record<SectionType, FieldDef[]>> = {
  navbar:       [{ key:'navCta',label:'CTA Button Text',type:'text'}],
  hero:         [{ key:'badgeText',label:'Badge Text',type:'text'},{ key:'headline',label:'Headline',type:'textarea'},{ key:'subheadline',label:'Sub-headline',type:'textarea'},{ key:'ctaText',label:'Primary Button',type:'text'},{ key:'ctaSecondary',label:'Secondary Button',type:'text'}],
  features:     [{ key:'featuresTitle',label:'Section Title',type:'text'}],
  stats:        [],
  gallery:      [{ key:'galleryTitle',label:'Section Title',type:'text'},{ key:'gallerySubtitle',label:'Subtitle',type:'textarea'}],
  services:     [{ key:'servicesTitle',label:'Section Title',type:'text'},{ key:'servicesSubtitle',label:'Subtitle',type:'textarea'}],
  process:      [{ key:'processTitle',label:'Section Title',type:'text'},{ key:'processSubtitle',label:'Subtitle',type:'textarea'}],
  blog:         [{ key:'blogTitle',label:'Section Title',type:'text'},{ key:'blogSubtitle',label:'Subtitle',type:'textarea'}],
  comparison:   [{ key:'comparisonTitle',label:'Section Title',type:'text'},{ key:'comparisonSubtitle',label:'Subtitle',type:'textarea'}],
  map:          [{ key:'mapTitle',label:'Section Title',type:'text'},{ key:'mapCity',label:'City / Region',type:'text'},{ key:'mapAddress',label:'Full Address',type:'text'},{ key:'mapPhone',label:'Phone',type:'text'},{ key:'mapEmail',label:'Email',type:'text'}],
  booking:      [{ key:'bookingTitle',label:'Section Title',type:'text'},{ key:'bookingSubtitle',label:'Subtitle',type:'textarea'},{ key:'bookingButton',label:'Submit Button',type:'text'}],
  cta:          [{ key:'ctaTitle',label:'Headline',type:'text'},{ key:'ctaBody',label:'Description',type:'textarea'},{ key:'ctaButton',label:'Button Text',type:'text'}],
  ctabanner:    [{ key:'bannerText',label:'Banner Text',type:'text'},{ key:'bannerButton',label:'Button',type:'text'},{ key:'bannerSub',label:'Sub Text',type:'text'}],
  footer:       [{ key:'footerBrand',label:'Brand Name',type:'text'},{ key:'footerTagline',label:'Tagline',type:'text'}],
  faq:          [{ key:'faqTitle',label:'Section Title',type:'text'}],
  team:         [{ key:'teamTitle',label:'Section Title',type:'text'}],
  testimonials: [{ key:'testimonialsTitle',label:'Section Title',type:'text'}],
  pricing:      [{ key:'pricingTitle',label:'Section Title',type:'text'}],
  logobar:      [{ key:'logoBarLabel',label:'Label Text',type:'text'}],
  newsletter:   [{ key:'newsletterTitle',label:'Headline',type:'text'},{ key:'newsletterBody',label:'Body',type:'textarea'},{ key:'newsletterButton',label:'Button',type:'text'},{ key:'newsletterPlaceholder',label:'Placeholder',type:'text'}],
  contact:      [{ key:'contactTitle',label:'Headline',type:'text'},{ key:'contactBody',label:'Description',type:'textarea'}],
  video:        [{ key:'videoTitle',label:'Headline',type:'text'},{ key:'videoBody',label:'Description',type:'textarea'},{ key:'videoUrl',label:'Video URL (YouTube embed)',type:'url'}],
  timeline:     [{ key:'timelineTitle',label:'Section Title',type:'text'}],
}

const GALLERY_SLOTS = 6

const FONTS = ['Inter','Plus Jakarta Sans','Outfit','Sora','DM Sans','Space Grotesk','Manrope','Raleway']
const INDUSTRIES = ['SaaS','Fintech','Retail','Agency','Healthcare','Education','Real Estate','Startup']
const TONES = ['Premium','Bold','Friendly','Professional','Playful']

// Helper: upload file to base64
function useBase64Upload(onDone: (b64: string) => void) {
  const ref = useRef<HTMLInputElement>(null)
  const trigger = () => ref.current?.click()
  const inputEl = (
    <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }}
      onChange={e => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = ev => { onDone(ev.target?.result as string); e.target.value = '' }
        reader.readAsDataURL(file)
      }} />
  )
  return { trigger, inputEl }
}

interface Props {
  kit: BrandKit
  sectionType: SectionType | null
  componentKey?: string | null
  componentName?: string | null
  componentText?: string
  componentTextColorMode?: 'solid' | 'gradient'
  componentTextColor?: string
  componentTextGradientFrom?: string
  componentTextGradientTo?: string
  componentTextGradientAngle?: string
  headingColorMode?: 'solid' | 'gradient'
  headingColor?: string
  headingGradientFrom?: string
  headingGradientTo?: string
  headingGradientAngle?: string
  sectionBgType?: string
  sectionBgColor?: string
  sectionBgGradientFrom?: string
  sectionBgGradientTo?: string
  sectionBgGradientAngle?: string
  sectionBgImage?: string
  sectionFont?: string
  content: SectionContent
  selectedSection?: PageSection | null
  activePanel: 'brand' | 'section' | 'page'
  pageTitle: string
  pageMeta: string
  onKitChange: (k: BrandKit) => void
  onContentChange: (key: string, val: string) => void
  onContentBatch: (updates: Record<string, string>) => void
  onSectionContentUpdate?: (update: Partial<SectionContent>) => void
  onPageChange: (title: string, meta: string) => void
  onPanelChange: (p: 'brand' | 'section' | 'page') => void
}

export default function SettingsPanel({
  kit, sectionType, componentKey, componentName, componentText,
  componentTextColorMode, componentTextColor, componentTextGradientFrom, componentTextGradientTo, componentTextGradientAngle,
  headingColorMode, headingColor, headingGradientFrom, headingGradientTo, headingGradientAngle,
  sectionBgType, sectionBgColor, sectionBgGradientFrom, sectionBgGradientTo, sectionBgGradientAngle, sectionBgImage, sectionFont,
  content, selectedSection, activePanel, pageTitle, pageMeta,
  onKitChange, onContentChange, onContentBatch, onSectionContentUpdate, onPageChange, onPanelChange
}: Props) {
  const fields = sectionType && !componentKey ? (FIELDS[sectionType] || []) : []
  const isGallery = sectionType === 'gallery' && !componentKey
  // Sections that have rich array content — use SectionContentEditor
  const RICH_SECTIONS: SectionType[] = ['navbar','hero','features','stats','testimonials','pricing','faq','team','logobar','cta','footer','newsletter','contact','video','ctabanner','timeline']
  const useRichEditor = !componentKey && selectedSection && RICH_SECTIONS.includes(selectedSection.type)

  const inputSt: React.CSSProperties = {
    width: '100%', padding: '8px 11px', borderRadius: 7,
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
    color: 'white', fontSize: 12, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font)', resize: 'vertical' as const,
  }
  const lbl: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
    textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 5, marginTop: 13,
  }

  // Logo upload
  const logoUpload = useBase64Upload(b64 => onKitChange({ ...kit, logo: b64 }))

  return (
    <div style={{ width: 260, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: '#080b14', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        {(['section','brand','page'] as const).map(t => (
          <button key={t} onClick={() => onPanelChange(t)}
            style={{ flex: 1, padding: '11px 4px', border: 'none', background: 'transparent', color: activePanel === t ? 'white' : 'rgba(255,255,255,0.35)', fontWeight: activePanel === t ? 700 : 400, fontSize: 11, cursor: 'pointer', borderBottom: `2px solid ${activePanel === t ? kit.primary : 'transparent'}`, textTransform: 'capitalize' }}>
            {t === 'section' ? '✏️' : t === 'brand' ? '🎨' : '📄'} {t}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 24px' }}>

        {/* ── SECTION TAB ── */}
        {activePanel === 'section' && (
          <>
            {/* Component Block Editor */}
            {componentKey ? (
              <>
                <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 12, background: `${kit.accent}10`, border: `1px solid ${kit.accent}25`, marginBottom: 2 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: kit.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>⚡ Component Block</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>{componentName || componentKey}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{REGISTRY[componentKey]?.description || 'A premium interactive component'}</div>
                </div>
                <label style={lbl}>Custom Text</label>
                <textarea rows={3} style={inputSt} value={componentText || ''}
                  placeholder="Type your text here…"
                  onChange={e => onContentChange('componentText', e.target.value)} />
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 6, lineHeight: 1.6 }}>
                  💡 Supports: Blur, Split, Gradient, Shiny, Typewriter, Word Reveal, Letter Pull Up, Highlight, Scramble text components.
                </div>

                {/* ── Text Colour Control ── */}
                <TextColorControl
                  label="Text Colour"
                  mode={componentTextColorMode || 'solid'}
                  solidColor={componentTextColor || '#ffffff'}
                  gradientFrom={componentTextGradientFrom || '#67e8f9'}
                  gradientTo={componentTextGradientTo || '#8b5cf6'}
                  gradientAngle={componentTextGradientAngle || '135'}
                  accentColor={kit.accent}
                  onModeChange={m => onContentChange('componentTextColorMode', m)}
                  onSolidChange={c => onContentBatch({ componentTextColorMode: 'solid', componentTextColor: c })}
                  onFromChange={c => onContentBatch({ componentTextColorMode: 'gradient', componentTextGradientFrom: c })}
                  onToChange={c => onContentBatch({ componentTextColorMode: 'gradient', componentTextGradientTo: c })}
                  onAngleChange={a => onContentBatch({ componentTextColorMode: 'gradient', componentTextGradientAngle: a })}
                />
                {REGISTRY[componentKey]?.props && (
                  <>
                    <label style={{ ...lbl, marginTop: 18 }}>Props Reference</label>
                    {REGISTRY[componentKey].props.map((p: any) => (
                      <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{p.desc}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                          <div style={{ fontSize: 10, color: kit.accent, fontFamily: 'monospace' }}>{p.type}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>= {p.default}</div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>

            ) : !sectionType ? (
              <div style={{ padding: '40px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.22)', fontSize: 12, lineHeight: 1.8 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>👆</div>
                Click a section on the canvas, then press <strong style={{ color: 'rgba(255,255,255,0.5)' }}>✏️ Edit</strong> to customise it.
              </div>

            ) : useRichEditor && selectedSection ? (
              // ── Rich content editor (features, stats, cards, etc.) ──
              <>
                <SectionContentEditor
                  section={selectedSection}
                  kit={kit}
                  onUpdate={update => onSectionContentUpdate?.(update)}
                />
                {/* Style controls below content editor */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 4, paddingTop: 12 }}>
                  <TextColorControl
                    label="Heading Colour"
                    mode={headingColorMode || 'solid'}
                    solidColor={headingColor || '#ffffff'}
                    gradientFrom={headingGradientFrom || '#67e8f9'}
                    gradientTo={headingGradientTo || '#8b5cf6'}
                    gradientAngle={headingGradientAngle || '135'}
                    accentColor={kit.accent}
                    onModeChange={m => onContentChange('headingColorMode', m)}
                    onSolidChange={c => onContentChange('headingColor', c)}
                    onFromChange={c => onContentChange('headingGradientFrom', c)}
                    onToChange={c => onContentChange('headingGradientTo', c)}
                    onAngleChange={a => onContentChange('headingGradientAngle', a)}
                  />
                  <SectionBgControls
                    sectionBgType={sectionBgType} sectionBgColor={sectionBgColor}
                    sectionBgGradientFrom={sectionBgGradientFrom} sectionBgGradientTo={sectionBgGradientTo}
                    sectionBgGradientAngle={sectionBgGradientAngle} sectionBgImage={sectionBgImage}
                    sectionFont={sectionFont} kit={kit} inputSt={inputSt} lbl={lbl}
                    onContentChange={onContentChange}
                  />
                </div>
              </>

            ) : (
              <>
                <div style={{ padding: '12px 0 8px', fontSize: 12, fontWeight: 700, color: 'white', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{(['gallery','services','process','blog','comparison','map','booking'] as SectionType[]).includes(sectionType) ? { gallery:'🖼', services:'🛠', process:'⚙️', blog:'📝', comparison:'⚖️', map:'📍', booking:'📆' }[sectionType as string] || '' : ''}</span>
                  {sectionType.replace(/-/g,' ')} Section
                </div>

                {/* Standard text fields */}
                {fields.map(f => (
                  <div key={f.key}>
                    <label style={lbl}>{f.label}</label>
                    {f.type === 'textarea'
                      ? <textarea rows={3} style={inputSt} value={(content as any)[f.key] || ''} onChange={e => onContentChange(f.key, e.target.value)} />
                      : <input type={f.type} style={inputSt} value={(content as any)[f.key] || ''} onChange={e => onContentChange(f.key, e.target.value)} />
                    }
                  </div>
                ))}

                <TextColorControl
                  label="Heading Colour"
                  mode={headingColorMode || 'solid'}
                  solidColor={headingColor || '#ffffff'}
                  gradientFrom={headingGradientFrom || '#67e8f9'}
                  gradientTo={headingGradientTo || '#8b5cf6'}
                  gradientAngle={headingGradientAngle || '135'}
                  accentColor={kit.accent}
                  onModeChange={m => onContentChange('headingColorMode', m)}
                  onSolidChange={c => onContentChange('headingColor', c)}
                  onFromChange={c => onContentChange('headingGradientFrom', c)}
                  onToChange={c => onContentChange('headingGradientTo', c)}
                  onAngleChange={a => onContentChange('headingGradientAngle', a)}
                />

                {/* ── Section Background ── */}
                <div style={{ marginTop: 20 }}>
                  <label style={lbl}>Section Background</label>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                    {(['default','solid','gradient','image'] as const).map(t => (
                      <button key={t} onClick={() => onContentChange('sectionBgType', t)}
                        style={{ flex: 1, padding: '5px 4px', borderRadius: 6, border: `1px solid ${sectionBgType === t ? kit.accent : 'rgba(255,255,255,0.1)'}`, background: sectionBgType === t ? `${kit.accent}22` : 'rgba(255,255,255,0.04)', color: sectionBgType === t ? kit.accent : 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>
                        {t === 'default' ? '↺' : t === 'solid' ? '■' : t === 'gradient' ? '▦' : '🖼'} {t}
                      </button>
                    ))}
                  </div>
                  {sectionBgType === 'solid' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="color" value={sectionBgColor || '#060911'} onChange={e => onContentChange('sectionBgColor', e.target.value)}
                        style={{ width: 36, height: 36, borderRadius: 7, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', background: 'none' }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{sectionBgColor || '#060911'}</span>
                    </div>
                  )}
                  {sectionBgType === 'gradient' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="color" value={sectionBgGradientFrom || '#060911'} onChange={e => onContentChange('sectionBgGradientFrom', e.target.value)}
                          style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', background: 'none' }} />
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>→</span>
                        <input type="color" value={sectionBgGradientTo || '#111827'} onChange={e => onContentChange('sectionBgGradientTo', e.target.value)}
                          style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', background: 'none' }} />
                        <div style={{ flex: 1, height: 20, borderRadius: 4, background: `linear-gradient(90deg,${sectionBgGradientFrom || '#060911'},${sectionBgGradientTo || '#111827'})` }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>Angle {sectionBgGradientAngle || 135}°</span>
                        <input type="range" min={0} max={360} value={sectionBgGradientAngle || '135'} onChange={e => onContentChange('sectionBgGradientAngle', e.target.value)}
                          style={{ flex: 1 }} />
                      </div>
                    </div>
                  )}
                  {sectionBgType === 'image' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: 18 }}>🖼</span>
                        <div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Upload Background Image</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>PNG, JPG, WebP</div>
                        </div>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                          const file = e.target.files?.[0]; if (!file) return
                          const reader = new FileReader()
                          reader.onload = ev => onContentChange('sectionBgImage', ev.target?.result as string)
                          reader.readAsDataURL(file)
                        }} />
                      </label>
                      {sectionBgImage && (
                        <div style={{ position: 'relative' }}>
                          <img src={sectionBgImage} alt="bg" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6 }} />
                          <button onClick={() => onContentChange('sectionBgImage', '')} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', borderRadius: 4, cursor: 'pointer', fontSize: 11, padding: '2px 6px' }}>✕</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Section Font ── */}
                <div style={{ marginTop: 18 }}>
                  <label style={lbl}>Section Font</label>
                  <select value={sectionFont || ''} onChange={e => onContentChange('sectionFont', e.target.value)}
                    style={{ ...inputSt, fontFamily: sectionFont ? `'${sectionFont}',sans-serif` : 'inherit' }}>
                    <option value="">— Use Brand Font —</option>
                    {['Inter','Outfit','Sora','DM Sans','Space Grotesk','Raleway','Playfair Display','Merriweather','Fira Code','JetBrains Mono','Oswald','Bebas Neue'].map(f => (
                      <option key={f} value={f} style={{ fontFamily: `'${f}',sans-serif` }}>{f}</option>
                    ))}
                  </select>
                </div>

                {/* ── GALLERY: Image uploads per slot ── */}
                {isGallery && (
                  <>
                    <label style={{ ...lbl, marginTop: 18 }}>Gallery Images</label>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10, lineHeight: 1.5 }}>
                      Upload photos for each gallery card. PNG, JPG, WebP, or SVG.
                    </div>
                    {Array.from({ length: GALLERY_SLOTS }, (_, i) => {
                      const imgKey = `galleryImage${i}`
                      const currentImg = (content as any)[imgKey] as string | undefined
                      const defaultLabels = ['Brand Identity','Web Design','Mobile App','Campaign','Motion Design','Photography']
                      return (
                        <GallerySlot
                          key={i}
                          index={i}
                          label={defaultLabels[i] || `Image ${i + 1}`}
                          currentImg={currentImg}
                          accentColor={kit.accent}
                          primaryColor={kit.primary}
                          onUpload={b64 => onContentChange(imgKey, b64)}
                          onRemove={() => onContentChange(imgKey, '')}
                        />
                      )
                    })}
                  </>
                )}

                {/* If no fields and not gallery, show canvas-edit hint */}
                {fields.length === 0 && !isGallery && (
                  <div style={{ padding: '16px 0', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 12, lineHeight: 1.7 }}>
                    Click any text directly on the canvas to edit it inline.
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── BRAND TAB ── */}
        {activePanel === 'brand' && (
          <>
            {/* Logo */}
            <label style={lbl}>Logo</label>
            {logoUpload.inputEl}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
              {kit.logo && (
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <img src={kit.logo} alt="logo" style={{ height: 48, maxWidth: '100%', objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#111', padding: 4 }} />
                  <button onClick={() => onKitChange({ ...kit, logo: null })}
                    style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', border: 'none', background: '#ef4444', color: 'white', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>✕</button>
                </div>
              )}
              <button onClick={logoUpload.trigger}
                onMouseEnter={e => (e.currentTarget.style.borderColor = kit.primary + '60')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                style={{ padding: '9px 12px', borderRadius: 8, border: '1.5px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.45)', transition: 'border-color 0.15s', width: '100%' }}>
                {kit.logo ? '🔄 Replace logo' : '📁 Upload logo (PNG / SVG / JPG)'}
              </button>
            </div>

            {/* Company Name */}
            <label style={lbl}>Company Name</label>
            <input style={inputSt} value={kit.companyName || ''} placeholder="YourBrand"
              onChange={e => onKitChange({ ...kit, companyName: e.target.value })} />

            {/* Colours */}
            <label style={lbl}>Primary Colour</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
              <input type="color" value={kit.primary} onChange={e => onKitChange({ ...kit, primary: e.target.value })} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 4 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{kit.primary.toUpperCase()}</span>
            </div>
            <label style={lbl}>Secondary</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
              <input type="color" value={kit.secondary} onChange={e => onKitChange({ ...kit, secondary: e.target.value })} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 4 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{kit.secondary.toUpperCase()}</span>
            </div>
            <label style={lbl}>Accent</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
              <input type="color" value={kit.accent} onChange={e => onKitChange({ ...kit, accent: e.target.value })} style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 4 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{kit.accent.toUpperCase()}</span>
            </div>

            <label style={lbl}>Typeface</label>
            {FONTS.map(f => (
              <button key={f} onClick={() => onKitChange({ ...kit, font: f })}
                style={{ display: 'block', width: '100%', marginBottom: 4, padding: '7px 10px', borderRadius: 7, border: `1px solid ${kit.font === f ? kit.primary + '60' : 'rgba(255,255,255,0.07)'}`, background: kit.font === f ? kit.primary + '18' : 'transparent', color: kit.font === f ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', textAlign: 'left', fontFamily: `'${f}', sans-serif` }}>
                {f}
              </button>
            ))}
            <label style={lbl}>Industry</label>
            <select value={kit.industry} onChange={e => onKitChange({ ...kit, industry: e.target.value })} style={{ ...inputSt, appearance: 'none' as any }}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
            <label style={lbl}>Tone</label>
            <select value={kit.tone} onChange={e => onKitChange({ ...kit, tone: e.target.value })} style={{ ...inputSt, appearance: 'none' as any }}>
              {TONES.map(t => <option key={t}>{t}</option>)}
            </select>
          </>
        )}

        {/* ── PAGE TAB ── */}
        {activePanel === 'page' && (
          <>
            <label style={lbl}>Page Title</label>
            <input style={inputSt} value={pageTitle} onChange={e => onPageChange(e.target.value, pageMeta)} placeholder="My Awesome Product" />
            <label style={lbl}>Meta Description</label>
            <textarea rows={4} style={inputSt} value={pageMeta} onChange={e => onPageChange(pageTitle, e.target.value)} placeholder="Describe your page for search engines..." />
            <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>SEO PREVIEW</div>
              <div style={{ fontSize: 14, color: '#60a5fa', fontWeight: 600, marginBottom: 2 }}>{pageTitle || 'Untitled Page'}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{pageMeta || 'Add a description for search engines...'}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Text Colour Control ───────────────────────────────────
function TextColorControl({ label, mode, solidColor, gradientFrom, gradientTo, gradientAngle, accentColor, onModeChange, onSolidChange, onFromChange, onToChange, onAngleChange }: {
  label: string
  mode: 'solid' | 'gradient'
  solidColor: string
  gradientFrom: string
  gradientTo: string
  gradientAngle: string
  accentColor: string
  onModeChange: (m: 'solid' | 'gradient') => void
  onSolidChange: (c: string) => void
  onFromChange: (c: string) => void
  onToChange: (c: string) => void
  onAngleChange: (a: string) => void
}) {
  const previewStyle: React.CSSProperties = mode === 'gradient'
    ? { background: `linear-gradient(${gradientAngle}deg,${gradientFrom},${gradientTo})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }
    : { color: solidColor }

  return (
    <div style={{ marginTop: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
        {/* Live preview swatch */}
        <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-0.03em', ...previewStyle }}>Aa</span>
      </div>

      {/* Solid / Gradient toggle */}
      <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 10 }}>
        {(['solid', 'gradient'] as const).map(m => (
          <button key={m} onClick={() => onModeChange(m)}
            style={{ flex: 1, padding: '6px 0', border: 'none', background: mode === m ? `${accentColor}22` : 'transparent', color: mode === m ? accentColor : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: mode === m ? 700 : 400, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}>
            {m === 'solid' ? '■ Solid' : '◫ Gradient'}
          </button>
        ))}
      </div>

      {mode === 'solid' ? (
        /* Single colour picker */
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
          <input type="color" value={solidColor} onChange={e => onSolidChange(e.target.value)}
            style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 6, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', flex: 1 }}>{solidColor.toUpperCase()}</span>
          {/* Quick presets */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['#ffffff','#000000','#67e8f9','#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981'].map(c => (
              <button key={c} onClick={() => onSolidChange(c)}
                style={{ width: 14, height: 14, borderRadius: 3, background: c, border: solidColor === c ? `2px solid ${accentColor}` : '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
            ))}
          </div>
        </div>
      ) : (
        /* Gradient: From → To + angle */
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {/* From */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>From</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                <input type="color" value={gradientFrom} onChange={e => onFromChange(e.target.value)}
                  style={{ width: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 4, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{gradientFrom.toUpperCase()}</span>
              </div>
            </div>
            {/* To */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>To</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
                <input type="color" value={gradientTo} onChange={e => onToChange(e.target.value)}
                  style={{ width: 24, height: 24, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: 4, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{gradientTo.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Gradient preview bar */}
          <div style={{ height: 8, borderRadius: 99, background: `linear-gradient(${gradientAngle}deg,${gradientFrom},${gradientTo})`, marginBottom: 8 }} />

          {/* Quick preset gradients */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            {[
              { label:'Ocean',   from:'#67e8f9', to:'#3b82f6' },
              { label:'Purple',  from:'#8b5cf6', to:'#ec4899' },
              { label:'Fire',    from:'#f59e0b', to:'#ef4444' },
              { label:'Mint',    from:'#10b981', to:'#67e8f9' },
              { label:'Gold',    from:'#fbbf24', to:'#f59e0b' },
              { label:'Sunset',  from:'#ec4899', to:'#f97316' },
              { label:'Aurora',  from:'#34d399', to:'#818cf8' },
              { label:'Steel',   from:'#94a3b8', to:'#e2e8f0' },
            ].map(p => (
              <button key={p.label} onClick={() => { onFromChange(p.from); onToChange(p.to) }}
                style={{ padding: '3px 8px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.12)', background: `linear-gradient(90deg,${p.from},${p.to})`, fontSize: 9, color: 'white', cursor: 'pointer', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Angle slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>Angle</span>
            <input type="range" min={0} max={360} value={parseInt(gradientAngle) || 135}
              onChange={e => onAngleChange(e.target.value)}
              style={{ flex: 1, accentColor: accentColor }} />
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', minWidth: 28, textAlign: 'right' }}>{gradientAngle}°</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Gallery Image Slot ─────────────────────────────────────
function GallerySlot({ index, label, currentImg, accentColor, primaryColor, onUpload, onRemove }: {
  index: number; label: string; currentImg?: string
  accentColor: string; primaryColor: string
  onUpload: (b64: string) => void; onRemove: () => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div style={{ marginBottom: 8, borderRadius: 10, border: `1px solid ${currentImg ? accentColor + '40' : 'rgba(255,255,255,0.08)'}`, background: 'rgba(255,255,255,0.02)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = ev => { onUpload(ev.target?.result as string); e.target.value = '' }
          reader.readAsDataURL(file)
        }} />

      {currentImg ? (
        /* Preview + actions */
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
          <img src={currentImg} alt={label} style={{ width: 52, height: 38, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</div>
            <div style={{ fontSize: 10, color: accentColor }}>✓ Image uploaded</div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onClick={() => fileRef.current?.click()}
              style={{ padding: '4px 8px', borderRadius: 5, border: 'none', background: `${primaryColor}20`, color: 'white', fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>
              Change
            </button>
            <button onClick={onRemove}
              style={{ padding: '4px 8px', borderRadius: 5, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: 10, cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        </div>
      ) : (
        /* Upload prompt */
        <button onClick={() => fileRef.current?.click()}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 10px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <div style={{ width: 52, height: 38, borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📸</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 1 }}>Slot {index + 1}: {label}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Click to upload image</div>
          </div>
        </button>
      )}
    </div>
  )
}

// ── Section Background + Font Controls (shared) ───────────
function SectionBgControls({ sectionBgType, sectionBgColor, sectionBgGradientFrom, sectionBgGradientTo, sectionBgGradientAngle, sectionBgImage, sectionFont, kit, inputSt, lbl, onContentChange }: {
  sectionBgType?: string; sectionBgColor?: string; sectionBgGradientFrom?: string; sectionBgGradientTo?: string
  sectionBgGradientAngle?: string; sectionBgImage?: string; sectionFont?: string
  kit: BrandKit; inputSt: React.CSSProperties; lbl: React.CSSProperties
  onContentChange: (key: string, val: string) => void
}) {
  return (
    <>
      <div style={{ marginTop: 20 }}>
        <label style={lbl}>Section Background</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {(['default','solid','gradient','image'] as const).map(t => (
            <button key={t} onClick={() => onContentChange('sectionBgType', t)}
              style={{ flex: 1, padding: '5px 4px', borderRadius: 6, border: `1px solid ${sectionBgType === t ? kit.accent : 'rgba(255,255,255,0.1)'}`, background: sectionBgType === t ? `${kit.accent}22` : 'rgba(255,255,255,0.04)', color: sectionBgType === t ? kit.accent : 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>
              {t === 'default' ? '↺' : t === 'solid' ? '■' : t === 'gradient' ? '▦' : '🖼'} {t}
            </button>
          ))}
        </div>
        {sectionBgType === 'solid' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" value={sectionBgColor || '#060911'} onChange={e => onContentChange('sectionBgColor', e.target.value)}
              style={{ width: 36, height: 36, borderRadius: 7, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', background: 'none' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{sectionBgColor || '#060911'}</span>
          </div>
        )}
        {sectionBgType === 'gradient' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={sectionBgGradientFrom || '#060911'} onChange={e => onContentChange('sectionBgGradientFrom', e.target.value)}
                style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', background: 'none' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>→</span>
              <input type="color" value={sectionBgGradientTo || '#111827'} onChange={e => onContentChange('sectionBgGradientTo', e.target.value)}
                style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', background: 'none' }} />
              <div style={{ flex: 1, height: 20, borderRadius: 4, background: `linear-gradient(90deg,${sectionBgGradientFrom || '#060911'},${sectionBgGradientTo || '#111827'})` }} />
            </div>
          </div>
        )}
        {sectionBgType === 'image' && sectionBgImage && (
          <div style={{ position: 'relative' }}>
            <img src={sectionBgImage} alt="bg" style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 6 }} />
            <button onClick={() => onContentChange('sectionBgImage', '')} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', borderRadius: 4, cursor: 'pointer', fontSize: 11, padding: '2px 6px' }}>✕</button>
          </div>
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={lbl}>Section Font</label>
        <select value={sectionFont || ''} onChange={e => onContentChange('sectionFont', e.target.value)} style={{ ...inputSt }}>
          <option value="">— Use Brand Font —</option>
          {['Inter','Outfit','Sora','DM Sans','Space Grotesk','Raleway','Playfair Display','Merriweather','Fira Code','Oswald','Bebas Neue'].map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
    </>
  )
}
