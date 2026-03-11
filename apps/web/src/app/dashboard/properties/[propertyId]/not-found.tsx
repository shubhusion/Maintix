'use client';

import { Building2, ArrowLeft, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function PropertyNotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {/* Illustration */}
          <div className="relative mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <span className="text-xs">🔒</span>
            </div>
          </div>

          {/* Error code */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-4xl font-bold text-primary">404</span>
            <span className="text-2xl text-muted-foreground">|</span>
            <span className="text-4xl font-bold text-muted-foreground">Not Found</span>
          </div>

          {/* Message */}
          <h1 className="mb-2 text-xl font-semibold">Property not found</h1>
          <p className="mb-6 max-w-[280px] text-sm text-muted-foreground">
            The property you&apos;re looking for doesn&apos;t exist, has been removed, or you don&apos;t have access to it.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/properties">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Properties
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick navigation */}
          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Quick links:</span>
            <Link
              href="/dashboard/properties"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              All Properties
              <ArrowRight className="h-3 w-3" />
            </Link>
            <span>·</span>
            <Link
              href="/dashboard/tickets"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Tickets
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
