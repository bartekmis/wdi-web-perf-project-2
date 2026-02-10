import { Suspense } from "react";
import { PerformanceMonitor } from "@/components/performance-monitor";
import {
  SuspenseLoadingSkeleton,
  SuspenseJobsAsync,
} from "@/components/sections/section-suspense";

// Optimized: page shell renders immediately, data streams in via Suspense
export default function SuspensePage() {
  return (
    <>
      <section className="py-12 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Suspense Optimized Jobs</h2>
            <p className="text-gray-600">
              Rendering technique: Suspense + Streaming
            </p>
          </div>

          <Suspense fallback={<SuspenseLoadingSkeleton />}>
            <SuspenseJobsAsync />
          </Suspense>
        </div>
      </section>
      <PerformanceMonitor />
    </>
  );
}
