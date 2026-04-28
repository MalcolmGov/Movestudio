import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SKILL_MD = `# Move Studio — Agent Skills
## Purpose
You are an expert at integrating Move Studio branded components, ad canvases, and brand kit patterns into React/TypeScript projects.

## Brand Kit Pattern
Every Move Studio project exposes a \`BrandKit\` object via \`sessionStorage\` key \`bs_preview_project\`:
\`\`\`ts
interface BrandKit {
  primary: string    // Primary hex color e.g. "#3b82f6"
  secondary: string  // Secondary hex color
  accent: string     // Accent hex color
  font: string       // Google Font name e.g. "Inter"
  logo: string|null  // Base64 logo or null
  industry: string   // e.g. "Fintech"
  tone: string       // e.g. "Premium"
}
\`\`\`
Access it: \`JSON.parse(sessionStorage.getItem('bs_preview_project'))?.kit\`

## CSS Variables
Apply brand colors via CSS variables set on :root:
\`\`\`css
:root {
  --brand-primary: #3b82f6;
  --brand-secondary: #8b5cf6;
  --brand-accent: #67e8f9;
  --font: 'Inter', sans-serif;
}
\`\`\`

## AdCanvas Component
\`\`\`tsx
import AdCanvas from '@/components/AdCanvas'
// Renders a live-preview social ad card
<AdCanvas
  format="instagram-post" // 'instagram-post'|'instagram-story'|'instagram-reel'|'facebook-ad'|'facebook-reel'|'linkedin-post'|'twitter-x'
  ad={generatedAd}       // GeneratedAd from adCopyEngine
  kit={{ primary, secondary, accent, font, logo, brandName }}
/>
\`\`\`

## Ad Copy Engine
\`\`\`ts
import { generateAdCopy } from '@/utils/adCopyEngine'
const ad = generateAdCopy({
  prompt: 'Launching our new payment card',
  adType: 'product-launch', // 'product-launch'|'sale-offer'|'event-promo'|'testimonial'|'brand-awareness'
  tone: 'professional',     // 'professional'|'bold'|'playful'|'minimal'|'urgent'
  format: 'instagram-post',
  industry: 'Fintech',
  brandName: 'YourBrand',
  primaryColor: '#3b82f6',
})
// Returns: { headline, subheadline, body, cta, hashtags, caption, emojiSet }
\`\`\`

## Ad Score Engine
\`\`\`ts
import { scoreAd } from '@/utils/adScoreEngine'
const score = scoreAd(ad, { primaryColor, font, industry })
// Returns: { hook, cta, brandConsistency, hashtagStrength, overall, grade, tips }
\`\`\`

## Brand-Aware Component Pattern
Always wrap components with brand colors:
\`\`\`tsx
<div style={{
  background: \`linear-gradient(135deg, \${kit.primary}, \${kit.secondary})\`,
  fontFamily: \`'\${kit.font}', sans-serif\`,
  color: 'white'
}}>
  {/* Your component */}
</div>
\`\`\`

## Routing Convention
- /home — Marketing landing page
- /brand-studio — Brand Kit wizard (3 steps)
- /ad-studio — Social Ad Studio
- /dashboard — Project manager
- /pricing — Plans page
- /agent-skills — This page

## Project Persistence
\`\`\`ts
import { Storage } from '@/types'
const projects = Storage.getProjects()
const project = Storage.getProject(id)
Storage.saveProject(project)
\`\`\`

## Rules for AI Agents
1. Always read the BrandKit before generating any UI — never hardcode colors
2. Use CSS variables (--brand-primary etc.) in stylesheets
3. AdCanvas requires both \`ad\` and \`kit\` props — never omit either
4. All new pages go in \`src/pages/\`, components in \`src/components/\`
5. Use framer-motion for all animations — no CSS keyframes
6. All inline styles use camelCase React style objects
7. TypeScript strict — no \`any\` types
`

const PLANS = [
  { key: 'starter', label: 'Starter', locked: true,  color: '#6b7280' },
  { key: 'pro',     label: 'Pro',     locked: false, color: '#3b82f6' },
  { key: 'agency',  label: 'Agency',  locked: false, color: '#8b5cf6' },
]

const SKILLS = [
  { icon: '🎨', title: 'Brand Kit Integration', desc: 'Teach your agent to read and apply brand colors, fonts, and logos automatically.' },
  { icon: '📣', title: 'Ad Copy Engine', desc: 'Generate on-brand social ad copy across 7 formats and 5 tones with one function call.' },
  { icon: '🎯', title: 'Ad Score Engine', desc: 'Grade ads by Hook, CTA, Brand Consistency, and Hashtag Strength.' },
  { icon: '🖼', title: 'AdCanvas Component', desc: 'Drop a live-preview ad canvas into any page with full brand kit support.' },
  { icon: '📁', title: 'Project Persistence', desc: 'Read, write and manage brand projects via the Storage utility.' },
  { icon: '🧭', title: 'Routing & Architecture', desc: 'Full page and component map so your agent always creates files in the right place.' },
]

