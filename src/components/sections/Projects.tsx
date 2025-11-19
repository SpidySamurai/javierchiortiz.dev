'use client';

import ProjectItem from '../items/ProjectItem';
import { projects } from '@/data/projects';

const Projects = () => {
  return (
    <section id="projects" className="pl-2 flex flex-col gap-6 text-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Projects</h2>
      {projects.map((project, idx) => (
        <ProjectItem key={idx} {...project} />
      ))}
    </section>
  );
};

export default Projects;
