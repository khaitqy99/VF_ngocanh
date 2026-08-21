import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

loadEnvConfig(path.resolve(__dirname, "../.."));
loadEnvConfig(__dirname);

const require = createRequire(__filename);

function resolvePackageRoot(name: string): string {
  const candidates = [
    path.resolve(__dirname, "node_modules", name),
    path.resolve(__dirname, "../../node_modules", name),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "package.json"))) {
      return candidate;
    }
  }

  // Fallback via Node resolution (may land on dist/*).
  try {
    const resolved = require.resolve(name);
    let dir = path.dirname(resolved);
    while (dir !== path.dirname(dir)) {
      if (fs.existsSync(path.join(dir, "package.json"))) return dir;
      dir = path.dirname(dir);
    }
  } catch {
    // ignore
  }

  throw new Error(`Unable to resolve package root for ${name}`);
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL ?? "",
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
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: true,
  },
  output: "standalone",
  transpilePackages: ["@vinfast3s/supabase", "motion"],
  webpack: (config, { dev }) => {
    // Bare `@` aliases break scoped packages like `@tiptap/*` under Webpack.
    // `@/*` comes from tsconfig paths instead.
    const existingAlias = config.resolve.alias;
    const alias: Record<string, string | false | string[]> = Array.isArray(existingAlias)
      ? {}
      : { ...(existingAlias as Record<string, string | false | string[]>) };
    delete alias["@"];

    // Force TipTap peers to the hoisted install (avoids ENOENT on nested starter-kit paths).
    alias["@tiptap/core"] = resolvePackageRoot("@tiptap/core");
    alias["@tiptap/pm"] = resolvePackageRoot("@tiptap/pm");

    config.resolve.alias = alias;
    if (dev && process.env.DISABLE_HMR === "true") {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
