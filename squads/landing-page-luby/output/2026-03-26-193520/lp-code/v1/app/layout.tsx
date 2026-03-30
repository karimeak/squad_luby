import type { Metadata } from 'next';
import '@/styles/globals.css';
import { schemaJsonLd } from '@/lib/schema';

// ============================================================
// Metadata — Beatriz SEO package (seo-package.md)
// ============================================================
export const metadata: Metadata = {
  // Title tag: 57 chars — keyword in first 28 chars
  title: 'Nearshore Staff Augmentation for US Teams | Luby Software',

  // Meta description: 138 chars
  description:
    'Hire vetted nearshore engineers in 14 days. Luby matches your stack and sector from 1,300+ projects. No commitment until you\'re satisfied.',

  // Canonical URL
  alternates: {
    canonical: 'https://luby.co/staff-augmentation',
  },

  // Open Graph
  openGraph: {
    type: 'website',
    url: 'https://luby.co/staff-augmentation',
    title: 'Vet Your Nearshore Engineer Before You Commit — Luby Software',
    description:
      'Hire vetted nearshore engineers in 14 days. No commitment until you\'re satisfied. 1,300+ projects. US operations.',
    images: [
      {
        url: 'https://luby.co/og/staff-augmentation.jpg',
        width: 1200,
        height: 630,
        alt: 'Luby Software — Nearshore Staff Augmentation for US Engineering Teams',
      },
    ],
    siteName: 'Luby Software',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Vet Your Nearshore Engineer Before You Commit — Luby Software',
    description:
      'Hire vetted nearshore engineers in 14 days. No commitment until you\'re satisfied. 1,300+ projects. US operations.',
    images: ['https://luby.co/og/staff-augmentation.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-XXXXXXX';

  return (
    <html lang="en">
      <head>
        {/* ============================================================
            Google Fonts — Inter (preconnect + stylesheet)
            font-display: swap included via display=swap param
            ============================================================ */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ============================================================
            Hero image preload — LCP optimization
            Beatriz SEO requirement: LCP < 2.5s
            ============================================================ */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-staff-aug.webp"
          // @ts-expect-error — fetchpriority is a valid HTML attribute not yet in React types
          fetchpriority="high"
        />

        {/* ============================================================
            Schema JSON-LD — STATIC (not via dynamic JS)
            Source: seo-package.md — Service + FAQPage schemas
            Beatriz requirement: <script type="application/ld+json">
            in <head>, never via JavaScript injection
            ============================================================ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJsonLd }}
        />

        {/* ============================================================
            Google Tag Manager — placeholder ID (replace GTM-XXXXXXX)
            ============================================================ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      </head>
      <body>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
