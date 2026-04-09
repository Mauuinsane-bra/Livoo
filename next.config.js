/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.getyourguide.com' },
      { protocol: 'https', hostname: 'cf.bstatic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'photo.hotellook.com' },
      { protocol: 'https', hostname: '**.getyourguide.com' },
    ],
  },
  serverExternalPackages: ['amadeus'],
}

module.exports = nextConfig
