
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - eslint config is valid but types might be missing in this version
  eslint: {
    ignoreDuringBuilds: true,
  },
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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

export default nextConfig;