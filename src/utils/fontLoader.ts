/**
 * fontLoader.ts
 * Dynamically injects a Google Fonts <link> for a given font family.
 * Caches loaded fonts to avoid duplicate injections.
 */

const loaded = new Set<string>()

export function loadGoogleFont(fontName: string): void {
  if (!fontName || loaded.has(fontName)) return
  const slug = fontName.replace(/\s+/g, '+')
  const href = `https://fonts.googleapis.com/css2?family=${slug}:wght@300;400;500;600;700;800;900&display=swap`
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
  loaded.add(fontName)
}

export const GOOGLE_FONTS = [
  { name: 'Inter',          category: 'Sans-serif', preview: 'Clean & Modern' },
  { name: 'Outfit',         category: 'Sans-serif', preview: 'Geometric & Fresh' },
  { name: 'Plus Jakarta Sans', category: 'Sans-serif', preview: 'Contemporary' },
  { name: 'DM Sans',        category: 'Sans-serif', preview: 'Minimal & Refined' },
  { name: 'Geist',          category: 'Sans-serif', preview: 'Developer-Friendly' },
  { name: 'Space Grotesk',  category: 'Sans-serif', preview: 'Technical & Bold' },
  { name: 'Sora',           category: 'Sans-serif', preview: 'Soft & Friendly' },
  { name: 'Manrope',        category: 'Sans-serif', preview: 'Versatile & Clean' },
  { name: 'Raleway',        category: 'Sans-serif', preview: 'Elegant & Stylish' },
  { name: 'Nunito',         category: 'Sans-serif', preview: 'Rounded & Warm' },
  { name: 'Poppins',        category: 'Sans-serif', preview: 'Friendly & Popular' },
  { name: 'Montserrat',     category: 'Sans-serif', preview: 'Strong & Versatile' },
  { name: 'Playfair Display', category: 'Serif',    preview: 'Classic & Editorial' },
  { name: 'Merriweather',   category: 'Serif',      preview: 'Readable & Trustworthy' },
  { name: 'Lora',           category: 'Serif',      preview: 'Literary & Warm' },
  { name: 'DM Serif Display', category: 'Serif',    preview: 'Luxury & Impact' },
  { name: 'JetBrains Mono', category: 'Monospace',  preview: 'Developer & Technical' },
  { name: 'Fira Code',      category: 'Monospace',  preview: 'Code & Precision' },
]
