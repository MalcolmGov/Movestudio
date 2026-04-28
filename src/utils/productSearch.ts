/**
 * productSearch.ts
 * Open Food Facts (OFF) integration: search the public 3M+ product database
 * for real branded products and turn the result into the local Product shape
 * the rest of the app already understands.
 *
 * OFF terms: data licensed under ODbL, individual contributions (photos) under
 * CC-BY-SA. Free for commercial use. CORS-friendly.
 *
 * We fetch the product image and convert it to a base64 data URL on add, so
 * the html2canvas → A4 PDF export keeps working without runtime CORS surprises
 * and the user's library stays self-contained even if OFF is offline later.
 */

export interface OffProduct {
  id: string                // OFF code (barcode)
  name: string              // product_name
  brand: string             // first brand from brands field
  imageUrl: string | null   // best available image URL
  quantity?: string         // e.g. "700 g", "2 L"
}

interface OffApiResult {
  products?: Array<{
    code?: string
    product_name?: string
    brands?: string
    image_front_small_url?: string
    image_front_url?: string
    image_url?: string
    quantity?: string
  }>
}

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2/search'

/**
 * Search OFF by free text. Returns the top N products that have an image.
 * Limited fields keeps the payload small.
 */
export async function searchProducts(query: string, limit = 12): Promise<OffProduct[]> {
  const q = query.trim()
  if (!q) return []

  const params = new URLSearchParams({
    search_terms: q,
    fields: 'code,product_name,brands,image_front_small_url,image_front_url,image_url,quantity',
    page_size: String(Math.min(50, limit * 2)),  // overfetch — many entries lack a photo
    sort_by: 'popularity_key',
  })

  let res: Response
  try {
    res = await fetch(`${OFF_BASE}?${params}`, {
      headers: { 'Accept': 'application/json' },
    })
  } catch (err) {
    console.warn('[productSearch] network error', err)
    return []
  }

  if (!res.ok) {
    console.warn('[productSearch] OFF returned', res.status)
    return []
  }

  let data: OffApiResult
  try { data = await res.json() } catch { return [] }

  const list = data.products || []
  const out: OffProduct[] = []

  for (const p of list) {
    if (out.length >= limit) break
    const name = (p.product_name || '').trim()
    if (!name) continue
    const imageUrl = p.image_front_small_url || p.image_front_url || p.image_url || null
    if (!imageUrl) continue
    out.push({
      id: p.code || `${name}-${out.length}`,
      name,
      brand: (p.brands || '').split(',')[0]?.trim() || '',
      imageUrl,
      quantity: p.quantity?.trim() || undefined,
    })
  }

  return out
}

/**
 * Download an image URL and return a base64 data URL. Required so the poster
 * export (which rasterises the DOM) doesn't depend on remote URLs at export
 * time, and so the saved product survives OFF being unreachable later.
 *
 * Uses fetch + FileReader for broad codec support. CORS issues fall back to a
 * direct img → canvas conversion (slower but works for a wider set of hosts).
 */
export async function imageUrlToDataUrl(url: string): Promise<string | null> {
  // Path 1: fetch as Blob (preferred — preserves codec, smallest file)
  try {
    const res = await fetch(url, { mode: 'cors' })
    if (res.ok) {
      const blob = await res.blob()
      return await blobToDataUrl(blob)
    }
  } catch { /* fall through to canvas path */ }

  // Path 2: load via <img> + canvas (handles some hosts the fetch path can't)
  try {
    return await imageElementToDataUrl(url)
  } catch (err) {
    console.warn('[imageUrlToDataUrl] both paths failed', err)
    return null
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function imageElementToDataUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || 512
      canvas.height = img.naturalHeight || 512
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('no 2d context'))
      ctx.drawImage(img, 0, 0)
      try { resolve(canvas.toDataURL('image/jpeg', 0.92)) }
      catch (err) { reject(err) }
    }
    img.onerror = reject
    img.src = url
  })
}
