import React from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import { Code2, Layers, Shield } from 'lucide-react';

const layers = [
  {
    number: '01',
    icon: Code2,
    title: 'Layer 1 — Technical Screening',
    body: "We don't just check if they pass a coding test. We evaluate stack depth, code ownership patterns, and the ability to work without hand-holding. 9 out of 10 candidates don't make it past this stage.",
  },
  {
    number: '02',
    icon: Layers,
    title: 'Layer 2 — Context Matching',
    body: "We match based on sector experience — not just technologies. Engineers who've built in fintech think differently from engineers who've built in e-commerce. You get someone who already understands your regulatory context, your product constraints, your risk exposure.",
  },
  {
    number: '03',
    icon: Shield,
    title: 'Layer 3 — Validated Pilot',
    body: "The first two weeks are a structured pilot. We define clear performance checkpoints together. Only after you've seen the work do you decide on a longer engagement.",
  },
];

export default function SolutionSection() {
  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      style={{
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--section-padding)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-content)',
          margin: '0 auto',
        }}
      >
        <SectionLabel>The Solution</SectionLabel>

        {/* H2 — SEO otimizado */}
        <h2
          id="solution-heading"
          style={{
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--color-text)',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            maxWidth: '700px',
          }}
        >
          Engineering Fit: The 3-Layer Vetting Process for Nearshore Software Teams
        </h2>

        {/* Intro copy */}
        <div style={{ maxWidth: 'var(--max-text)', marginBottom: '48px' }}>
          <p
            style={{
              fontSize: 'clamp(15px, 1.8vw, 17px)',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
              marginBottom: '8px',
            }}
          >
            We built a 3-layer vetting process specifically for this.
          </p>
          <p
            style={{
              fontSize: 'clamp(15px, 1.8vw, 17px)',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
            }}
          >
            We call it Engineering Fit. Here&apos;s how it works:
          </p>
        </div>

        {/* 3 layers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--gap-cards)',
            marginBottom: '48px',
          }}
        >
          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.number}
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--card-radius)',
                  padding: 'var(--card-padding)',
                  boxShadow: 'var(--color-card-shadow)',
                  position: 'relative',
                }}
              >
                {/* Layer number */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '32px',
                    fontWeight: 800,
                    color: 'rgba(122, 184, 0, 0.12)',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {layer.number}
                </span>

                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(122, 184, 0, 0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Icon size={20} color="var(--color-primary)" strokeWidth={1.75} aria-hidden="true" />
                </div>

                <h3
                  style={{
                    fontSize: 'var(--text-h3)',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                  }}
                >
                  {layer.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-body)',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {layer.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Differentiator callout */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-alt)',
            borderRadius: 'var(--card-radius)',
            padding: 'clamp(20px, 3vw, 32px)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            <p
              style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                fontWeight: 600,
                color: 'var(--color-text)',
                lineHeight: 1.5,
                marginBottom: '8px',
              }}
            >
              Most vendors send you 3 CVs and hope for the best. We run 3 layers of vetting before you see a single name.
            </p>
            <p
              style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              No commitment until you&apos;re satisfied. No surprises after you sign.
            </p>
            <p
              style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginTop: '8px',
              }}
            >
              This is how 1,300+ projects get delivered. Not by luck. By process.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
