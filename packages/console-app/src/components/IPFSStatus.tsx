//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { JsonTreeView } from '@dxos/react-components';

import { useIFPSStatus } from '../hooks';

export const IPFSStatus = () => {
  const status = useIFPSStatus();

  return (
    <JsonTreeView data={status} />
  );
};
