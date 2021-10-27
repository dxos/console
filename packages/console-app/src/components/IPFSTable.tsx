//
// Copyright 2021 DXOS.org
//

import { Launch } from '@mui/icons-material';
import { Box, IconButton, Link } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import urlJoin from 'proper-url-join';
import React, { useEffect, useState } from 'react';

import { useRecordTypes, useRegistry } from '@dxos/react-registry-client';
import { CID } from '@dxos/registry-client';

import { useConfig } from '../hooks';
import { getRecordTypeString, getRelativeTime, sortDateStrings } from '../util';
import { DataGrid } from './DataGrid';

interface IPFSRow {
  cid: CID,
  type: string,
  created: Date | undefined,
  url: string
}

const ipfsColumns: GridColDef[] = [
  {
    field: 'cid',
    headerName: 'CID',
    cellClassName: 'monospace secondary',
    flex: 2
  },
  {
    field: 'type',
    headerName: 'Type',
    cellClassName: () => 'monospace',
    flex: 1
  },
  {
    field: 'created',
    headerName: 'Created',
    flex: 1,
    valueFormatter: (params) => {
      return params.value && getRelativeTime(new Date(params.value as number));
    },
    // https://mui.com/components/data-grid/sorting
    sortComparator: (v1, v2) => sortDateStrings(v1 as string, v2 as string)
  },
  {
    field: 'url',
    headerName: 'Link',
    width: 120,
    renderCell: ({ value }) => (
      <Link target='link' href={value as string}>
        <IconButton size='small' color='primary'>
          <Launch />
        </IconButton>
      </Link>
    )
  }
];

export const IPFSTable = () => {
  const registry = useRegistry();
  const { recordTypes } = useRecordTypes();
  const config = useConfig();
  const [rows, setRows] = useState<IPFSRow[] | undefined>();

  useEffect(() => {
    void (async () => {
      const records = await registry.getDataRecords();
      setRows(
        records
          .filter(record => record.data.hash)
          .map(record => ({
            cid: record.cid,
            type: getRecordTypeString(record, recordTypes) ?? '',
            created: record.meta.created,
            url: urlJoin(config.services.ipfs.gateway, CID.from(record.data.hash).toString())
          }))
      );
    })();
  }, [registry, recordTypes, config]);

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%'
      }}
    >
      <DataGrid
        rows={rows ?? []}
        columns={ipfsColumns}
        getRowId={({ cid }) => cid.toB58String()}
        disableSelectionOnClick
        hideFooterSelectedRowCount
      />
    </Box>
  );
};
