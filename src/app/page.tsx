'use client';

import Hero from "@/components/layout/Hero";
import Navbar from "@/components/layout/Navbar";
import MainContent from "@/components/sections/MainContent";
import { useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState<'About' | 'Experience' | 'Projects'>('About');
  return (
    <main>
      <div className="border flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* Hero Section */}
        <div className=" lg:w-2/5 flex items-center justify-center">
          <Hero />
        </div>

        {/* Main Content Section */}
        <div className=" lg:w-3/5 px-4 py-8 flex flex-col items-center lg:overflow-y-auto h-full">
          <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
          <MainContent activeSection={activeSection} />
        </div>
      </div>





      {/* <h1 className="mt-6 text-3xl text-center text-white">
        Página en construcción
      </h1 >
      <p className="text-lg text-center text-white mb-6">
        Tomate un tecito o un cafecito, que ya está por llover 🌧️☕
      </p>
      <div className="flex justify-center ">
        <img
          src="https://i.gifer.com/7plP.gif" // puedes cambiar este gif por otro si quieres
          alt="Lluvia tranquila"
          className="w-72 h-auto rounded-lg shadow-md"
        />
      </div> */}
    </main>
  );
}
