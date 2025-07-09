'use client';

import ProjectItem from "../items/ProjectItem";
import { projects } from "@/data/projects";

const Projects = () => {
  return (
    <div className="pl-2 flex flex-col gap-6 text-lg">
      {projects.map((project, idx) => (
        <ProjectItem key={idx} {...project} />
      ))}
    </div>
  );
};

export default Projects;
