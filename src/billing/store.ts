import { Customer, BillingDoc, Payment, Expense } from './types'

const K = {
  customers: 'ms_billing_customers_v2',
  docs:      'ms_billing_docs_v2',
  payments:  'ms_billing_payments_v2',
  expenses:  'ms_billing_expenses_v2',
  seeded:    'ms_billing_seeded_v2',
}

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

// ── Seed Data ─────────────────────────────────────────────────
const now = new Date()
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString().split('T')[0]
const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000).toISOString().split('T')[0]

const SEED_KIT = { primary: '#6366f1', secondary: '#8b5cf6', accent: '#67e8f9' }
const COMP = { companyName: 'Move Digital (Pty) Ltd', companyAddress: '14 Innovation Park, Sandton, Johannesburg 2196', companyEmail: 'hello@movedigital.africa', companyPhone: '+27 11 234 5678', companyReg: '2024/012345/07', companyVat: '4800123456' }
const BANK = { bankName: 'Standard Bank', accountNo: '012 345 678', branchCode: '051001', paymentRef: 'MOVEDIGITAL' }

const SEED_CUSTOMERS: Customer[] = [
  { id:'c1', name:'Sipho Dlamini',    company:'TechCorp SA',         email:'sipho@techcorp.co.za',    phone:'+27 82 345 6789', address:'33 Tech Park, Rosebank, JHB 2196',         currency:'R', notes:'Key enterprise account — full platform build', createdAt: daysAgo(120) },
  { id:'c2', name:'Nomsa Sithole',    company:'FreshMart Group',     email:'nomsa@freshmart.co.za',   phone:'+27 71 456 7890', address:'12 Commercial St, Midrand, JHB 1685',      currency:'R', notes:'Monthly retainer — branding & digital', createdAt: daysAgo(90) },
  { id:'c3', name:'James Botha',      company:'RetailPlus Africa',   email:'james@retailplus.co.za',  phone:'+27 83 567 8901', address:'8 Nelson Rd, Cape Town, WC 8001',          currency:'R', notes:'Brand identity project', createdAt: daysAgo(75) },
  { id:'c4', name:'Ayanda Khumalo',   company:'HealthFirst Clinics', email:'ayanda@healthfirst.co.za',phone:'+27 74 678 9012', address:'22 Medical Blvd, Pretoria, GP 0181',       currency:'R', notes:'Website & booking system', createdAt: daysAgo(60) },
  { id:'c5', name:'Marcus Du Plessis','company':'Solar SA Energy',    email:'marcus@solarsa.co.za',   phone:'+27 79 789 0123', address:'5 Green Energy Way, Stellenbosch, WC 7600',currency:'R', notes:'Social media & marketing retainer', createdAt: daysAgo(45) },
]

