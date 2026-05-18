'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import GamerCard from '@/components/GamerCard';

interface GamerCardContextType {
  isOpen: boolean;
  isUnlocked: boolean;
  openCard: (anchorY?: number) => void;
  closeCard: () => void;
  unlockCard: () => void;
}

const GamerCardContext = createContext<GamerCardContextType | undefined>(undefined);

export function GamerCardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [anchorY, setAnchorY] = useState<number | null>(null);

  useEffect(() => {
    const unlocked = localStorage.getItem('gamer-card-unlocked') === 'true';
    setIsUnlocked(unlocked);
  }, []);

  const openCard = (y?: number) => { setAnchorY(y ?? null); setIsOpen(true); };
  const closeCard = () => setIsOpen(false);

  const unlockCard = () => {
    setIsUnlocked(true);
    localStorage.setItem('gamer-card-unlocked', 'true');
    setIsOpen(true);
  };

  return (
    <GamerCardContext.Provider value={{ isOpen, isUnlocked, openCard, closeCard, unlockCard }}>
      {children}
      <GamerCard isOpen={isOpen} onClose={closeCard} anchorY={anchorY} />
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
