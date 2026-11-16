import type { CompanyLogo } from '@/data/companies';

/** A single-tone logo painted with the current text color, so it follows hover and theme. */
export function LogoMark({ logo, scale = 1 }: { logo: CompanyLogo; scale?: number }) {
  return (
    <span
      aria-hidden
      className="block shrink-0"
      style={{
        width: logo.width * scale,
        height: logo.height * scale,
        backgroundColor: 'currentColor',
        WebkitMask: `url(${logo.src}) center / contain no-repeat`,
        mask: `url(${logo.src}) center / contain no-repeat`,
      }}
    />
  );
}
