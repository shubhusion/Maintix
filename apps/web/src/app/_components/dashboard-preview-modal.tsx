'use client';

import { useState } from 'react';
import { X, Filter, Search, Plus, MoreHorizontal, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Ticket {
  id: string;
  title: string;
  property: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'completed' | 'approved';
  assignee?: string;
  created: string;
}

const SAMPLE_TICKETS: Ticket[] = [
  {
    id: 'TK-2847',
    title: 'Broken AC — Unit 4B',
    property: 'Sunset Apartments',
    priority: 'high',
    status: 'in-progress',
    assignee: 'John D.',
    created: '2h ago',
  },
  {
    id: 'TK-2846',
    title: 'Leaking faucet — Kitchen',
    property: 'Oak Manor',
    priority: 'medium',
    status: 'open',
    created: '4h ago',
  },
  {
    id: 'TK-2845',
    title: 'Replace hallway lights',
    property: 'River View',
    priority: 'low',
    status: 'completed',
    assignee: 'Mike R.',
    created: '1d ago',
  },
  {
    id: 'TK-2844',
    title: 'Elevator inspection',
    property: 'Sunset Apartments',
    priority: 'high',
    status: 'approved',
    assignee: 'Elevator Co.',
    created: '2d ago',
  },
  {
    id: 'TK-2843',
    title: 'Garage door repair',
    property: 'Oak Manor',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'John D.',
    created: '3d ago',
  },
];

const priorityConfig = {
  high: { color: 'bg-red-500/10 text-red-600 dark:text-red-400', label: 'High' },
  medium: { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Medium' },
  low: { color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Low' },
};

const statusConfig = {
  open: { icon: AlertCircle, color: 'text-blue-500', label: 'Open' },
  'in-progress': { icon: Clock, color: 'text-amber-500', label: 'In Progress' },
  completed: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Completed' },
  approved: { icon: CheckCircle2, color: 'text-primary-500', label: 'Approved' },
};

export function DashboardPreviewModal({ onClose }: { onClose: () => void }) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'completed'>('all');

  const filteredTickets = SAMPLE_TICKETS.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'open') return t.status === 'open' || t.status === 'in-progress';
    if (filter === 'completed') return t.status === 'completed' || t.status === 'approved';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-card border border-border/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
          <div className="flex flex-col">
            <h2 id="modal-title" className="text-lg font-semibold text-foreground">
              Ticket Dashboard Preview
            </h2>
            <p className="text-xs text-muted-foreground">
              Interactive demo — Click tickets to see details
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="flex h-[600px] overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border/50 bg-muted/20 p-4 hidden sm:block">
            <div className="space-y-1">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === 'all'
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-muted-foreground hover:bg-muted/50',
                )}
              >
                All Tickets
              </button>
              <button
                onClick={() => setFilter('open')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === 'open'
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-muted-foreground hover:bg-muted/50',
                )}
              >
                Open
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === 'completed'
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-muted-foreground hover:bg-muted/50',
                )}
              >
                Completed
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Properties
              </h3>
              <div className="space-y-2">
                {['Sunset Apartments', 'Oak Manor', 'River View'].map((p) => (
                  <div
                    key={p}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary-500" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>
              <Button size="sm" className="gap-2 bg-primary-600 hover:bg-primary-700">
                <Plus className="h-3.5 w-3.5" />
                New Ticket
              </Button>
            </div>

            {/* Ticket list */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {filteredTickets.map((ticket, index) => {
                    const StatusIcon = statusConfig[ticket.status].icon;
                    return (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() =>
                          setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)
                        }
                        className={cn(
                          'group rounded-xl border border-border/50 bg-card p-4 cursor-pointer transition-all duration-300 hover:border-primary-500/30 hover:shadow-lg hover:shadow-primary-500/[0.04]',
                          selectedTicket === ticket.id &&
                            'border-primary-500/50 ring-2 ring-primary-500/20',
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono text-muted-foreground">
                                {ticket.id}
                              </span>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  'text-[10px] px-1.5 py-0.5',
                                  priorityConfig[ticket.priority].color,
                                )}
                              >
                                {priorityConfig[ticket.priority].label}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0.5 bg-primary-500/10 text-primary-600 dark:text-primary-400"
                              >
                                {ticket.property}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-medium text-foreground truncate">
                              {ticket.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <StatusIcon
                                  className={cn('h-3 w-3', statusConfig[ticket.status].color)}
                                />
                                {statusConfig[ticket.status].label}
                              </span>
                              {ticket.assignee && (
                                <span className="flex items-center gap-1">
                                  <div className="h-4 w-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-[8px] font-bold text-white">
                                    {ticket.assignee.charAt(0)}
                                  </div>
                                  {ticket.assignee}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {ticket.created}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {selectedTicket === ticket.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Description
                                  </h4>
                                  <p className="text-sm text-foreground">
                                    Tenant reported {ticket.title.toLowerCase()}. Requires immediate
                                    attention.
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Timeline
                                  </h4>
                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    <p>Created: {ticket.created}</p>
                                    <p>Updated: Just now</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border/50 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Showing {filteredTickets.length} of {SAMPLE_TICKETS.length} tickets
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
