/**
 * Public quote acceptance page — /accept-quote/:token
 * No auth required. Client views the quote, draws signature, accepts or declines.
 * Quote data is fetched from the server API (stored when quote was sent),
 * so this works on any device — not tied to Malcolm's localStorage.
 */
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BillingDoc, calcDocTotals, fmtMoney } from '../billing/types'
import DocPreview from '../billing/DocPreview'

type Phase = 'loading' | 'view' | 'sign' | 'done-accepted' | 'done-declined' | 'expired' | 'already'

// ── Signature canvas ─────────────────────────────────────────────
function SignaturePad({ onSave, onClear, primary }: {
  onSave: (dataUrl: string) => void
  onClear: () => void
  primary: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing   = useRef(false)
  const [hasStrokes, setHasStrokes] = useState(false)

  const getPos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!
    const rect   = canvas.getBoundingClientRect()
    const src    = 'touches' in e ? e.touches[0] : e
    return { x: (src.clientX - rect.left) * (canvas.width / rect.width),
             y: (src.clientY - rect.top)  * (canvas.height / rect.height) }
  }

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const pos = getPos(e.nativeEvent)
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y)
    e.preventDefault()
  }
  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const pos = getPos(e.nativeEvent)
    ctx.lineTo(pos.x, pos.y); ctx.stroke()
    setHasStrokes(true); e.preventDefault()
  }
  const stop = () => { drawing.current = false }

  const clear = () => {
    const canvas = canvasRef.current!
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    setHasStrokes(false); onClear()
  }

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth   = 2.5
    ctx.lineCap     = 'round'
    ctx.lineJoin    = 'round'
  }, [])

  return (
    <div>
      <div style={{ border: `2px dashed ${primary}60`, borderRadius: 12, overflow: 'hidden',
        background: '#fafafa', marginBottom: 12, touchAction: 'none' }}>
        <canvas ref={canvasRef} width={560} height={140}
          style={{ display: 'block', width: '100%', cursor: 'crosshair' }}
          onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={move} onTouchEnd={stop} />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={clear}
          style={{ padding:'8px 18px', borderRadius:8, border:'1px solid #e5e7eb',
            background:'#f9fafb', color:'#6b7280', fontSize:13, cursor:'pointer' }}>
          Clear
        </button>
        <button onClick={() => { if (hasStrokes) onSave(canvasRef.current!.toDataURL('image/png')) }}
          disabled={!hasStrokes}
          style={{ flex:1, padding:'10px 18px', borderRadius:8, border:'none',
            background: hasStrokes ? `linear-gradient(135deg,${primary},#6366f1)` : '#e5e7eb',
            color: hasStrokes ? '#fff' : '#9ca3af', fontSize:14, fontWeight:700, cursor: hasStrokes ? 'pointer' : 'default',
            transition:'all 0.2s' }}>
          ✔ Sign &amp; Accept Quote
        </button>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────
export default function AcceptQuotePage() {
  const { token } = useParams<{ token: string }>()
  const [doc,   setDoc]   = useState<BillingDoc | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [reason, setReason] = useState('')
  const [sending, setSending] = useState(false)
  const [zoom,  setZoom]  = useState(0.65)

  useEffect(() => {
    if (!token) { setPhase('expired'); return }

    // Fetch quote from server API (works on any device)
    fetch(`/api/billing/quote/${token}`)
      .then(r => r.json())
      .then(data => {
        if (!data.doc) { setPhase('expired'); return }
        const d: BillingDoc = data.doc
        if (d.type !== 'quote') { setPhase('expired'); return }
        if (d.status === 'accepted' || d.status === 'declined') {
          setDoc(d); setPhase('already'); return
        }
        setDoc(d); setPhase('view')
      })
      .catch(() => setPhase('expired'))
  }, [token])

  const sendNotification = async (accepted: boolean, sig?: string) => {
    if (!doc) return
    try {
      await fetch('/api/billing/quote-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,                               // ← needed to update server store
          docNumber:   doc.docNumber,
          fromCompany: doc.companyName,
          fromEmail:   doc.companyEmail,
          accepted,
          declineReason: reason,
          signatureData: sig,
          amount: fmtMoney(calcDocTotals(doc.items).total, doc.currency),
        }),
      })
    } catch { /* non-blocking */ }
  }

  const handleAccept = async (sigData: string) => {
    if (!token) return
    setSending(true)
    setDoc(d => d ? { ...d, status: 'accepted', signatureData: sigData, acceptedAt: new Date().toISOString() } : d)
    await sendNotification(true, sigData)
    setPhase('done-accepted')
    setSending(false)
  }

  const handleDecline = async () => {
    if (!token) return
    setSending(true)
    setDoc(d => d ? { ...d, status: 'declined', declinedAt: new Date().toISOString(), declineReason: reason } : d)
    await sendNotification(false)
    setPhase('done-declined')
    setSending(false)
  }

  const primary   = doc?.colours.primary   || '#6366f1'
  const secondary = doc?.colours.secondary || '#0ea5e9'

  // ── States ────────────────────────────────────────────────────
  if (phase === 'loading') return (
    <div style={container}>
      <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
      <div style={{ color:'#6b7280' }}>Loading quotation…</div>
    </div>
  )

  if (phase === 'expired') return (
    <div style={container}>
      <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
      <h2 style={{ margin:'0 0 8px', color:'#111827' }}>Link Not Found</h2>
      <p style={{ color:'#6b7280' }}>This quote link is invalid or has expired.</p>
    </div>
  )

  if (phase === 'already') return (
    <div style={container}>
      <div style={{ fontSize:56, marginBottom:16 }}>{doc?.status === 'accepted' ? '✅' : '❌'}</div>
      <h2 style={{ margin:'0 0 8px', color:'#111827', fontSize:22 }}>
        Quote Already {doc?.status === 'accepted' ? 'Accepted' : 'Declined'}
      </h2>
      <p style={{ color:'#6b7280', maxWidth:380, textAlign:'center', lineHeight:1.6 }}>
        {doc?.status === 'accepted'
          ? `This quotation was accepted on ${doc.acceptedAt?.split('T')[0]}. Your signature is on file.`
          : `This quotation was declined on ${doc?.declinedAt?.split('T')[0]}.`}
      </p>
      {doc?.status === 'accepted' && doc.signatureData && (
        <div style={{ marginTop:24, padding:'16px', background:'#f9fafb', borderRadius:12, border:'1px solid #e5e7eb' }}>
          <div style={{ fontSize:11, color:'#9ca3af', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.08em' }}>Signature on file</div>
          <img src={doc.signatureData} alt="Signature" style={{ maxWidth:280, display:'block' }} />
        </div>
      )}
    </div>
  )

  if (phase === 'done-accepted') return (
    <div style={container}>
      <div style={{ fontSize:64, marginBottom:16 }}>🎉</div>
      <h2 style={{ margin:'0 0 8px', color:'#111827', fontSize:24 }}>Quote Accepted!</h2>
      <p style={{ color:'#6b7280', maxWidth:400, textAlign:'center', lineHeight:1.7 }}>
        Thank you for accepting <strong>{doc?.docNumber}</strong>. A confirmation has been sent
        to {doc?.companyName}. They will be in touch shortly to proceed.
      </p>
      <div style={{ marginTop:28, padding:'16px 24px', background:`${primary}0d`,
        border:`1px solid ${primary}25`, borderRadius:12, fontSize:13, color:'#374151' }}>
        ✅ Digitally signed &amp; timestamped — {new Date().toLocaleString('en-ZA')}
      </div>
    </div>
  )

  if (phase === 'done-declined') return (
    <div style={container}>
      <div style={{ fontSize:64, marginBottom:16 }}>📝</div>
      <h2 style={{ margin:'0 0 8px', color:'#111827', fontSize:24 }}>Quote Declined</h2>
      <p style={{ color:'#6b7280', maxWidth:400, textAlign:'center', lineHeight:1.7 }}>
        Your response has been recorded. {doc?.companyName} has been notified.
      </p>
    </div>
  )

  // ── Main view ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#f1f5f9', fontFamily:"'Inter','Segoe UI',sans-serif" }}>

      {/* Top bar */}
      <div style={{ background:`linear-gradient(135deg,${primary},${secondary})`,
        padding:'14px 32px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ color:'white', fontWeight:800, fontSize:16 }}>
          {doc?.companyName || 'Quote'} <span style={{ opacity:0.6, fontWeight:400, marginLeft:8 }}>· {doc?.docNumber}</span>
        </div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>Powered by Move Studio</div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px', display:'flex', gap:32, alignItems:'flex-start' }}>

        {/* Left: preview */}
        <div style={{ flex:'1 1 0', minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <span style={{ fontSize:13, color:'#6b7280' }}>Zoom</span>
            <input type="range" min={0.4} max={1} step={0.05} value={zoom}
              onChange={e => setZoom(+e.target.value)}
              style={{ width:100, accentColor: primary }} />
            <span style={{ fontSize:12, color:'#9ca3af' }}>{Math.round(zoom*100)}%</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <div style={{ transform:`scale(${zoom})`, transformOrigin:'top left', display:'inline-block' }}>
              <DocPreview doc={doc!} />
            </div>
          </div>
        </div>

        {/* Right: action panel */}
        <div style={{ width:320, flexShrink:0, position:'sticky', top:24 }}>
          <div style={{ background:'white', borderRadius:16, boxShadow:'0 4px 24px rgba(0,0,0,0.08)',
            border:'1px solid #f1f5f9', overflow:'hidden' }}>

            {/* Header */}
            <div style={{ background:`linear-gradient(135deg,${primary},${secondary})`,
              padding:'20px 24px' }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.7)',
                textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Quotation</div>
              <div style={{ fontSize:20, fontWeight:900, color:'white', marginBottom:2 }}>{doc?.docNumber}</div>
              <div style={{ fontSize:22, fontWeight:900, color:'rgba(255,255,255,0.95)' }}>
                {fmtMoney(calcDocTotals(doc!.items).total, doc!.currency)}</div>
            </div>

            <div style={{ padding:'20px 24px' }}>
              {phase === 'view' && (
                <>
                  <p style={{ fontSize:13, color:'#374151', lineHeight:1.6, margin:'0 0 20px' }}>
                    Please review the quotation and either <strong>accept</strong> or <strong>decline</strong>.
                  </p>
                  <button onClick={() => setPhase('sign')}
                    style={{ width:'100%', padding:'12px', borderRadius:10, border:'none',
                      background:`linear-gradient(135deg,${primary},${secondary})`,
                      color:'white', fontSize:15, fontWeight:700, cursor:'pointer',
                      boxShadow:`0 4px 14px ${primary}40`, marginBottom:10 }}>
                    ✅ Accept &amp; Sign
                  </button>
                  <button
                    style={{ width:'100%', padding:'10px', borderRadius:10,
                      border:'1px solid #e5e7eb', background:'#f9fafb', color:'#6b7280',
                      fontSize:13, cursor:'pointer' }}
                    onMouseOver={e => (e.currentTarget.style.borderColor = '#f87171')}
                    onMouseOut={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                    onClick={() => setPhase('sign')}>
                    ❌ Decline
                  </button>
                </>
              )}

              {phase === 'sign' && (
                <>
                  <div style={{ fontSize:14, fontWeight:700, color:'#111827', marginBottom:4 }}>
                    Sign to Accept
                  </div>
                  <p style={{ fontSize:12, color:'#6b7280', margin:'0 0 14px', lineHeight:1.5 }}>
                    Draw your signature below to formally accept this quotation.
                  </p>
                  <SignaturePad primary={primary} onClear={() => {}} onSave={handleAccept} />

                  <div style={{ marginTop:20, borderTop:'1px solid #f3f4f6', paddingTop:16 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#374151', marginBottom:8 }}>
                      Or — Decline this quote
                    </div>
                    <textarea value={reason} onChange={e => setReason(e.target.value)}
                      placeholder="Reason for declining (optional)…"
                      style={{ width:'100%', minHeight:64, padding:'8px 12px', borderRadius:8,
                        border:'1px solid #e5e7eb', fontSize:12, color:'#374151', resize:'vertical',
                        outline:'none', fontFamily:'inherit', boxSizing:'border-box' }} />
                    <button onClick={handleDecline} disabled={sending}
                      style={{ width:'100%', marginTop:8, padding:'9px', borderRadius:8,
                        border:'1px solid #fca5a5', background:'#fff5f5', color:'#ef4444',
                        fontSize:13, fontWeight:600, cursor:'pointer' }}>
                      {sending ? 'Submitting…' : '❌ Decline Quote'}
                    </button>
                  </div>

                  <button onClick={() => setPhase('view')}
                    style={{ width:'100%', marginTop:12, padding:'8px', border:'none',
                      background:'none', color:'#9ca3af', fontSize:12, cursor:'pointer' }}>
                    ← Back to review
                  </button>
                </>
              )}
            </div>

            {/* Trust badge */}
            <div style={{ padding:'12px 24px', background:'#f8fafc', borderTop:'1px solid #f1f5f9',
              display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:16 }}>🔐</span>
              <div style={{ fontSize:11, color:'#94a3b8', lineHeight:1.4 }}>
                Digitally signed &amp; timestamped.<br/>Legally binding under electronic signature laws.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const container: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center',
  background: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif",
  padding: '40px 24px', textAlign: 'center',
}
