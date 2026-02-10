import { ApplyModal } from "@/components/apply-modal";
import { OfferPageClient } from "@/components/offer-page-client";
import { JobCard } from "@/components/ui/job-card";
import { Job } from "@/types/job";
import Image from "next/image";
import { cache } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Optimized: React.cache() for per-request deduplication of fetches
const getJobs = cache(async (): Promise<Job[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
});

export async function generateStaticParams() {
  console.log("[BUILD] generateStaticParams: Fetching job IDs for SSG...");
  try {
    const allJobs = await getJobs();
    const params = allJobs.slice(0, 100).map((job) => ({
      id: job.id.toString(),
    }));
    console.log(
      `[BUILD] generateStaticParams: Generated ${params.length} static paths.`
    );
    return params;
  } catch (error) {
    console.error("[BUILD ERROR] generateStaticParams failed:", error);
    return [];
  }
}

// Optimized: fetch single job by ID instead of fetching ALL and filtering
async function getOfferForSSG(id: string): Promise<Job | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/${id}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`[BUILD ERROR] Error fetching job offer for ID ${id}:`, error);
    return null;
  }
}

// Optimized: fetch only 3 jobs instead of all
async function getSimilarOffers(): Promise<Job[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs?_limit=3`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) throw new Error("Failed to fetch similar jobs");
    return res.json();
  } catch (error) {
    console.error("Error fetching similar offers:", error);
    return [];
  }
}

export default async function OfferPage({ params }: PageProps) {
  const { id } = await params;
  // Optimized: parallel fetching instead of sequential
  const [offer, similarOffers] = await Promise.all([
    getOfferForSSG(id),
    getSimilarOffers(),
  ]);

  if (!offer) {
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
    <main className="min-h-screen flex flex-col">
      <OfferPageClient offer={offer} />
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {offer.role} w {offer.companyName}
          </h1>
          <Image
            src={`https://picsum.photos/seed/${offer.id}/1200/400`}
            alt={`Banner dla ${offer.role}`}
            width={1200}
            height={400}
            className="rounded-lg shadow-md mb-4 w-full h-auto object-cover"
            priority={false}
          />
          
          <div className="flex items-center justify-between mb-8 overflow-x-auto">
            <Image
              src="/file.svg"
              alt="File icon"
              width={40}
              height={40}
              className="max-h-[40px] w-auto object-contain flex-shrink-0"
              priority={false}
            />
            <Image
              src="/globe.svg"
              alt="Globe icon"
              width={40}
              height={40}
              className="max-h-[40px] w-auto object-contain flex-shrink-0"
              priority={false}
            />
            <Image
              src="/next.svg"
              alt="Next.js logo"
              width={40}
              height={40}
              className="max-h-[40px] w-auto object-contain flex-shrink-0"
              priority={false}
            />
            <Image
              src="/vercel.svg"
              alt="Vercel logo"
              width={40}
              height={40}
              className="max-h-[40px] w-auto object-contain flex-shrink-0 invert"
              priority={false}
            />
            <Image
              src="/window.svg"
              alt="Window icon"
              width={40}
              height={40}
              className="max-h-[40px] w-auto object-contain flex-shrink-0"
              priority={false}
            />
          </div>
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Opis stanowiska
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">{offer.role}</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Obowiązki
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              {offer.responsibilities.map((res, index) => (
                <li key={index}>{res}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Benefity
            </h3>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              {offer.benefits.map((ben, index) => (
                <li key={index}>{ben}</li>
              ))}
            </ul>

            <ApplyModal offer={offer} />
          </section>
        </div>

        <aside className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Podobne oferty
            </h2>
            <div className="space-y-4">
              {similarOffers.length > 0 ? (
                similarOffers.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    showMetadata={false}
                    buttonText="Zobacz"
                  />
                ))
              ) : (
                <p className="text-gray-600">Brak podobnych ofert.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
