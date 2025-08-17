"use client";

import { useState, useEffect } from "react";
import { Job } from "@/types/job";

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [position, setPosition] = useState("");
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`);
        const jobs: Job[] = await res.json();

        const locations = [...new Set(jobs.map((job) => job.location))].sort();
        const positions = [...new Set(jobs.map((job) => job.position))].sort();
        const categories = [...new Set(jobs.map((job) => job.category))].sort();

        setAvailableLocations(locations);
        setAvailablePositions(positions);
        setAvailableCategories(categories);
      } catch (error) {
        console.error("Failed to fetch filter options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("role", searchTerm);
    if (position) queryParams.append("position", position);
    if (location) queryParams.append("location", location);
    if (category) queryParams.append("category", category);

    window.dispatchEvent(
      new CustomEvent("jobSearch", {
        detail: {
          searchTerm,
          location,
          category,
          position,
          queryString: queryParams.toString(),
        },
      })
    );
  };

  const handleSortChange = (sortBy: string) => {
    window.dispatchEvent(
      new CustomEvent("jobSort", {
        detail: { sortBy },
      })
    );
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-xl text-blue-100">
            50,000+ job opportunities from top companies
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Position, company or keyword
              </label>
              <input
                id="search"
                type="text"
                placeholder="e.g. JavaScript Developer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All locations</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Experience Level
              </label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All levels</option>
                {availablePositions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">All categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              Search Jobs
            </button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Sort by:</label>
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-gray-900 text-sm"
              >
                <option value="newest">Newest first</option>
                <option value="company">Company A-Z</option>
                <option value="position">Position (Junior → Senior)</option>
                <option value="location">Location A-Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-8 text-blue-100">
          <div className="text-center">
            <div className="text-2xl font-bold">50,000+</div>
            <div className="text-sm">Active job offers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">15,000+</div>
            <div className="text-sm">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">500,000+</div>
            <div className="text-sm">Users</div>
          </div>
        </div>
      </div>
    </header>
  );
};
