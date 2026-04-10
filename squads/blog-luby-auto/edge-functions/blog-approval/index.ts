// Supabase Edge Function: blog-approval
// Deploy: supabase functions deploy blog-approval
//
// NO secrets needed — SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
// are injected automatically by Supabase.
// SMTP credentials are passed by the caller (Ada) in the POST body.
//
// Routes:
//   POST /blog-approval  → sends approval email via Zoho SMTP
//   GET  /blog-approval?token=...&action=approve|reject → handles button clicks

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!


// ─── Router ───────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  if (req.method === 'GET')  return handleApproval(url)
  if (req.method === 'POST') return handleSendEmail(req)
  return new Response('Method not allowed', { status: 405 })
})

// ─── POST: send approval email ────────────────────────────────────────────

interface EmailPayload {
  // SMTP credentials (passed by Ada from smtp-config.json)
  zoho_user:                string
  zoho_pass:                string
  from_name:                string
  approval_email:           string
  edge_function_url:        string
  // Article data
  article_id:               number
  title:                    string
  publisher_channel:        string
  publisher_name:           string
  language:                 string
  word_count:               number
  image_url:                string
  image_alt:                string
  photographer_name:        string
  photographer_profile_url: string
  post_preview:             string
  post_html:                string  // full HTML of the post for inline review
  approval_token:           string
  has_review_warning:       boolean
}

async function handleSendEmail(req: Request): Promise<Response> {
  let p: EmailPayload

  try {
    p = await req.json()
  } catch {
    return json(400, { error: 'Invalid JSON body' })
  }

  const missing = [
    'zoho_user', 'zoho_pass', 'approval_email', 'edge_function_url',
    'article_id', 'title', 'approval_token', 'image_url', 'photographer_name',
  ].filter(k => !(p as Record<string, unknown>)[k])

  if (missing.length) {
    return json(400, { error: `Missing fields: ${missing.join(', ')}` })
  }

  const approveUrl = `${p.edge_function_url}?token=${p.approval_token}&action=approve`
  const rejectUrl  = `${p.edge_function_url}?token=${p.approval_token}&action=reject`

  const transporter = nodemailer.createTransport({
    host:   'smtp.zoho.com',
    port:   465,
    secure: true,
    auth: { user: p.zoho_user, pass: p.zoho_pass },
  })

  try {
    const info = await transporter.sendMail({
      from:    `"${p.from_name || 'Blog Luby'}" <${p.zoho_user}>`,
      to:      p.approval_email,
      subject: `[Blog Luby] Novo post para aprovacao: ${p.title}`,
      html:    buildEmailHtml(p, approveUrl, rejectUrl),
    })

    return json(200, { ok: true, message_id: info.messageId, article_id: p.article_id })
  } catch (err) {
    console.error('SMTP error:', err)
    return json(500, { error: 'Failed to send email', detail: String(err) })
  }
}

// ─── GET: handle approval / rejection ────────────────────────────────────

async function handleApproval(url: URL): Promise<Response> {
  const token  = url.searchParams.get('token')
  const action = url.searchParams.get('action')

  if (!token || !['approve', 'reject'].includes(action ?? '')) {
    return page(400, '&#x274C;', 'Link inv&#xe1;lido ou expirado.', '')
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

  const { data: article, error } = await supabase
    .from('articles')
    .select('id, title, approved')
    .eq('approval_token', token)
    .single()

  if (error || !article) {
    return page(404, '&#x274C;', 'Artigo n&#xe3;o encontrado.', 'O token pode ter expirado ou o artigo foi removido.')
  }

  if (action === 'approve') {
    if (!article.approved) {
      await supabase
        .from('articles')
        .update({ approved: true, generated: new Date().toISOString().split('T')[0] })
        .eq('approval_token', token)
    }
    return new Response('O post sera publicado, aguarde!', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  // action === 'reject'
  await supabase
    .from('articles')
    .update({ content: null, approved: false })
    .eq('approval_token', token)

  return new Response('Nova versao solicitada. O pipeline ira regenerar no proximo ciclo.', {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

// ─── Email HTML ───────────────────────────────────────────────────────────

function buildEmailHtml(p: EmailPayload, approveUrl: string, rejectUrl: string): string {
  const warning = p.has_review_warning
    ? `<div style="background:#fff8e1;border-left:4px solid #f59e0b;padding:12px 20px;font-size:13px;color:#92400e;">
         &#x26A0;&#xFE0F; <strong>Aten&#xe7;&#xe3;o:</strong> a revis&#xe3;o t&#xe9;cnica identificou problemas. Verifique antes de aprovar.
       </div>`
    : ''

  const langBadge = p.language === 'EN'
    ? `<span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">EN</span>`
    : `<span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">PT-BR</span>`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:20px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">

  <div style="background:#0f172a;padding:24px 32px;">
    <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;margin-bottom:6px;">Blog Luby &#x2014; Novo post para aprova&#xe7;&#xe3;o</div>
    <div style="font-size:22px;font-weight:700;color:#f8fafc;line-height:1.3;">${p.title}</div>
  </div>

  <div style="padding:12px 32px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;">
    <strong style="color:#334155">${p.publisher_channel}</strong> &nbsp;·&nbsp;
    <strong style="color:#334155">${p.publisher_name}</strong> &nbsp;·&nbsp;
    ${langBadge} &nbsp;·&nbsp;
    ~${p.word_count} palavras
  </div>

  ${warning}

  <img src="${p.image_url}" alt="${p.image_alt}" style="width:100%;max-height:300px;object-fit:cover;display:block;" />
  <div style="padding:6px 32px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:11px;color:#94a3b8;">
    Foto por <a href="${p.photographer_profile_url}" style="color:#94a3b8;">${p.photographer_name}</a> via Unsplash
  </div>

  <div style="padding:28px 32px;border-bottom:1px solid #e2e8f0;">
    <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;margin-bottom:12px;">Conte&#xfa;do completo</div>
    <div style="font-size:15px;line-height:1.7;color:#374151;">${p.post_html || p.post_preview}</div>
  </div>

  <div style="padding:32px;text-align:center;">
    <div style="font-size:14px;color:#64748b;margin-bottom:24px;">O conte&#xfa;do foi gerado automaticamente. Escolha uma a&#xe7;&#xe3;o:</div>
    <a href="${approveUrl}" style="display:inline-block;padding:14px 32px;background:#16a34a;color:#fff;border-radius:7px;font-size:15px;font-weight:600;text-decoration:none;margin:0 8px;">Aprovar e Publicar</a>
    <a href="${rejectUrl}" style="display:inline-block;padding:14px 32px;background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;border-radius:7px;font-size:15px;font-weight:600;text-decoration:none;margin:0 8px;">Gerar Nova Vers&#xe3;o</a>
  </div>

  <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8;">
    Blog Luby Auto &nbsp;·&nbsp; ${new Date().toISOString().split('T')[0]} &nbsp;·&nbsp; Artigo #${p.article_id}
  </div>

</div>
</body>
</html>`
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function json(status: number, body: object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function page(status: number, icon: string, title: string, body: string): Response {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blog Luby</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:24px;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  .card{background:#fff;border-radius:12px;padding:48px 40px;max-width:480px;width:100%;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .icon{font-size:48px;margin-bottom:16px}
  h1{margin:0 0 12px;font-size:22px;color:#0f172a}
  p{margin:0;color:#64748b;font-size:15px;line-height:1.6}
</style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${body}</p>
  </div>
</body>
</html>`
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
