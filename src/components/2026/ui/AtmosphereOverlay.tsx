// Global atmosphere: two faint static glows + a subtle film grain.
// Fixed, pointer-events:none, no blend modes and no animation — so it never
// forces a full-screen recomposite (that was the source of intermittent jank).
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function AtmosphereOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[30] overflow-hidden">
      <div
        className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--ds-primary-vivid) 10%, transparent) 0%, transparent 60%)',
          filter: 'blur(40px)',
          opacity: 0.5,
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--ds-secondary-container) 18%, transparent) 0%, transparent 60%)',
          filter: 'blur(40px)',
          opacity: 0.5,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: 'repeat', opacity: 0.03 }}
      />
    </div>
  );
}
