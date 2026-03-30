'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const faqs = [
  {
    question: '"Can we interview the engineer before committing?"',
    answer: "Yes. You'll meet the engineer before they join your team.",
  },
  {
    question: '"What if it\'s not a culture fit after a few weeks?"',
    answer: "We replace them. That's what the pilot period is for.",
  },
  {
    question: '"What\'s your attrition rate?"',
    answer: 'Lower than industry average — because we match, not just staff.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div aria-label="Frequently asked questions">
      <p
        style={{
          fontSize: 'var(--text-label)',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary)',
          marginBottom: '20px',
        }}
      >
        Questions we get from VPs before the first call
      </p>

      <div
        role="list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          backgroundColor: 'var(--color-border)',
          borderRadius: 'var(--card-radius)',
          overflow: 'hidden',
        }}
      >
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              role="listitem"
              style={{ backgroundColor: 'var(--color-card-bg)' }}
            >
              <button
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                onClick={() => toggle(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '20px 24px',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <span
                  style={{
                    fontSize: 'clamp(15px, 1.8vw, 17px)',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    lineHeight: 1.4,
                    fontStyle: 'italic',
                  }}
                >
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: '20px',
                    color: 'var(--color-primary)',
                    fontWeight: 300,
                    flexShrink: 0,
                    transition: 'transform 200ms ease',
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                    display: 'inline-block',
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </button>

              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                style={{
                  overflow: 'hidden',
                  maxHeight: isOpen ? '200px' : '0',
                  transition: 'max-height 250ms ease',
                }}
              >
                <div
                  style={{
                    padding: '0 24px 20px 24px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <CheckCircle
                    size={18}
                    color="var(--color-primary)"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                    aria-hidden="true"
                  />
                  <p
                    style={{
                      fontSize: 'clamp(14px, 1.6vw, 16px)',
                      lineHeight: 1.7,
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
