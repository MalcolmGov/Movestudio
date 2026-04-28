import { useState } from 'react'
import { motion } from 'framer-motion'
import { generateImage } from '../../lib/ai'

interface Props {
  onImage: (dataUrl: string) => void
  placeholder?: string
  compact?: boolean
  accentColor?: string
}

export default function AiImageGenerator({ onImage, placeholder = 'Describe the image you want…', compact = false, accentColor = '#67e8f9' }: Props) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!prompt.trim()) return
    setLoading(true); setError('')
    try {
      const url = await generateImage(prompt)
      onImage(url)
      setPrompt('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input value={prompt} onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder={placeholder}
          style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: `1px solid ${accentColor}30`, background: `${accentColor}08`, color: 'white', fontSize: 12, outline: 'none', fontFamily: 'inherit' }} />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={generate} disabled={loading || !prompt.trim()}
          style={{ padding: '7px 12px', borderRadius: 7, border: 'none', background: loading ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg,${accentColor},#8b5cf6)`, color: 'white', fontWeight: 700, fontSize: 12, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
          {loading ? '⏳' : '✨ Generate'}
        </motion.button>
        {error && <div style={{ fontSize: 10, color: '#f87171', maxWidth: 140 }}>{error}</div>}
      </div>
    )
  }

  return (
    <div style={{ padding: '12px', borderRadius: 10, background: `${accentColor}08`, border: `1px solid ${accentColor}25` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>✨</span> AI Image Generator
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 400, marginLeft: 'auto' }}>~$0.04 / image</span>
      </div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={placeholder} rows={2}
        style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `1px solid ${accentColor}30`, background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 12, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 8 }} />
      {error && (
        <div style={{ padding: '8px 10px', borderRadius: 7, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 11, marginBottom: 8 }}>{error}</div>
      )}
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={loading || !prompt.trim()}
        style={{ width: '100%', padding: '9px', borderRadius: 8, border: 'none', background: loading || !prompt.trim() ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${accentColor},#8b5cf6)`, color: loading || !prompt.trim() ? 'rgba(255,255,255,0.4)' : 'white', fontWeight: 700, fontSize: 13, cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {loading
          ? <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>✨</span> Generating… (10-20s)</>
          : '✨ Generate with DALL-E 3'}
      </motion.button>
    </div>
  )
}
