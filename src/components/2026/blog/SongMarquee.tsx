'use client';

import { motion } from 'framer-motion';

const SONGS = [
  'Holding On to You',
  'Stressed Out',
  'Ride',
  'Car Radio',
  'Heathens',
  'Jumpsuit',
  'Fairly Local',
  'Chlorine',
  'Levitate',
  'Tear in My Heart',
  'Lane Boy',
  'The Judge',
  'Polarize',
  'Morph',
  'Shy Away',
  'Overcompensate',
  'Bandito',
  'Ode to Sleep',
  'Migraine',
  'Goner',
  'Pet Cheetah',
  'Smithereens',
  'Never Take It',
  'Levitate',
  'Cut My Lip',
  'Screen',
];

function Separator() {
  return (
    <motion.span
      animate={{
        opacity: [0.4, 1, 0.3, 0.9, 0.5, 1, 0.4],
        textShadow: [
          '0 0 4px rgba(240,192,64,0.3)',
          '0 0 12px rgba(240,192,64,0.9)',
          '0 0 4px rgba(240,192,64,0.2)',
          '0 0 16px rgba(240,192,64,1)',
          '0 0 6px rgba(240,192,64,0.4)',
          '0 0 14px rgba(240,192,64,0.95)',
          '0 0 4px rgba(240,192,64,0.3)',
        ],
      }}
      transition={{
        duration: 2.4,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.2, 0.35, 0.55, 0.7, 0.85, 1],
      }}
      className="mx-6 select-none"
      style={{
        color: '#f0c040',
        fontFamily: 'var(--font-manrope), sans-serif',
        fontWeight: 900,
        fontSize: '1rem',
        letterSpacing: '0.1em',
      }}
    >
      |-/
    </motion.span>
  );
}

function MarqueeTrack() {
  return (
    <div className="flex items-center whitespace-nowrap">
      {SONGS.map((song, i) => (
        <span key={i} className="flex items-center">
          <span
            className="text-sm uppercase tracking-widest select-none"
            style={{
              color: 'rgba(240,240,240,0.55)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontWeight: 500,
            }}
          >
            {song}
          </span>
          <Separator />
        </span>
      ))}
    </div>
  );
}

export default function SongMarquee() {
  return (
    <div className="w-full overflow-hidden py-3" style={{ borderTop: '1px solid rgba(240,192,64,0.1)', borderBottom: '1px solid rgba(240,192,64,0.1)' }}>
      <div
        className="flex"
        style={{
          animation: 'marquee 40s linear infinite',
        }}
      >
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
