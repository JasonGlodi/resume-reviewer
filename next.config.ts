import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wjsg2q04musnvvg5.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
