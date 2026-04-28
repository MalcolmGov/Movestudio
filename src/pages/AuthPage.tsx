import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Storage, AuthUser } from '../types'

// ── Input component ────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string
  onChange: (v: string) => void; placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${focused ? 'rgba(103,232,249,0.5)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--font)', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    </div>
  )
}

// ── Onboarding wizard ──────────────────────────────────────────
const INDUSTRIES = ['SaaS / Tech', 'Retail & E-commerce', 'Finance & FinTech', 'Healthcare', 'Agency / Consulting', 'Education', 'Real Estate', 'Other']
const TEAM_SIZES = ['Just me', '2–5', '6–20', '21–50', '50+']
const FIRST_MODULES = [
  { id: '/crm',         icon: '👥', label: 'CRM',              desc: 'Manage contacts & pipeline' },
  { id: '/billing',     icon: '🧾', label: 'Billing Suite',    desc: 'Invoices, quotes & payments' },
  { id: '/accounting',  icon: '📊', label: 'Accounting',       desc: 'P&L, VAT & transactions' },
  { id: '/projects',    icon: '📋', label: 'Projects',         desc: 'Tasks, board & timelines' },
  { id: '/hr',          icon: '👤', label: 'HR & Payroll',     desc: 'People, leave & payroll' },
  { id: '/inventory',   icon: '📦', label: 'Inventory',        desc: 'Stock, products & suppliers' },
]

