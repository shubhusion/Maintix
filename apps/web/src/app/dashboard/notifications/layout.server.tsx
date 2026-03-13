import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  title: 'Notifications',
};

export default function NotificationsServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
