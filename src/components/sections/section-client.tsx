"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";
import axios from "axios";

export const SectionClient = () => {
  const [duration, setDuration] = useState<number>(0);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: allJobs = [], isLoading } = useQuery({
    queryKey: ["jobs-client"],
    queryFn: async () => {
      const start = performance.now();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`);
      const json = await res.json();

      for (const job of json.slice(0, 6)) {
        try {
          const detailsRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`
          );
          const jobDetails = detailsRes.data.find((j: Job) => j.id === job.id);
          console.log(`Refetched details for job: ${jobDetails?.role}`);
        } catch {
          console.log("Failed to refetch job details");
        }
      }

      const end = performance.now();
      setDuration(end - start);
      return json;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (allJobs.length > 0) {
      const fetchAndProcess = async () => {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`
          );
          const jobs = res.data;

          let processed = jobs.filter((_: Job, index: number) => index < 6);

          if (sortBy === "company") {
            processed = processed.sort((a: Job, b: Job) =>
              a.companyName.localeCompare(b.companyName)
            );
          } else if (sortBy === "position") {
            const positionOrder = { Junior: 1, Mid: 2, Senior: 3 };
            processed = processed.sort(
              (a: Job, b: Job) =>
                (positionOrder[a.position as keyof typeof positionOrder] || 0) -
                (positionOrder[b.position as keyof typeof positionOrder] || 0)
            );
          }

          setFilteredJobs(processed);
        } catch {
          console.log("Processing failed");
        }
      };

      fetchAndProcess();
    }
  }, [allJobs, sortBy]);

  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      const fetchFilteredJobs = async () => {
        const { queryString } = event.detail;

        const apiUrl = queryString
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?${queryString}`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`;

        try {
          const res = await axios.get(apiUrl);
          const jobs: Job[] = res.data;

          for (const job of jobs.slice(0, 6)) {
            const categoryRes = await axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`
            );
            const allJobs: Job[] = categoryRes.data;
            const sameCategory = allJobs.filter(
              (j: Job) => j.category === job.category
            );
            console.log(
              `Job ${job.role} has ${sameCategory.length} jobs in same category`
            );
          }

          setFilteredJobs(jobs.slice(0, 6));
        } catch (error) {
          console.error("Search failed:", error);
          setFilteredJobs(allJobs.slice(0, 6));
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
  }, [allJobs]);

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Client-Side Rendered Jobs
          </h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredJobs.length > 0 ? filteredJobs : allJobs.slice(0, 6)).map(
            (job: Job) => (
              <JobCard
                key={job.id}
                job={job}
                variant="client"
                showMetadata={true}
                metadata={{
                  renderType: "CSR - Client Side Rendered",
                }}
                buttonText="See offer"
                onApply={async (job) => {
                  try {
                    const res = await axios.get(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`
                    );
                    const jobDetails = res.data.find(
                      (j: Job) => j.id === job.id
                    );
                    console.log(`Viewing offer: ${jobDetails?.role}`);
                  } catch {
                    console.log("API call failed");
                  }
                }}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};
