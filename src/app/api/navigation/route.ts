import { navRoutes } from "@/lib/navigation";

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  return Response.json(navRoutes, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
