import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Limit for the Server Action
    },
    // --- ADD THIS LINE TO FIX YOUR ERROR ---
    middlewareClientMaxBodySize: '100mb', 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bqllrdpglkpxaohwmzgf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;