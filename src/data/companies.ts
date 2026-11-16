/**
 * Companies shown in the band under "Why work with me": the ones Javier worked at and with.
 * A logo is a single-tone mask (PNG alpha or SVG) painted with the text color; without one,
 * the band shows the name only.
 */
export interface CompanyLogo {
  src: string;
  /** Rendered size in px, tuned per mark so they read at the same optical weight. */
  width: number;
  height: number;
}

export interface Company {
  name: string;
  logo?: CompanyLogo;
}

const LOGOS = '/utils/img/companies';

export const COMPANIES: readonly Company[] = [
  { name: 'BRANIA', logo: { src: `${LOGOS}/brania.png`, width: 26.5, height: 30 } },
  { name: 'ENTI', logo: { src: `${LOGOS}/enti.png`, width: 30, height: 30 } },
  { name: 'Softtek', logo: { src: `${LOGOS}/softtek.svg`, width: 28, height: 28 } },
  { name: 'Scandia Manufacturing', logo: { src: `${LOGOS}/scandia.png`, width: 11.5, height: 40 } },
  { name: 'Saunas.com', logo: { src: `${LOGOS}/saunas.png`, width: 15, height: 32 } },
  { name: 'Sun Valley Salt', logo: { src: `${LOGOS}/sunvalley.png`, width: 29, height: 24 } },
  { name: 'IOTAM' },
  { name: 'VezMex', logo: { src: `${LOGOS}/vezmex.svg`, width: 57, height: 28 } },
];
