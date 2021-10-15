//
// Copyright 2021 DXOS.org
//

import { Sync as RefreshIcon } from '@mui/icons-material';
import { Box, Collapse, IconButton, Paper } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import urlJoin from 'proper-url-join';
import React, { useMemo } from 'react';
import { generatePath, useHistory, useParams } from 'react-router';

import { useRecords, useRecordTypes, useResources } from '@dxos/react-registry-client';
import { CID, DXN, IQuery, Resource } from '@dxos/registry-client';

import { DataGrid, IRecord, IResourceRecord, Panel, ResourceRecordsTable, Toolbar } from '../components';
import { IConfig, useConfig } from '../hooks';
import { joinRecords } from './RecordsPanel';

/**
 * Joins records with resources.
 */
export const joinResourceRecords = (records: IRecord[], resource: Resource | undefined, config: IConfig): IResourceRecord[] => {
  if (!resource) {
    return [];
  }

  const mapRecords = (field: 'version' | 'tag') => ([versionOrTag, cid]: [string, CID | undefined]) => {
    const record = records.find(record => cid && record.cid.equals(cid));
    if (!record) {
      return undefined;
    }
    const resourceRecord: IResourceRecord = {
      ...record,
      [field]: versionOrTag,

      url: (record.type === '.dxos.type.App')
        ? urlJoin(config.services.app.server, config.services.app.prefix, `${resource.id.toString()}@${versionOrTag}`)
        : undefined
    };
    return resourceRecord;
  };

  const taggedRecords = Object.entries(resource.tags).map(mapRecords('tag'));
  const versionedRecords = Object.entries(resource.versions).map(mapRecords('version'));

  return [
    ...taggedRecords.filter(record => record !== undefined),
    ...versionedRecords.filter(record => record !== undefined)
  ] as IResourceRecord[];
};

const columns: GridColDef[] = [
  {
    field: 'id', // TODO(burdon): Rename?
    headerName: 'DXN',
    width: 700,
    cellClassName: 'monospace primary'
  },
  {
    field: 'versions',
    headerName: 'Versions',
    width: 300,
    cellClassName: 'monospace secondary',
    renderCell: ({ value }) => {
      const versions = value as Resource['versions'];
      return Object.keys(versions).join(', ');
    }
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 300,
    cellClassName: 'monospace secondary',
    renderCell: ({ value }) => {
      const tags = value as Resource['tags'];
      return Object.keys(tags).join(', ');
    }
  }

];

/**
 * Displays the resources.
 */
export const ResourcesPanel = ({ match }: { match?: any }) => {
  const config = useConfig();
  const query = useMemo<IQuery>(() => ({}), []);
  const { resources } = useResources(query);
  const { dxn }: { dxn?: string } = useParams();
  const history = useHistory();
  const selectedResource = resources.find(resource => resource.id.toString() === dxn?.toString());
  const { recordTypes } = useRecordTypes();
  const { records: registryRecords } = useRecords();
  const records = joinRecords(selectedResource ? registryRecords : [], recordTypes, config);
  const resourceRecords = joinResourceRecords(records, selectedResource, config);

  const onSelected = (dxn: DXN) => {
    const next = (dxn.toString() === selectedResource?.id.toString()) ? undefined : dxn;
    history.push(generatePath(match.path, { dxn: next?.toString() }));
  };

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
              resourceRecords={resourceRecords}
            />
          </Paper>
        </Collapse>
    </Panel>
  );
};
