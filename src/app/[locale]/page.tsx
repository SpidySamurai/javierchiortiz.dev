'use client';

import React from 'react'; // Added import for React
import Hero from '@/components/layout/Hero';
import MainContent from '@/components/sections/MainContent';
import Footer from '@/components/layout/Footer';
import FlatCat from '@/components/FlatCat';

import GamerCard from '@/components/GamerCard'; // Added import for GamerCard

export default function Home() {
  const [showEasterEgg, setShowEasterEgg] = React.useState(false); // Added state for showEasterEgg

  return (
    <main className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col lg:flex-row w-full max-w-screen-xl">
        {/* Hero Section - Fijo en pantallas grandes */}
        <div className="lg:w-1/2 lg:h-screen lg:sticky top-0 flex items-center justify-center flex-col gap-4">
          <Hero />
          {/* Temporary mount for verification */}
          <div className="mt-8">
            <FlatCat onUnlock={() => setShowEasterEgg(true)} /> {/* Added onUnlock prop to FlatCat */}
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

      {/* Render GamerCard at the bottom of the page */}
      <GamerCard isOpen={showEasterEgg} onClose={() => setShowEasterEgg(false)} />
    </main>
  );
}
