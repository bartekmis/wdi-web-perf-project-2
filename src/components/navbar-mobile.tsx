"use client";

import { useState } from "react";
import Link from "next/link";
import { Route } from "@/types/navbar";

export const NavbarMobile = ({ items }: { items: Route[] }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden p-2 rounded hover:bg-blue-700 transition-colors"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span className="block w-6 h-0.5 bg-white mb-1.5" />
        <span className="block w-6 h-0.5 bg-white mb-1.5" />
        <span className="block w-6 h-0.5 bg-white" />
      </button>

      {menuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-blue-600 px-4 pb-4 flex flex-col space-y-1 shadow-lg z-50">
          <Link
            href="/bundle-problem"
            className="hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded"
            onClick={() => setMenuOpen(false)}
          >
            Bundle Problem Page
          </Link>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
