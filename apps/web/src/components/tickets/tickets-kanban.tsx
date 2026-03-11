'use client';

import { useCallback } from 'react';
import { Ticket, User, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { statusConfig } from '@/lib/ticket-config';
import { Priority, TicketStatus } from '@maintix/shared-types';
import { cn } from '@/lib/utils';

export interface KanbanTicket {
  id: string;
  title: string;
  status: TicketStatus;
  priority: Priority | null;
  property?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
  assignedTo?: { id: string; firstName: string; lastName: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface KanbanColumnProps {
  status: TicketStatus;
  tickets: KanbanTicket[];
  onTicketClick?: (ticketId: string) => void;
}

const columnConfig: Record<TicketStatus, { title: string; color: string }> = {
  [TicketStatus.OPEN]: { title: 'Open', color: 'border-gray-400' },
  [TicketStatus.ASSIGNED]: { title: 'Assigned', color: 'border-blue-400' },
  [TicketStatus.IN_PROGRESS]: { title: 'In Progress', color: 'border-amber-400' },
  [TicketStatus.AWAITING_APPROVAL]: { title: 'Awaiting Approval', color: 'border-purple-400' },
  [TicketStatus.DONE]: { title: 'Done', color: 'border-green-400' },
  [TicketStatus.CANCELLED]: { title: 'Cancelled', color: 'border-red-400' },
};

function KanbanColumn({ status, tickets, onTicketClick }: KanbanColumnProps) {
  const config = columnConfig[status];
  const statusCfg = statusConfig[status];

  return (
    <div className="flex flex-col h-full">
      <div className={cn(
        "flex items-center justify-between p-3 border-t-4 rounded-t-lg bg-muted/50",
        config.color
      )}>
        <div className="flex items-center gap-2">
          <Badge variant={statusCfg?.variant ?? 'secondary'} className="text-xs">
            {statusCfg?.label ?? status}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {tickets.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px]">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Ticket className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-xs text-muted-foreground">No tickets</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onTicketClick?.(ticket.id)}
              className="group cursor-pointer"
            >
              <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {ticket.title}
                    </h4>
                  </div>
                  
                  {ticket.property && (
                    <p className="text-xs text-muted-foreground truncate">
                      {ticket.property.name}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {ticket.priority && (
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            ticket.priority === Priority.URGENT
                              ? 'bg-error-500 animate-pulse'
                              : ticket.priority === Priority.HIGH
                                ? 'bg-warning-500'
                                : ticket.priority === Priority.MEDIUM
                                  ? 'bg-primary-500'
                                  : 'bg-neutral-400'
                          )}
                          title={`${ticket.priority} priority`}
                        />
                      )}
                      {ticket.category && (
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                          {ticket.category.name}
                        </span>
                      )}
                    </div>
                    
                    {ticket.assignedTo ? (
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[9px]">
                          {ticket.assignedTo.firstName?.[0]}
                          {ticket.assignedTo.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: false })}</span>
                    </div>
                    {ticket.priority === Priority.URGENT && (
                      <AlertCircle className="h-3 w-3 text-error-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface TicketsKanbanBoardProps {
  tickets: KanbanTicket[];
  onTicketClick?: (ticketId: string) => void;
}

export function TicketsKanbanBoard({ tickets, onTicketClick }: TicketsKanbanBoardProps) {
  // Group tickets by status
  const ticketsByStatus = useCallback(() => {
    const grouped: Record<TicketStatus, KanbanTicket[]> = {
      [TicketStatus.OPEN]: [],
      [TicketStatus.ASSIGNED]: [],
      [TicketStatus.IN_PROGRESS]: [],
      [TicketStatus.AWAITING_APPROVAL]: [],
      [TicketStatus.DONE]: [],
      [TicketStatus.CANCELLED]: [],
    };

    tickets.forEach((ticket) => {
      if (grouped[ticket.status]) {
        grouped[ticket.status].push(ticket);
      }
    });

    return grouped;
  }, [tickets]);

  const grouped = ticketsByStatus();

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 min-w-[1200px] h-full">
        {Object.entries(grouped).map(([status, statusTickets]) => (
          <div
            key={status}
            className="flex-1 min-w-[280px] flex flex-col"
          >
            <KanbanColumn
              status={status as TicketStatus}
              tickets={statusTickets}
              onTicketClick={onTicketClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
