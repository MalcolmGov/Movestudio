/**
 * Email/password auth modal backed by Supabase Auth.
 *
 * Handles three flows in one compact component:
 *   - Sign in (existing user)
 *   - Sign up (new user, email confirmation enabled in Supabase settings)
 *   - Forgot password (sends magic reset link)
 */
import { useState } from 'react'
import { storage } from '../../lib/storage'
import { SupabaseStorageProvider } from '../../lib/storage/supabase'

type Mode = 'signin' | 'signup' | 'reset'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onAuthed: () => void
}

export default function LoginModal({ open, onClose, onAuthed }: LoginModalProps) {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  if (!open) return null

  // Auth flows only work with the Supabase provider. For LocalStorageProvider
  // we just close — the app falls back to anonymous localStorage usage.
  if (!(storage instanceof SupabaseStorageProvider)) {
    return (
      <Overlay onClose={onClose}>
        <h2 style={h2}>Auth unavailable</h2>
        <p style={p}>
          The app is using localStorage mode. Set <code>VITE_STORAGE_PROVIDER=supabase</code> plus
          the Supabase URL and anon key to enable accounts.
        </p>
        <button style={btnPrimary} onClick={onClose}>Close</button>
      </Overlay>
    )
  }

  const supabase = storage.supabase

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setError(null); setInfo(null)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onAuthed()
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Check your inbox for a confirmation email, then sign in.')
        setMode('signin')
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/auth/reset',
        })
        if (error) throw error
        setInfo('Password reset link sent — check your email.')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Overlay onClose={onClose}>
      <h2 style={h2}>
        {mode === 'signin' && 'Sign in'}
        {mode === 'signup' && 'Create account'}
        {mode === 'reset' && 'Reset password'}
      </h2>

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={label}>
          Email
          <input
            type="email" required autoFocus
            value={email} onChange={e => setEmail(e.target.value)}
            style={input}
          />
        </label>

        {mode !== 'reset' && (
          <label style={label}>
            Password
            <input
              type="password" required minLength={8}
              value={password} onChange={e => setPassword(e.target.value)}
              style={input}
            />
          </label>
        )}

        {error && <div style={errorBox}>{error}</div>}
        {info && <div style={infoBox}>{info}</div>}

        <button type="submit" disabled={busy} style={btnPrimary}>
          {busy ? '…' : (
            mode === 'signin' ? 'Sign in' :
            mode === 'signup' ? 'Create account' :
            'Send reset link'
          )}
        </button>
      </form>

      <div style={{ marginTop: 18, display: 'flex', gap: 16, fontSize: 12, justifyContent: 'center' }}>
        {mode !== 'signin' && <button onClick={() => setMode('signin')} style={btnLink}>Sign in</button>}
        {mode !== 'signup' && <button onClick={() => setMode('signup')} style={btnLink}>Create account</button>}
        {mode !== 'reset'  && <button onClick={() => setMode('reset')}  style={btnLink}>Forgot password?</button>}
      </div>
    </Overlay>
  )
}

// ── Styles (inline to match the existing builder's style pattern) ───────────

const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }
const p: React.CSSProperties = { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }
const label: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.7)' }
const input: React.CSSProperties = { padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 14, outline: 'none' }
const btnPrimary: React.CSSProperties = { padding: '10px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 6 }
const btnLink: React.CSSProperties = { background: 'none', border: 'none', color: '#67e8f9', cursor: 'pointer', fontSize: 12, padding: 0 }
const errorBox: React.CSSProperties = { padding: '8px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: 12 }
const infoBox: React.CSSProperties = { padding: '8px 10px', borderRadius: 6, background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontSize: 12 }

// ── Overlay wrapper ──────────────────────────────────────────────────────

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      role="dialog" aria-modal="true"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 400, background: '#0b101a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        {children}
      </div>
    </div>
  )
}
