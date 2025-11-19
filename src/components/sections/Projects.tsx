'use client';

import { useMemo, useState } from 'react';
import ProjectItem from '../items/ProjectItem';
import { projects } from '@/data/projects';

const Projects = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(q);
      const inDesc = p.description?.toLowerCase().includes(q);
      const inStack = p.stack?.some((s) => s.toLowerCase().includes(q));
      const inUrl = !!p.projectUrl && p.projectUrl.toLowerCase().includes(q);
      return inTitle || inDesc || inStack || inUrl;
    });
  }, [query]);

  return (
    <section id="projects" className="pl-2 flex flex-col gap-6 text-lg">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold mb-2 text-white">Projects</h2>

        <div className="flex items-center gap-2">
          <label htmlFor="projects-search" className="sr-only">
            Buscar proyectos
          </label>
          <input
            id="projects-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyectos (titulo, tech, descripcion)"
            className="w-full max-w-md bg-white/5 text-white placeholder:text-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {query && (
            <button
              aria-label="Limpiar búsqueda"
              onClick={() => setQuery('')}
              className="ml-2 text-sm text-gray-300 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="pt-2 flex flex-col gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-400">{`No se encontraron proyectos para "${query}"`}</p>
        ) : (
          filtered.map((project, idx) => <ProjectItem key={project.title + idx} {...project} />)
        )}
      </div>
    </section>
  );
};

export default Projects;
