'use client';

import { Bell, BellOff, Check, CheckCheck } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useNotifications();
  const { data: unreadData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const { toast } = useToast();

  const notifications = notificationsData?.data ?? [];
  const unreadCount = unreadData?.count ?? 0;

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

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : !notifications?.length ? (
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
          {notifications.map((n: Notification) => (
            <Card
              key={n.id}
              className={`transition-colors ${!n.isRead ? 'border-primary/30 bg-primary/[0.02]' : ''}`}
            >
              <CardContent className="flex items-start gap-3 py-4">
                <div className="mt-0.5">
                  {n.isRead ? (
                    <Bell className="h-4 w-4 text-muted-foreground/40" />
                  ) : (
                    <Bell className="h-4 w-4 text-primary" />
                  )}
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
                    onClick={async () => {
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
          ))}
        </div>
      )}
    </div>
  );
}
