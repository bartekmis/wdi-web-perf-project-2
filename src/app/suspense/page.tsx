import { PerformanceMonitor } from "@/components/performance-monitor";
import { getSectionSuspenseContent } from "@/components/sections/section-suspense";

export default async function SuspensePage() {
  const { element, serverLoadTime, serverApiCallCount } =
    await getSectionSuspenseContent();

  return (
    <>
      {element}
      <PerformanceMonitor
        serverLoadTimes={{ suspense: serverLoadTime }}
        serverApiCalls={serverApiCallCount}
      />
    </>
  );
}
