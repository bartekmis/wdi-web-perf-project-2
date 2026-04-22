import { Suspense } from "react";
import Image from "next/image";
import { JobCard } from "@/components/ui/job-card";
import { Job } from "@/types/job";

const REVALIDATE_SECONDS = 30;
const FEATURED_COUNT = 5;
const JOBS_LIMIT = 6;
const MAX_RESPONSIBILITIES = 3;
const MAX_BENEFITS = 2;

type FeaturedProfessional = {
  name: string;
  image: string;
  company: string;
};

async function fetchJobs(): Promise<Job[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=${JOBS_LIMIT}`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  );
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

async function fetchFeaturedProfessionals(): Promise<FeaturedProfessional[]> {
  const res = await fetch(
    `https://dummyjson.com/users?limit=${FEATURED_COUNT}&select=firstName,lastName,image,company`,
    { next: { revalidate: REVALIDATE_SECONDS } }
  );
  if (!res.ok) throw new Error("Failed to fetch featured professionals");
  const data = (await res.json()) as {
    users: {
      firstName: string;
      lastName: string;
      image: string;
      company: { name: string };
    }[];
  };
  return data.users.map((u) => ({
    name: `${u.firstName} ${u.lastName}`,
    image: u.image,
    company: u.company.name,
  }));
}

async function FeaturedProfessionals() {
  const pros = await fetchFeaturedProfessionals();
  return (
    <div className="flex items-center gap-4">
      {pros.map((person, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <Image
            src={person.image}
            alt={person.name}
            width={64}
            height={64}
            className="rounded-full object-cover"
            style={{ width: 64, height: 64 }}
            unoptimized
          />
          <p className="text-xs font-medium text-gray-700">{person.name}</p>
          <p className="text-xs text-gray-400">{person.company}</p>
        </div>
      ))}
    </div>
  );
}

function FeaturedProfessionalsSkeleton() {
  return (
    <div className="flex items-center gap-4">
      {Array.from({ length: FEATURED_COUNT }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className="rounded-full bg-gray-200 animate-pulse"
            style={{ width: 64, height: 64 }}
          />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export async function getSectionServerContent() {
  const start = performance.now();

  const jobs = await fetchJobs();

  const slimJobs = jobs.map((job) => ({
    id: job.id,
    role: job.role,
    companyName: job.companyName,
    position: job.position,
    location: job.location,
    workMode: job.workMode,
    category: job.category,
    responsibilities: job.responsibilities?.slice(0, MAX_RESPONSIBILITIES) ?? [],
    benefits: job.benefits?.slice(0, MAX_BENEFITS) ?? [],
  })) as Job[];

  const serverLoadTime = performance.now() - start;
  console.log(
    `[SERVER] SSR content loaded in ${serverLoadTime.toFixed(2)}ms (jobs only; featured pros stream)`
  );

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
            <Suspense fallback={<FeaturedProfessionalsSkeleton />}>
              <FeaturedProfessionals />
            </Suspense>
            <p className="text-xs text-gray-400 mt-3">
              Source: External API (streamed via Suspense)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slimJobs.map((job, i) => (
              <div
                key={job.id}
                style={
                  i >= 2
                    ? {
                        contentVisibility: "auto",
                        containIntrinsicSize: "400px",
                      }
                    : undefined
                }
              >
                <JobCard
                  job={job}
                  variant="server"
                  showBenefits={true}
                  maxResponsibilities={MAX_RESPONSIBILITIES}
                  maxBenefits={MAX_BENEFITS}
                  buttonText="See offer"
                  showMetadata={true}
                  metadata={{
                    renderType: "SSR - Server Side Rendered",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );

  return { element, serverLoadTime, serverApiCallCount: 2 };
}
