'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  ArrowRight,
  Building2,
  Users,
  Bell,
  BarChart3,
  Headphones,
  Zap,
  Shield,
  LifeBuoy,
  Workflow,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
  gradient: string;
  glowColor: string;
  borderColor: string;
  bgGradient: string;
  icon: React.ComponentType<{ className?: string }>;
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for small teams getting started with maintenance management.',
    features: [
      'Up to 2 properties',
      'Up to 10 users',
      'Basic notifications',
      'Community support',
      'Mobile app access',
    ],
    cta: 'Get Started',
    href: '/login',
    highlighted: false,
    gradient: 'from-slate-500 to-slate-600',
    bgGradient: 'from-slate-500/5 to-slate-500/10',
    glowColor: 'shadow-slate-500/20',
    borderColor: 'border-slate-500/30',
    icon: Building2,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing property managers who need advanced features.',
    features: [
      'Unlimited properties',
      'Unlimited users',
      'Priority support',
      'Advanced analytics',
      'AI-powered assignments',
      'Custom workflows',
      'Photo proof requirements',
    ],
    cta: 'Start Free Trial',
    href: '/login',
    highlighted: true,
    gradient: 'from-primary-500 to-primary-600',
    bgGradient: 'from-primary-500/5 to-primary-500/10',
    glowColor: 'shadow-primary-500/30',
    borderColor: 'border-primary-500/50',
    icon: Star,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale operations with custom requirements.',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'White-label options',
      'Advanced permissions',
      'Audit logs',
    ],
    cta: 'Contact Sales',
    href: 'mailto:sales@maintix.app',
    highlighted: false,
    gradient: 'from-amber-500 to-amber-600',
    bgGradient: 'from-amber-500/5 to-amber-500/10',
    glowColor: 'shadow-amber-500/20',
    borderColor: 'border-amber-500/30',
    icon: Shield,
  },
];

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  properties: Building2,
  users: Users,
  notifications: Bell,
  analytics: BarChart3,
  support: Headphones,
  ai: Zap,
  workflows: Workflow,
  integrations: LifeBuoy,
};

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section
      id="pricing"
      className="relative py-20 md:py-28 overflow-hidden"
      aria-label="Pricing"
    >
      {/* Background with radial glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Radial glows under each card position */}
      <div className="absolute top-1/2 left-[16%] w-72 h-72 bg-slate-500/8 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-[16%] w-72 h-72 bg-amber-500/8 rounded-full blur-[100px]" />
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.03]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <BlurFade>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                Pricing
              </span>
            </div>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
              Free to start.
              <br />
              <span className="bg-gradient-to-r from-primary-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Scale when you're ready
              </span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              No credit card required. Upgrade or downgrade anytime.
            </p>
          </BlurFade>

          {/* Billing Toggle */}
          <BlurFade delay={0.3}>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className={cn('text-sm font-medium', !annual ? 'text-foreground' : 'text-muted-foreground')}>
                Monthly
              </span>
              <motion.button
                onClick={() => setAnnual(!annual)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-14 h-7 rounded-full bg-muted border border-border transition-colors"
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-primary-500 shadow-lg"
                  animate={{ x: annual ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
              <span className={cn('text-sm font-medium', annual ? 'text-foreground' : 'text-muted-foreground')}>
                Annual
              </span>
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5">
                <span className="text-xs font-semibold text-emerald-500">Save 20%</span>
              </div>
            </div>
          </BlurFade>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {PRICING_TIERS.map((tier, i) => (
            <BlurFade
              key={tier.name}
              delay={i * 0.15}
              direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={cn(
                  'relative group rounded-2xl border p-6 transition-all duration-300 overflow-hidden',
                  'bg-gradient-to-b from-card to-card/80',
                  'hover:shadow-2xl',
                  tier.glowColor,
                  tier.borderColor,
                  tier.popular && 'md:-translate-y-2',
                )}
              >
                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div
                      className={cn(
                        'px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg',
                        'bg-gradient-to-r',
                        tier.gradient,
                      )}
                    >
                      <Star className="inline h-3 w-3 mr-1 -mt-0.5" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Colored glow on hover */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    tier.bgGradient,
                  )}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and name */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn(
                        'p-3 rounded-xl bg-gradient-to-br shadow-lg',
                        tier.gradient,
                      )}
                    >
                      <tier.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    {tier.popular && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-xs font-semibold">Best Value</span>
                      </div>
                    )}
                  </div>

                  {/* Tier name and description */}
                  <h3 className="text-xl font-bold text-foreground mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{tier.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold text-foreground font-display tracking-tight">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-sm text-muted-foreground">{tier.period}</span>
                      )}
                    </div>
                    {annual && tier.price !== '$0' && tier.price !== 'Custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 flex items-center gap-2"
                      >
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1">
                          <span className="text-xs font-semibold text-emerald-500">
                            ${(parseInt(tier.price.replace('$', '')) * 12 * 0.8).toFixed(0)}/year
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground line-through">
                          ${(parseInt(tier.price.replace('$', '')) * 12).toFixed(0)}/year
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((f, idx) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-2.5"
                      >
                        <div
                          className={cn(
                            'mt-0.5 p-0.5 rounded-full',
                            tier.popular
                              ? 'bg-primary-500/20 text-primary-500'
                              : 'bg-muted/50 text-muted-foreground',
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link
                    href={tier.href}
                    className={cn(
                      'group flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      tier.popular
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30'
                        : 'border border-border bg-background hover:bg-muted text-foreground',
                    )}
                  >
                    {tier.cta}
                    {tier.popular && (
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Link>
                </div>
              </motion.div>
            </BlurFade>
          ))}
        </div>

        {/* Feature Comparison */}
        <BlurFade delay={0.6}>
          <div className="mt-20">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Everything you need to manage properties
              </h3>
              <p className="text-muted-foreground">
                All plans include core features. Upgrade for advanced capabilities.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Building2,
                  title: 'Multi-Property',
                  desc: 'Manage unlimited properties',
                  color: 'text-blue-500',
                },
                {
                  icon: Users,
                  title: 'Role-Based Access',
                  desc: 'Manager, technician, tenant',
                  color: 'text-amber-500',
                },
                {
                  icon: Zap,
                  title: 'Real-Time Sync',
                  desc: 'Instant updates everywhere',
                  color: 'text-primary-500',
                },
                {
                  icon: Shield,
                  title: 'Enterprise Security',
                  desc: 'SOC 2 compliant',
                  color: 'text-emerald-500',
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-muted/30 border border-border/50"
                >
                  <div className={cn('p-3 rounded-full bg-muted/50 mb-3', feature.color)}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Bottom CTA */}
        <BlurFade delay={0.8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center">
              <p className="text-muted-foreground mb-4">
                Still have questions?
              </p>
              <motion.a
                href="mailto:sales@maintix.app"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-muted"
              >
                Talk to our team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </div>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
}
