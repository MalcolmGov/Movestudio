import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Storage } from '../types'

// ── Ad Packs ────────────────────────────────────────────────
const AD_PACKS = [
  {
    id: 'product-launch',
    icon: '🚀',
    label: 'Product Launch',
    desc: '7-ad sequence to build hype and drive signups for a new product release.',
    count: 7,
    color: '#3b82f6',
    tags: ['Launch', 'Awareness', 'CTA'],
    ads: [
      { type: 'teaser', format: 'instagram-story',  headline: 'Something big is coming…',        prompt: 'Mysterious teaser for upcoming product launch. Build anticipation.' },
      { type: 'reveal', format: 'instagram-post',   headline: 'Introducing [Product Name]',      prompt: 'Bold product reveal with key value proposition and CTA to sign up.' },
      { type: 'feature', format: 'instagram-reel',  headline: "Here's how it works",             prompt: 'Quick demo walkthrough of the key feature in 30 seconds.' },
      { type: 'social-proof', format: 'linkedin-post', headline: '500 people on the waitlist',  prompt: 'Social proof momentum post. Show early adopter excitement.' },
      { type: 'benefit', format: 'facebook-ad',     headline: 'Stop doing it the hard way',     prompt: 'Pain-point driven ad. Problem → solution with clear CTA.' },
      { type: 'urgency', format: 'instagram-story', headline: 'Founding price ends Friday',     prompt: 'Urgency / scarcity post. Last chance for launch pricing.' },
      { type: 'launch', format: 'instagram-post',   headline: '🎉 We\'re live!',                prompt: 'Launch day celebration post. Direct link to sign up.' },
    ],
  },
  {
    id: 'flash-sale',
    icon: '🔥',
    label: 'Flash Sale',
    desc: '5-ad urgency sequence for time-limited promotions and discount campaigns.',
    count: 5,
    color: '#ef4444',
    tags: ['Promo', 'Urgency', 'Discount'],
    ads: [
      { type: 'announce', format: 'instagram-story', headline: '48-hour flash sale — starts now', prompt: 'Flash sale announcement. Bold typography, countdown energy.' },
      { type: 'offer',    format: 'instagram-post',  headline: '30% off everything this weekend',  prompt: 'Offer details ad. Show discount clearly with before/after pricing.' },
      { type: 'urgency',  format: 'facebook-ad',     headline: 'Only 12 hours left',               prompt: 'Mid-sale urgency post. Countdown element, strong CTA.' },
      { type: 'social',   format: 'twitter-x',       headline: 'People are talking 👀',            prompt: 'Social buzz post. UGC energy, real customers loving the deal.' },
      { type: 'last-call',format: 'instagram-story', headline: 'Last chance — sale ends at midnight', prompt: 'Final hours post. FOMO-driven with countdown timer visual.' },
    ],
  },
  {
    id: 'trust-builder',
    icon: '🤝',
    label: 'Trust Builder',
    desc: '5-ad social proof sequence using testimonials, reviews, and case studies.',
    count: 5,
    color: '#10b981',
    tags: ['Social Proof', 'Trust', 'Reviews'],
    ads: [
      { type: 'testimonial', format: 'instagram-post', headline: '"This changed everything for us"', prompt: 'Customer testimonial with quote, name, photo. Authentic and warm.' },
      { type: 'case-study',  format: 'linkedin-post',  headline: 'How [Client] grew 3x in 60 days', prompt: 'Mini case study. Before/after results with specific metrics.' },
      { type: 'review',      format: 'instagram-story',headline: '⭐⭐⭐⭐⭐ 500+ reviews',          prompt: 'Review aggregate post. Show star rating and count prominently.' },
      { type: 'stats',       format: 'facebook-ad',    headline: '10,000 customers. 98% retention.', prompt: 'Credibility stats ad. Numbers-first, clean design.' },
      { type: 'milestone',   format: 'instagram-reel', headline: 'Thank you for 1,000 customers',   prompt: 'Milestone celebration. Grateful, community-focused, shareable.' },
    ],
  },
  {
    id: 'awareness',
    icon: '🎯',
    label: 'Awareness Pack',
    desc: '5-ad educational series that positions your brand as an industry authority.',
    count: 5,
    color: '#8b5cf6',
    tags: ['Education', 'Brand', 'Authority'],
    ads: [
      { type: 'tip',       format: 'instagram-post',  headline: '3 things every [industry] must know', prompt: 'Educational tip post. Carousel-style value. Position as expert.' },
      { type: 'myth',      format: 'twitter-x',       headline: 'The biggest myth in [industry]',      prompt: 'Myth-busting post. Contrarian take that gets shares.' },
      { type: 'guide',     format: 'linkedin-post',   headline: 'The complete guide to [topic]',       prompt: 'Long-form value post. Mini-guide with 5 actionable steps.' },
      { type: 'stat',      format: 'instagram-story', headline: '80% of businesses fail at this',      prompt: 'Shocking statistic post. Drive curiosity and link to blog.' },
      { type: 'behind',    format: 'instagram-reel',  headline: 'How we build in public',              prompt: 'Behind the scenes reel. Show the real process, build trust.' },
    ],
  },
  {
    id: 'weekly-content',
    icon: '📅',
    label: 'Weekly Content Pack',
    desc: '7-ad Mon–Sun variety pack for consistent weekly social presence.',
    count: 7,
    color: '#f59e0b',
    tags: ['Consistent', 'Weekly', 'Mixed'],
    ads: [
      { type: 'motivational', format: 'instagram-post',  headline: 'Start your week right 💪',          prompt: 'Monday motivation post. Inspirational quote + brand tie-in.' },
      { type: 'tip',          format: 'linkedin-post',   headline: 'Tuesday tip: [industry insight]',   prompt: 'Quick tactical tip for your industry. Easy to digest.' },
      { type: 'feature',      format: 'instagram-reel',  headline: 'Did you know we do this?',          prompt: 'Mid-week product feature spotlight. Keep it punchy.' },
      { type: 'social-proof', format: 'instagram-story', headline: '⭐ Customer of the week',           prompt: 'Thursday customer spotlight. Human, authentic, real story.' },
      { type: 'offer',        format: 'facebook-ad',     headline: 'Weekend deal just for you',         prompt: 'Friday offer or CTA. Weekend energy, clear action.' },
      { type: 'engagement',   format: 'twitter-x',       headline: 'Hot take: [industry opinion]',      prompt: 'Saturday engagement post. Opinion that sparks discussion.' },
      { type: 'recap',        format: 'instagram-story', headline: 'Week in review 🗓',                 prompt: 'Sunday recap. Summary of the week, preview of next week.' },
    ],
  },
]

