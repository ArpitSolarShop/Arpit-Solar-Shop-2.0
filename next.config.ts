import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["handlebars", "puppeteer"],
  async redirects() {
    return [
      {
        source: '/about-us',
        destination: '/about/us',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/solar-in-:city',
        destination: '/solar-installation/:city',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'origin',
          },
        ],
      },
    ];
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tvchjcs3zk5ufafzm8vu.supabase.co",
      },
    ],
  },
};

export default nextConfig;