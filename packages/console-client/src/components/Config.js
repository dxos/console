//
// Copyright 2020 DxOS
//

import React, { useContext } from 'react';

import { JsonTreeView } from '@dxos/react-ux';

import { ConsoleContext } from '../hooks';

const Config = () => {
  const { config } = useContext(ConsoleContext);

  return (
    <JsonTreeView data={config} />
  );
};

export default Config;
