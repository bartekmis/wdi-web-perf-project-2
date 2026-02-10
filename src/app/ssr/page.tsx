import { getSectionServerContent } from "@/components/sections/section-server";
import dynamic from "next/dynamic";
import Script from "next/script";

const PerformanceMonitor = dynamic(
    () =>
        import("@/components/performance-monitor").then(
            (module) => module.PerformanceMonitor,
        ),
    { ssr: false },
);

export default async function SSRPage() {
    const { element, serverLoadTime, serverApiCallCount } =
        await getSectionServerContent();
    const shouldRenderPerformanceMonitor = process.env.NODE_ENV !== "production";

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
            {shouldRenderPerformanceMonitor && (
                <PerformanceMonitor
                    serverLoadTimes={{ ssr: serverLoadTime }}
                    serverApiCalls={serverApiCallCount}
                />
            )}
        </>
    );
}
