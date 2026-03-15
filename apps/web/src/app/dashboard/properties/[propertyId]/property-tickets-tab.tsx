'use client';

import { Ticket as TicketIcon, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useTickets } from '@/hooks/use-tickets';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { statusConfig } from '@/lib/ticket-config';
import { Priority } from '@maintix/shared-types';
import { formatDistanceToNow } from 'date-fns';

interface PropertyTicketsTabProps {
  propertyId: string;
}

export function PropertyTicketsTab({ propertyId }: PropertyTicketsTabProps) {
  const { data: ticketsData } = useTickets(propertyId);
  const tickets = (ticketsData?.data ?? []).filter((t) => t !== undefined && t !== null);

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TicketIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium">No tickets yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Tickets created for this property will appear here.
          </p>
          <Link href={`/dashboard/tickets?propertyId=${propertyId}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/dashboard/tickets/${ticket.id}`}
          className="block"
        >
          <Card className="transition-all duration-300 hover:border-primary/30 hover:shadow-sm">
            <CardContent className="flex items-center justify-between p-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{ticket.title}</p>
                <p className="text-sm text-muted-foreground">
                  {ticket.category?.name} · by {ticket.createdBy?.firstName}{' '}
                  {ticket.createdBy?.lastName} ·{' '}
                  {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-3">
                {ticket.priority && (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      ticket.priority === Priority.URGENT
                        ? 'animate-pulse bg-error-500'
                        : ticket.priority === Priority.HIGH
                          ? 'bg-warning-500'
                          : ticket.priority === Priority.MEDIUM
                            ? 'bg-primary-500'
                            : 'bg-neutral-400'
                    }`}
                  />
                )}
                <Badge variant={statusConfig[ticket.status]?.variant ?? 'secondary'}>
                  {statusConfig[ticket.status]?.label ?? ticket.status}
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
