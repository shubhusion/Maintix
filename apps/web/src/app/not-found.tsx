import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {/* 404 Illustration */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Home className="h-10 w-10 text-primary" />
          </div>

          <h1 className="mb-2 text-6xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-xl font-semibold">Page Not Found</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex gap-3">
            <Button asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
            <Link
              href="/dashboard/properties"
              className="text-primary hover:underline"
            >
              Properties
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/dashboard/tickets"
              className="text-primary hover:underline"
            >
              Tickets
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link
              href="/dashboard/notifications"
              className="text-primary hover:underline"
            >
              Notifications
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
