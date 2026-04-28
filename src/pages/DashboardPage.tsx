import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { loadCRM } from './crm/crm-data'
import { loadPM } from './projects/pm-data'
import { loadHR } from './hr/hr-data'
import { loadAcc, fmt as fmtAcc, getTotals } from './accounting/accounting-data'
import { getDocs, getBillingStats } from '../billing/store'
import { loadInv } from './inventory/inventory-data'

const s = (c: string) => ({ background: c + '12', border: `1px solid ${c}28`, color: c })

function KPI({ label, value, sub, color, icon, onClick }: { label: string; value: string; sub?: string; color: string; icon: string; onClick?: () => void }) {
  return (
    <motion.div whileHover={{ y: -2 }} onClick={onClick}
      style={{ padding: '18px 20px', borderRadius: 14, background: color + '0d', border: `1px solid ${color}22`, cursor: onClick ? 'pointer' : 'default', flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color, marginTop: 3, fontWeight: 600 }}>{sub}</div>}
    </motion.div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{children}</div>
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [crm]        = useState(() => loadCRM())
  const [pm]         = useState(() => loadPM())
  const [hr]         = useState(() => loadHR())
  const [acc]        = useState(() => loadAcc())
  const [billing]    = useState(() => getBillingStats())
  const [docs]       = useState(() => getDocs())

  const accTotals = getTotals(acc.transactions)
  const openDeals = crm.contacts.filter(c => !['won', 'lost'].includes(c.stage))
  const pipelineVal = openDeals.reduce((s, c) => s + c.dealValue, 0)
  const activeTasks = pm.tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled')
  const stuckTasks = pm.tasks.filter(t => t.status === 'stuck')
  const pendingLeave = hr.leaves.filter(l => l.status === 'pending')
  const overdueInvoices = docs.filter(d => d.type === 'invoice' && d.status === 'overdue')
  const draftInvoices = docs.filter(d => d.type === 'invoice' && d.status === 'draft')
  const today = new Date()
  const greet = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  const recentActivities = [
    ...crm.activities.slice(0, 3).map(a => ({ icon: a.type === 'call' ? '📞' : a.type === 'email' ? '✉️' : '📅', label: a.title, sub: crm.contacts.find(c => c.id === a.contactId)?.name || '', module: 'CRM', path: '/crm', ts: a.scheduledAt })),
    ...pm.tasks.filter(t => t.status === 'in-progress').slice(0, 2).map(t => ({ icon: '📋', label: t.title, sub: pm.projects.find(p => p.id === t.projectId)?.name || '', module: 'Projects', path: '/projects', ts: t.dueDate || Date.now() })),
    ...hr.leaves.filter(l => l.status === 'pending').slice(0, 2).map(l => ({ icon: '🏖', label: `${l.type} request`, sub: hr.employees.find(e => e.id === l.employeeId)?.name || '', module: 'HR', path: '/hr', ts: l.startDate })),
  ].slice(0, 6)

  return (
    <div style={{ padding: 'clamp(24px,4vw,40px)', maxWidth: 1200, fontFamily: 'var(--font, Inter, sans-serif)', color: 'white', display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{today.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 900, margin: 0, letterSpacing: '-0.04em' }}>{greet} 👋</h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Here's your business at a glance</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['💼 New Deal', '/crm', '#6366f1'], ['📄 New Invoice', '/billing', '#10b981'], ['📋 New Task', '/projects', '#f59e0b']].map(([l, p, c]) => (
            <motion.button key={p} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(p)}
              style={{ padding: '8px 14px', borderRadius: 9, border: `1px solid ${c}40`, background: c + '14', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{l}</motion.button>
          ))}
        </div>
      </div>

      {/* Top KPIs */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <KPI label="Pipeline Value" value={`R ${(pipelineVal / 1000).toFixed(0)}k`} sub={`${openDeals.length} open deals`} color="#6366f1" icon="💼" onClick={() => navigate('/crm')} />
        <KPI label="Net Profit (YTD)" value={`R ${(accTotals.profit / 1000).toFixed(1)}k`} sub={`${accTotals.income > 0 ? Math.round((accTotals.profit / accTotals.income) * 100) : 0}% margin`} color="#10b981" icon="📊" onClick={() => navigate('/accounting')} />
        <KPI label="Outstanding Invoices" value={`R ${(billing.outstanding / 1000).toFixed(1)}k`} sub={`${overdueInvoices.length} overdue`} color={overdueInvoices.length > 0 ? '#f87171' : '#34d399'} icon="🧾" onClick={() => navigate('/billing')} />
        <KPI label="Active Tasks" value={String(activeTasks.length)} sub={stuckTasks.length > 0 ? `${stuckTasks.length} stuck` : 'On track'} color={stuckTasks.length > 0 ? '#f59e0b' : '#60a5fa'} icon="📋" onClick={() => navigate('/projects')} />
        <KPI label="Team Headcount" value={String(hr.employees.filter(e => e.status === 'active').length)} sub={`${pendingLeave.length} leave pending`} color="#8b5cf6" icon="👥" onClick={() => navigate('/hr')} />
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* CRM Pipeline Snapshot */}
        <div style={{ padding: 22, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionTitle>CRM Pipeline</SectionTitle>
            <button onClick={() => navigate('/crm')} style={{ fontSize: 11, color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          {['lead', 'qualified', 'proposal', 'negotiation', 'won'].map(stage => {
            const contacts = crm.contacts.filter(c => c.stage === stage)
            const val = contacts.reduce((s, c) => s + c.dealValue, 0)
            const pct = pipelineVal > 0 ? (val / pipelineVal) * 100 : 0
            const colors: Record<string, string> = { lead: '#94a3b8', qualified: '#60a5fa', proposal: '#fbbf24', negotiation: '#f97316', won: '#34d399' }
            return (
              <div key={stage} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: colors[stage], fontWeight: 700, textTransform: 'capitalize' }}>{stage}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{contacts.length} · R {(val / 1000).toFixed(0)}k</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                    style={{ height: '100%', borderRadius: 99, background: colors[stage] }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div style={{ padding: 22, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <SectionTitle>Recent Activity</SectionTitle>
          {recentActivities.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '30px 0' }}>No recent activity</div>
          ) : recentActivities.map((a, i) => (
            <div key={i} onClick={() => navigate(a.path)} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < recentActivities.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{a.sub} · <span style={{ color: '#818cf8' }}>{a.module}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Tasks */}
        <div style={{ padding: 22, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionTitle>Active Tasks</SectionTitle>
            <button onClick={() => navigate('/projects')} style={{ fontSize: 11, color: '#fbbf24', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          {activeTasks.slice(0, 5).map((t, i) => {
            const proj = pm.projects.find(p => p.id === t.projectId)
            const statusColors: Record<string, string> = { 'todo': '#94a3b8', 'in-progress': '#60a5fa', 'stuck': '#f87171', 'review': '#fbbf24' }
            return (
              <div key={t.id} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i < Math.min(activeTasks.length, 5) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: proj?.color || '#818cf8', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{proj?.name}</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 700, background: (statusColors[t.status] || '#94a3b8') + '20', color: statusColors[t.status] || '#94a3b8' }}>{t.status}</span>
                {t.priority === 'critical' && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(248,113,113,0.12)', color: '#f87171', fontWeight: 700 }}>Critical</span>}
              </div>
            )
          })}
          {activeTasks.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>All tasks complete 🎉</div>}
        </div>

        {/* Billing Snapshot */}
        <div style={{ padding: 22, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <SectionTitle>Billing Suite</SectionTitle>
            <button onClick={() => navigate('/billing')} style={{ fontSize: 11, color: '#34d399', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Outstanding', value: `R ${(billing.outstanding / 1000).toFixed(1)}k`, color: '#60a5fa' },
              { label: 'Paid This Month', value: `R ${(billing.paidThisMonth / 1000).toFixed(1)}k`, color: '#34d399' },
              { label: 'Overdue', value: String(billing.overdue), color: billing.overdue > 0 ? '#f87171' : '#34d399' },
              { label: 'Customers', value: String(billing.totalCustomers), color: '#a78bfa' },
            ].map(x => (
              <div key={x.label} style={{ padding: '12px', borderRadius: 10, background: x.color + '0a', border: `1px solid ${x.color}20` }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{x.label}</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: x.color }}>{x.value}</div>
              </div>
            ))}
          </div>
          {overdueInvoices.length > 0 && (
            <div style={{ padding: '10px 14px', borderRadius: 9, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', fontSize: 12, color: '#f87171', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>⚠️</span>
              <span>{overdueInvoices.length} overdue invoice{overdueInvoices.length > 1 ? 's' : ''} — action required</span>
              <button onClick={() => navigate('/billing')} style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#f87171', background: 'none', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>Review</button>
            </div>
          )}
          {draftInvoices.length > 0 && (
            <div style={{ padding: '10px 14px', borderRadius: 9, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', fontSize: 12, color: '#fbbf24', display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
              <span>📄</span>
              <span>{draftInvoices.length} draft invoice{draftInvoices.length > 1 ? 's' : ''} not yet sent</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

        {/* HR Pending Leave */}
        <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <SectionTitle>Pending Leave</SectionTitle>
            <button onClick={() => navigate('/hr')} style={{ fontSize: 11, color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>HR →</button>
          </div>
          {pendingLeave.length === 0 ? (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '16px 0' }}>No pending leave requests</div>
          ) : pendingLeave.slice(0, 4).map(l => {
            const emp = hr.employees.find(e => e.id === l.employeeId)
            return (
              <div key={l.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#a78bfa', flexShrink: 0 }}>{emp?.name[0] || '?'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{emp?.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{l.type} · {l.days} day{l.days > 1 ? 's' : ''}</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontWeight: 700 }}>Pending</span>
              </div>
            )
          })}
        </div>

        {/* Finance Summary */}
        <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <SectionTitle>Finance This Month</SectionTitle>
            <button onClick={() => navigate('/accounting')} style={{ fontSize: 11, color: '#34d399', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View →</button>
          </div>
          {[
            { label: 'Revenue (YTD)', val: accTotals.income, color: '#34d399' },
            { label: 'Expenses (YTD)', val: accTotals.expense, color: '#f87171' },
            { label: 'Net Profit', val: accTotals.profit, color: accTotals.profit >= 0 ? '#60a5fa' : '#f87171' },
            { label: 'VAT Due', val: accTotals.vatDue, color: '#fbbf24' },
          ].map(x => (
            <div key={x.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{x.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: x.color }}>{fmtAcc(x.val)}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ padding: 20, borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <SectionTitle>Quick Actions</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: '➕ Add Contact', path: '/crm', color: '#6366f1' },
              { label: '🧾 Create Invoice', path: '/billing', color: '#10b981' },
              { label: '📋 Add Task', path: '/projects', color: '#f59e0b' },
              { label: '👤 Add Employee', path: '/hr', color: '#8b5cf6' },
              { label: '📦 Add Product', path: '/inventory', color: '#f97316' },
              { label: '📊 View P&L', path: '/accounting', color: '#34d399' },
            ].map(a => (
              <motion.button key={a.label} whileHover={{ x: 4 }} onClick={() => navigate(a.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, border: `1px solid rgba(255,255,255,0.07)`, background: 'transparent', color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                {a.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
