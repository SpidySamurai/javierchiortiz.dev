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
  /** Official site, opened in a new tab. */
  url: string;
  logo?: CompanyLogo;
  /** Full-color brand mark, for places that show the brand as is instead of a single-tone mask. */
  colorLogo?: CompanyLogo;
}

const LOGOS = '/utils/img/companies';

/** Javier's own agency; also credited in the footer. */
export const VEZMEX: Company = {
  name: 'VezMex',
  url: 'https://vezmex.dev/',
  logo: { src: `${LOGOS}/vezmex.svg`, width: 57, height: 28 },
  colorLogo: { src: `${LOGOS}/vezmex-color.svg`, width: 36, height: 18 },
};

export const COMPANIES: readonly Company[] = [
  { name: 'BRANIA', url: 'https://www.brania.ai/', logo: { src: `${LOGOS}/brania.png`, width: 26.5, height: 30 } },
  { name: 'ENTI', url: 'https://en-ti.com/', logo: { src: `${LOGOS}/enti.png`, width: 30, height: 30 } },
  { name: 'Softtek', url: 'https://www.softtek.com/', logo: { src: `${LOGOS}/softtek.svg`, width: 28, height: 28 } },
  { name: 'Scandia Manufacturing', url: 'https://scandiamfg.com/', logo: { src: `${LOGOS}/scandia.png`, width: 11.5, height: 40 } },
  { name: 'Saunas.com', url: 'https://www.saunas.com/', logo: { src: `${LOGOS}/saunas.png`, width: 15, height: 32 } },
  { name: 'Sun Valley Salt', url: 'https://sunvalleysalt.com/', logo: { src: `${LOGOS}/sunvalley.png`, width: 29, height: 24 } },
  VEZMEX,
];
