import React from 'react';
import { SiGithub, SiTwitch, SiSpotify } from 'react-icons/si';
import { LuGamepad2 } from 'react-icons/lu';

type SocialLink = {
  name: string;
  label: string;
  icon: React.ReactNode;
  href: string;
};

const LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    label: 'SpidySamurai',
    icon: <SiGithub />,
    href: 'https://github.com/SpidySamurai',
  },
  {
    name: 'Twitch',
    label: 'Twitch',
    icon: <SiTwitch />,
    href: '#',
  },
  {
    name: 'Xbox',
    label: 'Xbox',
    icon: <LuGamepad2 />,
    href: '#',
  },
  {
    name: 'Spotify',
    label: 'Spotify',
    icon: <SiSpotify />,
    href: '#',
  },
];

export const SocialLinks = () => {
  return (
    <nav className="w-full">
      <ul className="grid grid-cols-2 md:grid-cols-1 gap-2">
        {LINKS.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 md:gap-3 bg-white/5 p-2.5 md:p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group text-left"
              aria-label={`Visit ${link.name} Profile`}
            >
              <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity text-gray-400 group-hover:text-[#c0c1ff]">
                {link.icon}
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-white font-semibold truncate">
                {link.label}
              </span>
              <svg
                className="ml-auto w-2.5 h-2.5 md:w-3 md:h-3 text-gray-700 group-hover:text-[#c0c1ff] hidden md:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
