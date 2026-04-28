// ─── Xero OAuth 2.0 + API Client ─────────────────────────────────────────────
// Docs: https://developer.xero.com/documentation/guides/oauth2/overview/
//
// Setup steps:
//  1. Go to https://developer.xero.com/app/manage
//  2. Create a new app → Web app
//  3. Set redirect URI to: http://localhost:3001/integrations/callback/xero
//  4. Copy CLIENT_ID and CLIENT_SECRET into .env.local:
//     VITE_XERO_CLIENT_ID=your_client_id
//     VITE_XERO_CLIENT_SECRET=your_client_secret
// ─────────────────────────────────────────────────────────────────────────────

const CLIENT_ID     = import.meta.env.VITE_XERO_CLIENT_ID     || ''
const CLIENT_SECRET = import.meta.env.VITE_XERO_CLIENT_SECRET || ''
const REDIRECT_URI  = `${window.location.origin}/integrations/callback/xero`

const SCOPES = [
  'openid',
  'profile',
  'email',
  'offline_access',
  'accounting.transactions',
  'accounting.contacts',
  'accounting.settings',
  'accounting.reports.read',
  'payroll.employees',
  'payroll.payruns',
].join(' ')

// ── OAuth URLs ────────────────────────────────────────────────────────────────
export function getXeroAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT_URI,
    scope:         SCOPES,
    state:         crypto.randomUUID(), // CSRF protection
  })
  return `https://login.xero.com/identity/connect/authorize?${params}`
}

