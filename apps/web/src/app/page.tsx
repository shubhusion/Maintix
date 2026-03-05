'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import {
  Navbar,
  HeroSection,
  StatsSection,
  FeaturesSection,
  HowItWorksSection,
  RolesSection,
  PricingSection,
  CtaSection,
  Footer,
} from './_components';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 900], [1, 0]);

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      const close = () => setMobileMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true });
      return () => window.removeEventListener('scroll', close);
    }
  }, [mobileMenuOpen]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar
          scrolled={scrolled}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main id="main">
          <HeroSection heroY={heroY} heroOpacity={heroOpacity} />
          <StatsSection />
          <FeaturesSection />
          <HowItWorksSection />
          <RolesSection />
          <PricingSection />
          <CtaSection />
        </main>

        <Footer />
      </div>
    </>
  );
}
