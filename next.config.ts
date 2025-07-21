import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        port: '',
        pathname: '/i/teamlogos/nfl/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'static.www.nfl.com',
        port: '',
        pathname: '/image/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
