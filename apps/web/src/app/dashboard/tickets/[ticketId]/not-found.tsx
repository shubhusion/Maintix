'use client';

import { Ticket, ArrowLeft, Ticket as TicketIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function TicketNotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {/* Illustration */}
          <div className="relative mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-warning-500/10 to-warning-500/5">
              <Ticket className="h-12 w-12 text-warning-500" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-error-500/20">
              <span className="text-xs">❌</span>
            </div>
          </div>

          {/* Error code */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-4xl font-bold text-warning-500">404</span>
            <span className="text-2xl text-muted-foreground">|</span>
            <span className="text-4xl font-bold text-muted-foreground">Not Found</span>
          </div>

          {/* Message */}
          <h1 className="mb-2 text-xl font-semibold">Ticket not found</h1>
          <p className="mb-6 max-w-[280px] text-sm text-muted-foreground">
            The ticket you&apos;re looking for doesn&apos;t exist, has been removed, or you don&apos;t have access to it.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/tickets">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <TicketIcon className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick navigation */}
          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Quick links:</span>
            <Link
              href="/dashboard/tickets?status=all"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              All Tickets
              <ArrowRight className="h-3 w-3" />
            </Link>
            <span>·</span>
            <Link
              href="/dashboard/tickets?status=open"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Open Tickets
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
