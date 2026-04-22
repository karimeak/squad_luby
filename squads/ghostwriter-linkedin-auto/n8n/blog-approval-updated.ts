import nodemailer from "npm:nodemailer@6";

const BLOG_NAMES: Record<string, string> = {
  blog_luby: "Blog Luby Brasil",
  blog_luby_us: "Blog Luby US",
  blog_nearsmarter: "Blog NearSmarter",
  blog_finfy: "Blog Finfy",
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
      // --- blog fields ---
      publisher_email,
      article_id,
      title,
      publisher_name,
      publisher_channel,
      wp_url,
      has_review_warning = false,
      // --- linkedin fields ---
      collaborator_email,
      collaborator_name,
      flavor,
      post_en,
      post_pt,
      image_url,
      linkedin_overview,
      blogger_id_en,
      blogger_id_pt,
      run_date,
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

    // ─── MODE: linkedin-post ──────────────────────────────────────────────────
    if (mode === "linkedin-post") {
      const to = [collaborator_email].filter(Boolean) as string[];

      if (to.length === 0) {
        return new Response(
          JSON.stringify({ ok: false, error: "collaborator_email não definido" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const mdToHtml = (text: string) =>
        (text ?? "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");

      const imageHtml = image_url
        ? `<img src="${image_url}" alt="Visual sugerido para o post"
               style="width:100%;border-radius:8px;margin-top:8px;display:block;">`
        : `<p style="color:#94a3b8;font-size:13px;">Imagem não disponível.</p>`;

      const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"></head>
<body style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#1e293b;">

  <h2 style="margin-top:0;">Seu post LinkedIn está pronto ✅</h2>
  <p>Olá, <strong>${collaborator_name}</strong>! Seu post sobre <em>${flavor}</em> foi gerado em ${run_date}.</p>
  <p style="color:#64748b;font-size:13px;">Revise, ajuste o que quiser e publique quando preferir.</p>

  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">

  <h3 style="margin-bottom:8px;">🇺🇸 Post em inglês</h3>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;
              white-space:pre-wrap;font-size:14px;line-height:1.6;">
${mdToHtml(post_en)}
  </div>

  <h3 style="margin-bottom:8px;margin-top:24px;">🇧🇷 Post em português</h3>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;
              white-space:pre-wrap;font-size:14px;line-height:1.6;">
${mdToHtml(post_pt)}
  </div>

  <h3 style="margin-bottom:8px;margin-top:24px;">🖼️ Imagem sugerida</h3>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;">
    ${imageHtml}
  </div>

  <h3 style="margin-bottom:8px;margin-top:24px;">💼 Dicas para o seu perfil LinkedIn</h3>
  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;
              font-size:13px;line-height:1.6;">
${mdToHtml(linkedin_overview)}
  </div>

  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
  <p style="color:#94a3b8;font-size:12px;margin:0;">
    Gerado automaticamente pelo Ghostwriter LinkedIn · Luby Software
  </p>

</body>
</html>`;

      await transporter.sendMail({
        from: `"${from_name}" <${zoho_user}>`,
        to: to.join(", "),
        subject: `Seu post LinkedIn está pronto — ${flavor}`,
        html,
      });

      return new Response(
        JSON.stringify({ ok: true, collaborator: collaborator_name, recipients: to }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // ─── MODE: notification (blog — lógica original intacta) ──────────────────
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
  <h2 style="margin-top:0;">Novo artigo publicado</h2>
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
