import { Job } from "@/types/job";
import { Suspense } from "react";
import { JobCard } from "../ui/job-card";

async function fetchJobs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
    cache: "force-cache",
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return res.json();
}

function SuspenseJobsGrid({ jobs }: { jobs: Job[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          variant="suspense"
          showBenefits={true}
          maxResponsibilities={3}
          maxBenefits={2}
          buttonText="See offer"
          showMetadata={true}
          metadata={{
            renderType: "Suspense + Streaming (SSR-identical data fetch)",
          }}
        />
      ))}
    </div>
  );
}

export function SuspenseVsSSRLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="p-6 border-2 border-blue-200 animate-pulse space-y-4"
        >
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-3 bg-blue-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-blue-200 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-blue-200 rounded w-full"></div>
            <div className="h-3 bg-blue-200 rounded w-5/6"></div>
            <div className="h-3 bg-blue-200 rounded w-4/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-blue-200 rounded w-2/3"></div>
            <div className="h-3 bg-blue-200 rounded w-3/4"></div>
          </div>
          <div className="h-10 bg-blue-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}

export async function getSectionSuspenseVsSSRContent() {
  const start = performance.now();

  const jobsData = await fetchJobs();
  const categoriesData = await fetchJobs();

  const jobs: Job[] = jobsData.slice(6, 12);
  const categories = [
    ...new Set(categoriesData.map((job: Job) => job.category)),
  ];
  console.log(`[SERVER] Processed ${categories.length} categories.`);

  const end = performance.now();
  const serverLoadTime = end - start;

  console.log(
    `[SERVER] SuspenseVsSSR (SSR-identical fetch) loaded in: ${serverLoadTime.toFixed(
      2
    )}ms`
  );

  const element = (
    <section className="py-12 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Suspense vs SSR (Same Fetch)
          </h2>
          <p className="text-gray-600">
            Rendering technique: Suspense + Streaming
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Server data load time: {serverLoadTime.toFixed(2)}ms
          </p>
        </div>

        <Suspense fallback={<SuspenseVsSSRLoadingSkeleton />}>
          <SuspenseJobsGrid jobs={jobs} />
        </Suspense>
      </div>
    </section>
  );

  return { element, serverLoadTime };
}
