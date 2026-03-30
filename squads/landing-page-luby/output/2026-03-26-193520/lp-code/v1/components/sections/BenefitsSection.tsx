import React from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import { Clock, Globe, Zap, Shield, Users } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Timezone overlap you can actually work with',
    body: 'Our engineers work on schedules that overlap with EST and PST — standard business hours, no async-only workflows.',
  },
  {
    icon: Globe,
    title: 'Technical English, daily',
    body: 'Your standups run in English. Your code reviews happen in English. No translation layer between your team and ours.',
  },
  {
    icon: Zap,
    title: 'Stack coverage without ramp-up',
    body: 'React, Node.js, Python, Java, TypeScript, AWS, GCP. Engineers matched to your project\'s stack — not whoever\'s available.',
  },
  {
    icon: Shield,
    title: 'US-compliant contracts',
    body: 'We operate a US entity. Contracts, NDAs, and IP agreements are governed by US standards. No friction with your legal team.',
  },
  {
    icon: Users,
    title: 'Start with one. Scale to a squad.',
    body: 'You can start with a single engineer and expand the engagement as confidence builds. No minimum commitment, no 12-month lock-in.',
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
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
        <SectionLabel>Operational Fit</SectionLabel>

        {/* H2 — SEO otimizado */}
        <h2
          id="benefits-heading"
          style={{
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            lineHeight: 1.2,
            color: 'var(--color-text)',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
            maxWidth: '620px',
          }}
        >
          What VP Engineers Get with Luby Nearshore Staff Augmentation
        </h2>

        <p
          style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: 'var(--color-text-secondary)',
            marginBottom: '48px',
            maxWidth: '560px',
            lineHeight: 1.6,
          }}
        >
          The details VPs actually ask about — before the first call.
        </p>

        {/* 5 benefit cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--gap-cards)',
          }}
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--card-radius)',
                  padding: 'var(--card-padding)',
                  boxShadow: 'var(--color-card-shadow)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(122, 184, 0, 0.1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color="var(--color-primary)" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3
                  style={{
                    fontSize: 'var(--text-h3)',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    lineHeight: 1.3,
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--text-body)',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {benefit.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
