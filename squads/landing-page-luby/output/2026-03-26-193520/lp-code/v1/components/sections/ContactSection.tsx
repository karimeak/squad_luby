'use client';

import React, { useState, FormEvent } from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const PHONE_PREFIXES = [
  { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', label: 'US' },
  { code: '+55', flag: '\u{1F1E7}\u{1F1F7}', label: 'BR' },
  { code: '+44', flag: '\u{1F1EC}\u{1F1E7}', label: 'UK' },
  { code: '+49', flag: '\u{1F1E9}\u{1F1EA}', label: 'DE' },
  { code: '+33', flag: '\u{1F1EB}\u{1F1F7}', label: 'FR' },
  { code: '+351', flag: '\u{1F1F5}\u{1F1F9}', label: 'PT' },
  { code: '+54', flag: '\u{1F1E6}\u{1F1F7}', label: 'AR' },
  { code: '+52', flag: '\u{1F1F2}\u{1F1FD}', label: 'MX' },
  { code: '+56', flag: '\u{1F1E8}\u{1F1F1}', label: 'CL' },
  { code: '+57', flag: '\u{1F1E8}\u{1F1F4}', label: 'CO' },
  { code: '+34', flag: '\u{1F1EA}\u{1F1F8}', label: 'ES' },
  { code: '+39', flag: '\u{1F1EE}\u{1F1F9}', label: 'IT' },
  { code: '+61', flag: '\u{1F1E6}\u{1F1FA}', label: 'AU' },
  { code: '+91', flag: '\u{1F1EE}\u{1F1F3}', label: 'IN' },
  { code: '+81', flag: '\u{1F1EF}\u{1F1F5}', label: 'JP' },
];

// Change this to '+55' for PT-BR landing pages
const DEFAULT_PREFIX = '+1';

export default function ContactSection() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [phonePrefix, setPhonePrefix] = useState(DEFAULT_PREFIX);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    role: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');

    try {
      const payload = {
        ...formData,
        phone: formData.phone ? `${phonePrefix}${formData.phone.replace(/\D/g, '')}` : '',
      };

      const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
      if (!endpoint) {
        // Fallback: log and simulate success in dev
        console.log('Form submitted (no endpoint configured):', payload);
        await new Promise((r) => setTimeout(r, 800));
        setFormState('success');
        return;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    lineHeight: 1.5,
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-bg)',
    border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-text)',
    marginBottom: '6px',
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      style={{
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--section-padding)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-content)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'start',
        }}
      >
        {/* Left: copy */}
        <div>
          <SectionLabel>Get Started</SectionLabel>

          {/* H2 — SEO otimizado */}
          <h2
            id="contact-heading"
            style={{
              fontSize: 'var(--text-h2)',
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
              marginBottom: '20px',
              maxWidth: '480px',
            }}
          >
            Get Your First Nearshore Engineer in Production in 14 Days
          </h2>

          {/* Final copy — copy exato */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
            <p
              style={{
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 700,
                lineHeight: 1.4,
                color: 'var(--color-text)',
              }}
            >
              Your next sprint doesn&apos;t have to wait for the right hire.
            </p>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
              }}
            >
              Get your first Luby engineer in production in 14 days.
            </p>

            <p
              style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.7,
                color: 'var(--color-text-secondary)',
              }}
            >
              Schedule a 30-minute technical call. Tell us what you&apos;re building. We&apos;ll show you exactly who we&apos;d match — and why.
            </p>
          </div>

          {/* Trust signals */}
          <div
            style={{
              marginTop: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {[
              'No long-term contract required.',
              'Response within 24 hours.',
              'US operations. Legal-ready contracts.',
              '300+ engineers · 1,300+ projects · 23 years.',
            ].map((line) => (
              <p
                key={line}
                style={{
                  fontSize: 'var(--text-caption)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div
          style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--card-radius)',
            padding: 'clamp(24px, 4vw, 40px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          {formState === 'success' ? (
            <div
              role="status"
              aria-live="polite"
              style={{ textAlign: 'center', padding: '32px 0' }}
            >
              <p
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '12px',
                }}
              >
                We&apos;re on it.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                You&apos;ll hear from us within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Schedule a technical call with Luby"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Field 1: Name */}
                <div>
                  <label htmlFor="name" style={labelStyle}>
                    Full name <span aria-hidden="true" style={{ color: 'var(--color-primary)' }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,184,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Field 2: Company */}
                <div>
                  <label htmlFor="company" style={labelStyle}>
                    Company <span aria-hidden="true" style={{ color: 'var(--color-primary)' }}>*</span>
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="Acme Inc."
                    value={formData.company}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,184,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Field 3: Email */}
                <div>
                  <label htmlFor="email" style={labelStyle}>
                    Work email <span aria-hidden="true" style={{ color: 'var(--color-primary)' }}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jane@acme.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,184,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Field 4: Phone */}
                <div>
                  <label htmlFor="phone" style={labelStyle}>
                    Phone <span aria-hidden="true" style={{ color: 'var(--color-primary)' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      aria-label="Phone country prefix"
                      value={phonePrefix}
                      onChange={(e) => setPhonePrefix(e.target.value)}
                      style={{
                        ...inputStyle,
                        width: '100px',
                        flexShrink: 0,
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%23666' stroke-width='1.5'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        paddingRight: '24px',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,184,0,0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {PHONE_PREFIXES.map((p) => (
                        <option key={p.code} value={p.code}>
                          {p.flag} {p.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel-national"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ ...inputStyle, flex: 1 }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-primary)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,184,0,0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Field 5: Role */}
                <div>
                  <label htmlFor="role" style={labelStyle}>
                    Your role
                  </label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    autoComplete="organization-title"
                    placeholder="VP of Engineering"
                    value={formData.role}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,184,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Field 6: Message */}
                <div>
                  <label htmlFor="message" style={labelStyle}>
                    What are you building?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your stack, team size, and what you need."
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      minHeight: '100px',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(122,184,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={formState === 'submitting'}
                  style={{ width: '100%', justifyContent: 'center', opacity: formState === 'submitting' ? 0.7 : 1 }}
                >
                  {formState === 'submitting' ? 'Sending…' : 'Schedule a Technical Call'}
                </Button>

                {/* Error state */}
                {formState === 'error' && (
                  <p
                    role="alert"
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: '#cc0000',
                      textAlign: 'center',
                    }}
                  >
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                {/* Microcopy */}
                <p
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--color-text-secondary)',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}
                >
                  No spam. No sales pressure. We&apos;ll come prepared with engineer profiles matched to your stack.
                </p>

                {/* Not ready CTA */}
                <p style={{ textAlign: 'center' }}>
                  <a
                    href="https://luby.co"
                    style={{
                      fontSize: 'var(--text-caption)',
                      color: 'var(--color-text-secondary)',
                      textDecoration: 'underline',
                    }}
                  >
                    Not ready to commit? See a project case study →
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
