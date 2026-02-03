"use client";

import { useState, useEffect } from "react";
import { Job } from "@/types/job";

interface VisitedJob {
  id: string;
  name: string;
  company: string;
  visitedAt: string;
}

export const LastVisitedBanner = () => {
  const [visitedJobs, setVisitedJobs] = useState<VisitedJob[]>([]);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("visitedJobs");
      if (stored) {
        const jobs: VisitedJob[] = JSON.parse(stored);
        if (jobs.length > 0) {
          setVisitedJobs(jobs);
          setShowBanner(true);
        }
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("visitedJobs");
    setVisitedJobs([]);
    setShowBanner(false);
  };

  if (!showBanner || visitedJobs.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-yellow-600">🕒</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Historia odwiedzonych ofert
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <span>Ostatnio przeglądane: </span>
              {visitedJobs.slice(0, 3).map((job, index) => (
                <span key={job.id}>
                  <span className="font-medium">{job.name}</span>
                  <span className="text-yellow-600"> w {job.company}</span>
                  {index < Math.min(visitedJobs.length - 1, 2) && ", "}
                </span>
              ))}
              {visitedJobs.length > 3 && (
                <span className="text-yellow-600">
                  {" "}
                  i {visitedJobs.length - 3} więcej
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={clearHistory}
            className="text-yellow-800 hover:text-yellow-900 text-sm underline"
          >
            Wyczyść historię
          </button>
        </div>
      </div>
    </div>
  );
};

// Cache to avoid repeated localStorage reads
let cachedVisitedJobs: VisitedJob[] | null = null;

export const saveVisitedJob = (job: Job) => {
  if (typeof window === "undefined") return;

  const visitedJob: VisitedJob = {
    id: job.id,
    name: job.role,
    company: job.companyName,
    visitedAt: new Date().toISOString(),
  };

  // Use cached value if available
  let visitedJobs: VisitedJob[];
  if (cachedVisitedJobs === null) {
    const existing = localStorage.getItem("visitedJobs");
    visitedJobs = existing ? JSON.parse(existing) : [];
  } else {
    visitedJobs = [...cachedVisitedJobs];
  }

  visitedJobs = visitedJobs.filter((j) => j.id !== job.id);
  visitedJobs.unshift(visitedJob);
  visitedJobs = visitedJobs.slice(0, 10);

  // Update cache and localStorage
  cachedVisitedJobs = visitedJobs;

  // Use requestIdleCallback to defer localStorage write
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      localStorage.setItem("visitedJobs", JSON.stringify(visitedJobs));
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      localStorage.setItem("visitedJobs", JSON.stringify(visitedJobs));
    }, 0);
  }
};
