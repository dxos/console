//
// Copyright 2021 DXOS.org
//

import React from 'react';

import JSONTree from '@dxos/react-json-tree'

import { useChainApi } from '../chain-api-context';
import { useChainQuery } from '../hooks/chain-query';

export default function RecordList () {
  const chainApi = useChainApi();

  console.log('<<<< CHAIN API <<<<', chainApi);

  const [error, records] = useChainQuery(async () => chainApi?.registry.getRecords(), [chainApi]);
  if (error) {
    throw error;
  }

  console.log('>>>>>>>', records);

  return (
    <div>
      
    </div>
  );
}
