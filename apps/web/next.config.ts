import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  devIndicators: false,
  transpilePackages: ['@maintix/shared-types'],
  
  // Fix for monorepo lockfile detection - use absolute path
  outputFileTracingRoot: path.resolve(__dirname, '../..'),
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
