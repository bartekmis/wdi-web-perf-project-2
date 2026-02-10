"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";

// Optimized CSR section:
// 1. Single fetch instead of N+1 (removed 6 redundant detail fetches)
// 2. Removed useEffect re-fetch on allJobs change (derived state instead)
// 3. Removed redundant search event re-fetch loop (6 category fetches per search)
// 4. Uses queryKey-based staleTime from QueryProvider (60s)
// 5. Sorting/filtering done client-side from cached data (no extra API calls)

export const SectionClient = () => {
  const [duration, setDuration] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");

  const { data: allJobs = [], isLoading } = useQuery({
    queryKey: ["jobs-client"],
    queryFn: async () => {
      const start = performance.now();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=6`
      );
      const json = await res.json();
      const end = performance.now();
      setDuration(end - start);
      return json as Job[];
    },
  });

  // Optimized: derive filtered/sorted jobs during render instead of useEffect + state
  const displayJobs = useMemo(() => {
    let jobs = [...allJobs];

    // Apply filter
    if (activeFilter) {
      jobs = jobs.filter((job) =>
        job.role.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }

    // Apply sort
    if (sortBy === "company") {
      jobs = jobs.toSorted((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
    } else if (sortBy === "position") {
      const positionOrder = { Junior: 1, Mid: 2, Senior: 3 };
      jobs = jobs.toSorted(
        (a, b) =>
          (positionOrder[a.position as keyof typeof positionOrder] || 0) -
          (positionOrder[b.position as keyof typeof positionOrder] || 0)
      );
    }

    return jobs;
  }, [allJobs, sortBy, activeFilter]);

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
              onChange={(e) => setSortBy(e.target.value)}
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
            onClick={() => setActiveFilter(filterQuery)}
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Filtruj
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayJobs.map((job: Job) => (
            <JobCard
              key={job.id}
              job={job}
              variant="client"
              showMetadata={true}
              metadata={{
                renderType: "CSR - Client Side Rendered",
              }}
              buttonText="See offer"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
