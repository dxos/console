//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { useMemo } from 'react';

import { useResources } from '@dxos/react-registry-client';
import { RegistryRecord, IQuery, Resource } from '@dxos/registry-client';

import { DataGrid, Panel, RecordLink, Toolbar } from '../components';

const columns: GridColDef[] = [
  {
    field: 'id', // TODO(burdon): Rename?
    headerName: 'DXN',
    width: 300,
    cellClassName: 'monospace primary'
  },
  {
    field: 'versions',
    headerName: 'Versions',
    width: 300,
    cellClassName: 'monospace secondary',
    renderCell: ({ value }) => {
      const versions = value as Resource['versions'];
      return Object.keys(versions)
    }
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 300,
    cellClassName: 'monospace secondary',
    renderCell: ({ value }) => {
      const tags = value as Resource['tags'];
      return Object.keys(tags)
    }
  }
];

/**
 * Displays the resources.
 */
export const ResourcesPanel = () => {
  const query = useMemo<IQuery>(() => ({}), []);
  const { resources } = useResources(query);
  console.log({resources})

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={() => {}}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
      <DataGrid
        rows={resources || []}
        columns={columns}
        getRowId={({ id }) => id}
      />
    </Panel>
  );
};
