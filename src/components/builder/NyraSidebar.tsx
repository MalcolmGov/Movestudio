import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandKit, PageSection, SectionContent } from '../../types'
import { streamNyra, NyraAction } from '../../lib/ai'

interface Message { role: 'user' | 'assistant'; content: string }

const SUGGESTED_PROMPTS = [
  'Make the hero headline more urgent and compelling',
  'Write 3 FAQ answers about security and pricing',
  'Add feature cards about integrations and automation',
  'Rewrite the CTA section in a bolder, more confident tone',
  'Add a testimonials section with 3 realistic reviews',
  'Suggest a better page structure for lead generation',
]

interface Props {
  open: boolean
  onClose: () => void
  sections: PageSection[]
  kit: BrandKit
  onUpdateSection: (sectionId: string, content: Partial<SectionContent>) => void
  onEnableSection: (sectionId: string, enabled: boolean) => void
  onReorderSections: (order: string[]) => void
}

export default function NyraSidebar({ open, onClose, sections, kit, onUpdateSection, onEnableSection, onReorderSections }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streamText])

  const sectionsJson = JSON.stringify(
    sections.map(s => ({ id: s.id, type: s.type, enabled: s.enabled, content: s.content })),
    null, 2
  )

  const send = async (text?: string) => {
    const userMsg = text || input.trim()
    if (!userMsg || streaming) return
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setStreaming(true)
    setStreamText('')

    let assistantText = ''
    try {
      const stream = streamNyra(
        newMessages.map(m => ({ role: m.role, content: m.content })),
        sectionsJson, kit
      )
      for await (const chunk of stream) {
        if (chunk.text) {
          assistantText += chunk.text
          setStreamText(assistantText)
        }
        if (chunk.actions) {
          executeActions(chunk.actions)
        }
        if (chunk.done) break
      }
    } catch (e: any) {
      assistantText = `⚠️ ${e.message}`
      setStreamText(assistantText)
    }

    // Clean ACTIONS block from display text
    const displayText = assistantText.replace(/ACTIONS:[\s\S]*$/, '').trim()
    setMessages(prev => [...prev, { role: 'assistant', content: displayText || assistantText }])
    setStreamText('')
    setStreaming(false)
  }

  const executeActions = (actions: NyraAction[]) => {
    for (const action of actions) {
      if (action.type === 'UPDATE_SECTION' && action.sectionId && action.content) {
        onUpdateSection(action.sectionId, action.content)
      } else if (action.type === 'ENABLE_SECTION' && action.sectionId && action.enabled !== undefined) {
        onEnableSection(action.sectionId, action.enabled)
      } else if (action.type === 'REORDER_SECTIONS' && action.order) {
        onReorderSections(action.order)
      }
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.3)' }} />

          {/* Sidebar */}
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, zIndex: 91, background: '#0a0f1a', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.4)' }}>

            {/* Header */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, background: 'linear-gradient(180deg,rgba(103,232,249,0.06),transparent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#67e8f9,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 20px rgba(103,232,249,0.3)' }}>✨</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Nyra</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>AI Copywriter · {sections.filter(s => s.enabled).length} sections</div>
                </div>
                <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18, padding: 4 }}>✕</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {messages.length === 0 && !streaming && (
                <div>
                  <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 4 }}>Hi! I'm Nyra</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>I can write copy, add sections, and edit your page. Just tell me what you need.</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Try asking:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {SUGGESTED_PROMPTS.map(p => (
                      <button key={p} onClick={() => send(p)}
                        style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(103,232,249,0.08)'; e.currentTarget.style.borderColor = 'rgba(103,232,249,0.25)'; e.currentTarget.style.color = 'white' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 14, display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>
                  {m.role === 'assistant' && (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#67e8f9,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, marginTop: 2 }}>✨</div>
                  )}
                  <div style={{ maxWidth: '80%', padding: '10px 13px', borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px', background: m.role === 'user' ? 'linear-gradient(135deg,#1d4ed8,#6d28d9)' : 'rgba(255,255,255,0.06)', border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none', color: 'white', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Streaming message */}
              {streaming && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#67e8f9,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, animation: 'pulse 1s infinite' }}>✨</div>
                  <div style={{ maxWidth: '80%', padding: '10px 13px', borderRadius: '12px 12px 12px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {streamText || <span style={{ color: 'rgba(255,255,255,0.4)' }}>Thinking…</span>}
                    <span style={{ display: 'inline-block', width: 2, height: 14, background: '#67e8f9', marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s infinite' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder="Ask Nyra to edit your page…"
                  rows={2}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5 }} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => send()} disabled={!input.trim() || streaming}
                  style={{ width: 40, height: 40, borderRadius: 10, border: 'none', background: input.trim() && !streaming ? 'linear-gradient(135deg,#67e8f9,#8b5cf6)' : 'rgba(255,255,255,0.08)', color: 'white', cursor: input.trim() && !streaming ? 'pointer' : 'not-allowed', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: input.trim() && !streaming ? '0 4px 14px rgba(103,232,249,0.3)' : 'none' }}>
                  ↑
                </motion.button>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 6, textAlign: 'center' }}>Enter to send · Shift+Enter for new line</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
