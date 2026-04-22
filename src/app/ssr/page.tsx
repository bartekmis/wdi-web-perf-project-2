import { Suspense } from "react";
import { SectionServer } from "@/components/sections/section-server";

function SectionSkeleton() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-2" />
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SSRPage() {
  return (
    <>
      <Suspense fallback={<SectionSkeleton />}>
        <SectionServer />
      </Suspense>
    </>
  );
}
