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
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/residential',
        destination: '/solutions/residential',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/',
        permanent: true,
      },
      {
        source: '/terms-conditions',
        destination: '/',
        permanent: true,
      },
      // Missing /about redirect (old site had /about as a parent or page, new site uses /about/us)
      {
        source: '/about',
        destination: '/about/us',
        permanent: true,
      },
      {
        source: '/solar-in-:city',
        destination: '/solar-installation/:city',
        permanent: true,
      },
      {
        source: '/product/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
      // Catch wildcards for old brand prefixes that were standalone pages
      {
        source: '/:path(tata-solar-.*)',
        destination: '/products/:path',
        permanent: true,
      },
      {
        source: '/:path(reliance-.*)',
        destination: '/products/:path',
        permanent: true,
      },
      {
        source: '/:path(shakti-solar-.*)',
        destination: '/products/:path',
        permanent: true,
      }
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