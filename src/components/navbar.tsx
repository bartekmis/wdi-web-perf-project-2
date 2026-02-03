"use client";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Route } from "@/types/navbar";
import Link from "next/link";

export const Navbar = () => {
  const [items, setItems] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);
        const navResponse = await axios.get("/api/navigation");
        setItems(navResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching nav items:", error);
        setLoading(false);
      }
    };

    fetchNavItems();
  }, []);

  const loadingSkeletons = useMemo(
    () => Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="animate-pulse bg-blue-400 h-6 w-20 rounded"
      />
    )),
    []
  );

  if (loading) {
    return (
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Job Hub</div>
          <div className="flex space-x-4">{loadingSkeletons}</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Job Hub</div>
        <Link href="/bundle-problem">Bundle Problem Page</Link>
        <div className="flex space-x-6">
          {items.map((item) => (
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
