'use client';

import Link from 'next/link';
import { motion, type MotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { WordRotate } from '@/components/ui/word-rotate';
import { DotPattern } from '@/components/ui/dot-pattern';
import { Marquee } from '@/components/ui/marquee';
import { DashboardMockup } from './dashboard-mockup';
import { TRUST_ITEMS } from './constants';

export function HeroSection({
  heroY,
  heroOpacity,
}: {
  heroY: MotionValue<number>;
  heroOpacity: MotionValue<number>;
}) {
  return (
    <section className="relative min-h-screen flex flex-col" aria-label="Hero">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white dark:from-[#09090b] dark:via-[#09090b] dark:to-[#09090b]"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary-400/10 dark:bg-primary-600/15 blur-[150px] animate-glow-pulse will-change-transform" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-primary-300/10 dark:bg-primary-500/10 blur-[120px] animate-glow-pulse [animation-delay:2s] will-change-transform" />

        <DotPattern
          width={32}
          height={32}
          cr={1}
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.12] text-primary-500/50 [mask-image:radial-gradient(600px_circle_at_50%_40%,white,transparent)]"
        />

        <div className="noise absolute inset-0 opacity-30 dark:opacity-100" />
      </div>

      {/* Hero content */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-8"
      >
        <BlurFade delay={0} direction="down">
          <div className="group mb-6 inline-flex items-center rounded-full border border-border/30 bg-card/60 dark:border-white/[0.08] dark:bg-white/[0.04] px-4 py-1.5 backdrop-blur-md">
            <AnimatedShinyText className="text-xs font-medium">
              ✨ Now in public beta — Try it free
            </AnimatedShinyText>
          </div>
        </BlurFade>

        <BlurFade delay={0.1} direction="down">
          <h1 className="text-center text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.035em] text-foreground dark:text-white leading-[1.05] max-w-4xl font-display">
            Property maintenance,
            <br />
            <WordRotate
              words={['finally organized', 'fully automated', 'beautifully simple']}
              duration={3000}
              className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 dark:from-primary-300 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent"
              motionProps={{
                initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
                animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
                exit: { opacity: 0, y: -20, filter: 'blur(4px)' },
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
            />
          </h1>
        </BlurFade>

        <BlurFade delay={0.2} direction="down">
          <p className="mt-5 text-center text-base md:text-lg text-foreground/70 dark:text-neutral-400 max-w-xl leading-relaxed">
            Resolve tickets 3× faster with role-based workflows that keep managers, technicians, and
            tenants in sync.
          </p>
        </BlurFade>

        <BlurFade delay={0.3} direction="down">
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/login"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 dark:from-white dark:to-neutral-100 px-8 py-4 text-base font-semibold text-white dark:text-neutral-900 overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <span className="relative z-10">Start Free</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground dark:text-white/60 dark:hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
              >
                Explore Features
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              No credit card required · Free forever to start
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.4} direction="down" className="mt-12 w-full max-w-2xl">
          <Marquee pauseOnHover className="[--duration:25s] [--gap:2rem]">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-widest whitespace-nowrap"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </Marquee>
        </BlurFade>
      </motion.div>

      {/* Dashboard mockup */}
      <div className="relative z-10 px-6 pb-4">
        <BlurFade delay={0.5} offset={40}>
          <DashboardMockup />
        </BlurFade>
      </div>

      {/* Bottom gradient blend */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10"
        aria-hidden="true"
      />
    </section>
  );
}
