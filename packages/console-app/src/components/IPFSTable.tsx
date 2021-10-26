//
// Copyright 2021 DXOS.org
//

import { Launch } from '@mui/icons-material';
import { Box, IconButton, Link } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import assert from 'assert';
import urlJoin from 'proper-url-join';
import React, { useEffect, useState } from 'react';

import { useRegistry } from '@dxos/react-registry-client';
import { CID, DXN } from '@dxos/registry-client';

import { useConfig } from '../hooks';
import { DataGrid } from './DataGrid';

interface Hashable {
  hash?: Uint8Array;
}

interface IPFSRow {
  cid: CID,
  url: string
}

const ipfsColumns: GridColDef[] = [
  {
    field: 'cid',
    headerName: 'CID',
    cellClassName: 'monospace secondary',
    flex: 1
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
  const config = useConfig();
  const [rows, setRows] = useState<IPFSRow[] | undefined>();

  useEffect(() => {
    void (async () => {
      const appType = await registry.getResourceRecord(DXN.parse('dxos:type.app'), 'latest');
      assert(appType, 'Resource not found: dxos:type.app');
      const apps = await registry.getDataRecords<Hashable>({ type: appType.record.cid });
      const botType = await registry.getResourceRecord(DXN.parse('dxos:type.bot'), 'latest');
      assert(botType, 'Resource not found: dxos:type.bot');
      const bots = await registry.getDataRecords<Hashable>({ type: botType.record.cid });
      setRows(
        [...apps, ...bots]
          .filter(app => app.data.hash)
          .map(app => ({
            cid: app.cid,
            url: urlJoin(config.services.ipfs.gateway, CID.from(app.data.hash!).toString())
          }))
      );
    })();
  }, [registry, config]);

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
