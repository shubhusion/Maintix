'use client';

import { Building2, Ticket, Users, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TicketStatusChart } from '@/components/ticket-status-chart';
import { TicketVolumeChart } from '@/components/dashboard/ticket-volume-chart';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatCard } from '@/components/dashboard/stat-card';
import { useAuth } from '@/contexts/auth-context';
import { useProperties } from '@/hooks/use-properties';
import { useAllPropertyTickets } from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';
import { useNotifications } from '@/hooks/use-notifications';
import { Role, TicketStatus } from '@maintix/shared-types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useProperties();
  const propertyIds = properties?.map((p) => p.id) ?? [];
  const { tickets, isLoading: ticketsLoading } = useAllPropertyTickets(propertyIds);
  useUsers(
    undefined,
    user?.role === Role.MANAGER,
  );
  const { data: notificationsData } = useNotifications();

  const openCount = tickets.filter((t) => t.status === TicketStatus.OPEN).length;
  const inProgressCount = tickets.filter((t) => t.status === TicketStatus.IN_PROGRESS).length;
  const awaitingCount = tickets.filter((t) => t.status === TicketStatus.AWAITING_APPROVAL).length;

  // Generate time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Convert notifications to activity feed format
  const activities = (notificationsData?.data ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    ticketId: n.ticketId || undefined,
    ticketTitle: n.message.split("'")[1] || 'Ticket',
    userId: undefined,
    userName: undefined,
    userInitials: undefined,
    createdAt: n.createdAt,
  }));

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {getGreeting()}, {user?.firstName}
          {user?.role === Role.MANAGER ? ' 👋' : ''}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your maintenance platform.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions
        userRole={user?.role}
        onNewTicket={() => {}}
        onViewTickets={() => {}}
        onViewProperties={() => {}}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <StatCard
              title="Properties"
              value={properties?.length ?? 0}
              description="Total properties"
              icon={<Building2 className="h-4 w-4" />}
              iconBgColor="bg-primary/10"
              iconColor="text-primary"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Total number of properties you have access to</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <StatCard
              title="Open Tickets"
              value={ticketsLoading ? '—' : openCount}
              description="Across all properties"
              icon={<Ticket className="h-4 w-4" />}
              iconBgColor="bg-warning-500/10"
              iconColor="text-warning-500"
              progress={{
                current: openCount,
                total: tickets.length,
                label: `${tickets.length > 0 ? Math.round((openCount / tickets.length) * 100) : 0}% of total`,
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Tickets with Open status across all properties</p>
          </TooltipContent>
        </Tooltip>

        {user?.role === Role.MANAGER && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <StatCard
                  title="In Progress"
                  value={ticketsLoading ? '—' : inProgressCount}
                  description="Active work orders"
                  icon={<Clock className="h-4 w-4" />}
                  iconBgColor="bg-accent-500/10"
                  iconColor="text-accent-500"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tickets currently being worked on by technicians</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <StatCard
                  title="Pending Approval"
                  value={ticketsLoading ? '—' : awaitingCount}
                  description="Awaiting your review"
                  icon={<Users className="h-4 w-4" />}
                  iconBgColor="bg-primary/10"
                  iconColor="text-primary"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tickets awaiting manager approval to proceed</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>

      {/* Charts */}
      {propertyIds.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <TicketVolumeChart tickets={tickets} days={7} />
          <TicketStatusChart tickets={tickets} />
        </div>
      )}

      {/* Activity Feed */}
      {propertyIds.length > 0 && <ActivityFeed activities={activities} limit={8} />}

      {/* Properties List */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Properties</h2>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-48" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const propertyTickets = tickets.filter((t) => t.property?.id === property.id);
              const openTickets = propertyTickets.filter(
                (t) => t.status === TicketStatus.OPEN,
              ).length;

              return (
                <Link key={property.id} href={`/dashboard/properties/${property.id}`}>
                  <Card className="group cursor-pointer transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        {property.name}
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                      {openTickets > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning-500/10 text-xs font-medium text-warning-600">
                            {openTickets}
                          </span>
                          <span className="text-xs text-muted-foreground">open tickets</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No properties yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.role === Role.MANAGER
                  ? 'Create your first property to get started.'
                  : 'Ask your manager to add you to a property.'}
              </p>
              {user?.role === Role.MANAGER && (
                <Link href="/dashboard/properties">
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Add Property
                  </button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
