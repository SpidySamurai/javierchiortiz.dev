'use client';

import React, { useState } from 'react';
import GamerCard from '@/components/GamerCard';
import { useLanyard } from '@/hooks/useLanyard';

const DISCORD_ID = '363896212874723331';

export default function TestGamerCardPage() {
    const [isOpen, setIsOpen] = useState(true);
    const { data: lanyardData } = useLanyard({ userId: DISCORD_ID });

    return (
        <div className="min-h-screen bg-[#090a10] overflow-y-auto p-8 relative">
            <div className="flex flex-col items-center justify-center min-h-[50vh] mb-8">
                <h1 className="text-white/20 text-sm font-mono mb-4">GamerCard Testing Route (Temporary)</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/20 mb-8"
                >
                    Re-open Card
                </button>

                {/* VISUALIZER FOR USER */}
                <div className="w-full max-w-4xl bg-black/50 border border-white/10 rounded-xl p-6 font-mono text-xs text-green-400 overflow-x-auto shadow-2xl backdrop-blur-sm z-0">
                    <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">📡 Live Lanyard Output (Raw JSON)</h3>
                    <pre>{JSON.stringify(lanyardData, null, 2)}</pre>
                </div>
            </div>

            <GamerCard
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    );
}
