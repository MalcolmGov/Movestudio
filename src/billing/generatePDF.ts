/**
 * Programmatic PDF generator for invoices & quotes.
 * Draws everything with jsPDF primitives — no html2canvas, no garbled text.
 */
import { BillingDoc, calcDocTotals, fmtMoney } from './types'
import { getCustomers } from './store'

// hex "#rrggbb" → [r,g,b]
function hexRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return [isNaN(r) ? 99 : r, isNaN(g) ? 102 : g, isNaN(b) ? 241 : b]
}

// Clamp text to max width, add ellipsis if needed
function clip(pdf: any, text: string, maxW: number): string {
  if (!text) return ''
  while (pdf.getTextWidth(text) > maxW && text.length > 1) text = text.slice(0, -1)
  return text
}

// Lighten a colour toward white by `t` (0..1)
function lighten([r, g, b]: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(r + (255 - r) * t),
    Math.round(g + (255 - g) * t),
    Math.round(b + (255 - b) * t),
  ]
}

export async function generateInvoicePDF(doc: BillingDoc): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const margin = 15
  const contentW = W - margin * 2
  const pr = hexRgb(doc.colours.primary)
  const sc = hexRgb(doc.colours.secondary)
  const ac = hexRgb(doc.colours.accent)
  const prL = lighten(pr, 0.85)
  const customers = getCustomers()
  const cust = customers.find(c => c.id === doc.customerId)
  const totals = calcDocTotals(doc.items)
  const isInv = doc.type === 'invoice'
  const label = doc.type === 'quote' ? 'QUOTATION' : doc.type === 'receipt' ? 'RECEIPT' : 'INVOICE'

  // ── HEADER BLOCK ──────────────────────────────────────────
  pdf.setFillColor(...pr)
  pdf.rect(0, 0, W, 48, 'F')

  // Decorative circle right
  pdf.setFillColor(...lighten(pr, 0.15))
  pdf.circle(195, -5, 28, 'F')
  pdf.setFillColor(...lighten(pr, 0.12))
  pdf.circle(188, 30, 14, 'F')

  // Company name
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.text(doc.companyName || 'Your Company', margin, 16)

  // Company details
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(230, 230, 255)
  let cy = 22
  if (doc.companyAddress) { pdf.text(doc.companyAddress.replace(/\n/g, ', '), margin, cy); cy += 4 }
  if (doc.companyEmail)   { pdf.text(doc.companyEmail,   margin, cy); cy += 4 }
  if (doc.companyPhone)   { pdf.text(doc.companyPhone,   margin, cy); cy += 4 }
  if (doc.companyVat)     { pdf.text(`VAT: ${doc.companyVat}`, margin, cy) }

  // Doc label + number (right)
  pdf.setTextColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(22)
  pdf.text(label, W - margin, 18, { align: 'right' })
  pdf.setFontSize(11)
  pdf.text(doc.docNumber, W - margin, 26, { align: 'right' })

  // ── META ROW ─────────────────────────────────────────────
  let y = 52
  pdf.setFillColor(...prL)
  pdf.rect(0, y - 1, W, 14, 'F')
  pdf.setDrawColor(...hexRgb(doc.colours.primary))
  pdf.setLineWidth(0.4)
  pdf.line(0, y + 13, W, y + 13)

  const metas: [string, string][] = [
    ['ISSUE DATE', doc.issueDate],
    [isInv ? 'DUE DATE' : 'VALID UNTIL', doc.dueDate],
    ...(doc.paymentRef ? [['REFERENCE', doc.paymentRef] as [string, string]] : []),
  ]
  metas.forEach(([k, v], i) => {
    const x = margin + i * 55
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7)
    pdf.setTextColor(...pr)
    pdf.text(k, x, y + 4)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(30, 30, 50)
    pdf.text(v || '—', x, y + 10)
  })

  // ── BILL TO + AMOUNT CALLOUT ─────────────────────────────
  y += 20
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7)
  pdf.setTextColor(...pr)
  pdf.text('BILL TO', margin, y)

  y += 5
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  pdf.setTextColor(20, 20, 40)
  pdf.text(cust?.company || cust?.name || '—', margin, y)
  y += 5
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(8)
  pdf.setTextColor(80, 80, 100)
  if (cust?.email)   { pdf.text(cust.email,   margin, y); y += 4 }
  if (cust?.phone)   { pdf.text(cust.phone,   margin, y); y += 4 }
  if (cust?.address) { pdf.text(cust.address.replace(/\n/g, ', '), margin, y) }

  // Amount callout box
  const boxX = W - margin - 62, boxY = y - 24, boxW = 62, boxH = 22
  pdf.setFillColor(...prL)
  pdf.roundedRect(boxX, boxY, boxW, boxH, 3, 3, 'F')
  pdf.setDrawColor(...pr)
  pdf.setLineWidth(0.3)
  pdf.roundedRect(boxX, boxY, boxW, boxH, 3, 3, 'S')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7)
  pdf.setTextColor(...pr)
  pdf.text(isInv ? 'AMOUNT DUE' : 'QUOTED TOTAL', boxX + boxW / 2, boxY + 6, { align: 'center' })
  pdf.setFontSize(13)
  pdf.setTextColor(...pr)
  pdf.text(fmtMoney(totals.total, doc.currency), boxX + boxW / 2, boxY + 14, { align: 'center' })
  if (doc.dueDate && isInv) {
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 120)
    pdf.text(`Due ${doc.dueDate}`, boxX + boxW / 2, boxY + 19, { align: 'center' })
  }

  // ── LINE ITEMS TABLE ──────────────────────────────────────
  y = Math.max(y + 10, boxY + boxH + 6)
  const cols = [
    { label: 'DESCRIPTION', x: margin,         w: 72, align: 'left'  as const },
    { label: 'QTY',         x: margin + 72,     w: 18, align: 'right' as const },
    { label: 'UNIT PRICE',  x: margin + 90,     w: 28, align: 'right' as const },
    { label: 'VAT %',       x: margin + 118,    w: 20, align: 'right' as const },
    { label: 'AMOUNT',      x: margin + 138,    w: contentW - 138, align: 'right' as const },
  ]

  // Table header
  pdf.setFillColor(...pr)
  pdf.rect(0, y, W, 10, 'F')
  cols.forEach(col => {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    pdf.setTextColor(255, 255, 255)
    const tx = col.align === 'right' ? col.x + col.w : col.x
    pdf.text(col.label, tx, y + 6.5, { align: col.align })
  })
  y += 10

  // Table rows
  doc.items.forEach((item, i) => {
    const sub   = item.qty * item.unitPrice
    const total = sub * (1 + item.taxRate / 100)
    const rowH  = 9
    if (i % 2 === 1) {
      pdf.setFillColor(...lighten(pr, 0.93))
      pdf.rect(0, y, W, rowH, 'F')
    }
    pdf.setDrawColor(220, 220, 235)
    pdf.setLineWidth(0.2)
    pdf.line(0, y + rowH, W, y + rowH)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(30, 30, 50)

    const desc = clip(pdf, item.description || '—', cols[0].w - 2)
    pdf.text(desc,                                   cols[0].x, y + 6)
    pdf.text(String(item.qty),                       cols[1].x + cols[1].w, y + 6, { align: 'right' })
    pdf.text(fmtMoney(item.unitPrice, doc.currency), cols[2].x + cols[2].w, y + 6, { align: 'right' })
    pdf.text(`${item.taxRate}%`,                     cols[3].x + cols[3].w, y + 6, { align: 'right' })
    pdf.setFont('helvetica', 'bold')
    pdf.text(fmtMoney(total, doc.currency),          cols[4].x + cols[4].w, y + 6, { align: 'right' })
    y += rowH
  })

  // ── TOTALS BLOCK ─────────────────────────────────────────
  y += 6
  const totX = W - margin - 65
  const totW = 65

  const totRows: [string, string][] = [
    ['Subtotal', fmtMoney(totals.sub,   doc.currency)],
    ['VAT',      fmtMoney(totals.tax,   doc.currency)],
  ]
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(100, 100, 120)
  totRows.forEach(([l, v]) => {
    pdf.text(l, totX, y)
    pdf.text(v, totX + totW, y, { align: 'right' })
    pdf.setDrawColor(210, 210, 225)
    pdf.setLineWidth(0.2)
    pdf.line(totX, y + 2, totX + totW, y + 2)
    y += 8
  })

  // Total gradient bar
  pdf.setFillColor(...pr)
  pdf.roundedRect(totX - 5, y, totW + 5, 10, 2, 2, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(255, 255, 255)
  pdf.text('TOTAL', totX, y + 7)
  pdf.text(fmtMoney(totals.total, doc.currency), totX + totW, y + 7, { align: 'right' })
  y += 18

  // ── PAYMENT DETAILS ───────────────────────────────────────
  if (doc.bankName || doc.accountNo) {
    pdf.setFillColor(...lighten(pr, 0.9))
    pdf.setDrawColor(...lighten(pr, 0.6))
    pdf.setLineWidth(0.3)
    pdf.roundedRect(margin, y, contentW, 22, 2, 2, 'FD')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    pdf.setTextColor(...pr)
    pdf.text('PAYMENT DETAILS', margin + 3, y + 6)

    const pFields: [string, string][] = [
      ['BANK', doc.bankName],
      ['ACCOUNT NO', doc.accountNo],
      ['BRANCH CODE', doc.branchCode],
      ['REFERENCE', doc.paymentRef],
    ].filter(([, v]) => v) as [string, string][]

    pFields.forEach(([k, v], i) => {
      const px = margin + 3 + i * 42
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7)
      pdf.setTextColor(120, 120, 140)
      pdf.text(k, px, y + 12)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(8.5)
      pdf.setTextColor(k === 'REFERENCE' ? pr[0] : 20, k === 'REFERENCE' ? pr[1] : 20, k === 'REFERENCE' ? pr[2] : 40)
      pdf.text(clip(pdf, v, 38), px, y + 18)
    })
    y += 28
  }

  // ── NOTES ─────────────────────────────────────────────────
  if (doc.notes) {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7.5)
    pdf.setTextColor(...pr)
    pdf.text('NOTES', margin, y)
    y += 5
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8.5)
    pdf.setTextColor(90, 90, 110)
    const noteLines = pdf.splitTextToSize(doc.notes, contentW)
    noteLines.slice(0, 6).forEach((line: string) => {
      pdf.text(line, margin, y)
      y += 5
    })
  }

  // ── FOOTER ────────────────────────────────────────────────
  const footY = 285
  pdf.setFillColor(...pr)
  pdf.rect(0, footY, W, 12, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.setTextColor(255, 255, 255)
  pdf.text(doc.companyName || 'Your Company', margin, footY + 7.5)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(200, 200, 230)
  pdf.text('Generated by Move Studio', W / 2, footY + 7.5, { align: 'center' })
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(255, 255, 255)
  pdf.text(doc.docNumber, W - margin, footY + 7.5, { align: 'right' })

  pdf.save(`${doc.docNumber}.pdf`)
}

