//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import urlJoin from 'proper-url-join';
import React, { useEffect, useState } from 'react';

import { Launch as LaunchIcon, Sync as RefreshIcon } from '@mui/icons-material';
import { IconButton, Link } from '@mui/material';
import { Box } from '@mui/system';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';

import { useRegistry } from '@dxos/react-registry-client';
import { DXN, RegistryRecord } from '@dxos/registry-client';

import { useConfig } from '../hooks';
import { DataGrid, Panel, Toolbar } from '../components';
import { getRelativeTime } from '../util';

interface TableEntry {
  id: string
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Id',
    width: 400,
    cellClassName: 'monospace secondary'
  },
  {
    field: 'created',
    headerName: 'Published',
    minWidth: 120,
    valueFormatter: (params) => {
      return params.value && getRelativeTime(new Date(params.value as number));
    }
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 180
  },
  {
    field: 'url',
    headerName: 'Link',
    width: 120,
    sortable: false,
    // https://mui.com/components/data-grid/style/#styling-cells
    renderCell: (params: GridCellParams) => {
      if (params.value) {
        return (
          <Link target='link' href={params.value as string}>
            <IconButton size='small' color='primary'>
              <LaunchIcon />
            </IconButton>
          </Link>
        );
      }
    }
  }
];

/**
 * Displays list of apps.
 */
export const AppsPanel = () => {
  const registry = useRegistry();
  const config = useConfig();

  const [data, setData] = useState<TableEntry[]>([]);

  const refresh = async () => {
    const appType = await registry.getResourceRecord(DXN.parse('dxos:type.app'), 'latest');
    assert(appType, 'Resource not found: dxos:type.app');
    const resources = await registry.queryResources({ type: appType.record.cid });

    const entries = await Promise.all(resources.map(async resource => {
      const cid = resource.tags.latest ?? resource.tags[Object.keys(resource.tags)[0]];
      const record = await registry.getRecord(cid!);
      assert(record && RegistryRecord.isDataRecord(record));

      return {
        id: resource.id.toString(),
        created: record?.meta.created?.getTime(),
        description: record?.meta.description,
        url: urlJoin(config.get('runtime.services.app.server'), config.get('runtime.services.app.prefix'), resource.id.toString())
      };
    }));

    setData(entries);
  };

  useEffect(() => {
    setImmediate(refresh);
  }, []);

  return (
    <Panel
      toolbar={(
        <Toolbar>
          <Box sx={{ flex: 1 }} />
          <IconButton
            size='small'
            aria-label='refresh'
            onClick={refresh}
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      )}
    >
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={row => row.id}
      />
    </Panel>
  );
};
