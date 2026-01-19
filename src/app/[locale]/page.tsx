'use client';

import React from 'react';
import Hero from '@/components/layout/Hero';
import MainContent from '@/components/sections/MainContent';
import Footer from '@/components/layout/Footer';
import FlatCat from '@/components/FlatCat';
import { useGamerCard } from '@/components/providers/GamerCardContext';

export default function Home() {
  const { unlockCard } = useGamerCard();

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col lg:flex-row w-full max-w-screen-xl">
        {/* Hero Section - Fijo en pantallas grandes */}
        <div className="lg:w-1/2 lg:h-screen lg:sticky top-0 flex items-center justify-center flex-col gap-4">
          <Hero />
          {/* Temporary mount for verification */}
          <div className="mt-8">
            <FlatCat onUnlock={unlockCard} />
          </div>
        </div>

        {/* Main Content Section - Genera scroll */}
        <div className="lg:w-1/2 px-4 py-8 flex flex-col items-center">
          <MainContent />
        </div>
      </div>

      <div className="w-full max-w-screen-xl px-4">
        <Footer />
      </div>
    </main>
  );
}
