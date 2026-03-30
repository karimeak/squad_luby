import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ProblemSection from '@/components/sections/ProblemSection';
import SolutionSection from '@/components/sections/SolutionSection';
import SocialProofSection from '@/components/sections/SocialProofSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import ObjectionSection from '@/components/sections/ObjectionSection';
import ContactSection from '@/components/sections/ContactSection';

// All section components are Server Components by default.
// Exceptions that use 'use client':
//   - Navbar (scroll state + mobile menu toggle)
//   - FaqSection (accordion open/close state)
//   - ContactSection (form state + fetch)

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Problem Statement */}
        <ProblemSection />

        {/* 3. Solution — Engineering Fit 3-Layer */}
        <SolutionSection />

        {/* 4. Social Proof */}
        <SocialProofSection />

        {/* 5. Operational Benefits */}
        <BenefitsSection />

        {/* 6. Objection + FAQ accordion */}
        <ObjectionSection />

        {/* 7. Contact / CTA Final */}
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
