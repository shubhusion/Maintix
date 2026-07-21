'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ClipboardList,
  Wrench,
  Shield,
  Building2,
  Bell,
  Check,
  BarChart3,
  Smartphone,
  Puzzle,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';
import { DashboardPreviewModal } from './dashboard-preview-modal';
import { WORKFLOW_STAGES } from './constants';

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glowColor: string;
  borderColor: string;
  bgGradient: string;
  accentColor: string;
  stat?: string;
  statIcon?: React.ComponentType<{ className?: string }>;
  uiPreview?: React.ReactNode;
  span?: string;
  popular?: boolean;
}

const FEATURES: Feature[] = [
  {
    title: 'Unified Ticket Dashboard',
    description:
      'Every property, every ticket, every status — visible at a glance. Filter by property, priority, status, or assignee.',
    icon: ClipboardList,
    gradient: 'from-primary-500 to-primary-600',
    glowColor: 'shadow-primary-500/30',
    borderColor: 'border-primary-500/40 hover:border-primary-500/60',
    bgGradient: 'from-primary-500/5 to-primary-500/10',
    accentColor: 'text-primary-500',
    stat: 'Interactive Demo',
    statIcon: Zap,
    span: 'lg:col-span-2',
    popular: true,
    uiPreview: (
      <div className="space-y-2">
        {[
          {
            label: 'Broken AC — Unit 4B',
            tag: 'High',
            tagColor: 'text-red-500',
            bgColor: 'bg-red-500/10',
          },
          {
            label: 'Leaking faucet — Kitchen',
            tag: 'Medium',
            tagColor: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
          },
          {
            label: 'Replace hallway lights',
            tag: 'Low',
            tagColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
          },
        ].map((t) => (
          <div
            key={t.label}
            className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-3 py-2"
          >
            <span className="text-xs text-muted-foreground">{t.label}</span>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${t.bgColor} ${t.tagColor}`}
            >
              {t.tag}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: '6-Stage Workflow',
    description:
      'Our validated pipeline ensures nothing falls through the cracks from creation to closure.',
    icon: Wrench,
    gradient: 'from-amber-500 to-amber-600',
    glowColor: 'shadow-amber-500/30',
    borderColor: 'border-amber-500/40 hover:border-amber-500/60',
    bgGradient: 'from-amber-500/5 to-amber-500/10',
    accentColor: 'text-amber-500',
    stat: 'Core Feature',
    statIcon: TrendingUp,
    span: 'lg:col-span-2',
    uiPreview: (
      <div className="flex items-center gap-0.5 overflow-x-auto pb-2">
        {WORKFLOW_STAGES.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 transition-all duration-300',
                  i <= 2
                    ? 'border-amber-500 bg-amber-500 text-white scale-110'
                    : 'border-border bg-muted text-muted-foreground',
                )}
              >
                {i <= 2 ? <Check className="h-2.5 w-2.5" /> : i + 1}
              </div>
            </div>
            {i < WORKFLOW_STAGES.length - 1 && (
              <div className={cn('h-px w-3 mx-0.5', i < 2 ? 'bg-amber-500' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Role-Based Access',
    description: 'Managers see everything. Technicians see assignments. Tenants see their tickets.',
    icon: Shield,
    gradient: 'from-emerald-500 to-emerald-600',
    glowColor: 'shadow-emerald-500/30',
    borderColor: 'border-emerald-500/40 hover:border-emerald-500/60',
    bgGradient: 'from-emerald-500/5 to-emerald-500/10',
    accentColor: 'text-emerald-500',
    stat: 'Secure by default',
    statIcon: Shield,
    span: 'lg:col-span-2',
    uiPreview: (
      <div className="space-y-1.5">
        {['Manager', 'Technician', 'Tenant'].map((role, i) => (
          <div
            key={role}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs',
              i === 0 ? 'bg-emerald-500/10 text-emerald-500 font-medium' : 'text-muted-foreground',
            )}
          >
            <Check className="h-3 w-3" />
            {role}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Multi-Property',
    description:
      'Manage unlimited properties with isolated data. Switch context instantly between buildings.',
    icon: Building2,
    gradient: 'from-sky-500 to-sky-600',
    glowColor: 'shadow-sky-500/30',
    borderColor: 'border-sky-500/40 hover:border-sky-500/60',
    bgGradient: 'from-sky-500/5 to-sky-500/10',
    accentColor: 'text-sky-500',
    stat: 'Unlimited properties',
    statIcon: Building2,
    span: 'lg:col-span-2',
    uiPreview: (
      <div className="space-y-1.5">
        {['Sunset Apartments', 'Oak Manor', 'River View'].map((p, i) => (
          <div
            key={p}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
              i === 0 ? 'bg-sky-500/10 text-sky-500 font-medium' : 'text-muted-foreground',
            )}
          >
            <Building2 className="h-3 w-3" />
            {p}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Smart Notifications',
    description:
      'In-app alerts for assignments, status changes, and completions. Never miss an update.',
    icon: Bell,
    gradient: 'from-violet-500 to-violet-600',
    glowColor: 'shadow-violet-500/30',
    borderColor: 'border-violet-500/40 hover:border-violet-500/60',
    bgGradient: 'from-violet-500/5 to-violet-500/10',
    accentColor: 'text-violet-500',
    stat: 'Real-time alerts',
    statIcon: Bell,
    span: 'lg:col-span-2',
    uiPreview: (
      <div className="space-y-1.5">
        {[
          { icon: '🔧', text: 'Ticket assigned', time: '2m ago' },
          { icon: '✅', text: 'Work completed', time: '15m ago' },
          { icon: '🆕', text: 'New ticket', time: '5m ago' },
        ].map((n, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 px-2.5 py-1.5">
            <span className="text-xs">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground truncate">{n.text}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">{n.time}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Analytics & Reporting',
    description:
      'Track response times, completion rates, and technician performance with detailed reports.',
    icon: BarChart3,
    gradient: 'from-rose-500 to-rose-600',
    glowColor: 'shadow-rose-500/30',
    borderColor: 'border-rose-500/40 hover:border-rose-500/60',
    bgGradient: 'from-rose-500/5 to-rose-500/10',
    accentColor: 'text-rose-500',
    stat: 'Data-driven insights',
    statIcon: TrendingUp,
    span: 'lg:col-span-2',
    uiPreview: (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Avg. Response</span>
          <span className="text-xs font-semibold text-emerald-500">2.4hr</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Completion Rate</span>
          <span className="text-xs font-semibold text-rose-500">98%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-rose-500 to-rose-400" />
        </div>
      </div>
    ),
  },
  {
    title: 'Mobile-First',
    description:
      'Native mobile experience for technicians on the go. Works offline, syncs when connected.',
    icon: Smartphone,
    gradient: 'from-cyan-500 to-cyan-600',
    glowColor: 'shadow-cyan-500/30',
    borderColor: 'border-cyan-500/40 hover:border-cyan-500/60',
    bgGradient: 'from-cyan-500/5 to-cyan-500/10',
    accentColor: 'text-cyan-500',
    stat: 'iOS & Android',
    statIcon: Smartphone,
    span: 'lg:col-span-2',
    uiPreview: (
      <div className="flex items-center justify-center">
        <div className="relative w-16 h-24 rounded-xl border-2 border-border bg-background overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-3 bg-border/30" />
          <div className="p-1.5 space-y-1 mt-4">
            <div className="h-1 rounded-full bg-cyan-500/30" />
            <div className="h-1 rounded-full bg-cyan-500/20 w-2/3" />
            <div className="h-4 rounded-lg bg-cyan-500/10 mt-1.5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Integrations',
    description: 'Connect with your existing tools. Slack, email, accounting software, and more.',
    icon: Puzzle,
    gradient: 'from-indigo-500 to-indigo-600',
    glowColor: 'shadow-indigo-500/30',
    borderColor: 'border-indigo-500/40 hover:border-indigo-500/60',
    bgGradient: 'from-indigo-500/5 to-indigo-500/10',
    accentColor: 'text-indigo-500',
    stat: 'Coming soon',
    statIcon: Puzzle,
    span: 'lg:col-span-2',
    uiPreview: (
      <div className="grid grid-cols-4 gap-1.5">
        {['📧', '💬', '📊', '🔔'].map((emoji, i) => (
          <div
            key={i}
            className="flex items-center justify-center h-7 rounded-lg bg-muted/50 text-xs"
          >
            {emoji}
          </div>
        ))}
      </div>
    ),
  },
];

export function FeaturesSection() {
  const [showDashboardPreview, setShowDashboardPreview] = useState(false);

  return (
    <section
      id="features"
      className="relative py-20 md:py-28 overflow-hidden"
      aria-label="Features"
    >
      {/* Background with radial glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      {/* Radial glows under feature cards */}
      <div className="absolute top-1/3 left-[20%] w-96 h-96 bg-primary-500/8 rounded-full blur-[120px]" />
      <div className="absolute top-2/3 right-[20%] w-96 h-96 bg-amber-500/6 rounded-full blur-[120px]" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.03]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <BlurFade>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                Features
              </span>
            </div>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
              Everything you need.
              <br />
              <span className="bg-gradient-to-r from-primary-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Nothing you don&apos;t.
              </span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to streamline your maintenance workflow from start to finish.
            </p>
          </BlurFade>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-16">
          {FEATURES.map((feature, i) => (
            <BlurFade
              key={feature.title}
              delay={i * 0.08}
              direction={i % 3 === 0 ? 'left' : i % 3 === 1 ? 'up' : 'right'}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={cn(
                  'relative group rounded-2xl border p-6 transition-all duration-300 overflow-hidden',
                  'bg-gradient-to-b from-card to-card/80',
                  'hover:shadow-2xl',
                  feature.glowColor,
                  feature.borderColor,
                  feature.span,
                )}
              >
                {/* Popular badge */}
                {feature.popular && (
                  <button
                    onClick={() => setShowDashboardPreview(true)}
                    className="absolute -top-3 right-4 z-20"
                    aria-label="View interactive demo"
                  >
                    <div
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg cursor-pointer',
                        'bg-gradient-to-r',
                        feature.gradient,
                      )}
                    >
                      <Zap className="inline h-3 w-3 mr-1 -mt-0.5" />
                      Interactive Demo
                    </div>
                  </button>
                )}

                {/* Colored glow on hover */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    feature.bgGradient,
                  )}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and stat badge */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn('p-3 rounded-xl bg-gradient-to-br shadow-lg', feature.gradient)}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    {feature.statIcon && (
                      <div
                        className={cn(
                          'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                          feature.bgGradient,
                          feature.accentColor,
                        )}
                      >
                        <feature.statIcon className="h-3.5 w-3.5" />
                        <span className="hidden lg:inline">{feature.stat}</span>
                      </div>
                    )}
                  </div>

                  {/* Title and description */}
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {feature.description}
                  </p>

                  {/* UI Preview */}
                  {feature.uiPreview && (
                    <div
                      className={cn(
                        'rounded-xl border bg-background p-4',
                        feature.borderColor.split(' ')[0],
                      )}
                    >
                      {feature.uiPreview}
                    </div>
                  )}

                  {/* Learn more link for interactive demo */}
                  {feature.popular && (
                    <button
                      onClick={() => setShowDashboardPreview(true)}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      View Demo
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </motion.div>
            </BlurFade>
          ))}
        </div>

        {/* Feature Stats */}
        <BlurFade delay={0.6}>
          <div className="mt-20">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Built for modern property management
              </h3>
              <p className="text-muted-foreground">
                Everything you need to manage maintenance at scale.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  value: '3×',
                  label: 'Faster resolution',
                  sublabel: 'Industry average',
                  color: 'text-primary-500',
                  bg: 'bg-primary-500/10',
                },
                {
                  icon: TrendingUp,
                  value: '98%',
                  label: 'Satisfaction rate',
                  sublabel: 'Across all users',
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10',
                },
                {
                  icon: Zap,
                  value: '30s',
                  label: 'Ticket submission',
                  sublabel: 'Average time',
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/10',
                },
                {
                  icon: Shield,
                  value: '100%',
                  label: 'Data isolation',
                  sublabel: 'Enterprise security',
                  color: 'text-sky-500',
                  bg: 'bg-sky-500/10',
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className={cn(
                    'flex flex-col items-center text-center p-6 rounded-xl border',
                    stat.bg,
                    'border-current',
                  )}
                >
                  <div className={cn('p-2 rounded-full bg-muted/50 mb-3', stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className={cn('text-3xl font-extrabold mb-1', stat.color)}>{stat.value}</p>
                  <h4 className="text-sm font-semibold text-foreground mb-0.5">{stat.label}</h4>
                  <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
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
              <p className="text-muted-foreground mb-4">Ready to see it in action?</p>
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Start Free Trial
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

      {/* Dashboard Preview Modal */}
      {showDashboardPreview && (
        <DashboardPreviewModal onClose={() => setShowDashboardPreview(false)} />
      )}
    </section>
  );
}
