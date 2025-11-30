
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  distDir: 'dist',
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pubgmobile.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.apks.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.z.wiki',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hv.z.wiki',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-pubgm-cms.vasdgame.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    allowedDevOrigins: ["*.apks.cc", "*.154.36.164.243"],
  },
};

export default nextConfig;
