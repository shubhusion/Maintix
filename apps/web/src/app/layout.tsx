import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'Maintix — Multi-Property Maintenance Platform',
    template: '%s | Maintix',
  },
  description:
    'Streamline maintenance workflows across all your properties. Create tickets, assign technicians, and track progress in real-time.',
  
  // Viewport
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  
  // Theme color for browser chrome
  themeColor: '#6366f1',
  
  // Favicon
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/favicon.svg',
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maintix.app',
    siteName: 'Maintix',
    title: 'Maintix — Multi-Property Maintenance Platform',
    description: 'Streamline maintenance workflows across all your properties. Create tickets, assign technicians, and track progress in real-time.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Maintix - Property Maintenance Management',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Maintix — Multi-Property Maintenance Platform',
    description: 'Streamline maintenance workflows across all your properties.',
    images: ['/twitter-image.svg'],
    creator: '@maintix',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
