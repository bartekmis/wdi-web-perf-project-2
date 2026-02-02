"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function generateAnalyticsData() {
  const days = 365 * 3;
  const categories = [
    "IT",
    "Data",
    "DevOps",
    "AI/ML",
    "Finance",
    "Security",
    "Mobile",
    "QA",
    "Frontend",
    "Backend",
  ];
  const locations = [
    "Warszawa",
    "Krakow",
    "Gdansk",
    "Wroclaw",
    "Poznan",
    "Lodz",
    "Katowice",
    "Szczecin",
  ];

  const dailyData: {
    date: string;
    jobs: number;
    applications: number;
    views: number;
  }[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    const month = date.getMonth();
    const baseJobs = 50 + Math.sin(month / 2) * 20;
    const weekendDrop = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 1;

    dailyData.push({
      date: date.toISOString().split("T")[0],
      jobs: Math.floor((baseJobs + Math.random() * 30) * weekendDrop),
      applications: Math.floor(
        (baseJobs * 5 + Math.random() * 100) * weekendDrop,
      ),
      views: Math.floor((baseJobs * 50 + Math.random() * 500) * weekendDrop),
    });
  }

  const categoryStats = categories.map((category) => {
    const categoryData = [];

    for (let i = 0; i < 5000; i++) {
      const item = {
        id: `${category}-${i}`,
        salary: 8000 + Math.random() * 25000,
        experience: Math.floor(Math.random() * 15),
        applications: Math.floor(Math.random() * 200),
        score: Math.random() * 100,
        description: `${category} position ${i}`
          .repeat(10)
          .split("")
          .reverse()
          .join(""),
        keywords: Array.from(
          { length: 20 },
          (_, k) => `keyword-${i}-${k}`,
        ).join(","),
      };

      const serialized = JSON.stringify(item);
      const parsed = JSON.parse(serialized);
      categoryData.push(parsed);
    }

    const avgSalary =
      categoryData.reduce((sum, d) => sum + d.salary, 0) / categoryData.length;
    const avgExperience =
      categoryData.reduce((sum, d) => sum + d.experience, 0) /
      categoryData.length;
    const totalApplications = categoryData.reduce(
      (sum, d) => sum + d.applications,
      0,
    );

    const sortedByScore = [...categoryData].sort((a, b) => b.score - a.score);
    const sortedBySalary = [...categoryData].sort(
      (a, b) => b.salary - a.salary,
    );
    const sortedByExp = [...categoryData].sort(
      (a, b) => b.experience - a.experience,
    );

    const searchResults = categoryData.filter((item) =>
      item.description.toLowerCase().includes(category.toLowerCase()),
    );

    return {
      category,
      avgSalary: Math.round(avgSalary),
      avgExperience: Math.round(avgExperience * 10) / 10,
      totalApplications,
      totalJobs: categoryData.length,
      topByScore: sortedByScore.slice(0, 10),
      topBySalary: sortedBySalary.slice(0, 10),
      topByExp: sortedByExp.slice(0, 10),
      searchHits: searchResults.length,
    };
  });

  const locationStats = locations.map((location) => {
    const monthlyData = [];
    for (let m = 0; m < 36; m++) {
      const data = {
        month: m,
        jobs: Math.floor(100 + Math.random() * 200),
        avgSalary: Math.floor(10000 + Math.random() * 15000),
        details: JSON.stringify({ location, month: m, random: Math.random() }),
      };
      JSON.parse(data.details);
      monthlyData.push(data);
    }
    return { location, monthlyData };
  });

  const correlationMatrix: number[][] = [];
  for (let i = 0; i < categories.length; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < categories.length; j++) {
      let correlation = 0;
      for (let k = 0; k < 2000; k++) {
        correlation += Math.random() * Math.random();
        const temp = `${i}-${j}-${k}`.split("-").reverse().join("");
        correlation += temp.length * 0.0001;
      }
      correlationMatrix[i][j] = Math.round((correlation / 2000) * 100) / 100;
    }
  }

  const searchIndex: Record<string, string[]> = {};
  categoryStats.forEach((cat) => {
    const words = cat.category.toLowerCase().split("");
    words.forEach((char) => {
      if (!searchIndex[char]) searchIndex[char] = [];
      searchIndex[char].push(cat.category);
      searchIndex[char] = JSON.parse(JSON.stringify(searchIndex[char]));
    });
  });

  return {
    dailyData,
    categoryStats,
    locationStats,
    correlationMatrix,
    searchIndex,
    summary: {
      totalJobs: dailyData.reduce((sum, d) => sum + d.jobs, 0),
      totalApplications: dailyData.reduce((sum, d) => sum + d.applications, 0),
      totalViews: dailyData.reduce((sum, d) => sum + d.views, 0),
      avgJobsPerDay: Math.round(
        dailyData.reduce((sum, d) => sum + d.jobs, 0) / days,
      ),
    },
  };
}

