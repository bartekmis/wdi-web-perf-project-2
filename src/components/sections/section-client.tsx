"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";

// Hoisted module-level constants — never recreated on render
const POSITION_ORDER = { Junior: 1, Mid: 2, Senior: 3 } as const;
const JOB_METADATA = { renderType: "CSR - Client Side Rendered" };

export const SectionClient = () => {
  const [sortBy, setSortBy] = useState<string>("newest");
  // null = no search active; Job[] = search results (may be empty)
  const [searchResults, setSearchResults] = useState<Job[] | null>(null);
  // Uncontrolled input — no re-render on every keystroke
  const filterQueryRef = useRef<HTMLInputElement>(null);
  // Ref so the event listener registered once can always read current allJobs
  const allJobsRef = useRef<Job[]>([]);

  // Duration returned from query result, not set as a side effect inside queryFn
  const { data, isLoading } = useQuery({
    queryKey: ["jobs-client"],
    queryFn: async () => {
      const start = performance.now();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`);
      const jobs: Job[] = await res.json();
      return { jobs, duration: performance.now() - start };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

  const allJobs = data?.jobs ?? [];
  const duration = data?.duration ?? 0;

  // Keep ref current so event handlers (registered once) see fresh data
  useEffect(() => {
    allJobsRef.current = allJobs;
  }, [allJobs]);

  // Derived display list — no state, no effect, no extra fetch
  const displayJobs = useMemo(() => {
    const base = (searchResults ?? allJobs).slice(0, 6);
    if (sortBy === "company") {
      return [...base].sort((a, b) => a.companyName.localeCompare(b.companyName));
    }
    if (sortBy === "position") {
      return [...base].sort(
        (a, b) =>
          (POSITION_ORDER[a.position as keyof typeof POSITION_ORDER] || 0) -
          (POSITION_ORDER[b.position as keyof typeof POSITION_ORDER] || 0)
      );
    }
    return base;
  }, [searchResults, allJobs, sortBy]);

  // Listeners registered once — allJobsRef used for current data instead of closure capture
  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      const fetchFilteredJobs = async () => {
        const { queryString } = event.detail;
        const apiUrl = queryString
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?${queryString}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`;

        try {
          const res = await fetch(apiUrl);
          const jobs: Job[] = await res.json();
          const results = jobs.slice(0, 6);

          // Category counts computed from already-cached allJobsRef — no extra fetch
          results.forEach((job) => {
            const sameCategory = allJobsRef.current.filter(
              (j) => j.category === job.category
            );
            console.log(
              `Job ${job.role} has ${sameCategory.length} jobs in same category`
            );
          });

          setSearchResults(results);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults(allJobsRef.current.slice(0, 6));
        }
      };

      fetchFilteredJobs();
    };

    const handleSort = (event: CustomEvent) => {
      setSortBy(event.detail.sortBy);
    };

    window.addEventListener("jobSearch", handleSearch as EventListener);
    window.addEventListener("jobSort", handleSort as EventListener);

    return () => {
      window.removeEventListener("jobSearch", handleSearch as EventListener);
      window.removeEventListener("jobSort", handleSort as EventListener);
    };
  }, []); // empty deps — stable registration, current data via ref

  // Stable callback — no unnecessary re-renders of JobCard
  const handleApply = useCallback((job: Job) => {
    console.log(`Viewing offer: ${job.role}`);
  }, []);

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
              ref={filterQueryRef}
              type="text"
              defaultValue=""
              placeholder="Filtruj po nazwie stanowiska..."
              className="border rounded px-4 py-2 w-full md:w-64"
            />
          </div>
          <button
            onClick={() => {
              const queryParams = new URLSearchParams();
              const query = filterQueryRef.current?.value;
              if (query) queryParams.append("role", query);
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
          {displayJobs.map((job: Job) => (
            <JobCard
              key={job.id}
              job={job}
              variant="client"
              showMetadata={true}
              metadata={JOB_METADATA}
              buttonText="See offer"
              onApply={handleApply}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
