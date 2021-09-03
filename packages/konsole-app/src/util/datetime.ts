//
// Copyright 2021 DXOS.org
//

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365 / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
};

export const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export const getRelativeTime = (d1: Date, d2: Date = new Date()) => {
  const elapsed = d1.valueOf() - d2.valueOf();

  let unit: keyof typeof units;
  for (unit in units) {
    if (Math.abs(elapsed) > units[unit] || unit === 'second') {
      return rtf.format(Math.round(elapsed / units[unit]), unit);
    }
  }
};

export const sortDateStrings = (v1: string, v2: string) => {
  const d1 = new Date(v1).getTime();
  const d2 = new Date(v2).getTime();
  return d1 < d2 ? 1 : d1 > d2 ? -1 : 0;
};
