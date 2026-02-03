"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";

export const SectionClient = () => {
  const [duration, setDuration] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: allJobs = [], isLoading } = useQuery({
    queryKey: ["jobs-client"],
    queryFn: async () => {
      const start = performance.now();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`);
      const json = await res.json();

      // ✅ FIXED: Removed waterfall loop that was fetching same data 6 times
      // The job details are already in 'json' - no need to refetch!

      const end = performance.now();
      setDuration(end - start);
      return json;
    },
    staleTime: 60000, // ✅ FIXED: Cache for 1 minute instead of refetching constantly
    refetchOnWindowFocus: false, // ✅ FIXED: Don't refetch on tab switch
  });

  // ✅ FIXED: Calculate filtered/sorted jobs with useMemo instead of useEffect + API call
  const processedJobs = useMemo(() => {
    if (!allJobs.length) return [];

    let jobs = [...allJobs];

    // Apply search filter
    if (searchQuery) {
      jobs = jobs.filter((job: Job) =>
        job.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === "company") {
      jobs.sort((a: Job, b: Job) =>
        a.companyName.localeCompare(b.companyName)
      );
    } else if (sortBy === "position") {
      const positionOrder = { Junior: 1, Mid: 2, Senior: 3 };
      jobs.sort(
        (a: Job, b: Job) =>
          (positionOrder[a.position as keyof typeof positionOrder] || 0) -
          (positionOrder[b.position as keyof typeof positionOrder] || 0)
      );
    }

    return jobs.slice(0, 6);
  }, [allJobs, sortBy, searchQuery]);

  // ✅ FIXED: Use refs to store stable references for event handlers
  const allJobsRef = useRef(allJobs);
  useEffect(() => {
    allJobsRef.current = allJobs;
  }, [allJobs]);

  // ✅ FIXED: Use useCallback for stable event handlers
  const handleSearch = useCallback((event: CustomEvent) => {
    const { queryString } = event.detail;
    const params = new URLSearchParams(queryString);
    const roleFilter = params.get("role") || "";
    setSearchQuery(roleFilter);

    // ✅ FIXED: No API call - filtering happens in useMemo
    // Category logging using cached data
    const jobs = allJobsRef.current;
    if (jobs.length > 0) {
      jobs.slice(0, 6).forEach((job: Job) => {
        const sameCategory = jobs.filter(
          (j: Job) => j.category === job.category
        );
        console.log(
          `Job ${job.role} has ${sameCategory.length} jobs in same category`
        );
      });
    }
  }, []);

  const handleSort = useCallback((event: CustomEvent) => {
    setSortBy(event.detail.sortBy);
  }, []);

  // ✅ FIXED: Event listeners won't recreate unnecessarily
  useEffect(() => {
    window.addEventListener("jobSearch", handleSearch as EventListener);
    window.addEventListener("jobSort", handleSort as EventListener);

    return () => {
      window.removeEventListener("jobSearch", handleSearch as EventListener);
      window.removeEventListener("jobSort", handleSort as EventListener);
    };
  }, [handleSearch, handleSort]);

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Client-Side Rendered Jobs
          </h2>
          <div className="h-12 bg-gray-200 rounded mb-4" />
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
        </div>
      </section>
    );
  }

  if (!allJobs || allJobs.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center p-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Oferta pracy nie znaleziona.
          </h1>
        </div>
      </main>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Client-Side Rendered Jobs</h2>
          <p className="text-gray-600">
            Rendering technique: CSR | Load time: {duration.toFixed(2)}ms
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="font-medium">
              Sortuj według:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) =>
                window.dispatchEvent(
                  new CustomEvent("jobSort", {
                    detail: { sortBy: e.target.value },
                  })
                )
              }
              className="border rounded px-2 py-1"
            >
              <option value="newest">Najnowsze</option>
              <option value="company">Firmy</option>
              <option value="position">Pozycji</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtruj po nazwie stanowiska..."
              className="border rounded px-4 py-2 w-full md:w-64"
            />
          </div>
          <button
            onClick={() => {
              const queryParams = new URLSearchParams();
              if (filterQuery) queryParams.append("role", filterQuery);
              window.dispatchEvent(
                new CustomEvent("jobSearch", {
                  detail: { queryString: queryParams.toString() },
                })
              );
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Filtruj
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedJobs.map((job: Job) => (
            <JobCard
              key={job.id}
              job={job}
              variant="client"
              showMetadata={true}
              metadata={{
                renderType: "CSR - Client Side Rendered",
              }}
              buttonText="See offer"
              onApply={(job) => {
                // ✅ FIXED: No API call needed - job data is already available
                console.log(`Viewing offer: ${job.role}`);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
