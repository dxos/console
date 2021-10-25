//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { IPFSTable, Panel } from '../components';

/**
 * Displays the status of the IPFS servers.
 */
export const IPFSPanel = () => {
  return (
    <Panel>
      <IPFSTable />
    </Panel>
  );
};
