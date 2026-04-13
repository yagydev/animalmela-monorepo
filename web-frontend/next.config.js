/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

/** If web-frontend has no .env.local, pick Mongo URI from monorepo root .env (server-side events API). */
function mergeParentMongoEnv() {
  const keys = new Set(['MONGODB_URI', 'DATABASE_URL']);
  const applyFile = (absPath) => {
    try {
      const raw = fs.readFileSync(absPath, 'utf8');
      for (const line of raw.split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#')) continue;
        const eq = t.indexOf('=');
        if (eq < 1) continue;
        const key = t.slice(0, eq).trim();
        if (!keys.has(key) || process.env[key]) continue;
        let val = t.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    } catch {
      /* missing */
    }
  };
  applyFile(path.join(__dirname, '..', '.env'));
  applyFile(path.join(__dirname, '..', '.env.local'));
}
mergeParentMongoEnv();
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline',
  },
  buildExcludes: [
    /middleware-manifest\.json$/,
    /app-build-manifest\.json$/,
    /build-manifest\.json$/,
    /react-loadable-manifest\.json$/,
  ],
  // Do not use a catch-all URL pattern: caching document navigations breaks deep links
  // after deploys (stale HTML) and can surface wrong offline shells for /marketplace/*.
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static',
        expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'next-image', expiration: { maxEntries: 64 } },
    },
  ],
});

const nextConfig = {
  // App Router does not support next.config i18n; client translations use react-i18next (I18nProvider).
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force dynamic rendering for all pages
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kisaanmela-uploads.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'kisaanmela-uploads.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      { source: '/marketplace/agri', destination: '/marketplace', permanent: true },
      { source: '/marketplace/agri/:path*', destination: '/marketplace', permanent: true },
      { source: '/marketplace/products', destination: '/marketplace', permanent: true },
      { source: '/marketplace/products/:path*', destination: '/marketplace', permanent: true },
      { source: '/marketplace/auth', destination: '/login', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
