import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Larger uploads forwarded via server actions if we use them
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;