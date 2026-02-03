import { SectionISR } from "@/components/sections/section-isr";

export const revalidate = 30; // ISR: Revalidate this page every 30 seconds

export default function ISRPage() {
  return <SectionISR />;
}
