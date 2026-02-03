import { JobCard } from "@/components/ui/job-card";
import { Job } from "@/types/job";

export async function getSectionServerContent() {
  const start = performance.now();

  // async-parallel + redundant fetch: fetchJobs (limit=6) was a strict subset
  // of fetchAllJobsForCategories (limit=24). One fetch, slice for cards,
  // derive categories from the same array.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=24`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }
  const allData: Job[] = await res.json();

  const jobs = allData.slice(0, 6);

  // js-combine-iterations: single pass, no intermediate array from .map()
  const categorySet = new Set<string>();
  for (const job of allData) {
    categorySet.add(job.category);
  }
  console.log(`[SERVER] Processed ${categorySet.size} categories.`);

  const serverLoadTime = performance.now() - start;
  console.log(
    `[SERVER] Server-Side Rendered (SSR) content loaded in: ${serverLoadTime.toFixed(2)}ms`,
  );

  // early return for empty state — previously rendered alongside the section
  if (jobs.length === 0) {
    const element = (
      <main className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center p-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Oferta pracy nie znaleziona.
          </h1>
        </div>
      </main>
    );
    return { element, serverLoadTime, serverApiCallCount: 1 };
  }

  const element = (
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
  );

  return { element, serverLoadTime, serverApiCallCount: 1 };
}
