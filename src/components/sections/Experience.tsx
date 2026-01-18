import ExperienceItem from '@/components/items/ExperienceItem';
import { experiences } from '@/data/experiences';
import { useTranslations } from 'next-intl';

function ExperienceSection() {
  const t = useTranslations('common');
  return (
    <section id="experience">
      <h2 className="text-xl font-bold mb-4 text-default">{t('experience')}</h2>
      {experiences.map((exp, index) => {
        const expId = exp.id || `experience_${index}`;
        return (
          <ExperienceItem
            key={expId}
            title={t(`experience_items.${expId}.title`)}
            date={t(`experience_items.${expId}.date`)}
            description={t(`experience_items.${expId}.description`)}
            stack={exp.stack}
            url={exp.url}
          />
        );
      })}
    </section>
  );
}

export default ExperienceSection;
