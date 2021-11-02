//
// Copyright 2021 DXOS.org
//

import { RegistryRecord, RegistryTypeRecord } from '@dxos/registry-client';

export interface TypeData {
  typeName?: string,
  ipfsCid?: string
}

// TODO(burdon): Hack.
export const getRecordTypeData = (record: RegistryRecord, types: RegistryTypeRecord[]): TypeData => {
  if (RegistryRecord.isDataRecord(record)) {
    const matches = types.filter(({ cid }) => cid.equals(record.type));
    if (matches.length !== 1) {
      return {};
    }

    if (matches[0].messageName.split('.').slice(-1)[0] === 'VladsType2') {
      console.log(matches[0]);
    }

    return {
      typeName: matches[0].messageName.split('.').slice(-1)[0],
      ipfsCid: matches[0].meta.sourceIpfsCid
    };
  }

  return {};
};
