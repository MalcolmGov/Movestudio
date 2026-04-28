import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { TENANTS, getTenant, Tenant, TenantModule } from '../whitelabel/tenants'
import { loadCRM } from './crm/crm-data'
import { loadPM } from './projects/pm-data'
import { loadHR } from './hr/hr-data'
import { loadAcc, getTotals } from './accounting/accounting-data'
import { getBillingStats, getDocs } from '../billing/store'
import '../whitelabel/WhiteLabel.css'

// ── Tenant Picker ──────────────────────────────────────────────
function TenantPicker() {
  const navigate = useNavigate()
  return (
    <div className="wl-picker">
      <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center' }}>
        <div className="wl-picker-eyebrow">White-Label Demo</div>
        <h1 className="wl-picker-h1">Pick your pitch 🎯</h1>
        <p className="wl-picker-sub">Each client gets a fully branded Business OS. One platform config, infinite brand possibilities.</p>
      </motion.div>

      <div className="wl-picker-grid">
        {TENANTS.map((t, i) => (
          <motion.div key={t.slug} className="wl-picker-card"
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}
            whileHover={{ y:-5 }}
            onClick={() => navigate(`/white-label/${t.slug}`)}
            style={{ '--hover-border': t.theme.primary + '40' } as any}
            onMouseEnter={e => (e.currentTarget.style.borderColor = t.theme.primary + '40')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
            <div className="wl-picker-card-bar" style={{ background:`linear-gradient(90deg,${t.theme.primary},${t.theme.accent})` }} />
            <div className="wl-picker-card-head">
              <div className="wl-picker-badge" style={{ background:`linear-gradient(135deg,${t.theme.primary},${t.theme.accent})` }}>{t.logoInitials}</div>
              <div>
                <div className="wl-picker-name">{t.platformName}</div>
                <div className="wl-picker-tag" style={{ color: t.theme.accent }}>{t.tagline}</div>
              </div>
            </div>
            <p className="wl-picker-pitch">{t.pitchLine}</p>
            {t.demoNote && <div className="wl-picker-note">💡 {t.demoNote}</div>}
            <div className="wl-picker-cta" style={{ color: t.theme.accent }}>
              Open demo <span>→</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="wl-picker-tip">
        ✦ To add a new client, edit <code>src/whitelabel/tenants.ts</code> — one config object is all it takes
      </div>
    </div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────
function KPI({ label, value, sub, color, icon }: { label:string; value:string; sub?:string; color:string; icon:string }) {
  return (
    <motion.div className="wl-kpi" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
      <div className="wl-kpi-accent" style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
      <div className="wl-kpi-glow" style={{ background: color }} />
      <span className="wl-kpi-icon">{icon}</span>
      <div className="wl-kpi-val">{value}</div>
      <div className="wl-kpi-label">{label}</div>
      {sub && <div className="wl-kpi-sub" style={{ color }}>{sub}</div>}
    </motion.div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────
const CREATIVE_IDS = new Set(['website','ads','analytics','brand','email'])

function Sidebar({ tenant, active, onSelect, collapsed, onCollapse }:
  { tenant:Tenant; active:TenantModule; onSelect:(m:TenantModule)=>void; collapsed:boolean; onCollapse:()=>void }) {
  const navigate = useNavigate()
  const { theme } = tenant
  let lastWasCreative = false

  return (
    <motion.div className="wl-sidebar" animate={{ width: collapsed ? 62 : 234 }}
      style={{ '--wl-primary': theme.primary, '--wl-sidebar-bg': theme.sidebarBg, '--wl-nav-active-bg': theme.sidebarActive } as any}>

      {/* Logo */}
      <div className="wl-logo-area">
        <div className="wl-logo-badge" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.accent})` }}>
          {tenant.logoInitials}
        </div>
        {!collapsed && (
          <motion.div className="wl-logo-text" initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div className="wl-logo-name">{tenant.platformName}</div>
            <div className="wl-logo-tag" style={{ color: theme.accent }}>{tenant.tagline}</div>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <div className="wl-nav">
        {tenant.modules.map((mod, i) => {
          const isCreative = CREATIVE_IDS.has(mod.id)
          const showDivider = isCreative && !lastWasCreative
          if (isCreative) lastWasCreative = true
          const isActive = active.id === mod.id
          return (
            <div key={mod.id}>
              {showDivider && !collapsed && (
                <motion.div className="wl-section-label" initial={{ opacity:0 }} animate={{ opacity:1 }}>
                  Digital Tools
                </motion.div>
              )}
              {i === 0 && !collapsed && (
                <div className="wl-section-label">Business OS</div>
              )}
              <div className={`wl-nav-item${isActive ? ' active' : ''}`}
                onClick={() => mod.id === 'dashboard' ? onSelect(mod) : navigate(mod.path)}>
                <span className="wl-nav-icon">{mod.icon}</span>
                {!collapsed && (
                  <div className="wl-nav-label-wrap">
                    <div className="wl-nav-label">
                      {mod.label}
                      {mod.id !== 'dashboard' && <span className="wl-nav-arrow">↗</span>}
                    </div>
                    <div className="wl-nav-desc">{mod.desc}</div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="wl-sidebar-footer">
        <button className="wl-collapse-btn" onClick={onCollapse}>
          {collapsed ? '→' : '← Collapse'}
        </button>
        {tenant.poweredBy && !collapsed && (
          <div className="wl-powered">
            Powered by <span style={{ color: theme.accent }}>Move Studio</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Dashboard Content ─────────────────────────────────────────
function Dashboard({ tenant }: { tenant:Tenant }) {
  const { theme } = tenant
  const crm = loadCRM()
  const pm = loadPM()
  const hr = loadHR()
  const acc = loadAcc()
  const billing = getBillingStats()
  const docs = getDocs()
  const totals = getTotals(acc.transactions)
  const openDeals = crm.contacts.filter(c => !['won','lost'].includes(c.stage))
  const pipelineVal = openDeals.reduce((s,c)=>s+c.dealValue,0)
  const activeTasks = pm.tasks.filter(t=>t.status!=='done')
  const overdue = docs.filter(d=>d.type==='invoice'&&d.status==='overdue')
  const today = new Date()

  const stageColors: Record<string,string> = { lead:'#94a3b8', qualified:'#60a5fa', proposal:'#fbbf24', negotiation:'#f97316', won: theme.primary }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Header */}
      <div className="wl-dash-header">
        <div className="wl-dash-date">{today.toLocaleDateString('en-ZA',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
        <h1 className="wl-dash-greeting">Good morning 👋</h1>
        <p className="wl-dash-sub">Welcome to your {tenant.bankName} Business Suite — here's your business at a glance.</p>
      </div>

      {/* KPIs */}
      <div className="wl-kpi-grid">
        <KPI label="Pipeline Value" value={`R ${(pipelineVal/1000).toFixed(0)}k`} sub={`${openDeals.length} open deals`} color={theme.primary} icon="💼"/>
        <KPI label="Net Profit (YTD)" value={`R ${(totals.profit/1000).toFixed(1)}k`} sub={`${totals.income>0?Math.round((totals.profit/totals.income)*100):0}% margin`} color={theme.accent} icon="📊"/>
        <KPI label="Outstanding" value={`R ${(billing.outstanding/1000).toFixed(1)}k`} sub={overdue.length>0?`${overdue.length} overdue`:'All current'} color={overdue.length>0?'#f87171':theme.primary} icon="🧾"/>
        <KPI label="Active Tasks" value={String(activeTasks.length)} sub="In progress" color={theme.accent} icon="📋"/>
        <KPI label="Team" value={String(hr.employees.filter(e=>e.status==='active').length)} sub="Active employees" color={theme.primary} icon="👥"/>
      </div>

      {/* Two col */}
      <div className="wl-two-col">
        {/* Pipeline */}
        <div className="wl-card">
          <div className="wl-card-title">CRM Pipeline</div>
          {['lead','qualified','proposal','negotiation','won'].map(stage => {
            const list = crm.contacts.filter(c=>c.stage===stage)
            const val = list.reduce((s,c)=>s+c.dealValue,0)
            const pct = pipelineVal>0?(val/pipelineVal)*100:0
            return (
              <div key={stage} className="wl-pipe-row">
                <div className="wl-pipe-meta">
                  <span className="wl-pipe-name" style={{ color:stageColors[stage] }}>{stage}</span>
                  <span className="wl-pipe-num">{list.length} · R {(val/1000).toFixed(0)}k</span>
                </div>
                <div className="wl-pipe-track">
                  <motion.div className="wl-pipe-fill" initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.9 }} style={{ background:stageColors[stage] }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Finance */}
        <div className="wl-card">
          <div className="wl-card-title">Finance Overview</div>
          {[
            { l:'Revenue (YTD)',        v:`R ${(totals.income/1000).toFixed(1)}k`,      c: theme.accent || theme.primary },
            { l:'Expenses (YTD)',       v:`R ${(totals.expense/1000).toFixed(1)}k`,     c:'#f87171' },
            { l:'Net Profit',           v:`R ${(totals.profit/1000).toFixed(1)}k`,      c: theme.accent },
            { l:'VAT Due',              v:`R ${(totals.vatDue/1000).toFixed(1)}k`,      c:'#fbbf24' },
            { l:'Outstanding Invoices', v:`R ${(billing.outstanding/1000).toFixed(1)}k`, c:'rgba(255,255,255,0.55)' },
            { l:'Paid This Month',      v:`R ${(billing.paidThisMonth/1000).toFixed(1)}k`, c: theme.accent || theme.primary },
          ].map(x => (
            <div key={x.l} className="wl-fin-row">
              <span className="wl-fin-label">{x.l}</span>
              <span className="wl-fin-val" style={{ color:x.c }}>{x.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="wl-card">
        <div className="wl-card-title">Active Tasks</div>
        <div className="wl-task-grid">
          {activeTasks.slice(0,6).map(t => {
            const proj = pm.projects.find(p=>p.id===t.projectId)
            const sc: Record<string,string> = { 'todo':'#94a3b8','in-progress':theme.accent,'stuck':'#f87171','review':'#fbbf24','not-started':'#64748b' }
            return (
              <div key={t.id} className="wl-task">
                <div className="wl-task-dot" style={{ background:proj?.color||theme.primary }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="wl-task-title">{t.title}</div>
                  <div className="wl-task-proj">{proj?.name}</div>
                </div>
                <span className="wl-task-badge" style={{ background:(sc[t.status]||'#94a3b8')+'20', color:sc[t.status]||'#94a3b8' }}>{t.status}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Module Launch Screen ──────────────────────────────────────
function ModuleLaunch({ mod, tenant, onBack }: { mod:TenantModule; tenant:Tenant; onBack:()=>void }) {
  const navigate = useNavigate()
  const { theme } = tenant
  return (
    <motion.div className="wl-launch" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
      <div className="wl-launch-icon"
        style={{ background:`linear-gradient(135deg,${theme.primary}20,${theme.accent}15)`, border:`1px solid ${theme.primary}30`, '--wl-accent-gradient':`linear-gradient(135deg,${theme.primary},${theme.accent})` } as any}>
        {mod.icon}
      </div>
      <h2 className="wl-launch-title">{mod.label}</h2>
      <p className="wl-launch-desc">{mod.desc} — fully functional and ready to demo.</p>
      <div className="wl-launch-btns">
        <motion.button className="wl-btn-primary" whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
          style={{ background:`linear-gradient(135deg,${theme.primary},${theme.accent})` }}
          onClick={() => navigate(mod.path)}>
          Open {mod.label} →
        </motion.button>
        <button className="wl-btn-secondary" onClick={onBack}>← Dashboard</button>
      </div>
      <div className="wl-launch-badge">✦ Live module — fully functional</div>
    </motion.div>
  )
}

// ── Platform Shell ────────────────────────────────────────────
function Platform({ tenant }: { tenant:Tenant }) {
  const navigate = useNavigate()
  const [active, setActive] = useState<TenantModule>(tenant.modules[0])
  const [collapsed, setCollapsed] = useState(false)
  const { theme } = tenant

  return (
    <div className="wl-root" style={{ '--wl-page-bg': theme.pageBg } as any}>
      <Sidebar tenant={tenant} active={active} onSelect={setActive} collapsed={collapsed} onCollapse={() => setCollapsed(c=>!c)} />

      <div className="wl-main">
        {/* Topbar */}
        <div className="wl-topbar" style={{ borderBottomColor: theme.primary + '18' }}>
          <div className="wl-breadcrumb">
            <span>{tenant.bankName}</span>
            <span style={{ opacity:0.3 }}>/</span>
            <span className="wl-breadcrumb-current">{active.icon} {active.label}</span>
          </div>
          <div className="wl-spacer" />
          <button className="wl-topbar-back" onClick={() => navigate('/white-label')}>← All Demos</button>
          <div className="wl-avatar" style={{ background:`linear-gradient(135deg,${theme.primary},${theme.accent})` }}>J</div>
        </div>

        {/* Content */}
        <div className="wl-content">
          <AnimatePresence mode="wait">
            <motion.div key={active.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.18 }}>
              {active.id === 'dashboard'
                ? <Dashboard tenant={tenant} />
                : <ModuleLaunch mod={active} tenant={tenant} onBack={() => setActive(tenant.modules[0])} />
              }
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ── Route Entry ───────────────────────────────────────────────
export default function WhiteLabelPage() {
  const { slug } = useParams<{ slug?:string }>()
  if (!slug) return <TenantPicker />
  const tenant = getTenant(slug)
  if (!tenant) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#060911', flexDirection:'column', gap:16, fontFamily:'var(--font)' }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <div style={{ fontSize:20, fontWeight:700, color:'white' }}>Tenant "{slug}" not found</div>
      <a href="/white-label" style={{ color:'#67e8f9', fontSize:14 }}>← View all demos</a>
    </div>
  )
  return <Platform tenant={tenant} />
}
