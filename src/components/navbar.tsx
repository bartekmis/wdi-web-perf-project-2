import Link from "next/link";
import { Route } from "@/types/navbar";

const ROUTES: Route[] = [
  { label: "Home", href: "/" },
  { label: "Job Offers", href: "/offers" },
  { label: "CSR", href: "/csr" },
  { label: "SSR", href: "/ssr" },
  { label: "Suspense", href: "/suspense" },
  { label: "ISR", href: "/isr" },
  { label: "SuspenseVsSSR", href: "/suspense_vs_ssr" },
];

export const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold">Job Hub</div>
          <Link
            href="/bundle-problem"
            className="text-sm hover:text-blue-200 transition-colors"
          >
            Bundle Problem Page
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {ROUTES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
