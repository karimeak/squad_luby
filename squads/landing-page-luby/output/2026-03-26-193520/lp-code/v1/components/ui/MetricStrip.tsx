import React from 'react';

const metrics = [
  { value: '300+', label: 'engineers' },
  { value: '1,300+', label: 'projects delivered' },
  { value: '23 years', label: 'of experience' },
  { value: 'US', label: 'operations' },
];

interface MetricStripProps {
  style?: React.CSSProperties;
}

export default function MetricStrip({ style }: MetricStripProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0',
        ...style,
      }}
      role="list"
      aria-label="Luby key metrics"
    >
      {metrics.map((metric, index) => (
        <React.Fragment key={metric.value}>
          <div
            role="listitem"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 20px',
            }}
          >
            <span
              style={{
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 700,
                color: 'var(--color-text)',
                lineHeight: 1.2,
              }}
            >
              {metric.value}
            </span>
            <span
              style={{
                fontSize: 'var(--text-caption)',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginTop: '2px',
              }}
            >
              {metric.label}
            </span>
          </div>
          {index < metrics.length - 1 && (
            <span
              aria-hidden="true"
              style={{
                color: 'var(--color-border)',
                fontSize: '20px',
                fontWeight: 300,
                userSelect: 'none',
                padding: '0 4px',
              }}
            >
              |
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
