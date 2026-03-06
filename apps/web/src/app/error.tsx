"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Optionally log error to an error reporting service
    // console.error(error);
  }, [error]);
  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="max-w-md w-full p-8 rounded-lg shadow-lg bg-card border border-border">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-4 text-muted-foreground">{error.message || "An unexpected error occurred. Please try again."}</p>
          <button
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
            onClick={() => reset()}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}