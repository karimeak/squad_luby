import React from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function SectionLabel({ children, style }: SectionLabelProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 'var(--text-label)',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-primary)',
        marginBottom: '12px',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