const SEED_DOCS: BillingDoc[] = [
  // ── Invoices ──
  { id:'inv1', type:'invoice', status:'paid',    docNumber:'INV-0001', customerId:'c1', issueDate:daysAgo(85), dueDate:daysAgo(55), items:[{id:'li1',description:'Full-stack web platform (Phase 1)',qty:1,unitPrice:85000,taxRate:15},{id:'li2',description:'Project management & coordination',qty:1,unitPrice:8500,taxRate:15}], notes:'Thank you for choosing Move Digital.', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'modern', createdAt:daysAgo(86), sentAt:daysAgo(85), paidAt:daysAgo(50), paymentRef:'TECHCORP-001' },
  { id:'inv2', type:'invoice', status:'paid',    docNumber:'INV-0002', customerId:'c2', issueDate:daysAgo(60), dueDate:daysAgo(30), items:[{id:'li3',description:'Brand identity package — Full',qty:1,unitPrice:38000,taxRate:15},{id:'li4',description:'Style guide & brand manual',qty:1,unitPrice:6500,taxRate:15}], notes:'Payment due within 30 days.', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'minimal', createdAt:daysAgo(61), sentAt:daysAgo(60), paidAt:daysAgo(25), paymentRef:'FRESHMART-002' },
  { id:'inv3', type:'invoice', status:'sent',    docNumber:'INV-0003', customerId:'c3', issueDate:daysAgo(28), dueDate:daysFromNow(2), items:[{id:'li5',description:'E-commerce website design',qty:1,unitPrice:55000,taxRate:15},{id:'li6',description:'Payment gateway integration',qty:1,unitPrice:12000,taxRate:15}], notes:'EFT to the account details above.', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'modern', createdAt:daysAgo(29), sentAt:daysAgo(28), paymentRef:'RETAILPLUS-003' },
  { id:'inv4', type:'invoice', status:'overdue', docNumber:'INV-0004', customerId:'c4', issueDate:daysAgo(45), dueDate:daysAgo(15), items:[{id:'li7',description:'Mobile app UI design (iOS + Android)',qty:1,unitPrice:42000,taxRate:15},{id:'li8',description:'Prototype & user testing',qty:1,unitPrice:9000,taxRate:15}], notes:'Please settle to avoid service interruption.', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'classic', createdAt:daysAgo(46), sentAt:daysAgo(45), paymentRef:'HEALTHFIRST-004' },
  { id:'inv5', type:'invoice', status:'draft',   docNumber:'INV-0005', customerId:'c5', issueDate:daysAgo(3),  dueDate:daysFromNow(27), items:[{id:'li9',description:'Social media management — Q2 2026',qty:3,unitPrice:6500,taxRate:15},{id:'li10',description:'Content creation & scheduling',qty:1,unitPrice:4200,taxRate:15}], notes:'', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'modern', createdAt:daysAgo(3), paymentRef:'SOLARSA-005' },
  { id:'inv6', type:'invoice', status:'paid',    docNumber:'INV-0006', customerId:'c1', issueDate:daysAgo(15), dueDate:daysFromNow(15), items:[{id:'li11',description:'Full-stack web platform (Phase 2)',qty:1,unitPrice:95000,taxRate:15}], notes:'Phase 2 milestone payment.', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'modern', createdAt:daysAgo(16), sentAt:daysAgo(15), paidAt:daysAgo(8), paymentRef:'TECHCORP-006' },
  // ── Quotes ──
  { id:'qt1', type:'quote', status:'accepted', docNumber:'QUO-0001', customerId:'c2', issueDate:daysAgo(65), dueDate:daysAgo(35), items:[{id:'ql1',description:'Social media strategy & management',qty:6,unitPrice:6500,taxRate:15}], notes:'Valid for 30 days.', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'modern', createdAt:daysAgo(66), sentAt:daysAgo(65), convertedToInvoiceId:'inv2', paymentRef:'FRESHMART-QUO001' },
  { id:'qt2', type:'quote', status:'sent',     docNumber:'QUO-0002', customerId:'c5', issueDate:daysAgo(8),  dueDate:daysFromNow(22), items:[{id:'ql2',description:'Solar SA corporate website redesign',qty:1,unitPrice:68000,taxRate:15},{id:'ql3',description:'SEO setup & analytics',qty:1,unitPrice:8500,taxRate:15}], notes:'Includes 3 revision rounds.', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'bold', createdAt:daysAgo(9), sentAt:daysAgo(8), paymentRef:'SOLARSA-QUO002' },
  { id:'qt3', type:'quote', status:'draft',    docNumber:'QUO-0003', customerId:'c3', issueDate:daysAgo(2),  dueDate:daysFromNow(28), items:[{id:'ql4',description:'Loyalty app development (MVP)',qty:1,unitPrice:120000,taxRate:15}], notes:'', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'modern', createdAt:daysAgo(2), paymentRef:'RETAILPLUS-QUO003' },
  { id:'qt4', type:'quote', status:'declined', docNumber:'QUO-0004', customerId:'c4', issueDate:daysAgo(50), dueDate:daysAgo(20), items:[{id:'ql5',description:'Patient portal web app',qty:1,unitPrice:95000,taxRate:15}], notes:'Annual support included.', ...BANK, currency:'R', colours:SEED_KIT, ...COMP, template:'modern', createdAt:daysAgo(51), sentAt:daysAgo(50), declinedAt:daysAgo(38), declineReason:'Budget constraints this quarter', paymentRef:'HEALTHFIRST-QUO004' },
]

const SEED_PAYMENTS: Payment[] = [
  { id:'pay1', invoiceId:'inv1', customerId:'c1', amount:107537.50, currency:'R', date:daysAgo(50), method:'eft', reference:'TECHCORP-001', notes:'EFT received in full' },
  { id:'pay2', invoiceId:'inv2', customerId:'c2', amount:51175.00,  currency:'R', date:daysAgo(25), method:'bank-transfer', reference:'FRESHMART-002', notes:'Direct transfer' },
  { id:'pay3', invoiceId:'inv6', customerId:'c1', amount:109250.00, currency:'R', date:daysAgo(8),  method:'eft', reference:'TECHCORP-006', notes:'Phase 2 payment received' },
]

const SEED_EXPENSES: Expense[] = [
  { id:'exp1', date:daysAgo(5),  vendor:'Google Workspace', category:'Software & Subscriptions', amount:1850,   taxRate:15, notes:'Annual subscription', createdAt:daysAgo(5) },
  { id:'exp2', date:daysAgo(12), vendor:'Uber Business',    category:'Travel & Transport',       amount:3240,   taxRate:15, notes:'Client site visits', createdAt:daysAgo(12) },
  { id:'exp3', date:daysAgo(18), vendor:'Adobe Creative',   category:'Software & Subscriptions', amount:1199,   taxRate:15, notes:'Creative Cloud team', createdAt:daysAgo(18) },
  { id:'exp4', date:daysAgo(28), vendor:'Office Rent',      category:'Rent & Utilities',         amount:18500,  taxRate:0,  notes:'Innovation Park office April', createdAt:daysAgo(28) },
]

// ── Seed initialiser ──────────────────────────────────────────
function initSeed() {
  if (localStorage.getItem(K.seeded)) return
  save(K.customers, SEED_CUSTOMERS)
  save(K.docs,      SEED_DOCS)
  save(K.payments,  SEED_PAYMENTS)
  save(K.expenses,  SEED_EXPENSES)
  localStorage.setItem(K.seeded, '1')
}
initSeed()

