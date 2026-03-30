import React from 'react';
import SectionLabel from '@/components/ui/SectionLabel';

export default function ProblemSection() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
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
        <div style={{ maxWidth: 'var(--max-text)' }}>
          <SectionLabel>The Problem</SectionLabel>

          {/* H2 — SEO otimizado pela Beatriz */}
          <h2
            id="problem-heading"
            style={{
              fontSize: 'var(--text-h2)',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--color-text)',
              marginBottom: '40px',
              letterSpacing: '-0.02em',
            }}
          >
            The Real Reason Your Last Nearshore Outsourcing Failed
          </h2>

          {/* Copy exato — 5 parágrafos */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
              }}
            >
              You&apos;ve been here before.
            </p>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
              }}
            >
              You hired a nearshore vendor. They promised senior engineers. You got people you had to walk through every ticket.
            </p>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
              }}
            >
              Your engineers became reviewers. Your delivery timelines doubled. And the vendor kept invoicing.
            </p>

            {/* Transition line — highlighted */}
            <p
              style={{
                fontSize: 'clamp(16px, 2vw, 20px)',
                fontWeight: 700,
                lineHeight: 1.5,
                color: 'var(--color-text)',
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '20px',
              }}
            >
              That&apos;s not an outsourcing problem. That&apos;s a vetting problem.
            </p>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
              }}
            >
              Most nearshore companies send you 3 CVs selected from whoever&apos;s available. You pick one. You hope it works. If it doesn&apos;t, you&apos;re back to square one — three months later, deeper in the hole.
            </p>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
              }}
            >
              Your roadmap can&apos;t survive another wrong hire.
            </p>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                fontWeight: 600,
              }}
            >
              Neither can your credibility with the board.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
