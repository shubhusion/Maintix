'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { Ripple } from '@/components/ui/ripple';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden" aria-label="Call to action">
      <div className="absolute inset-0 bg-primary-950 dark:bg-[#09090b]" aria-hidden="true">
        <Ripple
          mainCircleSize={300}
          mainCircleOpacity={0.1}
          numCircles={6}
          className="opacity-30 dark:opacity-20"
        />
        <div className="noise absolute inset-0" />
      </div>

      <div className="relative z-10 py-28 md:py-40 text-center px-6">
        <BlurFade>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-white max-w-2xl mx-auto leading-tight font-display">
            Ready to bring order
            <br />
            to your maintenance?
          </h2>
        </BlurFade>

        <BlurFade delay={0.1}>
          <p className="mt-5 text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Join property managers who have streamlined their workflows with Maintix.
            Set up your first property in under 5 minutes.
          </p>
        </BlurFade>

        <BlurFade delay={0.15}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-400">
            {['Unlimited properties', 'All roles included', 'Free support', 'No contracts'].map(
              (item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-400" />
                  {item}
                </span>
              ),
            )}
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-neutral-900 transition-all duration-300 hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
