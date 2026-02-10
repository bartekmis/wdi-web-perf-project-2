import Link from "next/link";

// Optimized: Server Component with inline navigation data
// Eliminates: 1) /api/navigation fetch, 2) /jobs fetch on mount, 3) /jobs fetch on hover
// Navigation items are static - no need for API call
const NAV_ITEMS = [
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
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Job Hub</div>
        <Link href="/bundle-problem">Bundle Problem Page</Link>
        <div className="flex space-x-6">
          {NAV_ITEMS.map((item) => (
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
