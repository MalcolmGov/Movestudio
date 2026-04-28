import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// ── In-memory quote store (survives page refreshes, resets on server restart) ──
// Maps acceptanceToken → full BillingDoc JSON
const quoteStore = new Map<string, Record<string, any>>()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),

      // ── Inline billing API middleware ──────────────────────────
      {
        name: 'billing-api',
        configureServer(server) {
          server.middlewares.use('/api/billing', async (req: any, res: any, next: any) => {
            const url: string = req.url || ''
            const method: string = req.method || 'GET'

            // ── GET /api/billing/quote/<token> ───────────────────
            if (method === 'GET' && url.startsWith('/quote/')) {
              const token = url.replace('/quote/', '').split('?')[0]
              const doc = quoteStore.get(token)
              if (!doc) {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: 'Quote not found' }))
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ doc }))
              }
              return
            }

            // Only handle POST from here on
            if (method !== 'POST') return next()

            // Parse JSON body
            const body: string = await new Promise(resolve => {
              let data = ''
              req.on('data', (c: Buffer) => { data += c })
              req.on('end', () => resolve(data))
            })

            let payload: Record<string, any> = {}
            try { payload = JSON.parse(body) } catch { /* empty body */ }

            // ── POST /api/billing/store-quote ────────────────────
            // Called when a quote is sent — stores it for client lookup
            if (url === '/store-quote') {
              const { token, doc } = payload
              if (token && doc) {
                quoteStore.set(token, doc)
                console.log(`📋 Stored quote ${doc.docNumber} → token ${token}`)
              }
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: true }))
              return
            }

            const RESEND_KEY = env.RESEND_API_KEY
            if (!RESEND_KEY) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'RESEND_API_KEY not configured in .env.local' }))
              return
            }

            const { Resend } = require(
              path.resolve(__dirname, '../node_modules/resend/dist/index.js')
            )
            const resend = new Resend(RESEND_KEY)

            // ── /api/billing/send-document ───────────────────────
            if (url === '/send-document') {
              try {
                const {
                  pdfBase64, docType, docNumber, toEmail, toName,
                  fromCompany, fromEmail, amount, dueDate,
                  primaryColour, secondaryColour, accentColour,
                  notes, acceptanceUrl,
                } = payload

                if (!toEmail || !pdfBase64) {
                  res.writeHead(400, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: 'toEmail and pdfBase64 are required' }))
                  return
                }

                const primary   = primaryColour   || '#6366f1'
                const secondary = secondaryColour || '#0ea5e9'
                const accent    = accentColour    || '#f59e0b'
                const docLabel  = ({ invoice:'Invoice', quote:'Quotation', receipt:'Receipt', 'credit-note':'Credit Note' } as any)[docType] ?? 'Document'

                const greeting = docType === 'invoice'
                  ? `Please find your invoice attached. Payment of <strong>${amount}</strong> is due by <strong>${dueDate || '—'}</strong>.`
                  : docType === 'quote'
                  ? `Please find your quotation attached. This quote is valid for 30 days.`
                  : `Please find your document attached.`

                const acceptBtn = (docType === 'quote' && acceptanceUrl) ? `
                  <tr><td style="padding:0 40px 28px;">
                    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="border-radius:10px;background:linear-gradient(135deg,${primary},${secondary});">
                          <a href="${acceptanceUrl}" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:white;text-decoration:none;">✅ Review &amp; Accept Quote</a>
                        </td>
                      </tr>
                    </table>
                    <p style="text-align:center;margin:10px 0 0;font-size:11px;color:#94a3b8;">Or: <a href="${acceptanceUrl}" style="color:${primary};word-break:break-all;">${acceptanceUrl}</a></p>
                  </td></tr>` : ''

                const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,${primary},${secondary});padding:36px 40px;">
            <div style="font-size:28px;font-weight:900;color:white;letter-spacing:-0.04em;">${fromCompany}</div>
            <div style="font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px;">${docLabel.toUpperCase()} &nbsp;·&nbsp; ${docNumber}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 16px;font-size:16px;color:#1e293b;">Hi <strong>${toName || 'there'}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">${greeting}</p>
            ${(docType === 'invoice' || docType === 'quote') ? `
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Total Amount${docType === 'invoice' ? ' Due' : ''}</div>
                  <div style="font-size:28px;font-weight:900;color:${primary};">${amount}</div>
                  ${dueDate && docType === 'invoice' ? `<div style="font-size:12px;color:#94a3b8;margin-top:4px;">Due by ${dueDate}</div>` : ''}
                </td>
              </tr>
            </table>` : ''}
            <p style="margin:0 0 8px;font-size:14px;color:#64748b;line-height:1.6;">The ${docLabel.toLowerCase()} is attached to this email as a PDF document.</p>
            ${notes ? `<p style="margin:20px 0 0;font-size:13px;color:#94a3b8;font-style:italic;line-height:1.6;white-space:pre-line;">${notes}</p>` : ''}
          </td>
        </tr>
        ${acceptBtn}
        <tr><td style="padding:0 40px;"><div style="height:1px;background:#f1f5f9;"></div></td></tr>
        <tr>
          <td style="padding:24px 40px;background:#f8fafc;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:12px;color:#94a3b8;">
                  <strong style="color:#475569;">${fromCompany}</strong><br/>
                  ${fromEmail ? `<a href="mailto:${fromEmail}" style="color:${primary};text-decoration:none;">${fromEmail}</a>` : ''}
                </td>
                <td align="right" style="font-size:11px;color:#cbd5e1;">
                  Sent via Move Studio<br/><span style="color:${accent};">●</span> Brand-kit applied
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:linear-gradient(135deg,${primary},${secondary});padding:10px 40px;text-align:center;">
            <div style="font-size:11px;color:rgba(255,255,255,0.6);">This document was generated and sent from Move Studio</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

                const pdfBuffer = Buffer.from(pdfBase64, 'base64')
                const { data, error } = await resend.emails.send({
                  from:     'Move Studio <onboarding@resend.dev>',
                  to:       [toEmail],
                  reply_to: 'malcolm@swifter.digital',
                  subject:  `${docLabel} ${docNumber} from ${fromCompany}`,
                  html,
                  attachments: [{ filename: `${docType}-${docNumber}.pdf`, content: pdfBuffer }],
                })

                if (error) {
                  console.error('❌ Resend error:', error)
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ error: error.message }))
                  return
                }

                console.log(`✅ ${docLabel} sent to ${toEmail} — ID: ${data?.id}`)
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, id: data?.id }))

              } catch (err: any) {
                console.error('❌ send-document error:', err?.message)
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ error: err?.message ?? 'Unknown error' }))
              }
              return
            }

            // ── /api/billing/quote-response ──────────────────────
            if (url === '/quote-response') {
              try {
                const { token, docNumber, fromCompany, fromEmail, accepted, declineReason, signatureData, amount } = payload

                // Update in-memory store so repeat visits show "already processed"
                if (token && quoteStore.has(token)) {
                  const stored = quoteStore.get(token)!
                  quoteStore.set(token, {
                    ...stored,
                    status:        accepted ? 'accepted' : 'declined',
                    signatureData: signatureData || stored.signatureData,
                    acceptedAt:    accepted ? new Date().toISOString() : stored.acceptedAt,
                    declinedAt:    !accepted ? new Date().toISOString() : stored.declinedAt,
                    declineReason: declineReason || stored.declineReason,
                  })
                  console.log(`📬 Quote ${docNumber} ${accepted ? 'accepted ✅' : 'declined ❌'}`)
                }

                const subject = accepted
                  ? `✅ Quote ${docNumber} Accepted by Client`
                  : `❌ Quote ${docNumber} Declined by Client`

                const sigBlock = (accepted && signatureData)
                  ? `<div style="margin:20px 0;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
                       <div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Digital Signature</div>
                       <img src="${signatureData}" alt="Signature" style="max-width:300px;display:block;"/>
                     </div>` : ''

                const html = `<!DOCTYPE html><html><body style="font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;padding:40px 0;">
                  <table width="600" style="margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <tr><td style="background:${accepted ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#ef4444,#dc2626)'};padding:28px 36px;">
                      <div style="font-size:24px;font-weight:900;color:white;">${accepted ? '✅' : '❌'} Quote ${accepted ? 'Accepted' : 'Declined'}</div>
                      <div style="font-size:14px;color:rgba(255,255,255,0.8);margin-top:4px;">${docNumber} &nbsp;·&nbsp; ${amount}</div>
                    </td></tr>
                    <tr><td style="padding:28px 36px;">
                      <p style="font-size:15px;color:#1e293b;">Quote <strong>${docNumber}</strong> has been <strong>${accepted ? 'accepted' : 'declined'}</strong>.</p>
                      ${declineReason ? `<div style="background:#fff5f5;border:1px solid #fca5a5;border-radius:10px;padding:14px 18px;margin:16px 0;"><strong style="color:#dc2626;">Reason:</strong><br/><span style="color:#374151;">${declineReason}</span></div>` : ''}
                      ${sigBlock}
                      ${accepted ? `<p style="font-size:13px;color:#6b7280;">You can now convert this quote to an invoice in Move Studio.</p>` : ''}
                    </td></tr>
                    <tr><td style="padding:14px 36px;background:#f8fafc;font-size:11px;color:#94a3b8;text-align:center;">Sent via Move Studio · ${new Date().toLocaleString('en-ZA')}</td></tr>
                  </table>
                </body></html>`

                await resend.emails.send({
                  from:    'Move Studio <onboarding@resend.dev>',
                  to:      ['malcolm@swifter.digital'],
                  subject,
                  html,
                })

                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))

              } catch (err: any) {
                console.error('❌ quote-response error:', err?.message)
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true }))
              }
              return
            }

            // Unknown billing route
            next()
          })
        },
      },

      // ── Vercel publish API middleware ───────────────────────
      {
        name: 'publish-api',
        configureServer(server) {
          server.middlewares.use('/api/publish', (req: any, res: any) => {
            if (req.method !== 'POST') {
              res.writeHead(405, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
              return
            }
            const chunks: Buffer[] = []
            req.on('data', (c: Buffer) => chunks.push(c))
            req.on('end', async () => {
              try {
                const body = JSON.parse(Buffer.concat(chunks).toString())
                const { slug, html } = body
                const token = env.VERCEL_TOKEN
                if (!token) {
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ ok: false, error: 'VERCEL_TOKEN not set in .env.local — get yours at vercel.com/account/tokens' }))
                  return
                }
                // Vercel Files API — deploys static HTML with no git repo needed
                const vercelRes = await fetch('https://api.vercel.com/v13/deployments', {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: `move-studio-${slug}`,
                    files: [{ file: 'index.html', data: html, encoding: 'utf-8' }],
                    projectSettings: { framework: null },
                    target: 'production',
                  }),
                })
                const data = await vercelRes.json()
                if (!vercelRes.ok) {
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ ok: false, error: data.error?.message || 'Vercel deployment failed' }))
                  return
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: true, url: `https://${data.url}`, deploymentId: data.id }))
              } catch (err: any) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: false, error: err.message }))
              }
            })
          })
        },
      },

      // ── AI API middleware ──────────────────────────────────
      {
        name: 'ai-api',
        configureServer(server) {
          // Helper: parse request body
          const readBody = (req: any): Promise<any> => new Promise((resolve, reject) => {
            const chunks: Buffer[] = []
            req.on('data', (c: Buffer) => chunks.push(c))
            req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString())) } catch { resolve({}) } })
            req.on('error', reject)
          })

          // POST /api/ai — chat completions (returns JSON)
          server.middlewares.use('/api/ai', async (req: any, res: any, next: any) => {
            if (req.url === '/stream') return next() // handled below
            if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
            try {
              const body = await readBody(req)
              const key = env.OPENAI_API_KEY
              if (!key) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: false, error: 'OPENAI_API_KEY not set in .env.local' }))
                return
              }
              const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'gpt-4o', response_format: { type: 'json_object' }, ...body }),
              })
              const data = await aiRes.json()
              if (!aiRes.ok) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: false, error: data.error?.message || 'OpenAI error' }))
                return
              }
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true, result: data.choices?.[0]?.message?.content }))
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: false, error: err.message }))
            }
          })

          // POST /api/ai/stream — SSE streaming for Nyra
          server.middlewares.use('/api/ai/stream', async (req: any, res: any) => {
            if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
            try {
              const body = await readBody(req)
              const key = env.OPENAI_API_KEY
              if (!key) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: false, error: 'OPENAI_API_KEY not set in .env.local' }))
                return
              }
              res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' })
              const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'gpt-4o', stream: true, ...body }),
              })
              const reader = (aiRes.body as any).getReader()
              const decoder = new TextDecoder()
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                const chunk = decoder.decode(value)
                res.write(chunk)
              }
              res.end()
            } catch (err: any) {
              res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
              res.end()
            }
          })

          // POST /api/ai-image — DALL-E 3 image generation
          server.middlewares.use('/api/ai-image', async (req: any, res: any) => {
            if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
            try {
              const body = await readBody(req)
              const key = env.OPENAI_API_KEY
              if (!key) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: false, error: 'OPENAI_API_KEY not set in .env.local' }))
                return
              }
              const aiRes = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'dall-e-3', n: 1, size: '1792x1024', response_format: 'url', ...body }),
              })
              const data = await aiRes.json()
              if (!aiRes.ok) {
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ ok: false, error: data.error?.message || 'DALL-E error' }))
                return
              }
              // Fetch image and convert to base64 so it works offline
              const imgUrl = data.data?.[0]?.url
              const imgRes = await fetch(imgUrl)
              const imgBuf = await imgRes.arrayBuffer()
              const b64 = Buffer.from(imgBuf).toString('base64')
              const mime = imgRes.headers.get('content-type') || 'image/png'
              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: true, dataUrl: `data:${mime};base64,${b64}` }))
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ ok: false, error: err.message }))
            }
          })
        },
      },
    ],

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },

    server: {
      port: 3001,
    },
  }
})
