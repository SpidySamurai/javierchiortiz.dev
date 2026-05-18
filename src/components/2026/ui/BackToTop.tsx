'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-24 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, var(--ds-primary), color-mix(in srgb, var(--ds-primary) 70%, #8083ff))',
            boxShadow: '0 4px 20px color-mix(in srgb, var(--ds-primary) 35%, transparent)',
            color: 'var(--ds-bg)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span translate="no" className="material-symbols-outlined text-[20px]">arrow_upward</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
