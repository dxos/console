//
// Copyright 2021 DXOS.org
//

import { Toolbar } from '@mui/material';
import debug from 'debug';
import React, { useState } from 'react';

import { CID, RegistryTypeRecord } from '@dxos/registry-api';

import {
  IResource,
  RecordsTable,
  RecordTypeSelector
} from '../src';
import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Records'
};

export const TypeSelector = () => {
  const types: RegistryTypeRecord[] = [
    {
      cid: CID.fromB58String('QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR'),
      messageName: 'A'
    } as RegistryTypeRecord,
    {
      cid: CID.fromB58String('QmQgQUbBeMTnH1j3QWwNw9LkXjpWDJrjyGYfZpnPp8x5Lu'),
      messageName: 'B (Long Name)'
    } as RegistryTypeRecord
  ];

  const [type, setType] = useState<CID | undefined>(types[0].cid);

  return (
    <RootContainer config={config}>
      <Toolbar>
        <RecordTypeSelector
          types={types}
          type={type}
          onChange={type => setType(type)}
        />
      </Toolbar>
    </RootContainer>
  );
};

export const Records = () => {
  const records: IResource[] = [
    {
      name: 'dxos/record-1',
      cid: CID.fromB58String('QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR'),
      created: new Date().toISOString(),
      type: '.dxos.App',
      title: 'Record 1'
    },
    {
      name: 'dxos/record-2',
      cid: CID.fromB58String('QmQgQUbBeMTnH1j3QWwNw9LkXjpWDJrjyGYfZpnPp8x5Lu'),
      created: new Date().toISOString(),
      type: '.dxos.App',
      title: 'Record 2'
    }
  ];

  return (
    <RootContainer config={config}>
      <RecordsTable
        records={records}
      />
    </RootContainer>
  );
};
