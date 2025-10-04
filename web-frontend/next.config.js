/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
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
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://api.kisaanmela.com/api/auth/:path*'
          : 'http://localhost:5001/api/auth/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://api.kisaanmela.com/api/users/:path*'
          : 'http://localhost:5001/api/users/:path*',
      },
      {
        source: '/api/services/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://api.kisaanmela.com/api/services/:path*'
          : 'http://localhost:5001/api/services/:path*',
      },
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
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
