// ─── Sage Business Cloud Accounting API Client ────────────────────────────────
// Docs: https://developer.sage.com/accounting/reference/
//
// Setup steps:
//  1. Go to https://developerselfservice.sageone.com
//  2. Create a new app → set redirect URI:
//     http://localhost:3001/integrations/callback/sage
//  3. Copy CLIENT_ID and CLIENT_SECRET into .env.local:
//     VITE_SAGE_CLIENT_ID=your_client_id
//     VITE_SAGE_CLIENT_SECRET=your_client_secret
//
// SA Region base URL: https://accounting.sageone.co.za/api/2.0.0/
// Global base URL:    https://api.accounting.sage.com/v3.1/
// ─────────────────────────────────────────────────────────────────────────────

const CLIENT_ID     = import.meta.env.VITE_SAGE_CLIENT_ID     || ''
const CLIENT_SECRET = import.meta.env.VITE_SAGE_CLIENT_SECRET || ''
const REDIRECT_URI  = `${window.location.origin}/integrations/callback/sage`

// Sage uses SA regional endpoint
const BASE_URL = 'https://api.accounting.sage.com/v3.1'

// ── OAuth Auth URL ────────────────────────────────────────────────────────────
export function getSageAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    scope:         'openid profile email offline_access',
    state:         crypto.randomUUID(),
  })
  return `https://www.sageone.com/oauth2/auth?${params}`
}

