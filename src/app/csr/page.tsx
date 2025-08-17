import { PerformanceMonitor } from "@/components/performance-monitor";
import { SectionClient } from "@/components/sections/section-client";

export default function CSRPage() {
  return (
    <>
      <SectionClient />
      <PerformanceMonitor />
    </>
  );
}
