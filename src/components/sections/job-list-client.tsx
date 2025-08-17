"use client";

import { Suspense, useState, useEffect } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";

const JobList = ({ initialJobs }: { initialJobs: Job[] }) => {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: jobs } = useSuspenseQuery({
    queryKey: ["jobs-ppr"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`);
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const allJobs: Job[] = await res.json();
      return allJobs.slice(0, 6);
    },
    initialData: initialJobs,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    let processed = [...jobs];

    if (sortBy === "company") {
      processed = processed.sort((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
    } else if (sortBy === "position") {
      const positionOrder = { Junior: 1, Mid: 2, Senior: 3 };
      processed = processed.sort(
        (a, b) =>
          (positionOrder[a.position as keyof typeof positionOrder] || 0) -
          (positionOrder[b.position as keyof typeof positionOrder] || 0)
      );
    }

    setFilteredJobs(processed);
  }, [jobs, sortBy]);

  useEffect(() => {
    const handleSearch = async (event: Event) => {
      const customEvent = event as CustomEvent;
      const { queryString } = customEvent.detail;

      if (!queryString) {
        setFilteredJobs(jobs);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?${queryString}`
        );
        if (!res.ok) throw new Error("Search failed");

        const searchResults: Job[] = await res.json();
        setFilteredJobs(searchResults.slice(0, 6));
      } catch (error) {
        console.error("Search failed:", error);
        setFilteredJobs(jobs);
      }
    };

    const handleSort = (event: Event) => {
      const customEvent = event as CustomEvent;
      setSortBy(customEvent.detail.sortBy);
    };

    window.addEventListener("jobSearch", handleSearch);
    window.addEventListener("jobSort", handleSort);

    return () => {
      window.removeEventListener("jobSearch", handleSearch);
      window.removeEventListener("jobSort", handleSort);
    };
  }, [jobs]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} variant="ppr" buttonText="See offer" />
      ))}
    </div>
  );
};

const JobListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded"></div>
      </Card>
    ))}
  </div>
);

export const JobListClient = ({ initialJobs }: { initialJobs: Job[] }) => {
  return (
    <Suspense fallback={<JobListSkeleton />}>
      <JobList initialJobs={initialJobs} />
    </Suspense>
  );
};
