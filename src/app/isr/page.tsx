import { PerformanceMonitor } from "@/components/performance-monitor";
import { getSectionISRContent } from "@/components/sections/section-isr";

export default async function ISRPage() {
  const { element, serverLoadTime, serverApiCallCount } = await getSectionISRContent();

  return (
    <>
      {element}
      <PerformanceMonitor
        serverLoadTimes={{ isr: serverLoadTime }}
        serverApiCalls={serverApiCallCount}
      />
    </>
  );
}
