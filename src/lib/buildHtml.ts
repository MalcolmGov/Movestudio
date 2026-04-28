/**
 * Shared static HTML builder — used by both WebsiteBuilderPage and PreviewPage
 * so that deployed/exported HTML is always consistent and clean.
 */
import type { BrandKit, PageSection, SectionContent } from '../types'

const GOOGLE_FONTS_EXPORT = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Outfit:wght@400;700;900&family=Sora:wght@400;700&family=DM+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&family=Raleway:wght@400;700;900&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&family=Fira+Code:wght@400;600&family=JetBrains+Mono:wght@400;600&family=Oswald:wght@400;700&family=Bebas+Neue&display=swap"

function buildSectionBg(c: SectionContent): string {
  if (c.sectionBgType === 'solid' && c.sectionBgColor)
    return `background:${c.sectionBgColor};`
  if (c.sectionBgType === 'gradient')
    return `background:linear-gradient(${c.sectionBgGradientAngle||'135'}deg,${c.sectionBgGradientFrom||'#060911'},${c.sectionBgGradientTo||'#111827'});`
  if (c.sectionBgType === 'image' && c.sectionBgImage)
    return `background-image:url('${c.sectionBgImage}');background-size:cover;background-position:center;`
  return ''
}

function buildTextColor(c: SectionContent, prefix: 'component'|'heading'): string {
  const mode = prefix === 'component' ? c.componentTextColorMode : c.headingColorMode
  const col  = prefix === 'component' ? c.componentTextColor     : c.headingColor
  const from = prefix === 'component' ? c.componentTextGradientFrom : c.headingGradientFrom
  const to   = prefix === 'component' ? c.componentTextGradientTo   : c.headingGradientTo
  const ang  = prefix === 'component' ? c.componentTextGradientAngle : c.headingGradientAngle
  if (mode === 'gradient')
    return `background:linear-gradient(${ang||'135'}deg,${from||'#67e8f9'},${to||'#8b5cf6'});-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`
  if (col) return `color:${col};`
  return ''
}

