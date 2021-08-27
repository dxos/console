//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { makeStyles, IconButton, Link } from '@material-ui/core';
import { DataGrid, GridColDef, GridCellParams } from '@material-ui/data-grid';
import { Launch as LaunchIcon } from '@material-ui/icons';

import { IRecord } from '../hooks';
import { getRelativeTime, sortDateStrings } from '../util';

interface RecordsTableProperties {
  records: IRecord[]
}
const useStyles = makeStyles(theme => ({
  container: {
    flex: 1
  },
  root: {
    '& .mono': {
      fontFamily: 'monospace'
    }
  }
}));

// TODO(burdon): Common fields for all records.
// TODO(burdon): Different record type views may have different column sets.
// TODO(burdon): Upgrade to XGrid to have resizable columns.
//   https://material-ui.com/components/data-grid/#mit-vs-commercial
// https://material-ui.com/components/data-grid/columns
const columns: GridColDef[] = [
  {
    field: 'cid',
    headerName: 'CID',
    width: 120,
    cellClassName: (params: GridCellParams) => 'mono',
    valueFormatter: (params) => {
      return (params.value as string).slice(0, 8) + '...';
    }
  },
  {
    field: 'created',
    headerName: 'Created',
    width: 140,
    valueFormatter: (params) => {
      return getRelativeTime(new Date(params.value as string));
    },
    // https://material-ui.com/components/data-grid/sorting
    sortComparator: (v1, v2) => sortDateStrings(v1 as string, v2 as string)
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 120,
    cellClassName: (params: GridCellParams) => 'mono'
  },
  {
    field: 'name',
    headerName: 'Name',
    minWidth: 300,
    cellClassName: (params: GridCellParams) => 'mono'
  },
  {
    field: 'title',
    headerName: 'Display Name',
    minWidth: 300,
  },
  {
    field: 'url',
    headerName: 'Link',
    width: 120,
    // https://material-ui.com/components/data-grid/style/#styling-cells
    renderCell: (params: GridCellParams) => {
      if (params.value) {
        return (
          <Link target='link' href={params.value as string}>
            <IconButton size='small'>
              <LaunchIcon />
            </IconButton>
          </Link>
        );
      }
    }
  }
];

/**
 * Table that displays all registry records.
 * @constructor
 */
export const RecordTable = ({ records }: RecordsTableProperties) => {
  const classes = useStyles();

  // https://material-ui.com/components/data-grid/#mit-version
  return (
    <div className={classes.container}>
      <DataGrid
        className={classes.root}
        rows={records}
        columns={columns}
        getRowId={({ cid }) => cid}
      />
    </div>
  );
};
