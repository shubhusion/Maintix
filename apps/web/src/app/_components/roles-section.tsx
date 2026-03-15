'use client';

import { motion } from 'motion/react';
import {
  BarChart3,
  Wrench,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Zap,
  Eye,
  Bell,
  FileCheck,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';

interface Role {
  role: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glowColor: string;
  borderColor: string;
  bgGradient: string;
  textColor: string;
  stat: string;
  statIcon: React.ComponentType<{ className?: string }>;
  features: string[];
  uiPreview: React.ReactNode;
}

const ROLES: Role[] = [
  {
    role: 'Manager',
    description: 'Complete oversight of all properties, tickets, and team members with powerful analytics.',
    icon: BarChart3,
    gradient: 'from-primary-500 to-primary-600',
    glowColor: 'shadow-primary-500/30',
    borderColor: 'border-primary-500/40 hover:border-primary-500/60',
    bgGradient: 'from-primary-500/5 to-primary-500/10',
    textColor: 'text-primary-500',
    stat: 'Manages 6 workflow stages',
    statIcon: TrendingUp,
    uiPreview: (
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
          <span className="text-xs text-muted-foreground">Open Tickets</span>
          <span className="text-sm font-bold text-foreground">24</span>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
          <span className="text-xs text-muted-foreground">Pending Approval</span>
          <span className="text-sm font-bold text-amber-500">5</span>
        </div>
        <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/30">
          <div className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-primary-500" />
            <span className="text-xs font-medium text-primary-500">Full Visibility</span>
          </div>
        </div>
      </div>
    ),
    features: [
      'Full dashboard overview',
      'Assign & reassign tickets',
      'Approve completed work',
      'Manage properties & users',
    ],
  },
  {
    role: 'Technician',
    description: 'Streamlined mobile experience to manage assignments, update status, and complete work.',
    icon: Wrench,
    gradient: 'from-amber-500 to-amber-600',
    glowColor: 'shadow-amber-500/30',
    borderColor: 'border-amber-500/40 hover:border-amber-500/60',
    bgGradient: 'from-amber-500/5 to-amber-500/10',
    textColor: 'text-amber-500',
    stat: 'Avg. 12 tickets resolved/week',
    statIcon: Clock,
    uiPreview: (
      <div className="space-y-2">
        <div className="p-2 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-foreground">My Assignments</span>
          </div>
          <p className="text-xs text-muted-foreground">3 tasks today</p>
        </div>
        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-500">Quick Actions</span>
          </div>
        </div>
      </div>
    ),
    features: [
      'View assigned tickets',
      'Start & complete work',
      'Track personal workload',
      'Get instant alerts',
    ],
  },
  {
    role: 'Tenant',
    description: 'Submit and track maintenance requests in seconds. Stay informed every step of the way.',
    icon: Users,
    gradient: 'from-emerald-500 to-emerald-600',
    glowColor: 'shadow-emerald-500/30',
    borderColor: 'border-emerald-500/40 hover:border-emerald-500/60',
    bgGradient: 'from-emerald-500/5 to-emerald-500/10',
    textColor: 'text-emerald-500',
    stat: '30-second ticket submission',
    statIcon: Zap,
    uiPreview: (
      <div className="space-y-2">
        <div className="p-2 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-foreground">My Requests</span>
          </div>
          <p className="text-xs text-muted-foreground">2 active, 5 completed</p>
        </div>
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500">Real-time Updates</span>
          </div>
        </div>
      </div>
    ),
    features: [
      'Submit tickets in seconds',
      'Track real-time status',
      'Get resolution updates',
      'Cancel own tickets',
    ],
  },
];

export function RolesSection() {
  return (
    <section
      id="roles"
      className="relative py-20 md:py-28 overflow-hidden"
      aria-label="User roles"
    >
      {/* Background with radial glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Radial glows under each card position */}
      <div className="absolute top-1/2 left-[16%] w-72 h-72 bg-primary-500/8 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/8 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-[16%] w-72 h-72 bg-emerald-500/8 rounded-full blur-[100px]" />
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.03]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <BlurFade>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              <span className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
                For Every Role
              </span>
            </div>
          </BlurFade>
          <BlurFade delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
              One platform,
              <br />
              <span className="bg-gradient-to-r from-primary-500 via-amber-500 to-emerald-500 bg-clip-text text-transparent">
                three perspectives
              </span>
            </h2>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Each role sees exactly what they need — nothing more, nothing less.
            </p>
          </BlurFade>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {ROLES.map((role, i) => (
            <BlurFade
              key={role.role}
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
                  role.glowColor,
                  role.borderColor,
                )}
              >
                {/* Colored glow on hover */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    role.bgGradient,
                  )}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon and role badge */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={cn(
                        'p-3 rounded-xl bg-gradient-to-br shadow-lg',
                        role.gradient,
                      )}
                    >
                      <role.icon className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>

                  {/* Role name and description */}
                  <h3 className="text-xl font-bold text-foreground mb-1">{role.role}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{role.description}</p>

                  {/* Stat badge */}
                  <div
                    className={cn(
                      'mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium',
                      role.bgGradient,
                      role.borderColor,
                      'border',
                    )}
                  >
                    <role.statIcon className="h-3.5 w-3.5" />
                    {role.stat}
                  </div>

                  {/* UI Preview */}
                  <div
                    className={cn(
                      'mb-6 rounded-xl border bg-background p-4',
                      role.borderColor.split(' ')[0],
                    )}
                  >
                    {role.uiPreview}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {role.features.map((f, idx) => (
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
                            i === 0
                              ? 'bg-primary-500/20 text-primary-500'
                              : i === 1
                              ? 'bg-amber-500/20 text-amber-500'
                              : 'bg-emerald-500/20 text-emerald-500',
                          )}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.a
                    href="/login"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'group flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-300',
                      i === 0
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30'
                        : 'border border-border bg-background hover:bg-muted text-foreground',
                    )}
                  >
                    {role.role === 'Manager' ? 'Start Free Trial' : 'Learn More'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.a>
                </div>
              </motion.div>
            </BlurFade>
          ))}
        </div>

        {/* Role Comparison */}
        <BlurFade delay={0.6}>
          <div className="mt-20">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Perfect for every team size
              </h3>
              <p className="text-muted-foreground">
                From small properties to large enterprises, everyone benefits.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  value: '3',
                  label: 'Distinct user roles',
                  sublabel: 'Tailored experiences',
                  color: 'text-primary-500',
                  bg: 'bg-primary-500/10',
                },
                {
                  value: '100%',
                  label: 'Permission isolation',
                  sublabel: 'Data security built-in',
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10',
                },
                {
                  value: '<1min',
                  label: 'Role assignment',
                  sublabel: 'Instant onboarding',
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/10',
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
                  <p className={cn('text-4xl font-extrabold mb-2', stat.color)}>{stat.value}</p>
                  <h4 className="text-sm font-semibold text-foreground mb-1">{stat.label}</h4>
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
              <p className="text-muted-foreground mb-4">
                Ready to streamline your team's workflow?
              </p>
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/30"
              >
                Get Started Free
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
