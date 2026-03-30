import React from 'react';
import Button from '@/components/ui/Button';
import MetricStrip from '@/components/ui/MetricStrip';

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      style={{
        backgroundColor: 'var(--color-bg)',
        paddingTop: 'calc(64px + clamp(60px, 8vw, 100px))',
        paddingBottom: 'clamp(60px, 8vw, 100px)',
        paddingLeft: 'clamp(16px, 5vw, 80px)',
        paddingRight: 'clamp(16px, 5vw, 80px)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-content)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '780px' }}>
          {/* H1 — copy exato do SEO package (keyword "Nearshore" inserida pela Beatriz) */}
          <h1
            id="hero-heading"
            style={{
              fontSize: 'var(--text-hero)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            What If You Could Vet Your Next Nearshore Engineer Before Signing Anything?
          </h1>

          {/* Subtitle — copy exato */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)',
              marginBottom: '36px',
              maxWidth: '640px',
            }}
          >
            Luby matches your team with senior engineers — validated in your sector and stack — operational in 14 days. No long-term commitment until you&apos;re satisfied.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '48px',
            }}
          >
            <Button href="#contact" variant="primary">
              Schedule a Technical Call
            </Button>
            <Button href="#solution" variant="ghost">
              See How It Works ↓
            </Button>
          </div>

          {/* Social Proof Strip */}
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '24px',
            }}
          >
            <MetricStrip
              style={{
                justifyContent: 'flex-start',
                marginLeft: '-20px',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
