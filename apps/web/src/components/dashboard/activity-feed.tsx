'use client';

import Link from 'next/link';
import {
  Ticket,
  UserCheck,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TicketStatus, NotificationType } from '@maintix/shared-types';
import { statusConfig } from '@/lib/ticket-config';

interface Activity {
  id: string;
  type: string;
  ticketId?: string;
  ticketTitle?: string;
  userId?: string;
  userName?: string;
  userInitials?: string;
  createdAt: string;
  status?: TicketStatus;
}

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
}

const activityIconMap: Record<string, React.ElementType> = {
  [NotificationType.TICKET_CREATED]: Ticket,
  [NotificationType.TICKET_ASSIGNED]: UserCheck,
  [NotificationType.WORK_STARTED]: Play,
  [NotificationType.COMPLETION_SUBMITTED]: CheckCircle,
  [NotificationType.TICKET_APPROVED]: CheckCircle,
  [NotificationType.TICKET_CANCELLED]: XCircle,
  [NotificationType.PRIORITY_CHANGED]: AlertTriangle,
  [NotificationType.TECHNICIAN_REASSIGNED]: RotateCcw,
};

const activityColorMap: Record<string, string> = {
  [NotificationType.TICKET_CREATED]: 'text-primary',
  [NotificationType.TICKET_ASSIGNED]: 'text-accent-500',
  [NotificationType.WORK_STARTED]: 'text-warning-500',
  [NotificationType.COMPLETION_SUBMITTED]: 'text-success-600',
  [NotificationType.TICKET_APPROVED]: 'text-success-600',
  [NotificationType.TICKET_CANCELLED]: 'text-error-500',
  [NotificationType.PRIORITY_CHANGED]: 'text-warning-600',
  [NotificationType.TECHNICIAN_REASSIGNED]: 'text-primary',
};

export function ActivityFeed({ activities, limit = 10 }: ActivityFeedProps) {
  const limitedActivities = activities.slice(0, limit);

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <CardDescription>No recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Activity will appear here as tickets are updated.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest updates across all tickets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {limitedActivities.map((activity) => {
            const Icon = activityIconMap[activity.type] || Clock;
            const iconColor = activityColorMap[activity.type] || 'text-muted-foreground';

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-1.5 bg-muted ${iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {activity.ticketId && activity.ticketTitle ? (
                      <Link
                        href={`/dashboard/tickets/${activity.ticketId}`}
                        className="font-medium text-sm hover:text-primary transition-colors truncate"
                      >
                        {activity.ticketTitle}
                      </Link>
                    ) : (
                      <span className="font-medium text-sm truncate">
                        {activity.ticketTitle || 'Ticket'}
                      </span>
                    )}
                    {activity.status && statusConfig[activity.status] && (
                      <Badge variant={statusConfig[activity.status].variant} className="shrink-0">
                        {statusConfig[activity.status].label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {activity.userName ? (
                      <span className="flex items-center gap-1.5">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[9px]">
                            {activity.userInitials}
                          </AvatarFallback>
                        </Avatar>
                        {activity.userName}
                      </span>
                    ) : (
                      <span>System</span>
                    )}
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
