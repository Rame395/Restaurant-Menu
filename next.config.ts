import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - To allow connecting from your local network device
  allowedDevOrigins: ['192.168.100.27'],
};

export default nextConfig;
