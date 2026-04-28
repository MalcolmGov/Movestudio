/**
 * adSpecialEngine.ts
 * Types, math, formatting, and per-project storage helpers for the Ad Specials feature.
 *
 * Ad Specials are printable in-store posters: branded posters where a shop owner
 * picks 4 products from their library, sets old/new prices, validity dates, and
 * store info. Output is a print-ready PDF (A4) plus a PNG for sharing on
 * WhatsApp/social.
 */

// ── Types ─────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  image: string | null    // base64 data-URL
  oldPrice: number        // regular price
  newPrice: number        // special price (must be < oldPrice)
  unit?: string           // optional, e.g. "per kg", "500ml", "each"
  createdAt: string
}

export type CurrencyCode = 'ZAR' | 'USD' | 'EUR' | 'GBP' | 'KES' | 'NGN'

export interface AdSpecialStoreInfo {
  storeName?: string        // overrides brand name on poster header
  address?: string
  phone?: string            // tel: link
  whatsapp?: string         // wa.me number (digits only, country code included)
  hours?: string            // free text e.g. "Mon–Sat 8:00 – 18:00"
  qrUrl?: string            // URL the QR code should encode (catalog / website / wa.me)
}

export interface AdSpecial {
  id: string
  title: string             // headline e.g. "WEEKEND SPECIALS"
  subtitle?: string         // e.g. "This week only"
  productIds: string[]      // refs Product.id from the library, length 1–4 for v1
  validFrom: string         // ISO date
  validTo: string           // ISO date
  currency: CurrencyCode
  layout: 'grid-4'          // v1: only 4-grid. Reserved for future layouts.
  store: AdSpecialStoreInfo
  disclaimer: string        // default "While stocks last. E&OE."
  createdAt: string
  updatedAt: string
}

// ── Math + formatting ─────────────────────────────────────

export const CURRENCY_META: Record<CurrencyCode, { symbol: string; locale: string }> = {
  ZAR: { symbol: 'R',  locale: 'en-ZA' },
  USD: { symbol: '$',  locale: 'en-US' },
  EUR: { symbol: '€',  locale: 'en-IE' },
  GBP: { symbol: '£',  locale: 'en-GB' },
  KES: { symbol: 'KSh',locale: 'en-KE' },
  NGN: { symbol: '₦',  locale: 'en-NG' },
}

/** Formats 199 → "R 199" or 1299.5 → "R 1,299.50". Drops cents when amount is whole. */
export function formatPrice(amount: number, currency: CurrencyCode): string {
  const { symbol, locale } = CURRENCY_META[currency]
  const isWhole = Number.isInteger(amount)
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `${symbol} ${formatted}`
}

export interface DiscountInfo {
  percentOff: number        // rounded integer
  amountOff: number         // raw amount (currency units)
  /** Picks whichever feels punchier for the badge — % when ≥ 20, else amount. */
  badgeText: (currency: CurrencyCode) => string
}

export function calcDiscount(oldPrice: number, newPrice: number): DiscountInfo {
  const safeOld = Math.max(0, oldPrice)
  const safeNew = Math.max(0, newPrice)
  const amountOff = Math.max(0, safeOld - safeNew)
  const percentOff = safeOld > 0 ? Math.round((amountOff / safeOld) * 100) : 0
  return {
    percentOff,
    amountOff,
    badgeText: (currency) =>
      percentOff >= 20
        ? `${percentOff}% OFF`
        : `SAVE ${formatPrice(amountOff, currency)}`,
  }
}

/** Friendly date range for the poster footer, e.g. "Valid 28 Apr – 4 May 2026". */
export function formatValidity(fromIso: string, toIso: string, locale = 'en-ZA'): string {
  try {
    const from = new Date(fromIso)
    const to = new Date(toIso)
    if (isNaN(+from) || isNaN(+to)) return ''
    const sameYear = from.getFullYear() === to.getFullYear()
    const fromFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: sameYear ? undefined : 'numeric' }).format(from)
    const toFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(to)
    return `Valid ${fromFmt} – ${toFmt}`
  } catch { return '' }
}

// ── Storage (per-project, localStorage) ───────────────────

const productsKey = (pid: string) => `ms_products_${pid}`
const specialsKey  = (pid: string) => `ms_ad_specials_${pid}`

function readJson<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback }
  catch { return fallback }
}

export const ProductLibraryStore = {
  list:   (projectId: string): Product[] => readJson(productsKey(projectId), [] as Product[]),
  upsert: (projectId: string, product: Product) => {
    const list = ProductLibraryStore.list(projectId).filter(p => p.id !== product.id)
    localStorage.setItem(productsKey(projectId), JSON.stringify([product, ...list]))
  },
  remove: (projectId: string, id: string) => {
    const list = ProductLibraryStore.list(projectId).filter(p => p.id !== id)
    localStorage.setItem(productsKey(projectId), JSON.stringify(list))
  },
}

export const AdSpecialsStore = {
  list:   (projectId: string): AdSpecial[] => readJson(specialsKey(projectId), [] as AdSpecial[]),
  upsert: (projectId: string, special: AdSpecial) => {
    const list = AdSpecialsStore.list(projectId).filter(s => s.id !== special.id)
    localStorage.setItem(specialsKey(projectId), JSON.stringify([{ ...special, updatedAt: new Date().toISOString() }, ...list]))
  },
  remove: (projectId: string, id: string) => {
    const list = AdSpecialsStore.list(projectId).filter(s => s.id !== id)
    localStorage.setItem(specialsKey(projectId), JSON.stringify(list))
  },
}

// ── Defaults ──────────────────────────────────────────────

export function newSpecial(): AdSpecial {
  const now = new Date()
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  return {
    id: `spec-${Date.now()}`,
    title: 'WEEKEND SPECIALS',
    subtitle: 'Limited stock — visit us in-store',
    productIds: [],
    validFrom: now.toISOString().slice(0, 10),
    validTo: weekFromNow.toISOString().slice(0, 10),
    currency: 'ZAR',
    layout: 'grid-4',
    store: {},
    disclaimer: 'While stocks last. E&OE. T&Cs apply.',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}
