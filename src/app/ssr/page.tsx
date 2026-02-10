import { PerformanceMonitor } from "@/components/performance-monitor";
import { getSectionServerContent } from "@/components/sections/section-server";
import Script from "next/script";

export default async function SSRPage() {
    const { element, serverLoadTime, serverApiCallCount } =
        await getSectionServerContent();

    return (
        <>
            <Script
                id="Cookiebot"
                src="https://consent.cookiebot.com/uc.js"
                data-cbid="45060aa1-a02e-4da1-b894-ba61862915bc"
                data-blockingmode="auto"
                strategy="lazyOnload"
                type="text/javascript"
            />
            {element}
            <PerformanceMonitor
                serverLoadTimes={{ ssr: serverLoadTime }}
                serverApiCalls={serverApiCallCount}
            />
        </>
    );
}
