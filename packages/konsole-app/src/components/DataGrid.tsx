//
// Copyright 2021 DXOS.org
//

import { styled } from '@mui/material/styles';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

export const truncate = (key: string, head = 8, tail = 8) => {
  return key.slice(0, head) + '...' + key.slice(-tail);
};

export const DataGrid = styled(MuiDataGrid)(({ theme }) => ({
  '&.MuiDataGrid-root': {
    // TODO(burdon): No effect since body background color (need elevation=1 color).
    backgroundColor: theme.palette.background.paper,

    '& .MuiDataGrid-cell': {
      cursor: 'pointer',

      '&:focus': {
        outline: 'none'
      },
      '&.monospace': {
        fontFamily: 'DM Mono, monospace'
      },
      '&.primary': {
        color: theme.palette.primary.main
      },
      '&.secondary': {
        color: theme.palette.secondary.main
      }
    }
  }
}));
