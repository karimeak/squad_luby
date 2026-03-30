import React from 'react';
import SectionLabel from '@/components/ui/SectionLabel';

const sectors = ['Healthcare', 'Fintech', 'Enterprise SaaS', 'Education', 'IoT'];

export default function SocialProofSection() {
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      style={{
        backgroundColor: 'var(--color-bg-alt)',
        padding: 'var(--section-padding)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-content)',
          margin: '0 auto',
        }}
      >
        <SectionLabel>Social Proof</SectionLabel>

        {/* H2 — SEO otimizado */}
        <h2
          id="proof-heading"
          style={{
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--color-text)',
            letterSpacing: '-0.02em',
            marginBottom: '40px',
            maxWidth: '640px',
          }}
        >
          How US Companies Scale Engineering Teams with Luby Nearshore
        </h2>

        {/* Global metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--color-border)',
            borderRadius: 'var(--card-radius)',
            overflow: 'hidden',
            marginBottom: '48px',
          }}
        >
          {[
            { value: '1,300+', label: 'projects delivered' },
            { value: '23 years', label: 'of experience' },
            { value: '540+', label: 'clients' },
            { value: '3 continents', label: 'operations' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: 'var(--color-card-bg)',
                padding: '28px 24px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <figure
          style={{
            backgroundColor: 'var(--color-card-bg)',
            borderRadius: 'var(--card-radius)',
            padding: 'clamp(24px, 4vw, 40px)',
            borderLeft: '4px solid var(--color-primary)',
            boxShadow: 'var(--color-card-shadow)',
            margin: '0 0 48px 0',
            maxWidth: '760px',
          }}
        >
          <blockquote>
            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                fontWeight: 400,
                lineHeight: 1.65,
                color: 'var(--color-text)',
                fontStyle: 'italic',
                marginBottom: '20px',
              }}
            >
              &ldquo;We had been burned twice by nearshore teams that needed constant supervision. Luby was different from day one — the engineer they matched us with owned the work from the first sprint.&rdquo;
            </p>
          </blockquote>
          <figcaption
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-text)',
              }}
            >
              VP of Engineering
            </span>
            <span
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Series B Fintech — San Francisco
            </span>
          </figcaption>
        </figure>

        {/* Sectors */}
        <div>
          <p
            style={{
              fontSize: 'var(--text-label)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
              marginBottom: '16px',
            }}
          >
            Clients across regulated industries
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {sectors.map((sector) => (
              <span
                key={sector}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '100px',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                }}
              >
                {sector}
              </span>
            ))}
          </div>
          <p
            style={{
              fontSize: 'var(--text-caption)',
              color: 'var(--color-text-secondary)',
              marginTop: '16px',
              fontStyle: 'italic',
            }}
          >
            Client logos available on request — displayed in grayscale grid prioritizing US and regulated-sector names.
          </p>
        </div>
      </div>
    </section>
  );
}
