//
// Copyright 2021 DXOS.org
//

import { RegistryRecord, RegistryTypeRecord } from '@dxos/registry-client';

// TODO(burdon): Hack.
export const getRecordTypeString = (record: RegistryRecord, types: RegistryTypeRecord[]): string | undefined => {
  if (RegistryRecord.isDataRecord(record)) {
    const matches = types.filter(({ cid }) => cid.equals(record.type));
    if (matches.length !== 1) {
      return;
    }

    return matches[0].messageName;
  }
};
