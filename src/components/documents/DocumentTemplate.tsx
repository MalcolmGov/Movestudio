import React from 'react'
import { BrandKit } from '../../types'

export type DocType = 'invoice' | 'quote' | 'receipt' | 'credit-note'
export type DocStyle = 'modern' | 'minimal' | 'bold' | 'luxury'

export interface LineItem {
  id: string
  description: string
  qty: number
  unitPrice: number
  taxRate: number
}

export interface DocData {
  type: DocType
  style: DocStyle
  docNumber: string
  issueDate: string
  dueDate: string
  // Company
  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone: string
  companyReg: string
  companyVat: string
  // Client
  clientName: string
  clientAddress: string
  clientEmail: string
  // Items
  items: LineItem[]
  // Footer
  notes: string
  bankName: string
  accountNo: string
  branchCode: string
  paymentRef: string
  currency: string
}

// ── Helpers ──────────────────────────────────────────────────
function fmt(n: number, currency: string) {
  return `${currency} ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function calcItem(item: LineItem) {
  const subtotal = item.qty * item.unitPrice
  const tax = subtotal * (item.taxRate / 100)
  return { subtotal, tax, total: subtotal + tax }
}

function calcTotals(items: LineItem[]) {
  let subtotal = 0, tax = 0
  items.forEach(i => { const c = calcItem(i); subtotal += c.subtotal; tax += c.tax })
  return { subtotal, tax, total: subtotal + tax }
}

const DOC_LABELS: Record<DocType, string> = {
  invoice: 'INVOICE',
  quote: 'QUOTATION',
  receipt: 'RECEIPT',
  'credit-note': 'CREDIT NOTE',
}

// ── Modern style ─────────────────────────────────────────────
export function ModernDocument({ data, kit }: { data: DocData; kit: BrandKit }) {
  const totals = calcTotals(data.items)
  const font = kit.font || 'Inter'
  const label = DOC_LABELS[data.type]

  return (
    <div style={{ width: 680, background: 'white', fontFamily: `'${font}', sans-serif`, color: '#1a1a2e', boxSizing: 'border-box', overflow: 'hidden' }}>
      {/* Header band */}
      <div style={{ background: `linear-gradient(135deg, ${kit.primary}, ${kit.secondary})`, padding: '36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'white' }}>
        <div>
          {kit.logo
            ? <img src={kit.logo} alt="logo" style={{ height: 40, objectFit: 'contain', marginBottom: 12 }} />
            : <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 12 }}>{data.companyName}</div>}
          <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.7 }}>
            <div>{data.companyAddress}</div>
            <div>{data.companyPhone} · {data.companyEmail}</div>
            {data.companyReg && <div>Reg: {data.companyReg}</div>}
            {data.companyVat && <div>VAT: {data.companyVat}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', opacity: 0.95 }}>{label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, opacity: 0.8, marginTop: 4 }}>#{data.docNumber}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 8, lineHeight: 1.8 }}>
            <div>Issued: {data.issueDate}</div>
            {data.type !== 'receipt' && <div style={{ fontWeight: 700 }}>Due: {data.dueDate}</div>}
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ padding: '28px 40px 0', display: 'flex', gap: 48 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: kit.primary, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{data.clientName}</div>
          <div style={{ fontSize: 12, color: '#555', lineHeight: 1.7, marginTop: 4, whiteSpace: 'pre-line' }}>{data.clientAddress}</div>
          {data.clientEmail && <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{data.clientEmail}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>Total Amount</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: kit.primary, letterSpacing: '-0.03em', marginTop: 4 }}>{fmt(totals.total, data.currency)}</div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ margin: '24px 40px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f4f6fa' }}>
              {['Description', 'Qty', 'Unit Price', `Tax%`, 'Amount'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Description' ? 'left' : 'right', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#666', borderBottom: `2px solid ${kit.primary}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => {
              const { subtotal, total } = calcItem(item)
              return (
                <tr key={item.id} style={{ background: i % 2 === 0 ? 'white' : '#fafbff' }}>
                  <td style={{ padding: '11px 12px', borderBottom: '1px solid #eef0f5', color: '#222' }}>{item.description || 'Item description'}</td>
                  <td style={{ padding: '11px 12px', textAlign: 'right', borderBottom: '1px solid #eef0f5', color: '#444' }}>{item.qty}</td>
                  <td style={{ padding: '11px 12px', textAlign: 'right', borderBottom: '1px solid #eef0f5', color: '#444' }}>{fmt(item.unitPrice, data.currency)}</td>
                  <td style={{ padding: '11px 12px', textAlign: 'right', borderBottom: '1px solid #eef0f5', color: '#444' }}>{item.taxRate}%</td>
                  <td style={{ padding: '11px 12px', textAlign: 'right', borderBottom: '1px solid #eef0f5', fontWeight: 600, color: '#222' }}>{fmt(total, data.currency)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 40px', marginTop: 8 }}>
        <div style={{ width: 240 }}>
          {[
            ['Subtotal', fmt(totals.subtotal, data.currency)],
            ['Tax (VAT)', fmt(totals.tax, data.currency)],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eef0f5', fontSize: 12, color: '#666' }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: kit.primary, color: 'white', borderRadius: 8, marginTop: 8, fontWeight: 800, fontSize: 14 }}>
            <span>TOTAL</span><span>{fmt(totals.total, data.currency)}</span>
          </div>
        </div>
      </div>

      {/* Payment + Notes */}
      <div style={{ display: 'flex', gap: 24, padding: '24px 40px', marginTop: 8, background: '#f9fafb', borderTop: '2px solid #eef0f5' }}>
        {(data.bankName || data.accountNo) && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: kit.primary, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Payment Details</div>
            <div style={{ fontSize: 11, color: '#555', lineHeight: 1.9 }}>
              {data.bankName && <div><b>Bank:</b> {data.bankName}</div>}
              {data.accountNo && <div><b>Account:</b> {data.accountNo}</div>}
              {data.branchCode && <div><b>Branch:</b> {data.branchCode}</div>}
              {data.paymentRef && <div><b>Reference:</b> {data.paymentRef}</div>}
            </div>
          </div>
        )}
        {data.notes && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: kit.primary, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Notes & Terms</div>
            <div style={{ fontSize: 11, color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{data.notes}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 40px', background: `linear-gradient(135deg,${kit.primary},${kit.secondary})`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{data.companyName}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Thank you for your business</div>
      </div>
    </div>
  )
}

// ── Minimal style ─────────────────────────────────────────────
export function MinimalDocument({ data, kit }: { data: DocData; kit: BrandKit }) {
  const totals = calcTotals(data.items)
  const font = kit.font || 'Inter'
  const label = DOC_LABELS[data.type]

  return (
    <div style={{ width: 680, background: 'white', fontFamily: `'${font}', sans-serif`, color: '#111', boxSizing: 'border-box', padding: '48px 48px 40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          {kit.logo
            ? <img src={kit.logo} alt="logo" style={{ height: 36, objectFit: 'contain', marginBottom: 10 }} />
            : <div style={{ fontSize: 18, fontWeight: 900, color: kit.primary, marginBottom: 10 }}>{data.companyName}</div>}
          <div style={{ fontSize: 11, color: '#888', lineHeight: 1.8 }}>
            <div>{data.companyAddress}</div>
            <div>{data.companyEmail}</div>
            {data.companyVat && <div>VAT: {data.companyVat}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.04em', color: '#111' }}>{label}</div>
          <div style={{ fontSize: 13, color: '#999', marginTop: 6 }}>#{data.docNumber}</div>
          <div style={{ width: 48, height: 3, background: kit.accent, marginTop: 10, marginLeft: 'auto', borderRadius: 99 }} />
          <div style={{ fontSize: 11, color: '#999', marginTop: 10, lineHeight: 1.8 }}>
            <div>Issued {data.issueDate}</div>
            {data.type !== 'receipt' && <div style={{ color: kit.primary, fontWeight: 700 }}>Due {data.dueDate}</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid #eee` }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{data.clientName}</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 3, whiteSpace: 'pre-line' }}>{data.clientAddress}</div>
          <div style={{ fontSize: 11, color: '#999' }}>{data.clientEmail}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#bbb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Due</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: kit.primary, marginTop: 4 }}>{fmt(totals.total, data.currency)}</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
        <thead>
          <tr>
            {['Description', 'Qty', 'Price', 'Tax', 'Total'].map(h => (
              <th key={h} style={{ padding: '8px 0', textAlign: h === 'Description' ? 'left' : 'right', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#bbb', borderBottom: '1px solid #eee' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, i) => {
            const { total } = calcItem(item)
            return (
              <tr key={item.id}>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5', color: '#222' }}>{item.description || 'Item'}</td>
                <td style={{ padding: '10px 0', textAlign: 'right', borderBottom: '1px solid #f5f5f5', color: '#777' }}>{item.qty}</td>
                <td style={{ padding: '10px 0', textAlign: 'right', borderBottom: '1px solid #f5f5f5', color: '#777' }}>{fmt(item.unitPrice, data.currency)}</td>
                <td style={{ padding: '10px 0', textAlign: 'right', borderBottom: '1px solid #f5f5f5', color: '#777' }}>{item.taxRate}%</td>
                <td style={{ padding: '10px 0', textAlign: 'right', borderBottom: '1px solid #f5f5f5', fontWeight: 600 }}>{fmt(total, data.currency)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
        <div style={{ width: 220, fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: 6 }}><span>Subtotal</span><span>{fmt(totals.subtotal, data.currency)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: 10 }}><span>VAT</span><span>{fmt(totals.tax, data.currency)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 14, color: kit.primary, paddingTop: 10, borderTop: `2px solid ${kit.primary}` }}><span>Total</span><span>{fmt(totals.total, data.currency)}</span></div>
        </div>
      </div>

      {(data.bankName || data.notes) && (
        <div style={{ display: 'flex', gap: 32, paddingTop: 20, borderTop: '1px solid #eee' }}>
          {data.bankName && <div style={{ flex: 1, fontSize: 11, color: '#888', lineHeight: 1.9 }}>
            <div style={{ fontWeight: 700, color: '#555', marginBottom: 4 }}>Banking Details</div>
            {data.bankName && <div>{data.bankName}</div>}
            {data.accountNo && <div>Acc: {data.accountNo}</div>}
            {data.branchCode && <div>Branch: {data.branchCode}</div>}
            {data.paymentRef && <div>Ref: {data.paymentRef}</div>}
          </div>}
          {data.notes && <div style={{ flex: 1, fontSize: 11, color: '#888', lineHeight: 1.7 }}>
            <div style={{ fontWeight: 700, color: '#555', marginBottom: 4 }}>Notes</div>
            <div style={{ whiteSpace: 'pre-line' }}>{data.notes}</div>
          </div>}
        </div>
      )}
    </div>
  )
}

export function renderDocument(data: DocData, kit: BrandKit) {
  if (data.style === 'minimal') return <MinimalDocument data={data} kit={kit} />
  return <ModernDocument data={data} kit={kit} />
}
