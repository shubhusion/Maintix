'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  Check,
  CheckCheck,
  Ticket,
  UserCheck,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useUnreadCount,
  type Notification,
} from '@/hooks/use-notifications';
import { format, formatDistanceToNow, isToday, isYesterday, isWithinInterval, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { NotificationType } from '@maintix/shared-types';

const notificationTypeConfig: Record<
  string,
  { icon: React.ElementType; color: string; label: string }
> = {
  [NotificationType.TICKET_CREATED]: { icon: Ticket, color: 'text-primary', label: 'Created' },
  [NotificationType.TICKET_ASSIGNED]: {
    icon: UserCheck,
    color: 'text-accent-500',
    label: 'Assigned',
  },
  [NotificationType.WORK_STARTED]: { icon: Play, color: 'text-warning-500', label: 'Work Started' },
  [NotificationType.COMPLETION_SUBMITTED]: {
    icon: CheckCircle,
    color: 'text-accent-500',
    label: 'Completed',
  },
  [NotificationType.TICKET_APPROVED]: {
    icon: CheckCircle,
    color: 'text-success-600',
    label: 'Approved',
  },
  [NotificationType.TICKET_CANCELLED]: {
    icon: XCircle,
    color: 'text-error-500',
    label: 'Cancelled',
  },
  [NotificationType.PRIORITY_CHANGED]: {
    icon: AlertTriangle,
    color: 'text-warning-600',
    label: 'Priority Changed',
  },
  [NotificationType.TECHNICIAN_REASSIGNED]: {
    icon: RotateCcw,
    color: 'text-primary',
    label: 'Reassigned',
  },
};

// Group notifications by date
function groupNotificationsByDate(notifications: Notification[]) {
  const now = new Date();
  const startOfWeek = subDays(now, now.getDay());
  
  const groups: {
    label: string;
    notifications: Notification[];
  }[] = [];
  
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const thisWeek: Notification[] = [];
  const earlier: Notification[] = [];
  
  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);
    
    if (isToday(date)) {
      today.push(notification);
    } else if (isYesterday(date)) {
      yesterday.push(notification);
    } else if (isWithinInterval(date, { start: startOfWeek, end: now })) {
      thisWeek.push(notification);
    } else {
      earlier.push(notification);
    }
  });
  
  // Sort each group by date (newest first)
  const sortByDate = (a: Notification, b: Notification) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  
  today.sort(sortByDate);
  yesterday.sort(sortByDate);
  thisWeek.sort(sortByDate);
  earlier.sort(sortByDate);
  
  // Add groups with labels
  if (today.length > 0) {
    groups.push({ label: 'Today', notifications: today });
  }
  if (yesterday.length > 0) {
    groups.push({ label: 'Yesterday', notifications: yesterday });
  }
  if (thisWeek.length > 0) {
    groups.push({ label: 'This Week', notifications: thisWeek });
  }
  if (earlier.length > 0) {
    groups.push({ label: 'Earlier', notifications: earlier });
  }
  
  return groups;
}

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  const notifications = notificationsData?.data ?? [];
  const unreadCount = unreadData?.count ?? 0;

  const filteredNotifications =
    typeFilter === 'all'
      ? notifications
      : notifications.filter((n: Notification) => n.type === typeFilter);

  // Group filtered notifications by date
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
      toast({ title: 'All notifications marked as read' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const handleMarkAsRead = useCallback(async (id: string) => {
    setAnimatingIds((prev) => new Set(prev).add(id));
    try {
      await markAsRead.mutateAsync(id);
      toast({ title: 'Notification marked as read' });
    } catch {
      // silent
    } finally {
      setTimeout(() => {
        setAnimatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 300);
    }
  }, [markAsRead, toast]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        {!!unreadCount && (
          <Button variant="outline" onClick={handleMarkAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.values(NotificationType).map((type) => {
              const config = notificationTypeConfig[type];
              return (
                <SelectItem key={type} value={type}>
                  {config?.label ?? type}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : !filteredNotifications?.length ? (
        <Card>
          <EmptyState
            illustration="notifications"
            title="No notifications"
            description="You're all caught up! Notifications will appear here."
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedNotifications.map((group) => (
            <div key={group.label} className="space-y-2">
              {/* Group Header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 py-2">
                  {group.label}
                </h3>
              </div>
              
              {/* Notifications in this group */}
              <AnimatePresence>
                {group.notifications.map((n) => {
                  const isAnimating = animatingIds.has(n.id);
                  const config = notificationTypeConfig[n.type];
                  const Icon = config?.icon ?? Bell;
                  const iconColor = config?.color ?? 'text-muted-foreground';

                  const cardContent = (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ 
                        opacity: isAnimating ? 0 : 1, 
                        y: isAnimating ? -10 : 0,
                        height: isAnimating ? 0 : 'auto',
                      }}
                      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <Card
                        className={`transition-all ${!n.isRead ? 'border-primary/30 bg-primary/[0.02]' : 'border-border'} ${n.ticketId ? 'hover:border-primary/50 hover:shadow-sm cursor-pointer' : ''}`}
                      >
                        <CardContent className="flex items-start gap-3 py-4">
                          <div className="mt-0.5">
                            <Icon className={`h-4 w-4 ${n.isRead ? 'opacity-40' : ''} ${iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!n.isRead ? 'font-medium' : ''}`}>{n.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(n.createdAt), 'h:mm a')} · {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          {!n.isRead && (
                            <motion.div
                              initial={{ scale: 1 }}
                              animate={{ scale: isAnimating ? 0 : 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  await handleMarkAsRead(n.id);
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );

                  if (n.ticketId) {
                    return (
                      <Link key={n.id} href={`/dashboard/tickets/${n.ticketId}`}>
                        {cardContent}
                      </Link>
                    );
                  }

                  return <div key={n.id}>{cardContent}</div>;
                })}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
