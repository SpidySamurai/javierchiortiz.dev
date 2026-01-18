import React from 'react';

type BadgeListProps = {
  user?: any;
  userId: string;
};

export const BadgeList = ({ user, userId }: BadgeListProps) => {
  // Badge Logic (Decoding public_flags)
  const getBadges = (userData: any) => {
    const flags = userData?.public_flags || 0;
    const badges = [];

    // HypeSquad (House 1, 2, 3)
    if (flags & (1 << 6))
      badges.push({ icon: '🏠', name: 'HypeSquad Bravery', color: 'text-purple-400' });
    if (flags & (1 << 7))
      badges.push({ icon: '🌟', name: 'HypeSquad Brilliance', color: 'text-red-400' });
    if (flags & (1 << 8))
      badges.push({ icon: '🛡️', name: 'HypeSquad Balance', color: 'text-green-400' });

    // Active Developer
    if (flags & (1 << 22))
      badges.push({ icon: '🛠️', name: 'Active Developer', color: 'text-blue-400' });

    // Static visual additions for style (Nitro, Subscriber)
    if (userData?.id === userId) {
      badges.push({ icon: '⚡', name: 'Nitro', color: 'text-pink-400' });
      badges.push({ icon: '💠', name: 'Subscriber', color: 'text-blue-300' });
    }

    return badges;
  };

  const badges = getBadges(user);

  return (
    <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 mb-6 md:mb-8">
      {badges.map((b, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/10 group cursor-default hover:bg-white/10 transition-colors"
        >
          <span className="text-base md:text-lg">{b.icon}</span>
          <span
            className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${b.color} opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto overflow-hidden`}
          >
            {b.name.split(' ')[0]}
          </span>
        </div>
      ))}
    </div>
  );
};
