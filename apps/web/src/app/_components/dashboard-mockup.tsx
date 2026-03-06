'use client';

import { motion } from 'framer-motion';
import { BarChart3, ClipboardList, Building2, Users, Layers, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BorderBeam } from '@/components/ui/border-beam';

export function DashboardMockup() {
  const tickets = [
    {
      id: 'TK-2847',
      title: 'Broken AC unit in 4B',
      status: 'In Progress',
      color: '#ef4444',
      statusColor: '#818cf8',
    },
    {
      id: 'TK-2846',
      title: 'Leaking faucet — kitchen',
      status: 'Assigned',
      color: '#f59e0b',
      statusColor: '#f59e0b',
    },
    {
      id: 'TK-2845',
      title: 'Replace hallway lighting',
      status: 'Open',
      color: '#22c55e',
      statusColor: '#a3a3a3',
    },
    {
      id: 'TK-2844',
      title: 'Elevator maintenance due',
      status: 'Completed',
      color: '#ef4444',
      statusColor: '#22c55e',
    },
  ];

  const sidebarItems: { label: string; icon: LucideIcon }[] = [
    { label: 'Dashboard', icon: BarChart3 },
    { label: 'Tickets', icon: ClipboardList },
    { label: 'Properties', icon: Building2 },
    { label: 'Users', icon: Users },
    { label: 'Settings', icon: Layers },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto" style={{ perspective: '1200px' }}>
      <div
        className="relative rounded-xl border border-border/60 dark:border-white/[0.08] bg-card/95 dark:bg-[#0c0c0f]/90 shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden backdrop-blur-xl transition-transform duration-500 hover:scale-[1.02] will-change-transform"
        style={{ transform: 'rotateX(2deg)' }}
      >
        <BorderBeam
          size={250}
          duration={8}
          colorFrom="#6366f1"
          colorTo="#34d399"
          borderWidth={1.5}
        />

        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 dark:border-white/[0.06] bg-muted/30 dark:bg-white/[0.02]">
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-3 flex-1">
            <div className="mx-auto w-60 rounded-md bg-muted/60 dark:bg-white/[0.06] px-3 py-1 text-xs text-muted-foreground text-center font-mono">
              app.Maintix.io/dashboard
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="flex min-h-[340px]">
          {/* Sidebar */}
          <div className="hidden sm:flex w-48 flex-col border-r border-border/40 dark:border-white/[0.06] bg-muted/20 dark:bg-white/[0.01] p-3 gap-0.5">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-[9px] font-bold text-white">
                M
              </div>
              <span className="text-xs font-semibold text-foreground/80 dark:text-white/80">
                Maintix
              </span>
            </div>
            {sidebarItems.map(({ label, icon: Icon }, i) => (
              <div
                key={label}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                  i === 1
                    ? 'bg-primary-500/10 dark:bg-white/[0.08] text-foreground dark:text-white font-medium border-l-2 border-primary-500'
                    : 'text-muted-foreground hover:text-foreground dark:text-neutral-500 dark:hover:text-neutral-300',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground/90 dark:text-white/90">
                  Active Tickets
                </h3>
                <p className="text-xs text-muted-foreground">Sunset Apartments</p>
              </div>
              <div className="rounded-lg bg-primary-500/15 dark:bg-primary-500/20 px-2.5 py-1 text-xs font-medium text-primary-600 dark:text-primary-300">
                + New Ticket
              </div>
            </div>

            <div className="space-y-2">
              {tickets.map((ticket, i) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 rounded-lg border border-border/30 dark:border-white/[0.04] bg-muted/30 dark:bg-white/[0.02] px-3 py-2.5 hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: ticket.color }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                      <span className="text-xs text-foreground/80 dark:text-white/80 truncate">
                        {ticket.title}
                      </span>
                    </div>
                  </div>
                  <div
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `${ticket.statusColor}18`,
                      color: ticket.statusColor,
                    }}
                  >
                    {ticket.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div
        className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-br from-primary-500/20 via-transparent to-primary-600/10 blur-3xl opacity-60"
        aria-hidden="true"
      />
    </div>
  );
}
