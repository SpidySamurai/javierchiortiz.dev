'use client';

import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation('common');
  const paragraphs = [
    t('about_paragraph_1'),
    t('about_paragraph_2'),
    t('about_paragraph_3'),
    t('about_paragraph_4'),
  ];
  return (
    <section id="about">
      <div className="pl-2 flex flex-col gap-2 text-lg">
        <h2 className="text-xl font-bold mb-4 text-default">{t('about')}</h2>

        {paragraphs.map((paragraph, index) => (
          <p key={`about-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
};

export default About;
