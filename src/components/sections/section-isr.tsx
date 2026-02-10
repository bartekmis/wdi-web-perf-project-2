import { Job } from "@/types/job";
import { JobCard } from "@/components/ui/job-card";

let serverApiCallCount = 0;

async function getISRJobs() {
  serverApiCallCount = 0;
  const start = performance.now();

  serverApiCallCount++;

  // Optimized: fetch only 6 jobs we need (with offset) instead of ALL jobs
  // Unified revalidate to 600s to match page-level revalidate
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=6&_start=18`,
    { next: { revalidate: 600 } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch ISR jobs");
  }
  const jobs: Job[] = await res.json();

  console.log(`[SERVER] ISR regeneration completed.`);

  const end = performance.now();
  const serverLoadTime = end - start;
  console.log(
    `[SERVER] ISR section generation time: ${serverLoadTime.toFixed(2)}ms`
  );

  return { jobs, serverLoadTime };
}

export async function getSectionISRContent() {
  const { jobs, serverLoadTime } = await getISRJobs();

  const timestamp = new Date().toLocaleString("pl-PL", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const element = (
    <>
      {(!jobs || jobs.length === 0) && (
        <main className="min-h-screen flex flex-col">
          <div className="flex-grow flex items-center justify-center p-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Oferta pracy nie znaleziona.
            </h1>
          </div>
        </main>
      )}
      <section className="py-12 bg-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">ISR Revalidated Jobs</h2>
            <p className="text-gray-600">
              Rendering technique: ISR (30s revalidation)
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Last generated: {timestamp}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Server data load time: {serverLoadTime.toFixed(2)}ms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: Job, index: number) => (
              <JobCard
                key={job.id}
                job={job}
                variant="isr"
                showBenefits={true}
                maxBenefits={3}
                buttonText="See offer"
                showMetadata={true}
                metadata={{
                  index,
                  renderType: "ISR - Revalidates every 30 seconds",
                }}
              />
            ))}
          </div>

          <div className="mt-8 text-center bg-orange-100 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">
              ISR Performance Info
            </h3>
            <div className="text-sm text-orange-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium">Revalidation:</p>
                <p>Every 30 s</p>
              </div>
              <div>
                <p className="font-medium">Cache Status:</p>
                <p>Static until stale, then regenerated in background</p>
              </div>
              <div>
                <p className="font-medium">Build Time:</p>
                <p>On-demand (after revalidation period)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return { element, serverLoadTime, serverApiCallCount };
}
