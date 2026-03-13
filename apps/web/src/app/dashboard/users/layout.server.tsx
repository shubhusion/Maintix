import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
};

export default function UsersServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
