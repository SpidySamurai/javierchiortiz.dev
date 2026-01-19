'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import GamerCard from '@/components/GamerCard';

interface GamerCardContextType {
  isOpen: boolean;
  isUnlocked: boolean;
  openCard: () => void;
  closeCard: () => void;
  unlockCard: () => void;
}

const GamerCardContext = createContext<GamerCardContextType | undefined>(undefined);

export function GamerCardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load state from localStorage on mount (client-only)
  useEffect(() => {
    setMounted(true);
    const unlocked = localStorage.getItem('gamer-card-unlocked') === 'true';
    setIsUnlocked(unlocked);
  }, []);

  const openCard = () => setIsOpen(true);
  const closeCard = () => setIsOpen(false);

  const unlockCard = () => {
    setIsUnlocked(true);
    localStorage.setItem('gamer-card-unlocked', 'true');
    setIsOpen(true); // Auto open on unlock
  };

  return (
    <GamerCardContext.Provider value={{ isOpen, isUnlocked, openCard, closeCard, unlockCard }}>
      {children}
      {/* Global Instance of GamerCard - Only render on client to avoid hydration mismatch */}
      {mounted && <GamerCard isOpen={isOpen} onClose={closeCard} />}
    </GamerCardContext.Provider>
  );
}

export function useGamerCard() {
  const context = useContext(GamerCardContext);
  if (context === undefined) {
    throw new Error('useGamerCard must be used within a GamerCardProvider');
  }
  return context;
}