function OnboardingStep({ step, user, onDone }: { step: number; user: AuthUser; onDone: (path: string) => void }) {
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [module, setModule] = useState('')
  const [substep, setSubstep] = useState(0)

  const steps = [
    {
      title: `Welcome, ${user.name.split(' ')[0]}! 🎉`,
      subtitle: "Let's set up your workspace in 3 quick steps",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Company Name" value={company} onChange={setCompany} placeholder="Move Digital (Pty) Ltd" />
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 8 }}>Industry</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {INDUSTRIES.map(ind => (
                <button key={ind} onClick={() => setIndustry(ind)}
                  style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${industry === ind ? 'rgba(103,232,249,0.5)' : 'rgba(255,255,255,0.08)'}`, background: industry === ind ? 'rgba(103,232,249,0.08)' : 'transparent', color: industry === ind ? '#67e8f9' : 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: industry === ind ? 700 : 400, cursor: 'pointer', textAlign: 'left' }}>{ind}</button>
              ))}
            </div>
          </div>
        </div>
      ),
      canContinue: !!company && !!industry,
    },
    {
      title: 'How big is your team?',
      subtitle: "We'll personalise your experience",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TEAM_SIZES.map(size => (
            <button key={size} onClick={() => setTeamSize(size)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, border: `1px solid ${teamSize === size ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.07)'}`, background: teamSize === size ? 'rgba(139,92,246,0.08)' : 'transparent', color: teamSize === size ? 'white' : 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: teamSize === size ? 700 : 400, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <span style={{ fontSize: 20 }}>{['👤', '👥', '🏢', '🏭', '🌐'][TEAM_SIZES.indexOf(size)]}</span>
              <span>{size}</span>
            </button>
          ))}
        </div>
      ),
      canContinue: !!teamSize,
    },
    {
      title: 'Where do you want to start?',
      subtitle: 'You can always switch modules later',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {FIRST_MODULES.map(m => (
            <button key={m.id} onClick={() => setModule(m.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, padding: '14px', borderRadius: 10, border: `1px solid ${module === m.id ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.07)'}`, background: module === m.id ? 'rgba(52,211,153,0.08)' : 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{m.label}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.desc}</span>
            </button>
          ))}
        </div>
      ),
      canContinue: !!module,
    },
  ]

  const current = steps[substep]

  return (
    <motion.div key={substep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, justifyContent: 'center' }}>
        {steps.map((_, i) => (
          <div key={i} style={{ width: i === substep ? 24 : 8, height: 8, borderRadius: 99, background: i <= substep ? '#34d399' : 'rgba(255,255,255,0.12)', transition: 'all 0.3s' }} />
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'white', marginBottom: 4 }}>{current.title}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{current.subtitle}</div>
      </div>

      {current.content}

      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        {substep > 0 && (
          <button onClick={() => setSubstep(s => s - 1)}
            style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            ← Back
          </button>
        )}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          disabled={!current.canContinue}
          onClick={() => {
            if (substep < steps.length - 1) setSubstep(s => s + 1)
            else onDone(module || '/dashboard')
          }}
          style={{ flex: substep === 0 ? 1 : 2, padding: '12px', borderRadius: 10, border: 'none', background: current.canContinue ? 'linear-gradient(135deg,#059669,#34d399)' : 'rgba(255,255,255,0.06)', color: current.canContinue ? 'white' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 14, cursor: current.canContinue ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
          {substep < steps.length - 1 ? 'Continue →' : 'Launch my workspace 🚀'}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Left trust panel ───────────────────────────────────────────
const FEATURES = [
  { icon: '👥', title: 'CRM & Pipeline',       desc: 'Track contacts, deals and activities' },
  { icon: '🧾', title: 'Billing Suite',         desc: 'Invoices, quotes, payments & reports' },
  { icon: '📊', title: 'Accounting & VAT',      desc: 'P&L, SARS-compliant VAT 201 reports' },
  { icon: '📋', title: 'Project Management',    desc: 'Kanban board, timelines & task tracking' },
  { icon: '👤', title: 'HR & Payroll',          desc: 'PAYE/UIF payroll, leave management' },
  { icon: '📦', title: 'Inventory Control',     desc: 'Stock levels, movements & suppliers' },
]

const STATS = [
  { value: '6', label: 'Business Modules' },
  { value: 'R0', label: 'Setup Cost' },
  { value: '∞', label: 'SA-Ready Features' },
]

// ── Main AuthPage ──────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [onboarding, setOnboarding] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    if (!email || !password || (mode === 'signup' && !name)) {
      setError('Please fill in all fields.')
      setLoading(false)
      return
    }
    const u: AuthUser = {
      id: crypto.randomUUID(),
      name: mode === 'signup' ? name : email.split('@')[0],
      email,
      plan: 'starter',
    }
    Storage.setUser(u)
    setLoading(false)
    if (mode === 'signup') {
      setUser(u)
      setOnboarding(true)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font)', background: '#040608', overflow: 'hidden' }}>

      {/* ── Left trust panel ── */}
      <div style={{ flex: '0 0 520px', background: 'linear-gradient(160deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 50%, transparent 100%)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '48px 44px', position: 'relative', overflow: 'hidden' }}
        className="auth-left-panel">

        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 52, position: 'relative' }}>
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <img src="/logo-3d.png" alt="Move Studio" style={{ width: 36, height: 36, objectFit: 'contain' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </motion.div>
          <span style={{ fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg,#67e8f9,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Move AI Studio</span>
          <span style={{ marginLeft: 6, padding: '2px 8px', borderRadius: 99, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)', fontSize: 10, fontWeight: 700, color: '#34d399' }}>SA-READY</span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: 36, position: 'relative' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.15, margin: '0 0 12px' }}>
            Your complete<br />
            <span style={{ background: 'linear-gradient(135deg,#67e8f9,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Business OS</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>
            One platform to run your CRM, accounting, payroll, inventory, projects, and billing — built for South African businesses.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 36, position: 'relative' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.04em' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{f.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ marginTop: 'auto', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10 }}>
            "Move Studio replaced 6 different SaaS tools for us. Everything we need in one place."
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>S</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Sipho Dlamini</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>CEO, TechCorp SA</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right auth / onboarding panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px,4vw,48px)', background: 'radial-gradient(ellipse at 60% 30%, rgba(139,92,246,0.08) 0%, transparent 60%)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420 }}>

          <AnimatePresence mode="wait">

            {/* ── Onboarding wizard ── */}
            {onboarding && user ? (
              <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '36px 32px' }}>
                <OnboardingStep step={0} user={user} onDone={path => {
                  Storage.setUser(user)
                  navigate(path)
                }} />
              </motion.div>
            ) : (

              /* ── Auth form ── */
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', margin: '0 0 6px', letterSpacing: '-0.04em' }}>
                    {mode === 'signup' ? 'Create your account' : 'Welcome back'}
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                    {mode === 'signup' ? 'Free forever — no credit card required.' : 'Sign in to your Move Studio workspace.'}
                  </p>
                </div>

                {/* Google button (UI only) */}
                <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20, fontFamily: 'var(--font)', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
                  <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>or</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <Field label="Full Name" value={name} onChange={setName} placeholder="Malcolm Govender" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.co.za" />
                  <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

                  {error && (
                    <div style={{ fontSize: 12, color: '#f87171', padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>
                  )}

                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}
                    style={{ padding: '13px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', color: 'white', fontWeight: 700, fontSize: 15, cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font)', marginTop: 4, boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>
                    {loading ? 'Please wait…' : mode === 'signup' ? 'Create Account →' : 'Sign In →'}
                  </motion.button>
                </form>

                {/* Toggle mode */}
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                    {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                  </span>
                  <button onClick={() => { setMode(m => m === 'signup' ? 'login' : 'signup'); setError('') }}
                    style={{ background: 'none', border: 'none', color: '#67e8f9', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    {mode === 'signup' ? 'Sign in' : 'Create account'}
                  </button>
                </div>

                {/* Back to library */}
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <button onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    ← Back to component library
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Responsive: hide left panel on small screens */}
      <style>{`
        @media (max-width: 768px) { .auth-left-panel { display: none !important; } }
      `}</style>
    </div>
  )
}
