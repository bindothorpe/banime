import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.noitatnemucod.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;