'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { Labels } from './bind';

/** Translations for every piece of text drawn inside the scene, keyed by what the frame emits. */
export function useLineCopy(): Labels {
  const t = useTranslations('common');
  return useMemo(
    () => ({
      iter1: t('services_line.iteration_1'),
      iter2: t('services_line.iteration_2'),
      placing: t('services_line.status_placing'),
      testing1: t('services_line.status_testing_1'),
      issue: t('services_line.status_issue'),
      fixing: t('services_line.status_fixing'),
      retesting: t('services_line.status_retesting'),
      pass1: t('services_line.status_pass_1'),
      feedback: t('services_line.status_feedback'),
      improving: t('services_line.status_improving'),
      testing2: t('services_line.status_testing_2'),
      ready: t('services_line.status_ready'),
      deployed: t('services_line.deployed'),
      'step.build': t('services_line.step_build'),
      'step.test': t('services_line.step_test'),
      'step.feedback': t('services_line.step_feedback'),
      'step.improve': t('services_line.step_improve'),
    }),
    [t],
  );
}