export default function AgentSkillsPage() {
  const userPlan = (() => { try { return JSON.parse(localStorage.getItem('ms_user') || '{}')?.plan || 'starter' } catch { return 'starter' } })()
  const isUnlocked = userPlan === 'pro' || userPlan === 'agency'
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeAgent, setActiveAgent] = useState<string | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(SKILL_MD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([SKILL_MD], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'MOVE_STUDIO_SKILL.md'; a.click()
    URL.revokeObjectURL(url)
  }

  const agents = [
    { id: 'cursor', name: 'Cursor', icon: '⬛', instruction: 'Add MOVE_STUDIO_SKILL.md to your .cursor/rules directory, or paste contents into Project Rules in Cursor Settings.' },
    { id: 'copilot', name: 'GitHub Copilot', icon: '🐙', instruction: 'Add MOVE_STUDIO_SKILL.md to your .github/copilot-instructions.md file in your repo root.' },
    { id: 'claude', name: 'Claude Projects', icon: '🟠', instruction: 'Open Claude → Projects → New Project → add MOVE_STUDIO_SKILL.md as a Project Knowledge document.' },
    { id: 'windsurf', name: 'Windsurf', icon: '🏄', instruction: 'Drop MOVE_STUDIO_SKILL.md into your .windsurf/rules/ folder or add via the Cascade Rules panel.' },
  ]

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 99, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', marginBottom: 14 }}>
          <span style={{ fontSize: 14 }}>🤖</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa' }}>Agent Skills</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: 10 }}>Agent Skills</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 560, lineHeight: 1.7 }}>
          Give your AI coding agent the knowledge to perfectly integrate Move Studio components, brand kits, and ad engines into any project.
        </p>
      </motion.div>

      {/* Main locked/unlocked card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ borderRadius: 20, border: `1px dashed ${isUnlocked ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.12)'}`, background: isUnlocked ? 'rgba(139,92,246,0.05)' : 'rgba(255,255,255,0.02)', padding: '48px 32px', textAlign: 'center', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>

        {/* Glow */}
        {isUnlocked && <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%)', pointerEvents: 'none' }} />}

        {!isUnlocked ? (
          <>
            {/* Lock icon */}
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 20px' }}>🔒</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 8 }}>Unlock Agent Skills</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 28, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 28px' }}>
              Purchase a Pro or Agency plan to access the <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>MOVE_STUDIO_SKILL.md</code> file and unlock AI-assisted component integration.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => window.location.href = '/pricing'}
                style={{ padding: '12px 28px', borderRadius: 10, border: 'none', background: 'white', color: '#111', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 8 }}>
                🔒 Unlock Now
              </motion.button>
              <button onClick={() => window.location.href = '/auth'}
                style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                Login
              </button>
            </div>
          </>
        ) : (
          <>
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}
              style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>
              🤖
            </motion.div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 8 }}>MOVE_STUDIO_SKILL.md</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 28, lineHeight: 1.7 }}>
              Your AI agent now knows everything about Move Studio. Drop this file into Cursor, Copilot, Claude Projects or Windsurf.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleDownload}
                style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#3b82f6)', color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}>
                ⬇ Download SKILL.md
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} onClick={handleCopy}
                style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: copied ? '#10b981' : 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} onClick={() => setShowPreview(v => !v)}
                style={{ padding: '12px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                {showPreview ? '▲ Hide' : '👁 Preview'}
              </motion.button>
            </div>

            {/* Preview */}
            <AnimatePresence>
              {showPreview && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginTop: 20, textAlign: 'left' }}>
                  <pre style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px', overflowX: 'auto', lineHeight: 1.7, fontFamily: 'var(--mono)', maxHeight: 320, overflowY: 'auto', margin: 0 }}>
                    {SKILL_MD}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>

      {/* What's included */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>What your agent learns</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
          {SKILLS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              style={{ padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
              {!isUnlocked && <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(2px)', background: 'rgba(0,0,0,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔒</div>}
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 5 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Agent integration instructions */}
      {isUnlocked && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>How to add to your agent</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {agents.map(a => (
              <motion.div key={a.id} whileHover={{ y: -3 }} onClick={() => setActiveAgent(activeAgent === a.id ? null : a.id)}
                style={{ padding: '14px', borderRadius: 12, border: `1px solid ${activeAgent === a.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`, background: activeAgent === a.id ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{a.name}</div>
                <AnimatePresence>
                  {activeAgent === a.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginTop: 6 }}>{a.instruction}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {activeAgent !== a.id && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Click for instructions</div>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plan comparison */}
      {!isUnlocked && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Included in your plan</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {PLANS.map(p => (
              <div key={p.key} style={{ flex: 1, padding: '14px', borderRadius: 12, border: `1px solid ${p.locked ? 'rgba(255,255,255,0.07)' : p.color + '40'}`, background: p.locked ? 'transparent' : p.color + '10', textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: p.locked ? 'rgba(255,255,255,0.4)' : 'white', marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontSize: 18 }}>{p.locked ? '🔒' : '✅'}</div>
                <div style={{ fontSize: 10, color: p.locked ? 'rgba(255,255,255,0.25)' : p.color, marginTop: 4, fontWeight: 600 }}>{p.locked ? 'Not included' : 'Included'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
