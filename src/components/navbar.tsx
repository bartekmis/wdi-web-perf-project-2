"use client";

import useSWR from "swr";
import { Route } from "@/types/navbar";
import { Job } from "@/types/job";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const Navbar = () => {
  // SWR provides caching, deduplication, and revalidation
  const { data: items, isLoading: navLoading } = useSWR<Route[]>(
    "/api/navigation",
    fetcher
  );

  const { data: jobs, isLoading: jobsLoading } = useSWR<Job[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`,
    fetcher
  );

  const loading = navLoading || jobsLoading;

  // Derive categories from jobs data (no separate state needed)
  const jobCategories = jobs
    ? [...new Set(jobs.map((job) => job.category))]
    : [];

  if (loading) {
    return (
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Job Hub</div>
          <div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-blue-400 h-6 w-20 rounded"
              ></div>
            ))}
          </div>
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
          {items?.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded"
            >
              {item.label}
            </Link>
          ))}
          {jobCategories.length > 0 && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="opacity-70">Categories:</span>
              <span className="opacity-70">{jobCategories.length}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
