import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ticket Details | Maintix',
};

export default function TicketDetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