// ── Landing Page Templates ───────────────────────────────────
const PAGE_TEMPLATES = [
  {
    id: 'saas-homepage',
    icon: '⚡',
    label: 'SaaS Homepage',
    desc: 'Hero → Features → Pricing → Testimonials → CTA. The proven SaaS conversion template.',
    color: '#3b82f6',
    sections: ['hero', 'features', 'stats', 'testimonials', 'pricing', 'faq', 'cta', 'footer'],
    preview: ['🦸 Hero', '✨ Features', '📊 Stats', '💬 Testimonials', '💳 Pricing', '❓ FAQ', '📢 CTA', '🔗 Footer'],
  },
  {
    id: 'ecommerce',
    icon: '🛍',
    label: 'E-commerce Store',
    desc: 'Product-first layout with social proof, features, and urgency sections.',
    color: '#ef4444',
    sections: ['hero', 'logobar', 'features', 'stats', 'testimonials', 'newsletter', 'cta', 'footer'],
    preview: ['🦸 Hero', '🏢 Logo Bar', '✨ Features', '📊 Stats', '💬 Testimonials', '📬 Newsletter', '📢 CTA', '🔗 Footer'],
  },
  {
    id: 'personal-brand',
    icon: '👤',
    label: 'Personal Brand',
    desc: 'About → Services → Timeline → Testimonials → Contact. Great for coaches and freelancers.',
    color: '#10b981',
    sections: ['hero', 'services', 'timeline', 'testimonials', 'team', 'contact', 'footer'],
    preview: ['🦸 Hero', '🛠 Services', '📅 Timeline', '💬 Testimonials', '👥 Team', '✉️ Contact', '🔗 Footer'],
  },
  {
    id: 'agency-portfolio',
    icon: '🎨',
    label: 'Agency Portfolio',
    desc: 'Showcase work, team, and process. Built for creative agencies and studios.',
    color: '#8b5cf6',
    sections: ['hero', 'logobar', 'features', 'team', 'timeline', 'testimonials', 'contact', 'footer'],
    preview: ['🦸 Hero', '🏢 Clients', '✨ Services', '👥 Team', '📅 Process', '💬 Reviews', '✉️ Contact', '🔗 Footer'],
  },
  {
    id: 'event-launch',
    icon: '🎉',
    label: 'Event / Launch',
    desc: 'Landing page for product launches, webinars, and live events with countdown feel.',
    color: '#f59e0b',
    sections: ['hero', 'features', 'timeline', 'team', 'faq', 'newsletter', 'ctabanner', 'footer'],
    preview: ['🦸 Hero', '✨ What to expect', '📅 Schedule', '👥 Speakers', '❓ FAQ', '📬 Register', '📢 Banner', '🔗 Footer'],
  },
]

