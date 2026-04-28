import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandKit, SectionType } from '../../types'
import { recommendSections, SectionRecommendation } from '../../lib/ai'

const GOALS = [
  { id: 'saas', label: '⚡ SaaS Homepage', desc: 'Product-led growth, free trial funnel' },
  { id: 'leadgen', label: '🎯 Lead Generation', desc: 'Capture leads, book demos' },
  { id: 'ecommerce', label: '🛍 E-commerce', desc: 'Sell products online' },
  { id: 'portfolio', label: '🎨 Portfolio', desc: 'Showcase work and services' },
  { id: 'agency', label: '🏢 Agency', desc: 'Services, case studies, team' },
  { id: 'restaurant', label: '🍽 Restaurant / Hospitality', desc: 'Menu, booking, location' },
  { id: 'event', label: '🎤 Event / Conference', desc: 'Schedule, speakers, tickets' },
  { id: 'startup', label: '🚀 Startup Launch', desc: 'Build hype, waitlist, investors' },
]

interface Props {
  open: boolean
  onClose: () => void
  kit: BrandKit
  onApply: (sections: SectionRecommendation[]) => void
}

export default function AiLayoutModal({ open, onClose, kit, onApply }: Props) {
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SectionRecommendation[]>([])
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const generate = async () => {
    if (!goal) return
    setLoading(true); setError(''); setResults([])
    try {
      const recs = await recommendSections(kit.industry, goal)
      setResults(recs)
      setSelected(new Set(recs.map(r => r.type)))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    onApply(results.filter(r => selected.has(r.type)))
    onClose()
  }

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ width: 560, maxHeight: '85vh', borderRadius: 16, background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ fontSize: 20 }}>✨</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'white' }}>AI Layout Recommender</div>
            <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Tell us your goal — AI will suggest the ideal page structure for a {kit.industry} site</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* Goal picker */}
          {!results.length && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>What is this website for?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {GOALS.map(g => (
                  <button key={g.id} onClick={() => setGoal(g.id)}
                    style={{ padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${goal === g.id ? kit.accent : 'rgba(255,255,255,0.08)'}`, background: goal === g.id ? `${kit.accent}15` : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>{g.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{g.desc}</div>
                  </button>
                ))}
              </div>
              {error && <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 12, marginBottom: 12 }}>{error}</div>}
            </>
          )}

          {/* Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                  Recommended layout — {selected.size} sections selected
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {results.map((r, i) => {
                    const on = selected.has(r.type)
                    return (
                      <motion.div key={r.type} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        onClick={() => setSelected(prev => { const n = new Set(prev); on ? n.delete(r.type) : n.add(r.type); return n })}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: `1px solid ${on ? kit.accent + '50' : 'rgba(255,255,255,0.07)'}`, background: on ? `${kit.accent}10` : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.15s' }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${on ? kit.accent : 'rgba(255,255,255,0.2)'}`, background: on ? kit.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, color: 'white', fontWeight: 800 }}>
                          {on ? '✓' : ''}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'white', textTransform: 'capitalize', marginBottom: 1 }}>{i + 1}. {r.type}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{r.reason}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
                <button onClick={() => { setResults([]); setGoal('') }}
                  style={{ marginTop: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 12, padding: 0 }}>
                  ← Choose different goal
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.5)' }}>
              <div style={{ fontSize: 28, marginBottom: 12, animation: 'spin 1s linear infinite', display: 'inline-block' }}>✨</div>
              <div style={{ fontSize: 13 }}>Designing your page structure…</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Cancel</button>
          {!results.length
            ? <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={!goal || loading}
                style={{ flex: 2, padding: '10px', borderRadius: 9, border: 'none', background: goal ? `linear-gradient(135deg,${kit.primary},${kit.accent})` : 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 700, fontSize: 13, cursor: goal ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                {loading ? '⏳ Generating…' : '✨ Generate Layout'}
              </motion.button>
            : <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleApply} disabled={selected.size === 0}
                style={{ flex: 2, padding: '10px', borderRadius: 9, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.accent})`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                ✓ Apply Layout ({selected.size} sections)
              </motion.button>
          }
        </div>
      </motion.div>
    </div>
  )
}
