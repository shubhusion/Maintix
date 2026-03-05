'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';
import { ShineBorder } from '@/components/ui/shine-border';
import { PRICING_TIERS } from './constants';

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 border-y border-border/50 bg-muted/30" aria-label="Pricing">
      <div className="mx-auto max-w-5xl px-6">
        <BlurFade>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3 text-center">
            Pricing
          </p>
          <h2 className="text-center text-3xl md:text-[2.75rem] font-extrabold tracking-[-0.03em] text-foreground font-display">
            Free to start. Scale when ready.
          </h2>
          <p className="mt-3 text-center text-foreground/70 dark:text-muted-foreground max-w-lg mx-auto">
            No credit card required. Upgrade or downgrade anytime.
          </p>
        </BlurFade>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => (
            <BlurFade
              key={tier.name}
              delay={i * 0.08}
              direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
            >
              <div
                className={cn(
                  'relative rounded-2xl border p-7 transition-all duration-500 h-full flex flex-col',
                  tier.highlighted
                    ? 'border-primary-500/30 bg-card/70 shadow-lg shadow-primary-500/[0.05] md:-translate-y-2'
                    : 'border-border/50 bg-card/50 hover:bg-card/80 hover:shadow-lg',
                )}
              >
                {tier.highlighted && (
                  <ShineBorder
                    shineColor={['#6366f1', '#34d399']}
                    borderWidth={1}
                    duration={12}
                  />
                )}
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                    Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{tier.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-foreground font-display tracking-tight">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="h-4 w-4 shrink-0 text-primary-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={cn(
                    'block text-center rounded-xl py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    tier.highlighted
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:shadow-primary-500/20 dark:from-white dark:to-neutral-100 dark:text-neutral-900'
                      : 'border border-border bg-card hover:bg-muted text-foreground',
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
