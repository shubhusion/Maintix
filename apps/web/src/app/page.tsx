'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Shield,
  Wrench,
  Users,
  Bell,
  BarChart3,
  Zap,
  ArrowUpRight,
  Layers,
  Menu,
  X,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';

/* ─── Magic UI Components ─── */
import { BlurFade } from '@/components/ui/blur-fade';
import { NumberTicker } from '@/components/ui/number-ticker';
import { BorderBeam } from '@/components/ui/border-beam';
import { DotPattern } from '@/components/ui/dot-pattern';
import { AnimatedList } from '@/components/ui/animated-list';
import { Marquee } from '@/components/ui/marquee';
import { WordRotate } from '@/components/ui/word-rotate';
import { Ripple } from '@/components/ui/ripple';
import { ShineBorder } from '@/components/ui/shine-border';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';

/* ═══════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

const TRUST_ITEMS = [
  { icon: Shield, label: 'Secure by default' },
  { icon: Zap, label: 'Real-time sync' },
  { icon: Users, label: 'Role-based access' },
  { icon: Building2, label: 'Multi-property' },
  { icon: Bell, label: 'Smart alerts' },
  { icon: ClipboardList, label: '6-stage workflow' },
];

const NOTIFICATIONS = [
  { text: 'Ticket TK-2847 assigned to you', time: '2m ago', icon: '🔧' },
  { text: 'TK-2841 marked as completed', time: '15m ago', icon: '✅' },
  { text: 'New ticket from Apt 3A', time: '5m ago', icon: '🆕' },
  { text: 'TK-2846 status: In Progress', time: '8m ago', icon: '⚡' },
  { text: 'Maintenance scheduled — Bldg B', time: '22m ago', icon: '📅' },
];

const WORKFLOW_STAGES = ['Open', 'Assigned', 'In Progress', 'Completed', 'Approved', 'Closed'];

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For small teams getting started',
    features: [
      'Up to 2 properties',
      'Up to 10 users',
      'Basic notifications',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/login',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing property managers',
    features: [
      'Unlimited properties',
      'Unlimited users',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Start Free Trial',
    href: '/login',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale operations',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    href: '#',
    highlighted: false,
  },
];

/* ═══════════════════════════════════════════════════
   Dashboard Mockup (enhanced with BorderBeam)
   ═══════════════════════════════════════════════════ */

