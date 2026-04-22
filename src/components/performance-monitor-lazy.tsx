"use client";

import dynamic from "next/dynamic";

const PerformanceMonitor = dynamic(
  () =>
    import("./performance-monitor").then((m) => m.PerformanceMonitor),
  { ssr: false }
);

export default PerformanceMonitor;
