'use client';
import { techIcons } from '@/data/techStack';

type ExperienceItemProps = {
    title: string;
    date: string;
    description: string;
    stack: string[]
};

function ExperienceItem({ title, date, description, stack }: ExperienceItemProps) {
    return (
        <>
            <a href="#" className="block">
                <div className="border-blue-500 p-4 mb-6 hover:bg-white/5 hover:scale-[1.02] transition-transform rounded cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm text-blue-400 font-mono">{date}</span>
                        <h3 className="text-xl font-semibold text-white">{title}</h3>
                    </div>

                    <p className="mt-2 text-lg text-gray-300">{description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {/* {stack.map((tech, idx) => (
                            <span key={idx} className="bg-blue-800/40 text-blue-200 text-xs px-2 py-1 rounded-full font-mono">
                                {tech}
                            </span>
                        ))} */}
                        {stack.map((tech, idx) => {
                            const techInfo = techIcons[tech];
                            const Icon = techInfo?.icon;
                            return (
                                <span key={idx} className="flex items-center  gap-2 bg-blue-800/40 text-blue-200 text-xs px-2 py-1 rounded-full font-mono">
                                    {Icon && <Icon className="w-4 h-4" style={{ color: techInfo?.color }} />}
                                    {techInfo?.label ?? tech}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </a>
        </>
    );
}

export default ExperienceItem;
