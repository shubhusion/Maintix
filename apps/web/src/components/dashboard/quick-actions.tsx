'use client';

import { Plus, Ticket, Building2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Role } from '@maintix/shared-types';

interface QuickActionsProps {
  userRole?: Role;
  onNewTicket?: () => void;
  onViewTickets?: () => void;
  onViewProperties?: () => void;
}

export function QuickActions({
  userRole,
  onNewTicket,
  onViewTickets,
  onViewProperties,
}: QuickActionsProps) {
  const isManager = userRole === Role.MANAGER;

  const actions = [
    {
      label: 'New Ticket',
      icon: Plus,
      onClick: onNewTicket,
      href: '/dashboard/tickets?action=create',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'View Tickets',
      icon: Ticket,
      onClick: onViewTickets,
      href: '/dashboard/tickets',
      color: 'text-success-600',
      bgColor: 'bg-success-500/10',
    },
    {
      label: 'Properties',
      icon: Building2,
      onClick: onViewProperties,
      href: '/dashboard/properties',
      color: 'text-warning-600',
      bgColor: 'bg-warning-500/10',
    },
    ...(isManager
      ? [
          {
            label: 'Manage Users',
            icon: Users,
            onClick: () => {},
            href: '/dashboard/users',
            color: 'text-accent-500',
            bgColor: 'bg-accent-500/10',
          },
        ]
      : []),
  ];

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <a key={action.label} href={action.href} className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'gap-2 transition-colors',
                  action.bgColor,
                  action.color,
                  'hover:opacity-80',
                )}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
