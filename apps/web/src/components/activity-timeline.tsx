'use client';

import {
  Plus,
  UserCheck,
  RotateCcw,
  Play,
  CheckCircle,
  ThumbsUp,
  XCircle,
  AlertTriangle,
  Paperclip,
  Trash2,
  Clock,
} from 'lucide-react';
import { ActivityAction } from '@maintix/shared-types';
import { useTicketActivities, type TicketActivity } from '@/hooks/use-tickets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: typeof Clock; color: string; bgColor: string }
> = {
  [ActivityAction.TICKET_CREATED]: {
    label: 'Created ticket',
    icon: Plus,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  [ActivityAction.TECHNICIAN_ASSIGNED]: {
    label: 'Assigned technician',
    icon: UserCheck,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  [ActivityAction.TECHNICIAN_REASSIGNED]: {
    label: 'Reassigned ticket',
    icon: RotateCcw,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  [ActivityAction.WORK_STARTED]: {
    label: 'Started work',
    icon: Play,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-500/10',
  },
  [ActivityAction.COMPLETION_SUBMITTED]: {
    label: 'Submitted for approval',
    icon: CheckCircle,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-500/10',
  },
  [ActivityAction.TICKET_APPROVED]: {
    label: 'Approved ticket',
    icon: ThumbsUp,
    color: 'text-success-600 dark:text-success-400',
    bgColor: 'bg-success-500/10',
  },
  [ActivityAction.TICKET_CANCELLED]: {
    label: 'Cancelled ticket',
    icon: XCircle,
    color: 'text-error-500',
    bgColor: 'bg-error-500/10',
  },
  [ActivityAction.PRIORITY_CHANGED]: {
    label: 'Changed priority',
    icon: AlertTriangle,
    color: 'text-warning-600 dark:text-warning-400',
    bgColor: 'bg-warning-500/10',
  },
  [ActivityAction.ATTACHMENT_ADDED]: {
    label: 'Added attachment',
    icon: Paperclip,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  [ActivityAction.ATTACHMENT_REMOVED]: {
    label: 'Removed attachment',
    icon: Trash2,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
};

function getDetailText(activity: TicketActivity): string | null {
  const { action, previousValue, newValue } = activity;

  if (action === ActivityAction.PRIORITY_CHANGED && previousValue && newValue) {
    const prev = (previousValue as Record<string, string>).priority;
    const next = (newValue as Record<string, string>).priority;
    if (prev && next) {
      return `${capitalize(prev)} → ${capitalize(next)}`;
    }
  }

  if (
    (action === ActivityAction.TECHNICIAN_ASSIGNED ||
      action === ActivityAction.TECHNICIAN_REASSIGNED) &&
    newValue
  ) {
    const name = (newValue as Record<string, string>).technicianName;
    if (name) return `→ ${name}`;
  }

  if (action === ActivityAction.TICKET_CANCELLED && newValue) {
    const reason = (newValue as Record<string, string>).reason;
    if (reason) return `"${reason}"`;
  }

  return null;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export function ActivityTimeline({ ticketId }: { ticketId: string }) {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useTicketActivities(ticketId);

  const activities = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Activity</span>
          <span className="sm:hidden">Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2 sm:gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity recorded yet.
          </p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border" />

            <div className="space-y-0">
              {activities.map((activity, index) => {
                const config = ACTION_CONFIG[activity.action] ?? {
                  label: activity.action,
                  icon: Clock,
                  color: 'text-muted-foreground',
                  bgColor: 'bg-muted',
                };
                const Icon = config.icon;
                const detail = getDetailText(activity);
                const isLast = index === activities.length - 1;

                return (
                  <div key={activity.id} className={`relative flex gap-2 sm:gap-3 ${isLast ? '' : 'pb-5'}`}>
                    {/* Icon node */}
                    <div
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-xs sm:text-sm">
                        <span className="font-medium">
                          {activity.actor.firstName} {activity.actor.lastName}
                        </span>{' '}
                        <span className="text-muted-foreground">{config.label.toLowerCase()}</span>
                      </p>
                      {detail && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{detail}</p>
                      )}
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {formatRelativeTime(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasNextPage && (
              <div className="mt-3 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-xs h-9"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load older activity'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
