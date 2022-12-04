/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c1.scryfall.com",
        pathname: "/file/scryfall-cards/border_crop/front/**",
      },
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
        pathname: "/border_crop/front/**",
      },
    ],
  },
};

module.exports = nextConfig;
