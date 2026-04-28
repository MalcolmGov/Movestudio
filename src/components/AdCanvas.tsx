import { motion } from 'framer-motion'
import { AdFormat, FORMAT_META, GeneratedAd } from '../utils/adCopyEngine'

interface Props {
  format: AdFormat
  ad: GeneratedAd
  kit: { primary: string; secondary: string; accent: string; font: string; logo: string | null; brandName?: string }
}

export default function AdCanvas({ format, ad, kit }: Props) {
  const meta = FORMAT_META[format]
  const [w, h] = meta.dims
  const font = `'${kit.font}', sans-serif`
  const isStory = format === 'instagram-story'
  const isReel = format === 'instagram-reel' || format === 'facebook-reel'
  const isLinkedIn = format === 'linkedin-post'
  const isVertical = isStory || isReel

  return (
    <motion.div
      id="ad-canvas-root"
      key={format + ad.headline}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        width: w,
        height: h,
        borderRadius: isVertical ? 20 : 14,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)`,
        background: `radial-gradient(ellipse at 20% 30%, ${kit.primary}60 0%, transparent 55%),
                     radial-gradient(ellipse at 80% 70%, ${kit.secondary}45 0%, transparent 50%),
                     #0a0d1a`,
        fontFamily: font,
        userSelect: 'none',
      }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${kit.primary}10 1px,transparent 1px),linear-gradient(90deg,${kit.primary}10 1px,transparent 1px)`, backgroundSize: '28px 28px', pointerEvents: 'none' }} />

      {/* Glow orb */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: isVertical ? 120 : 160, height: isVertical ? 120 : 160, borderRadius: '50%', background: `radial-gradient(circle,${kit.accent}40,transparent 70%)`, pointerEvents: 'none' }} />

      {/* Logo / brand name top-left */}
      <div style={{ position: 'absolute', top: 16, left: 18, display: 'flex', alignItems: 'center', gap: 8, zIndex: 3 }}>
        {kit.logo
          ? <img src={kit.logo} style={{ height: isVertical ? 22 : 26, objectFit: 'contain', filter: 'brightness(1.2)' }} alt="logo" />
          : <div style={{ fontSize: isVertical ? 13 : 15, fontWeight: 900, background: `linear-gradient(135deg,${kit.primary},${kit.accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{kit.brandName || 'YourBrand'}</div>
        }
      </div>

      {/* Ad type badge */}
      <div style={{ position: 'absolute', top: 16, right: 16, padding: '3px 10px', borderRadius: 99, background: `${kit.primary}25`, border: `1px solid ${kit.primary}40`, fontSize: 10, fontWeight: 700, color: kit.accent, zIndex: 3 }}>{meta.icon} {meta.label}</div>

      {/* REEL layout */}
      {isReel ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 2 }}>
          {/* Centre play button */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
              style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              ▶
            </motion.div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {format === 'instagram-reel' ? 'Instagram' : 'Facebook'} Reel
            </div>
          </div>
          {/* Right-side action icons (IG/FB Reel style) */}
          <div style={{ position: 'absolute', right: 12, bottom: 120, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            {['❤️', '💬', '↗️'].map((icon, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{['2.4K', '318', 'Share'][i]}</div>
              </div>
            ))}
          </div>
          {/* Audio wave decoration */}
          <div style={{ position: 'absolute', bottom: 76, left: 14, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            {[6, 10, 14, 10, 8, 12, 16, 10, 6].map((h, i) => (
              <motion.div key={i} animate={{ height: [h, h * 1.5, h] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                style={{ width: 3, height: h, borderRadius: 2, background: kit.accent + '90' }} />
            ))}
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginLeft: 5 }}>Original Audio</span>
          </div>
          {/* Bottom caption */}
          <div style={{ padding: '12px 14px 20px', background: 'linear-gradient(to top,rgba(0,0,0,0.85),transparent)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 5, letterSpacing: '-0.02em' }}>{ad.headline}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{ad.subheadline}</div>
            <div style={{ display: 'inline-flex', padding: '6px 14px', borderRadius: 99, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 11, boxShadow: `0 4px 14px ${kit.primary}50` }}>
              {ad.cta} {ad.emojiSet[1]}
            </div>
          </div>
        </div>
      ) : isStory ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', zIndex: 2 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: kit.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{ad.emojiSet[0]} New</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: 14, letterSpacing: '-0.03em' }}>{ad.headline}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 28, lineHeight: 1.5 }}>{ad.subheadline}</div>
          <div style={{ padding: '11px 24px', borderRadius: 99, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 13, boxShadow: `0 8px 24px ${kit.primary}50` }}>
            {ad.cta} {ad.emojiSet[1]}
          </div>
          <div style={{ position: 'absolute', bottom: 32, fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>Swipe up ↑</div>
        </div>
      ) : isLinkedIn ? (
        /* LINKEDIN layout */
        <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 2 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 28px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: kit.accent, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>💼 Sponsored</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 10, letterSpacing: '-0.02em' }}>{ad.headline}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 16 }}>{ad.subheadline}</div>
            <div style={{ display: 'inline-flex', padding: '8px 18px', borderRadius: 7, background: `${kit.primary}22`, border: `1px solid ${kit.primary}40`, color: 'white', fontWeight: 700, fontSize: 12, width: 'fit-content' }}>{ad.cta}</div>
          </div>
          <div style={{ width: 120, background: `linear-gradient(135deg,${kit.primary}30,${kit.secondary}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, borderLeft: `1px solid ${kit.primary}20` }}>
            {ad.emojiSet[0]}
          </div>
        </div>
      ) : (
        /* SQUARE / WIDESCREEN layout */
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24, zIndex: 2 }}>
          {/* Centre graphic */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)', textAlign: 'center' }}>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
              style={{ fontSize: format === 'instagram-post' ? 64 : 48, lineHeight: 1 }}>
              {ad.emojiSet[0]}
            </motion.div>
          </div>

          {/* Bottom content */}
          <div style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: format === 'instagram-post' ? 18 : 15, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 6, letterSpacing: '-0.02em' }}>{ad.headline}</div>
            {format !== 'twitter-x' && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 12, lineHeight: 1.5 }}>{ad.subheadline}</div>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ padding: '7px 16px', borderRadius: 99, background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 800, fontSize: 12, boxShadow: `0 4px 16px ${kit.primary}50` }}>{ad.cta}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {ad.hashtags.slice(0, 2).map(h => <span key={h} style={{ fontSize: 10, color: kit.accent, fontWeight: 600 }}>{h}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Corner accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right,${kit.primary},${kit.secondary},${kit.accent})` }} />
    </motion.div>
  )
}
