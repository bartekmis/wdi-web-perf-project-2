import { Suspense } from "react";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";

// rendering-hoist-jsx: static skeleton extracted outside as a constant
const SUSPENSE_SKELETON = (
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

// async-suspense-boundaries: this component fetches its own data and suspends.
// The <Suspense> boundary streams SUSPENSE_SKELETON while this resolves.
// Previously data was pre-fetched and passed as props — the boundary never triggered.
async function JobsSuspenseContent() {
  const start = performance.now();

  // async-parallel: single fetch — the N+1 detail loop (/jobs/{id} × 6) is gone.
  // The list endpoint already returns all fields used by JobCard.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=6`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch suspense jobs");
  }
  const jobs: Job[] = await res.json();

  const serverLoadTime = performance.now() - start;
  console.log(
    `[SERVER] Suspense data fetched in: ${serverLoadTime.toFixed(2)}ms`,
  );

  if (jobs.length === 0) {
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
    <>
      <p className="text-xs text-gray-500 text-center mb-4">
        Server data load time: {serverLoadTime.toFixed(2)}ms
      </p>
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
    </>
  );
}

export async function getSectionSuspenseContent() {
  const element = (
    <section className="py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Suspense Streaming Jobs</h2>
          <p className="text-gray-600">
            Rendering technique: Suspense + Streaming
          </p>
        </div>

        <Suspense fallback={SUSPENSE_SKELETON}>
          <JobsSuspenseContent />
        </Suspense>
      </div>
    </section>
  );

  // Fetch happens inside the Suspense boundary and streams in after this
  // returns. Timing is measured and displayed there. 0 is intentional —
  // PerformanceMonitor skips falsy values.
  return { element, serverLoadTime: 0, serverApiCallCount: 1 };
}
