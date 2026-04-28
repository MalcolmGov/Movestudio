import React from 'react'
import { BillingDoc, calcDocTotals, fmtMoney } from './types'
import { getCustomers } from './store'

// ── Shared data hook ───────────────────────────────────────────
function useDocData(doc: BillingDoc) {
  const customers  = getCustomers()
  const cust       = customers.find(c => c.id === doc.customerId)
  const totals     = calcDocTotals(doc.items)
  const isInv      = doc.type === 'invoice'
  const label      = doc.type === 'quote' ? 'QUOTATION' : doc.type === 'receipt' ? 'RECEIPT' : 'INVOICE'
  const { primary, secondary, accent } = doc.colours
  return { cust, totals, isInv, label, primary, secondary, accent }
}

const W = { width: 794, background: '#fff', color: '#1a1a2e',
  fontFamily: "'Inter','Segoe UI',sans-serif", fontSize: 13,
  boxShadow: '0 4px 40px rgba(0,0,0,0.18)', borderRadius: 4,
  overflow: 'hidden', position: 'relative' as const, paddingBottom: 52 }

// ── Shared sub-components ─────────────────────────────────────
function ItemsTable({ doc, headerBg, headerColor, rowAlt }: {
  doc: BillingDoc; headerBg: string; headerColor: string; rowAlt: string
}) {
  const { totals, primary, secondary, accent } = useDocData(doc)
  return (
    <div style={{ padding: '0 48px 24px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: headerBg }}>
            {['Description','Qty','Unit Price','VAT %','Amount'].map((h,i) => (
              <th key={h} style={{ padding:'10px 12px', textAlign: i===0?'left':'right',
                fontSize:10, fontWeight:800, color: headerColor,
                textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {doc.items.map((item, i) => {
            const total = item.qty * item.unitPrice * (1 + item.taxRate/100)
            return (
              <tr key={item.id} style={{ background: i%2===1 ? rowAlt : '#fff',
                borderBottom:`1px solid ${primary}12` }}>
                <td style={{ padding:'11px 12px', fontSize:13, color:'#1a1a2e',
                  fontStyle: item.description?'normal':'italic' }}>
                  {item.description || <span style={{color:'#9ca3af'}}>Line item description</span>}
                </td>
                <td style={{ padding:'11px 12px', textAlign:'right', fontSize:13, color:'#374151' }}>{item.qty}</td>
                <td style={{ padding:'11px 12px', textAlign:'right', fontSize:13, color:'#374151' }}>{fmtMoney(item.unitPrice, doc.currency)}</td>
                <td style={{ padding:'11px 12px', textAlign:'right', fontSize:13, color:'#374151' }}>{item.taxRate}%</td>
                <td style={{ padding:'11px 12px', textAlign:'right', fontSize:13, fontWeight:600 }}>{fmtMoney(total, doc.currency)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
        <div style={{ width:280 }}>
          {[['Subtotal', fmtMoney(totals.sub, doc.currency)],['VAT', fmtMoney(totals.tax, doc.currency)]].map(([l,v]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0',
              borderBottom:`1px solid ${primary}12`, fontSize:13, color:'#6b7280' }}>
              <span>{l}</span><span>{v}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
            marginTop:8, background:`linear-gradient(135deg,${primary},${secondary})`,
            borderRadius:8, fontSize:15, fontWeight:900, color:'#fff' }}>
            <span>TOTAL</span><span>{fmtMoney(totals.total, doc.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentBlock({ doc }: { doc: BillingDoc }) {
  const { primary } = useDocData(doc)
  if (!doc.bankName && !doc.accountNo) return null
  return (
    <div style={{ margin:'0 48px 16px', padding:'16px 20px',
      background:`${primary}08`, border:`1px solid ${primary}20`, borderRadius:10 }}>
      <div style={{ fontSize:10, fontWeight:800, color:primary, textTransform:'uppercase',
        letterSpacing:'0.1em', marginBottom:10 }}>Payment Details</div>
      <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
        {[['Bank',doc.bankName],['Account No',doc.accountNo],['Branch Code',doc.branchCode],['Reference',doc.paymentRef]]
          .filter(([,v])=>v).map(([k,v])=>(
          <div key={k}>
            <div style={{fontSize:9,color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>{k}</div>
            <div style={{fontSize:12,fontWeight: k==='Reference'?700:600,color: k==='Reference'?primary:'#1a1a2e'}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotesBlock({ doc }: { doc: BillingDoc }) {
  const { primary } = useDocData(doc)
  if (!doc.notes) return null
  return (
    <div style={{ padding:'0 48px 20px' }}>
      <div style={{ fontSize:10, fontWeight:800, color:primary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Notes</div>
      <div style={{ fontSize:12, color:'#6b7280', lineHeight:1.7, whiteSpace:'pre-line' }}>{doc.notes}</div>
    </div>
  )
}

function Footer({ doc }: { doc: BillingDoc }) {
  const { primary, secondary } = useDocData(doc)
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0,
      background:`linear-gradient(90deg,${primary},${secondary})`,
      padding:'12px 48px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>{doc.companyName||'Your Company'}</div>
      <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)' }}>Generated by Move Studio</div>
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.9)', fontWeight:600 }}>{doc.docNumber}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 1: MODERN (gradient header — original style)
// ─────────────────────────────────────────────────────────────
function TemplateModern({ doc }: { doc: BillingDoc }) {
  const { cust, totals, isInv, label, primary, secondary, accent } = useDocData(doc)
  return (
    <div style={W}>
      <div style={{ background:`linear-gradient(135deg,${primary},${secondary})`,
        padding:'36px 48px 32px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-60, top:-60, width:220, height:220,
          borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
        <div style={{ position:'absolute', right:40, top:60, width:100, height:100,
          borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1 }}>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.03em', marginBottom:4 }}>
              {doc.companyName||'Your Company'}</div>
            {doc.companyAddress && <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', lineHeight:1.6 }}>{doc.companyAddress}</div>}
            {doc.companyEmail   && <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)' }}>{doc.companyEmail}</div>}
            {doc.companyPhone   && <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)' }}>{doc.companyPhone}</div>}
            {doc.companyVat     && <div style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginTop:4 }}>VAT: {doc.companyVat}</div>}
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:32, fontWeight:900, color:'rgba(255,255,255,0.95)', letterSpacing:'0.06em' }}>{label}</div>
            <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.85)', marginTop:4 }}>{doc.docNumber}</div>
          </div>
        </div>
      </div>

      <div style={{ background:`${primary}0d`, borderBottom:`2px solid ${primary}18`, padding:'16px 48px', display:'flex', gap:32 }}>
        {([['Issue Date',doc.issueDate],[isInv?'Due Date':'Valid Until',doc.dueDate],doc.paymentRef?['Reference',doc.paymentRef]:null] as any[])
          .filter(Boolean).map(([k,v]: [string,string]) => (
          <div key={k}>
            <div style={{ fontSize:9, fontWeight:800, color:primary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>{k}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'#1a1a2e' }}>{v||'—'}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'24px 48px 0', display:'flex', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:9, fontWeight:800, color:primary, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Bill To</div>
          <div style={{ fontWeight:700, fontSize:14, color:'#1a1a2e', marginBottom:2 }}>{cust?.company||cust?.name||'Client Name'}</div>
          {cust?.email   && <div style={{ fontSize:12, color:'#4b5563' }}>{cust.email}</div>}
          {cust?.phone   && <div style={{ fontSize:12, color:'#4b5563' }}>{cust.phone}</div>}
          {cust?.address && <div style={{ fontSize:12, color:'#6b7280', marginTop:4, lineHeight:1.5, maxWidth:240 }}>{cust.address}</div>}
        </div>
        <div style={{ background:`linear-gradient(135deg,${primary}12,${secondary}18)`,
          border:`1px solid ${primary}25`, borderRadius:12, padding:'16px 28px', textAlign:'right' }}>
          <div style={{ fontSize:10, fontWeight:700, color:primary, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
            {isInv?'Amount Due':'Quoted Total'}</div>
          <div style={{ fontSize:26, fontWeight:900, color:primary, letterSpacing:'-0.03em' }}>{fmtMoney(totals.total, doc.currency)}</div>
          {doc.dueDate && isInv && <div style={{ fontSize:10, color:'#6b7280', marginTop:4 }}>Due {doc.dueDate}</div>}
        </div>
      </div>

      <div style={{ marginTop:24 }}>
        <ItemsTable doc={doc} headerBg={`linear-gradient(90deg,${primary},${secondary})`} headerColor="#fff" rowAlt={`${primary}06`} />
      </div>
      <PaymentBlock doc={doc} />
      <NotesBlock doc={doc} />
      <Footer doc={doc} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 2: MINIMAL (white + thin accent line)
// ─────────────────────────────────────────────────────────────
function TemplateMinimal({ doc }: { doc: BillingDoc }) {
  const { cust, totals, isInv, label, primary, secondary, accent } = useDocData(doc)
  return (
    <div style={W}>
      {/* Top accent bar */}
      <div style={{ height:4, background:`linear-gradient(90deg,${primary},${secondary})` }} />

      <div style={{ padding:'40px 48px 24px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:20, fontWeight:900, color:'#111827', letterSpacing:'-0.03em', marginBottom:3 }}>
            {doc.companyName||'Your Company'}</div>
          <div style={{ fontSize:11, color:'#9ca3af', lineHeight:1.7 }}>
            {doc.companyAddress && <div>{doc.companyAddress}</div>}
            {doc.companyEmail   && <div>{doc.companyEmail}</div>}
            {doc.companyPhone   && <div>{doc.companyPhone}</div>}
            {doc.companyVat     && <div>VAT: {doc.companyVat}</div>}
          </div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:11, fontWeight:700, color:primary, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6 }}>{label}</div>
          <div style={{ fontSize:28, fontWeight:900, color:'#111827', letterSpacing:'-0.02em' }}>{doc.docNumber}</div>
        </div>
      </div>

      <div style={{ margin:'0 48px', borderTop:'1px solid #f3f4f6', borderBottom:'1px solid #f3f4f6', padding:'16px 0', display:'flex', gap:40 }}>
        {([['Issue Date',doc.issueDate],[isInv?'Due Date':'Expires',doc.dueDate],doc.paymentRef?['Ref',doc.paymentRef]:null] as any[])
          .filter(Boolean).map(([k,v]: [string,string]) => (
          <div key={k}>
            <div style={{ fontSize:9, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>{k}</div>
            <div style={{ fontSize:12, fontWeight:600, color:'#374151' }}>{v||'—'}</div>
          </div>
        ))}
      </div>

      <div style={{ padding:'20px 48px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Bill To</div>
          <div style={{ fontWeight:700, fontSize:14, color:'#111827', marginBottom:2 }}>{cust?.company||cust?.name||'Client Name'}</div>
          {cust?.email   && <div style={{ fontSize:12, color:'#6b7280' }}>{cust.email}</div>}
          {cust?.phone   && <div style={{ fontSize:12, color:'#6b7280' }}>{cust.phone}</div>}
          {cust?.address && <div style={{ fontSize:12, color:'#9ca3af', marginTop:4, lineHeight:1.5, maxWidth:200 }}>{cust.address}</div>}
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
            {isInv?'Total Due':'Quote Total'}</div>
          <div style={{ fontSize:32, fontWeight:900, color:primary }}>{fmtMoney(totals.total, doc.currency)}</div>
          {doc.dueDate && isInv && <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>Due {doc.dueDate}</div>}
        </div>
      </div>

      <div style={{ marginTop:24 }}>
        <ItemsTable doc={doc} headerBg="#f9fafb" headerColor={primary} rowAlt="#fafafa" />
      </div>
      <PaymentBlock doc={doc} />
      <NotesBlock doc={doc} />
      <Footer doc={doc} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 3: CLASSIC (letterhead style, left colour sidebar)
// ─────────────────────────────────────────────────────────────
function TemplateClassic({ doc }: { doc: BillingDoc }) {
  const { cust, totals, isInv, label, primary, secondary, accent } = useDocData(doc)
  return (
    <div style={{ ...W, display:'flex', paddingBottom:0 }}>
      {/* Left sidebar */}
      <div style={{ width:180, flexShrink:0, background:`linear-gradient(180deg,${primary},${secondary})`,
        padding:'40px 20px', display:'flex', flexDirection:'column', gap:24, minHeight:'100%' }}>
        <div>
          <div style={{ fontSize:16, fontWeight:900, color:'#fff', lineHeight:1.3, marginBottom:8 }}>
            {doc.companyName||'Your Company'}</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)', lineHeight:1.8 }}>
            {doc.companyAddress && <div>{doc.companyAddress}</div>}
            {doc.companyEmail   && <div>{doc.companyEmail}</div>}
            {doc.companyPhone   && <div>{doc.companyPhone}</div>}
            {doc.companyVat     && <div>VAT: {doc.companyVat}</div>}
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.2)', paddingTop:16 }}>
          <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>Bill To</div>
          <div style={{ fontSize:12, fontWeight:700, color:'#fff', marginBottom:4 }}>{cust?.company||cust?.name||'Client Name'}</div>
          {cust?.email   && <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)' }}>{cust.email}</div>}
          {cust?.phone   && <div style={{ fontSize:10, color:'rgba(255,255,255,0.7)' }}>{cust.phone}</div>}
          {cust?.address && <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)', marginTop:4, lineHeight:1.5 }}>{cust.address}</div>}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.2)', paddingTop:16 }}>
          {[['Date',doc.issueDate],[isInv?'Due':'Expires',doc.dueDate]].map(([k,v])=>(
            <div key={k} style={{ marginBottom:10 }}>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>{k}</div>
              <div style={{ fontSize:11, fontWeight:600, color:'#fff' }}>{v||'—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right content */}
      <div style={{ flex:1, paddingBottom:52, position:'relative' }}>
        <div style={{ padding:'40px 36px 24px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:`3px solid ${primary}18` }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:primary, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:4 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#111827' }}>{doc.docNumber}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>
              {isInv?'Amount Due':'Quote Total'}</div>
            <div style={{ fontSize:28, fontWeight:900, color:primary }}>{fmtMoney(totals.total, doc.currency)}</div>
            {doc.dueDate && isInv && <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>Due {doc.dueDate}</div>}
          </div>
        </div>
        <div style={{ padding:'0 36px' }}>
          <div style={{ marginTop:20 }}>
            <ItemsTable doc={doc} headerBg={`${primary}10`} headerColor={primary} rowAlt="#f9fafb" />
          </div>
        </div>
        {doc.bankName && <div style={{ margin:'0 36px' }}><PaymentBlock doc={doc} /></div>}
        {doc.notes    && <div style={{ padding:'0 36px' }}><NotesBlock doc={doc} /></div>}
        <Footer doc={doc} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE 4: BOLD (dark header, high contrast)
// ─────────────────────────────────────────────────────────────
function TemplateBold({ doc }: { doc: BillingDoc }) {
  const { cust, totals, isInv, label, primary, secondary, accent } = useDocData(doc)
  const dark = '#0f172a'
  return (
    <div style={W}>
      {/* Full dark header */}
      <div style={{ background: dark, padding:'40px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-40, top:-40, width:200, height:200,
          borderRadius:'50%', background:`${primary}18` }} />
        <div style={{ position:'absolute', right:60, bottom:-60, width:150, height:150,
          borderRadius:'50%', background:`${secondary}12` }} />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative', zIndex:1 }}>
          <div>
            <div style={{ fontSize:24, fontWeight:900, color:'#fff', letterSpacing:'-0.04em', marginBottom:6 }}>
              {doc.companyName||'Your Company'}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', lineHeight:1.8 }}>
              {doc.companyAddress && <div>{doc.companyAddress}</div>}
              {doc.companyEmail   && <div>{doc.companyEmail}</div>}
              {doc.companyPhone   && <div>{doc.companyPhone}</div>}
              {doc.companyVat     && <div>VAT: {doc.companyVat}</div>}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:36, fontWeight:900, letterSpacing:'-0.04em',
              background:`linear-gradient(135deg,${primary},${secondary})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{label}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.5)', marginTop:4 }}>{doc.docNumber}</div>
          </div>
        </div>
      </div>

      {/* Accent strip */}
      <div style={{ height:4, background:`linear-gradient(90deg,${primary},${secondary},${accent})` }} />

      {/* Meta + Bill To */}
      <div style={{ padding:'24px 48px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize:9, fontWeight:800, color:primary, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:8 }}>Bill To</div>
          <div style={{ fontSize:15, fontWeight:800, color:dark, marginBottom:4 }}>{cust?.company||cust?.name||'Client Name'}</div>
          {cust?.email   && <div style={{ fontSize:12, color:'#6b7280' }}>{cust.email}</div>}
          {cust?.phone   && <div style={{ fontSize:12, color:'#6b7280' }}>{cust.phone}</div>}
          {cust?.address && <div style={{ fontSize:12, color:'#9ca3af', marginTop:4, lineHeight:1.5, maxWidth:200 }}>{cust.address}</div>}
          <div style={{ display:'flex', gap:24, marginTop:16 }}>
            {([['Issue Date',doc.issueDate],[isInv?'Due Date':'Valid Until',doc.dueDate]] as [string,string][]).map(([k,v])=>(
              <div key={k}>
                <div style={{ fontSize:9, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2 }}>{k}</div>
                <div style={{ fontSize:12, fontWeight:700, color:dark }}>{v||'—'}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: dark, borderRadius:16, padding:'20px 28px', textAlign:'right' }}>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:6 }}>
            {isInv?'Amount Due':'Quote Total'}</div>
          <div style={{ fontSize:28, fontWeight:900,
            background:`linear-gradient(135deg,${primary},${secondary})`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            {fmtMoney(totals.total, doc.currency)}</div>
          {doc.dueDate && isInv && <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginTop:4 }}>Due {doc.dueDate}</div>}
        </div>
      </div>

      {/* Table header with dark bg */}
      <ItemsTable doc={doc} headerBg={dark} headerColor="#fff" rowAlt={`${primary}06`} />
      <PaymentBlock doc={doc} />
      <NotesBlock doc={doc} />
      <Footer doc={doc} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main export — routes to correct template
// ─────────────────────────────────────────────────────────────
export default function DocPreview({ doc }: { doc: BillingDoc }) {
  const t = doc.template || 'modern'
  if (t === 'minimal') return <TemplateMinimal doc={doc} />
  if (t === 'classic') return <TemplateClassic doc={doc} />
  if (t === 'bold')    return <TemplateBold    doc={doc} />
  return <TemplateModern doc={doc} />
}
