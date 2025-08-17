import { PerformanceMonitor } from "@/components/performance-monitor";
import { getSectionSuspenseVsSSRContent } from "@/components/sections/section-suspense-vs-ssr";

export default async function SuspenseVsSSRPage() {
  const { element, serverLoadTime } = await getSectionSuspenseVsSSRContent();

  return (
    <>
      {element}
      <PerformanceMonitor serverLoadTimes={{ suspense: serverLoadTime }} />
    </>
  );
}
