# Luby Staff Augmentation — Landing Page

Next.js 15 static export landing page for Luby Software's nearshore staff augmentation service, targeting US VP of Engineering personas.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7 (strict mode) |
| Styling | CSS Modules + CSS custom properties |
| Icons | lucide-react 0.469 |
| Deploy | Static export (`output: 'export'`) — Hostinger compatible |

**Zero external CSS frameworks. Zero runtime dependencies beyond Next.js + React.**

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Edit .env.local — fill in GTM ID, form endpoint, base URL

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Production Build

```bash
npm run build
# Generates: ./out/ (static HTML/CSS/JS)
```

The `out/` directory is the deployable artifact. All routes are pre-rendered as static HTML.

---

## Deploy Options — Hostinger

### Option 1: File Manager (simplest)

1. Run `npm run build` locally
2. Open Hostinger hPanel → File Manager
3. Navigate to `public_html/`
4. Upload all contents of `./out/` (not the folder itself — its contents)
5. Verify `index.html` is at `public_html/index.html`

### Option 2: Git CI (recommended for teams)

1. Push your repo to GitHub/GitLab
2. In Hostinger hPanel → Git → connect repository
3. Set build command: `npm install && npm run build`
4. Set publish directory: `out`
5. Push triggers automatic redeploy

### Option 3: Node.js Server (if switching to SSR)

If removing `output: 'export'` from `next.config.js`:

1. In Hostinger hPanel → Node.js → Create Application
2. Set startup file: `server.js` (or use `next start`)
3. Set Node.js version: 20.x
4. Build: `npm install && npm run build`
5. Start: `npm start`

> Note: SSR requires Hostinger Business plan or higher with Node.js hosting.

---

## Post-Deploy Checklist

- [ ] Replace `GTM-XXXXXXX` in `.env.local` with real GTM container ID
- [ ] Set `NEXT_PUBLIC_FORM_ENDPOINT` to a real form endpoint (Formspree, custom API, etc.)
- [ ] Set `NEXT_PUBLIC_BASE_URL` to the live domain
- [ ] Add hero image: `public/images/hero-staff-aug.webp` (max 400KB, 1440x800px)
- [ ] Add OG image: `public/og/staff-augmentation.jpg` (1200x630px) — or update URL in `app/layout.tsx`
- [ ] Add Luby logo: `public/images/logo.png` (200x60px)
- [ ] Update canonical URL in `app/layout.tsx` metadata if domain differs from `luby.co`
- [ ] Verify schema JSON-LD renders in page source (`view-source:` → search `application/ld+json`)
- [ ] Run Core Web Vitals test: [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Verify mobile rendering at 375px, 768px, 1200px+

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GTM_ID` | Yes | Google Tag Manager container ID (e.g., `GTM-ABC123`) |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Yes | Form submission endpoint URL |
| `NEXT_PUBLIC_BASE_URL` | Yes | Canonical base URL without trailing slash |
