import { Job } from "@/types/job";
import { JobListClient } from "./index";
import { LastVisitedBanner } from "@/components/last-visited-banner";

export const JobListServer = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
      cache: "force-cache",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const allJobs: Job[] = await res.json();

    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Partial Pre-rendered Jobs (PPR)
            </h2>
            <p className="text-gray-600">
              Server-side prefetch with client-side hydration and suspense
            </p>
            <p className="text-sm text-green-600">
              ✅ Optimized with server prefetch and client suspense
            </p>
          </div>

          <LastVisitedBanner />

          <JobListClient initialJobs={allJobs} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Failed to prefetch jobs:", error);

    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Jobs</h2>
            <p className="text-red-600">
              Failed to load jobs. Please try again later.
            </p>
          </div>

          <JobListClient initialJobs={[]} />
        </div>
      </section>
    );
  }
};
