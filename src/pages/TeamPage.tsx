import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Storage } from '../types'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'viewer'
  avatar: string
  joinedAt: string
  status: 'active' | 'pending'
}

const ROLE_META = {
  owner:  { label: 'Owner',  color: '#8b5cf6', desc: 'Full access — invite, edit, delete', icon: '👑' },
  editor: { label: 'Editor', color: '#3b82f6', desc: 'Edit brand kit, ads and pages',      icon: '✏️' },
  viewer: { label: 'Viewer', color: '#6b7280', desc: 'Read-only, can download exports',     icon: '👁' },
}

const SEED_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Malcolm Govender', email: 'malcolm@movedigital.co.za', role: 'owner', avatar: 'MG', joinedAt: '2026-01-10', status: 'active' },
  { id: '2', name: 'Sarah Chen',       email: 'sarah@movedigital.co.za',   role: 'editor', avatar: 'SC', joinedAt: '2026-02-14', status: 'active' },
  { id: '3', name: 'Luca Martini',     email: 'luca@partner.co.za',       role: 'viewer', avatar: 'LM', joinedAt: '2026-03-01', status: 'pending' },
]

export default function TeamPage() {
  const navigate = useNavigate()
  const [members, setMembers] = useState<TeamMember[]>(SEED_MEMBERS)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor')
  const [inviteSent, setInviteSent] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const user = Storage.getUser()
  const projects = Storage.getProjects()
  const kit = projects[0]?.kit || { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#67e8f9' }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    const initials = inviteEmail.split('@')[0].slice(0, 2).toUpperCase()
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: initials,
      joinedAt: new Date().toISOString(),
      status: 'pending',
    }
    setMembers(prev => [...prev, newMember])
    setInviteSent(true)
    setInviteEmail('')
    setTimeout(() => { setInviteSent(false); setShowInvite(false) }, 2000)
  }

  const handleRoleChange = (id: string, role: TeamMember['role']) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m))
    setEditId(null)
  }

  const handleRemove = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const isPro = user?.plan === 'pro' || user?.plan === 'agency'

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 6 }}>Team Collaboration</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Invite your team to collaborate on projects — Agency plan feature.
            {!isPro && <span style={{ marginLeft: 8, padding: '2px 8px', borderRadius: 5, background: '#8b5cf620', color: '#a78bfa', fontSize: 11, fontWeight: 700 }}>Agency Plan</span>}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => isPro ? setShowInvite(true) : navigate('/pricing')}
          style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 8px 24px ${kit.primary}40` }}>
          {isPro ? '+ Invite Member' : '⬆ Upgrade to Invite'}
        </motion.button>
      </motion.div>

      {/* Plan gate banner */}
      {!isPro && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ padding: '20px 24px', borderRadius: 14, background: 'linear-gradient(135deg,#8b5cf612,#3b82f608)', border: '1px solid #8b5cf630', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>👑 Team Collaboration is an Agency Plan feature</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
              Upgrade to invite team members, assign roles (Owner / Editor / Viewer), and collaborate on shared projects.
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/pricing')}
            style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}>
            View Plans →
          </motion.button>
        </motion.div>
      )}

      {/* Role legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {Object.entries(ROLE_META).map(([role, meta]) => (
          <div key={role} style={{ padding: '14px 16px', borderRadius: 12, background: `${meta.color}08`, border: `1px solid ${meta.color}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span>{meta.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{meta.label}</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{meta.desc}</div>
          </div>
        ))}
      </div>

      {/* Member list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {members.map((m, i) => {
          const roleMeta = ROLE_META[m.role]
          return (
            <motion.div key={m.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {/* Avatar */}
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0 }}>{m.avatar}</div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{m.name}</span>
                  {m.status === 'pending' && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#f59e0b20', color: '#f59e0b', fontWeight: 700 }}>PENDING</span>}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.email}</div>
              </div>
              {/* Role badge / selector */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setEditId(editId === m.id ? null : m.id)}
                  style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${roleMeta.color}40`, background: `${roleMeta.color}12`, color: roleMeta.color, fontSize: 11, fontWeight: 700, cursor: m.role === 'owner' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  {roleMeta.icon} {roleMeta.label} {m.role !== 'owner' && '▾'}
                </button>
                <AnimatePresence>
                  {editId === m.id && m.role !== 'owner' && (
                    <motion.div initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      style={{ position: 'absolute', top: '110%', right: 0, zIndex: 50, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden', minWidth: 150 }}>
                      {(['editor', 'viewer'] as const).map(r => (
                        <button key={r} onClick={() => handleRoleChange(m.id, r)}
                          style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', color: 'white', fontSize: 12, cursor: 'pointer', textAlign: 'left', fontWeight: m.role === r ? 700 : 400 }}>
                          {ROLE_META[r].icon} {ROLE_META[r].label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Remove */}
              {m.role !== 'owner' && (
                <button onClick={() => handleRemove(m.id)}
                  style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: '#f87171', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  ✕
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '32px', maxWidth: 420, width: '90%' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 6 }}>Invite Team Member</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>They'll receive an email invitation to join your workspace.</div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Email Address</label>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font)' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Role</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['editor', 'viewer'] as const).map(r => (
                    <button key={r} onClick={() => setInviteRole(r)}
                      style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${inviteRole === r ? ROLE_META[r].color + '60' : 'rgba(255,255,255,0.08)'}`, background: inviteRole === r ? `${ROLE_META[r].color}15` : 'transparent', color: inviteRole === r ? 'white' : 'rgba(255,255,255,0.5)', fontWeight: inviteRole === r ? 700 : 400, fontSize: 13, cursor: 'pointer' }}>
                      {ROLE_META[r].icon} {ROLE_META[r].label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowInvite(false)} style={{ flex: 1, padding: '11px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13 }}>Cancel</button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleInvite}
                  style={{ flex: 2, padding: '11px', borderRadius: 9, border: 'none', background: inviteSent ? '#10b981' : `linear-gradient(135deg,${kit.primary},${kit.secondary})`, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)', transition: 'background 0.3s' }}>
                  {inviteSent ? '✓ Invitation Sent!' : 'Send Invitation →'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
