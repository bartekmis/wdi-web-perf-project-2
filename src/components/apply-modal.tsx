"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./ui/label";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grecaptcha: any;
  }
}

interface Job {
  id: string;
  role: string;
  companyName: string;
}

interface ApplyModalProps {
  offer: Job;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ offer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleModalOpen = () => {
    const startTime = performance.now();
    let result = 0;
    for (let i = 0; i < 99999999; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }
    const endTime = performance.now();
    console.log(
      `[INP Anti-Pattern] Ciężkie obliczenia przy otwieraniu modala zajęły: ${endTime - startTime}ms`
    );
    console.log(
      "Wartość result (żeby optymalizator nie usunął pętli):",
      result
    );
    
    setIsOpen(true);
  };

  const handleApplyClick = async () => {
    setIsApplying(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (typeof window !== "undefined" && window.grecaptcha) {
      try {
        const token = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: "submit_application" }
        );
        console.log("reCAPTCHA token:", token);
        alert(
          `Aplikacja dla ${
            offer.role
          } została wysłana! reCAPTCHA zweryfikowane. (Token: ${token.substring(
            0,
            10
          )}...)`
        );
      } catch (error) {
        console.error("reCAPTCHA failed:", error);
        alert("Weryfikacja reCAPTCHA nie powiodła się. Spróbuj ponownie.");
      }
    } else {
      console.warn("reCAPTCHA not loaded or not available.");
      alert(
        `Aplikacja dla ${offer.role} została wysłana! Brak weryfikacji reCAPTCHA.`
      );
    }

    setIsApplying(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 mt-6"
          onClick={() => setIsOpen(true)}
        >
          Aplikuj na to stanowisko
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aplikuj na: {offer.role}</DialogTitle>
          <p className="text-sm text-gray-500">
            Wypełnij formularz, aby wysłać swoje zgłoszenie do{" "}
            {offer.companyName}.
          </p>
        </DialogHeader>
        <form className="flex flex-col space-y-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="name">Imię i Nazwisko</Label>
            <Input
              id="name"
              defaultValue="Jan Kowalski"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              defaultValue="jan.kowalski@example.com"
              className="col-span-3"
              type="email"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="cv">Link do CV</Label>
            <Input
              id="cv"
              defaultValue="https://linkedin.com/in/jankowalski"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Wiadomość
            </Label>
            <Textarea
              id="message"
              placeholder="Dodatkowe informacje..."
              className="col-span-3"
            />
          </div>
          <div className="flex items-center space-x-2 col-span-4">
            <Checkbox id="terms" />
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Akceptuję regulamin i politykę prywatności.
            </Label>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleApplyClick}
            disabled={isApplying}
          >
            {isApplying ? "Wysyłanie..." : "Wyślij Aplikację"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
