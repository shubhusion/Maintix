'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, Building2, Ticket, Users, Bell, Settings } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useProperties } from '@/hooks/use-properties';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const routeIcons: Record<string, React.ReactNode> = {
  dashboard: <Home className="h-4 w-4" />,
  properties: <Building2 className="h-4 w-4" />,
  tickets: <Ticket className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  notifications: <Bell className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

export function EnhancedBreadcrumbs() {
  const pathname = usePathname();
  const { data: properties } = useProperties();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Generate breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0 || segments[0] !== 'dashboard') return null;

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const icon = routeIcons[segment];
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
      icon,
    });
  }

  // Check if we're on a property detail page
  const isPropertyDetail =
    breadcrumbs.length >= 3 &&
    breadcrumbs[1]?.label === 'Properties' &&
    breadcrumbs[2]?.label !== 'New';

  const propertyId = isPropertyDetail ? breadcrumbs[2]?.href.split('/').pop() : null;
  const currentProperty = properties?.find((p) => p.id === propertyId);

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:block">
      <ol className="flex items-center gap-1">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isPropertiesDropdown =
            crumb.label === 'Properties' &&
            index === 1 &&
            breadcrumbs.length > 2 &&
            properties &&
            properties.length > 0;

          return (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 mx-1" />
              )}

              {isPropertiesDropdown ? (
                <DropdownMenu open={openDropdown === 'properties'} onOpenChange={(open) => setOpenDropdown(open ? 'properties' : null)}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      {crumb.icon}
                      <span className="max-w-[100px] truncate">Properties</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {properties?.map((property) => (
                      <DropdownMenuItem key={property.id} asChild>
                        <Link href={`/dashboard/properties/${property.id}`}>
                          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{property.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : isLast ? (
                // Current page - non-interactive with background pill
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary',
                    'transition-colors'
                  )}
                >
                  {crumb.icon}
                  <span className="max-w-[150px] truncate">
                    {currentProperty ? currentProperty.name : crumb.label}
                  </span>
                </span>
              ) : (
                // Intermediate breadcrumbs - clickable
                <Link
                  href={crumb.href}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground',
                    'transition-colors hover:text-foreground hover:bg-muted'
                  )}
                >
                  {crumb.icon}
                  <span className="max-w-[120px] truncate">{crumb.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
