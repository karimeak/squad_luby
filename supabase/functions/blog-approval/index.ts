import nodemailer from "npm:nodemailer@6";

const BLOG_NAMES: Record<string, string> = {
  blog_luby: "Blog Luby Brasil",
  blog_luby_us: "Blog Luby US",
  blog_nearsmarter: "Blog NearSmarter",
};

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const {
      mode = "notification",
      zoho_user,
      zoho_pass,
      from_name,
      notification_emails = [],
      publisher_email,
      article_id,
      title,
      publisher_name,
      publisher_channel,
      wp_url,
      has_review_warning = false,
    } = body;

    if (!zoho_user || !zoho_pass) {
      return new Response(
        JSON.stringify({ ok: false, error: "zoho_user e zoho_pass são obrigatórios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: { user: zoho_user, pass: zoho_pass },
    });

    // Time de notificação + publisher (deduplicado)
    const to = [...new Set([...notification_emails, publisher_email].filter(Boolean))] as string[];

    if (to.length === 0) {
      return new Response(
        JSON.stringify({ ok: false, error: "Nenhum destinatário definido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const blogName = BLOG_NAMES[publisher_channel] ?? publisher_channel;

    const warningHtml = has_review_warning
      ? `<p style="background:#fef3c7;color:#92400e;padding:12px 16px;border-radius:6px;font-size:14px;">
           ⚠️ <strong>Atenção:</strong> a revisão técnica automatizada identificou problemas.
           Verifique o conteúdo antes de aprovar.
         </p>`
      : "";

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1e293b;">
  <h2 style="margin-top:0;">🚀 Novo artigo publicado</h2>
  <p>
    O artigo <strong>"${title}"</strong> foi publicado por
    <strong>${publisher_name}</strong> em <strong>${blogName}</strong>.
  </p>
  <p>
    <a href="${wp_url}"
       style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;
              border-radius:6px;text-decoration:none;font-weight:600;">
      Ver artigo publicado →
    </a>
  </p>
  ${warningHtml}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
  <p style="color:#64748b;font-size:13px;margin:0;">
    Caso queira fazer revisão, clique no link acima.<br>
    Se encontrar algum problema, apague o post diretamente no WordPress.
  </p>
</body>
</html>`;

    await transporter.sendMail({
      from: `"${from_name}" <${zoho_user}>`,
      to: to.join(", "),
      subject: `Novo artigo publicado — ${title}`,
      html,
    });

    return new Response(
      JSON.stringify({ ok: true, article_id, recipients: to }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("blog-approval error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
