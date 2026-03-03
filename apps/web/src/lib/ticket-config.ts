import { TicketStatus, Priority } from '@maintix/shared-types';
import {
  Clock,
  UserCheck,
  Play,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

export const statusConfig: Record<
  string,
  { label: string; variant: BadgeVariant; icon: typeof Clock }
> = {
  [TicketStatus.OPEN]: { label: 'Open', variant: 'secondary', icon: Clock },
  [TicketStatus.ASSIGNED]: {
    label: 'Assigned',
    variant: 'default',
    icon: UserCheck,
  },
  [TicketStatus.IN_PROGRESS]: {
    label: 'In Progress',
    variant: 'warning',
    icon: Play,
  },
  [TicketStatus.AWAITING_APPROVAL]: {
    label: 'Awaiting Approval',
    variant: 'outline',
    icon: AlertCircle,
  },
  [TicketStatus.DONE]: {
    label: 'Done',
    variant: 'success',
    icon: CheckCircle,
  },
  [TicketStatus.CANCELLED]: {
    label: 'Cancelled',
    variant: 'destructive',
    icon: XCircle,
  },
};

export const priorityConfig: Record<
  string,
  { label: string; color: string }
> = {
  [Priority.LOW]: { label: 'Low', color: 'text-neutral-500' },
  [Priority.MEDIUM]: { label: 'Medium', color: 'text-primary-500' },
  [Priority.HIGH]: { label: 'High', color: 'text-warning-500' },
  [Priority.URGENT]: { label: 'Urgent', color: 'text-error-500' },
};
