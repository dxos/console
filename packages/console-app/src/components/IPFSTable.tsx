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
import { getRecordTypeData, getRelativeTime, sortDateStrings } from '../util';
import { DataGrid } from './DataGrid';

interface IPFSRow {
  cid: CID,
  type: string,
  created: Date | undefined,
  typeDefUrl: string | undefined,
  url: string
}

const ipfsExplorerCid = 'QmYa2djLQy7suESyEJ33s4iUJA7ZU22cUB6A7o8p1C5oSZ';

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
    field: 'typeDefUrl',
    headerName: 'IPFS type defintion link',
    flex: 1,
    renderCell: ({ value }) => value && (
      <Link target='link' href={value as string}>
        <IconButton size='small' color='primary'>
          <Launch />
        </IconButton>
      </Link>
    )
  },
  {
    field: 'url',
    headerName: 'IPFS link',
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

  const ipfsExplorerUrl = (cid: string) => urlJoin(
    'https://test.kube.dxos.network/ipfs', // for now we hardcode KUBE URL as the test.kube is the only one with IPFS explorer
    ipfsExplorerCid,
    '#',
    'ipfs',
    cid
  );

  useEffect(() => {
    void (async () => {
      const records = await registry.getDataRecords();
      setRows(
        records
          .filter(record => record.data.hash)
          .map(record => {
            const { typeName, ipfsCid } = getRecordTypeData(record, recordTypes);
            if (typeName === 'VladsType2') {
              console.log({ record, ipfsCid });
            }
            let hash: string | undefined;
            try {
              hash = CID.from(record.data.hash).toString();
            } catch (err) {
              console.error(err);
            }
            return {
              cid: record.cid,
              type: typeName ?? '',
              created: record.meta.created,
              typeDefUrl: ipfsCid && ipfsExplorerUrl(ipfsCid),
              url: ipfsExplorerUrl(hash ?? '')
            };
          })
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
