import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tickets | Maintix',
};

export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
