"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Optimized: dynamic import for heavy Chart.js component (~300KB)
// Loads only when user toggles analytics, not in initial bundle
const JobAnalytics = dynamic(
  () => import("@/components/job-analytics").then((m) => m.JobAnalytics),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg h-20"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-700 rounded"></div>
      </div>
    ),
  }
);

type Job = {
  id: string;
  role: string;
  company: string;
  location: string;
  salary: string;
  type: "Remote" | "Hybrid" | "On-site";
};

const JOBS: Job[] = [
  {
    id: "1",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    location: "Warszawa",
    salary: "18-25k PLN",
    type: "Hybrid",
  },
  {
    id: "2",
    role: "Backend Engineer",
    company: "DataFlow",
    location: "Krakow",
    salary: "20-28k PLN",
    type: "Remote",
  },
  {
    id: "3",
    role: "DevOps Engineer",
    company: "CloudScale",
    location: "Gdansk",
    salary: "22-30k PLN",
    type: "Remote",
  },
  {
    id: "4",
    role: "Fullstack Developer",
    company: "StartupXYZ",
    location: "Wroclaw",
    salary: "15-22k PLN",
    type: "Hybrid",
  },
  {
    id: "5",
    role: "ML Engineer",
    company: "AILabs",
    location: "Poznan",
    salary: "25-35k PLN",
    type: "On-site",
  },
  {
    id: "6",
    role: "React Developer",
    company: "WebAgency",
    location: "Warszawa",
    salary: "16-24k PLN",
    type: "Remote",
  },
];

export default function BundleProblemPage() {
  const [showAnalytics, setShowAnalytics] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Job Board</h1>
          <p className="text-gray-400 mt-1">Find your next opportunity</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showAnalytics ? "Hide" : "Show"} Analytics Dashboard
        </button>
      </div>
      {showAnalytics && (
        <section className="max-w-6xl mx-auto px-4 py-6">
          <JobAnalytics />
        </section>
      )}

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-white mb-6">Latest Jobs</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOBS.map((job) => (
            <div
              key={job.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-blue-500 transition"
            >
              <h3 className="text-white font-semibold text-lg">{job.role}</h3>
              <p className="text-gray-400">{job.company}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
                  {job.location}
                </span>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
                  {job.type}
                </span>
              </div>
              <p className="text-green-400 font-medium mt-3">{job.salary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
