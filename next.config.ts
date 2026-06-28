import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 배포 최적화
  experimental: {
    optimizePackageImports: ['@anthropic-ai/sdk'],
  },
};

export default nextConfig;
