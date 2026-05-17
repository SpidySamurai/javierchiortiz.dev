'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

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

  useEffect(() => {
    const unlocked = localStorage.getItem('gamer-card-unlocked') === 'true';
    setIsUnlocked(unlocked);
  }, []);

  const openCard = () => setIsOpen(true);
  const closeCard = () => setIsOpen(false);

  const unlockCard = () => {
    setIsUnlocked(true);
    localStorage.setItem('gamer-card-unlocked', 'true');
    setIsOpen(true);
  };

  return (
    <GamerCardContext.Provider value={{ isOpen, isUnlocked, openCard, closeCard, unlockCard }}>
      {children}
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
