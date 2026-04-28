// ─── Integration State Store ──────────────────────────────────────────────────
// Manages OAuth tokens and sync state for all integrations via localStorage.
// In production: replace localStorage with encrypted Supabase storage.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'move_integrations'

export type IntegrationId = 'xero' | 'sage' | 'shopify' | 'woocommerce' | 'payfast' | 'yoco'

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

export interface IntegrationState {
  connected:   boolean
  connectedAt?: string
  accessToken?:  string
  refreshToken?: string
  expiresAt?:    number
  tenantId?:     string       // Xero-specific
  tenantName?:   string
  lastSyncAt?:   string
  syncStatus:    SyncStatus
  syncError?:    string
  stats?: {
    contacts?:     number
    invoices?:     number
    transactions?: number
    accounts?:     number
    bills?:        number
  }
}

type AllIntegrations = Record<IntegrationId, IntegrationState>

const DEFAULTS: AllIntegrations = {
  xero:        { connected:false, syncStatus:'idle' },
  sage:        { connected:false, syncStatus:'idle' },
  shopify:     { connected:false, syncStatus:'idle' },
  woocommerce: { connected:false, syncStatus:'idle' },
  payfast:     { connected:false, syncStatus:'idle' },
  yoco:        { connected:false, syncStatus:'idle' },
}

function load(): AllIntegrations {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
  } catch { return { ...DEFAULTS } }
}

function save(state: AllIntegrations) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function getIntegration(id: IntegrationId): IntegrationState {
  return load()[id]
}

export function getAllIntegrations(): AllIntegrations {
  return load()
}

export function setIntegration(id: IntegrationId, patch: Partial<IntegrationState>) {
  const state = load()
  state[id] = { ...state[id], ...patch }
  save(state)
}

export function disconnectIntegration(id: IntegrationId) {
  const state = load()
  state[id] = { connected:false, syncStatus:'idle' }
  save(state)
}

export function setSyncStatus(id: IntegrationId, status: SyncStatus, error?: string) {
  setIntegration(id, { syncStatus: status, syncError: error })
}

export function saveSyncResult(id: IntegrationId, stats: IntegrationState['stats']) {
  setIntegration(id, {
    syncStatus: 'success',
    lastSyncAt: new Date().toISOString(),
    stats,
  })
}
