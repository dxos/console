//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, IconButton, Link } from '@mui/material';
import { Collapse, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import React, { useMemo } from 'react';

import { useRecords, useRecordTypes, useResources } from '@dxos/react-registry-client';
import { RegistryRecord, IQuery, Resource, DXN } from '@dxos/registry-client';

import { DataGrid, Panel, RecordLink, Toolbar, JsonView, RecordsTable, ResourceRecordsTable } from '../components';
import { generatePath, useHistory, useParams } from 'react-router';
import { useConfig } from '../hooks';
import { joinRecords } from './RecordsPanel';

const columns = (onSelected: (dxn: DXN) => void): GridColDef[] => ([
  {
    field: 'id', // TODO(burdon): Rename?
    headerName: 'DXN',
    width: 300,
    cellClassName: 'monospace primary',
    renderCell: ({value}) => {
      const dxn = value as Resource['id']
      return dxn.toString()
      // return (
      //   <div onClick={() => onSelected(dxn)}>{dxn.toString()}</div>
      // );
    }
  },
  {
    field: 'versions',
    headerName: 'Versions',
    width: 300,
    cellClassName: 'monospace secondary',
    renderCell: ({ value }) => {
      const versions = value as Resource['versions'];
      return Object.keys(versions).join(', ')
    }
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 300,
    cellClassName: 'monospace secondary',
    renderCell: ({ value }) => {
      const tags = value as Resource['tags'];
      return Object.keys(tags).join(', ')
    }
  }
]);

/**
 * Displays the resources.
 */
 export const ResourcesPanel = ({ match }: { match?: any }) => {
  const config = useConfig();
  const query = useMemo<IQuery>(() => ({}), []);
  const { resources } = useResources(query);
  const { dxn }: { dxn?: string } = useParams();
  const history = useHistory();
  const selectedResource = resources.find(resource => resource.id.toString() === dxn?.toString())
  const { recordTypes } = useRecordTypes();
  const {records: registryRecords} = useRecords();
  const records = joinRecords(selectedResource ? registryRecords : [], recordTypes, config);

  const onSelected = (dxn: DXN) => {
    const next = (dxn.toString() === selectedResource?.id.toString()) ? undefined : dxn;
    history.push(generatePath(match.path, { dxn: next?.toString() }))
  }

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
        columns={columns(onSelected)}
        getRowId={({ id }) => id.toString()}
        selectionModel={selectedResource ? [selectedResource?.id.toString()] : []}
        onRowClick={({ id }) => onSelected(id as unknown as DXN)}
        disableSelectionOnClick
        hideFooterSelectedRowCount
      />
      <Collapse in={selectedResource !== undefined} timeout='auto' unmountOnExit>
          <Paper
            sx={{
              marginTop: 1,
              height: 304,
              overflow: 'hidden',
              padding: 1
            }}
          >
            <ResourceRecordsTable
              records={records}
              // selected={selected}
              // onSelect={handleSelect}
            />
          </Paper>
        </Collapse>
    </Panel>
  );
};
