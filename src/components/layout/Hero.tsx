'use client';

import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { SiReact, SiNextdotjs, SiTailwindcss, SiTypescript } from 'react-icons/si';
import Cat from '../Cat';

const Hero = () => {
  return (
    <section className="mt-8 flex items-center justify-center text-white px-4">
      <div className="max-w-md ">
        <h1 className="text-4xl md:text-4xl font-bold">Javier Chi Ortíz</h1>
        <h2 className="text-2xl text-gray-300 mt-0.5">Front End Engineer</h2>
        <Cat></Cat>
        <p className="max-w-80 mt-4  text-lg text-gray-400 leading-relaxed">
          I build scalable, mobile-first digital experiences for the web.
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <SiReact className="text-cyan-400" />
            <span>React</span>
          </div>
          <div className="flex items-center gap-1">
            <SiNextdotjs className="text-white" />
            <span>Next.js</span>
          </div>
          <div className="flex items-center gap-1">
            <SiTailwindcss className="text-sky-400" />
            <span>Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-1">
            <SiTypescript className="text-blue-400" />
            <span>TypeScript</span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6 text-xl text-white">
          <a href="https://github.com/SpidySamurai" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/javier-fernando-chi-ortiz/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition">
            <FaLinkedin />
          </a>
          <a href="https://www.instagram.com/javi_spidy/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition">
            <FaInstagram />
          </a>
          <a href="https://wa.me/5219994875155" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition">
            <FaWhatsapp />
          </a>
        </div>

        {/* Contact Button */}
        <div className="mt-6 flex justify-center">
          <a
            href="#contact"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-xl transition"
          >
            Contact me
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
