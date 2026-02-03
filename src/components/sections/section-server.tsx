import { JobCard } from "@/components/ui/job-card";
import { Job } from "@/types/job";
import { cache } from "react";

let serverApiCallCount = 0;

// ✅ FIXED: Wrapped with React.cache() for per-request deduplication
const fetchJobs = cache(async () => {
  serverApiCallCount++;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=6`,
    {
      next: { revalidate: 60 }, // ✅ FIXED: Cache for 60 seconds instead of no-store
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return res.json();
});

// ✅ FIXED: Removed fetchAllJobsForCategories - no longer needed
// We'll derive categories from the 6 jobs we already fetch

export async function getSectionServerContent() {
  serverApiCallCount = 0;
  const start = performance.now();

  // ✅ FIXED: Only one fetch needed - derive categories from existing data
  const jobsData = await fetchJobs();

  const jobs: Job[] = jobsData;

  // ✅ FIXED: Derive categories from the 6 jobs instead of fetching 24 more
  const categories = [
    ...new Set(jobs.map((job: Job) => job.category)),
  ];
  console.log(`[SERVER] Processed ${categories.length} categories.`);

  const end = performance.now();
  const serverLoadTime = end - start;
  console.log(
    `[SERVER] Server-Side Rendered (SSR) content loaded in: ${serverLoadTime.toFixed(
      2
    )}ms`
  );

  const element = (
    <>
      {(!jobsData || jobsData.length === 0) && (
        <main className="min-h-screen flex flex-col">
          <div className="flex-grow flex items-center justify-center p-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Oferta pracy nie znaleziona.
            </h1>
          </div>
        </main>
      )}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Server-Side Rendered Jobs
            </h2>
            <p className="text-gray-600">Rendering technique: SSR</p>

            <p className="text-xs text-gray-500 mt-2">
              Server data load time: {serverLoadTime.toFixed(2)}ms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: Job) => (
              <JobCard
                key={job.id}
                job={job}
                variant="server"
                showBenefits={true}
                maxResponsibilities={3}
                maxBenefits={2}
                buttonText="See offer"
                showMetadata={true}
                metadata={{
                  renderType: "SSR - Server Side Rendered",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );

  return { element, serverLoadTime, serverApiCallCount };
}
