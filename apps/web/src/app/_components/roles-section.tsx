'use client';

import { BarChart3, Wrench, Users, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';
import { ShineBorder } from '@/components/ui/shine-border';

const ROLES = [
  {
    role: 'Manager',
    icon: BarChart3,
    gradient: 'from-primary-500 to-primary-700',
    ring: 'ring-primary-500/20',
    iconBg: 'bg-primary-500/15',
    iconColor: 'text-primary-600 dark:text-primary-400',
    highlight: true,
    stat: 'Manages 6 workflow stages',
    features: [
      'Full dashboard overview',
      'Assign & reassign tickets',
      'Approve completed work',
      'Manage properties & users',
    ],
  },
  {
    role: 'Technician',
    icon: Wrench,
    gradient: 'from-amber-500 to-orange-600',
    ring: 'ring-amber-500/20',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-600 dark:text-amber-400',
    highlight: false,
    stat: 'Avg. 12 tickets resolved/week',
    features: [
      'View assigned tickets',
      'Start & complete work',
      'Track personal workload',
      'Get instant alerts',
    ],
  },
  {
    role: 'Tenant',
    icon: Users,
    gradient: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    highlight: false,
    stat: '30-second ticket submission',
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
    <section className="py-24 md:py-32" aria-label="User roles">
      <div className="mx-auto max-w-6xl px-6">
        <BlurFade>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3 text-center">
            For Every Role
          </p>
          <h2 className="text-center text-3xl md:text-[2.75rem] font-extrabold tracking-[-0.03em] text-foreground font-display">
            One platform, three perspectives
          </h2>
          <p className="mt-3 text-center text-foreground/70 dark:text-muted-foreground max-w-lg mx-auto">
            Each role sees exactly what they need — nothing more, nothing less.
          </p>
        </BlurFade>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {ROLES.map(
            (
              { role, icon: Icon, gradient, ring, iconBg, iconColor, highlight, stat, features },
              i,
            ) => (
              <BlurFade
                key={role}
                delay={i * 0.08}
                direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
              >
                <div
                  className={cn(
                    'relative rounded-2xl border p-7 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:ring-2',
                    ring,
                    highlight
                      ? 'border-primary-500/30 bg-card/70 shadow-lg shadow-primary-500/[0.05] md:-translate-y-2'
                      : 'border-border/50 bg-card/50 hover:bg-card/80',
                  )}
                >
                  {highlight && (
                    <ShineBorder
                      shineColor={['#6366f1', '#818cf8', '#34d399']}
                      borderWidth={1}
                      duration={12}
                    />
                  )}
                  {highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                      Full access
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        iconBg,
                      )}
                    >
                      <Icon className={cn('h-5 w-5', iconColor)} />
                    </div>
                    <div
                      className={cn(
                        'inline-block rounded-lg bg-gradient-to-r px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest',
                        gradient,
                      )}
                    >
                      {role}
                    </div>
                  </div>
                  <p className="text-xs font-medium text-primary-500 mb-4">{stat}</p>
                  <ul className="space-y-3">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurFade>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
