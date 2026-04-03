import React, { type ReactNode } from 'react';
import { LuFlame, LuStar, LuShield, LuCodeXml, LuZap, LuGem } from 'react-icons/lu';
import type { LanyardUser } from '@/types/lanyard';

type BadgeListProps = {
  user?: LanyardUser;
  userId: string;
};

type Badge = {
  icon: ReactNode;
  name: string;
  color: string;
};

export const BadgeList = ({ user, userId }: BadgeListProps) => {
  // Badge Logic (Decoding public_flags)
  const getBadges = (userData?: LanyardUser): Badge[] => {
    const flags = userData?.public_flags || 0;
    const badges: Badge[] = [];

    // HypeSquad (House 1, 2, 3)
    if (flags & (1 << 6))
      badges.push({ icon: <LuFlame />, name: 'HypeSquad Bravery', color: 'text-purple-400' });
    if (flags & (1 << 7))
      badges.push({ icon: <LuStar />, name: 'HypeSquad Brilliance', color: 'text-red-400' });
    if (flags & (1 << 8))
      badges.push({ icon: <LuShield />, name: 'HypeSquad Balance', color: 'text-green-400' });

    // Active Developer
    if (flags & (1 << 22))
      badges.push({ icon: <LuCodeXml />, name: 'Active Developer', color: 'text-blue-400' });

    // Static visual additions for style (Nitro, Subscriber)
    if (userData?.id === userId) {
      badges.push({ icon: <LuZap />, name: 'Nitro', color: 'text-[#afadff]' });
      badges.push({ icon: <LuGem />, name: 'Subscriber', color: 'text-[#c0c1ff]' });
    }

    return badges;
  };

  const badges = getBadges(user);

  return (
    <ul
      className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-6 md:mb-8"
      aria-label="User Badges"
    >
      {badges.map((b, i) => (
        <li
          key={i}
          className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/10 group cursor-default hover:bg-white/10 transition-colors"
          title={b.name}
        >
          <span className={`text-base md:text-lg ${b.color} group-hover:text-white transition-colors`} aria-hidden="true">
            {b.icon}
          </span>
          <span
            className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${b.color} group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto overflow-hidden text-nowrap`}
          >
            {b.name.split(' ')[0]}
          </span>
        </li>
      ))}
    </ul>
  );
};
