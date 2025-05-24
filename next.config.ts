// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/concepts.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Adjust if needed for specific origins
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ]
  },
};

export default nextConfig;