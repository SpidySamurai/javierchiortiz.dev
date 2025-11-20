'use client';
import About from './About';
import Experience from './Experience';
import Projects from './Projects';

interface Props {
  activeSection: 'About' | 'Experience' | 'Projects';
}

const MainContent = ({}: Props) => {
  return (
    <div className="text-muted mt-6 w-full ">
      {/* <h2 className='text-default text-4xl mb-4'>{activeSection}</h2> */}
      <div className="flex flex-col gap-10">
        <About />
        <Experience />
        <Projects />
      </div>
    </div>
  );
};

export default MainContent;
