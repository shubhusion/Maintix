import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Details | Maintix',
};

export default function PropertyDetailsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
