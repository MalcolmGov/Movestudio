/**
 * exportCanvas.ts
 * Exports the AdCanvas DOM element to a PNG file.
 * Requires: npm install html2canvas
 */

export async function exportAdAsPng(elementId: string, filename: string = 'move-studio-ad'): Promise<void> {
  const el = document.getElementById(elementId)
  if (!el) {
    console.warn(`exportAdAsPng: element #${elementId} not found`)
    return
  }
  try {
    // Dynamically import so the app doesn't crash if html2canvas isn't installed yet
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(el, {
      backgroundColor: null,
      scale: 2,           // 2x for retina quality
      useCORS: true,
      logging: false,
    })
    canvas.toBlob(blob => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  } catch (err) {
    console.error('exportAdAsPng failed:', err)
    alert('Export requires the html2canvas package. Run: npm install html2canvas')
  }
}
