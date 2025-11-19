import ExperienceItem from '@/components/items/ExperienceItem';
import { experiences } from '@/data/experiences';

function ExperienceSection() {
  return (
    <section id="experience">
      <h2 className="text-xl font-bold mb-4 text-white">Experience</h2>
      {experiences.map((exp, index) => (
        <ExperienceItem
          key={index}
          title={exp.title}
          date={exp.date}
          description={exp.description}
          stack={exp.stack}
        />
      ))}
    </section>
  );
}

export default ExperienceSection;
