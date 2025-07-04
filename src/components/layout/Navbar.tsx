'use client';
import { Dispatch, SetStateAction } from 'react';

type Section = 'About' | 'Experience' | 'Projects';

interface Props {
  activeSection: Section;
  setActiveSection: Dispatch<SetStateAction<Section>>;
}

const navLinks: { href: Section; label: string }[] = [
  { href: 'About', label: 'About me' },
  { href: 'Experience', label: 'Experience' },
  { href: 'Projects', label: 'Projects' },
];

const Navbar = ({ activeSection, setActiveSection }: Props) => {
  return (
    <nav className=" p-4 flex justify-center gap-6 items-center text-white">
      {navLinks.map((link) => (
        <button
          key={link.href}
          onClick={() => setActiveSection(link.href)} // 👈 sin any
          className={`relative after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-cyan-300 after:scale-x-0 after:transition-transform after:duration-300 after:origin-left ${
            activeSection === link.href ? 'after:scale-x-100 text-cyan-300' : 'text-white'
          } hover:text-cyan-300`}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