// ── Token Exchange (needs backend proxy in prod to hide client_secret) ────────
export async function exchangeXeroCode(code: string): Promise<XeroTokens> {
  const body = new URLSearchParams({
    grant_type:    'authorization_code',
    code,
    redirect_uri:  REDIRECT_URI,
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
  })

  const res = await fetch('https://identity.xero.com/connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) throw new Error(`Xero token exchange failed: ${res.status}`)
  const data = await res.json()

  return {
    accessToken:  data.access_token,
    refreshToken: data.refresh_token,
    expiresAt:    Date.now() + data.expires_in * 1000,
    tokenType:    data.token_type,
  }
}

// ── Token Refresh ─────────────────────────────────────────────────────────────
export async function refreshXeroToken(refreshToken: string): Promise<XeroTokens> {
  const body = new URLSearchParams({
    grant_type:    'refresh_token',
    refresh_token: refreshToken,
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET,
  })

  const res = await fetch('https://identity.xero.com/connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) throw new Error(`Xero refresh failed: ${res.status}`)
  const data = await res.json()

  return {
    accessToken:  data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresAt:    Date.now() + data.expires_in * 1000,
    tokenType:    data.token_type,
  }
}

// ── API Base Request ──────────────────────────────────────────────────────────
async function xeroRequest(path: string, tokens: XeroTokens, tenantId: string) {
  const res = await fetch(`https://api.xero.com/api.xro/2.0${path}`, {
    headers: {
      Authorization:   `Bearer ${tokens.accessToken}`,
      'Xero-tenant-id': tenantId,
      Accept:          'application/json',
    },
  })
  if (!res.ok) throw new Error(`Xero API error ${res.status}: ${path}`)
  return res.json()
}

// ── Get Connected Organisations ───────────────────────────────────────────────
export async function getXeroConnections(tokens: XeroTokens): Promise<XeroConnection[]> {
  const res = await fetch('https://api.xero.com/connections', {
    headers: { Authorization: `Bearer ${tokens.accessToken}`, Accept: 'application/json' },
  })
  return res.json()
}

// ── Sync Functions ────────────────────────────────────────────────────────────

/** Fetch all contacts (customers + suppliers) */
export async function syncXeroContacts(tokens: XeroTokens, tenantId: string): Promise<XeroContact[]> {
  const data = await xeroRequest('/Contacts?order=Name', tokens, tenantId)
  return data.Contacts || []
}

/** Fetch all invoices */
export async function syncXeroInvoices(tokens: XeroTokens, tenantId: string): Promise<XeroInvoice[]> {
  const data = await xeroRequest('/Invoices?order=Date DESC', tokens, tenantId)
  return data.Invoices || []
}

/** Fetch bank transactions */
export async function syncXeroBankTransactions(tokens: XeroTokens, tenantId: string): Promise<XeroBankTxn[]> {
  const data = await xeroRequest('/BankTransactions', tokens, tenantId)
  return data.BankTransactions || []
}

/** Fetch chart of accounts */
export async function syncXeroAccounts(tokens: XeroTokens, tenantId: string): Promise<XeroAccount[]> {
  const data = await xeroRequest('/Accounts', tokens, tenantId)
  return data.Accounts || []
}

/** Fetch P&L report */
export async function getXeroProfitAndLoss(tokens: XeroTokens, tenantId: string, fromDate: string, toDate: string) {
  const data = await xeroRequest(`/Reports/ProfitAndLoss?fromDate=${fromDate}&toDate=${toDate}`, tokens, tenantId)
  return data.Reports?.[0] || null
}

/** Fetch tax rates */
export async function getXeroTaxRates(tokens: XeroTokens, tenantId: string) {
  const data = await xeroRequest('/TaxRates', tokens, tenantId)
  return data.TaxRates || []
}

// ── Full Sync ─────────────────────────────────────────────────────────────────
export async function runFullXeroSync(tokens: XeroTokens, tenantId: string): Promise<XeroSyncResult> {
  const [contacts, invoices, bankTxns, accounts] = await Promise.all([
    syncXeroContacts(tokens, tenantId),
    syncXeroInvoices(tokens, tenantId),
    syncXeroBankTransactions(tokens, tenantId),
    syncXeroAccounts(tokens, tenantId),
  ])

  return {
    contacts:     contacts.length,
    invoices:     invoices.length,
    transactions: bankTxns.length,
    accounts:     accounts.length,
    syncedAt:     new Date().toISOString(),
    raw: { contacts, invoices, bankTxns, accounts },
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface XeroTokens {
  accessToken:  string
  refreshToken: string
  expiresAt:    number
  tokenType:    string
}

export interface XeroConnection {
  id:             string
  tenantId:       string
  tenantType:     string
  tenantName:     string
  createdDateUtc: string
}

export interface XeroContact {
  ContactID:   string
  Name:        string
  EmailAddress?: string
  Phones?:     Array<{ PhoneNumber: string; PhoneType: string }>
  IsCustomer:  boolean
  IsSupplier:  boolean
  ContactStatus: string
}

export interface XeroInvoice {
  InvoiceID:   string
  InvoiceNumber: string
  Type:        'ACCREC' | 'ACCPAY'  // AR = Sales, AP = Purchase
  Status:      'DRAFT' | 'SUBMITTED' | 'AUTHORISED' | 'PAID' | 'VOIDED'
  Contact:     { ContactID: string; Name: string }
  Date:        string
  DueDate:     string
  Total:       number
  AmountDue:   number
  AmountPaid:  number
  CurrencyCode: string
}

export interface XeroBankTxn {
  BankTransactionID: string
  Type:              'SPEND' | 'RECEIVE'
  Contact?:          { ContactID: string; Name: string }
  Total:             number
  Date:              string
  IsReconciled:      boolean
  BankAccount:       { AccountID: string; Name: string }
}

export interface XeroAccount {
  AccountID:  string
  Code:       string
  Name:       string
  Type:       string
  TaxType:    string
  Status:     'ACTIVE' | 'ARCHIVED'
  Class:      'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE'
}

export interface XeroSyncResult {
  contacts:     number
  invoices:     number
  transactions: number
  accounts:     number
  syncedAt:     string
  raw:          Record<string, any>
}