/** Returns raw base64 (no data-uri prefix) for email attachments */
export async function generateInvoicePDFBase64(doc: BillingDoc): Promise<string> {
  const { jsPDF } = await import('jspdf')
  const W=210,margin=15,contentW=W-margin*2
  const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' })
  const pr=hexRgb(doc.colours.primary), prL=lighten(pr,0.85)
  const customers=getCustomers(), cust=customers.find(c=>c.id===doc.customerId)
  const totals=calcDocTotals(doc.items), isInv=doc.type==='invoice'
  const label=doc.type==='quote'?'QUOTATION':doc.type==='receipt'?'RECEIPT':'INVOICE'

  pdf.setFillColor(...pr);pdf.rect(0,0,W,48,'F')
  pdf.setFillColor(...lighten(pr,0.15));pdf.circle(195,-5,28,'F')
  pdf.setFillColor(...lighten(pr,0.12));pdf.circle(188,30,14,'F')
  pdf.setTextColor(255,255,255);pdf.setFont('helvetica','bold');pdf.setFontSize(16)
  pdf.text(doc.companyName||'Your Company',margin,16)
  pdf.setFont('helvetica','normal');pdf.setFontSize(8);pdf.setTextColor(230,230,255)
  let cy=22
  if(doc.companyAddress){pdf.text(doc.companyAddress.replace(/\n/g,', '),margin,cy);cy+=4}
  if(doc.companyEmail){pdf.text(doc.companyEmail,margin,cy);cy+=4}
  if(doc.companyPhone){pdf.text(doc.companyPhone,margin,cy);cy+=4}
  if(doc.companyVat){pdf.text('VAT: '+doc.companyVat,margin,cy)}
  pdf.setTextColor(255,255,255);pdf.setFont('helvetica','bold')
  pdf.setFontSize(22);pdf.text(label,W-margin,18,{align:'right'})
  pdf.setFontSize(11);pdf.text(doc.docNumber,W-margin,26,{align:'right'})

  let y=52;pdf.setFillColor(...prL);pdf.rect(0,y-1,W,14,'F')
  const metas:([string,string]|null)[]=[['ISSUE DATE',doc.issueDate],[isInv?'DUE DATE':'VALID UNTIL',doc.dueDate],doc.paymentRef?['REFERENCE',doc.paymentRef]:null]
  metas.filter((x):x is [string,string]=>x!==null).forEach(([k,v],i)=>{const x=margin+i*55;pdf.setFont('helvetica','bold');pdf.setFontSize(7);pdf.setTextColor(...pr);pdf.text(k,x,y+4);pdf.setFontSize(9);pdf.setTextColor(30,30,50);pdf.text(v||'—',x,y+10)})

  y+=20;pdf.setFont('helvetica','bold');pdf.setFontSize(7);pdf.setTextColor(...pr);pdf.text('BILL TO',margin,y)
  y+=5;pdf.setFont('helvetica','bold');pdf.setFontSize(11);pdf.setTextColor(20,20,40)
  pdf.text(cust?.company||cust?.name||'—',margin,y)
  y+=5;pdf.setFont('helvetica','normal');pdf.setFontSize(8);pdf.setTextColor(80,80,100)
  if(cust?.email){pdf.text(cust.email,margin,y);y+=4}
  if(cust?.phone){pdf.text(cust.phone,margin,y);y+=4}

  const bx=W-margin-62,by=y-24,bw=62,bh=22
  pdf.setFillColor(...prL);pdf.roundedRect(bx,by,bw,bh,3,3,'F')
  pdf.setDrawColor(...pr);pdf.setLineWidth(0.3);pdf.roundedRect(bx,by,bw,bh,3,3,'S')
  pdf.setFont('helvetica','bold');pdf.setFontSize(7);pdf.setTextColor(...pr)
  pdf.text(isInv?'AMOUNT DUE':'QUOTED TOTAL',bx+bw/2,by+6,{align:'center'})
  pdf.setFontSize(13);pdf.text(fmtMoney(totals.total,doc.currency),bx+bw/2,by+14,{align:'center'})
  if(doc.dueDate&&isInv){pdf.setFontSize(7);pdf.setFont('helvetica','normal');pdf.setTextColor(100,100,120);pdf.text('Due '+doc.dueDate,bx+bw/2,by+19,{align:'center'})}

  y=Math.max(y+10,by+bh+6)
  const cols=[{x:margin,w:72,a:'left' as const},{x:margin+72,w:18,a:'right' as const},{x:margin+90,w:28,a:'right' as const},{x:margin+118,w:20,a:'right' as const},{x:margin+138,w:contentW-138,a:'right' as const}]
  const hdr=['DESCRIPTION','QTY','UNIT PRICE','VAT %','AMOUNT']
  pdf.setFillColor(...pr);pdf.rect(0,y,W,10,'F')
  cols.forEach((c,i)=>{pdf.setFont('helvetica','bold');pdf.setFontSize(7.5);pdf.setTextColor(255,255,255);pdf.text(hdr[i],c.a==='right'?c.x+c.w:c.x,y+6.5,{align:c.a})})
  y+=10
  doc.items.forEach((item,i)=>{const tot=item.qty*item.unitPrice*(1+item.taxRate/100);const rH=9;if(i%2===1){pdf.setFillColor(...lighten(pr,0.93));pdf.rect(0,y,W,rH,'F')}pdf.setDrawColor(220,220,235);pdf.setLineWidth(0.2);pdf.line(0,y+rH,W,y+rH);pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.setTextColor(30,30,50);pdf.text(clip(pdf,item.description||'—',cols[0].w-2),cols[0].x,y+6);pdf.text(String(item.qty),cols[1].x+cols[1].w,y+6,{align:'right'});pdf.text(fmtMoney(item.unitPrice,doc.currency),cols[2].x+cols[2].w,y+6,{align:'right'});pdf.text(item.taxRate+'%',cols[3].x+cols[3].w,y+6,{align:'right'});pdf.setFont('helvetica','bold');pdf.text(fmtMoney(tot,doc.currency),cols[4].x+cols[4].w,y+6,{align:'right'});y+=rH})

  y+=6;const tx=W-margin-65,tw=65
  pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.setTextColor(100,100,120)
  ;[['Subtotal',fmtMoney(totals.sub,doc.currency)],['VAT',fmtMoney(totals.tax,doc.currency)]].forEach(([l,v])=>{pdf.text(l,tx,y);pdf.text(v,tx+tw,y,{align:'right'});pdf.setDrawColor(210,210,225);pdf.setLineWidth(0.2);pdf.line(tx,y+2,tx+tw,y+2);y+=8})
  pdf.setFillColor(...pr);pdf.roundedRect(tx-5,y,tw+5,10,2,2,'F');pdf.setFont('helvetica','bold');pdf.setFontSize(10);pdf.setTextColor(255,255,255);pdf.text('TOTAL',tx,y+7);pdf.text(fmtMoney(totals.total,doc.currency),tx+tw,y+7,{align:'right'});y+=18

  if(doc.bankName||doc.accountNo){pdf.setFillColor(...lighten(pr,0.9));pdf.setDrawColor(...lighten(pr,0.6));pdf.setLineWidth(0.3);pdf.roundedRect(margin,y,contentW,22,2,2,'FD');pdf.setFont('helvetica','bold');pdf.setFontSize(7.5);pdf.setTextColor(...pr);pdf.text('PAYMENT DETAILS',margin+3,y+6);([['BANK',doc.bankName],['ACCOUNT NO',doc.accountNo],['BRANCH CODE',doc.branchCode],['REFERENCE',doc.paymentRef]] as [string,string][]).filter(([,v])=>v).forEach(([k,v],i)=>{const px=margin+3+i*42;pdf.setFont('helvetica','normal');pdf.setFontSize(7);pdf.setTextColor(120,120,140);pdf.text(k,px,y+12);pdf.setFont('helvetica','bold');pdf.setFontSize(8.5);pdf.setTextColor(k==='REFERENCE'?pr[0]:20,k==='REFERENCE'?pr[1]:20,k==='REFERENCE'?pr[2]:40);pdf.text(clip(pdf,v,38),px,y+18)});y+=28}

  if(doc.notes){pdf.setFont('helvetica','bold');pdf.setFontSize(7.5);pdf.setTextColor(...pr);pdf.text('NOTES',margin,y);y+=5;pdf.setFont('helvetica','normal');pdf.setFontSize(8.5);pdf.setTextColor(90,90,110);pdf.splitTextToSize(doc.notes,contentW).slice(0,6).forEach((l:string)=>{pdf.text(l,margin,y);y+=5})}

  const fY=285;pdf.setFillColor(...pr);pdf.rect(0,fY,W,12,'F');pdf.setFont('helvetica','bold');pdf.setFontSize(8);pdf.setTextColor(255,255,255);pdf.text(doc.companyName||'Your Company',margin,fY+7.5);pdf.setFont('helvetica','normal');pdf.setTextColor(200,200,230);pdf.text('Generated by Move Studio',W/2,fY+7.5,{align:'center'});pdf.setFont('helvetica','bold');pdf.setTextColor(255,255,255);pdf.text(doc.docNumber,W-margin,fY+7.5,{align:'right'})

  return pdf.output('datauristring').split(',')[1]
}
