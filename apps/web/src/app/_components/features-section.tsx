'use client';

import { ClipboardList, Wrench, Shield, Building2, Bell, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlurFade } from '@/components/ui/blur-fade';
import { AnimatedList } from '@/components/ui/animated-list';
import { ShineBorder } from '@/components/ui/shine-border';
import { BentoCard } from './bento-card';
import { NotificationItem } from './notification-item';
import { NOTIFICATIONS, WORKFLOW_STAGES } from './constants';

export function FeaturesSection() {
  return (
    <section id="features" className="pb-24 md:pb-32" aria-label="Features">
      <div className="mx-auto max-w-6xl px-6">
        <BlurFade>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3 text-center">
            Features
          </p>
          <h2 className="text-center text-3xl md:text-[2.75rem] font-extrabold tracking-[-0.03em] text-foreground leading-tight font-display">
            Everything you need.
            <br />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
        </BlurFade>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ticket Dashboard */}
          <BlurFade delay={0.05} direction="left" className="sm:col-span-2">
            <BentoCard
              icon={ClipboardList}
              title="Unified Ticket Dashboard"
              description="Every property, every ticket, every status — visible at a glance. Filter by property, priority, status, or assignee."
              iconColor="text-primary-500 dark:text-primary-400"
              iconBg="bg-primary-500/10"
              className="h-full relative"
            >
              <div className="absolute top-4 right-4 rounded-full bg-primary-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Core
              </div>
              <div className="mt-5 space-y-2">
                {[
                  { label: 'Broken AC — Unit 4B', tag: 'High', tagColor: '#ef4444' },
                  { label: 'Leaking faucet — Kitchen', tag: 'Medium', tagColor: '#f59e0b' },
                  { label: 'Replace hallway lights', tag: 'Low', tagColor: '#22c55e' },
                ].map((t) => (
                  <div
                    key={t.label}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-3 py-2"
                  >
                    <span className="text-xs text-muted-foreground">{t.label}</span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${t.tagColor}15`,
                        color: t.tagColor,
                      }}
                    >
                      {t.tag}
                    </span>
                  </div>
                ))}
              </div>
              <ShineBorder shineColor={['#6366f1', '#34d399']} borderWidth={1} duration={10} />
            </BentoCard>
          </BlurFade>

          {/* 6-Stage Workflow */}
          <BlurFade delay={0.1} direction="right">
            <BentoCard
              icon={Wrench}
              title="6-Stage Workflow"
              description="Tickets flow through a validated pipeline from creation to closure."
              iconColor="text-amber-500 dark:text-amber-400"
              iconBg="bg-amber-500/10"
              className="h-full"
            >
              <div className="mt-4 flex items-center gap-0">
                {WORKFLOW_STAGES.map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 transition-colors',
                          i <= 2
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-border bg-muted text-muted-foreground',
                        )}
                      >
                        {i <= 2 ? <Check className="h-2.5 w-2.5" /> : i + 1}
                      </div>
                      <span className="text-[8px] mt-1 text-muted-foreground leading-none text-center max-w-[44px]">
                        {s}
                      </span>
                    </div>
                    {i < WORKFLOW_STAGES.length - 1 && (
                      <div
                        className={cn(
                          'h-px w-3 -mt-3 mx-0.5',
                          i < 2 ? 'bg-primary-500' : 'bg-border',
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </BentoCard>
          </BlurFade>

          {/* Role-Based Access */}
          <BlurFade delay={0.15} direction="up">
            <BentoCard
              icon={Shield}
              title="Role-Based Access"
              description="Managers see everything. Technicians see their assignments. Tenants see their tickets. Clean permission boundaries."
              iconColor="text-emerald-500 dark:text-emerald-400"
              iconBg="bg-emerald-500/10"
              className="h-full"
            />
          </BlurFade>

          {/* Multi-Property */}
          <BlurFade delay={0.2} direction="left">
            <BentoCard
              icon={Building2}
              title="Multi-Property"
              description="Manage unlimited properties with isolated data. Switch context instantly between buildings."
              iconColor="text-sky-500 dark:text-sky-400"
              iconBg="bg-sky-500/10"
              className="h-full"
            >
              <div className="mt-4 space-y-1.5">
                {['Sunset Apartments', 'Oak Manor', 'River View'].map((p, i) => (
                  <div
                    key={p}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs',
                      i === 0
                        ? 'bg-primary-500/[0.08] text-foreground/80 font-medium'
                        : 'text-muted-foreground',
                    )}
                  >
                    <Building2 className="h-3 w-3" />
                    {p}
                  </div>
                ))}
              </div>
            </BentoCard>
          </BlurFade>

          {/* Smart Notifications */}
          <BlurFade delay={0.25} direction="right">
            <BentoCard
              icon={Bell}
              title="Smart Notifications"
              description="In-app alerts for assignments, status changes, and completions."
              iconColor="text-violet-500 dark:text-violet-400"
              iconBg="bg-violet-500/10"
              className="h-full"
            >
              <div className="mt-4 relative h-[120px] overflow-hidden">
                <AnimatedList delay={1200} className="gap-2">
                  {NOTIFICATIONS.map((n) => (
                    <NotificationItem key={n.text} {...n} />
                  ))}
                </AnimatedList>
              </div>
            </BentoCard>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
