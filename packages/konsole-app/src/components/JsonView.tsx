//
// Copyright 2021 DXOS.org
//

import { Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import ReactJsonView from 'react-json-view';

/**
 * Displays the config JSON object.
 */
export const JsonView = ({ data }: { data: any }) => {
  const theme = useTheme();

  // https://www.npmjs.com/package/react-json-view
  return (
    <Paper
      sx={{
        display: 'flex',
        flex: 1,
        overflow: 'scroll',
        padding: 1
      }}
    >
      <ReactJsonView
        src={data}
        theme={theme.palette.mode === 'dark' ? 'tomorrow' : 'rjv-default'}
        iconStyle='circle'
        displayDataTypes={false}
        displayObjectSize={false}
        quotesOnKeys={false}
        sortKeys={true}
      />
    </Paper>
  );
};
