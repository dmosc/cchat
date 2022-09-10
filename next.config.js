/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.githubusercontent.com"]
  },
  async redirects() {
    return [
      {
        source: "/explorer",
        destination: "/",
        permanent: true
      },
      {
        source: "/explorer/:owner",
        destination: "/",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
