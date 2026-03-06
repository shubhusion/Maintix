import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | Maintix',
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
