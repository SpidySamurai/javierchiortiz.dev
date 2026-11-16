const MONTH_IDX: Record<string, number> = {
  // English
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  // Spanish (shared names such as Feb, Mar, May, Jun, Jul, Sep, Oct, Nov are listed above)
  ene: 0, abr: 3, ago: 7, dic: 11,
};

/** "Jul 2026 - Present" -> "5 mo". Returns null when the dates carry no months (e.g. "2017 - 2022"). */
export function parseDuration(dateStr: string, yrLabel: string, moLabel: string): string | null {
  const [startPart, endPart] = dateStr.split(' - ');
  const parse = (s?: string) => {
    const [mon = '', yr = ''] = (s ?? '').trim().split(' ');
    const m = MONTH_IDX[mon.toLowerCase()];
    const y = parseInt(yr);
    return m === undefined || Number.isNaN(y) ? null : { m, y };
  };
  const start = parse(startPart);
  const now = new Date();
  const endTrimmed = endPart?.trim();
  const end =
    endTrimmed === 'Present' || endTrimmed === 'Presente'
      ? { m: now.getMonth(), y: now.getFullYear() }
      : parse(endPart);
  if (!start || !end) return null;
  const total = (end.y - start.y) * 12 + (end.m - start.m) + 1;
  const yr = Math.floor(total / 12);
  const mo = total % 12;
  if (yr > 0 && mo > 0) return `${yr} ${yrLabel} ${mo} ${moLabel}`;
  if (yr > 0) return `${yr} ${yrLabel}`;
  return `${mo} ${moLabel}`;
}
