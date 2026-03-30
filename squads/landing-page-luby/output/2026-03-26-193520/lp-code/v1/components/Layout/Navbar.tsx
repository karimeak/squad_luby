'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How It Works', href: '#solution' },
    { label: 'Results', href: '#proof' },
    { label: 'FAQ', href: '#objection' },
  ];

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : 'var(--color-bg)',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-content)',
          margin: '0 auto',
          padding: '0 clamp(16px, 5vw, 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <a
          href="https://luby.co"
          aria-label="Luby Software — go to homepage"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <span
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '-0.03em',
            }}
          >
            Luby
          </span>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 400,
              color: 'var(--color-text-secondary)',
              letterSpacing: '-0.03em',
            }}
          >
            Software
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          <ul
            style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'center',
              listStyle: 'none',
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    transition: 'color var(--transition-fast)',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--color-text)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--color-text-secondary)')
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button href="#contact" variant="primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
            Schedule a Technical Call
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            padding: '8px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
          className="hamburger"
        >
          <span
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--color-text)',
              borderRadius: '2px',
              transition: 'transform 200ms ease, opacity 200ms ease',
              transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
              display: 'block',
            }}
          />
          <span
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--color-text)',
              borderRadius: '2px',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 200ms ease',
              display: 'block',
            }}
          />
          <span
            style={{
              width: '22px',
              height: '2px',
              backgroundColor: 'var(--color-text)',
              borderRadius: '2px',
              transition: 'transform 200ms ease',
              transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
              display: 'block',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderTop: '1px solid var(--color-border)',
            padding: '16px clamp(16px, 5vw, 80px) 24px',
          }}
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 0',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    borderBottom: '1px solid var(--color-border)',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li style={{ marginTop: '16px' }}>
              <Button
                href="#contact"
                variant="primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setMenuOpen(false)}
              >
                Schedule a Technical Call
              </Button>
            </li>
          </ul>
        </nav>
      )}

      <style>{`
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 768px) {
          .hamburger { display: none !important; }
        }
      `}</style>
    </header>
  );
}
