import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6366f1',
};

export const metadata: Metadata = {
  title: 'Sign In — Maintix',
  description: 'Sign in to your Maintix property maintenance platform.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
