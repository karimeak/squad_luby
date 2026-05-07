// Supabase Edge Function: wp-media-uploader
// Deploy: supabase functions deploy wp-media-uploader
//
// Resolve dois bloqueios estruturais do pipeline blog-luby-auto:
//   1. Allowlist de rede local bloqueia Unsplash CDN + WP REST API (Ada nao consegue baixar nem subir).
//   2. pg_net nao suporta upload binario (Content-Type: image/jpeg + --data-binary).
//
// Esta funcao roda em Deno na infra Supabase (sem allowlist) e faz tudo que Ada
// fazia em Fase 4a/4b/4c — em uma unica chamada HTTP.
//
// Fluxo:
//   1. fetch(image_url)              -> ArrayBuffer (CDN Unsplash livre)
//   2. POST WP /wp/v2/media          -> binary upload, retorna media_id
//   3. POST WP /wp/v2/media/{id}     -> alt_text + caption (licenca Unsplash)
//   4. (opcional) Unsplash download tracking
//
// Autenticacao: Basic Auth (email + Application Password com espacos).
// Sem secrets necessarios — credenciais WP vem no body (publisher-specific).

interface UploadPayload {
  wp_url:              string  // ex: "https://blog.luby.com.br"
  wp_email:            string  // username do publisher (Application Password)
  wp_password:         string  // Application Password com espacos preservados
  image_url:           string  // URL Unsplash (images.unsplash.com/...)
  image_alt:           string  // alt text descritivo
  image_caption_html:  string  // HTML com atribuicao Unsplash
  filename?:           string  // default: "featured.jpg"
  // Opcional — se presente, dispara tracking de download Unsplash (licenca)
  unsplash_photo_id?:    string
  unsplash_access_key?:  string
}

interface UploadResult {
  ok:                 true
  media_id:           number
  media_source_url:   string
  metadata_updated:   boolean
  unsplash_tracking:  'ok' | 'skipped' | 'failed'
}

interface UploadError {
  ok:      false
  stage:   'validate' | 'fetch_image' | 'upload_media' | 'update_metadata'
  status?: number
  error:   string
  detail?: unknown
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return json(405, { ok: false, stage: 'validate', error: 'Method not allowed' })
  }

  let p: UploadPayload
  try {
    p = await req.json()
  } catch {
    return json(400, { ok: false, stage: 'validate', error: 'Invalid JSON body' })
  }

  const required = ['wp_url', 'wp_email', 'wp_password', 'image_url', 'image_alt', 'image_caption_html']
  const missing = required.filter(k => !(p as Record<string, unknown>)[k])
  if (missing.length) {
    return json(400, { ok: false, stage: 'validate', error: `Missing fields: ${missing.join(', ')}` })
  }

  const wpBase   = p.wp_url.replace(/\/+$/, '')
  const filename = (p.filename || 'featured.jpg').replace(/[^a-zA-Z0-9._-]/g, '-')
  const auth     = 'Basic ' + btoa(`${p.wp_email}:${p.wp_password}`)

  // ── 0. Unsplash download tracking (opcional, por licenca) ─────────────
  let unsplashTracking: 'ok' | 'skipped' | 'failed' = 'skipped'
  if (p.unsplash_photo_id && p.unsplash_access_key) {
    try {
      const r = await fetch(
        `https://api.unsplash.com/photos/${encodeURIComponent(p.unsplash_photo_id)}/download`,
        { headers: { Authorization: `Client-ID ${p.unsplash_access_key}` } }
      )
      unsplashTracking = r.ok ? 'ok' : 'failed'
    } catch {
      unsplashTracking = 'failed'
    }
  }

  // ── 1. Baixar a imagem do Unsplash ─────────────────────────────────────
  let imageBytes: ArrayBuffer
  let contentType = 'image/jpeg'
  try {
    const r = await fetch(p.image_url)
    if (!r.ok) {
      return json(502, {
        ok: false, stage: 'fetch_image', status: r.status,
        error: `Failed to fetch image from ${p.image_url}`,
      })
    }
    contentType = r.headers.get('content-type') || 'image/jpeg'
    imageBytes  = await r.arrayBuffer()
  } catch (err) {
    return json(502, { ok: false, stage: 'fetch_image', error: String(err) })
  }

  // Garantir extensao consistente com content-type
  const ext = contentType.includes('png')  ? '.png'
            : contentType.includes('webp') ? '.webp'
            :                                 '.jpg'
  const finalFilename = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '') + ext

  // ── 2. Upload binario para WP Media Library ────────────────────────────
  let mediaId: number
  let mediaSourceUrl: string
  try {
    const r = await fetch(`${wpBase}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        Authorization:        auth,
        'Content-Type':       contentType,
        'Content-Disposition': `attachment; filename="${finalFilename}"`,
      },
      body: imageBytes,
    })
    const text = await r.text()
    if (!r.ok) {
      return json(r.status, {
        ok: false, stage: 'upload_media', status: r.status,
        error: 'WP rejected media upload', detail: safeJson(text),
      })
    }
    const body = JSON.parse(text)
    mediaId        = body.id
    mediaSourceUrl = body.source_url
    if (!mediaId) {
      return json(502, {
        ok: false, stage: 'upload_media', status: r.status,
        error: 'WP response missing media id', detail: body,
      })
    }
  } catch (err) {
    return json(502, { ok: false, stage: 'upload_media', error: String(err) })
  }

  // ── 3. Atualizar alt_text + caption (licenca Unsplash + SEO) ───────────
  let metadataUpdated = false
  try {
    const r = await fetch(`${wpBase}/wp-json/wp/v2/media/${mediaId}`, {
      method: 'POST',
      headers: {
        Authorization:  auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        alt_text: p.image_alt,
        caption:  p.image_caption_html,
      }),
    })
    metadataUpdated = r.ok
    // Falha aqui nao bloqueia — media ja foi enviado. Logar mas continuar.
    if (!r.ok) {
      console.warn('Metadata update failed:', r.status, await r.text())
    }
  } catch (err) {
    console.warn('Metadata update threw:', err)
  }

  return json(200, {
    ok: true,
    media_id:          mediaId,
    media_source_url:  mediaSourceUrl,
    metadata_updated:  metadataUpdated,
    unsplash_tracking: unsplashTracking,
  } satisfies UploadResult)
})

// ─── Helpers ───────────────────────────────────────────────────────────────

function json(status: number, body: UploadResult | UploadError | object): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function safeJson(text: string): unknown {
  try { return JSON.parse(text) } catch { return text }
}
