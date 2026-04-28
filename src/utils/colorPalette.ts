/**
 * colorPalette.ts
 * Generates 5 harmonious colour palette schemes from a base hex colour.
 * Pure HSL math — no API required.
 */

export interface PaletteColor {
  hex: string
  label: string
}

export interface PaletteSuggestion {
  name: string
  description: string
  colors: [string, string, string] // [primary, secondary, accent]
}

// ── Hex <-> HSL conversion ─────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s))
  l = Math.max(0, Math.min(100, l))
  const sl = s / 100, ll = l / 100
  const a = sl * Math.min(ll, 1 - ll)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// ── Palette generation ─────────────────────────────────────

export function generatePalette(hex: string): PaletteSuggestion[] {
  if (!hex || hex.length < 7) return []
  const [h, s, l] = hexToHsl(hex)

  return [
    {
      name: 'Complementary',
      description: 'Bold contrast — opposite ends of the colour wheel.',
      colors: [
        hex,
        hslToHex(h + 180, s, l),
        hslToHex(h + 180, Math.min(s + 15, 100), Math.min(l + 15, 85)),
      ],
    },
    {
      name: 'Analogous',
      description: 'Harmonious and cohesive — neighbouring hues.',
      colors: [
        hex,
        hslToHex(h + 30, s, l),
        hslToHex(h - 30, s, Math.min(l + 10, 85)),
      ],
    },
    {
      name: 'Triadic',
      description: 'Vibrant and balanced — three evenly spaced hues.',
      colors: [
        hex,
        hslToHex(h + 120, s, l),
        hslToHex(h + 240, s, l),
      ],
    },
    {
      name: 'Split-Complementary',
      description: 'High contrast with more variety than complementary.',
      colors: [
        hex,
        hslToHex(h + 150, s, l),
        hslToHex(h + 210, s, l),
      ],
    },
    {
      name: 'Monochromatic',
      description: 'Elegant and minimal — same hue, different depths.',
      colors: [
        hslToHex(h, s, Math.max(l - 20, 20)),
        hex,
        hslToHex(h, Math.max(s - 20, 20), Math.min(l + 25, 85)),
      ],
    },
  ]
}

/** Returns 8 tint/shade swatches from a base hex */
export function generateShades(hex: string): string[] {
  const [h, s] = hexToHsl(hex)
  return [95, 85, 70, 55, 40, 30, 20, 10].map(l => hslToHex(h, s, l))
}
