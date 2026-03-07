'use client';

import { Building2, Ticket, Users, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketStatusChart } from '@/components/ticket-status-chart';
import { useAuth } from '@/contexts/auth-context';
import { useProperties } from '@/hooks/use-properties';
import { useAllPropertyTickets } from '@/hooks/use-tickets';
import { useUsers } from '@/hooks/use-users';
import { Role, TicketStatus } from '@maintix/shared-types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: properties, isLoading } = useProperties();
  const propertyIds = properties?.map((p) => p.id) ?? [];
  const { tickets, isLoading: ticketsLoading } = useAllPropertyTickets(propertyIds);
  const { data: allUsers, isLoading: usersLoading } = useUsers(
    undefined,
    user?.role === Role.MANAGER,
  );

  const openCount = tickets.filter((t) => t.status === TicketStatus.OPEN).length;
  const awaitingCount = tickets.filter((t) => t.status === TicketStatus.AWAITING_APPROVAL).length;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName}</h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your maintenance platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{properties?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total properties</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-500/10">
              <Ticket className="h-4 w-4 text-warning-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {ticketsLoading ? '—' : openCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all properties</p>
          </CardContent>
        </Card>

        {user?.role === Role.MANAGER && (
          <>
            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/10">
                  <Clock className="h-4 w-4 text-accent-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {ticketsLoading ? '—' : awaitingCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting your review</p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">
                  {usersLoading ? '—' : (allUsers?.data?.length ?? 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all properties</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Ticket Status Chart */}
      {propertyIds.length > 0 && <TicketStatusChart tickets={tickets} />}

      {/* Quick Actions / Properties List */}
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
            {properties.map((property) => (
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
                  </CardContent>
                </Card>
              </Link>
            ))}
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
