'use client';

import ExperienceItem from '@/components/items/ExperienceItem';
import { experiences } from '@/data/experiences';
import { useTranslation } from 'react-i18next';

function ExperienceSection() {
  const { t } = useTranslation('common');
  return (
    <section id="experience">
      <h2 className="text-xl font-bold mb-4 text-default">{t('experience')}</h2>
      {experiences.map((exp, index) => {
        const expId = exp.id || `experience_${index}`;
        return (
          <ExperienceItem
            key={expId}
            title={t(`experience_items.${expId}.title`, { defaultValue: exp.title })}
            date={t(`experience_items.${expId}.date`, { defaultValue: exp.date })}
            description={t(`experience_items.${expId}.description`, { defaultValue: exp.description })}
            stack={exp.stack}
          />
        );
      })}
    </section>
  );
}

export default ExperienceSection;
