import type { LoopSources } from '@/types';

export const LAB2NEXT_SITE_URL = 'https://lab2next.com/';
export const LAB2NEXT_APP_URL = 'https://app.lab2next.com/';

/** What the product does for a lab, as message keys under `common.product_caps`. */
export const LAB2NEXT_CAPABILITIES = ['orders', 'delivery', 'quality', 'operations'] as const;

/**
 * A walkthrough of the app in its own brand theme with a fictitious, busy lab: dashboard,
 * recent activity, an order with validated results and the patient's results QR.
 */
export const LAB2NEXT_LOOP: LoopSources = {
  desktop: '/videos/projects/lab2next-desktop.mp4',
  mobile: '/videos/projects/lab2next-mobile.mp4',
  desktopPoster: '/utils/img/projects/lab2next-desktop.jpg',
  mobilePoster: '/utils/img/projects/lab2next-mobile.jpg',
};
