// ── Types ─────────────────────────────────────────────────────

export type DocType = 'invoice' | 'quote' | 'receipt' | 'credit-note'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type QuoteStatus   = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired'
export type DocTemplate   = 'modern' | 'minimal' | 'classic' | 'bold'

export interface Customer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  currency: string
  notes: string
  createdAt: string
}

export interface LineItem {
  id: string
  description: string
  qty: number
  unitPrice: number
  taxRate: number
}

export interface BillingDoc {
  id: string
  type: DocType
  status: InvoiceStatus | QuoteStatus
  docNumber: string
  customerId: string
  issueDate: string
  dueDate: string
  items: LineItem[]
  notes: string
  bankName: string
  accountNo: string
  branchCode: string
  paymentRef: string
  currency: string
  colours: { primary: string; secondary: string; accent: string }
  template?: DocTemplate        // visual template (default: 'modern')
  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone: string
  companyReg: string
  companyVat: string
  createdAt: string
  sentAt?: string
  paidAt?: string
  convertedFromQuoteId?: string  // set on invoice: which quote spawned it
  convertedToInvoiceId?: string  // set on quote: which invoice was created
  // Quote acceptance workflow
  acceptanceToken?: string       // unique URL-safe token, generated on send
  signatureData?: string         // base64 PNG of client's drawn signature
  acceptedAt?: string            // ISO timestamp of acceptance
  declinedAt?: string            // ISO timestamp of decline
  declineReason?: string         // optional reason supplied by client
}

export interface Payment {
  id: string
  invoiceId: string
  customerId: string
  amount: number
  currency: string
  date: string
  method: 'bank-transfer' | 'cash' | 'card' | 'eft' | 'other'
  reference: string
  notes: string
}

export interface Expense {
  id: string
  date: string
  vendor: string
  category: string
  amount: number
  taxRate: number
  notes: string
  createdAt: string
}

// ── Computed helpers ──────────────────────────────────────────
export function calcDocTotals(items: LineItem[]) {
  let sub = 0, tax = 0
  items.forEach(i => { const s = i.qty * i.unitPrice; sub += s; tax += s * i.taxRate / 100 })
  return { sub, tax, total: sub + tax }
}

export function fmtMoney(n: number, currency = 'R') {
  return `${currency} ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const EXPENSE_CATEGORIES = [
  'Software & Subscriptions', 'Marketing & Advertising', 'Travel & Transport',
  'Office Supplies', 'Professional Services', 'Salaries & Wages',
  'Rent & Utilities', 'Equipment', 'Food & Entertainment', 'Other',
]

export const STATUS_COLOURS: Record<string, string> = {
  draft:     '#94a3b8',
  sent:      '#38bdf8',
  paid:      '#34d399',
  overdue:   '#f87171',
  cancelled: '#6b7280',
  accepted:  '#a78bfa',
  declined:  '#f87171',
  expired:   '#fb923c',
}