// ── Customers ─────────────────────────────────────────────────
export function getCustomers(): Customer[] { return load(K.customers) }
export function saveCustomer(c: Customer) {
  const list = getCustomers().filter(x => x.id !== c.id)
  save(K.customers, [c, ...list])
}
export function deleteCustomer(id: string) {
  save(K.customers, getCustomers().filter(c => c.id !== id))
}

// ── Billing Docs ──────────────────────────────────────────────
export function getDocs(): BillingDoc[] { return load(K.docs) }
export function getDocsByCustomer(cid: string): BillingDoc[] { return getDocs().filter(d => d.customerId === cid) }
export function saveDoc(d: BillingDoc) {
  const list = getDocs().filter(x => x.id !== d.id)
  save(K.docs, [d, ...list])
}
export function deleteDoc(id: string) { save(K.docs, getDocs().filter(d => d.id !== id)) }
export function updateDocStatus(id: string, status: string, extra?: Partial<BillingDoc>) {
  save(K.docs, getDocs().map(d => d.id === id ? { ...d, status, ...extra } as BillingDoc : d))
}

// ── Token / Acceptance helpers ────────────────────────────────
export function newToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(36).padStart(2,'0')).join('').slice(0,32)
}
export function getDocByToken(token: string): BillingDoc | undefined {
  return getDocs().find(d => d.acceptanceToken === token)
}
export function acceptQuote(token: string, signatureData: string): BillingDoc | null {
  const docs = getDocs()
  const doc  = docs.find(d => d.acceptanceToken === token)
  if (!doc || doc.type !== 'quote') return null
  const updated = { ...doc, status: 'accepted', signatureData, acceptedAt: new Date().toISOString() } as BillingDoc
  save(K.docs, docs.map(d => d.id === doc.id ? updated : d))
  return updated
}
export function declineQuote(token: string, reason: string): BillingDoc | null {
  const docs = getDocs()
  const doc  = docs.find(d => d.acceptanceToken === token)
  if (!doc || doc.type !== 'quote') return null
  const updated = { ...doc, status: 'declined', declinedAt: new Date().toISOString(), declineReason: reason } as BillingDoc
  save(K.docs, docs.map(d => d.id === doc.id ? updated : d))
  return updated
}

/** Deep-copies a quote into a new draft invoice, links both, marks quote accepted.
 *  Returns the new invoice so the caller can open it in the editor. */
export function convertQuoteToInvoice(quoteId: string): BillingDoc {
  const docs = getDocs()
  const quote = docs.find(d => d.id === quoteId)
  if (!quote) throw new Error('Quote not found')

  const existing = docs.filter(d => d.type === 'invoice').length
  const invoice: BillingDoc = {
    ...quote,
    id:        newId(),
    type:      'invoice',
    status:    'draft',
    docNumber: `INV-${String(existing + 1).padStart(4, '0')}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate:   new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    convertedFromQuoteId: quoteId,
    convertedToInvoiceId: undefined,
    sentAt: undefined,
    paidAt: undefined,
  }

  // Link the quote to this invoice and mark accepted
  const updated = docs.map(d =>
    d.id === quoteId ? { ...d, status: 'accepted', convertedToInvoiceId: invoice.id } as BillingDoc : d
  )
  save(K.docs, [invoice, ...updated])
  return invoice
}

// ── Payments ──────────────────────────────────────────────────
export function getPayments(): Payment[] { return load(K.payments) }
export function savePayment(p: Payment) {
  const list = getPayments().filter(x => x.id !== p.id)
  save(K.payments, [p, ...list])
}
export function deletePayment(id: string) { save(K.payments, getPayments().filter(p => p.id !== id)) }

// ── Expenses ──────────────────────────────────────────────────
export function getExpenses(): Expense[] { return load(K.expenses) }
export function saveExpense(e: Expense) {
  const list = getExpenses().filter(x => x.id !== e.id)
  save(K.expenses, [e, ...list])
}
export function deleteExpense(id: string) { save(K.expenses, getExpenses().filter(e => e.id !== id)) }

// ── Stats ─────────────────────────────────────────────────────
export function getBillingStats() {
  const docs = getDocs()
  const payments = getPayments()
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const invoices = docs.filter(d => d.type === 'invoice')
  const outstanding = invoices.filter(d => d.status === 'sent').reduce((s, d) => {
    const t = d.items.reduce((a, i) => a + i.qty * i.unitPrice * (1 + i.taxRate / 100), 0)
    return s + t
  }, 0)
  const overdue = invoices.filter(d => d.status === 'overdue').length
  const paidThisMonth = payments.filter(p => p.date >= monthStart).reduce((s, p) => s + p.amount, 0)

  return { outstanding, overdue, paidThisMonth, totalCustomers: load<Customer>(K.customers).length }
}

// ── ID generator ──────────────────────────────────────────────
export function newId() { return Math.random().toString(36).slice(2) + Date.now().toString(36) }
