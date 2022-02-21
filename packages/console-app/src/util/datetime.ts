//
// Copyright 2021 DXOS.org
//

// import assert from 'assert';

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: 24 * 60 * 60 * 1000 * 365 / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
};

export const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const dateDiff = (d1: Date, d2: Date = new Date()) => {
  const elapsed = d1.valueOf() - d2.valueOf();
  if (isNaN(elapsed)) {
    return undefined;
  }

  let unit: keyof typeof units;
  for (unit in units) {
    if (Math.abs(elapsed) > units[unit] || unit === 'second') {
      return { value: Math.round(elapsed / units[unit]), unit };
    }
  }
};

export const getRelativeTimeDelta  = (d1: Date, d2: Date = new Date()) => {
  const diff = dateDiff(d1, d2);
  if (!diff) {
    return undefined;
  }

  const { value, unit } = diff;
  return `${-value} ${unit}`  + (-value > 1 ? 's' : '');
}

export const getRelativeTime = (d1: Date, d2: Date = new Date()) => {
  const diff = dateDiff(d1, d2);
  if (!diff) {
    return undefined;
  }

  const { value, unit } = diff;
  return rtf.format(value, unit);
};

export const sortDateStrings = (v1: string, v2: string) => {
  const d1 = new Date(v1).getTime();
  const d2 = new Date(v2).getTime();

  return d1 < d2 ? 1 : d1 > d2 ? -1 : 0;
};
