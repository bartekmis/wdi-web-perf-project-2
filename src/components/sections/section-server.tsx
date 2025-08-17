import { JobCard } from "@/components/ui/job-card";
import { Job } from "@/types/job";

let serverApiCallCount = 0;

async function fetchJobs() {
  serverApiCallCount++;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=6`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return res.json();
}

async function fetchAllJobsForCategories() {
  serverApiCallCount++;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=24`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return res.json();
}

export async function getSectionServerContent() {
  serverApiCallCount = 0;
  const start = performance.now();

  const jobsData = await fetchJobs();
  const categoriesData = await fetchAllJobsForCategories();

  const jobs: Job[] = jobsData;
  const categories = [
    ...new Set(categoriesData.map((job: Job) => job.category)),
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
