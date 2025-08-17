import { PerformanceMonitor } from "@/components/performance-monitor";
import { getSectionServerContent } from "@/components/sections/section-server";

export default async function SSRPage() {
  const { element, serverLoadTime, serverApiCallCount } =
    await getSectionServerContent();

  return (
    <>
      {element}
      <PerformanceMonitor
        serverLoadTimes={{ ssr: serverLoadTime }}
        serverApiCalls={serverApiCallCount}
      />
    </>
  );
}
