import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Storage } from '../types'
import { generateAnalytics, AnalyticsSummary } from '../utils/analyticsEngine'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

const KIT_DEFAULTS = { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9' }

function StatCard({ label, value, sub, trend, color }: { label: string; value: string; sub?: string; trend?: number; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '20px 22px', borderRadius: 14, background: `${color}08`, border: `1px solid ${color}20` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {trend !== undefined && (
        <div style={{ fontSize: 12, color: trend >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs last month
        </div>
      )}
      {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{sub}</div>}
    </motion.div>
  )
}

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 12 },
  labelStyle: { color: 'rgba(255,255,255,0.6)' },
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [kit, setKit] = useState(KIT_DEFAULTS)
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'platforms'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const projects = Storage.getProjects()
    const project = projects[0]
    if (project?.kit) {
      setKit({ primary: project.kit.primary, secondary: project.kit.secondary, accent: project.kit.accent })
    }

    const industry = project?.kit?.industry || 'SaaS'
    const formats = ['instagram-post', 'instagram-reel', 'linkedin-post', 'facebook-ad', 'twitter-x']
    const savedAdCount = projects.reduce((acc, p) => acc + ((p as any).ads?.length || 0), 0)

    // Simulate loading
    setTimeout(() => {
      setAnalytics(generateAnalytics(Math.max(savedAdCount, 6), industry, formats))
      setLoading(false)
    }, 800)
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '80px 48px', textAlign: 'center' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${kit.primary}30`, borderTopColor: kit.primary, margin: '0 auto 20px' }} />
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Generating your analytics…</div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 6 }}>
              Analytics Dashboard
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              Simulated performance metrics for your Move AI Studio campaigns
              <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 5, background: kit.accent + '18', color: kit.accent, fontSize: 11, fontWeight: 700 }}>DEMO</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['overview', 'posts', 'platforms'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ padding: '7px 16px', borderRadius: 8, border: `1px solid ${activeTab === t ? kit.primary + '50' : 'rgba(255,255,255,0.08)'}`, background: activeTab === t ? kit.primary + '15' : 'transparent', color: activeTab === t ? 'white' : 'rgba(255,255,255,0.5)', fontWeight: activeTab === t ? 700 : 400, fontSize: 12, cursor: 'pointer', textTransform: 'capitalize' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, marginBottom: 32 }}>
        <StatCard label="Total Impressions" value={analytics.totalImpressions.toLocaleString()} trend={analytics.growth.impressions} color={kit.primary} />
        <StatCard label="Total Clicks" value={analytics.totalClicks.toLocaleString()} trend={analytics.growth.clicks} color={kit.secondary} />
        <StatCard label="Total Engagement" value={analytics.totalEngagement.toLocaleString()} trend={analytics.growth.engagement} color={kit.accent} />
        <StatCard label="Avg CTR" value={`${analytics.avgCtr}%`} sub="Industry avg: 2.1%" color={kit.primary} />
        <StatCard label="Avg Engagement Rate" value={`${analytics.avgEngagementRate}%`} sub="Industry avg: 3.5%" color={kit.secondary} />
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

          {/* Weekly Trend Chart */}
          <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 20 }}>Weekly Performance Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics.weeklyTrend}>
                <defs>
                  <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={kit.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={kit.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={kit.accent} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={kit.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="impressions" stroke={kit.primary} strokeWidth={2} fill="url(#impGrad)" name="Impressions" />
                <Area type="monotone" dataKey="engagement" stroke={kit.accent} strokeWidth={2} fill="url(#engGrad)" name="Engagement" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Platform Pie */}
            <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 20 }}>Reach by Platform</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={analytics.platforms} dataKey="impressions" nameKey="platform" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {analytics.platforms.map((p, i) => (
                      <Cell key={i} fill={p.color} />
                    ))}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {analytics.platforms.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{p.icon} {p.platform.split('-')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Post */}
            {analytics.bestPost && (
              <div style={{ padding: '24px', borderRadius: 16, background: `${kit.primary}08`, border: `1px solid ${kit.primary}25` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16 }}>🏆 Best Performing Post</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <div style={{ padding: '6px 12px', borderRadius: 6, background: kit.primary + '20', color: kit.primary, fontSize: 11, fontWeight: 700 }}>{analytics.bestPost.format} {analytics.bestPost.platform.split('-')[0]}</div>
                  <div style={{ padding: '6px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{analytics.bestPost.date}</div>
                </div>
                {[
                  { label: 'Impressions', value: analytics.bestPost.impressions.toLocaleString() },
                  { label: 'Clicks', value: analytics.bestPost.clicks.toLocaleString() },
                  { label: 'Engagement', value: analytics.bestPost.engagement.toLocaleString() },
                  { label: 'Engagement Rate', value: `${analytics.bestPost.engagementRate}%` },
                  { label: 'CTR', value: `${analytics.bestPost.ctr}%` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* POSTS TAB */}
      {activeTab === 'posts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ padding: '24px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 20 }}>Clicks by Post</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={analytics.posts.slice(0, 10)} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Bar dataKey="clicks" fill={kit.primary} radius={[4, 4, 0, 0]} name="Clicks" />
                <Bar dataKey="engagement" fill={kit.accent} radius={[4, 4, 0, 0]} name="Engagement" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {analytics.posts.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{p.format}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'white', marginBottom: 2 }}>{p.platform.replace(/-/g, ' ')}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{p.date}</div>
                </div>
                {[['Imp.', p.impressions.toLocaleString()], ['Clicks', p.clicks.toLocaleString()], ['Eng.', p.engagement.toLocaleString()], ['CTR', `${p.ctr}%`], ['ER', `${p.engagementRate}%`]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: 'right', minWidth: 56 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{v}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{l}</div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* PLATFORMS TAB */}
      {activeTab === 'platforms' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {analytics.platforms.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ padding: '20px 22px', borderRadius: 14, background: `${p.color}0A`, border: `1px solid ${p.color}25` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 24 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{p.platform.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                    <div style={{ fontSize: 11, color: p.color, fontWeight: 600 }}>CTR: {p.ctr}%</div>
                  </div>
                </div>
                {[['Impressions', p.impressions.toLocaleString()], ['Clicks', p.clicks.toLocaleString()], ['Engagement', p.engagement.toLocaleString()]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{v}</span>
                  </div>
                ))}
                {/* Mini bar */}
                <div style={{ marginTop: 14, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: p.color, width: `${Math.min(100, (p.impressions / analytics.totalImpressions) * 100 * 3)}%`, transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 5 }}>
                  {Math.round((p.impressions / analytics.totalImpressions) * 100)}% of total reach
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: 40, padding: '14px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
        ℹ️ <strong style={{ color: 'rgba(255,255,255,0.4)' }}>Demo data.</strong> These metrics are intelligently simulated based on your industry, saved ads, and real platform benchmarks. Connect your social accounts in Sprint 4 to see live analytics.
      </div>
    </div>
  )
}