function DashboardMockup() {
  const tickets = [
    { id: 'TK-2847', title: 'Broken AC unit in 4B', status: 'In Progress', color: '#ef4444', statusColor: '#818cf8' },
    { id: 'TK-2846', title: 'Leaking faucet — kitchen', status: 'Assigned', color: '#f59e0b', statusColor: '#f59e0b' },
    { id: 'TK-2845', title: 'Replace hallway lighting', status: 'Open', color: '#22c55e', statusColor: '#a3a3a3' },
    { id: 'TK-2844', title: 'Elevator maintenance due', status: 'Completed', color: '#ef4444', statusColor: '#22c55e' },
  ];

  const sidebarItems: { label: string; icon: LucideIcon }[] = [
    { label: 'Dashboard', icon: BarChart3 },
    { label: 'Tickets', icon: ClipboardList },
    { label: 'Properties', icon: Building2 },
    { label: 'Users', icon: Users },
    { label: 'Settings', icon: Layers },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto" style={{ perspective: '1200px' }}>
      <div
        className="relative rounded-xl border border-border/60 dark:border-white/[0.08] bg-card/95 dark:bg-[#0c0c0f]/90 shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden backdrop-blur-xl transition-transform duration-500 hover:scale-[1.02] will-change-transform"
        style={{ transform: 'rotateX(2deg)' }}
      >
        {/* BorderBeam effect */}
        <BorderBeam
          size={250}
          duration={8}
          colorFrom="#6366f1"
          colorTo="#34d399"
          borderWidth={1.5}
        />

        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 dark:border-white/[0.06] bg-muted/30 dark:bg-white/[0.02]">
          <div className="flex gap-1.5" aria-hidden="true">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-3 flex-1">
            <div className="mx-auto w-60 rounded-md bg-muted/60 dark:bg-white/[0.06] px-3 py-1 text-xs text-muted-foreground text-center font-mono">
              app.Maintix.io/dashboard
            </div>
          </div>
        </div>

        {/* App content */}
        <div className="flex min-h-[340px]">
          {/* Sidebar */}
          <div className="hidden sm:flex w-48 flex-col border-r border-border/40 dark:border-white/[0.06] bg-muted/20 dark:bg-white/[0.01] p-3 gap-0.5">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-[9px] font-bold text-white">
                M
              </div>
              <span className="text-xs font-semibold text-foreground/80 dark:text-white/80">
                Maintix
              </span>
            </div>
            {sidebarItems.map(({ label, icon: Icon }, i) => (
              <div
                key={label}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors',
                  i === 1
                    ? 'bg-primary-500/10 dark:bg-white/[0.08] text-foreground dark:text-white font-medium border-l-2 border-primary-500'
                    : 'text-muted-foreground hover:text-foreground dark:text-neutral-500 dark:hover:text-neutral-300',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground/90 dark:text-white/90">
                  Active Tickets
                </h3>
                <p className="text-xs text-muted-foreground">Sunset Apartments</p>
              </div>
              <div className="rounded-lg bg-primary-500/15 dark:bg-primary-500/20 px-2.5 py-1 text-xs font-medium text-primary-600 dark:text-primary-300">
                + New Ticket
              </div>
            </div>

            <div className="space-y-2">
              {tickets.map((ticket, i) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 rounded-lg border border-border/30 dark:border-white/[0.04] bg-muted/30 dark:bg-white/[0.02] px-3 py-2.5 hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: ticket.color }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                      <span className="text-xs text-foreground/80 dark:text-white/80 truncate">
                        {ticket.title}
                      </span>
                    </div>
                  </div>
                  <div
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `${ticket.statusColor}18`,
                      color: ticket.statusColor,
                    }}
                  >
                    {ticket.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div
        className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-br from-primary-500/20 via-transparent to-primary-600/10 blur-3xl opacity-60"
        aria-hidden="true"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Bento Feature Card
   ═══════════════════════════════════════════════════ */

function BentoCard({
  icon: Icon,
  title,
  description,
  className = '',
  iconColor = 'text-primary-500 dark:text-primary-400',
  iconBg = 'bg-primary-500/10',
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconColor?: string;
  iconBg?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-6 transition-all duration-500 hover:border-primary-500/20 hover:bg-card/80 hover:shadow-lg hover:shadow-primary-500/[0.04]',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary-500/[0.04] via-transparent to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <div className={cn('mb-4 inline-flex rounded-xl p-2.5', iconBg, iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Notification Item (for AnimatedList)
   ═══════════════════════════════════════════════════ */

function NotificationItem({ icon, text, time }: { icon: string; text: string; time: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-primary-500/[0.06] dark:bg-white/[0.04] px-3 py-2 w-full">
      <span className="text-sm" aria-hidden="true">{icon}</span>
      <span className="text-xs text-foreground/70 dark:text-white/70 flex-1 truncate">{text}</span>
      <span className="text-[10px] text-muted-foreground shrink-0">{time}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════ */

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 900], [1, 0]);

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [user, isLoading, router]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      const close = () => setMobileMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true });
      return () => window.removeEventListener('scroll', close);
    }
  }, [mobileMenuOpen]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* ════════════════ Navbar ════════════════ */}
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

        <main id="main">
          {/* ════════════════ Hero ════════════════ */}
          <section className="relative min-h-screen flex flex-col" aria-label="Hero">
            {/* Background */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white dark:from-[#09090b] dark:via-[#09090b] dark:to-[#09090b]"
              aria-hidden="true"
            >
              {/* Glow orbs */}
              <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-primary-400/10 dark:bg-primary-600/15 blur-[150px] animate-glow-pulse will-change-transform" />
              <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-primary-300/10 dark:bg-primary-500/10 blur-[120px] animate-glow-pulse [animation-delay:2s] will-change-transform" />

              {/* DotPattern from Magic UI */}
              <DotPattern
                width={32}
                height={32}
                cr={1}
                className="absolute inset-0 opacity-[0.15] dark:opacity-[0.12] text-primary-500/50 [mask-image:radial-gradient(600px_circle_at_50%_40%,white,transparent)]"
              />

              {/* Noise */}
              <div className="noise absolute inset-0 opacity-30 dark:opacity-100" />
            </div>

            {/* Hero content */}
            <motion.div
              style={{ y: heroY, opacity: heroOpacity }}
              className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-28 pb-8"
            >
              {/* AnimatedShinyText badge */}
              <BlurFade delay={0} direction="down">
                <div className="group mb-6 inline-flex items-center rounded-full border border-border/30 bg-card/60 dark:border-white/[0.08] dark:bg-white/[0.04] px-4 py-1.5 backdrop-blur-md">
                  <AnimatedShinyText className="text-xs font-medium">
                    ✨ Now in public beta — Try it free
                  </AnimatedShinyText>
                </div>
              </BlurFade>

              {/* Headline with WordRotate */}
              <BlurFade delay={0.1} direction="down">
                <h1 className="text-center text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-[-0.035em] text-foreground dark:text-white leading-[1.05] max-w-4xl font-display">
                  Property maintenance,
                  <br />
                  <WordRotate
                    words={['finally organized', 'fully automated', 'beautifully simple']}
                    duration={3000}
                    className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 dark:from-primary-300 dark:via-primary-400 dark:to-accent-400 bg-clip-text text-transparent"
                    motionProps={{
                      initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
                      animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
                      exit: { opacity: 0, y: -20, filter: 'blur(4px)' },
                      transition: { duration: 0.3, ease: 'easeOut' },
                    }}
                  />
                </h1>
              </BlurFade>

              {/* Subtitle */}
              <BlurFade delay={0.2} direction="down">
                <p className="mt-5 text-center text-base md:text-lg text-foreground/70 dark:text-neutral-400 max-w-xl leading-relaxed">
                  Resolve tickets 3× faster with role-based workflows that keep
                  managers, technicians, and tenants in sync.
                </p>
              </BlurFade>

              {/* CTA */}
              <BlurFade delay={0.3} direction="down">
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <Link
                      href="/login"
                      className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 dark:from-white dark:to-neutral-100 px-8 py-4 text-base font-semibold text-white dark:text-neutral-900 overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    >
                      <span className="relative z-10">Start Free</span>
                      <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="#features"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground dark:text-white/60 dark:hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg px-2 py-1"
                    >
                      Explore Features
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No credit card required · Free forever to start
                  </p>
                </div>
              </BlurFade>

              {/* Trust Marquee */}
              <BlurFade delay={0.4} direction="down" className="mt-12 w-full max-w-2xl">
                <Marquee
                  pauseOnHover
                  className="[--duration:25s] [--gap:2rem]"
                >
                  {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium uppercase tracking-widest whitespace-nowrap"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                  ))}
                </Marquee>
              </BlurFade>
            </motion.div>

            {/* Dashboard mockup */}
            <div className="relative z-10 px-6 pb-4">
              <BlurFade delay={0.5} offset={40}>
                <DashboardMockup />
              </BlurFade>
            </div>

            {/* Bottom gradient blend */}
            <div
              className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10"
              aria-hidden="true"
            />
          </section>

          {/* ════════════════ Stats Strip ════════════════ */}
          <BlurFade className="relative z-20 -mt-16 pb-24 md:pb-32" offset={30}>
            <div className="mx-auto max-w-3xl px-6">
              <div className="gradient-border grid grid-cols-3 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 gap-4 shadow-xl shadow-black/[0.03]">
                {[
                  { value: 500, suffix: '+', label: 'Tickets resolved', sub: 'And counting' },
                  { value: 98, suffix: '%', label: 'Satisfaction rate', sub: 'Avg. across users' },
                  { value: 2, suffix: 'hr', label: 'Avg. response', sub: 'From open to assigned' },
                ].map(({ value, suffix, label, sub }) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-display">
                      <NumberTicker
                        value={value}
                        className="text-foreground font-extrabold"
                      />
                      <span>{suffix}</span>
                    </div>
                    <div className="mt-1 text-xs font-semibold text-foreground/80">{label}</div>
                    <div className="text-xs text-muted-foreground">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>

          {/* ════════════════ Bento Features ════════════════ */}
          <section id="features" className="pb-24 md:pb-32" aria-label="Features">
            <div className="mx-auto max-w-6xl px-6">
              <BlurFade>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3 text-center">
                  Features
                </p>
                <h2 className="text-center text-3xl md:text-[2.75rem] font-extrabold tracking-[-0.03em] text-foreground leading-tight font-display">
                  Everything you need.
                  <br />
                  <span className="text-muted-foreground">Nothing you don&apos;t.</span>
                </h2>
              </BlurFade>

              <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Ticket Dashboard — spans 2 cols, elevated treatment */}
                <BlurFade delay={0.05} direction="left" className="sm:col-span-2">
                  <BentoCard
                    icon={ClipboardList}
                    title="Unified Ticket Dashboard"
                    description="Every property, every ticket, every status — visible at a glance. Filter by property, priority, status, or assignee."
                    iconColor="text-primary-500 dark:text-primary-400"
                    iconBg="bg-primary-500/10"
                    className="h-full relative"
                  >
                    {/* Core Feature badge */}
                    <div className="absolute top-4 right-4 rounded-full bg-primary-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                      Core
                    </div>
                    <div className="mt-5 space-y-2">
                      {[
                        { label: 'Broken AC — Unit 4B', tag: 'High', tagColor: '#ef4444' },
                        { label: 'Leaking faucet — Kitchen', tag: 'Medium', tagColor: '#f59e0b' },
                        { label: 'Replace hallway lights', tag: 'Low', tagColor: '#22c55e' },
                      ].map((t) => (
                        <div
                          key={t.label}
                          className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-3 py-2"
                        >
                          <span className="text-xs text-muted-foreground">{t.label}</span>
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${t.tagColor}15`,
                              color: t.tagColor,
                            }}
                          >
                            {t.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                    <ShineBorder
                      shineColor={['#6366f1', '#34d399']}
                      borderWidth={1}
                      duration={10}
                    />
                  </BentoCard>
                </BlurFade>

                {/* 6-Stage Workflow — with pipeline visualization */}
                <BlurFade delay={0.1} direction="right">
                  <BentoCard
                    icon={Wrench}
                    title="6-Stage Workflow"
                    description="Tickets flow through a validated pipeline from creation to closure."
                    iconColor="text-amber-500 dark:text-amber-400"
                    iconBg="bg-amber-500/10"
                    className="h-full"
                  >
                    {/* Pipeline visualization */}
                    <div className="mt-4 flex items-center gap-0">
                      {WORKFLOW_STAGES.map((s, i) => (
                        <div key={s} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                'h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 transition-colors',
                                i <= 2
                                  ? 'border-primary-500 bg-primary-500 text-white'
                                  : 'border-border bg-muted text-muted-foreground',
                              )}
                            >
                              {i <= 2 ? <Check className="h-2.5 w-2.5" /> : i + 1}
                            </div>
                            <span className="text-[8px] mt-1 text-muted-foreground leading-none text-center max-w-[44px]">
                              {s}
                            </span>
                          </div>
                          {i < WORKFLOW_STAGES.length - 1 && (
                            <div
                              className={cn(
                                'h-px w-3 -mt-3 mx-0.5',
                                i < 2 ? 'bg-primary-500' : 'bg-border',
                              )}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </BlurFade>

                {/* Role-Based Access */}
                <BlurFade delay={0.15} direction="up">
                  <BentoCard
                    icon={Shield}
                    title="Role-Based Access"
                    description="Managers see everything. Technicians see their assignments. Tenants see their tickets. Clean permission boundaries."
                    iconColor="text-emerald-500 dark:text-emerald-400"
                    iconBg="bg-emerald-500/10"
                    className="h-full"
                  />
                </BlurFade>

                {/* Multi-Property */}
                <BlurFade delay={0.2} direction="left">
                  <BentoCard
                    icon={Building2}
                    title="Multi-Property"
                    description="Manage unlimited properties with isolated data. Switch context instantly between buildings."
                    iconColor="text-sky-500 dark:text-sky-400"
                    iconBg="bg-sky-500/10"
                    className="h-full"
                  >
                    {/* Mini property list */}
                    <div className="mt-4 space-y-1.5">
                      {['Sunset Apartments', 'Oak Manor', 'River View'].map((p, i) => (
                        <div
                          key={p}
                          className={cn(
                            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs',
                            i === 0
                              ? 'bg-primary-500/[0.08] text-foreground/80 font-medium'
                              : 'text-muted-foreground',
                          )}
                        >
                          <Building2 className="h-3 w-3" />
                          {p}
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </BlurFade>

                {/* Smart Notifications — with AnimatedList */}
                <BlurFade delay={0.25} direction="right">
                  <BentoCard
                    icon={Bell}
                    title="Smart Notifications"
                    description="In-app alerts for assignments, status changes, and completions."
                    iconColor="text-violet-500 dark:text-violet-400"
                    iconBg="bg-violet-500/10"
                    className="h-full"
                  >
                    <div className="mt-4 relative h-[120px] overflow-hidden">
                      <AnimatedList delay={1200} className="gap-2">
                        {NOTIFICATIONS.map((n) => (
                          <NotificationItem key={n.text} {...n} />
                        ))}
                      </AnimatedList>
                    </div>
                  </BentoCard>
                </BlurFade>
              </div>
            </div>
          </section>

          {/* ════════════════ How It Works ════════════════ */}
          <section
            id="how-it-works"
            className="py-24 md:py-32 border-y border-border/50 bg-muted/30"
            aria-label="How it works"
          >
            <div className="mx-auto max-w-6xl px-6">
              <BlurFade>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3 text-center">
                  How It Works
                </p>
                <h2 className="text-center text-3xl md:text-[2.75rem] font-extrabold tracking-[-0.03em] text-foreground font-display">
                  Three steps. Zero complexity.
                </h2>
              </BlurFade>

              <div className="mt-16 grid gap-6 md:grid-cols-3">
                {[
                  {
                    step: '01',
                    title: 'Submit',
                    desc: 'Tenant describes the issue, picks a category and priority. Takes 30 seconds.',
                  },
                  {
                    step: '02',
                    title: 'Assign',
                    desc: 'Manager reviews incoming tickets and routes them to the right technician.',
                  },
                  {
                    step: '03',
                    title: 'Resolve',
                    desc: 'Technician completes the work. Manager approves and closes the ticket.',
                  },
                ].map(({ step, title, desc }, i) => (
                  <BlurFade
                    key={step}
                    delay={i * 0.1}
                    direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                  >
                    <div className="relative group">
                      {/* Horizontal connector (desktop) */}
                      {i < 2 && (
                        <div
                          className="hidden md:block absolute top-7 left-full w-full h-px z-0 overflow-hidden"
                          aria-hidden="true"
                        >
                          <div className="h-full animated-dash" />
                        </div>
                      )}

                      {/* Vertical connector (mobile) */}
                      {i < 2 && (
                        <div
                          className="md:hidden absolute -bottom-6 left-6 w-px h-6 z-0"
                          aria-hidden="true"
                        >
                          <div className="w-full h-full border-l border-dashed border-border" />
                        </div>
                      )}

                      <div className="relative rounded-2xl border border-border/50 bg-card/50 p-7 transition-all duration-500 hover:bg-card/80 hover:border-primary-500/15 hover:shadow-lg hover:shadow-primary-500/[0.04]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-bold shadow-lg shadow-primary-600/20 mb-5">
                          {step}
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{title}</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </BlurFade>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════ Roles ════════════════ */}
          <section className="py-24 md:py-32" aria-label="User roles">
            <div className="mx-auto max-w-6xl px-6">
              <BlurFade>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3 text-center">
                  For Every Role
                </p>
                <h2 className="text-center text-3xl md:text-[2.75rem] font-extrabold tracking-[-0.03em] text-foreground font-display">
                  One platform, three perspectives
                </h2>
                <p className="mt-3 text-center text-foreground/70 dark:text-muted-foreground max-w-lg mx-auto">
                  Each role sees exactly what they need — nothing more, nothing less.
                </p>
              </BlurFade>

              <div className="mt-14 grid gap-5 md:grid-cols-3">
                {[
                  {
                    role: 'Manager',
                    icon: BarChart3,
                    gradient: 'from-primary-500 to-primary-700',
                    ring: 'ring-primary-500/20',
                    iconBg: 'bg-primary-500/15',
                    iconColor: 'text-primary-600 dark:text-primary-400',
                    highlight: true,
                    stat: 'Manages 6 workflow stages',
                    features: [
                      'Full dashboard overview',
                      'Assign & reassign tickets',
                      'Approve completed work',
                      'Manage properties & users',
                    ],
                  },
                  {
                    role: 'Technician',
                    icon: Wrench,
                    gradient: 'from-amber-500 to-orange-600',
                    ring: 'ring-amber-500/20',
                    iconBg: 'bg-amber-500/15',
                    iconColor: 'text-amber-600 dark:text-amber-400',
                    highlight: false,
                    stat: 'Avg. 12 tickets resolved/week',
                    features: [
                      'View assigned tickets',
                      'Start & complete work',
                      'Track personal workload',
                      'Get instant alerts',
                    ],
                  },
                  {
                    role: 'Tenant',
                    icon: Users,
                    gradient: 'from-emerald-500 to-teal-600',
                    ring: 'ring-emerald-500/20',
                    iconBg: 'bg-emerald-500/15',
                    iconColor: 'text-emerald-600 dark:text-emerald-400',
                    highlight: false,
                    stat: '30-second ticket submission',
                    features: [
                      'Submit tickets in seconds',
                      'Track real-time status',
                      'Get resolution updates',
                      'Cancel own tickets',
                    ],
                  },
                ].map(
                  (
                    { role, icon: Icon, gradient, ring, iconBg, iconColor, highlight, stat, features },
                    i,
                  ) => (
                    <BlurFade
                      key={role}
                      delay={i * 0.08}
                      direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                    >
                      <div
                        className={cn(
                          'relative rounded-2xl border p-7 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:ring-2',
                          ring,
                          highlight
                            ? 'border-primary-500/30 bg-card/70 shadow-lg shadow-primary-500/[0.05] md:-translate-y-2'
                            : 'border-border/50 bg-card/50 hover:bg-card/80',
                        )}
                      >
                        {/* ShineBorder on highlighted card */}
                        {highlight && (
                          <ShineBorder
                            shineColor={['#6366f1', '#818cf8', '#34d399']}
                            borderWidth={1}
                            duration={12}
                          />
                        )}
                        {highlight && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                            Full access
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-xl',
                              iconBg,
                            )}
                          >
                            <Icon className={cn('h-5 w-5', iconColor)} />
                          </div>
                          <div
                            className={cn(
                              'inline-block rounded-lg bg-gradient-to-r px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest',
                              gradient,
                            )}
                          >
                            {role}
                          </div>
                        </div>
                        <p className="text-xs font-medium text-primary-500 mb-4">{stat}</p>
                        <ul className="space-y-3">
                          {features.map((f) => (
                            <li
                              key={f}
                              className="flex items-center gap-2.5 text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </BlurFade>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* ════════════════ Pricing Teaser ════════════════ */}
          <section id="pricing" className="py-24 md:py-32 border-y border-border/50 bg-muted/30" aria-label="Pricing">
            <div className="mx-auto max-w-5xl px-6">
              <BlurFade>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-500 mb-3 text-center">
                  Pricing
                </p>
                <h2 className="text-center text-3xl md:text-[2.75rem] font-extrabold tracking-[-0.03em] text-foreground font-display">
                  Free to start. Scale when ready.
                </h2>
                <p className="mt-3 text-center text-foreground/70 dark:text-muted-foreground max-w-lg mx-auto">
                  No credit card required. Upgrade or downgrade anytime.
                </p>
              </BlurFade>

              <div className="mt-14 grid gap-5 md:grid-cols-3">
                {PRICING_TIERS.map((tier, i) => (
                  <BlurFade
                    key={tier.name}
                    delay={i * 0.08}
                    direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                  >
                    <div
                      className={cn(
                        'relative rounded-2xl border p-7 transition-all duration-500 h-full flex flex-col',
                        tier.highlighted
                          ? 'border-primary-500/30 bg-card/70 shadow-lg shadow-primary-500/[0.05] md:-translate-y-2'
                          : 'border-border/50 bg-card/50 hover:bg-card/80 hover:shadow-lg',
                      )}
                    >
                      {tier.highlighted && (
                        <ShineBorder
                          shineColor={['#6366f1', '#34d399']}
                          borderWidth={1}
                          duration={12}
                        />
                      )}
                      {tier.highlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
                          Popular
                        </div>
                      )}
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{tier.description}</p>
                      </div>
                      <div className="mb-6">
                        <span className="text-4xl font-extrabold text-foreground font-display tracking-tight">
                          {tier.price}
                        </span>
                        {tier.period && (
                          <span className="text-sm text-muted-foreground">{tier.period}</span>
                        )}
                      </div>
                      <ul className="space-y-3 mb-8 flex-1">
                        {tier.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2.5 text-sm text-muted-foreground"
                          >
                            <Check className="h-4 w-4 shrink-0 text-primary-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={tier.href}
                        className={cn(
                          'block text-center rounded-xl py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                          tier.highlighted
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:shadow-lg hover:shadow-primary-500/20 dark:from-white dark:to-neutral-100 dark:text-neutral-900'
                            : 'border border-border bg-card hover:bg-muted text-foreground',
                        )}
                      >
                        {tier.cta}
                      </Link>
                    </div>
                  </BlurFade>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════ CTA ════════════════ */}
          <section className="relative overflow-hidden" aria-label="Call to action">
            {/* Background with Ripple */}
            <div className="absolute inset-0 bg-primary-950 dark:bg-[#09090b]" aria-hidden="true">
              <Ripple
                mainCircleSize={300}
                mainCircleOpacity={0.1}
                numCircles={6}
                className="opacity-30 dark:opacity-20"
              />
              <div className="noise absolute inset-0" />
            </div>

            <div className="relative z-10 py-28 md:py-40 text-center px-6">
              <BlurFade>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-white max-w-2xl mx-auto leading-tight font-display">
                  Ready to bring order
                  <br />
                  to your maintenance?
                </h2>
              </BlurFade>

              <BlurFade delay={0.1}>
                <p className="mt-5 text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
                  Join property managers who have streamlined their workflows with Maintix.
                  Set up your first property in under 5 minutes.
                </p>
              </BlurFade>

              {/* What you get */}
              <BlurFade delay={0.15}>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-400">
                  {['Unlimited properties', 'All roles included', 'Free support', 'No contracts'].map(
                    (item) => (
                      <span key={item} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent-400" />
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </BlurFade>

              <BlurFade delay={0.2}>
                <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/login"
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-neutral-900 transition-all duration-300 hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </BlurFade>
            </div>
          </section>
        </main>

        {/* ════════════════ Footer ════════════════ */}
        <footer className="border-t border-border/50 bg-card/30 py-12">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-[10px] font-bold text-white">
                    M
                  </div>
                  <span className="text-sm font-bold text-foreground">Maintix</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                  The modern property maintenance platform for teams that move fast.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                  Product
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Features', href: '#features' },
                    { label: 'How It Works', href: '#how-it-works' },
                    { label: 'Pricing', href: '#pricing' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                  Resources
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Documentation', href: '#' },
                    { label: 'Support', href: '#' },
                    { label: 'Status', href: '#' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                  Legal
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Privacy Policy', href: '#' },
                    { label: 'Terms of Service', href: '#' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Maintix. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  aria-label="GitHub"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  aria-label="Twitter"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
