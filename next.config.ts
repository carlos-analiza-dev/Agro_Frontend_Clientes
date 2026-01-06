import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "34.42.111.72"],
    qualities: [75, 85],
  },
};

export default nextConfig;
