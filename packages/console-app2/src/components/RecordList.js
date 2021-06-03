//
// Copyright 2021 DXOS.org
//

import React from 'react';

import JSONTree from '@dxos/react-json-tree'

import { useChainApi } from '../hooks/chain-api';
import { useChainQuery } from '../hooks/chain-query';

function RecordList () {
  const chainApi = useChainApi();
  const [error, records] = useChainQuery(async () => chainApi?.registry.getRecords(), [chainApi]);

  if (error) {
    throw error;
  }

  return (
    <div>
      {(records ?? []).map(record => <JSONTree key={record.cid.toString()} data={record} />)}
    </div>
  );
}

export default RecordList;
