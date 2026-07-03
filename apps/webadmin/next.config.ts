import path from "node:path";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

loadEnvConfig(path.resolve(__dirname, "../.."));
loadEnvConfig(__dirname);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "vinfastauto.com", pathname: "/**" },
      { protocol: "https", hostname: "static-cms-prod.vinfastauto.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" },
      { protocol: "https", hostname: "**.vercel.app", pathname: "/**" },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: true,
  },
  output: "standalone",
  transpilePackages: ["@vinfast3s/supabase", "motion"],
  webpack: (config, { dev }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../webclient/src"),
    };
    if (dev && process.env.DISABLE_HMR === "true") {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
