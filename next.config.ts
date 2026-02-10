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
    async headers() {
        if (process.env.NODE_ENV !== "production") {
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
        ];
    },
};

export default nextConfig;
