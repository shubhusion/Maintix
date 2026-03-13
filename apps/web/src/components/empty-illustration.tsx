'use client';

import { cn } from '@/lib/utils';

interface EmptyIllustrationProps {
  type: 'properties' | 'tickets' | 'users' | 'notifications' | 'search' | 'no-data';
  className?: string;
}

export function EmptyIllustration({ type, className }: EmptyIllustrationProps) {
  const illustrations = {
    properties: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-32 w-32', className)}>
        {/* Background circle */}
        <circle cx="100" cy="100" r="80" className="fill-primary/5" />
        
        {/* Building base */}
        <rect x="60" y="70" width="80" height="70" rx="4" className="fill-primary/20" />
        <rect x="65" y="75" width="70" height="60" rx="2" className="fill-primary/10" />
        
        {/* Windows */}
        <rect x="72" y="82" width="12" height="12" rx="2" className="fill-primary/40" />
        <rect x="92" y="82" width="12" height="12" rx="2" className="fill-primary/40" />
        <rect x="112" y="82" width="12" height="12" rx="2" className="fill-primary/40" />
        <rect x="72" y="102" width="12" height="12" rx="2" className="fill-primary/40" />
        <rect x="92" y="102" width="12" height="12" rx="2" className="fill-primary/40" />
        <rect x="112" y="102" width="12" height="12" rx="2" className="fill-primary/40" />
        <rect x="72" y="122" width="12" height="12" rx="2" className="fill-primary/40" />
        <rect x="92" y="122" width="12" height="12" rx="2" className="fill-primary/40" />
        <rect x="112" y="122" width="12" height="12" rx="2" className="fill-primary/40" />
        
        {/* Door */}
        <rect x="90" y="120" width="20" height="20" rx="2" className="fill-primary/30" />
        
        {/* Roof */}
        <path d="M55 70 L100 45 L145 70" className="stroke-primary/40" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Decorative elements */}
        <circle cx="100" cy="35" r="4" className="fill-warning-500/40" />
        <circle cx="150" cy="60" r="3" className="fill-primary/20" />
        <circle cx="50" cy="60" r="3" className="fill-primary/20" />
      </svg>
    ),
    
    tickets: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-32 w-32', className)}>
        {/* Background circle */}
        <circle cx="100" cy="100" r="80" className="fill-warning-500/5" />
        
        {/* Ticket base */}
        <rect x="50" y="60" width="100" height="80" rx="4" className="fill-warning-500/20" />
        <rect x="55" y="65" width="90" height="70" rx="2" className="fill-background" />
        
        {/* Ticket lines */}
        <rect x="65" y="75" width="70" height="4" rx="2" className="fill-warning-500/40" />
        <rect x="65" y="85" width="50" height="3" rx="1.5" className="fill-muted-foreground/30" />
        <rect x="65" y="93" width="60" height="3" rx="1.5" className="fill-muted-foreground/30" />
        <rect x="65" y="101" width="55" height="3" rx="1.5" className="fill-muted-foreground/30" />
        
        {/* Ticket stub */}
        <circle cx="50" cy="90" r="6" className="fill-background" />
        <circle cx="150" cy="90" r="6" className="fill-background" />
        
        {/* Status badge */}
        <rect x="115" y="115" width="20" height="8" rx="4" className="fill-primary/30" />
        <circle cx="120" cy="119" r="2" className="fill-primary" />
        
        {/* Decorative elements */}
        <circle cx="70" cy="50" r="4" className="fill-warning-500/30" />
        <circle cx="130" cy="55" r="3" className="fill-primary/20" />
        <circle cx="140" cy="140" r="5" className="fill-warning-500/20" />
      </svg>
    ),
    
    users: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-32 w-32', className)}>
        {/* Background circle */}
        <circle cx="100" cy="100" r="80" className="fill-accent-500/5" />
        
        {/* Person 1 (front) */}
        <circle cx="100" cy="85" r="20" className="fill-primary/30" />
        <path d="M65 145 C65 120 135 120 135 145" className="fill-primary/20" />
        
        {/* Person 2 (back left) */}
        <circle cx="70" cy="75" r="15" className="fill-primary/20" />
        <path d="M45 135 C45 115 95 115 95 135" className="fill-primary/15" />
        
        {/* Person 3 (back right) */}
        <circle cx="130" cy="75" r="15" className="fill-primary/20" />
        <path d="M105 135 C105 115 155 115 155 135" className="fill-primary/15" />
        
        {/* Decorative elements */}
        <circle cx="60" cy="50" r="4" className="fill-accent-500/30" />
        <circle cx="145" cy="55" r="3" className="fill-primary/20" />
        <circle cx="150" cy="130" r="4" className="fill-accent-500/20" />
      </svg>
    ),
    
    notifications: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-32 w-32', className)}>
        {/* Background circle */}
        <circle cx="100" cy="100" r="80" className="fill-muted/50" />
        
        {/* Bell base */}
        <path d="M100 45 C120 45 135 65 135 85 L135 115 L65 115 L65 85 C65 65 80 45 100 45" className="fill-muted-foreground/20" />
        <path d="M100 40 L100 45" className="stroke-muted-foreground/40" strokeWidth="4" strokeLinecap="round" />
        
        {/* Bell clapper */}
        <circle cx="100" cy="115" r="8" className="fill-muted-foreground/30" />
        
        {/* Sound waves */}
        <path d="M145 75 C150 80 150 90 145 95" className="stroke-muted-foreground/20" strokeWidth="3" strokeLinecap="round" />
        <path d="M150 65 C158 75 158 95 150 105" className="stroke-muted-foreground/15" strokeWidth="3" strokeLinecap="round" />
        <path d="M55 75 C50 80 50 90 55 95" className="stroke-muted-foreground/20" strokeWidth="3" strokeLinecap="round" />
        
        {/* X mark (indicating no notifications) */}
        <circle cx="140" cy="60" r="12" className="fill-error-500/20" />
        <path d="M135 55 L145 65 M145 55 L135 65" className="stroke-error-500" strokeWidth="2.5" strokeLinecap="round" />
        
        {/* Decorative elements */}
        <circle cx="65" cy="55" r="3" className="fill-muted-foreground/20" />
        <circle cx="75" cy="140" r="4" className="fill-muted/40" />
      </svg>
    ),
    
    search: (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-32 w-32', className)}>
        {/* Background circle */}
        <circle cx="100" cy="100" r="80" className="fill-primary/5" />
        
        {/* Magnifying glass */}
        <circle cx="90" cy="90" r="35" className="stroke-primary/40" strokeWidth="5" />
        <line x1="115" y1="115" x2="145" y2="145" className="stroke-primary/40" strokeWidth="5" strokeLinecap="round" />
        
        {/* Question mark inside */}
        <path d="M85 80 C85 75 95 75 95 80 C95 85 85 85 85 90 L85 92" className="stroke-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="90" cy="98" r="2" className="fill-primary" />
        
        {/* Decorative elements */}
        <circle cx="140" cy="60" r="4" className="fill-primary/20" />
        <circle cx="60" cy="130" r="3" className="fill-primary/20" />
        <circle cx="145" cy="135" r="5" className="fill-primary/10" />
      </svg>
    ),
    
    'no-data': (
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-32 w-32', className)}>
        {/* Background circle */}
        <circle cx="100" cy="100" r="80" className="fill-muted/30" />
        
        {/* Chart base */}
        <rect x="50" y="60" width="100" height="80" rx="4" className="fill-muted-foreground/10" />
        
        {/* Chart bars */}
        <rect x="60" y="100" width="15" height="30" rx="2" className="fill-muted-foreground/20" />
        <rect x="82" y="85" width="15" height="45" rx="2" className="fill-muted-foreground/20" />
        <rect x="104" y="70" width="15" height="60" rx="2" className="fill-muted-foreground/20" />
        <rect x="126" y="90" width="15" height="40" rx="2" className="fill-muted-foreground/20" />
        
        {/* X overlay */}
        <circle cx="100" cy="100" r="50" className="fill-background/80" />
        <path d="M75 75 L125 125 M125 75 L75 125" className="stroke-muted-foreground/40" strokeWidth="4" strokeLinecap="round" />
        
        {/* Decorative elements */}
        <circle cx="60" cy="50" r="3" className="fill-muted-foreground/20" />
        <circle cx="145" cy="55" r="4" className="fill-muted-foreground/15" />
        <circle cx="140" cy="140" r="3" className="fill-muted-foreground/20" />
      </svg>
    ),
  };

  return illustrations[type];
}
