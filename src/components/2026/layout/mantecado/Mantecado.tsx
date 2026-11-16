'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMantecadoEntrance } from '@/hooks/useMantecadoEntrance';
import MantecadoCat from './MantecadoCat';
import MantecadoRun from './MantecadoRun';

/**
 * Mantecado on the home page: the run across the screen, then the cat peeking
 * from the bottom-right corner while the hero is out of view.
 */
export default function Mantecado() {
  const { running, endRun, showCorner, reduceMotion } = useMantecadoEntrance('hero');

  return (
    <>
      {running && <MantecadoRun onDone={endRun} />}
      <AnimatePresence>
        {showCorner && (
          <motion.div
            key="mantecado"
            initial={reduceMotion ? false : { y: '120%' }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { y: '120%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-3 right-3 z-[9999] h-[100px] w-[100px] overflow-visible pointer-events-none"
          >
            <MantecadoCat />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
