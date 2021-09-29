//
// Copyright 2021 DXOS.org
//

export function safe<T> (f: () => T): T | undefined {
  try {
    return f();
  } catch (err) {
    return undefined;
  }
}
