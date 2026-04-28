/**
 * whatsappShare.ts
 * Utilities for sharing Ad Special posters to WhatsApp and exporting product catalogs.
 *
 * Handles rasterization of poster elements to shareable formats (square for chat,
 * vertical for status), triggering native share or fallback wa.me URLs, and
 * generating WhatsApp Business catalog CSVs.
 */

import { Product, CurrencyCode, CURRENCY_META } from './adSpecialEngine'

const RASTER_SCALE = 5

/**
 * Rasterize a DOM element using html2canvas at high scale, then composite
 * it onto a target-sized canvas with optional background fill.
 *
 * @param elementId - The DOM element ID to rasterize
 * @param target - 'square' (1080×1080) or 'status' (1080×1920)
 * @param backgroundColor - CSS colour for the background behind the poster (default: white)
 * @returns A Blob ready to share, or null if the element doesn't exist
 */
export async function posterToShareableBlob(
  elementId: string,
  target: 'square' | 'status',
  backgroundColor: string = '#ffffff'
): Promise<Blob | null> {
  const el = document.getElementById(elementId)
  if (!el) {
    console.warn(`posterToShareableBlob: element #${elementId} not found`)
    return null
  }

  // Rasterize the element at high scale
  const { default: html2canvas } = await import('html2canvas')
  let canvas: HTMLCanvasElement
  try {
    canvas = await html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: RASTER_SCALE,
      useCORS: true,
      logging: false,
    })
  } catch (err) {
    console.error('html2canvas failed:', err)
    return null
  }

  // Dimensions for the target format (in pixels at 1:1)
  const [targetW, targetH] = target === 'square' ? [1080, 1080] : [1080, 1920]

  // Create a new canvas at target size
  const shareCanvas = document.createElement('canvas')
  shareCanvas.width = targetW
  shareCanvas.height = targetH
  const ctx = shareCanvas.getContext('2d')
  if (!ctx) return null

  // Fill background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, targetW, targetH)

  // Centre the rasterized poster on the background
  const posterW = canvas.width
  const posterH = canvas.height

  // Scale the poster to fit within the target, maintaining aspect ratio
  const maxW = targetW * 0.95
  const maxH = targetH * 0.95
  const scaleW = maxW / posterW
  const scaleH = maxH / posterH
  const scale = Math.min(scaleW, scaleH)

  const scaledW = posterW * scale
  const scaledH = posterH * scale
  const x = (targetW - scaledW) / 2
  const y = (targetH - scaledH) / 2

  ctx.drawImage(canvas, x, y, scaledW, scaledH)

  // Convert to blob
  return new Promise((resolve) => {
    shareCanvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/jpeg', 0.92)
  })
}

/**
 * Share a blob via WhatsApp, using navigator.share if available (iOS/modern Android),
 * or falling back to a wa.me link.
 *
 * @param blob - The image blob to share
 * @param message - The share message text
 * @param fallbackUrlText - Text to encode in the wa.me fallback URL
 * @returns 'native' if native share was used, 'wa.me' if fallback was used, 'failed' if both failed
 */
export async function shareViaWhatsApp(
  blob: Blob,
  message: string,
  fallbackUrlText: string
): Promise<'native' | 'wa.me' | 'failed'> {
  // Try navigator.share first (iOS Safari, modern Android)
  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], 'poster.jpg', { type: 'image/jpeg' })
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Ad Special Poster',
          text: message,
          files: [file],
        })
        return 'native'
      }
    } catch (err) {
      // User cancelled or share failed; fall through to wa.me
      if (err instanceof Error && err.name !== 'AbortError') {
        console.warn('navigator.share failed:', err)
      }
    }
  }

  // Fallback: open wa.me with the fallback text
  try {
    const encodedText = encodeURIComponent(fallbackUrlText)
    const wameUrl = `https://wa.me/?text=${encodedText}`
    window.open(wameUrl, '_blank')
    return 'wa.me'
  } catch (err) {
    console.error('wa.me fallback failed:', err)
    return 'failed'
  }
}

/**
 * Generate a WhatsApp Business catalog CSV per Meta's specification.
 * Downloads the file automatically.
 *
 * Spec fields: id, title, description, availability, condition, price, link, image_link, brand
 *
 * @param products - Array of products to export
 * @param currency - Currency code (e.g. 'ZAR')
 * @param brandName - Brand name to populate the 'brand' column
 */
export function exportProductCatalogCsv(
  products: Product[],
  currency: CurrencyCode,
  brandName: string
): void {
  const { symbol: currencySymbol } = CURRENCY_META[currency] || { symbol: currency }

  // CSV header per Meta's WhatsApp Business catalog spec
  const header = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
  ]

  // Escape CSV field: wrap in quotes and escape internal quotes
  const escapeField = (val: string): string => {
    if (!val) return '""'
    return `"${val.replace(/"/g, '""')}"`
  }

  // Build rows
  const rows = products.map((p) => {
    const priceStr = `${p.newPrice.toFixed(2)} ${currency}`
    return [
      escapeField(p.id),
      escapeField(p.name),
      escapeField(p.unit ? `${p.name} · ${p.unit}` : p.name),
      escapeField('in stock'),
      escapeField('new'),
      escapeField(priceStr),
      escapeField(''),
      escapeField(''),
      escapeField(brandName),
    ].join(',')
  })

  // Assemble CSV
  const csv = [header.join(','), ...rows].join('\n')
  const csvWithComment = `# WhatsApp Business Catalog Export\n# Generated for: ${brandName}\n# Note: image_link column is empty.\n# To use with WhatsApp Business, you must host product images on your server\n# and populate image_link with the full HTTPS URL.\n# Data URLs and local paths will not be accepted by Meta.\n${csv}`

  // Trigger download
  const blob = new Blob([csvWithComment], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-catalog.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
