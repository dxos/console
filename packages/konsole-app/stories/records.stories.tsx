//
// Copyright 2021 DXOS.org
//

import debug from 'debug';
import React, { useState } from 'react';

import { Toolbar } from '@mui/material';

import { CID } from '@dxos/registry-api';

import {
  IRecord,
  IRecordType,
  RecordTable,
  RecordTypeSelector
} from '../src';

import { config, RootContainer } from './config';

debug.enable('dxos:console:*');

export default {
  title: 'Records'
};

export const TypeSelector = () => {
  const types: IRecordType[] = [
    {
      type: CID.fromB58String('QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR'),
      label: 'A'
    },
    {
      type: CID.fromB58String('QmQgQUbBeMTnH1j3QWwNw9LkXjpWDJrjyGYfZpnPp8x5Lu'),
      label: 'B'
    }
  ];

  const [type, setType] = useState<CID | undefined>(types[0].type);

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
  const records: IRecord[] = [
    {
      cid: 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR',
      created: new Date().toISOString(),
      name: 'dxos/record-1',
      type: '', // TODO(burdon): ???
      title: 'Record 1'
    },
    {
      cid: 'QmQgQUbBeMTnH1j3QWwNw9LkXjpWDJrjyGYfZpnPp8x5Lu',
      created: new Date().toISOString(),
      name: 'dxos/record-2',
      type: '', // TODO(burdon): ???
      title: 'Record 2'
    },
  ];

  return (
    <RootContainer config={config}>
      <RecordTable
        records={records}
      />
    </RootContainer>
  );
};
