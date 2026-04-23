import Link from "next/link";
import { Route } from "@/types/navbar";
import { NavbarMobile } from "./navbar-mobile";

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
    <nav className="bg-blue-600 text-white shadow-lg min-h-[72px] relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-[72px]">
          <div className="text-xl font-bold">Job Hub</div>

          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/bundle-problem"
              className="hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded"
            >
              Bundle Problem Page
            </Link>
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

          <NavbarMobile items={ROUTES} />
        </div>
      </div>
    </nav>
  );
};
