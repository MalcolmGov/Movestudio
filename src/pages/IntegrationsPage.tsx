import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useNavigate, useParams } from 'react-router-dom'
import { getXeroAuthUrl, exchangeXeroCode, runFullXeroSync, getXeroConnections } from '../integrations/xero'
import { getSageAuthUrl, exchangeSageCode, runFullSageSync } from '../integrations/sage'
import {
  getAllIntegrations, setIntegration, disconnectIntegration,
  setSyncStatus, saveSyncResult, IntegrationId, IntegrationState
} from '../integrations/store'

// ── Integration Catalogue ─────────────────────────────────────────────────────
const INTEGRATIONS = [
  {
    id:       'xero' as IntegrationId,
    name:     'Xero',
    category: 'Accounting',
    logo:     '🔵',
    color:    '#13B5EA',
    bg:       'rgba(19,181,234,0.08)',
    border:   'rgba(19,181,234,0.2)',
    desc:     'Sync contacts, invoices, bank transactions and financial reports from Xero.',
    docs:     'https://developer.xero.com',
    syncs:    ['Contacts', 'Invoices', 'Bank Transactions', 'Chart of Accounts', 'P&L Reports', 'Tax Rates'],
    status:   'live',
    credEnv:  ['VITE_XERO_CLIENT_ID', 'VITE_XERO_CLIENT_SECRET'],
  },
  {
    id:       'sage' as IntegrationId,
    name:     'Sage Business Cloud',
    category: 'Accounting',
    logo:     '🟢',
    color:    '#00D084',
    bg:       'rgba(0,208,132,0.07)',
    border:   'rgba(0,208,132,0.2)',
    desc:     'Import your Sage contacts, invoices, bills, bank transactions and reports.',
    docs:     'https://developer.sage.com',
    syncs:    ['Contacts', 'Sales Invoices', 'Purchase Bills', 'Bank Transactions', 'Ledger Accounts', 'P&L & Balance Sheet'],
    status:   'live',
    credEnv:  ['VITE_SAGE_CLIENT_ID', 'VITE_SAGE_CLIENT_SECRET'],
  },
  {
    id:       'shopify' as IntegrationId,
    name:     'Shopify',
    category: 'E-Commerce',
    logo:     '🛒',
    color:    '#96BF48',
    bg:       'rgba(150,191,72,0.07)',
    border:   'rgba(150,191,72,0.18)',
    desc:     'Sync orders, customers, products and inventory from your Shopify store.',
    docs:     'https://shopify.dev/api',
    syncs:    ['Orders', 'Customers', 'Products', 'Inventory', 'Refunds'],
    status:   'coming-soon',
    credEnv:  ['VITE_SHOPIFY_API_KEY'],
  },
  {
    id:       'payfast' as IntegrationId,
    name:     'PayFast',
    category: 'Payments',
    logo:     '💳',
    color:    '#FF6600',
    bg:       'rgba(255,102,0,0.07)',
    border:   'rgba(255,102,0,0.18)',
    desc:     'Reconcile PayFast payments with your invoices automatically.',
    docs:     'https://developers.payfast.co.za',
    syncs:    ['Payments', 'Refunds', 'Subscriptions'],
    status:   'coming-soon',
    credEnv:  ['VITE_PAYFAST_MERCHANT_ID', 'VITE_PAYFAST_MERCHANT_KEY'],
  },
  {
    id:       'yoco' as IntegrationId,
    name:     'Yoco',
    category: 'Payments',
    logo:     '📱',
    color:    '#4A90D9',
    bg:       'rgba(74,144,217,0.07)',
    border:   'rgba(74,144,217,0.18)',
    desc:     'Pull your Yoco card payment transactions into Move Studio.',
    docs:     'https://developer.yoco.com',
    syncs:    ['Transactions', 'Settlements', 'Refunds'],
    status:   'coming-soon',
    credEnv:  ['VITE_YOCO_API_KEY'],
  },
  {
    id:       'woocommerce' as IntegrationId,
    name:     'WooCommerce',
    category: 'E-Commerce',
    logo:     '🛍️',
    color:    '#96588A',
    bg:       'rgba(150,88,138,0.07)',
    border:   'rgba(150,88,138,0.18)',
    desc:     'Connect your WooCommerce store to sync orders and customers.',
    docs:     'https://woocommerce.github.io/woocommerce-rest-api-docs/',
    syncs:    ['Orders', 'Customers', 'Products'],
    status:   'coming-soon',
    credEnv:  ['VITE_WOO_CONSUMER_KEY', 'VITE_WOO_CONSUMER_SECRET'],
  },
]

