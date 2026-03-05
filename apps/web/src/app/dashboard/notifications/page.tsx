'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  BellOff,
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

const notificationTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  [NotificationType.TICKET_CREATED]: { icon: Ticket, color: 'text-primary', label: 'Created' },
  [NotificationType.TICKET_ASSIGNED]: { icon: UserCheck, color: 'text-accent-500', label: 'Assigned' },
  [NotificationType.WORK_STARTED]: { icon: Play, color: 'text-warning-500', label: 'Work Started' },
  [NotificationType.COMPLETION_SUBMITTED]: { icon: CheckCircle, color: 'text-accent-500', label: 'Completed' },
  [NotificationType.TICKET_APPROVED]: { icon: CheckCircle, color: 'text-success-600', label: 'Approved' },
  [NotificationType.TICKET_CANCELLED]: { icon: XCircle, color: 'text-error-500', label: 'Cancelled' },
  [NotificationType.PRIORITY_CHANGED]: { icon: AlertTriangle, color: 'text-warning-600', label: 'Priority Changed' },
  [NotificationType.TECHNICIAN_REASSIGNED]: { icon: RotateCcw, color: 'text-primary', label: 'Reassigned' },
};

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const notifications = notificationsData?.data ?? [];
  const unreadCount = unreadData?.count ?? 0;

  const filteredNotifications = typeFilter === 'all'
    ? notifications
    : notifications.filter((n: Notification) => n.type === typeFilter);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
      toast({ title: 'All notifications marked as read' });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

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
          <SelectTrigger className="w-[200px]">
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
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BellOff className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You&apos;re all caught up! Notifications will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((n: Notification) => {
            const config = notificationTypeConfig[n.type];
            const Icon = config?.icon ?? Bell;
            const iconColor = config?.color ?? 'text-muted-foreground';

            const cardContent = (
              <Card
                className={`transition-colors ${!n.isRead ? 'border-primary/30 bg-primary/[0.02]' : ''} ${n.ticketId ? 'hover:border-primary/50 hover:shadow-sm cursor-pointer' : ''}`}
              >
                <CardContent className="flex items-start gap-3 py-4">
                  <div className="mt-0.5">
                    <Icon className={`h-4 w-4 ${n.isRead ? 'opacity-40' : ''} ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? 'font-medium' : ''}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        try {
                          await markAsRead.mutateAsync(n.id);
                        } catch {
                          /* silent */
                        }
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
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
        </div>
      )}
    </div>
  );
}
