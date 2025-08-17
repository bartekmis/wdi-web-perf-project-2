"use client";

import { Job } from "@/types/job";
import { useEffect } from "react";
import { saveVisitedJob } from "@/components/last-visited-banner";

export const OfferPageClient = ({ offer }: { offer: Job }) => {
  useEffect(() => {
    if (offer) {
      saveVisitedJob(offer);
      console.log("[OfferPage] Zapisano ofertę do localStorage:", offer);
    }
  }, [offer]);

  return null;
};
