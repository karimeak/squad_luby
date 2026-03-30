'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        backgroundColor: '#111111',
        color: '#aaaaaa',
        padding: 'clamp(40px, 6vw, 80px) clamp(16px, 5vw, 80px)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-content)',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Brand column */}
          <div>
            <a
              href="https://luby.co"
              aria-label="Luby Software homepage"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}
            >
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Luby</span>
              <span style={{ fontSize: '18px', fontWeight: 400, color: '#aaaaaa' }}>Software</span>
            </a>
            <p style={{ fontSize: '13px', lineHeight: 1.7, maxWidth: '260px' }}>
              300+ engineers. 1,300+ projects. 23 years building software for companies that can&apos;t afford to ship slow.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Services
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Staff Augmentation',
                'Dedicated Teams',
                'Software Development',
                'Digital Transformation',
              ].map((service) => (
                <li key={service}>
                  <a
                    href="https://luby.co"
                    style={{ fontSize: '13px', color: '#aaaaaa', textDecoration: 'none', transition: 'color 150ms ease' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#aaaaaa')}
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Sectors
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Healthcare', 'Fintech', 'Enterprise SaaS', 'Education', 'IoT'].map((sector) => (
                <li key={sector}>
                  <span style={{ fontSize: '13px', color: '#aaaaaa' }}>{sector}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Addresses */}
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Operations
            </h3>
            <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>Brazil HQ</p>
                <p style={{ fontSize: '13px', lineHeight: 1.6 }}>São Paulo, SP</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>US Operations</p>
                <p style={{ fontSize: '13px', lineHeight: 1.6 }}>Miami, FL</p>
              </div>
            </address>
            <div style={{ marginTop: '20px' }}>
              <a
                href="https://www.linkedin.com/company/luby-software/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Luby Software on LinkedIn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: '#aaaaaa',
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#aaaaaa')}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '12px', color: '#666666' }}>
            &copy; {currentYear} Luby Software. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service'].map((link) => (
              <a
                key={link}
                href="https://luby.co"
                style={{ fontSize: '12px', color: '#666666', textDecoration: 'none', transition: 'color 150ms ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#aaaaaa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
