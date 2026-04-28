/**
 * PublishModal — collects a clean URL slug before deploying to Vercel.
 * Shows a live preview of the resulting URL and validates format.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  defaultName: string        // Pre-fill from project name
  primaryColor: string
  accentColor: string
  onConfirm: (slug: string) => void
  onCancel: () => void
}

function toSlug(raw: string): string {
  return raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function validate(slug: string): string | null {
  if (!slug) return 'A site name is required.'
  if (slug.length < 3) return 'Must be at least 3 characters.'
  if (slug.length > 48) return 'Must be 48 characters or fewer.'
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug)) return 'Use only letters, numbers, and hyphens. Cannot start or end with a hyphen.'
  return null
}

export default function PublishModal({ open, defaultName, primaryColor, accentColor, onConfirm, onCancel }: Props) {
  const [slug, setSlug] = useState(() => toSlug(defaultName))
  const [touched, setTouched] = useState(false)
  const error = touched ? validate(slug) : null
  const liveUrl = slug ? `https://${slug}.vercel.app` : 'https://your-site.vercel.app'

  // Re-sync when defaultName changes (e.g. user renames project)
  useEffect(() => { setSlug(toSlug(defaultName)); setTouched(false) }, [defaultName])

  const handleInput = (val: string) => {
    setSlug(toSlug(val))
    setTouched(true)
  }

  const handleConfirm = () => {
    setTouched(true)
    if (validate(slug)) return
    onConfirm(slug)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <motion.div initial={{ scale: 0.93, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 20 }}
            style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '36px', maxWidth: 460, width: '92%', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>▲</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>Deploy to Vercel</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Choose your public URL before going live</div>
              </div>
            </div>

            {/* Slug input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                Site Name / URL Slug <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="publish-slug-input"
                type="text"
                value={slug}
                onChange={e => handleInput(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="my-company"
                autoFocus
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10, fontSize: 15, fontWeight: 600,
                  background: 'rgba(255,255,255,0.05)', color: 'white', fontFamily: 'monospace',
                  border: `1px solid ${error ? '#ef4444' : touched && !error ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
              />
              {error && (
                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>⚠ {error}</div>
              )}
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                Lowercase letters, numbers and hyphens only
              </div>
            </div>

            {/* Live URL preview */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Your live URL will be</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: accentColor, wordBreak: 'break-all', fontFamily: 'monospace' }}>{liveUrl}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>You can add a custom domain after publishing</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onCancel}
                style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={!!error && touched}
                style={{ flex: 2, padding: '12px', borderRadius: 10, border: 'none', background: !error ? `linear-gradient(135deg,${primaryColor},${accentColor})` : 'rgba(255,255,255,0.06)', color: !error ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 13, cursor: !error ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                🚀 Deploy Now
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
