/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;