// ── Stat Badge ────────────────────────────────────────────────────────────────
function StatBadge({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 16px', borderRadius:10, background:`${color}12`, border:`1px solid ${color}25` }}>
      <div style={{ fontSize:20, fontWeight:900, color:'white', letterSpacing:'-0.04em' }}>{n.toLocaleString()}</div>
      <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', marginTop:2, whiteSpace:'nowrap' }}>{label}</div>
    </div>
  )
}

// ── Integration Card ──────────────────────────────────────────────────────────
function IntCard({ intg, state, onConnect, onDisconnect, onSync, syncing }:
  { intg: typeof INTEGRATIONS[0]; state: IntegrationState; onConnect:()=>void; onDisconnect:()=>void; onSync:()=>void; syncing:boolean }) {

  const isLive = intg.status === 'live'
  const isConnected = state.connected
  const hasCredentials = intg.credEnv.every(k => !!import.meta.env[k])

  return (
    <motion.div layout initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} whileHover={{ y:-2 }}
      style={{ borderRadius:18, border:`1px solid ${isConnected ? intg.border : 'rgba(255,255,255,0.08)'}`, background: isConnected ? intg.bg : 'rgba(255,255,255,0.02)', overflow:'hidden', transition:'border-color 0.2s', position:'relative' }}>

      {/* Top accent bar */}
      <div style={{ height:3, background: isConnected ? `linear-gradient(90deg,${intg.color},${intg.color}80)` : 'rgba(255,255,255,0.06)' }} />

      <div style={{ padding:'22px 24px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14, gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:`${intg.color}18`, border:`1px solid ${intg.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{intg.logo}</div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:15, fontWeight:800, color:'white' }}>{intg.name}</span>
                {intg.status === 'coming-soon' && (
                  <span style={{ fontSize:9, padding:'2px 7px', borderRadius:99, background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.35)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em' }}>Soon</span>
                )}
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2, fontWeight:600 }}>{intg.category}</div>
            </div>
          </div>

          {/* Status indicator */}
          {isConnected && (
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color:intg.color }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:intg.color, boxShadow:`0 0 6px ${intg.color}` }} />
              Connected
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.65, margin:'0 0 16px' }}>{intg.desc}</p>

        {/* What syncs */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
          {intg.syncs.map(s => (
            <span key={s} style={{ fontSize:10, padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontWeight:600 }}>
              {isConnected && '✓ '}{s}
            </span>
          ))}
        </div>

        {/* Sync stats (when connected) */}
        {isConnected && state.stats && (
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {state.stats.contacts     !== undefined && <StatBadge n={state.stats.contacts}     label="Contacts"     color={intg.color}/>}
            {state.stats.invoices     !== undefined && <StatBadge n={state.stats.invoices}     label="Invoices"     color={intg.color}/>}
            {state.stats.transactions !== undefined && <StatBadge n={state.stats.transactions} label="Transactions"  color={intg.color}/>}
            {state.stats.accounts     !== undefined && <StatBadge n={state.stats.accounts}     label="Accounts"     color={intg.color}/>}
          </div>
        )}

        {/* Last sync */}
        {isConnected && state.lastSyncAt && (
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:16 }}>
            Last synced: {new Date(state.lastSyncAt).toLocaleString('en-ZA')}
          </div>
        )}

        {/* No credentials warning */}
        {isLive && !isConnected && !hasCredentials && (
          <div style={{ padding:'10px 12px', borderRadius:9, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.18)', marginBottom:14 }}>
            <div style={{ fontSize:11, color:'#fbbf24', lineHeight:1.5 }}>
              ⚠️ Add credentials to <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 5px', borderRadius:4, fontSize:10 }}>.env.local</code> to enable:
            </div>
            {intg.credEnv.map(k => (
              <div key={k} style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontFamily:'monospace', marginTop:3 }}>{k}=your_value</div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display:'flex', gap:10 }}>
          {!isLive ? (
            <div style={{ flex:1, padding:'10px', borderRadius:9, textAlign:'center', background:'rgba(255,255,255,0.03)', border:'1px dashed rgba(255,255,255,0.1)', fontSize:12, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>
              Coming soon
            </div>
          ) : !isConnected ? (
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              onClick={onConnect}
              style={{ flex:1, padding:'11px', borderRadius:9, border:'none', background:`linear-gradient(135deg,${intg.color},${intg.color}99)`, color:'white', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', boxShadow:`0 4px 16px ${intg.color}40` }}>
              Connect {intg.name} →
            </motion.button>
          ) : (
            <>
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={onSync} disabled={syncing}
                style={{ flex:1, padding:'11px', borderRadius:9, border:'none', background: syncing ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg,${intg.color},${intg.color}99)`, color:'white', fontWeight:700, fontSize:13, cursor: syncing ? 'default':'pointer', fontFamily:'inherit', boxShadow: syncing ? 'none' : `0 4px 16px ${intg.color}30` }}>
                {syncing ? '⟳ Syncing…' : '↻ Sync Now'}
              </motion.button>
              <button onClick={onDisconnect}
                style={{ padding:'11px 16px', borderRadius:9, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.03)', color:'rgba(255,255,255,0.4)', fontWeight:600, fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── OAuth Callback Handler ────────────────────────────────────────────────────
function OAuthCallback() {
  const [params] = useSearchParams()
  const { provider } = useParams<{ provider: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const code = params.get('code')
    if (!code) { setStatus('error'); setMsg('No authorization code received.'); return }

    async function exchange() {
      try {
        if (provider === 'xero') {
          const tokens = await exchangeXeroCode(code!)
          // Get tenant list
          const connections = await getXeroConnections(tokens)
          const tenant = connections[0]
          setIntegration('xero', {
            connected:    true,
            connectedAt:  new Date().toISOString(),
            accessToken:  tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt:    tokens.expiresAt,
            tenantId:     tenant?.tenantId,
            tenantName:   tenant?.tenantName,
            syncStatus:   'idle',
          })
          setStatus('success')
          setMsg(`Connected to ${tenant?.tenantName || 'Xero'} successfully!`)
        } else if (provider === 'sage') {
          const tokens = await exchangeSageCode(code!)
          setIntegration('sage', {
            connected:    true,
            connectedAt:  new Date().toISOString(),
            accessToken:  tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt:    tokens.expiresAt,
            syncStatus:   'idle',
          })
          setStatus('success')
          setMsg('Connected to Sage Business Cloud successfully!')
        }
        setTimeout(() => navigate('/integrations'), 2000)
      } catch (e: any) {
        setStatus('error')
        setMsg(e.message || 'Connection failed')
      }
    }
    exchange()
  }, [])

  const colors = { loading:'#67e8f9', success:'#4ade80', error:'#f87171' }
  const icons  = { loading:'⟳', success:'✓', error:'✗' }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#060911', fontFamily:'var(--font)' }}>
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:48, borderRadius:24, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', maxWidth:420 }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:`${colors[status]}20`, border:`2px solid ${colors[status]}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 20px', color:colors[status] }}>
          {icons[status]}
        </div>
        <h2 style={{ fontSize:20, fontWeight:800, color:'white', margin:'0 0 8px' }}>
          {status === 'loading' ? `Connecting ${provider}…` : status === 'success' ? 'Connected!' : 'Connection Failed'}
        </h2>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', margin:0 }}>{msg}</p>
        {status !== 'loading' && (
          <button onClick={() => navigate('/integrations')} style={{ marginTop:20, padding:'10px 24px', borderRadius:9, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.7)', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            ← Back to Integrations
          </button>
        )}
      </motion.div>
    </div>
  )
}

// ── Main Integrations Page ────────────────────────────────────────────────────
export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(getAllIntegrations)
  const [syncingId, setSyncingId] = useState<IntegrationId | null>(null)
  const [toast, setToast] = useState<{ msg:string; color:string } | null>(null)
  const navigate = useNavigate()

  const refresh = () => setIntegrations(getAllIntegrations())

  function showToast(msg: string, color = '#4ade80') {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3500)
  }

  function handleConnect(intg: typeof INTEGRATIONS[0]) {
    if (intg.id === 'xero') window.location.href = getXeroAuthUrl()
    else if (intg.id === 'sage') window.location.href = getSageAuthUrl()
  }

  function handleDisconnect(id: IntegrationId) {
    disconnectIntegration(id)
    refresh()
    showToast('Integration disconnected', '#f87171')
  }

  async function handleSync(intg: typeof INTEGRATIONS[0]) {
    const state = integrations[intg.id]
    if (!state.accessToken) return
    setSyncingId(intg.id)
    setSyncStatus(intg.id, 'syncing')
    try {
      const tokens = { accessToken: state.accessToken!, refreshToken: state.refreshToken!, expiresAt: state.expiresAt!, tokenType: 'Bearer' }
      let stats: any
      if (intg.id === 'xero') {
        const result = await runFullXeroSync(tokens, state.tenantId!)
        stats = { contacts: result.contacts, invoices: result.invoices, transactions: result.transactions, accounts: result.accounts }
      } else if (intg.id === 'sage') {
        const result = await runFullSageSync(tokens)
        stats = { contacts: result.contacts, invoices: result.invoices, transactions: result.transactions, accounts: result.accounts }
      }
      saveSyncResult(intg.id, stats)
      refresh()
      showToast(`${intg.name} sync complete — ${stats.contacts} contacts, ${stats.invoices} invoices`)
    } catch (e: any) {
      setSyncStatus(intg.id, 'error', e.message)
      refresh()
      showToast(`Sync failed: ${e.message}`, '#f87171')
    }
    setSyncingId(null)
  }

  const byCategory = INTEGRATIONS.reduce((acc, i) => {
    if (!acc[i.category]) acc[i.category] = []
    acc[i.category].push(i)
    return acc
  }, {} as Record<string, typeof INTEGRATIONS>)

  const connectedCount = INTEGRATIONS.filter(i => integrations[i.id]?.connected).length

  return (
    <div style={{ fontFamily:'var(--font)', color:'white', maxWidth:1100, margin:'0 auto', padding:'clamp(24px,4vw,48px) 24px' }}>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:40 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.14em' }}>
            Connected Tools
          </div>
          {connectedCount > 0 && (
            <span style={{ fontSize:10, padding:'2px 8px', borderRadius:99, background:'rgba(74,222,128,0.15)', border:'1px solid rgba(74,222,128,0.3)', color:'#4ade80', fontWeight:700 }}>
              {connectedCount} active
            </span>
          )}
        </div>
        <h1 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:900, letterSpacing:'-0.04em', margin:'0 0 8px' }}>Integrations</h1>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', margin:0, lineHeight:1.6 }}>
          Connect your existing tools to Move Studio. Your data flows in automatically — no manual imports.
        </p>
      </motion.div>

      {/* Setup guide */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
        style={{ padding:'16px 20px', borderRadius:14, background:'rgba(99,102,241,0.08)', border:'1px solid rgba(99,102,241,0.2)', marginBottom:36, display:'flex', gap:16, alignItems:'flex-start' }}>
        <div style={{ fontSize:20, flexShrink:0 }}>📋</div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:4 }}>Quick Setup Guide</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.65 }}>
            1. Sign up at <strong style={{ color:'#13B5EA' }}>developer.xero.com</strong> or <strong style={{ color:'#00D084' }}>developerselfservice.sageone.com</strong><br/>
            2. Create an app with redirect URI: <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 6px', borderRadius:4, fontSize:11 }}>{window.location.origin}/integrations/callback/xero</code><br/>
            3. Add your <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 6px', borderRadius:4, fontSize:11 }}>CLIENT_ID</code> and <code style={{ background:'rgba(255,255,255,0.08)', padding:'1px 6px', borderRadius:4, fontSize:11 }}>CLIENT_SECRET</code> to <strong>.env.local</strong><br/>
            4. Click Connect below ✓
          </div>
        </div>
      </motion.div>

      {/* Integration groups */}
      {Object.entries(byCategory).map(([cat, list], ci) => (
        <div key={cat} style={{ marginBottom:40 }}>
          <div style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em', color:'rgba(255,255,255,0.25)', marginBottom:16 }}>
            {cat}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
            {list.map((intg, i) => (
              <motion.div key={intg.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: ci*0.1 + i*0.06 }}>
                <IntCard
                  intg={intg}
                  state={integrations[intg.id]}
                  onConnect={() => handleConnect(intg)}
                  onDisconnect={() => handleDisconnect(intg.id)}
                  onSync={() => handleSync(intg)}
                  syncing={syncingId === intg.id}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
            style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', padding:'12px 24px', borderRadius:12, background:'rgba(10,10,20,0.95)', border:`1px solid ${toast.color}40`, color:toast.color, fontWeight:700, fontSize:13, boxShadow:'0 8px 32px rgba(0,0,0,0.5)', zIndex:1000, whiteSpace:'nowrap', backdropFilter:'blur(16px)' }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Callback sub-page (route: /integrations/callback/:provider) ───────────────
export { OAuthCallback }
