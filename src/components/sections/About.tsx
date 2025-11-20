'use client';

const About = () => {
  return (
    <section id="about">
      <div className="pl-2 flex flex-col gap-2 text-lg">
        <h2 className="text-xl font-bold mb-4 text-default">About</h2>

        <p>
          I’m a <span className="text-muted font-semibold">Frontend Developer</span> with over{' '}
          <span className="text-muted font-semibold">5 years of experience</span> building
          accessible, responsive, and secure web interfaces. My focus lies in crafting clean,
          maintainable code while collaborating across teams to create intuitive digital
          experiences.
        </p>

        <p>
          My main stack includes{' '}
          <span className="text-muted font-semibold">
            React, Next.js, TypeScript, and Tailwind CSS
          </span>
          , with experience in both frontend-heavy and fullstack roles. I’ve worked on{' '}
          <span className="text-muted font-semibold">e-wallet platforms</span>, data dashboards,
          component libraries, and internal tools — always with a{' '}
          <span className="text-muted font-semibold">mobile-first mindset</span> and strong
          attention to performance and usability.
        </p>

        <p>
          I’m <span className="text-muted font-semibold">self-taught</span>,{' '}
          <span className="text-muted font-semibold">proactive</span>, and always exploring ways
          to improve developer experience, product quality, and accessibility. Whether it’s coding,
          debugging, or refactoring, I enjoy being{' '}
          <span className="text-muted font-semibold">hands-on</span> and working closely with
          designers, backend engineers, and QA to bring reliable products to life.
        </p>

        <p>
          Outside of work, I practice{' '}
          <span className="text-muted font-semibold">Shotokan Karate (2nd Dan black belt)</span>,
          dive into tech learning, and enjoy games with sandbox exploration and fantasy. I believe
          good code and martial arts share something in common:{' '}
          <span className="text-muted font-semibold">
            clarity, discipline, and constant refinement
          </span>
          .
        </p>
      </div>
    </section>
  );
};

export default About;
