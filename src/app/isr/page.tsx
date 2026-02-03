import { PerformanceMonitor } from "@/components/performance-monitor";
import { getSectionISRContent } from "@/components/sections/section-isr";

// ✅ FIXED: Explicit ISR configuration at page level
// This ensures the entire page uses ISR with 30-second revalidation
export const revalidate = 30;

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
