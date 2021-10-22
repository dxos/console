//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { JsonView, Panel } from '../components';
import { useConfig } from '../hooks';

/**
 * Displays the config JSON object.
 */
export const ConfigPanel = () => {
  const config = useConfig();

  // TODO(burdon): Re-implement JsonTreeView.
  return (
    <Panel scroll>
      <JsonView data={config} />
    </Panel>
  );
};
