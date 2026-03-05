'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { NAV_LINKS } from './constants';

export function Navbar({
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'bg-background/60 backdrop-blur-2xl border-b border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
          : 'bg-transparent',
      )}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-bold shadow-lg shadow-primary-600/20 transition-transform duration-300 group-hover:scale-110">
            M
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground dark:text-white">
            Maintix
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-xs font-medium text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle
            className={cn(
              !scrolled && 'dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.12]',
            )}
          />
          <Link
            href="/login"
            className="hidden sm:inline-flex rounded-lg px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className={cn(
              'hidden sm:inline-flex rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              scrolled
                ? 'bg-foreground text-background hover:opacity-80'
                : 'bg-foreground text-background hover:opacity-90 dark:bg-white dark:text-neutral-900 dark:hover:bg-white/90',
            )}
          >
            Get Started
            <ArrowUpRight className="inline-block h-3 w-3 ml-1 -mt-0.5" />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-2xl"
        >
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/50 mt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-foreground text-background px-3 py-2.5 text-sm font-semibold text-center hover:opacity-90 dark:bg-white dark:text-neutral-900"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
