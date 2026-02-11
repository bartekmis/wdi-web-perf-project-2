import { JobCard } from "@/components/ui/job-card";
import type { Job } from "@/types/job";
import Image from "next/image";

let serverApiCallCount = 0;

async function fetchJobs() {
  serverApiCallCount++;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=24`,
    {
      next: { revalidate: 600 },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return res.json();
}

async function fetchFeaturedProfessionals() {
  serverApiCallCount++;
  const res = await fetch(
    `https://dummyjson.com/users?limit=5&skip=0`,
    { 
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch featured professionals");
  const data = await res.json();

  return data.users.map((user: {
    firstName: string;
    lastName: string;
    image: string;
    company: { name: string };
  }) => ({
    name: `${user.firstName} ${user.lastName}`,
    image: user.image,
    company: user.company.name,
  }));
}

export async function getSectionServerContent() {
  serverApiCallCount = 0;
  const start = performance.now();

  const [jobsData, featuredProfessionals] = await Promise.all([
    fetchJobs(),
    fetchFeaturedProfessionals(),
  ]);

  const jobs: Job[] = jobsData.slice(0, 6);
  const categories = [
    ...new Set(jobsData.map((job: Job) => job.category)),
  ];
  console.log(`[SERVER] Processed ${categories.length} categories.`);
  console.log(
    `[SERVER] Featured professionals: fetched ${featuredProfessionals.length} users in 1 optimized request`
  );

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

          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Featured Professionals
            </p>
            <div className="flex items-center gap-4">
              {featuredProfessionals.map(
                (
                  person: { name: string; image: string; company: string }
                ) => (
                  <div key={person.name} className="flex flex-col items-center gap-1">
                    <Image
                      src={person.image}
                      alt={person.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                    <p className="text-xs font-medium text-gray-700">
                      {person.name}
                    </p>
                    <p className="text-xs text-gray-400">{person.company}</p>
                  </div>
                )
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Source: External API (5 records fetched in 1 optimized parallel request)
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
