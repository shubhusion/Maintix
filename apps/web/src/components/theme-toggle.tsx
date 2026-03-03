'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className={cn(
          'relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm transition-colors dark:border-neutral-700 dark:bg-neutral-800/80',
          className,
        )}
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 text-neutral-500" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200',
        'border-neutral-200 bg-white/80 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        'dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100',
        'backdrop-blur-sm shadow-sm',
        className,
      )}
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
