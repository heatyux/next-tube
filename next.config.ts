import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '2fptkbob8s.ufs.sh',
      },
    ],
  },
}

export default nextConfig