const ANALYTICS_DATA = generateAnalyticsData();

export function JobAnalytics() {
  const { dailyData, categoryStats, summary } = ANALYTICS_DATA;

  const last90Days = dailyData.slice(0, 90).reverse();

  const lineChartData = {
    labels: last90Days.map((d) => d.date),
    datasets: [
      {
        label: "Job Postings",
        data: last90Days.map((d) => d.jobs),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Applications",
        data: last90Days.map((d) => d.applications / 10),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: categoryStats.map((c) => c.category),
    datasets: [
      {
        label: "Average Salary (PLN)",
        data: categoryStats.map((c) => c.avgSalary),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(20, 184, 166, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
      },
    ],
  };

  const doughnutData = {
    labels: categoryStats.map((c) => c.category),
    datasets: [
      {
        data: categoryStats.map((c) => c.totalJobs),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(20, 184, 166, 0.8)",
          "rgba(251, 146, 60, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "rgba(255,255,255,0.7)" },
      },
    },
    scales: {
      x: {
        ticks: { color: "rgba(255,255,255,0.5)" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "rgba(255,255,255,0.5)" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Job Market Analytics
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Jobs</p>
          <p className="text-2xl font-bold text-blue-400">
            {summary.totalJobs.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Applications</p>
          <p className="text-2xl font-bold text-green-400">
            {summary.totalApplications.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Page Views</p>
          <p className="text-2xl font-bold text-yellow-400">
            {summary.totalViews.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Avg Jobs/Day</p>
          <p className="text-2xl font-bold text-purple-400">
            {summary.avgJobsPerDay}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">90-Day Trend</h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-4">
            Avg Salary by Category
          </h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Jobs Distribution</h3>
        <div className="h-64 max-w-md mx-auto">
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "right",
                  labels: { color: "rgba(255,255,255,0.7)" },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-white font-semibold mb-4">Category Breakdown</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 text-gray-400 font-medium">Category</th>
              <th className="py-3 text-gray-400 font-medium">Jobs</th>
              <th className="py-3 text-gray-400 font-medium">Avg Salary</th>
              <th className="py-3 text-gray-400 font-medium">Avg Experience</th>
              <th className="py-3 text-gray-400 font-medium">Applications</th>
            </tr>
          </thead>
          <tbody>
            {categoryStats.map((stat) => (
              <tr key={stat.category} className="border-b border-gray-700/50">
                <td className="py-3 text-white">{stat.category}</td>
                <td className="py-3 text-gray-300">
                  {stat.totalJobs.toLocaleString()}
                </td>
                <td className="py-3 text-green-400">
                  {stat.avgSalary.toLocaleString()} PLN
                </td>
                <td className="py-3 text-gray-300">
                  {stat.avgExperience} years
                </td>
                <td className="py-3 text-blue-400">
                  {stat.totalApplications.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
