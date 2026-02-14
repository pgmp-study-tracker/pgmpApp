import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable standalone for Vercel deployment
  // output: "standalone",
  
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // Enable experimental features for better PWA support
  experimental: {
    // Enable PWA features
  },
};

export default nextConfig;
