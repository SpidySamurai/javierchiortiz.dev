'use client';

import { usePageView } from '@/hooks/usePageView';
import { useSectionTracking } from '@/hooks/useSectionTracking';

export default function AnalyticsTracker() {
  usePageView();
  useSectionTracking();
  return null;
}
