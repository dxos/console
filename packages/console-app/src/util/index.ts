//
// Copyright 2021 DXOS.org
//

export * from './datetime';
export * from './record-type-string';

export function safe<T> (f: () => T): T | undefined {
  try {
    return f();
  } catch (err) {
    return undefined;
  }
}
