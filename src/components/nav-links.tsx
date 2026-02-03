"use client";

import { Route } from "@/types/navbar";

interface NavLinksProps {
  items: Route[];
  hoverCounts: Record<string, number>;
}

export function NavLinks({ items, hoverCounts }: NavLinksProps) {
  return (
    <>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="hover:text-blue-200 transition-colors duration-200 px-3 py-2 rounded"
          onMouseEnter={() =>
            console.log(
              `Hovered ${item.label}: Found ${hoverCounts[item.label] ?? 0} related jobs`,
            )
          }
        >
          {item.label}
        </a>
      ))}
    </>
  );
}
