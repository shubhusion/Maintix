import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — Maintix',
  description:
    'Sign in to your Maintix property maintenance platform.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
