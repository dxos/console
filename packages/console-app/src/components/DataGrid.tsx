//
// Copyright 2021 DXOS.org
//

import React from 'react';
import { generatePath, useHistory } from 'react-router';

import { styled } from '@mui/material';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

import { CID } from '@dxos/registry-client';

import { paths } from '../paths';

export const truncate = (key: string, head = 8, tail = 8) => {
  return key.slice(0, head) + '...' + key.slice(-tail);
};

export const RecordLink = ({ cid }: { cid: CID }) => {
  const history = useHistory();
  const handleNavigate = (cid: CID) => {
    history.push(generatePath(paths.records, { cid: cid ? cid.toB58String() : undefined }));
  };

  return (
    <div
      className='monospace secondary'
      onClick={() => handleNavigate(cid)}
    >
      {truncate(cid.toB58String())}
    </div>
  );
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
