import { Suspense } from "react";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";
import { cache } from "react";

let serverApiCallCount = 0;
let cachedServerLoadTime = 0;

// ✅ FIXED: Wrapped with React.cache() for per-request deduplication
const getSuspenseJobs = cache(async () => {
  const start = performance.now();

  serverApiCallCount++;

  // ✅ FIXED: Removed N+1 query pattern - initial response already has all job data
  const initialRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=6`,
    {
      next: { revalidate: 60 }, // ✅ FIXED: Added caching strategy
    }
  );
  if (!initialRes.ok) {
    throw new Error("Failed to fetch initial suspense jobs");
  }
  const jobs: Job[] = await initialRes.json();

  // ✅ FIXED: Removed 6 unnecessary detail fetches - the initial response already
  // contains all job details! This was a classic N+1 query anti-pattern that was
  // making 7 API calls (1 + 6) when only 1 was needed.

  const end = performance.now();
  cachedServerLoadTime = end - start;
  console.log(
    `[SERVER] Suspense data fetched (OPTIMIZED - removed N+1) in: ${cachedServerLoadTime.toFixed(
      2
    )}ms`
  );

  return jobs;
});

// ✅ This component fetches data DURING render and suspends
async function JobsSuspenseContent() {
  // This await causes the component to suspend!
  const jobs = await getSuspenseJobs();

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Oferta pracy nie znaleziona.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job: Job, index: number) => (
        <JobCard
          key={job.id}
          job={job}
          variant="suspense"
          showBenefits={true}
          maxBenefits={2}
          buttonText="See offer"
          showMetadata={true}
          metadata={{
            index,
            renderType: "Suspense + Streaming",
          }}
        />
      ))}
    </div>
  );
}

export const SuspenseLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="p-6 border-2 border-purple-200">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-purple-200 rounded w-3/4"></div>
              <div className="h-3 bg-purple-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-purple-200 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-purple-200 rounded w-full"></div>
            <div className="h-3 bg-purple-200 rounded w-5/6"></div>
            <div className="h-3 bg-purple-200 rounded w-4/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-purple-200 rounded w-2/3"></div>
            <div className="h-3 bg-purple-200 rounded w-3/4"></div>
          </div>
          <div className="h-10 bg-purple-200 rounded w-full"></div>
        </div>
      </Card>
    ))}
  </div>
);

export function getSectionSuspenseContent() {
  serverApiCallCount = 0;

  // ✅ TRUE SUSPENSE: Data fetching happens INSIDE JobsSuspenseContent
  // The component will suspend while loading, showing the skeleton
  const element = (
    <section className="py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Suspense Streaming Jobs</h2>
          <p className="text-gray-600">
            Rendering technique: True Suspense + Streaming (skeleton shows!)
          </p>
        </div>

        <Suspense fallback={<SuspenseLoadingSkeleton />}>
          <JobsSuspenseContent />
        </Suspense>
      </div>
    </section>
  );

  // Note: serverLoadTime won't be available until after render
  // This is a trade-off for true Suspense streaming
  return { element, serverLoadTime: cachedServerLoadTime, serverApiCallCount };
}
