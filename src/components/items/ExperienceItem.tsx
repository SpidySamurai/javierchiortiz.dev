'use client';
import TechStack from '@/components/items/TechStack';


type ExperienceItemProps = {
    title: string;
    date: string;
    description: string;
    stack: string[]
};

function  ExperienceItem({ title, date, description, stack }: ExperienceItemProps) {
  return (
    <>
    <a href="#" className="block">
      <div className="border-blue-500 p-4 mb-6 hover:bg-white/5 hover:scale-[1.02] transition-transform rounded cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-sm text-blue-400 font-mono">{date}</span>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>

        <p className="mt-2 text-lg text-gray-300">{description}</p>

        <TechStack stack={stack} />
      </div>
    </a>
    
    </>
  );
}

export default ExperienceItem;
