import { Route } from "@/types/navbar";

export async function GET(): Promise<Response> {
  return Response.json([
    { label: "Home", href: "/" },
    { label: "Job Offers", href: "/offers" },
    { label: "CSR", href: "/csr" },
    { label: "SSR", href: "/ssr" },
    { label: "Suspense", href: "/suspense" },
    { label: "ISR", href: "/isr" },
    { label: "SuspenseVsSSR", href: "/suspense_vs_ssr" },
  ] as Route[]);
}
