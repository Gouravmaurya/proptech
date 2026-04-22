import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'photos.zillowstatic.com',
      },
      {
        protocol: 'https',
        hostname: '*.zillowstatic.com',
      },
    ],
  },
};

export default nextConfig;
