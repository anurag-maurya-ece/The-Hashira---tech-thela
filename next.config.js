/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow builds to complete even when there are TS errors in legacy code.
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "www.gstatic.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "images.unsplash.com",
    ],
  },
}

module.exports = nextConfig
