'use client';

import Image from 'next/image';
import TechStack from './TechStack';

type ProjectItemProps = {
  title: string;
  imageUrl: string;
  description: string;
  stack: string[];
  projectUrl?: string;
};

export default function ProjectItem({
  title,
  imageUrl,
  description,
  stack,
  projectUrl,
}: ProjectItemProps) {
  return (
    <a href={projectUrl || '#'} target="_blank" rel="noopener noreferrer" className="block">
      <div className="rounded-lg overflow-hidden transition-transform duration-300 p-4 space-y-4 hover:bg-white/5 hover:scale-[1.02] cursor-pointer">
        <h3 className="text-xl font-bold text-white">{title}</h3>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full min-w-[220] max-w-[320] h-[100px] relative">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-md"
            />
          </div>

          <p className="text-sm text-gray-300">{description}</p>
        </div>

        <TechStack stack={stack} />
      </div>
    </a>
  );
}
