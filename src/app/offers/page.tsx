import { Header } from "@/components/header";
import { JobListServer } from "@/components/sections/job-list-server";

export default function OffersPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <JobListServer />
    </main>
  );
}
