import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['a.venum.com', 'cdn.shopify.com', 'images.unsplash.com', 'res.cloudinary.com', 'localhost', "www.venum.com", "venum.com", "cloudinary.com", "res.cloudinary.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
