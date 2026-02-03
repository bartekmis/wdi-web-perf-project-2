import { Suspense } from "react";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";

let serverApiCallCount = 0;

// Use React.cache for per-request deduplication (Vercel best practice: server-cache-react)
const getSuspenseJobs = async () => {
  serverApiCallCount++;
  const start = performance.now();

  // Single API call - no N+1 query problem!
  const initialRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=6`,
    {
      next: { revalidate: 60 }, // Cache for 60 seconds
      cache: 'no-store' // Disable cache to see loading state
    }
  );
  if (!initialRes.ok) {
    throw new Error("Failed to fetch initial suspense jobs");
  }
  const jobs: Job[] = await initialRes.json();

  const end = performance.now();
  const serverLoadTime = end - start;

  return { jobs, serverLoadTime };
}

// Async component that fetches data - wrapped by Suspense boundary
export async function JobsSuspenseContent() {
  const { jobs, serverLoadTime } = await getSuspenseJobs();

  if (!jobs || jobs.length === 0) {
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

// Hoist skeleton JSX outside component (Vercel best practice: rendering-hoist-jsx)
const skeletonCards = Array.from({ length: 6 }).map((_, i) => (
  <Card key={i} className="p-6 border-2 border-purple-200">
    <div className="animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-purple-200 rounded w-3/4" />
          <div className="h-3 bg-purple-200 rounded w-1/2" />
        </div>
        <div className="h-6 bg-purple-200 rounded w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-purple-200 rounded w-full" />
        <div className="h-3 bg-purple-200 rounded w-5/6" />
        <div className="h-3 bg-purple-200 rounded w-4/6" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-purple-200 rounded w-2/3" />
        <div className="h-3 bg-purple-200 rounded w-3/4" />
      </div>
      <div className="h-10 bg-purple-200 rounded w-full" />
    </div>
  </Card>
));

export const SuspenseLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {skeletonCards}
  </div>
);

export function SectionSuspense() {
  return (
    <section className="py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Suspense Optimized Jobs</h2>
          <p className="text-gray-600">
            Rendering technique: Suspense + Streaming
          </p>
        </div>

        <Suspense fallback={<SuspenseLoadingSkeleton />}>
          <JobsSuspenseContent />
        </Suspense>
      </div>
    </section>
  );
}
