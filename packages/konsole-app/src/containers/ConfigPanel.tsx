//
// Copyright 2021 DXOS.org
//

import React from 'react';

// import { JsonTreeView } from '@dxos/react-ux';

import { useConfig } from '../hooks';

/**
 * Displays the config JSON object.
 */
export const ConfigPanel = () => {
  const config = useConfig();

  return (
    <pre>
      {JSON.stringify(config)}
    </pre>
  );
};
// <JsonTreeView data={config} />
