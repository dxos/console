//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { JsonTreeView } from '@dxos/react-components';

import { Panel } from '../components';
import { useConfig } from '../hooks';

/**
 * Displays the config JSON object.
 */
export const ConfigPanel = () => {
  const config = useConfig();

  return (
    <Panel scroll>
      <JsonTreeView data={config.values} />
    </Panel>
  );
};
