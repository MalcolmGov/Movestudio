/**
 * exportPoster.ts
 * Exports a DOM element as an A4-portrait PDF (print-ready) and/or a high-res PNG.
 *
 * The canvas is rendered in the DOM at a manageable display size (~480 × 678 CSS px).
 * We rasterise it via html2canvas at scale=5 to land at ~2400 × 3390 px which is
 * close to A4 @ 300 DPI (2480 × 3508). jsPDF then places that image on an A4 page.
 *
 * Both jsPDF and html2canvas are already in dependencies.
 */

const A4_MM = { w: 210, h: 297 } as const
const RASTER_SCALE = 5

async function rasterise(elementId: string): Promise<HTMLCanvasElement | null> {
  const el = document.getElementById(elementId)
  if (!el) {
    console.warn(`exportPoster: element #${elementId} not found`)
    return null
  }
  const { default: html2canvas } = await import('html2canvas')
  return html2canvas(el, {
    backgroundColor: '#ffffff',
    scale: RASTER_SCALE,
    useCORS: true,
    logging: false,
  })
}

export async function exportPosterAsPng(elementId: string, filename: string): Promise<void> {
  const canvas = await rasterise(elementId)
  if (!canvas) return
  await new Promise<void>(resolve => {
    canvas.toBlob(blob => {
      if (!blob) return resolve()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png', 0.95)
  })
}

export async function exportPosterAsPdf(elementId: string, filename: string): Promise<void> {
  const canvas = await rasterise(elementId)
  if (!canvas) return
  const { default: jsPDFCtor } = await import('jspdf')
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92)  // JPEG keeps PDF small while still print-quality
  const pdf = new jsPDFCtor({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })
  // Fit the image to A4. The poster aspect is locked to A4 in the canvas component,
  // so this should fill the page edge-to-edge with no white margin.
  pdf.addImage(dataUrl, 'JPEG', 0, 0, A4_MM.w, A4_MM.h, undefined, 'FAST')
  pdf.save(`${filename}.pdf`)
}
