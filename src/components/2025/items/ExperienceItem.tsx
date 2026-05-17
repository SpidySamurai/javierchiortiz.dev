'use client';
import TechStack from '@/components/2025/items/TechStack';

type ExperienceItemProps = {
  title: string;
  date: string;
  description: string;
  stack: string[];
  url?: string;
};

function ExperienceItem({ title, date, description, stack, url }: ExperienceItemProps) {
  return (
    <>
      <a
        href={url || '#'}
        target={url ? '_blank' : undefined}
        rel={url ? 'noopener noreferrer' : undefined}
        className="block"
      >
        <div className="border-blue-500 p-4 mb-6 hover:bg-surface hover:scale-[1.01] transition-transform rounded cursor-pointer">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-sm text-blue-400 font-mono">{date}</span>
            <h3 className="text-xl font-semibold text-default">{title}</h3>
          </div>

          <p className="mt-2 text-lg text-muted">{description}</p>

          <TechStack stack={stack} />
        </div>
      </a>
    </>
  );
}

export default ExperienceItem;
