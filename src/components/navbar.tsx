"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Route } from "@/types/navbar";
import { Job } from "@/types/job";

export const Navbar = () => {
  const [items, setItems] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobCategories, setJobCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);

        const navResponse = await axios.get("/api/navigation");
        setItems(navResponse.data);

        const jobsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`
        );
        const jobs = jobsResponse.data as Job[];

        const categories = [...new Set(jobs.map((job: Job) => job.category))];
        setJobCategories(categories);

        for (const category of categories) {
          const categoryJobs = jobs.filter(
            (job: Job) => job.category === category
          );
          console.log(`Category ${category}: ${categoryJobs.length} jobs`);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching nav items:", error);
        setLoading(false);
      }
    };

    fetchNavItems();
  }, []);

  const handleItemHover = async (item: Route) => {
    try {
      const jobsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`
      );
      const categoryJobs = jobsResponse.data.filter(
        (job: Job) =>
          job.category === item.label || item.label.includes(job.category)
      );
      console.log(
        `Hovered ${item.label}: Found ${categoryJobs.length} related jobs`
      );
    } catch {
      console.log("Hover job fetch failed");
    }
  };

  if (loading) {
    return (
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Job Hub</div>
          <div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-blue-400 h-6 w-20 rounded"
              ></div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Job Hub</div>
        <div className="flex space-x-6">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded"
              onMouseEnter={() => handleItemHover(item)}
            >
              {item.label}
            </a>
          ))}
          {jobCategories.length > 0 && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="opacity-70">Categories:</span>
              <span className="opacity-70">{jobCategories.length}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
