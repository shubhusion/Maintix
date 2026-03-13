import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  title: 'Properties',
};

export default function PropertiesServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