// ── Token Exchange ────────────────────────────────────────────────────────────
export async function exchangeSageCode(code: string): Promise<SageTokens> {
  const body = new URLSearchParams({
    grant_type:    'authorization_code',
    code,
    redirect_uri:  REDIRECT_URI,
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
  })

  const res = await fetch('https://oauth.accounting.sage.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) throw new Error(`Sage token exchange failed: ${res.status}`)
  const data = await res.json()

  return {
    accessToken:  data.access_token,
    refreshToken: data.refresh_token,
    expiresAt:    Date.now() + data.expires_in * 1000,
    tokenType:    data.token_type,
  }
}

// ── Token Refresh ─────────────────────────────────────────────────────────────
export async function refreshSageToken(refreshToken: string): Promise<SageTokens> {
  const body = new URLSearchParams({
    grant_type:    'refresh_token',
    refresh_token: refreshToken,
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
  })

  const res = await fetch('https://oauth.accounting.sage.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) throw new Error(`Sage refresh failed: ${res.status}`)
  const data = await res.json()

  return {
    accessToken:  data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresAt:    Date.now() + data.expires_in * 1000,
    tokenType:    data.token_type,
  }
}

// ── API Base Request ──────────────────────────────────────────────────────────
async function sageRequest<T>(path: string, tokens: SageTokens): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      Accept:        'application/json',
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Sage API error ${res.status}: ${path}`)
  return res.json()
}

// ── Paginated Request ─────────────────────────────────────────────────────────
async function sagePaginate<T>(path: string, tokens: SageTokens): Promise<T[]> {
  let page = 1
  const all: T[] = []
  while (true) {
    const data: any = await sageRequest(`${path}?page=${page}&items_per_page=200`, tokens)
    const items: T[] = data.$items || data || []
    all.push(...items)
    if (items.length < 200) break
    page++
  }
  return all
}

// ── Sync Functions ────────────────────────────────────────────────────────────

/** Fetch all contacts */
export async function syncSageContacts(tokens: SageTokens): Promise<SageContact[]> {
  return sagePaginate<SageContact>('/contacts', tokens)
}

/** Fetch all sales invoices */
export async function syncSageInvoices(tokens: SageTokens): Promise<SageSalesInvoice[]> {
  return sagePaginate<SageSalesInvoice>('/sales_invoices', tokens)
}

/** Fetch all purchase invoices (bills) */
export async function syncSageBills(tokens: SageTokens): Promise<SagePurchaseInvoice[]> {
  return sagePaginate<SagePurchaseInvoice>('/purchase_invoices', tokens)
}

/** Fetch bank accounts */
export async function syncSageBankAccounts(tokens: SageTokens): Promise<SageBankAccount[]> {
  return sageRequest<SageBankAccount[]>('/bank_accounts', tokens)
}

/** Fetch bank transactions */
export async function syncSageBankTransactions(tokens: SageTokens): Promise<SageBankTxn[]> {
  return sagePaginate<SageBankTxn>('/bank_transactions', tokens)
}

/** Fetch ledger accounts (chart of accounts) */
export async function syncSageLedgerAccounts(tokens: SageTokens): Promise<SageLedgerAccount[]> {
  return sagePaginate<SageLedgerAccount>('/ledger_accounts', tokens)
}

/** Fetch tax rates */
export async function getSageTaxRates(tokens: SageTokens): Promise<SageTaxRate[]> {
  return sageRequest<SageTaxRate[]>('/tax_rates', tokens)
}

/** Fetch P&L summary */
export async function getSageProfitAndLoss(tokens: SageTokens, fromDate: string, toDate: string) {
  return sageRequest(`/profit_and_loss?from_date=${fromDate}&to_date=${toDate}`, tokens)
}

/** Fetch balance sheet */
export async function getSageBalanceSheet(tokens: SageTokens, date: string) {
  return sageRequest(`/balance_sheet?date=${date}`, tokens)
}

/** Get business info */
export async function getSageBusiness(tokens: SageTokens): Promise<SageBusiness> {
  return sageRequest<SageBusiness>('/business', tokens)
}

// ── Full Sync ─────────────────────────────────────────────────────────────────
export async function runFullSageSync(tokens: SageTokens): Promise<SageSyncResult> {
  const [contacts, invoices, bills, bankTxns, accounts, business] = await Promise.all([
    syncSageContacts(tokens),
    syncSageInvoices(tokens),
    syncSageBills(tokens),
    syncSageBankTransactions(tokens),
    syncSageLedgerAccounts(tokens),
    getSageBusiness(tokens),
  ])

  return {
    contacts:     contacts.length,
    invoices:     invoices.length,
    bills:        bills.length,
    transactions: bankTxns.length,
    accounts:     accounts.length,
    businessName: business?.name || 'Unknown',
    syncedAt:     new Date().toISOString(),
    raw: { contacts, invoices, bills, bankTxns, accounts, business },
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SageTokens {
  accessToken:  string
  refreshToken: string
  expiresAt:    number
  tokenType:    string
}

export interface SageContact {
  id:           string
  displayed_as: string
  email?:       string
  phone?:       string
  contact_type_ids: string[]
  is_customer:  boolean
  is_supplier:  boolean
  address?: {
    address_line_1?: string
    city?: string
    country?: { name: string }
  }
}

export interface SageSalesInvoice {
  id:           string
  displayed_as: string
  date:         string
  due_date:     string
  status:       { id: string; displayed_as: string }
  contact:      { id: string; displayed_as: string }
  total_amount: number
  outstanding_amount: number
  currency:     { id: string; displayed_as: string }
}

export interface SagePurchaseInvoice {
  id:           string
  displayed_as: string
  date:         string
  due_date:     string
  status:       { id: string; displayed_as: string }
  contact:      { id: string; displayed_as: string }
  total_amount: number
  outstanding_amount: number
}

export interface SageBankAccount {
  id:           string
  displayed_as: string
  balance:      number
  currency:     { id: string; displayed_as: string }
  bank_account_type: { id: string; displayed_as: string }
}

export interface SageBankTxn {
  id:           string
  displayed_as: string
  date:         string
  total_amount: number
  type:         { id: string; displayed_as: string }
  bank_account: { id: string; displayed_as: string }
  is_reconciled: boolean
}

export interface SageLedgerAccount {
  id:           string
  displayed_as: string
  nominal_code: string
  ledger_account_type: { id: string; displayed_as: string }
  ledger_account_classification: { id: string; displayed_as: string }
  is_active:    boolean
}

export interface SageTaxRate {
  id:           string
  displayed_as: string
  percentage:   number
  is_visible:   boolean
}

export interface SageBusiness {
  id:           string
  name:         string
  business_type_id: string
  currency:     { id: string; displayed_as: string }
  country:      { id: string; displayed_as: string }
}

export interface SageSyncResult {
  contacts:     number
  invoices:     number
  bills:        number
  transactions: number
  accounts:     number
  businessName: string
  syncedAt:     string
  raw:          Record<string, any>
}
