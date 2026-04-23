import { PerformanceMonitor } from "@/components/performance-monitor";
import { getSectionSuspenseContent } from "@/components/sections/section-suspense";

export default function SuspensePage() {
  const { element, serverLoadTime, serverApiCallCount } =
    getSectionSuspenseContent();

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