export function renderSectionHtml(sec: PageSection, kit: BrandKit): string {
  const c = sec.content
  const bg = buildSectionBg(c)
  const font = c.sectionFont ? `font-family:'${c.sectionFont}',sans-serif;` : ''
  const wrapStyle = `${bg}${font}padding:clamp(40px,6vw,80px) clamp(16px,5vw,64px);`

  if ((c as any).componentKey) {
    const text = (c as any).componentText || (c as any).componentKey
    const tc = buildTextColor(c, 'component')
    return `<section style="${wrapStyle}display:flex;justify-content:center;align-items:center;min-height:120px">
  <h2 style="font-size:clamp(28px,5vw,52px);font-weight:900;letter-spacing:-0.04em;${tc}">${text}</h2>
</section>`
  }

  const headingTC = buildTextColor(c, 'heading')
  const headingStyle = headingTC
    ? `style="font-size:clamp(28px,5vw,48px);font-weight:900;letter-spacing:-0.03em;margin-bottom:16px;${headingTC}"`
    : `style="font-size:clamp(28px,5vw,48px);font-weight:900;letter-spacing:-0.03em;margin-bottom:16px;color:white"`
  const subStyle = `style="font-size:clamp(15px,2vw,18px);color:rgba(255,255,255,0.6);margin-bottom:32px;max-width:600px"`

  switch (sec.type) {
    case 'navbar': return `<nav style="${wrapStyle}display:flex;align-items:center;justify-content:space-between;padding-top:20px;padding-bottom:20px">
  <div style="font-weight:900;font-size:20px;color:${kit.primary}">${(c as any).companyName || kit.industry || 'Brand'}</div>
  <div style="display:flex;gap:24px;font-size:14px;color:rgba(255,255,255,0.7)">${[(c as any).nav1,(c as any).nav2,(c as any).nav3,(c as any).nav4].filter(Boolean).map((n:string)=>`<a href="#" style="color:inherit;text-decoration:none">${n}</a>`).join('')||'<a href="#" style="color:inherit;text-decoration:none">Home</a>'}</div>
</nav>`
    case 'hero': return `<section style="${wrapStyle}text-align:center;min-height:80vh;display:flex;flex-direction:column;align-items:center;justify-content:center">
  <h1 ${headingStyle}>${(c as any).heading || 'Welcome'}</h1>
  <p ${subStyle}>${(c as any).subheading || ''}</p>
  <a href="#" style="padding:14px 32px;border-radius:99px;background:linear-gradient(135deg,${kit.primary},${kit.secondary});color:white;font-weight:700;text-decoration:none;font-size:16px">${(c as any).cta || 'Get Started'}</a>
</section>`
    case 'features': return `<section style="${wrapStyle}text-align:center">
  <h2 ${headingStyle}>${(c as any).heading || 'Features'}</h2>
  <p ${subStyle} style="margin:0 auto 40px">${(c as any).subheading || ''}</p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px">
    ${[1,2,3].map(i=>`<div style="padding:28px;border-radius:16px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03)">
      <div style="font-size:32px;margin-bottom:12px">${(c as any)[`feature${i}icon`]||'⚡'}</div>
      <h3 style="font-weight:700;color:white;margin-bottom:8px">${(c as any)[`feature${i}title`]||`Feature ${i}`}</h3>
      <p style="color:rgba(255,255,255,0.5);font-size:14px">${(c as any)[`feature${i}desc`]||''}</p>
    </div>`).join('')}
  </div>
</section>`
    case 'stats': return `<section style="${wrapStyle}text-align:center">
  <h2 ${headingStyle}>${(c as any).heading || 'By the Numbers'}</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:24px;margin-top:32px">
    ${[1,2,3,4].map(i=>`<div><div style="font-size:clamp(28px,5vw,48px);font-weight:900;color:${kit.primary}">${(c as any)[`stat${i}val`]||'–'}</div><div style="font-size:13px;color:rgba(255,255,255,0.45);margin-top:4px">${(c as any)[`stat${i}label`]||''}</div></div>`).join('')}
  </div>
</section>`
    case 'cta': return `<section style="${wrapStyle}text-align:center">
  <h2 ${headingStyle}>${(c as any).heading || 'Ready to get started?'}</h2>
  <p ${subStyle} style="margin:0 auto 32px">${(c as any).subheading || ''}</p>
  <a href="#" style="padding:14px 32px;border-radius:99px;background:linear-gradient(135deg,${kit.primary},${kit.secondary});color:white;font-weight:700;text-decoration:none">${(c as any).cta || 'Get Started'}</a>
</section>`
    case 'footer': return `<footer style="${wrapStyle}text-align:center;border-top:1px solid rgba(255,255,255,0.07)">
  <div style="font-weight:900;font-size:18px;color:${kit.primary};margin-bottom:12px">${(c as any).companyName || kit.industry || 'Brand'}</div>
  <p style="color:rgba(255,255,255,0.3);font-size:13px">${(c as any).footerText || `© ${new Date().getFullYear()} All rights reserved.`}</p>
</footer>`
    default: return `<section style="${wrapStyle}text-align:center">
  <h2 ${headingStyle}>${(c as any).heading || sec.type.charAt(0).toUpperCase()+sec.type.slice(1)}</h2>
  <p ${subStyle}>${(c as any).subheading || ''}</p>
</section>`
  }
}

export function buildPageHtml(pageTitle: string, sections: PageSection[], kit: BrandKit): string {
  const enabled = sections.filter(s => s.enabled)
  const usedFonts = [...new Set([kit.font, ...enabled.map(s => s.content.sectionFont).filter(Boolean)])]
  const sectionsHtml = enabled.map(s => renderSectionHtml(s, kit)).join('\n\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${pageTitle}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${GOOGLE_FONTS_EXPORT}" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#060911;font-family:'${kit.font||'Inter'}',Inter,sans-serif;color:white;-webkit-font-smoothing:antialiased}
  :root{--primary:${kit.primary};--secondary:${kit.secondary};--accent:${kit.accent}}
  a{color:var(--accent)}
  img{max-width:100%}
  .text-gradient-clip{-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent!important}
</style>
</head>
<body>
<!-- Built with Move AI Studio — movedigital.co.za -->
<!-- Fonts: ${usedFonts.join(', ')} | Sections: ${enabled.map(s=>s.type).join(', ')} -->

${sectionsHtml}

</body>
</html>`
}
