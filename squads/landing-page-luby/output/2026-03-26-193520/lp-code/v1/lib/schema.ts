// ============================================================
// Schema JSON-LD — Luby Staff Augmentation Landing Page
// Source: seo-package.md (Beatriz SEO)
// IMPORTANT: This is rendered as a static <script type="application/ld+json">
// tag in app/layout.tsx — never injected via dynamic JavaScript.
// ============================================================

export const schemaJsonLd = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Nearshore Staff Augmentation",
    "description":
      "Hire vetted nearshore engineers in 14 days. Luby matches your stack and sector from 1,300+ projects. No commitment until you're satisfied.",
    "serviceType": "Staff Augmentation",
    "url": "https://luby.co/staff-augmentation",
    "provider": {
      "@type": "Organization",
      "name": "Luby Software",
      "url": "https://luby.co",
      "logo": {
        "@type": "ImageObject",
        "url": "https://luby.co/logo.png",
        "width": 200,
        "height": 60,
      },
      "foundingDate": "2002",
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": 300,
      },
      "address": [
        {
          "@type": "PostalAddress",
          "addressCountry": "BR",
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
        },
        {
          "@type": "PostalAddress",
          "addressCountry": "US",
          "addressLocality": "Miami",
          "addressRegion": "FL",
        },
      ],
      "sameAs": [
        "https://www.linkedin.com/company/luby-software/",
        "https://luby.co",
      ],
    },
    "areaServed": [
      { "@type": "Country", "name": "Brazil" },
      { "@type": "Country", "name": "United States" },
      { "@type": "Place", "name": "Europe" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can we interview the engineer before committing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. You'll meet the engineer before they join your team. Our Engineering Fit process includes a candidate presentation step before any engagement begins.",
        },
      },
      {
        "@type": "Question",
        "name": "What if the engineer is not a culture fit after a few weeks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We replace them. That's what the pilot period is for. The first two weeks are a structured pilot with formal performance checkpoints. If the engineer isn't delivering to the agreed standard, we make a replacement at no additional cost.",
        },
      },
      {
        "@type": "Question",
        "name": "What is Luby's engineer attrition rate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lower than industry average — because we match, not just staff. Our 3-layer Engineering Fit process selects engineers based on technical depth, sector experience, and project ownership capacity, not just availability.",
        },
      },
    ],
  },
]);
