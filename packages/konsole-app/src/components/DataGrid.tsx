//
// Copyright 2021 DXOS.org
//

import { styled } from '@mui/material/styles';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

export const DataGrid = styled(MuiDataGrid)(({ theme }) => ({
  '&.MuiDataGrid-root': {
    // TODO(burdon): No effect since body background color (need elevation=1 color).
    backgroundColor: theme.palette.background.paper
  },
  '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
    outline: 'none'
  }
}));
