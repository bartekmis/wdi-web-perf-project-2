import { PerformanceMonitor } from "@/components/performance-monitor";
import { SectionSuspense } from "@/components/sections/section-suspense";

export default function SuspensePage() {
  return (
    <>
      <SectionSuspense />
      <PerformanceMonitor />
    </>
  );
}
