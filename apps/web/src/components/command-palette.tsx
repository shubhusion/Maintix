'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Home, Building2, Ticket, Users, Bell, Search } from 'lucide-react';
import { useProperties } from '@/hooks/use-properties';
import { useAuth } from '@/contexts/auth-context';
import { Role } from '@maintix/shared-types';
import { DialogTitle } from '@radix-ui/react-dialog';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { data: properties } = useProperties();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className="fixed inset-0 z-[100]"
    >
      <DialogTitle className="sr-only">Command Palette</DialogTitle>
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-[20%] z-[101] w-full max-w-lg -translate-x-1/2 rounded-xl border bg-popover shadow-2xl">
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Command.Input
            placeholder="Type a command or search..."
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Navigation"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <CommandItem
              onSelect={() => navigate('/dashboard')}
              icon={<Home className="h-4 w-4" />}
            >
              Dashboard
            </CommandItem>
            <CommandItem
              onSelect={() => navigate('/dashboard/properties')}
              icon={<Building2 className="h-4 w-4" />}
            >
              Properties
            </CommandItem>
            <CommandItem
              onSelect={() => navigate('/dashboard/tickets')}
              icon={<Ticket className="h-4 w-4" />}
            >
              Tickets
            </CommandItem>
            {user?.role === Role.MANAGER && (
              <CommandItem
                onSelect={() => navigate('/dashboard/users')}
                icon={<Users className="h-4 w-4" />}
              >
                Users
              </CommandItem>
            )}
            <CommandItem
              onSelect={() => navigate('/dashboard/notifications')}
              icon={<Bell className="h-4 w-4" />}
            >
              Notifications
            </CommandItem>
          </Command.Group>

          {properties && properties.length > 0 && (
            <Command.Group
              heading="Properties"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {properties.map((prop) => (
                <CommandItem
                  key={prop.id}
                  onSelect={() => navigate(`/dashboard/properties/${prop.id}`)}
                  icon={<Building2 className="h-4 w-4" />}
                >
                  {prop.name}
                </CommandItem>
              ))}
            </Command.Group>
          )}

          <Command.Group
            heading="Actions"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <CommandItem
              onSelect={() => navigate('/dashboard/tickets?action=create')}
              icon={<Ticket className="h-4 w-4" />}
            >
              Create New Ticket
            </CommandItem>
            {user?.role === Role.MANAGER && (
              <CommandItem
                onSelect={() => navigate('/dashboard/properties?action=create')}
                icon={<Building2 className="h-4 w-4" />}
              >
                Create New Property
              </CommandItem>
            )}
          </Command.Group>
        </Command.List>

        <div className="border-t px-3 py-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Navigate with{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">↑↓</kbd>
          </span>
          <span>
            Select with{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">↵</kbd>
          </span>
          <span>
            Close with{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">Esc</kbd>
          </span>
        </div>
      </div>
    </Command.Dialog>
  );
}

function CommandItem({
  children,
  onSelect,
  icon,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
    >
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </Command.Item>
  );
}
