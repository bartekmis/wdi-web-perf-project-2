"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import { subscribeToApiCalls, getApiCallCount } from "@/lib/api-monitor";

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  id: string;
  delta: number;
  entries: PerformanceEntry[];
  navigationType?: string;
}

interface PerformanceMonitorProps {
  serverLoadTimes?: {
    ssr?: number;
    ssg?: number;
    suspense?: number;
    isr?: number;
  };
  serverApiCalls?: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  serverLoadTimes,
  serverApiCalls,
}) => {
  const [metrics, setMetrics] = useState<Map<string, WebVitalsMetric>>(
    new Map()
  );
  const [apiCallCount, setApiCallCount] = useState(getApiCallCount());
  const [pageLoadTime, setPageLoadTime] = useState<number>(0);
  const [domContentLoadedTime, setDomContentLoadedTime] = useState<number>(0);

  const updateMetric = useCallback((metric: WebVitalsMetric) => {
    setMetrics((prev) => {
      const newMetrics = new Map(prev);
      newMetrics.set(metric.name, {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        delta: metric.delta,
        entries: metric.entries,
        navigationType: metric.navigationType,
      });
      return newMetrics;
    });
  }, []);

  useEffect(() => {
    setPageLoadTime(0);
    setDomContentLoadedTime(0);
    setMetrics(new Map());

    const unsubscribe = subscribeToApiCalls(setApiCallCount);

    const performanceTiming = PerformanceNavigationTiming
      ? (performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming)
      : ({} as PerformanceNavigationTiming);

    const calculatePageLoadTime = () => {
      if (performanceTiming.loadEventEnd > 0) {
        const loadTime =
          performanceTiming.loadEventEnd - performanceTiming.fetchStart;
        setPageLoadTime(loadTime);
      }
    };

    const calculateDOMContentLoadedTime = () => {
      if (performanceTiming.domContentLoadedEventEnd > 0) {
        const domLoadTime =
          performanceTiming.domContentLoadedEventEnd -
          performanceTiming.fetchStart;
        setDomContentLoadedTime(domLoadTime);
      }
    };

    calculatePageLoadTime();
    calculateDOMContentLoadedTime();

    onFCP(updateMetric);
    onLCP(updateMetric);
    onCLS(updateMetric);
    onINP(updateMetric);
    onTTFB(updateMetric);

    window.addEventListener("load", calculatePageLoadTime);
    document.addEventListener(
      "DOMContentLoaded",
      calculateDOMContentLoadedTime
    );

    const performanceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log("[CLIENT] Navigation timing:", {
            domContentLoaded:
              navEntry.domContentLoadedEventEnd -
              navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            ttfb: navEntry.responseStart - navEntry.requestStart,
          });

          if (!metrics.has("TTFB")) {
            updateMetric({
              name: "TTFB",
              value: navEntry.responseStart - navEntry.requestStart,
              rating: "good",
              id: "ttfb-nav",
              delta: 0,
              entries: [],
              navigationType: navEntry.type,
            });
          }
        }
      });
    });

    performanceObserver.observe({ entryTypes: ["navigation"] });

    return () => {
      unsubscribe();
      window.removeEventListener("load", calculatePageLoadTime);
      document.removeEventListener(
        "DOMContentLoaded",
        calculateDOMContentLoadedTime
      );
      performanceObserver.disconnect();
    };
  }, [updateMetric]);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "text-green-600 bg-green-50";
      case "needs-improvement":
        return "text-yellow-600 bg-yellow-50";
      case "poor":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === "CLS") return value.toFixed(3);
    return Math.round(value);
  };

  const getUnit = (name: string) => {
    if (name === "CLS") return "";
    return "ms";
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-semibold text-gray-800 mb-3">Performance Metrics</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Page Load Time (Client):
          </span>
          <span className="text-sm font-mono">
            {Math.round(pageLoadTime)}ms
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">DOM Content Loaded:</span>
          <span className="text-sm font-mono">
            {Math.round(domContentLoadedTime)}ms
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">API Calls (Client):</span>
          <span className="text-sm font-mono text-red-600">{apiCallCount}</span>
        </div>
        {serverApiCalls !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">API Calls (Server):</span>
            <span className={`text-sm font-mono text-red-600`}>
              {serverApiCalls}
            </span>
          </div>
        )}
        {serverLoadTimes && (
          <div className="border-t pt-2 mt-2">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">
              Server-Side Load Times
            </h4>
            {serverLoadTimes.ssr && (
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">SSR Data Load:</span>
                <span className="text-xs px-2 py-1 rounded font-mono bg-blue-50 text-blue-600">
                  {Math.round(serverLoadTimes.ssr)}ms
                </span>
              </div>
            )}
            {serverLoadTimes.ssg && (
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">
                  SSG Build-Time Fetch:
                </span>
                <span className="text-xs px-2 py-1 rounded font-mono bg-blue-50 text-blue-600">
                  {Math.round(serverLoadTimes.ssg)}ms (Build)
                </span>
              </div>
            )}
            {serverLoadTimes.suspense && (
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">
                  Suspense Data Load:
                </span>
                <span className="text-xs px-2 py-1 rounded font-mono bg-blue-50 text-blue-600">
                  {Math.round(serverLoadTimes.suspense)}ms
                </span>
              </div>
            )}
            {serverLoadTimes.isr && (
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">
                  ISR Revalidate Load:
                </span>
                <span className="text-xs px-2 py-1 rounded font-mono bg-blue-50 text-blue-600">
                  {Math.round(serverLoadTimes.isr)}ms
                </span>
              </div>
            )}
          </div>
        )}

        {metrics.size > 0 && (
          <div className="border-t pt-2 mt-2">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">
              Core Web Vitals
            </h4>
            {Array.from(metrics.values()).map((metric) => (
              <div
                key={metric.name}
                className="flex justify-between items-center mb-1"
              >
                <span className="text-xs text-gray-600">{metric.name}:</span>
                <span
                  className={`text-xs px-2 py-1 rounded font-mono ${getRatingColor(
                    metric.rating
                  )}`}
                >
                  {formatValue(metric.name, metric.value)}
                  {getUnit(metric.name)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-2 mt-2">
          <div className="text-xs text-gray-500">
            <p>🔴 Red = Poor performance</p>
            <p>🟡 Yellow = Needs improvement</p>
            <p>🟢 Green = Good performance</p>
            <p>🔵 Blue = Server-side timing</p>
          </div>
        </div>
      </div>
    </div>
  );
};
