"use client";

import Link from "next/link";
import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { saveVisitedJob } from "@/components/last-visited-banner";
import { cn } from "@/lib/utils";

export type JobCardVariant =
  | "client"
  | "server"
  | "seo"
  | "suspense"
  | "isr"
  | "ppr"
  | "default";

interface JobCardProps {
  job: Job;
  variant?: JobCardVariant;
  showMetadata?: boolean;
  metadata?: {
    index?: number;
    timestamp?: string;
    renderType?: string;
    cacheInfo?: string;
    serverLoadTime?: string;
  };
  onJobClick?: (job: Job) => void;
  onApply?: (job: Job) => void;
  buttonText?: string;
  showResponsibilities?: boolean;
  showBenefits?: boolean;
  maxResponsibilities?: number;
  maxBenefits?: number;
  className?: string;
}

const variantConfig = {
  client: {
    colors: {
      border: "border-blue-300",
      company: "text-blue-600",
      badge: "bg-blue-100 text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
      metadata: "bg-blue-100 text-blue-700",
    },
    name: "CSR",
  },
  server: {
    colors: {
      border: "border-green-300",
      company: "text-green-600",
      badge: "bg-green-100 text-green-800",
      button: "bg-green-600 hover:bg-green-700",
      metadata: "bg-green-100 text-green-700",
    },
    name: "SSR",
  },
  seo: {
    colors: {
      border: "border-yellow-300",
      company: "text-yellow-600",
      badge: "bg-yellow-100 text-yellow-800",
      button: "bg-yellow-600 hover:bg-yellow-700",
      metadata: "bg-yellow-100 text-yellow-700",
    },
    name: "SSG",
  },
  suspense: {
    colors: {
      border: "border-purple-300",
      company: "text-purple-600",
      badge: "bg-purple-100 text-purple-800",
      button: "bg-purple-600 hover:bg-purple-700",
      metadata: "bg-purple-100 text-purple-700",
    },
    name: "Suspense",
  },
  isr: {
    colors: {
      border: "border-orange-300",
      company: "text-orange-600",
      badge: "bg-orange-100 text-orange-800",
      button: "bg-orange-600 hover:bg-orange-700",
      metadata: "bg-orange-100 text-orange-700",
    },
    name: "ISR",
  },
  ppr: {
    colors: {
      border: "border-blue-300",
      company: "text-blue-600",
      badge: "bg-blue-100 text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700",
      metadata: "bg-blue-100 text-blue-700",
    },
    name: "PPR",
  },
  default: {
    colors: {
      border: "border-gray-300",
      company: "text-gray-600",
      badge: "bg-gray-100 text-gray-800",
      button: "bg-gray-600 hover:bg-gray-700",
      metadata: "bg-gray-100 text-gray-700",
    },
    name: "Default",
  },
};

export const JobCard = ({
  job,
  variant = "default",
  showMetadata = false,
  metadata,
  onJobClick,
  onApply,
  buttonText = "See offer",
  showResponsibilities = true,
  showBenefits = false,
  maxResponsibilities = 2,
  maxBenefits = 3,
  className,
}: JobCardProps) => {
  const config = variantConfig[variant];

  const handleApply = (e: React.MouseEvent) => {
    console.log(`Viewing offer: ${job.role} at ${job.companyName}`);

    if (onApply) {
      onApply(job);
    }
  };
  const handleJobClick = () => {
    saveVisitedJob(job);
    console.log(`Job visited: ${job.role} at ${job.companyName}`);

    if (onJobClick) {
      onJobClick(job);
    }
  };

  return (
    <Card
      className={cn(
        "p-6 hover:shadow-lg transition-shadow cursor-pointer border-2",
        config.colors.border,
        className
      )}
      onClick={handleJobClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{job.role}</h3>
          <p className={cn("font-medium", config.colors.company)}>
            {job.companyName}
          </p>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "text-xs px-2 py-1 rounded block",
              config.colors.badge
            )}
          >
            {job.position}
          </span>
          {showMetadata && metadata?.index !== undefined && (
            <span className="text-xs text-gray-500 mt-1 block">
              {config.name} #{metadata.index + 1}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>📍 {job.location}</p>
        <p>💼 {job.workMode}</p>
        <p>🏷️ {job.category}</p>

        {showMetadata && (
          <div className={cn("p-2 rounded text-xs", config.colors.metadata)}>
            {metadata?.renderType && <p>🔧 {metadata.renderType}</p>}
            {metadata?.cacheInfo && <p>⚡ {metadata.cacheInfo}</p>}
            {metadata?.serverLoadTime && <p>⏱️ {metadata.serverLoadTime}</p>}
            {metadata?.timestamp && (
              <p>
                🕒 Generated:{" "}
                {new Date(metadata.timestamp).toLocaleTimeString()}
              </p>
            )}
          </div>
        )}
      </div>

      {showResponsibilities &&
        job.responsibilities &&
        job.responsibilities.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">
              Główne obowiązki:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {job.responsibilities
                .slice(0, maxResponsibilities)
                .map((resp, i) => (
                  <li key={i}>• {resp}</li>
                ))}
            </ul>
          </div>
        )}

      {showBenefits && job.benefits && job.benefits.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Benefity:</h4>
          <div className="flex flex-wrap gap-1">
            {job.benefits.slice(0, maxBenefits).map((benefit, i) => (
              <span
                key={i}
                className={cn("text-xs px-2 py-1 rounded", config.colors.badge)}
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
      )}

      <Link href={`/offers/${job.id}`} className="block">
        <div
          className={cn(
            "w-full text-white py-2 px-4 rounded transition-colors",
            config.colors.button
          )}
          onClick={handleApply}
        >
          {buttonText}
        </div>
      </Link>

      {showMetadata && metadata?.cacheInfo && variant === "isr" && (
        <p className="text-xs text-center text-gray-500 mt-2">
          Cached until: {new Date(Date.now() + 60000).toLocaleTimeString()}
        </p>
      )}
    </Card>
  );
};
