'use client';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';

interface Props {
  activeSection: 'About' | 'Experience' | 'Projects';
}

const MainContent = ({ activeSection }: Props) => {
  return (
      <div className="mt-6 w-full ">
        <h2 className='text-white text-4xl mb-4'>{activeSection}</h2>
        {activeSection === 'About' && <About />}
        {activeSection === 'Experience' && <Experience />}
        {activeSection === 'Projects' && <Projects />}
      </div>
  );
};

export default MainContent;
