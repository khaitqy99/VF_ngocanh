import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "static-cms-prod.vinfastauto.com" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/vinfast-data-01/**" },
      { protocol: "https", hostname: "vinfastauto.com", pathname: "/themes/**" },
    ],
  },
};

export default nextConfig;
