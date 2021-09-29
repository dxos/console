//
// Copyright 2021 DXOS.org
//

import { useTheme } from '@mui/material/styles';
import React from 'react';
import ReactJsonView from 'react-json-view';

/**
 * Displays the config JSON object.
 */
export const JsonView = ({ data }: { data: any }) => {
  const theme = useTheme();

  // TODO(burdon): Replace with class that allows custom rendering (e.g., CID, links, etc.)
  // https://www.npmjs.com/package/react-json-view
  return (
    <ReactJsonView
      src={data}
      theme={theme.palette.mode === 'dark' ? 'tomorrow' : 'rjv-default'}
      iconStyle='circle'
      displayDataTypes={false}
      displayObjectSize={false}
      quotesOnKeys={false}
      sortKeys={true}
      // collapsed={1}
    />
  );
};