export default function TemplateGalleryPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'ads' | 'pages'>('ads')
  const [selectedPack, setSelectedPack] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [launched, setLaunched] = useState<string | null>(null)

  const projects = Storage.getProjects()
  const kit = projects[0]?.kit || { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9', font: 'Inter', industry: 'SaaS', tone: 'Premium' }

  const handleLoadPack = (packId: string) => {
    setLaunched(packId)
    setTimeout(() => {
      navigate('/ad-studio')
    }, 900)
  }

  const handleLoadTemplate = (templateId: string) => {
    const template = PAGE_TEMPLATES.find(t => t.id === templateId)
    if (!template || !projects[0]) return

    // Apply section order to the project
    const raw = sessionStorage.getItem('bs_active_project') || sessionStorage.getItem('bs_preview_project')
    if (raw) {
      const project = JSON.parse(raw)
      // Mark sections enabled based on template
      const updated = {
        ...project,
        sections: project.sections?.map((s: any) => ({
          ...s,
          enabled: template.sections.includes(s.type),
        })),
      }
      sessionStorage.setItem('bs_preview_project', JSON.stringify(updated))
    }
    setLaunched(templateId)
    setTimeout(() => navigate('/preview'), 900)
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 6 }}>
          Template Gallery
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          Curated starter packs and page templates — pick one and hit the ground running.
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
        {([['ads', '📦 Ad Packs'], ['pages', '🖥 Page Templates']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: activeTab === key ? 'rgba(255,255,255,0.1)' : 'transparent', color: activeTab === key ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: activeTab === key ? 700 : 400, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── AD PACKS TAB ── */}
        {activeTab === 'ads' && (
          <motion.div key="ads" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16, marginBottom: 28 }}>
              {AD_PACKS.map((pack, i) => (
                <motion.div key={pack.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedPack(selectedPack === pack.id ? null : pack.id)}
                  style={{ padding: '22px', borderRadius: 16, background: selectedPack === pack.id ? `${pack.color}12` : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedPack === pack.id ? pack.color + '40' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: pack.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{pack.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 3 }}>{pack.label}</div>
                      <div style={{ fontSize: 11, color: pack.color, fontWeight: 700 }}>{pack.count} ads in this pack</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 14 }}>{pack.desc}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                    {pack.tags.map(tag => (
                      <span key={tag} style={{ padding: '3px 8px', borderRadius: 5, background: pack.color + '15', color: pack.color, fontSize: 10, fontWeight: 700 }}>{tag}</span>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedPack === pack.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 14, marginBottom: 14 }}>
                          {pack.ads.map((ad, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <span style={{ fontSize: 11, color: pack.color, fontWeight: 800, minWidth: 18 }}>#{j + 1}</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{ad.headline}</div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{ad.format.replace(/-/g, ' ')}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={e => { e.stopPropagation(); handleLoadPack(pack.id) }}
                    style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: launched === pack.id ? '#10b981' : `linear-gradient(135deg,${pack.color},${pack.color}bb)`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'background 0.3s' }}>
                    {launched === pack.id ? '✓ Loading into Ad Studio…' : `Load ${pack.label} Pack →`}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── PAGE TEMPLATES TAB ── */}
        {activeTab === 'pages' && (
          <motion.div key="pages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
              {PAGE_TEMPLATES.map((tpl, i) => (
                <motion.div key={tpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ padding: '22px', borderRadius: 16, background: selectedTemplate === tpl.id ? `${tpl.color}10` : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedTemplate === tpl.id ? tpl.color + '40' : 'rgba(255,255,255,0.07)'}`, cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setSelectedTemplate(selectedTemplate === tpl.id ? null : tpl.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: tpl.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{tpl.icon}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 2 }}>{tpl.label}</div>
                      <div style={{ fontSize: 11, color: tpl.color, fontWeight: 600 }}>{tpl.sections.length} sections</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 14 }}>{tpl.desc}</div>

                  {/* Section preview strip */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                    {tpl.preview.map((sec, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                        <div style={{ width: 3, height: 14, borderRadius: 2, background: tpl.color, flexShrink: 0 }} />
                        {sec}
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={e => { e.stopPropagation(); handleLoadTemplate(tpl.id) }}
                    style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: launched === tpl.id ? '#10b981' : `linear-gradient(135deg,${tpl.color},${tpl.color}bb)`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'background 0.3s' }}>
                    {launched === tpl.id ? '✓ Opening Composer…' : `Use ${tpl.label} Template →`}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
