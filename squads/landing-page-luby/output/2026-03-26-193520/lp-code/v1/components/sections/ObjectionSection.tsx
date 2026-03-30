import React from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import FaqSection from './FaqSection';

export default function ObjectionSection() {
  return (
    <section
      id="objection"
      aria-labelledby="objection-heading"
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
        <SectionLabel>Common Objections</SectionLabel>

        {/* H2 — SEO otimizado */}
        <h2
          id="objection-heading"
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
          Is Nearshore Staff Augmentation Actually Worth It? Our Answer.
        </h2>

        {/* Objeção principal e resposta — copy exato */}
        <div
          style={{
            maxWidth: 'var(--max-text)',
            marginBottom: '56px',
          }}
        >
          {/* Named objection */}
          <div
            style={{
              backgroundColor: 'var(--color-card-bg)',
              borderRadius: 'var(--card-radius)',
              padding: 'clamp(24px, 4vw, 40px)',
              border: '1px solid var(--color-border)',
              marginBottom: '32px',
            }}
          >
            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                fontWeight: 700,
                color: 'var(--color-text)',
                marginBottom: '20px',
              }}
            >
              &ldquo;What If They&apos;re Not Actually Senior?&rdquo;
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p
                style={{
                  fontSize: 'clamp(15px, 1.8vw, 17px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                }}
              >
                That&apos;s the right question to ask. It&apos;s the one nobody else in this market answers directly.
              </p>

              <p
                style={{
                  fontSize: 'clamp(15px, 1.8vw, 17px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                }}
              >
                Here&apos;s our answer:
              </p>

              <p
                style={{
                  fontSize: 'clamp(15px, 1.8vw, 17px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                }}
              >
                Before you see a single name, we run every candidate through a technical screen that eliminates most applicants. The ones who make it have demonstrated the ability to own work — not just execute tasks.
              </p>

              <p
                style={{
                  fontSize: 'clamp(15px, 1.8vw, 17px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                }}
              >
                The first two weeks are a paid pilot with structured performance checkpoints. If the engineer isn&apos;t delivering to the standard we agreed on, we replace them. No extra cost to you. No questions asked.
              </p>

              <p
                style={{
                  fontSize: 'clamp(15px, 1.8vw, 17px)',
                  lineHeight: 1.7,
                  color: 'var(--color-text)',
                }}
              >
                In 23 years, our clients haven&apos;t had to babysit a Luby engineer. We built our process specifically so they don&apos;t have to.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ accordion */}
        <FaqSection />
      </div>
    </section>
  );
}
