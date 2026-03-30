import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
}

const styles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 28px',
    backgroundColor: 'var(--color-primary)',
    color: '#ffffff',
    fontWeight: 'var(--weight-semibold)' as unknown as number,
    fontSize: '15px',
    lineHeight: 1,
    borderRadius: '8px',
    border: '2px solid var(--color-primary)',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  secondary: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 28px',
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    fontWeight: 600,
    fontSize: '15px',
    lineHeight: 1,
    borderRadius: '8px',
    border: '2px solid var(--color-primary)',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast), color var(--transition-fast)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  ghost: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 4px',
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
    fontWeight: 600,
    fontSize: '15px',
    lineHeight: 1,
    borderRadius: '0',
    border: 'none',
    borderBottom: '1px solid currentColor',
    cursor: 'pointer',
    transition: 'color var(--transition-fast)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
};

export default function Button({
  variant = 'primary',
  href,
  children,
  style,
  ...rest
}: ButtonProps) {
  const baseStyle = { ...styles[variant], ...style };

  if (href) {
    return (
      <a href={href} style={baseStyle}>
        {children}
      </a>
    );
  }

  return (
    <button style={baseStyle} {...rest}>
      {children}
    </button>
  );
}
