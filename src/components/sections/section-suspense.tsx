import { Suspense } from "react";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { JobCard } from "@/components/ui/job-card";

let serverApiCallCount = 0;

async function getSuspenseJobs() {
  serverApiCallCount++;
  const start = performance.now();

  // Optimized: single request instead of N+1 pattern (1 list + 6 detail requests)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=6`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch suspense jobs");
  }
  const jobs: Job[] = await res.json();

  const end = performance.now();
  const serverLoadTime = end - start;
  console.log(
    `[SERVER] Suspense data fetched (OPTIMIZED single request) in: ${serverLoadTime.toFixed(
      2
    )}ms`
  );

  return { jobs, serverLoadTime };
}

interface JobsSuspenseContentProps {
  jobs: Job[];
  serverLoadTime: number;
}
export const JobsSuspenseContent: React.FC<JobsSuspenseContentProps> = ({
  jobs,
  serverLoadTime,
}) => {
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
};

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

// Optimized: async server component for true Suspense streaming
export async function SuspenseJobsAsync() {
  serverApiCallCount = 0;
  const { jobs, serverLoadTime } = await getSuspenseJobs();
  return <JobsSuspenseContent jobs={jobs} serverLoadTime={serverLoadTime} />;
}

export async function getSectionSuspenseContent() {
  serverApiCallCount = 0;
  const { jobs, serverLoadTime } = await getSuspenseJobs();

  const element = (
    <section className="py-12 bg-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Suspense Optimized Jobs</h2>
          <p className="text-gray-600">
            Rendering technique: Suspense + Streaming
          </p>
        </div>

        <Suspense fallback={<SuspenseLoadingSkeleton />}>
          <JobsSuspenseContent jobs={jobs} serverLoadTime={serverLoadTime} />
        </Suspense>
      </div>
    </section>
  );
  return { element, serverLoadTime, serverApiCallCount };
}
