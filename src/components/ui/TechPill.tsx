'use client';

import React from 'react';
import type { IconType } from 'react-icons';

type TechPillProps = {
  label: string;
  Icon?: IconType;
  color?: string;
};

export default function TechPill({ label, Icon, color }: TechPillProps) {
  return (
    <span className="flex items-center gap-2 bg-blue-800/40 text-blue-200 text-xs px-2 py-1 rounded-full font-mono">
      {Icon && <Icon className="w-4 h-4" style={{ color }} />}
      {label}
    </span>
  );
}
