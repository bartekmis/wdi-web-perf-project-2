import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jobs-api-ej8r.onrender.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Optimized: auto-transform barrel imports to direct imports at build time
  // Reduces cold start time and bundle size for these heavy libraries
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
    ],
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }

    return [
      {
        source: "/isr",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=600, s-maxage=3600, stale-while-revalidate=14400",
          },
        ],
      },
      // Optimized: cache static assets for 1 year (immutable)
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;