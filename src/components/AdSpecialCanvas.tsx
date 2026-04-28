/**
 * AdSpecialCanvas.tsx
 * A4-portrait branded poster: 4-product grid with old → new price, discount badges,
 * store info, validity dates, optional QR code, and disclaimer.
 *
 * Rendered at a display-friendly size (480 × 678 CSS px). The export utility
 * rasterises this DOM at scale=5 to produce a 300-DPI A4 PDF.
 */

import { BrandKit } from '../types'
import {
  AdSpecial, Product, calcDiscount, formatPrice, formatValidity,
} from '../utils/adSpecialEngine'

interface Props {
  kit: BrandKit & { brandName?: string }
  special: AdSpecial
  products: Product[]   // ordered list, length up to 4 (the editor enforces this)
  /** Pixel width on screen. Height is derived from A4 ratio. */
  displayWidth?: number
}

const A4_RATIO = 297 / 210   // height / width

export default function AdSpecialCanvas({ kit, special, products, displayWidth = 480 }: Props) {
  const W = displayWidth
  const H = Math.round(displayWidth * A4_RATIO)
  const pad = Math.round(W * 0.04)
  const font = `'${kit.font || 'Inter'}', sans-serif`
  const brandName = special.store.storeName || kit.companyName || kit.brandName || 'Your Store'

  // Always render a 4-cell grid, fill empty slots with placeholders so the layout
  // stays balanced even when fewer than 4 products are picked.
  const slots: (Product | null)[] = Array.from({ length: 4 }, (_, i) => products[i] ?? null)

  const validity = formatValidity(special.validFrom, special.validTo)
  const qrSrc = special.store.qrUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=4&data=${encodeURIComponent(special.store.qrUrl)}`
    : null

  return (
    <div
      id="ad-special-canvas-root"
      style={{
        width: W,
        height: H,
        background: '#ffffff',
        color: '#0b1220',
        fontFamily: font,
        position: 'relative',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* ── Top brand band ───────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})`,
        color: 'white',
        padding: `${pad}px ${pad}px ${Math.round(pad * 1.2)}px`,
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {kit.logo
              ? <img src={kit.logo} alt="logo" crossOrigin="anonymous" style={{ height: Math.round(W * 0.075), width: 'auto', objectFit: 'contain', filter: 'brightness(1.15) drop-shadow(0 1px 2px rgba(0,0,0,0.25))' }} />
              : <div style={{ fontSize: Math.round(W * 0.04), fontWeight: 900, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{brandName}</div>}
          </div>
          {validity && (
            <div style={{
              padding: `${Math.round(pad * 0.25)}px ${Math.round(pad * 0.55)}px`,
              borderRadius: 99,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(4px)',
              fontSize: Math.round(W * 0.024),
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              {validity}
            </div>
          )}
        </div>

        <div style={{ marginTop: Math.round(pad * 0.9) }}>
          <div style={{
            fontSize: Math.round(W * 0.085),
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.0,
            textTransform: 'uppercase',
          }}>
            {special.title || 'Specials'}
          </div>
          {special.subtitle && (
            <div style={{
              marginTop: Math.round(pad * 0.3),
              fontSize: Math.round(W * 0.03),
              fontWeight: 500,
              opacity: 0.92,
            }}>
              {special.subtitle}
            </div>
          )}
        </div>
      </div>

      {/* ── Product grid (2 × 2) ────────────────────────────── */}
      <div style={{
        padding: pad,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: pad,
      }}>
        {slots.map((p, idx) => (
          <ProductCell key={p?.id ?? `empty-${idx}`} product={p} kit={kit} currency={special.currency} W={W} pad={pad} />
        ))}
      </div>

      {/* ── Bottom store + footer band ───────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#0b1220',
        color: 'white',
        padding: `${Math.round(pad * 0.9)}px ${pad}px`,
        display: 'flex',
        gap: pad,
        alignItems: 'flex-start',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: Math.round(W * 0.034), fontWeight: 800, letterSpacing: '-0.01em', marginBottom: Math.round(pad * 0.25) }}>
            Visit us today
          </div>
          <FooterRow icon="📍" text={special.store.address || '—'} W={W} />
          {special.store.phone   && <FooterRow icon="☎️" text={special.store.phone}    W={W} />}
          {special.store.whatsapp&& <FooterRow icon="💬" text={`WhatsApp ${special.store.whatsapp}`} W={W} />}
          {special.store.hours   && <FooterRow icon="🕐" text={special.store.hours}    W={W} />}
          {special.disclaimer && (
            <div style={{ marginTop: Math.round(pad * 0.5), fontSize: Math.round(W * 0.018), opacity: 0.5 }}>
              {special.disclaimer}
            </div>
          )}
        </div>
        {qrSrc && (
          <div style={{ flexShrink: 0, padding: 6, borderRadius: 6, background: 'white', alignSelf: 'center' }}>
            <img src={qrSrc} alt="QR" crossOrigin="anonymous" style={{ display: 'block', width: Math.round(W * 0.18), height: Math.round(W * 0.18) }} />
            <div style={{ textAlign: 'center', fontSize: Math.round(W * 0.016), color: '#0b1220', fontWeight: 700, marginTop: 2 }}>SCAN ME</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Product cell ──────────────────────────────────────────

function ProductCell({ product, kit, currency, W, pad }: {
  product: Product | null
  kit: BrandKit
  currency: AdSpecial['currency']
  W: number
  pad: number
}) {
  if (!product) {
    return (
      <div style={{
        border: `2px dashed ${kit.primary}30`,
        borderRadius: pad * 0.6,
        background: `${kit.primary}05`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: Math.round(W * 0.022), color: '#94a3b8', fontWeight: 600,
        textAlign: 'center', padding: pad * 0.5,
      }}>
        Add a product
      </div>
    )
  }

  const d = calcDiscount(product.oldPrice, product.newPrice)

  return (
    <div style={{
      position: 'relative',
      border: `1px solid ${kit.primary}25`,
      borderRadius: pad * 0.6,
      background: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Image */}
      <div style={{
        height: '52%',
        background: `linear-gradient(135deg, ${kit.primary}06, ${kit.secondary}10)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {product.image
          ? <img src={product.image} alt={product.name} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
          : <div style={{ fontSize: Math.round(W * 0.08), opacity: 0.3 }}>📦</div>}

        {/* Discount badge (top-right) */}
        {d.amountOff > 0 && (
          <div style={{
            position: 'absolute',
            top: Math.round(W * 0.012),
            right: Math.round(W * 0.012),
            background: kit.accent,
            color: 'white',
            padding: `${Math.round(W * 0.008)}px ${Math.round(W * 0.018)}px`,
            borderRadius: 99,
            fontSize: Math.round(W * 0.024),
            fontWeight: 900,
            letterSpacing: '0.02em',
            boxShadow: `0 4px 10px ${kit.accent}55`,
            transform: 'rotate(8deg)',
          }}>
            {d.badgeText(currency)}
          </div>
        )}
      </div>

      {/* Text block */}
      <div style={{ padding: Math.round(pad * 0.55), flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{
          fontSize: Math.round(W * 0.026),
          fontWeight: 700,
          color: '#0b1220',
          lineHeight: 1.2,
          // clamp to 2 lines
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {product.name}
          {product.unit && (
            <span style={{ fontWeight: 500, color: '#64748b', fontSize: Math.round(W * 0.02) }}> · {product.unit}</span>
          )}
        </div>

        <div style={{ marginTop: Math.round(pad * 0.3), display: 'flex', alignItems: 'baseline', gap: Math.round(pad * 0.4), flexWrap: 'wrap' }}>
          <div style={{
            fontSize: Math.round(W * 0.02),
            color: '#94a3b8',
            textDecoration: 'line-through',
            fontWeight: 600,
          }}>
            {formatPrice(product.oldPrice, currency)}
          </div>
          <div style={{
            fontSize: Math.round(W * 0.05),
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: kit.primary,
            lineHeight: 1,
          }}>
            {formatPrice(product.newPrice, currency)}
          </div>
        </div>
      </div>
    </div>
  )
}

function FooterRow({ icon, text, W }: { icon: string; text: string; W: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, fontSize: Math.round(W * 0.022), opacity: 0.92 }}>
      <span>{icon}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  )
}
