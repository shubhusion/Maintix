'use client';

import { use, useState } from 'react';
import { Building2, Tag, Ticket, Users, Settings, ClipboardList, Home } from 'lucide-react';
import { useProperty } from '@/hooks/use-properties';
import { useAuth } from '@/contexts/auth-context';
import { Role } from '@maintix/shared-types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PropertyOverviewTab } from './property-overview-tab';
import { PropertyTicketsTab } from './property-tickets-tab';
import { PropertyMembersTab } from './property-members-tab';
import { PropertyCategoriesTab } from './property-categories-tab';
import { PropertySettingsTab } from './property-settings-tab';

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = use(params);
  const { user } = useAuth();
  const { data: property, isLoading: propLoading } = useProperty(propertyId);
  const [activeTab, setActiveTab] = useState('overview');

  const isManager = user?.role === Role.MANAGER;

  if (propLoading) {
    return (
      <div className="space-y-6">
        {/* Enhanced Header Skeleton */}
        <div className="relative overflow-hidden rounded-xl border bg-card">
          <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent animate-pulse" />
          <div className="absolute -bottom-6 left-6 flex items-end gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium">Property not found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The property you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    );
  }

  // Generate property initials for placeholder
  const propertyInitials = property.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Banner */}
      <div className="relative overflow-hidden rounded-xl border bg-card">
        {/* Gradient Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        
        {/* Property Info Overlay */}
        <div className="absolute -bottom-6 left-6 right-6 flex items-end justify-between">
          <div className="flex items-end gap-4">
            {/* Property Icon/Placeholder */}
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-600 text-primary-foreground text-2xl font-bold shadow-lg">
              {propertyInitials}
            </div>
            
            {/* Property Details */}
            <div className="mb-1">
              <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                {property.address}
              </p>
            </div>
          </div>

          {/* Quick Stats Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Building2 className="h-4 w-4" />
            Property ID: {property.id.slice(0, 8)}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Ticket className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground mt-1">Across all time</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/10">
              <Users className="h-4 w-4 text-accent-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground mt-1">People with access</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-500/10">
              <Tag className="h-4 w-4 text-warning-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground mt-1">Ticket categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">Tickets</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          {isManager && (
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="overview">
          <PropertyOverviewTab _propertyId={propertyId} property={property} />
        </TabsContent>
        <TabsContent value="tickets">
          <PropertyTicketsTab propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="members">
          <PropertyMembersTab propertyId={propertyId} isManager={isManager} />
        </TabsContent>
        <TabsContent value="categories">
          <PropertyCategoriesTab propertyId={propertyId} isManager={isManager} />
        </TabsContent>
        {isManager && (
          <TabsContent value="settings">
            <PropertySettingsTab propertyId={propertyId} property={property} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
