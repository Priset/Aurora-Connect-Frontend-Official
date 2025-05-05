"use client";

import { Navbar } from "@/components/layout/navbar";
import { HeroSlider } from "@/components/layout/hero-slider";
import { Footer } from "@/components/layout/footer";

export default function WelcomePage() {
  return (
      <div className="flex flex-col min-h-screen bg-[--neutral-400]">
        <Navbar />

        <main className="flex-grow">
          <HeroSlider />
        </main>

        <Footer />
      </div>
  );
}
