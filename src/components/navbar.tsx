"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Route } from "@/types/navbar";
import { Job } from "@/types/job";
import Link from "next/link";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

const LOADING_SKELETON = (
  <nav className="bg-blue-600 text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-xl font-bold">Job Hub</div>
      <div className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-blue-400 h-6 w-20 rounded"></div>
        ))}
      </div>
    </div>
  </nav>
);

export const Navbar = () => {
  const { data: items, isLoading: navLoading } = useQuery<Route[]>({
    queryKey: ["navigation"],
    queryFn: () => fetcher("/api/navigation"),
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`),
  });

  const jobCategories = useMemo(() => {
    if (!jobs) return [];
    const seen = new Set<string>();
    for (const job of jobs) {
      seen.add(job.category);
    }
    return [...seen];
  }, [jobs]);

  const handleItemHover = (item: Route) => {
    if (!jobs) return;
    const categoryJobs = jobs.filter((job: Job) => job.category === item.label || item.label.includes(job.category));
    console.log(`Hovered ${item.label}: Found ${categoryJobs.length} related jobs`);
  };

  if (navLoading || jobsLoading) {
    return LOADING_SKELETON;
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Job Hub</div>
        <Link href="/bundle-problem">Bundle Problem Page</Link>
        <div className="flex space-x-6">
          {items?.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded" onMouseEnter={() => handleItemHover(item)}>
              {item.label}
            </a>
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
