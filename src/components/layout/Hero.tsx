import { useTranslations } from 'next-intl';
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { SiReact, SiNextdotjs, SiTailwindcss, SiTypescript } from 'react-icons/si';

const Hero = () => {
  const t = useTranslations('common');
  return (
    <section className="min-w-[320px] mt-8 flex items-center text-center justify-center text-default px-4 lg:text-left">
      <div className="max-w-md">
        <h1 className="text-4xl md:text-4xl font-bold text-default">Javier Chi Ortíz</h1>
        <h2 className="text-2xl text-muted mt-0.5">{t('hero_subtitle')}</h2>

        <p className="max-w-80 mt-4 text-lg text-muted leading-relaxed">
          {t('hero_description')}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-muted text-sm">
          <div className="flex items-center gap-1">
            <SiReact className="text-secondary" />
            <span>React</span>
          </div>
          <div className="flex items-center gap-1">
            <SiNextdotjs className="text-default" />
            <span>Next.js</span>
          </div>
          <div className="flex items-center gap-1">
            <SiTailwindcss className="text-secondary-light" />
            <span>Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-1">
            <SiTypescript className="text-secondary-light" />
            <span>TypeScript</span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-6 text-xl text-default lg:justify-start">
          <a
            href="https://github.com/SpidySamurai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in new tab)"
            className="text-default hover:text-secondary transition"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/javier-fernando-chi-ortiz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in new tab)"
            className="text-default hover:text-secondary transition"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.instagram.com/javi_spidy/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram (opens in new tab)"
            className="text-default hover:text-secondary transition"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/5219994875155"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp (opens in new tab)"
            className="text-default hover:text-secondary transition"
          >
            <FaWhatsapp />
          </a>
        </div>

        {/* Contact Button */}
        {/* <div className="mt-6 flex justify-center">
            <a
              href="#contact"
              className="bg-secondary hover:bg-secondary-light text-default font-medium px-6 py-2 rounded-xl transition"
            >
              Contact me
            </a>
        </div> */}
      </div >
    </section >
  );
};

export default Hero;
