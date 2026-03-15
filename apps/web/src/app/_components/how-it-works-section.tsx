'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import {
  FileText,
  UserCheck,
  Wrench,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  MessageSquare,
  Image,
  CheckCircle2,
  Users,
  TrendingUp,
} from 'lucide-react';
import { BlurFade } from '@/components/ui/blur-fade';
import { cn } from '@/lib/utils';

interface Step {
  step: string;
  title: string;
  desc: string;
  benefit: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  gradient: string;
  bgGradient: string;
  glowColor: string;
  textColor: string;
  ringColor: string;
}

export function HowItWorksSection() {
  const { scrollYProgress } = useScroll();
  
  const steps: Step[] = [
    {
      step: '01',
      title: 'Submit',
      desc: 'Tenants report issues in 30 seconds with photos, priority tagging, and voice notes — reducing back-and-forth by 80%.',
      benefit: '30-second submission',
      icon: FileText,
      accentColor: 'text-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/5 to-blue-500/10',
      glowColor: 'shadow-blue-500/20',
      textColor: 'text-blue-500',
      ringColor: 'ring-blue-500/20',
    },
    {
      step: '02',
      title: 'Assign',
      desc: 'AI suggests the best technician based on skills, availability, and location. One click to dispatch with full context.',
      benefit: 'AI-powered matching',
      icon: UserCheck,
      accentColor: 'text-amber-500',
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-500/5 to-amber-500/10',
      glowColor: 'shadow-amber-500/20',
      textColor: 'text-amber-500',
      ringColor: 'ring-amber-500/20',
    },
    {
      step: '03',
      title: 'Resolve',
      desc: 'Technicians complete work with photo proof. Auto-approval after 24hrs. Tenants rate the service instantly.',
      benefit: '98% first-time fix',
      icon: Wrench,
      accentColor: 'text-emerald-500',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/5 to-emerald-500/10',
      glowColor: 'shadow-emerald-500/20',
      textColor: 'text-emerald-500',
      ringColor: 'ring-emerald-500/20',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-20 md:py-28 overflow-hidden"
      aria-label="How it works"
    >
      {/* Background with radial glows under cards */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Radial glows under each card position */}
      <div className="absolute top-1/2 left-[16%] w-72 h-72 bg-blue-500/8 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/8 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-[16%] w-72 h-72 bg-emerald-500/8 rounded-full blur-[100px]" />
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.03]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header with CTAs */}
        <div className="text-center mb-16">
          <BlurFade>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                How It Works
              </span>
            </div>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
              Fix maintenance requests
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-primary-500 to-emerald-500 bg-clip-text text-transparent">
                5× faster than before
              </span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              From complaint to resolution in minutes — not days.
            </p>
          </BlurFade>
          {/* Primary CTA */}
          <BlurFade delay={0.3}>
            <div className="mt-6">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/30"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </BlurFade>
        </div>

        {/* Steps with connection line */}
        <div className="relative mt-20">
          {/* Animated connection line - desktop */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%]">
            {/* Background track */}
            <div className="h-1 rounded-full bg-muted border border-border/50" />
            
            {/* Animated progress line with gradient */}
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              viewport={{ once: true }}
            />
            
            {/* Animated glow traveling along line */}
            <motion.div
              className="absolute top-0 h-full w-32 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '1000%', opacity: 1 }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
            />
            
            {/* Step nodes positioned on the line */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[16%] -translate-x-1/2 flex items-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20">
                  <span className="text-lg font-extrabold text-white">01</span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <ArrowRight className="h-5 w-5 text-blue-500 ml-2 -mr-1" />
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20">
                  <span className="text-lg font-extrabold text-white">02</span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-amber-500"
                  animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
              <ArrowRight className="h-5 w-5 text-amber-500 ml-2 -mr-1" />
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 right-[16%] translate-x-1/2 flex items-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {steps.map(
              (
                { step, title, desc, benefit, icon: Icon, gradient, bgGradient, glowColor, textColor, ringColor },
                i,
              ) => (
                <BlurFade
                  key={step}
                  delay={i * 0.15}
                  direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="relative group"
                  >
                    <div
                      className={cn(
                        'relative rounded-2xl border p-6 transition-all duration-300 overflow-hidden',
                        'bg-gradient-to-b from-card to-card/80',
                        'hover:shadow-2xl',
                        glowColor,
                        i === 0 && 'border-blue-500/40 hover:border-blue-500/60',
                        i === 1 && 'border-amber-500/40 hover:border-amber-500/60',
                        i === 2 && 'border-emerald-500/40 hover:border-emerald-500/60',
                      )}
                    >
                      {/* Colored glow on hover */}
                      <div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                          bgGradient,
                        )}
                      />
                      
                      {/* Corner step badge */}
                      <div className="absolute top-4 right-4">
                        <div
                          className={cn(
                            'px-2.5 py-1 rounded-full text-xs font-bold text-white',
                            'bg-gradient-to-r',
                            gradient,
                          )}
                        >
                          Step {step}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon and benefit badge */}
                        <div className="flex items-center justify-between mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={cn(
                              'p-3 rounded-xl bg-gradient-to-br shadow-lg',
                              gradient,
                            )}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </motion.div>
                          <div
                            className={cn(
                              'px-3 py-1.5 rounded-full text-xs font-semibold border',
                              bgGradient,
                              textColor,
                              ringColor,
                              'border-current',
                            )}
                          >
                            {benefit}
                          </div>
                        </div>

                        {/* Title and description */}
                        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{desc}</p>

                        {/* Real UI Preview */}
                        <div
                          className={cn(
                            'rounded-xl border bg-background overflow-hidden',
                            i === 0 && 'border-blue-500/30',
                            i === 1 && 'border-amber-500/30',
                            i === 2 && 'border-emerald-500/30',
                          )}
                        >
                          {i === 0 && (
                            <div className="p-4 space-y-3">
                              {/* Real ticket form */}
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Issue Description
                                </label>
                                <div className="rounded-lg border border-border bg-muted/30 p-2.5">
                                  <p className="text-sm text-foreground">
                                    <MessageSquare className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5 text-muted-foreground" />
                                    AC not cooling, making weird noise
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Category
                                  </label>
                                  <div className="rounded-lg border border-border bg-muted/30 p-2">
                                    <p className="text-xs text-foreground">HVAC</p>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-medium text-muted-foreground">
                                    Priority
                                  </label>
                                  <div className="rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-2 flex items-center gap-1.5">
                                    <Zap className="h-3 w-3 text-red-500" />
                                    <p className="text-xs font-medium text-red-600 dark:text-red-400">High</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Photos
                                </label>
                                <div className="flex gap-2">
                                  {[1, 2].map((n) => (
                                    <div
                                      key={n}
                                      className="w-16 h-16 rounded-lg border border-border bg-muted/30 flex items-center justify-center"
                                    >
                                      <Image className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {i === 1 && (
                            <div className="p-4 space-y-3">
                              {/* Real assignment UI */}
                              <div className="rounded-lg border border-border bg-muted/30 p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="text-xs font-mono text-muted-foreground">TK-2847</p>
                                    <p className="text-sm font-medium text-foreground">Broken AC — Unit 4B</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-red-500">
                                    <Zap className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">High</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>2 hours ago</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Assign to
                                </label>
                                <div className="rounded-lg border border-primary-500/30 bg-primary-50 dark:bg-primary-900/10 p-2.5 flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white">
                                    JD
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">John Doe</p>
                                    <p className="text-xs text-muted-foreground">HVAC Specialist · 3 active jobs</p>
                                  </div>
                                  <CheckCircle2 className="h-5 w-5 text-primary-500" />
                                </div>
                              </div>
                            </div>
                          )}

                          {i === 2 && (
                            <div className="p-4 space-y-3">
                              {/* Real completion UI */}
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30">
                                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    Work Completed
                                  </p>
                                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                    Ready for manager approval
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Completion Notes
                                </label>
                                <div className="rounded-lg border border-border bg-muted/30 p-2.5">
                                  <p className="text-sm text-foreground">
                                    Replaced faulty capacitor. Unit now cooling properly.
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {[1, 2, 3].map((n) => (
                                  <div
                                    key={n}
                                    className="w-14 h-14 rounded-lg border border-border bg-muted/30 flex items-center justify-center"
                                  >
                                    <Image className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </BlurFade>
              ),
            )}
          </div>
        </div>

        {/* Stats bar */}
        <BlurFade delay={0.6}>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                value: '5×',
                label: 'Faster resolution times',
                color: 'text-blue-500',
              },
              {
                icon: Users,
                value: '98%',
                label: 'Tenant satisfaction rate',
                color: 'text-amber-500',
              },
              {
                icon: CheckCircle2,
                value: '80%',
                label: 'Less back-and-forth',
                color: 'text-emerald-500',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50"
              >
                <div className={cn('p-2 rounded-lg bg-muted/50', stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </BlurFade>

        {/* Bottom CTA */}
        <BlurFade delay={0.7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center">
              <p className="text-muted-foreground mb-4">
                Ready to transform your maintenance workflow?
              </p>
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Start Your Free Trial
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </motion.a>
              <p className="text-xs text-muted-foreground mt-3">
                No credit card required · Free forever to start
              </p>
            </div>
          </motion.div>
        </BlurFade>
      </div>
    </section>
  );
}
