'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Building2,
  Ticket,
  Users,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useUnreadCount } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CommandPalette } from '@/components/command-palette';
import { EnhancedBreadcrumbs } from '@/components/enhanced-breadcrumbs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Role } from '@maintix/shared-types';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, roles: 'all' as const },
  {
    name: 'Properties',
    href: '/dashboard/properties',
    icon: Building2,
    roles: 'all' as const,
  },
  {
    name: 'Tickets',
    href: '/dashboard/tickets',
    icon: Ticket,
    roles: 'all' as const,
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: [Role.MANAGER] as Role[],
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: SettingsIcon,
    roles: 'all' as const,
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count ?? 0;
  const sidebarRef = useRef<HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Trap focus inside mobile sidebar when open
  useEffect(() => {
    if (!sidebarOpen || !sidebarRef.current) return;
    const sidebar = sidebarRef.current;
    const focusableEls = sidebar.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusableEls.length > 0) focusableEls[0].focus();
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const filteredNav = navigation.filter(
    (item) => item.roles === 'all' || (user && item.roles.includes(user.role as Role)),
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CommandPalette />
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        role={sidebarOpen ? 'dialog' : undefined}
        aria-modal={sidebarOpen ? true : undefined}
        aria-label="Main navigation"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64',
          !sidebarOpen && (collapsed ? 'lg:w-16' : 'lg:w-64'),
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex h-16 items-center gap-2 border-b',
            collapsed ? 'px-3 justify-center lg:px-3' : 'px-6',
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            M
          </div>
          {!collapsed && <span className="text-lg font-semibold">Maintix</span>}
          <button
            className={cn('lg:hidden', collapsed ? '' : 'ml-auto')}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Sidebar navigation" className="flex-1 space-y-1 p-4">
          {filteredNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.name : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'lg:justify-center lg:px-0',
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex border-t p-2 justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User info */}
        <div className="border-t p-4">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogoutClick}
                className="shrink-0"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role.toLowerCase()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogoutClick}
                className="shrink-0"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Breadcrumbs */}
          <EnhancedBreadcrumbs />

          {/* Mobile page title */}
          <h1 className="text-lg font-semibold sm:hidden truncate">Dashboard</h1>

          <div className="flex-1" />

          {/* Command Palette Trigger */}
          <button
            onClick={() =>
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
            }
            className="hidden sm:flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search...</span>
            <kbd className="ml-2 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Link href="/dashboard/notifications" className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  aria-hidden="true"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
