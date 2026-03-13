'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Root error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          {/* Error Illustration */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error-500/10">
            <svg
              className="h-10 w-10 text-error-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            We&apos;re sorry, but an unexpected error occurred. Please try again.
          </p>

          <div className="flex gap-3">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
              Go to Dashboard
            </Button>
          </div>

          {error.message && (
            <details className="mt-6 w-full">
              <summary className="cursor-pointer text-xs text-muted-foreground">
                Error Details
              </summary>
              <pre className="mt-2 w-full overflow-x-auto rounded bg-muted p-3 text-xs text-muted-foreground">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
