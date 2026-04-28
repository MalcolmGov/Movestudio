/**
 * emojiToDataUrl.ts
 * Rasterise an emoji to a PNG data URL via a hidden canvas.
 *
 * Used by the preset product catalog so emoji-based placeholder images render
 * the same way as uploaded photos throughout the app — same <img src=...>
 * pipeline, same html2canvas → PDF flow.
 */

export interface EmojiImageOptions {
  /** Output width/height in pixels. Square. Default 512 (good for A4 print). */
  size?: number
  /** Background fill colour. Default soft off-white. */
  background?: string
  /** Emoji ratio of canvas size. Default 0.7. */
  scale?: number
}

export function emojiToDataUrl(emoji: string, opts: EmojiImageOptions = {}): string {
  if (typeof document === 'undefined') return ''
  const size = opts.size ?? 512
  const bg = opts.background ?? '#f8fafc'
  const scale = opts.scale ?? 0.7

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  // Background panel — keeps the emoji visible against the gradient cell behind it
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, size, size)

  // Render emoji centred. Stack platform emoji fonts so we get colour glyphs
  // on macOS, Windows, Linux and Android browsers. Font shorthand requires
  // comma-separated families after the size — joining with spaces silently
  // fails and falls back to default 10px serif (no glyph for emoji).
  const px = Math.round(size * scale)
  ctx.font = `${px}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // textBaseline 'middle' is slightly biased upward for emoji on most platforms;
  // nudge down a touch so it looks centred to the eye.
  ctx.fillText(emoji, size / 2, size / 2 + Math.round(size * 0.04))

  return canvas.toDataURL('image/png')
}
