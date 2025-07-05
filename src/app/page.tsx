'use client';

import Hero from "@/components/layout/Hero";
import Navbar from "@/components/layout/Navbar";
import MainContent from "@/components/sections/MainContent";
import { useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState<'About' | 'Experience' | 'Projects'>('About');
  return (
    <main className="flex justify-center">
      <div className="flex flex-col lg:flex-row w-full max-w-screen-xl">

        {/* Hero Section - Fijo en pantallas grandes */}
        <div className="lg:w-1/2 lg:h-screen lg:sticky top-0 flex items-center justify-center flex-col gap-4">
          <Hero />
        </div>

        {/* Main Content Section - Genera scroll */}
        <div className="lg:w-1/2 px-4 py-8 flex flex-col items-center">
          <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
          <MainContent activeSection={activeSection} />
        </div>

      </div>
    </main>

  );
}
